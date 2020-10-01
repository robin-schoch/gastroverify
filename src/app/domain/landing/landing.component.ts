import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {ToolbarService} from '../main/toolbar.service';
import {AuthenticationService} from '../auth/authentication.service';
import {merge, Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {GastroService} from '../gastro-dashboard/gastro.service';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from '../auth/login-dialog/login-dialog.component';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {filter, map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {

  private _subscritpion: Subscription[] = [];
  public isAuthenticated$: Observable<boolean>;

  public gridTiles: Observable<number>;

  public topGridTiles: Observable<boolean>;

  @ViewChild('anchor1')
  public anchor1: ElementRef;

  constructor(
      private toolbarService: ToolbarService,
      private authenticationService: AuthenticationService,
      private gastroService: GastroService,
      private router: Router,
      private ngZone: NgZone,
      public dialog: MatDialog,
      private breakpointObserver: BreakpointObserver
  ) {


    breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large
    ]).subscribe(result => {
      // console.log(result.breakpoints);
    });
    const breaks = [];
    breaks.push(breakpointObserver.observe([
      Breakpoints.XSmall
    ]).pipe(
        filter(result => result.matches),
        map(elem => 1)
    ));
    breaks.push(breakpointObserver.observe([
      Breakpoints.Small
    ]).pipe(
        filter(result => result.matches),
        map(elem => 2)
    ));
    breaks.push(breakpointObserver.observe([
      Breakpoints.Medium
    ]).pipe(
        filter(result => result.matches),
        map(elem => 2)
    ));
    breaks.push(breakpointObserver.observe([
      Breakpoints.Large
    ]).pipe(
        filter(result => result.matches),
        map(elem => 4)
    ));
    // @ts-ignore
    this.gridTiles = merge(
        breaks[0],
        breaks[1],
        breaks[2],
        breaks[3]
    ).pipe(startWith(4));

    this.topGridTiles = this.gridTiles.pipe(map(elem => elem > 2));
  }


  ngOnInit() {
    let a = '';
    this.isAuthenticated$ = this.authenticationService.isAuthenticated$;
    const sub = this.isAuthenticated$.subscribe(is => {
      if (is) {
        this.ngZone.run(() => this.router.navigate(['location/dashboard']));
      } else {
        console.log('no user logged in');
        this.router.navigate(['']);
      }
    });
    this._subscritpion.push(sub);

  }

  ngAfterViewInit(): void {
    this.toolbarService.toolbarHidden = true;

  }

  ngOnDestroy(): void {
    this._subscritpion.forEach(sub => sub.unsubscribe());
  }


  public scrollToLogin(): void {
    this.openConfirmDialog();
    /*
     let valueInVh = 90;
     console.log('scroll');
     document.querySelector('mat-sidenav-content').scrollTop = valueInVh * window.innerHeight / 100;

     */

  }

  public scrollToInfo(): void {
    let valueInVh = 90;
    console.log('scroll');
    this.anchor1.nativeElement.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    //   $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
    //document.querySelector('mat-sidenav-content').scrollTop = valueInVh * window.innerHeight / 100;
  }


  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(
        LoginDialogComponent,
        {panelClass: 'no-padding-dialog'}
    );
  }

}
