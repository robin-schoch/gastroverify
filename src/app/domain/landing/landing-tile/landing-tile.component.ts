import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingTileComponent implements OnInit {

  public contentPosition =  ContentPosition;

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
  public fontColor: string = 'white'

  @Output()
  public scrollTo = new EventEmitter<Number>();



  constructor() { }

  ngOnInit(): void {
  }

}
