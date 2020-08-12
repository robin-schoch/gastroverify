import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ToolbarService} from '../main/toolbar.service';

@Component({
    selector: 'app-gtc',
    templateUrl: './gtc.component.html',
    styleUrls: ['./gtc.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GtcComponent implements OnInit {

    constructor(
        private toolbarService: ToolbarService) { }

    ngOnInit(): void {
        this.toolbarService.toolbarHidden = true;
    }

}
