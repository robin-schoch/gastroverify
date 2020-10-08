import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {fadeInGrow} from '../../../util/animation/fadeInGrow';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

export enum ContentPosition {
  TOP_LEFT,
  TOP_RIGHT,
  TOP_CENTER,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
  BOTTOM_CENTER,

}

@Component({
  selector: 'app-landing-tile',
  templateUrl: './landing-tile.component.html',
  styleUrls: ['./landing-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    fadeInGrow,
  ]
})
export class LandingTileComponent implements OnInit {

  public contentPosition = ContentPosition;

  @Input()
  public backgroundUrl: string;

  @Input()
  public titleText: string;

  @Input()
  public bodyText: string;

  @Input()
  public nextElem: number;

  @Input()
  public lastElem: number;

  @Input()
  public position: ContentPosition;

  @Input()
  public fontColor: string = 'white';

  @Output()
  public scrollTo = new EventEmitter<Number>();

  public smallText: Observable<boolean>;
  public copyUrl: string;


  constructor(
      private breakpointObserver: BreakpointObserver,
      private _snackBar: MatSnackBar
  ) {
    this.smallText = breakpointObserver.observe([
      Breakpoints.HandsetPortrait,
      Breakpoints.HandsetLandscape
    ]).pipe(
        //  tap(elem => console.log(elem)),
        map(a => a.matches));

  }

  ngOnInit(): void {
    this.smallText.subscribe(elem => console.log(elem));


  }

  openCopyUrlSnackbar() {
    this._snackBar.open('Link kopiert', 'ok', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  getAnchorURl() {

    return window.location.href.split('?')[0] + '?anchor=' + (this.nextElem - 1);
  }

}
