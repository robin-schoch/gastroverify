import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-gastro-dashboard',
  templateUrl: './gastro-dashboard.component.html',
  styleUrls: ['./gastro-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GastroDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
