import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';


export interface IConfirmDialogData {
    message: string

}

@Component({
    selector: 'app-confirmdialog',
    templateUrl: './confirmdialog.component.html',
    styleUrls: ['./confirmdialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmdialogComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<ConfirmdialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: IConfirmDialogData
    ) { }

    ngOnInit(): void {
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
