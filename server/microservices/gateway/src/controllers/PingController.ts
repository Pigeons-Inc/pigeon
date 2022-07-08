import { Get, Route } from 'tsoa';

interface IPingResponse {
  message: 'pong';
}

@Route('/api/ping')
export default class PingController {
  @Get('/')
  public static async getMessage() {
    const response: IPingResponse = { message: 'pong' };
    return response;
  }
}
