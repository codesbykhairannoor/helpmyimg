import fs from 'fs';
import path from 'path';
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

function getServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
      return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT env:', e);
    }
  }

  // Local file search in root directory
  const rootDir = process.cwd();
  try {
    const files = fs.readdirSync(rootDir);
    const candidate = files.find(
      (f) =>
        (f.includes('thismyown') || f.includes('firebase-adminsdk')) &&
        f.endsWith('.json')
    );
    if (candidate) {
      return JSON.parse(fs.readFileSync(path.join(rootDir, candidate), 'utf8'));
    }
  } catch (err) {
    console.error('Error reading local service account file:', err);
  }

  return null;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, origin } = req.body || {};
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    return res.status(500).json({ error: 'Firebase Admin credentials not found' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY is not configured' });
  }

  try {
    const app =
      getApps().length > 0
        ? getApp()
        : initializeApp({
            credential: cert(serviceAccount),
          });
    const auth = getAuth(app);

    const targetOrigin = origin || 'https://helpmyimg.com';
    const actionCodeSettings = {
      url: `${targetOrigin}/`,
      handleCodeInApp: true,
    };

    const rawResetLink = await auth.generatePasswordResetLink(email.trim(), actionCodeSettings);
    const parsedUrl = new URL(rawResetLink);
    const oobCode = parsedUrl.searchParams.get('oobCode');
    const apiKey = parsedUrl.searchParams.get('apiKey');

    // Tautan langsung ke aplikasi HelpMyIMG (melewati halaman putih thismyown.firebaseapp.com)
    const directHelpMyImgLink = `${targetOrigin}/?mode=resetPassword&oobCode=${oobCode}&apiKey=${apiKey}`;

    const emailHtml = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Kata Sandi HelpMyIMG</title>
</head>
<body style="margin: 0; padding: 0; background-color: #080c14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #080c14; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #0f172a; border-radius: 20px; border: 1px solid #1e293b; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <!-- Header / Brand -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #05DAED, #12DA91); padding: 2px; border-radius: 14px;">
                <div style="background-color: #080c14; border-radius: 12px; padding: 10px 18px;">
                  <span style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">HelpMy<span style="color: #05DAED;">IMG</span></span>
                </div>
              </div>
            </td>
          </tr>
          <!-- Title -->
          <tr>
            <td align="center" style="padding-bottom: 16px;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff;">Atur Ulang Kata Sandi</h1>
            </td>
          </tr>
          <!-- Body text -->
          <tr>
            <td style="padding-bottom: 28px; line-height: 1.6; font-size: 14px; color: #94a3b8; text-align: center;">
              Halo,<br>
              Kami menerima permintaan untuk mengatur ulang kata sandi akun HelpMyIMG Anda (<strong>${email}</strong>). Klik tombol di bawah ini untuk membuat kata sandi baru:
            </td>
          </tr>
          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <a href="${directHelpMyImgLink}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #05DAED, #12DA91); color: #080c14; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 32px; border-radius: 12px; box-shadow: 0 4px 15px rgba(5, 218, 237, 0.35);">
                Atur Ulang Kata Sandi
              </a>
            </td>
          </tr>
          <!-- Security Footer -->
          <tr>
            <td style="border-top: 1px solid #1e293b; padding-top: 20px; line-height: 1.5; font-size: 12px; color: #64748b; text-align: center;">
              Tautan ini hanya berlaku untuk waktu terbatas.<br>
              Jika Anda tidak meminta pengaturan ulang kata sandi, abaikan email ini dengan aman.
            </td>
          </tr>
        </table>
        <!-- Sub footer -->
        <table role="presentation" width="100%" style="max-width: 520px; margin-top: 20px;">
          <tr>
            <td align="center" style="font-size: 11px; color: #475569;">
              © ${new Date().getFullYear()} HelpMyIMG. 100% Private In-Browser AI Tools.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'HelpMyIMG <onboarding@resend.dev>',
        to: [email.trim()],
        subject: 'Atur Ulang Kata Sandi Akun HelpMyIMG Anda',
        html: emailHtml,
      }),
    });

    const resendData = await resendResponse.json();
    if (!resendResponse.ok) {
      console.error('Resend error:', resendData);
      return res
        .status(resendResponse.status)
        .json({ error: resendData.message || 'Failed to send email via Resend' });
    }

    return res.status(200).json({ success: true, id: resendData.id });
  } catch (error) {
    console.error('Error generating reset link:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
