import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Bar, GastroService} from '../gastro.service';

export interface IAddBarData {

}

@Component({
    selector: 'app-add-bar-dialog',
    templateUrl: './add-bar-dialog.component.html',
    styleUrls: ['./add-bar-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddBarDialogComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: IAddBarData,
        public dialogRef: MatDialogRef<AddBarDialogComponent>,
        private gastroService: GastroService
    ) { }

    public newBar = <Bar>{};

    ngOnInit() {
    }

    addBar() {
        console.log(this.newBar);
        this.gastroService.addBar(this.newBar).then(elem => {
            this.gastroService.gastro = elem;
            this.dialogRef.close();
        }).catch(elem => {
            console.log(elem);
        });

    }
}
