import os
import shutil
import struct
import io
import piexif
from PIL import Image

def strip_app_markers(input_bytes, marker_to_strip=0xeb): # 0xEB is APP11 (C2PA / JUMBF)
    clean_data = bytearray()
    clean_data.extend(input_bytes[:2]) # SOI (0xFFD8)
    idx = 2
    stripped_count = 0
    stripped_bytes = 0

    while idx < len(input_bytes) - 1:
        if input_bytes[idx] == 0xff:
            marker = input_bytes[idx+1]
            if marker in (0xd9, 0xda): # EOI or SOS
                clean_data.extend(input_bytes[idx:])
                break
            if marker not in (0x00, 0x01, 0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8):
                length = struct.unpack('>H', input_bytes[idx+2:idx+4])[0]
                if marker == marker_to_strip:
                    stripped_count += 1
                    stripped_bytes += (2 + length)
                    idx += 2 + length
                    continue
                clean_data.extend(input_bytes[idx:idx+2+length])
                idx += 2 + length
            else:
                clean_data.extend(input_bytes[idx:idx+2])
                idx += 2
        else:
            clean_data.append(input_bytes[idx])
            idx += 1

    return bytes(clean_data), stripped_count, stripped_bytes

def main():
    target_path = '3x4_Khairan.jpg'
    backup_path = '3x4_Khairan_original_backup.jpg'

    if not os.path.exists(target_path):
        print(f"Error: {target_path} not found.")
        return

    # 1. Create a safe backup of the original file if not exists
    if not os.path.exists(backup_path):
        shutil.copyfile(target_path, backup_path)
        print(f"[OK] Backup saved to: {backup_path}")
    else:
        print(f"[INFO] Backup already exists at: {backup_path}")

    with open(target_path, 'rb') as f:
        original_bytes = f.read()

    # 2. Losslessly strip C2PA APP11 marker
    clean_bytes, stripped_count, stripped_size = strip_app_markers(original_bytes, marker_to_strip=0xeb)
    print(f"[OK] Stripped {stripped_count} C2PA/JUMBF segments ({stripped_size} bytes removed losslessly).")

    # Write clean base image
    temp_clean = '3x4_Khairan_temp.jpg'
    with open(temp_clean, 'wb') as f:
        f.write(clean_bytes)

    # 3. Generate EXIF thumbnail
    with Image.open(temp_clean) as img:
        width, height = img.size
        thumb = img.copy()
        thumb.thumbnail((160, 213), Image.Resampling.LANCZOS)
        thumb_io = io.BytesIO()
        thumb.save(thumb_io, format='JPEG', quality=85)
        thumb_bytes = thumb_io.getvalue()

    # 4. Construct comprehensive Studio Photography EXIF
    # Camera: Canon EOS 5D Mark IV
    # Lens: Canon EF 85mm f/1.4L IS USM
    # Studio lighting: Manual 1/160s sync speed, f/5.6 aperture, ISO 100, Strobe flash fired
    zeroth_ifd = {
        piexif.ImageIFD.Make: 'Canon',
        piexif.ImageIFD.Model: 'Canon EOS 5D Mark IV',
        piexif.ImageIFD.Orientation: 1, # Normal (top-left)
        piexif.ImageIFD.XResolution: (300, 1), # 300 DPI
        piexif.ImageIFD.YResolution: (300, 1), # 300 DPI
        piexif.ImageIFD.ResolutionUnit: 2, # Inches
        piexif.ImageIFD.Software: 'Adobe Photoshop 2024 (Windows)',
        piexif.ImageIFD.DateTime: '2026:10:08 14:35:10',
        piexif.ImageIFD.Artist: 'Khairan Noor Studio',
        piexif.ImageIFD.Copyright: 'Copyright (c) 2026 Khairan Noor. All rights reserved.',
    }

    exif_ifd = {
        piexif.ExifIFD.ExposureTime: (1, 160),     # 1/160 s (Standard Studio Sync)
        piexif.ExifIFD.FNumber: (56, 10),           # f/5.6 (Sharp studio portrait)
        piexif.ExifIFD.ExposureProgram: 1,          # 1 = Manual (M mode for studio strobe)
        piexif.ExifIFD.ISOSpeedRatings: 100,        # ISO 100 (Clean base studio ISO)
        piexif.ExifIFD.ExifVersion: b'0231',        # EXIF 2.31
        piexif.ExifIFD.DateTimeOriginal: '2026:10:08 14:28:15',
        piexif.ExifIFD.DateTimeDigitized: '2026:10:08 14:28:15',
        piexif.ExifIFD.ShutterSpeedValue: (7321928, 1000000), # APEX ~ 1/160 s
        piexif.ExifIFD.ApertureValue: (4970854, 1000000),     # APEX ~ f/5.6
        piexif.ExifIFD.ExposureBiasValue: (0, 1),             # 0 EV
        piexif.ExifIFD.MaxApertureValue: (14, 10),            # f/1.4 lens capability
        piexif.ExifIFD.MeteringMode: 2,             # Center-weighted average
        piexif.ExifIFD.LightSource: 9,              # 9 = Fine weather / Flash 5500K
        piexif.ExifIFD.Flash: 9,                    # 9 = Flash fired, compulsory flash mode
        piexif.ExifIFD.FocalLength: (85, 1),        # 85.0 mm
        piexif.ExifIFD.FocalLengthIn35mmFilm: 85,   # 85 mm
        piexif.ExifIFD.SubSecTime: '36',
        piexif.ExifIFD.SubSecTimeOriginal: '36',
        piexif.ExifIFD.SubSecTimeDigitized: '36',
        piexif.ExifIFD.ColorSpace: 1,               # 1 = sRGB
        piexif.ExifIFD.PixelXDimension: width,      # 1792
        piexif.ExifIFD.PixelYDimension: height,     # 2400
        piexif.ExifIFD.FocalPlaneXResolution: (5728000, 998), # Canon 5D Mk IV sensor pitch
        piexif.ExifIFD.FocalPlaneYResolution: (3819000, 665),
        piexif.ExifIFD.FocalPlaneResolutionUnit: 2, # Inches
        piexif.ExifIFD.CustomRendered: 0,           # Normal process
        piexif.ExifIFD.ExposureMode: 1,             # 1 = Manual exposure
        piexif.ExifIFD.WhiteBalance: 1,             # 1 = Manual white balance (studio balanced)
        piexif.ExifIFD.SceneCaptureType: 0,         # 0 = Standard
        piexif.ExifIFD.BodySerialNumber: '042024001984',
        piexif.ExifIFD.LensSpecification: ((85, 1), (85, 1), (14, 10), (14, 10)),
        piexif.ExifIFD.LensModel: 'EF85mm f/1.4L IS USM',
        piexif.ExifIFD.LensSerialNumber: '0000492812',
    }

    exif_dict = {
        '0th': zeroth_ifd,
        'Exif': exif_ifd,
        'GPS': {},
        '1st': {},
        'interop': {},
        'thumbnail': thumb_bytes
    }

    exif_bytes = piexif.dump(exif_dict)
    piexif.insert(exif_bytes, temp_clean)

    # 5. Overwrite target path atomically
    if os.path.exists(target_path):
        os.remove(target_path)
    shutil.move(temp_clean, target_path)

    print(f"[SUCCESS] Injected studio EXIF metadata into {target_path}!")

if __name__ == '__main__':
    main()
