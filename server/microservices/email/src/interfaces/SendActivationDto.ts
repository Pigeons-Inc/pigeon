import Mail from 'nodemailer/lib/mailer';

export default interface SendActivationDto {
  readonly link: string;
  readonly sendTo: Mail.Address;
}
