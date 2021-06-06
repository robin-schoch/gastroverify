import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {setToolbarHidden} from '../../store/context/context.action';

@Component({
    selector: 'app-gtc',
    templateUrl: './gtc.component.html',
    styleUrls: ['./gtc.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GtcComponent implements OnInit {
    public userLang: string;

    constructor(
        private store: Store) { }

    ngOnInit(): void {
      this.store.dispatch(setToolbarHidden({hidden: true}))

    }
}
