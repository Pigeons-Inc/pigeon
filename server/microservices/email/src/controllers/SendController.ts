import { Body, Controller, Post, Response, Route, SuccessResponse } from 'tsoa';
import ErrorResponse from '../interfaces/ErrorResponse';
import SendActivationDto from '../interfaces/SendActivationDto';
import SendService from '../services/SendService';

@Route('send')
export class SendController extends Controller {
  private sendService: SendService = new SendService();

  constructor() {
    super();
  }

  @Post('/activation')
  @SuccessResponse(200, 'OK')
  @Response<ErrorResponse>('400', 'Bad request')
  public async sendActivation(@Body() dto: SendActivationDto) {
    await this.sendService.activation(dto);
  }
}
