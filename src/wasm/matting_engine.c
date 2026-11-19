// Native C WebAssembly Matting & Foreground Color Estimation Engine for HelpMyIMG
// Compiled with: clang --target=wasm32 -O3 -nostdlib -> src/assets/matting_engine.wasm
// Implements:
//  1. Bicubic (Catmull-Rom) float32 probability upsampling
//  2. Grid Connected-Components alpha island & pinhole cleaning
//  3. He et al. Full 3x3 RGB Color Fast Guided Filter (O(N) box sums)
//  4. van Herk O(N) Morphological Erode/Dilate & Adaptive Trimap Generation
//  5. Trimap-gated ViTMatte crop alpha fusion
//  6. Photoroom / Forte & Pitie 2-Pass Blur-Fusion Foreground Color Estimator

typedef unsigned char uint8_t;
typedef int int32_t;
typedef unsigned int uint32_t;

extern unsigned char __heap_base;
static uint32_t heap_ptr = 0;

// Minimal freestanding memory primitives to prevent libc import symbols
void* memcpy(void* dst, const void* src, unsigned long n) {
    uint8_t* d = (uint8_t*)dst;
    const uint8_t* s = (const uint8_t*)src;
    for (unsigned long i = 0; i < n; i++) d[i] = s[i];
    return dst;
}

void* memset(void* dst, int c, unsigned long n) {
    uint8_t* d = (uint8_t*)dst;
    uint8_t v = (uint8_t)c;
    for (unsigned long i = 0; i < n; i++) d[i] = v;
    return dst;
}

__attribute__((visibility("default")))
void reset_heap(void) {
    heap_ptr = (uint32_t)(&__heap_base);
}

__attribute__((visibility("default")))
uint32_t get_heap_top(void) {
    if (heap_ptr == 0) heap_ptr = (uint32_t)(&__heap_base);
    return heap_ptr;
}

__attribute__((visibility("default")))
uint32_t alloc_bytes(uint32_t bytes) {
    if (heap_ptr == 0) heap_ptr = (uint32_t)(&__heap_base);
    uint32_t aligned = (bytes + 15u) & ~15u;
    uint32_t ptr = heap_ptr;
    uint32_t needed = ptr + aligned;
    uint32_t cur_bytes = __builtin_wasm_memory_size(0) << 16;
    if (needed > cur_bytes) {
        uint32_t pages = ((needed - cur_bytes) + 65535u) >> 16;
        if (__builtin_wasm_memory_grow(0, pages) == -1) return 0;
    }
    heap_ptr = needed;
    return ptr;
}

static inline float clamp01(float x) {
    return x < 0.0f ? 0.0f : (x > 1.0f ? 1.0f : x);
}

static inline int clamp_i(int v, int lo, int hi) {
    return v < lo ? lo : (v > hi ? hi : v);
}

// Fast accurate expf approximation for sigmoid (-88..88)
static inline float fast_expf(float x) {
    if (x < -40.0f) return 0.0f;
    if (x > 40.0f) x = 40.0f;
    // Standard range reduction exp(x) = 2^k * exp(r)
    const float LOG2E = 1.4426950408889634f;
    const float LN2_HI = 0.693145751953125f;
    const float LN2_LO = 1.4286068203094172e-6f;
    float kf = (float)((int)(x * LOG2E + (x >= 0.0f ? 0.5f : -0.5f)));
    int k = (int)kf;
    float r = (x - kf * LN2_HI) - kf * LN2_LO;
    float r2 = r * r;
    float poly = 1.0f + r + r2 * (0.5f + r * (0.16666667f + r * (0.04166667f + r * 0.00833333f)));
    // Multiply by 2^k via IEEE 754 float bits
    uint32_t pow2k = (uint32_t)(k + 127) << 23;
    union { uint32_t u; float f; } u2k;
    u2k.u = pow2k;
    return poly * u2k.f;
}

// ---------------------------------------------------------------------------
// 1. Apply sigmoid if raw tensor holds logits, else clamp [0, 1]
// ---------------------------------------------------------------------------
__attribute__((visibility("default")))
void apply_sigmoid_if_logits(float* buf, int n) {
    int has_logits = 0;
    for (int i = 0; i < n; i++) {
        float v = buf[i];
        if (v < -1e-4f || v > 1.0001f) {
            has_logits = 1;
            break;
        }
    }
    if (has_logits) {
        for (int i = 0; i < n; i++) {
            float x = buf[i];
            if (x >= 0.0f) {
                float e = fast_expf(-x);
                buf[i] = 1.0f / (1.0f + e);
            } else {
                float e = fast_expf(x);
                buf[i] = e / (1.0f + e);
            }
        }
    } else {
        for (int i = 0; i < n; i++) {
            buf[i] = clamp01(buf[i]);
        }
    }
}

// ---------------------------------------------------------------------------
// 2. Catmull-Rom Bicubic Upsampling in float32 (sharp, non-blocky)
// ---------------------------------------------------------------------------
static inline float cubic_catmull_rom(float x) {
    float ax = x < 0.0f ? -x : x;
    if (ax <= 1.0f) {
        return (1.5f * ax - 2.5f) * ax * ax + 1.0f;
    } else if (ax < 2.0f) {
        return ((-0.5f * ax + 2.5f) * ax - 4.0f) * ax + 2.0f;
    }
    return 0.0f;
}

__attribute__((visibility("default")))
void bicubic_upsample_f32(const float* src, int sw, int sh, float* dst, int dw, int dh) {
    if (sw == dw && sh == dh) {
        for (int i = 0; i < sw * sh; i++) dst[i] = clamp01(src[i]);
        return;
    }
    float sx_scale = (float)sw / (float)dw;
    float sy_scale = (float)sh / (float)dh;

    for (int y = 0; y < dh; y++) {
        float gy = (y + 0.5f) * sy_scale - 0.5f;
        int iy = (int)gy;
        if (gy < 0.0f && gy != (float)iy) iy -= 1;
        float fy = gy - (float)iy;

        float wy[4];
        int ys[4];
        for (int j = -1; j <= 2; j++) {
            wy[j + 1] = cubic_catmull_rom((float)j - fy);
            ys[j + 1] = clamp_i(iy + j, 0, sh - 1);
        }

        for (int x = 0; x < dw; x++) {
            float gx = (x + 0.5f) * sx_scale - 0.5f;
            int ix = (int)gx;
            if (gx < 0.0f && gx != (float)ix) ix -= 1;
            float fx = gx - (float)ix;

            float wx0 = cubic_catmull_rom(-1.0f - fx);
            float wx1 = cubic_catmull_rom(0.0f - fx);
            float wx2 = cubic_catmull_rom(1.0f - fx);
            float wx3 = cubic_catmull_rom(2.0f - fx);

            int x0 = clamp_i(ix - 1, 0, sw - 1);
            int x1 = clamp_i(ix, 0, sw - 1);
            int x2 = clamp_i(ix + 1, 0, sw - 1);
            int x3 = clamp_i(ix + 2, 0, sw - 1);

            float sum = 0.0f;
            for (int r = 0; r < 4; r++) {
                const float* row = src + ys[r] * sw;
                float row_val = row[x0] * wx0 + row[x1] * wx1 + row[x2] * wx2 + row[x3] * wx3;
                sum += row_val * wy[r];
            }
            dst[y * dw + x] = clamp01(sum);
        }
    }
}

// ---------------------------------------------------------------------------
// 3. O(N) Separable Box Mean Filter (clamp edge replication, constant-time)
// ---------------------------------------------------------------------------
static void box_mean_f32(const float* src, float* dst, float* tmp, int w, int h, int radius) {
    if (radius <= 0) {
        for (int i = 0; i < w * h; i++) dst[i] = src[i];
        return;
    }
    int dia = 2 * radius + 1;
    float inv_d = 1.0f / (float)dia;

    // Horizontal pass: src -> tmp
    for (int y = 0; y < h; y++) {
        const float* row = src + y * w;
        float* out = tmp + y * w;
        float sum = row[0] * (float)(radius + 1);
        for (int k = 1; k <= radius; k++) {
            sum += row[k < w ? k : w - 1];
        }
        for (int x = 0; x < w; x++) {
            out[x] = sum * inv_d;
            int add_x = x + radius + 1;
            int rem_x = x - radius;
            float add_v = row[add_x < w ? add_x : w - 1];
            float rem_v = row[rem_x >= 0 ? rem_x : 0];
            sum += (add_v - rem_v);
        }
    }

    // Vertical pass: tmp -> dst
    // Using row-wise accumulation to stay cache-friendly
    for (int x = 0; x < w; x++) {
        float sum = tmp[x] * (float)(radius + 1);
        for (int k = 1; k <= radius; k++) {
            int ky = k < h ? k : h - 1;
            sum += tmp[ky * w + x];
        }
        for (int y = 0; y < h; y++) {
            dst[y * w + x] = sum * inv_d;
            int add_y = y + radius + 1;
            int rem_y = y - radius;
            float add_v = tmp[(add_y < h ? add_y : h - 1) * w + x];
            float rem_v = tmp[(rem_y >= 0 ? rem_y : 0) * w + x];
            sum += (add_v - rem_v);
        }
    }
}

// ---------------------------------------------------------------------------
// 4. Fast O(N) Separable Sliding Min / Max Filter (Morphological Erode/Dilate)
// ---------------------------------------------------------------------------
// Uses monotonic deque per row/col -> exact O(N), any radius!
// scratch_tmp must hold w * h floats; deque_idx & deque_val hold max(w, h).
static void morph_filter_f32(
    const float* src,
    float* dst,
    float* tmp,
    int* dq_idx,
    float* dq_val,
    int w,
    int h,
    int radius,
    int is_dilate
) {
    if (radius <= 0) {
        for (int i = 0; i < w * h; i++) dst[i] = src[i];
        return;
    }

    // Horizontal pass: src -> tmp
    for (int y = 0; y < h; y++) {
        const float* row = src + y * w;
        float* out = tmp + y * w;
        int head = 0, tail = 0;

        // Preload [0 .. min(radius, w-1)]
        int init_end = radius < w - 1 ? radius : w - 1;
        for (int x = 0; x <= init_end; x++) {
            float v = row[x];
            if (is_dilate) {
                while (tail > head && dq_val[tail - 1] <= v) tail--;
            } else {
                while (tail > head && dq_val[tail - 1] >= v) tail--;
            }
            dq_idx[tail] = x;
            dq_val[tail] = v;
            tail++;
        }

        for (int x = 0; x < w; x++) {
            int in_x = x + radius;
            if (in_x > init_end && in_x < w) {
                float v = row[in_x];
                if (is_dilate) {
                    while (tail > head && dq_val[tail - 1] <= v) tail--;
                } else {
                    while (tail > head && dq_val[tail - 1] >= v) tail--;
                }
                dq_idx[tail] = in_x;
                dq_val[tail] = v;
                tail++;
            }
            int win_left = x - radius;
            while (head < tail && dq_idx[head] < win_left) head++;
            out[x] = dq_val[head];
        }
    }

    // Vertical pass: tmp -> dst
    for (int x = 0; x < w; x++) {
        int head = 0, tail = 0;
        int init_end = radius < h - 1 ? radius : h - 1;
        for (int y = 0; y <= init_end; y++) {
            float v = tmp[y * w + x];
            if (is_dilate) {
                while (tail > head && dq_val[tail - 1] <= v) tail--;
            } else {
                while (tail > head && dq_val[tail - 1] >= v) tail--;
            }
            dq_idx[tail] = y;
            dq_val[tail] = v;
            tail++;
        }

        for (int y = 0; y < h; y++) {
            int in_y = y + radius;
            if (in_y > init_end && in_y < h) {
                float v = tmp[in_y * w + x];
                if (is_dilate) {
                    while (tail > head && dq_val[tail - 1] <= v) tail--;
                } else {
                    while (tail > head && dq_val[tail - 1] >= v) tail--;
                }
                dq_idx[tail] = in_y;
                dq_val[tail] = v;
                tail++;
            }
            int win_top = y - radius;
            while (head < tail && dq_idx[head] < win_top) head++;
            dst[y * w + x] = dq_val[head];
        }
    }
}

// ---------------------------------------------------------------------------
// 5. Grid Connected-Components Cleaner (strips stray floating confetti)
// ---------------------------------------------------------------------------
__attribute__((visibility("default")))
void clean_islands_f32(float* alpha, int w, int h) {
    int max_dim = w > h ? w : h;
    int gw = max_dim > 320 ? (w * 320) / max_dim : w;
    int gh = max_dim > 320 ? (h * 320) / max_dim : h;
    if (gw < 16) gw = w < 16 ? w : 16;
    if (gh < 16) gh = h < 16 ? h : 16;
    int gn = gw * gh;

    uint32_t saved_heap = get_heap_top();
    float* grid = (float*)alloc_bytes((uint32_t)gn * 4u);
    int32_t* labels = (int32_t*)alloc_bytes((uint32_t)gn * 4u);
    int32_t* queue = (int32_t*)alloc_bytes((uint32_t)gn * 4u);
    int32_t* comp_areas = (int32_t*)alloc_bytes((uint32_t)gn * 4u);
    float* comp_max = (float*)alloc_bytes((uint32_t)gn * 4u);
    if (!grid || !labels || !queue || !comp_areas || !comp_max) {
        heap_ptr = saved_heap;
        return;
    }

    // Max-pool downsample into grid so thin hair strands don't disappear on grid
    for (int gy = 0; gy < gh; gy++) {
        int y0 = (gy * h) / gh;
        int y1 = ((gy + 1) * h) / gh;
        if (y1 <= y0) y1 = y0 + 1;
        for (int gx = 0; gx < gw; gx++) {
            int x0 = (gx * w) / gw;
            int x1 = ((gx + 1) * w) / gw;
            if (x1 <= x0) x1 = x0 + 1;
            float mv = 0.0f;
            for (int y = y0; y < y1; y++) {
                const float* row = alpha + y * w;
                for (int x = x0; x < x1; x++) {
                    if (row[x] > mv) mv = row[x];
                }
            }
            grid[gy * gw + gx] = mv;
            labels[gy * gw + gx] = -1;
        }
    }

    int num_comps = 0;
    int max_area = 0;

    for (int i = 0; i < gn; i++) {
        if (grid[i] < 0.06f || labels[i] != -1) continue;
        int comp_id = num_comps++;
        int head = 0, tail = 0;
        queue[tail++] = i;
        labels[i] = comp_id;
        int area = 0;
        float peak = 0.0f;

        while (head < tail) {
            int cur = queue[head++];
            area++;
            if (grid[cur] > peak) peak = grid[cur];
            int cx = cur % gw;
            int cy = cur / gw;

            // 8-connectivity
            for (int dy = -1; dy <= 1; dy++) {
                int ny = cy + dy;
                if (ny < 0 || ny >= gh) continue;
                for (int dx = -1; dx <= 1; dx++) {
                    if (dx == 0 && dy == 0) continue;
                    int nx = cx + dx;
                    if (nx < 0 || nx >= gw) continue;
                    int ni = ny * gw + nx;
                    if (labels[ni] == -1 && grid[ni] >= 0.06f) {
                        labels[ni] = comp_id;
                        queue[tail++] = ni;
                    }
                }
            }
        }
        comp_areas[comp_id] = area;
        comp_max[comp_id] = peak;
        if (area > max_area) max_area = area;
    }

    if (max_area > 0 && num_comps > 1) {
        // Mark tiny weak disconnected confetti for removal
        // Preserve large objects (>= 2.5% of main subject) OR very high confidence secondary objects (>= 0.96 peak and >= 0.35% area)
        float tiny_thresh = (float)max_area * 0.004f;
        if (tiny_thresh < 4.0f) tiny_thresh = 4.0f;
        float mid_thresh = (float)max_area * 0.025f;

        for (int i = 0; i < gn; i++) {
            int cid = labels[i];
            if (cid >= 0) {
                float a = (float)comp_areas[cid];
                float pk = comp_max[cid];
                if (a < tiny_thresh || (a < mid_thresh && pk < 0.92f)) {
                    labels[i] = -2; // mark drop
                }
            }
        }

        // Apply dropped labels back to full-res alpha
        for (int y = 0; y < h; y++) {
            int gy = (y * gh) / h;
            if (gy >= gh) gy = gh - 1;
            float* row = alpha + y * w;
            const int32_t* lrow = labels + gy * gw;
            for (int x = 0; x < w; x++) {
                int gx = (x * gw) / w;
                if (gx >= gw) gx = gw - 1;
                if (lrow[gx] == -2) row[x] = 0.0f;
            }
        }
    }

    heap_ptr = saved_heap;
}

// ---------------------------------------------------------------------------
// 6. He et al. Full 3x3 RGB Color Fast Guided Filter + Edge-Band Blending
// ---------------------------------------------------------------------------
__attribute__((visibility("default")))
void fast_guided_filter_rgb(
    const uint8_t* rgba,
    float* alpha,
    int w,
    int h,
    int full_radius,
    float eps,
    float blend_strength
) {
    if (w < 8 || h < 8) return;
    int max_dim = w > h ? w : h;
    int stride = max_dim > 1600 ? 3 : (max_dim > 850 ? 2 : 1);
    int sw = (w + stride - 1) / stride;
    int sh = (h + stride - 1) / stride;
    int sn = sw * sh;
    int r = full_radius / stride;
    if (r < 2) r = 2;

    uint32_t saved_heap = get_heap_top();

    // Allocate subsampled arrays + scratch
    float* IR = (float*)alloc_bytes((uint32_t)sn * 4u);
    float* IG = (float*)alloc_bytes((uint32_t)sn * 4u);
    float* IB = (float*)alloc_bytes((uint32_t)sn * 4u);
    float* P  = (float*)alloc_bytes((uint32_t)sn * 4u);

    float* mean_R = (float*)alloc_bytes((uint32_t)sn * 4u);
    float* mean_G = (float*)alloc_bytes((uint32_t)sn * 4u);
    float* mean_B = (float*)alloc_bytes((uint32_t)sn * 4u);
    float* mean_P = (float*)alloc_bytes((uint32_t)sn * 4u);

    float* cov_RR = (float*)alloc_bytes((uint32_t)sn * 4u);
    float* cov_RG = (float*)alloc_bytes((uint32_t)sn * 4u);
    float* cov_RB = (float*)alloc_bytes((uint32_t)sn * 4u);
    float* cov_GG = (float*)alloc_bytes((uint32_t)sn * 4u);
    float* cov_GB = (float*)alloc_bytes((uint32_t)sn * 4u);
    float* cov_BB = (float*)alloc_bytes((uint32_t)sn * 4u);

    float* cov_RP = (float*)alloc_bytes((uint32_t)sn * 4u);
    float* cov_GP = (float*)alloc_bytes((uint32_t)sn * 4u);
    float* cov_BP = (float*)alloc_bytes((uint32_t)sn * 4u);

    float* aR = (float*)alloc_bytes((uint32_t)sn * 4u);
    float* aG = (float*)alloc_bytes((uint32_t)sn * 4u);
    float* aB = (float*)alloc_bytes((uint32_t)sn * 4u);
    float* bK = (float*)alloc_bytes((uint32_t)sn * 4u);

    float* tmp = (float*)alloc_bytes((uint32_t)sn * 4u);
    float* prod = (float*)alloc_bytes((uint32_t)sn * 4u);

    // Full-res morph band masks for edge-only blending
    int fn = w * h;
    float* eroded = (float*)alloc_bytes((uint32_t)fn * 4u);
    float* dilated = (float*)alloc_bytes((uint32_t)fn * 4u);
    float* full_tmp = (float*)alloc_bytes((uint32_t)fn * 4u);
    int* dq_idx = (int*)alloc_bytes((uint32_t)max_dim * 4u);
    float* dq_val = (float*)alloc_bytes((uint32_t)max_dim * 4u);

    if (!dq_val) {
        heap_ptr = saved_heap;
        return;
    }

    // 1. Subsample RGB & Alpha with box average over stride block
    const float inv255 = 1.0f / 255.0f;
    for (int sy = 0; sy < sh; sy++) {
        int y0 = sy * stride;
        for (int sx = 0; sx < sw; sx++) {
            int x0 = sx * stride;
            int idx = (y0 * w + x0) * 4;
            int si = sy * sw + sx;
            if (stride == 1) {
                IR[si] = (float)rgba[idx] * inv255;
                IG[si] = (float)rgba[idx + 1] * inv255;
                IB[si] = (float)rgba[idx + 2] * inv255;
                P[si]  = alpha[y0 * w + x0];
            } else {
                float sr = 0.0f, sg = 0.0f, sb = 0.0f, sp = 0.0f;
                int cnt = 0;
                for (int dy = 0; dy < stride && y0 + dy < h; dy++) {
                    for (int dx = 0; dx < stride && x0 + dx < w; dx++) {
                        int pi = (y0 + dy) * w + (x0 + dx);
                        int ri = pi * 4;
                        sr += (float)rgba[ri];
                        sg += (float)rgba[ri + 1];
                        sb += (float)rgba[ri + 2];
                        sp += alpha[pi];
                        cnt++;
                    }
                }
                float inv = 1.0f / (float)cnt;
                IR[si] = sr * inv * inv255;
                IG[si] = sg * inv * inv255;
                IB[si] = sb * inv * inv255;
                P[si]  = sp * inv;
            }
        }
    }

    // 2. Compute means
    box_mean_f32(IR, mean_R, tmp, sw, sh, r);
    box_mean_f32(IG, mean_G, tmp, sw, sh, r);
    box_mean_f32(IB, mean_B, tmp, sw, sh, r);
    box_mean_f32(P,  mean_P, tmp, sw, sh, r);

    // 3. Compute second-order products & covariances
    for (int i = 0; i < sn; i++) prod[i] = IR[i] * IR[i];
    box_mean_f32(prod, cov_RR, tmp, sw, sh, r);

    for (int i = 0; i < sn; i++) prod[i] = IR[i] * IG[i];
    box_mean_f32(prod, cov_RG, tmp, sw, sh, r);

    for (int i = 0; i < sn; i++) prod[i] = IR[i] * IB[i];
    box_mean_f32(prod, cov_RB, tmp, sw, sh, r);

    for (int i = 0; i < sn; i++) prod[i] = IG[i] * IG[i];
    box_mean_f32(prod, cov_GG, tmp, sw, sh, r);

    for (int i = 0; i < sn; i++) prod[i] = IG[i] * IB[i];
    box_mean_f32(prod, cov_GB, tmp, sw, sh, r);

    for (int i = 0; i < sn; i++) prod[i] = IB[i] * IB[i];
    box_mean_f32(prod, cov_BB, tmp, sw, sh, r);

    for (int i = 0; i < sn; i++) prod[i] = IR[i] * P[i];
    box_mean_f32(prod, cov_RP, tmp, sw, sh, r);

    for (int i = 0; i < sn; i++) prod[i] = IG[i] * P[i];
    box_mean_f32(prod, cov_GP, tmp, sw, sh, r);

    for (int i = 0; i < sn; i++) prod[i] = IB[i] * P[i];
    box_mean_f32(prod, cov_BP, tmp, sw, sh, r);

    // 4. Solve exact 3x3 linear system at every pixel (reusing cov_RR..cov_BB -> mean_a)
    for (int i = 0; i < sn; i++) {
        float mr = mean_R[i], mg = mean_G[i], mb = mean_B[i], mp = mean_P[i];
        float c00 = cov_RR[i] - mr * mr + eps;
        float c01 = cov_RG[i] - mr * mg;
        float c02 = cov_RB[i] - mr * mb;
        float c11 = cov_GG[i] - mg * mg + eps;
        float c12 = cov_GB[i] - mg * mb;
        float c22 = cov_BB[i] - mb * mb + eps;

        float crp = cov_RP[i] - mr * mp;
        float cgp = cov_GP[i] - mg * mp;
        float cbp = cov_BP[i] - mb * mp;

        // Cofactors of symmetric 3x3 matrix
        float inv00 = c11 * c22 - c12 * c12;
        float inv01 = c02 * c12 - c01 * c22;
        float inv02 = c01 * c12 - c02 * c11;
        float inv11 = c00 * c22 - c02 * c02;
        float inv12 = c02 * c01 - c00 * c12;
        float inv22 = c00 * c11 - c01 * c01;

        float det = c00 * inv00 + c01 * inv01 + c02 * inv02;
        float inv_det = det > 1e-12f ? (1.0f / det) : 0.0f;

        float ar = (inv00 * crp + inv01 * cgp + inv02 * cbp) * inv_det;
        float ag = (inv01 * crp + inv11 * cgp + inv12 * cbp) * inv_det;
        float ab = (inv02 * crp + inv12 * cgp + inv22 * cbp) * inv_det;

        cov_RP[i] = ar;
        cov_GP[i] = ag;
        cov_BP[i] = ab;
        cov_RR[i] = mp - ar * mr - ag * mg - ab * mb;
    }

    // 5. Box-average linear coefficients (aR, aG, aB, b)
    box_mean_f32(cov_RP, aR, tmp, sw, sh, r);
    box_mean_f32(cov_GP, aG, tmp, sw, sh, r);
    box_mean_f32(cov_BP, aB, tmp, sw, sh, r);
    box_mean_f32(cov_RR, bK, tmp, sw, sh, r);

    // 6. Compute edge-transition band on full-res alpha via fast morphological erode & dilate
    int band_r = full_radius < 4 ? 4 : full_radius;
    morph_filter_f32(alpha, eroded,  full_tmp, dq_idx, dq_val, w, h, band_r, 0);
    morph_filter_f32(alpha, dilated, full_tmp, dq_idx, dq_val, w, h, band_r, 1);

    // 7. Apply Guided Filter output q = a.I + b ONLY in boundary transition band
    for (int y = 0; y < h; y++) {
        float syf = ((float)y + 0.5f) / (float)stride - 0.5f;
        int y0 = clamp_i((int)syf, 0, sh - 1);
        int y1 = clamp_i(y0 + 1, 0, sh - 1);
        float fy = syf - (float)y0;
        if (fy < 0.0f) fy = 0.0f;
        if (fy > 1.0f) fy = 1.0f;

        for (int x = 0; x < w; x++) {
            int fi = y * w + x;
            float p = alpha[fi];
            float edge_span = dilated[fi] - eroded[fi];
            // Only refine transition band & uncertain hair pixels; lock deep solid FG & clean BG
            if (edge_span < 0.015f && (p <= 0.01f || p >= 0.99f)) {
                continue;
            }

            float sxf = ((float)x + 0.5f) / (float)stride - 0.5f;
            int x0 = clamp_i((int)sxf, 0, sw - 1);
            int x1 = clamp_i(x0 + 1, 0, sw - 1);
            float fx = sxf - (float)x0;
            if (fx < 0.0f) fx = 0.0f;
            if (fx > 1.0f) fx = 1.0f;

            int i00 = y0 * sw + x0;
            int i01 = y0 * sw + x1;
            int i10 = y1 * sw + x0;
            int i11 = y1 * sw + x1;

            float w00 = (1.0f - fx) * (1.0f - fy);
            float w01 = fx * (1.0f - fy);
            float w10 = (1.0f - fx) * fy;
            float w11 = fx * fy;

            float ar_v = aR[i00] * w00 + aR[i01] * w01 + aR[i10] * w10 + aR[i11] * w11;
            float ag_v = aG[i00] * w00 + aG[i01] * w01 + aG[i10] * w10 + aG[i11] * w11;
            float ab_v = aB[i00] * w00 + aB[i01] * w01 + aB[i10] * w10 + aB[i11] * w11;
            float b_v  = bK[i00] * w00 + bK[i01] * w01 + bK[i10] * w10 + bK[i11] * w11;

            int ri = fi * 4;
            float q = clamp01(
                ar_v * ((float)rgba[ri] * inv255) +
                ag_v * ((float)rgba[ri + 1] * inv255) +
                ab_v * ((float)rgba[ri + 2] * inv255) +
                b_v
            );

            // Smooth weight inside edge band (strongest right on fuzzy boundary & fine wisps)
            float edge_w = edge_span * 1.4f;
            if (edge_w > 1.0f) edge_w = 1.0f;
            float w_blend = edge_w * blend_strength;
            alpha[fi] = clamp01(p + w_blend * (q - p));
        }
    }

    heap_ptr = saved_heap;
}

// ---------------------------------------------------------------------------
// 7. Adaptive Trimap Builder & Subject Bounding Box Detector (for ViTMatte-S)
// ---------------------------------------------------------------------------
// out_meta[0..3] = [bx0, by0, bx1, by1], out_meta[4] = unknown_pixel_count, out_meta[5] = fg_pixel_count
__attribute__((visibility("default")))
void build_adaptive_trimap(
    const float* alpha,
    int w,
    int h,
    uint8_t* trimap,
    int erode_r,
    int dilate_r,
    int32_t* out_meta
) {
    int fn = w * h;
    int max_dim = w > h ? w : h;
    uint32_t saved_heap = get_heap_top();

    float* eroded = (float*)alloc_bytes((uint32_t)fn * 4u);
    float* dilated = (float*)alloc_bytes((uint32_t)fn * 4u);
    float* tmp = (float*)alloc_bytes((uint32_t)fn * 4u);
    int* dq_idx = (int*)alloc_bytes((uint32_t)max_dim * 4u);
    float* dq_val = (float*)alloc_bytes((uint32_t)max_dim * 4u);
    if (!dq_val) {
        heap_ptr = saved_heap;
        return;
    }

    morph_filter_f32(alpha, eroded, tmp, dq_idx, dq_val, w, h, erode_r, 0);
    morph_filter_f32(alpha, dilated, tmp, dq_idx, dq_val, w, h, dilate_r, 1);

    int bx0 = w, by0 = h, bx1 = -1, by1 = -1;
    int32_t unknown_cnt = 0;
    int32_t fg_cnt = 0;

    for (int y = 0; y < h; y++) {
        for (int x = 0; x < w; x++) {
            int i = y * w + x;
            float a = alpha[i];
            float er = eroded[i];
            float di = dilated[i];

            uint8_t tv;
            if (er >= 0.94f && a >= 0.95f) {
                tv = 255;
                fg_cnt++;
            } else if (di <= 0.03f && a <= 0.03f) {
                tv = 0;
            } else {
                tv = 128;
                unknown_cnt++;
            }
            trimap[i] = tv;

            if (tv != 0) {
                if (x < bx0) bx0 = x;
                if (x > bx1) bx1 = x;
                if (y < by0) by0 = y;
                if (y > by1) by1 = y;
            }
        }
    }

    if (bx1 < bx0 || by1 < by0) {
        bx0 = 0; by0 = 0; bx1 = w - 1; by1 = h - 1;
    }
    out_meta[0] = bx0;
    out_meta[1] = by0;
    out_meta[2] = bx1;
    out_meta[3] = by1;
    out_meta[4] = unknown_cnt;
    out_meta[5] = fg_cnt;

    heap_ptr = saved_heap;
}

// ---------------------------------------------------------------------------
// 8. Trimap-Gated Merge of ViTMatte-S Crop Alpha Matte Back into Full Alpha
// ---------------------------------------------------------------------------
__attribute__((visibility("default")))
void merge_vitmatte_crop(
    float* full_alpha,
    int w,
    int h,
    const uint8_t* trimap,
    const float* vit_alphas,
    int pad_w,
    int crop_w,
    int crop_h,
    int bx0,
    int by0,
    int bw,
    int bh
) {
    if (bw <= 1 || bh <= 1 || crop_w <= 1 || crop_h <= 1) return;
    int fn = w * h;
    uint32_t saved_heap = get_heap_top();

    // Soft-blur the trimap unknown mask so transition between Stage 1 core FG and ViTMatte unknown band has zero seam
    float* unk_mask = (float*)alloc_bytes((uint32_t)fn * 4u);
    float* unk_blur = (float*)alloc_bytes((uint32_t)fn * 4u);
    float* tmp = (float*)alloc_bytes((uint32_t)fn * 4u);
    if (!tmp) {
        heap_ptr = saved_heap;
        return;
    }

    for (int i = 0; i < fn; i++) {
        unk_mask[i] = trimap[i] == 128 ? 1.0f : 0.0f;
    }
    int feather_r = (w > h ? w : h) / 250;
    if (feather_r < 2) feather_r = 2;
    if (feather_r > 8) feather_r = 8;
    box_mean_f32(unk_mask, unk_blur, tmp, w, h, feather_r);

    float sx_scale = (float)crop_w / (float)bw;
    float sy_scale = (float)crop_h / (float)bh;

    int x_end = bx0 + bw;
    int y_end = by0 + bh;
    if (x_end > w) x_end = w;
    if (y_end > h) y_end = h;

    for (int y = (by0 < 0 ? 0 : by0); y < y_end; y++) {
        float cyf = ((float)(y - by0) + 0.5f) * sy_scale - 0.5f;
        int y0 = clamp_i((int)cyf, 0, crop_h - 1);
        int y1 = clamp_i(y0 + 1, 0, crop_h - 1);
        float fy = cyf - (float)y0;
        if (fy < 0.0f) fy = 0.0f;

        for (int x = (bx0 < 0 ? 0 : bx0); x < x_end; x++) {
            int fi = y * w + x;
            // Weight = 1 inside trimap==128, fades smoothly across boundary, 0 deep inside sure FG/BG
            float weight = trimap[fi] == 128 ? 1.0f : unk_blur[fi];
            if (weight <= 0.01f) continue;

            float cxf = ((float)(x - bx0) + 0.5f) * sx_scale - 0.5f;
            int x0 = clamp_i((int)cxf, 0, crop_w - 1);
            int x1 = clamp_i(x0 + 1, 0, crop_w - 1);
            float fx = cxf - (float)x0;
            if (fx < 0.0f) fx = 0.0f;

            float v00 = clamp01(vit_alphas[y0 * pad_w + x0]);
            float v01 = clamp01(vit_alphas[y0 * pad_w + x1]);
            float v10 = clamp01(vit_alphas[y1 * pad_w + x0]);
            float v11 = clamp01(vit_alphas[y1 * pad_w + x1]);

            float vit_val = (v00 * (1.0f - fx) + v01 * fx) * (1.0f - fy) +
                            (v10 * (1.0f - fx) + v11 * fx) * fy;

            full_alpha[fi] = clamp01(full_alpha[fi] * (1.0f - weight) + vit_val * weight);
        }
    }

    heap_ptr = saved_heap;
}

// ---------------------------------------------------------------------------
// 9. Soft Matte Noise Floor Calibration (Preserves Thin Hair Strands!)
// ---------------------------------------------------------------------------
__attribute__((visibility("default")))
void soft_calibrate_matte(float* alpha, int n, float lo_cut, float hi_cut) {
    for (int i = 0; i < n; i++) {
        float a = alpha[i];
        if (a <= lo_cut) {
            alpha[i] = 0.0f;
        } else if (a >= hi_cut) {
            alpha[i] = 1.0f;
        }
    }
}

// ---------------------------------------------------------------------------
// 10. Photoroom / BiRefNet 2-Pass Blur-Fusion Foreground Color Estimator
//     (Forte & Pitie ICIP 2021: FB_blur_fusion_foreground_estimator_2)
// ---------------------------------------------------------------------------
// Removes 100% of background color bleed & halos on hair/fur/semi-transparent pixels
// using O(N) sliding-window box filters without distorting interior solid colors.
__attribute__((visibility("default")))
void blur_fusion_foreground_composite(
    const uint8_t* in_rgba,
    const float* alpha,
    uint8_t* out_rgba,
    int w,
    int h,
    int r1,
    int r2
) {
    int n = w * h;
    uint32_t saved_heap = get_heap_top();

    // Only 7 float buffers needed total (channel-by-channel R, G, B reuse):
    // b_alpha1, b_alpha2, inv_alpha, F_ch, B_ch, prod, tmp
    float* b_alpha1  = (float*)alloc_bytes((uint32_t)n * 4u);
    float* b_alpha2  = (float*)alloc_bytes((uint32_t)n * 4u);
    float* inv_alpha = (float*)alloc_bytes((uint32_t)n * 4u);
    float* F_ch      = (float*)alloc_bytes((uint32_t)n * 4u);
    float* B_ch      = (float*)alloc_bytes((uint32_t)n * 4u);
    float* prod      = (float*)alloc_bytes((uint32_t)n * 4u);
    float* tmp       = (float*)alloc_bytes((uint32_t)n * 4u);

    if (!tmp) {
        heap_ptr = saved_heap;
        return;
    }

    for (int i = 0; i < n; i++) {
        inv_alpha[i] = 1.0f - alpha[i];
    }

    // Blurred alphas for Pass 1 (r1) and Pass 2 (r2)
    box_mean_f32(alpha, b_alpha1, tmp, w, h, r1);
    box_mean_f32(alpha, b_alpha2, tmp, w, h, r2);

    const float inv255 = 1.0f / 255.0f;

    // Channels R, G, B are mathematically independent in Blur-Fusion
    for (int c = 0; c < 3; c++) {
        // --- PASS 1: Coarse Blur Fusion (radius r1) ---
        for (int i = 0; i < n; i++) {
            float ic = (float)in_rgba[i * 4 + c] * inv255;
            prod[i] = ic * alpha[i];
        }
        box_mean_f32(prod, F_ch, tmp, w, h, r1);

        for (int i = 0; i < n; i++) {
            float ic = (float)in_rgba[i * 4 + c] * inv255;
            prod[i] = ic * inv_alpha[i];
        }
        box_mean_f32(prod, B_ch, tmp, w, h, r1);

        for (int i = 0; i < n; i++) {
            float a = alpha[i];
            float ba = b_alpha1[i];
            float bf = F_ch[i] / (ba + 1e-5f);
            float bb = B_ch[i] / ((1.0f - ba) + 1e-5f);
            float ic = (float)in_rgba[i * 4 + c] * inv255;

            F_ch[i] = clamp01(bf + a * (ic - a * bf - (1.0f - a) * bb));
            B_ch[i] = clamp01(bb);
        }

        // --- PASS 2: Fine Blur Fusion (radius r2) ---
        for (int i = 0; i < n; i++) {
            prod[i] = F_ch[i] * alpha[i];
        }
        box_mean_f32(prod, F_ch, tmp, w, h, r2);

        for (int i = 0; i < n; i++) {
            prod[i] = B_ch[i] * inv_alpha[i];
        }
        box_mean_f32(prod, B_ch, tmp, w, h, r2);

        for (int i = 0; i < n; i++) {
            int ri = i * 4;
            float a = alpha[i];
            int a8 = (int)(a * 255.0f + 0.5f);
            if (a8 >= 253) {
                out_rgba[ri + c] = in_rgba[ri + c];
            } else if (a8 <= 2 && b_alpha2[i] <= 0.015f) {
                out_rgba[ri + c] = 0;
            } else {
                float ba = b_alpha2[i];
                float bf = F_ch[i] / (ba + 1e-5f);
                float bb = B_ch[i] / ((1.0f - ba) + 1e-5f);
                float ic = (float)in_rgba[ri + c] * inv255;
                float fc = clamp01(bf + a * (ic - a * bf - (1.0f - a) * bb));
                out_rgba[ri + c] = (uint8_t)(fc * 255.0f + 0.5f);
            }
        }
    }

    // Write final alpha channel
    for (int i = 0; i < n; i++) {
        int a8 = (int)(alpha[i] * 255.0f + 0.5f);
        if (a8 <= 2) a8 = 0;
        else if (a8 >= 253) a8 = 255;
        out_rgba[i * 4 + 3] = (uint8_t)a8;
    }

    heap_ptr = saved_heap;
}
