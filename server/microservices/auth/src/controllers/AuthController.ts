import { Get, Post, Delete, Route, Body, Header, Query } from 'tsoa';
import AuthService from '../services/AuthService';
import cookie from 'cookie';

interface BodyProps {
  email: string;
  password: string;
}

@Route('/')
export default class AuthController {
  private authService: AuthService;
  constructor() {
    this.authService = new AuthService();
  }

  @Post('/register')
  public async register(@Body() body: BodyProps) {
    const { email, password } = body;
    return this.authService.register(email, password);
  }

  @Post('/login')
  public async login(@Body() body: BodyProps) {
    const { email, password } = body;
    return this.authService.login(email, password);
  }

  @Delete('/logout')
  public async logout(@Header('Cookie') cookies = '') {
    const token = cookie.parse(cookies).refreshToken;
    return this.authService.logout(token);
  }

  @Get('/validate')
  public async validate(@Header('authorization') token: string) {
    await this.authService.validate(token);
  }

  @Get('/refresh')
  public async refresh(@Header('Cookie') cookies = '') {
    const token = cookie.parse(cookies).refreshToken;
    return this.authService.refresh(token);
  }

  @Post('/activate')
  public async activate(@Query() id: string) {
    return this.authService.activate(id);
  }
}
