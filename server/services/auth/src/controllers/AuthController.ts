/**
 * @author Eugene Pashkovsky <pashkovskiy.eugen@gmail.com>
 */

import {
  Get,
  Post,
  Delete,
  Route,
  Header,
  Controller,
  SuccessResponse,
  Response,
  BodyProp,
  Path,
} from 'tsoa';
import AuthService from '../services/AuthService';
import cookie from 'cookie';
import ErrorResponse from '../models/interfaces/ErrorResponse';
import PongResponse from '../models/interfaces/PongResponse';
import UserDTO from '../models/interfaces/UserDTO';

let throttlerFlag:boolean = false;

@Route("/api/auth")
export class AuthController extends Controller {
  private authService: AuthService = new AuthService();
  constructor() {
    super();
  }

  @Get("/account")
  public async getAccount(@Header("authorization") authorization = ""): Promise<UserDTO> {
    const token = authorization?.split(" ")[1];
    return this.authService.validate(token);
  }

  @Get("/ping")
  public async ping(): Promise<PongResponse> {
    if (throttlerFlag) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(<PongResponse>{ message: "pong" });
        }, Math.random() * 1000 + 2000)
      });
      
    } else {
      return <PongResponse>{ message: "pong" };
    }
  }

  @Get("/crash")
  public async crashEndpoint() {
    throttlerFlag = true;
    return { message: "pod has been successfully broken" };
  }

  @Post("/validateCredentials")
  @SuccessResponse(200, "OK")
  @Response<ErrorResponse>("400", "Bad request")
  public async validateCredentials(
    @BodyProp() email = "",
    @BodyProp() password = ""
  ) {
    await this.authService.validateCredentials(email, password);
  }

  @Post("/register")
  @SuccessResponse(200, "OK")
  @Response<ErrorResponse>("400", "Bad request")
  @Response<ErrorResponse>("401", "Unauthorized")
  @Response<ErrorResponse>("500", "Unexpected error")
  public async register(@BodyProp() email = "", @BodyProp() password = "") {
    const { accessToken, refreshToken } = await this.authService.register(
      email,
      password
    );
    this.setHeader(
      "Set-Cookie",
      cookie.serialize("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/api",
      })
    );
    return accessToken;
  }

  @Post("/login")
  @SuccessResponse(200, "OK")
  @Response<ErrorResponse>("400", "Bad request")
  @Response<ErrorResponse>("401", "Unauthorized")
  @Response<ErrorResponse>("500", "Unexpected error")
  public async login(@BodyProp() email = "", @BodyProp() password = "") {
    const { accessToken, refreshToken } = await this.authService.login(
      email,
      password
    );
    this.setHeader(
      "Set-Cookie",
      cookie.serialize("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/api",
      })
    );
    return accessToken;
  }

  @Delete("/logout")
  @SuccessResponse(200, "OK")
  @Response<ErrorResponse>("400", "Bad request")
  @Response<ErrorResponse>("500", "Unexpected error")
  public async logout(@Header("Cookie") cookies = "") {
    await this.authService.logout(cookie.parse(cookies).refreshToken);
    this.setHeader(
      "Set-Cookie",
      cookie.serialize("refreshToken", "", {
        httpOnly: true,
        maxAge: 0,
        path: "/api",
      })
    );
  }

  @Get("/validate")
  @SuccessResponse(200, "OK")
  @Response<ErrorResponse>("401", "Unauthorized")
  @Response<ErrorResponse>("500", "Unexpected error")
  public async validate(@Header("authorization") authorization = "") {
    const token = authorization?.split(" ")[1];
    await this.authService.validate(token);
  }

  @Get("/refresh")
  @SuccessResponse(200, "OK")
  @Response<ErrorResponse>("400", "Bad request")
  @Response<ErrorResponse>("401", "Unauthorized")
  @Response<ErrorResponse>("500", "Unexpected error")
  public async refresh(@Header("Cookie") cookies = "") {
    const token = cookie.parse(cookies).refreshToken;
    const { accessToken, refreshToken } = await this.authService.refresh(token);
    this.setHeader(
      "Set-Cookie",
      cookie.serialize("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/api",
      })
    );
    return accessToken;
  }

  @Get("/activate/{id}")
  @SuccessResponse(200, "OK")
  @Response<ErrorResponse>("400", "Bad request")
  public async activate(@Path() id = "") {
    await this.authService.activate(id);
  }
}
