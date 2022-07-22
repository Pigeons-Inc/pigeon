import nodemailer from 'nodemailer';
import SendActivationDto from '../interfaces/SendActivationDto';

export default class SendService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: !(process.env.SMTP_SECURE === 'false'),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  public async activation(dto: SendActivationDto) {
    return this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: dto.sendTo,
      subject: 'Account activation for Pigeon',
      text: '',
      html: `
          <div>
            <h1>To activate your account follow the link</h1>
            <a href="${dto.link}">Activate</a>
          </div>
        `,
    });
  }

  public async passwordReset(dto: SendActivationDto) {
    return this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: dto.sendTo,
      subject: 'Password reset for Pigeon',
      text: '',
      html: `
        <div>
          <h1>Did you request a password for Pigeon?</h1>
          <a href="${dto.link}?confirmed=true">Reset</a>
          <a href="${dto.link}?confirmed=false">Wasn't me!</a>
        </div>
      `,
    });
  }
}
