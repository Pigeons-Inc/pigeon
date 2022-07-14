/**
 * @author Eugene Pashkovsky <pashkovskiy.eugen@gmail.com>
 */

export default interface ErrorResponse {
  message: string;
  errors: { name: string; message: string }[] | Error[];
}
