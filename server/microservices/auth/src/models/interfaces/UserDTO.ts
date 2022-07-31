/**
 * @author Eugene Pashkovsky <pashkovskiy.eugen@gmail.com>
 */

export default interface UserDTO {
  readonly id: string;
  readonly email: string;
  readonly hash: string;
  readonly isActivated: boolean;
  readonly activationId: string;
}
