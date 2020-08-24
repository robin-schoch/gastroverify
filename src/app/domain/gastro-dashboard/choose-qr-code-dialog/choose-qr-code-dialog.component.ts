import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IQRCodeGeneratorData, QrCodeGeneratorDialogComponent } from '../qr-code-generator-dialog/qr-code-generator-dialog.component';

@Component({
  selector: 'app-choose-qr-code-dialog',
  templateUrl: './choose-qr-code-dialog.component.html',
  styleUrls: ['./choose-qr-code-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChooseQrCodeDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data,
              public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  openCheckIn(): void {
    let dialogRef = this.dialog.open(
      QrCodeGeneratorDialogComponent,
      {
          autoFocus: false,
          height: '90vh',
          width: '90vw',
          data: <IQRCodeGeneratorData>{
            url: `${this.data.checkInCode}?businessName=${this.data.name}`,
            text: 'checkin',
            name: this.data.name
        }
      }
    );
  }

  openCheckOut(): void {
    let dialogRef = this.dialog.open(
      QrCodeGeneratorDialogComponent,
      {
          autoFocus: false,
          height: '90vh',
          width: '90vw',
          data: <IQRCodeGeneratorData>{
              url: `${this.data.checkOutCode}?businessName=${this.data.name}`,
              text: 'cehckout',
              name: this.data.name
          }
      }
    );
  }
}
