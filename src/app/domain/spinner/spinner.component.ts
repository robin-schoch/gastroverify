import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent implements OnInit {

    constructor() { }

    @Input()
    data$: Observable<any>

    ngOnInit(): void {
    }

}
