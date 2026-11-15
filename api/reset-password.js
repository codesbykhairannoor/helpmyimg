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

    // Direct in-app link to HelpMyIMG with password reset params
    const directHelpMyImgLink = `${targetOrigin}/?mode=resetPassword&oobCode=${oobCode}&apiKey=${apiKey}`;

    const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your HelpMyIMG password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 48px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05); text-align: left;">
          
          <!-- Logo & Brand Header -->
          <tr>
            <td style="padding-bottom: 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="vertical-align: middle; padding-right: 12px;">
                    <img src="https://helpmyimg.com/logobaru.png" alt="HelpMyIMG Logo" width="36" height="36" style="display: block; width: 36px; height: 36px; border-radius: 8px; object-fit: contain;" />
                  </td>
                  <td style="vertical-align: middle;">
                    <span style="font-size: 19px; font-weight: 700; color: #0f172a; letter-spacing: -0.3px;">HelpMy<span style="color: #0891b2;">IMG</span></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td style="padding-bottom: 16px;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #0f172a; line-height: 1.3;">Reset your password</h1>
            </td>
          </tr>

          <!-- Body Description -->
          <tr>
            <td style="padding-bottom: 28px; font-size: 14px; line-height: 1.6; color: #475569;">
              We received a request to reset the password for your HelpMyIMG account associated with <strong style="color: #0f172a;">${email.trim()}</strong>.
              <br><br>
              Click the button below to choose a new password:
            </td>
          </tr>

          <!-- Action Button -->
          <tr>
            <td style="padding-bottom: 32px;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 10px; background: #0f172a;">
                    <a href="${directHelpMyImgLink}" target="_blank" style="display: inline-block; padding: 12px 28px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 10px; background-color: #0f172a; letter-spacing: -0.1px;">
                      Reset password
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Fallback Link -->
          <tr>
            <td style="border-top: 1px solid #f1f5f9; padding-top: 20px; font-size: 12px; line-height: 1.6; color: #64748b;">
              If the button doesn't work, copy and paste this link into your browser:
              <br>
              <a href="${directHelpMyImgLink}" style="color: #0891b2; word-break: break-all; text-decoration: underline;">
                ${directHelpMyImgLink}
              </a>
            </td>
          </tr>

          <!-- Security Notice -->
          <tr>
            <td style="padding-top: 16px; font-size: 12px; line-height: 1.5; color: #94a3b8;">
              If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
            </td>
          </tr>
        </table>

        <!-- Subtle Footer -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 480px; margin-top: 24px; text-align: center;">
          <tr>
            <td style="font-size: 12px; color: #94a3b8; line-height: 1.5;">
              HelpMyIMG — 100% Private, In-Browser Image Tools
              <br>
              <a href="https://helpmyimg.com" style="color: #64748b; text-decoration: none;">helpmyimg.com</a>
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
        subject: 'Reset your HelpMyIMG password',
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
