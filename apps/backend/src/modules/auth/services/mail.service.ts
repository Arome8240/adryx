import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private from: string;

  constructor(private configService: ConfigService) {
    const host = configService.get<string>('SMTP_HOST');
    const user = configService.get<string>('SMTP_USER');
    const pass = configService.get<string>('SMTP_PASS');

    this.from = configService.get<string>('SMTP_FROM', `Adryx <noreply@adryx.xyz>`);

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port: configService.get<number>('SMTP_PORT', 587),
        secure: configService.get<number>('SMTP_PORT', 587) === 465,
        auth: { user, pass },
      });
      this.logger.log('Mail transport initialized');
    } else {
      this.logger.warn('SMTP credentials not configured — emails will be logged to console only');
    }
  }

  async sendPasswordReset(email: string, resetUrl: string): Promise<void> {
    const subject = 'Reset your Adryx password';
    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;background:#08080a;color:#f5f5f5;padding:40px 32px;border-radius:16px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:32px;">
          <div style="width:28px;height:28px;background:#EBFF45;border-radius:6px;display:flex;align-items:center;justify-content:center;">
            <span style="font-size:14px;font-weight:900;color:#08080a;">A</span>
          </div>
          <span style="font-size:16px;font-weight:700;color:#f5f5f5;">Adryx</span>
        </div>
        <h1 style="font-size:22px;font-weight:700;margin:0 0 12px;">Reset your password</h1>
        <p style="font-size:14px;color:rgba(245,245,245,.6);line-height:1.6;margin:0 0 28px;">
          We received a request to reset the password for your Adryx account. Click the button below within 1 hour.
        </p>
        <a href="${resetUrl}" style="display:inline-block;background:#EBFF45;color:#08080a;font-weight:700;font-size:14px;padding:12px 28px;border-radius:9px;text-decoration:none;">
          Reset password
        </a>
        <p style="font-size:12px;color:rgba(245,245,245,.35);margin:28px 0 0;line-height:1.6;">
          If you didn't request this, you can safely ignore this email.<br>
          This link expires in 1 hour.
        </p>
      </div>
    `;

    await this.send(email, subject, html);
  }

  async sendWelcome(email: string, name: string): Promise<void> {
    const subject = 'Welcome to Adryx';
    const html = `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;background:#08080a;color:#f5f5f5;padding:40px 32px;border-radius:16px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:32px;">
          <div style="width:28px;height:28px;background:#EBFF45;border-radius:6px;display:flex;align-items:center;justify-content:center;">
            <span style="font-size:14px;font-weight:900;color:#08080a;">A</span>
          </div>
          <span style="font-size:16px;font-weight:700;color:#f5f5f5;">Adryx</span>
        </div>
        <h1 style="font-size:22px;font-weight:700;margin:0 0 12px;">Welcome, ${name}!</h1>
        <p style="font-size:14px;color:rgba(245,245,245,.6);line-height:1.6;margin:0 0 28px;">
          You're now part of Adryx — the internet advertising network settled in USDC on Stellar.
          Start earning with your first ad slot in minutes.
        </p>
        <a href="${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/publishers" style="display:inline-block;background:#EBFF45;color:#08080a;font-weight:700;font-size:14px;padding:12px 28px;border-radius:9px;text-decoration:none;">
          Go to dashboard
        </a>
      </div>
    `;

    await this.send(email, subject, html);
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    if (!this.transporter) {
      this.logger.log(`[DEV EMAIL] To: ${to} | Subject: ${subject}`);
      return;
    }
    try {
      await this.transporter.sendMail({ from: this.from, to, subject, html });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}`, err);
    }
  }
}
