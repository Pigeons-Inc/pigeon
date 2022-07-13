import {
  Get,
  Post,
  Delete,
  Route,
  Body,
  Header,
  Query,
  Controller,
  SuccessResponse,
  Put,
  Response,
} from 'tsoa';
import AuthService from '../services/AuthService';
import cookie from 'cookie';
import ErrorResponse from '../models/interfaces/ErrorResponse';
import BodyProps from '../models/interfaces/BodyProps';
import PongResponse from '../models/interfaces/PongResponse';

@Route('/')
export class AuthController extends Controller {
  private authService: AuthService = new AuthService();
  constructor() {
    super();
  }

  @Get('/ping')
  public async ping() {
    return <PongResponse>{ message: 'pong' };
  }

  @Post('/validateCredentials')
  @SuccessResponse(200, 'OK')
  @Response<ErrorResponse>('400', 'Bad request')
  public async validateCredentials(@Body() body: BodyProps) {
    const { email, password } = body;
    await this.authService.validateCredentials(email, password);
  }

  @Post('/register')
  @SuccessResponse(200, 'OK')
  @Response<ErrorResponse>('400', 'Bad request')
  @Response<ErrorResponse>('401', 'Unauthorized')
  @Response<ErrorResponse>('500', 'Unexpected error')
  public async register(@Body() body: BodyProps) {
    const { email, password } = body;
    const { accessToken, refreshToken } = await this.authService.register(
      email,
      password
    );
    this.setHeader(
      'Set-Cookie',
      cookie.serialize('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/api',
      })
    );
    return accessToken;
  }

  @Post('/login')
  @SuccessResponse(200, 'OK')
  @Response<ErrorResponse>('400', 'Bad request')
  @Response<ErrorResponse>('401', 'Unauthorized')
  @Response<ErrorResponse>('500', 'Unexpected error')
  public async login(@Body() body: BodyProps) {
    const { email, password } = body;
    const { accessToken, refreshToken } = await this.authService.login(
      email,
      password
    );
    this.setHeader(
      'Set-Cookie',
      cookie.serialize('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/api',
      })
    );
    return accessToken;
  }

  @Delete('/logout')
  @SuccessResponse(200, 'OK')
  @Response<ErrorResponse>('400', 'Bad request')
  @Response<ErrorResponse>('500', 'Unexpected error')
  public async logout(@Header('Cookie') cookies = '') {
    await this.authService.logout(cookie.parse(cookies).refreshToken);
    this.setHeader(
      'Set-Cookie',
      cookie.serialize('refreshToken', '', {
        httpOnly: true,
        maxAge: 0,
        path: '/api',
      })
    );
  }

  @Get('/validate')
  @SuccessResponse(200, 'OK')
  @Response<ErrorResponse>('401', 'Unauthorized')
  @Response<ErrorResponse>('500', 'Unexpected error')
  public async validate(@Header('authorization') authorization = '') {
    const token = authorization?.split(' ')[1];
    await this.authService.validate(token);
  }

  @Get('/refresh')
  @SuccessResponse(200, 'OK')
  @Response<ErrorResponse>('400', 'Bad request')
  @Response<ErrorResponse>('401', 'Unauthorized')
  @Response<ErrorResponse>('500', 'Unexpected error')
  public async refresh(@Header('Cookie') cookies = '') {
    const token = cookie.parse(cookies).refreshToken;
    const { accessToken, refreshToken } = await this.authService.refresh(token);
    this.setHeader(
      'Set-Cookie',
      cookie.serialize('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: '/api',
      })
    );
    return accessToken;
  }

  @Put('/activate')
  @SuccessResponse(200, 'OK')
  @Response<ErrorResponse>('400', 'Bad request')
  public async activate(@Query() id: string) {
    await this.authService.activate(id);
  }
}
