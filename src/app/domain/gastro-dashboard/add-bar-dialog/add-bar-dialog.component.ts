import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {GastroService, Location} from '../gastro.service';
import {SnackbarService} from '../../snackbar/snackbar.service';

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
        private gastroService: GastroService,
        private snackBar: SnackbarService
    ) { }

    public newLocation = <Location>{};

    public reg = new RegExp('^[A-z0-9]*');

    ngOnInit() {
    }

    addBar() {
        console.log(this.newLocation);
        this.gastroService.addBar(this.newLocation).then(elem => {
            this.gastroService.gastro = elem;
            this.dialogRef.close();
        }).catch(elem => {
            this.snackBar.error(elem);
            console.log(elem);

        });

    }
}
