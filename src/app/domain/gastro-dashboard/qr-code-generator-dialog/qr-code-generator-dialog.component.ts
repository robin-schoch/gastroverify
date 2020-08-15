import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BehaviorSubject} from 'rxjs';
import { environment } from './../../../../environments/environment';

export interface IQRCodeGeneratorData {
    url: string,
    text: string
}


@Component({
    selector: 'app-qr-code-generator-dialog',
    templateUrl: './qr-code-generator-dialog.component.html',
    styleUrls: ['./qr-code-generator-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrCodeGeneratorDialogComponent implements OnInit {

    public qrUrl$: BehaviorSubject<IQRCodeGeneratorData> = new BehaviorSubject<IQRCodeGeneratorData>(null);
    private baseUrl: "https://api.entry-check.ch/v1/checkin/";

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: IQRCodeGeneratorData,
        public dialogRef: MatDialogRef<QrCodeGeneratorDialogComponent>,
    ) {
        this.qrUrl$.next(data);
    }

    ngOnInit(): void {
    }

    generateUrl(code: string): string {
        console.log(environment.qrBaseURL +  code)
        return encodeURI(environment.qrBaseURL +  code)
    }

}
