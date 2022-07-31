import nodemailer from 'nodemailer';
import SendActivationDto from '../interfaces/SendActivationDto';
import SendMailOptions from '../interfaces/SendMailOptions';

export default class SendService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: process.env.SMTP_SECURE !== 'false',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  public async activation(dto: SendActivationDto) {
    const to = dto.sendTo;
    const subject = 'Account activation for Pigeon';
    const html = `
        <div>
          <h1>To activate your account follow the link</h1>
          <a href="${dto.link}">Activate</a>
        </div>
    `;
    return this.sendMail({ to, subject, html });
  }

  public async passwordReset(dto: SendActivationDto) {
    const to = dto.sendTo;
    const subject = 'Password reset for Pigeon';
    const html = `
      <div>
        <h1>Did you request a password for Pigeon?</h1>
        <a href="${dto.link}?confirmed=true">Reset</a>
        <a href="${dto.link}?confirmed=false">Wasn't me!</a>
      </div>
    `;
    return this.sendMail({ to, subject, html });
  }

  public async sendMail(options: SendMailOptions) {
    return this.transporter.sendMail({
      from: process.env.SMTP_USER,
      subject: '',
      text: '',
      html: '',
      ...options,
    });
  }
}
