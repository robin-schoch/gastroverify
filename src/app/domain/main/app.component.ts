import {AfterViewChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ToolbarService} from './toolbar.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = 'verify-manager';
  toolbarTitle$: Observable<string>;
  toolbarHidden$: Observable<boolean>;


  opened: boolean;

  constructor(
    private toolbarService: ToolbarService,
    private changeDetect: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this.toolbarTitle$ = this.toolbarService.toolbarTitle$.asObservable();
    this.toolbarHidden$ = this.toolbarService.toolbarHidden$.asObservable();

    this.toolbarHidden$.subscribe(elem => console.log(elem));
    this.toolbarService.toolbarHidden$.subscribe(elem => console.log('subject'));
  }

  ngAfterViewChecked() {
    this.changeDetect.detectChanges();
  }


}