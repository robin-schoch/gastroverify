import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ToolbarService} from '../main/toolbar.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent implements OnInit, AfterViewInit {

  constructor(
    private toolbarService: ToolbarService
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.toolbarService.toolbarHidden = true;
  }

}
