import { $enum } from "ts-enum-util";
import EResultCode from "./EResultCode";

export default class ResultCode {
  constructor(private readonly value: EResultCode) {}

  public static successOf() {
    return new ResultCode(EResultCode.OK);
  }

  public static of(value: number) {
    const e = $enum(EResultCode).asValueOrDefault(value, EResultCode.UNKNOWN);
    return new ResultCode(e);
  }

  public code(): EResultCode {
    return $enum(EResultCode).asValueOrDefault(this.value, EResultCode.UNKNOWN);
  }

  public errorCode() {
    return this.value;
  }

  public isSuccess() {
    return this.code() === EResultCode.OK;
  }

  public isFail() {
    return !this.isSuccess();
  }
}
