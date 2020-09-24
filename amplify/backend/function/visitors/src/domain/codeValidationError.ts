export class CodeValidationError {
  public errorMessage: string;
  public errorStatus: number;
  public remaining: number;

  public static create(message: string, status: number, remaining: number = -1) {
    return new CodeValidationError(message, status, remaining);
  }


  constructor(errorMessage: string, errorStatus: number, remaining: number) {
    this.errorMessage = errorMessage;
    this.errorStatus = errorStatus;
    this.remaining = remaining;
  }
}
