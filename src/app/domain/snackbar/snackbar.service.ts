import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private _snackBar: MatSnackBar) { }


  public error(message: string){
      this._snackBar.open(message, 'close', {
          duration: 5000,
      });
  }


}
