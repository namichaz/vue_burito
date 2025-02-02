import EHttpStatusCode from "./EHttpStatusCode";
import { $enum } from "ts-enum-util";

export default class HttpStatus {
  constructor(private readonly value: number) {}

  public code(): EHttpStatusCode {
    return $enum(EHttpStatusCode).asValueOrDefault(
      this.value,
      EHttpStatusCode.UNKNOWN
    );
  }

  public isSuccess() {
    return this.code() === EHttpStatusCode.OK;
  }

  public isSessionInvalid() {
    return this.code() === EHttpStatusCode.UNAUTHORIZED;
  }

  public isError() {
    return this.code() === EHttpStatusCode.INTERNAL_SERVER_ERROR;
  }
}
