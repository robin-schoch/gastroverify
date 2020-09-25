export class ValidationState {

  public interval;
  public status;
  public reqStatus


  constructor(interval, status, reqStatus) {
    this.interval = interval;
    this.status = status;
    this.reqStatus = reqStatus;
  }
}
