export default class APIResult {
  constructor(private readonly resultCode: string) {}

  public static of(resultCode: string) {
    return new APIResult(resultCode);
  }

  public static successOf() {
    return new APIResult("");
  }

  public static sessionInvalidOf() {
    return new APIResult("A001");
  }

  public static errorOf() {
    return new APIResult("X001");
  }

  public code(): string {
    return this.resultCode;
  }

  public isSuccess() {
    return this.resultCode === "" || this.resultCode === "Z001";
  }

  public isFailed() {
    return !this.isSuccess();
  }

  public isSessionInvalid() {
    return this.resultCode === "A001";
  }
}
