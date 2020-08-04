import {Injectable, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToolbarService {

  public toolbarTitle$: BehaviorSubject<string> = new BehaviorSubject<string>('Welcome');
  public toolbarHidden$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  public set toolbarTitle(title: string) {
    this.toolbarTitle$.next(title);
  }

  public set toolbarHidden(hidden: boolean) {
    this.toolbarHidden$.next(hidden);
  }


}
