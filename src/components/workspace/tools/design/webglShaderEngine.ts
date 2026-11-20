// src/components/workspace/tools/design/webglShaderEngine.ts
// Engine WebGL Hardware-Accelerated untuk Filter, Grading & Penyesuaian Real-Time 60 FPS

import type { StudioAdjustments } from './types';

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}
`;

const FRAGMENT_SHADER_SOURCE = `
precision highp float;

uniform sampler2D u_image;
uniform vec2 u_texSize;

// Penyesuaian Dasar
uniform float u_brightness;  // -1.0 .. 1.0
uniform float u_contrast;    // -1.0 .. 1.0
uniform float u_exposure;    // -2.0 .. 2.0
uniform float u_saturation;  // -1.0 .. 1.0
uniform float u_vibrance;    // -1.0 .. 1.0
uniform float u_temperature; // -1.0 .. 1.0 (warm/cool)
uniform float u_tint;        // -1.0 .. 1.0 (green/magenta)
uniform float u_highlights;  // -1.0 .. 1.0
uniform float u_shadows;     // -1.0 .. 1.0

// Detail & Efek
uniform float u_sharpen;     // 0.0 .. 1.0
uniform float u_vignette;    // 0.0 .. 1.0
uniform float u_blur;        // 0.0 .. 1.0

varying vec2 v_texCoord;

void main() {
  vec2 texCoord = v_texCoord;
  vec2 onePixel = vec2(1.0, 1.0) / u_texSize;

  vec4 baseColor = texture2D(u_image, texCoord);
  vec3 color = baseColor.rgb;

  // 1. Sharpening (Laplacian 3x3 Convolution)
  if (u_sharpen > 0.01) {
    vec3 up = texture2D(u_image, texCoord + vec2(0.0, -onePixel.y)).rgb;
    vec3 down = texture2D(u_image, texCoord + vec2(0.0, onePixel.y)).rgb;
    vec3 left = texture2D(u_image, texCoord + vec2(-onePixel.x, 0.0)).rgb;
    vec3 right = texture2D(u_image, texCoord + vec2(onePixel.x, 0.0)).rgb;
    vec3 laplacian = 4.0 * color - up - down - left - right;
    color = clamp(color + laplacian * (u_sharpen * 0.8), 0.0, 1.0);
  }

  // 2. Soft Gaussian Blur (9-tap sample)
  if (u_blur > 0.01) {
    float bRadius = u_blur * 3.5;
    vec3 blurred = vec3(0.0);
    blurred += texture2D(u_image, texCoord + vec2(-onePixel.x, -onePixel.y) * bRadius).rgb * 0.0625;
    blurred += texture2D(u_image, texCoord + vec2(0.0, -onePixel.y) * bRadius).rgb * 0.125;
    blurred += texture2D(u_image, texCoord + vec2(onePixel.x, -onePixel.y) * bRadius).rgb * 0.0625;
    blurred += texture2D(u_image, texCoord + vec2(-onePixel.x, 0.0) * bRadius).rgb * 0.125;
    blurred += color * 0.25;
    blurred += texture2D(u_image, texCoord + vec2(onePixel.x, 0.0) * bRadius).rgb * 0.125;
    blurred += texture2D(u_image, texCoord + vec2(-onePixel.x, onePixel.y) * bRadius).rgb * 0.0625;
    blurred += texture2D(u_image, texCoord + vec2(0.0, onePixel.y) * bRadius).rgb * 0.125;
    blurred += texture2D(u_image, texCoord + vec2(onePixel.x, onePixel.y) * bRadius).rgb * 0.0625;
    color = mix(color, blurred, min(1.0, u_blur * 1.5));
  }

  // 3. Exposure
  if (abs(u_exposure) > 0.001) {
    color = color * pow(2.0, u_exposure);
  }

  // 4. Brightness
  if (abs(u_brightness) > 0.001) {
    color += vec3(u_brightness);
  }

  // 5. Contrast
  if (abs(u_contrast) > 0.001) {
    color = (color - 0.5) * (1.0 + u_contrast) + 0.5;
  }

  // 6. Temperature (Warmth) & Tint
  if (abs(u_temperature) > 0.001) {
    color.r += u_temperature * 0.22;
    color.b -= u_temperature * 0.22;
  }
  if (abs(u_tint) > 0.001) {
    color.g += u_tint * 0.18;
  }

  // 7. Highlights & Shadows
  float lum = dot(color, vec3(0.2126, 0.7152, 0.0722));
  if (abs(u_shadows) > 0.001) {
    float shadowWeight = 1.0 - smoothstep(0.0, 0.55, lum);
    color += vec3(u_shadows * 0.35 * shadowWeight);
  }
  if (abs(u_highlights) > 0.001) {
    float highlightWeight = smoothstep(0.45, 1.0, lum);
    color += vec3(u_highlights * 0.35 * highlightWeight);
  }

  // 8. Vibrance (Peningkatan saturasi pintar untuk warna kurang jenuh)
  if (abs(u_vibrance) > 0.001) {
    float maxCh = max(color.r, max(color.g, color.b));
    float minCh = min(color.r, min(color.g, color.b));
    float sat = (maxCh - minCh) / (maxCh + 0.0001);
    float vibFactor = (1.0 - sat) * u_vibrance;
    color = mix(vec3(lum), color, 1.0 + vibFactor);
  }

  // 9. Saturation
  if (abs(u_saturation) > 0.001) {
    float currentLum = dot(color, vec3(0.2126, 0.7152, 0.0722));
    color = mix(vec3(currentLum), color, max(0.0, 1.0 + u_saturation));
  }

  // 10. Vignette
  if (u_vignette > 0.01) {
    vec2 centeredCoord = texCoord - vec2(0.5);
    float dist = length(centeredCoord) * 1.4142; // normalisasi ke pojok = 1.0
    float vigFactor = smoothstep(0.85, 0.85 - u_vignette * 0.55, dist);
    color *= vigFactor;
  }

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), baseColor.a);
}
`;

export class WebglShaderEngine {
  private canvas: HTMLCanvasElement | null = null;
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private texture: WebGLTexture | null = null;
  private positionBuffer: WebGLBuffer | null = null;
  private texCoordBuffer: WebGLBuffer | null = null;
  private imageWidth = 0;
  private imageHeight = 0;
  private isInitialized = false;

  public init(canvas: HTMLCanvasElement): boolean {
    this.canvas = canvas;
    const gl =
      canvas.getContext('webgl', { preserveDrawingBuffer: true, alpha: true }) ||
      (canvas.getContext('experimental-webgl', {
        preserveDrawingBuffer: true,
        alpha: true,
      }) as WebGLRenderingContext | null);

    if (!gl) {
      console.warn('[WebglShaderEngine] WebGL tidak didukung di browser ini.');
      return false;
    }
    this.gl = gl;

    const program = this.createProgram(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE);
    if (!program) return false;
    this.program = program;

    // Buffer posisi quad penuh (-1 .. 1)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
        -1.0,  1.0,
         1.0, -1.0,
         1.0,  1.0,
      ]),
      gl.STATIC_DRAW
    );
    this.positionBuffer = positionBuffer;

    // Buffer koordinat tekstur (0 .. 1 dengan sumbu Y dibalik agar tegak)
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        0.0, 1.0,
        1.0, 1.0,
        0.0, 0.0,
        0.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,
      ]),
      gl.STATIC_DRAW
    );
    this.texCoordBuffer = texCoordBuffer;

    this.isInitialized = true;
    return true;
  }

  public loadSource(source: TexImageSource, width: number, height: number): boolean {
    const gl = this.gl;
    if (!gl || !this.program) return false;

    this.imageWidth = width;
    this.imageHeight = height;

    if (!this.texture) {
      this.texture = gl.createTexture();
    }

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    return true;
  }

  public render(adjustments: StudioAdjustments): void {
    const gl = this.gl;
    const canvas = this.canvas;
    const program = this.program;
    if (!gl || !canvas || !program || !this.texture || !this.isInitialized) return;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);

    // Hubungkan Attrib Position
    const posLocation = gl.getAttribLocation(program, 'a_position');
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.enableVertexAttribArray(posLocation);
    gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 0, 0);

    // Hubungkan Attrib TexCoord
    const texLocation = gl.getAttribLocation(program, 'a_texCoord');
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.enableVertexAttribArray(texLocation);
    gl.vertexAttribPointer(texLocation, 2, gl.FLOAT, false, 0, 0);

    // Bind Tekstur Gambar
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(gl.getUniformLocation(program, 'u_image'), 0);

    // Set Uniform Ukuran Piksel
    gl.uniform2f(
      gl.getUniformLocation(program, 'u_texSize'),
      this.imageWidth || canvas.width,
      this.imageHeight || canvas.height
    );

    // Kirim Parameter Nilai Slider (-100..100 ke skala shader)
    gl.uniform1f(gl.getUniformLocation(program, 'u_brightness'), adjustments.brightness / 100);
    gl.uniform1f(gl.getUniformLocation(program, 'u_contrast'), adjustments.contrast / 100);
    gl.uniform1f(gl.getUniformLocation(program, 'u_exposure'), (adjustments.exposure / 100) * 1.5);
    gl.uniform1f(gl.getUniformLocation(program, 'u_saturation'), adjustments.saturation / 100);
    gl.uniform1f(gl.getUniformLocation(program, 'u_vibrance'), adjustments.vibrance / 100);
    gl.uniform1f(gl.getUniformLocation(program, 'u_temperature'), adjustments.temperature / 100);
    gl.uniform1f(gl.getUniformLocation(program, 'u_tint'), adjustments.tint / 100);
    gl.uniform1f(gl.getUniformLocation(program, 'u_highlights'), adjustments.highlights / 100);
    gl.uniform1f(gl.getUniformLocation(program, 'u_shadows'), adjustments.shadows / 100);

    // Detail & Efek (0..100 ke 0..1)
    gl.uniform1f(gl.getUniformLocation(program, 'u_sharpen'), adjustments.sharpen / 100);
    gl.uniform1f(gl.getUniformLocation(program, 'u_vignette'), adjustments.vignette / 100);
    gl.uniform1f(gl.getUniformLocation(program, 'u_blur'), adjustments.blur / 100);

    // Gambar Triangle Fan
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  public destroy(): void {
    const gl = this.gl;
    if (gl) {
      if (this.texture) gl.deleteTexture(this.texture);
      if (this.positionBuffer) gl.deleteBuffer(this.positionBuffer);
      if (this.texCoordBuffer) gl.deleteBuffer(this.texCoordBuffer);
      if (this.program) gl.deleteProgram(this.program);
    }
    this.texture = null;
    this.positionBuffer = null;
    this.texCoordBuffer = null;
    this.program = null;
    this.gl = null;
    this.canvas = null;
    this.isInitialized = false;
  }

  private createProgram(
    gl: WebGLRenderingContext,
    vertexSrc: string,
    fragmentSrc: string
  ): WebGLProgram | null {
    const vs = this.compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
    const fs = this.compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[WebglShaderEngine] Gagal link program shader:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    // Bersihkan shader individual setelah berhasil dilink
    gl.deleteShader(vs);
    gl.deleteShader(fs);

    return program;
  }

  private compileShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string
  ): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('[WebglShaderEngine] Gagal kompilasi shader:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }
}
