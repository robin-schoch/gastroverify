import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {Location} from '../gastro.service';
import {
    IQRCodeGeneratorData,
    QrCodeGeneratorDialogComponent
} from '../qr-code-generator-dialog/qr-code-generator-dialog.component';

@Component({
    selector: 'app-choose-qr-code-dialog',
    templateUrl: './choose-qr-code-dialog.component.html',
    styleUrls: ['./choose-qr-code-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChooseQrCodeDialogComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Location,
        public dialog: MatDialog,
    ) { }

    ngOnInit(): void {
    }

    openCheckIn(): void {
        let dialogRef = this.dialog.open(
            QrCodeGeneratorDialogComponent,
            {
                panelClass: 'no-padding-dialog',
                autoFocus: false,
                height: '90vh',
                width: '90vw',
                data: <IQRCodeGeneratorData>{
                    url: `${this.data.checkInCode}?businessName=${this.data.name}`,
                    text: 'checkin',
                    name: this.data.name,
                    type: !!this.data.type ? this.data.type : 'Tisch'
                }
            }
        );
    }

    openCheckOut(): void {
        let dialogRef = this.dialog.open(
            QrCodeGeneratorDialogComponent,
            {
                panelClass: 'no-padding-dialog',
                autoFocus: false,
                height: '90vh',
                width: '90vw',
                data: <IQRCodeGeneratorData>{
                    url: `${this.data.checkOutCode}?businessName=${this.data.name}`,
                    text: 'checkout',
                    name: this.data.name,
                    type: !!this.data.type ? this.data.type : 'Tisch'
                }
            }
        );
    }
}
