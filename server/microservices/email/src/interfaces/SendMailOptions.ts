import Mail from 'nodemailer/lib/mailer';

export default interface SendMailOptions {
  readonly from?: Mail.Address;
  readonly to: Mail.Address;
  readonly subject?: string;
  readonly text?: string;
  readonly html?: string;
}
