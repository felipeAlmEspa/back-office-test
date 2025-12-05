import { IUserInformation } from "@itsa-develop/itsa-fe-components";

export interface IResponseGeneric {
  code: number;
  message: string;
  result: unknown;
}
export interface ICheckSessionResponse {
  code: number;
  message: string;
  result: ICheckSessionResult[];
}

export interface ICheckSessionResult {
  code: string;
  startHour: string;
  ipAddress: string;
  userAgent: string;
}


export interface ICheckSessionRequest {
  username: string;
  password: string;
}

export interface ICloseSessionRequest {
  session: string;
}

export interface ILoginRequest {
  username: string;
  password: string;
}

export interface ILoginResponse {
  code: number;
  message: string;
  result: string;
}

export interface IExchangeCodeRequest {
  claimCode: string;
}

export interface IExchangeCodeResponse {
  code: number;
  message: string;
  result: IExchangeCodeResponseResult;
}

export interface IExchangeCodeResponseResult {
  refresh: string;
    access: string;
}

export interface IValidateRouteRequest {
  path: string;
  agencyId: number;
}

export interface IValidateRouteResponse {
  code: number;
  message: string;
  result: boolean;
}

export interface RefreshTokenResponse {
  result: {
    access: string;
    refresh: string;
  };
}

export interface IMicroFrontendsResponse {
  code: number;
  message: string;
  result: {
    microFrontends: string[];
  };
}

export interface IMicroFrontendsRequest {
  agenId: number;
}


export interface IUserInformationResponse {
  code: number;
  message: string;
  result: IUserInformation;
}


export interface IRole {
  name: string;
}




