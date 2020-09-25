export class CheckInError {
  status: number;
  error: string;

  public static create(status, error): CheckInError {
    return new CheckInError(status, error);
  }

  constructor(status: number, error: string) {
    this.status = status;
    this.error = error;
  }
}
