
import * as moment from 'moment'

export class RequestError {
  public status: number;
  public message: string;
  public data: any
  public time: string;

  public  static create(status: number, message: string, data?: any){
    return new RequestError(
        status,
        message,
        moment().toISOString()
    )
  }


  constructor(status: number, message: string, time: string, data?:any) {
    this.status = status;
    this.message = message;
    this.time = time;
    this.data = data;
  }
}
