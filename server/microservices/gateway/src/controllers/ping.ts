import { Get, Route } from 'tsoa';

@Route('/ping')
export default class PingController {
  @Get('/')
  public static async getMessage() {
    return { message: 'pong' };
  }
}
