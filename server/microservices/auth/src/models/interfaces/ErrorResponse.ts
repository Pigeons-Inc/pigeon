export default interface ErrorResponse {
  message: string;
  errors: { name: string; message: string }[];
}
