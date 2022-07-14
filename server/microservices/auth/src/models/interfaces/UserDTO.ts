/**
 * @author Eugene Pashkovsky <pashkovskiy.eugen@gmail.com>
 */

export default interface UserDTO {
  id: string;
  email: string;
  hash: string;
  isActivated: boolean;
}
