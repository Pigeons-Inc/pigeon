import nodemailer from 'nodemailer';
import SendActivationDto from '../interfaces/SendActivationDto';

export default class SendService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  public async activation(dto: SendActivationDto) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: dto.sendTo,
      subject: 'Account activation for Pigeon',
      text: '',
      html: `
        <div>
          <h1>To activate your account follow the link</h1>
          <a href="${dto.link}">${dto.link}</a>
        </div>
      `,
    });
  }
}
