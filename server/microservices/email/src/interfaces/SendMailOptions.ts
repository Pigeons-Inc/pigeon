export default interface SendMailOptions {
  readonly from?: string;
  readonly to: string;
  readonly subject?: string;
  readonly text?: string;
  readonly html?: string;
}
