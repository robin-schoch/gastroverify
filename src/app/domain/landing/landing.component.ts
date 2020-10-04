import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
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
import {animate, state, style, transition, trigger,} from '@angular/animations';
import {fadeInGrow, fadeInGrowNoStagger} from '../../util/animation/fadeInGrow';
import {ContentPosition} from './landing-tile/landing-tile.component';

export interface LandingTile {
  title: string,
  body: string,
  imageUrl: string,
  position: ContentPosition,
  color?: string
}


@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInTitle',
        [
          state('out', style({
            opacity: 0
          })),
          state('in', style({
            opacity: 1
          })),
          transition('void => in', [animate('1s')])
        ]),
    fadeInGrow,

    fadeInGrowNoStagger
  ]
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {


  public landingTiles: LandingTile[] = [
    {
      title: 'Schneller Check-in',
      body: 'Ein Besucher welcher sich mit Entry Check einmal angemeldet hat, muss bei der zweiten Anmeldung seine Daten nicht nochmals angegeben. Dabei spielt es keine Rolle ob sich ein Besucher ursprünglich in ihrere oder einer anderen Bar, Restaurant oder Kino registiert hat.',
      imageUrl: 'https://images.unsplash.com/photo-1524408504872-4d40d453c67f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
      position: ContentPosition.BOTTOM_RIGHT,
    },
    {
      title: 'Datensicherheit',
      body: 'Alle Besucherdaten werden sicher und verschlüsselt abgespeichert.',
      imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2244&q=80',
      position: ContentPosition.BOTTOM_LEFT,
      color: '#ffffff'
    },
    {
      title: 'Garantierte Löschung',
      body: 'Entry Check garantiert das die Besucherdaten nach ablauf der Aufbewahrungspflicht von 14 Tagen vernichtet werden.',
      imageUrl: 'https://images.unsplash.com/photo-1511189330313-b0af599a6f5a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
      position: ContentPosition.TOP_LEFT,
      color: '#ffffff'
    },
    {
      title: 'Apps',
      body: 'Android und iOS Apps sind verfügbar, aber mit einem herkömmlichen QR-Code Scanner von einem Smartphone geht es genau so schnell wie mit der App. Es ist keine zusätzliche Installation von Software nötig!',
      imageUrl: 'https://images.unsplash.com/photo-1480694313141-fce5e697ee25?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
      position: ContentPosition.TOP_RIGHT,
      color: '#b5b5b5'
    },
    {
      title: 'Räumliche Unterteilung',
      body: 'Mit Entry Check können sie optional ihre Bar, Restaurant oder Kino Räumlich unterteilen und QR-Codes für Tisch, Sektoren usw. generieren.',
      imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2252&q=80',
      position: ContentPosition.TOP_LEFT,
      color: '#000000'
    },
    {
      title: 'Pay-as-you go',
      body: 'Bezahlt nur was du brauchst! Entry Check verlangt keine Kündigungs- und Einrichtungsgebühren. Verrechnet werden CHF 0.15 pro einmaligem Besucher am Tag. Scanned ein besucher ihren Code mehrfach ein bezahlen sie nicht doppelt. Scanend sich niemand ein oder sie deaktivieren ihren Standort weil sie das System nicht mehr benötigen, so bezahlen sie auch nichts.',
      imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2251&q=80',
      position: ContentPosition.TOP_RIGHT,
      color: '#ececec'

    },
    {
      title: 'Bereit wenn sie es sind',
      body: 'Entry Check ist innert kürzester Zeit eingerichtet. Account erstellen, einen Standort hinzufügen, QR-Codes ausdrucken - Fertig!',
      imageUrl: 'https://images.unsplash.com/photo-1583908701673-4cb5f290b548?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
      position: ContentPosition.TOP_LEFT,
      color: '#1f1f1f'
    }
  ];

  private _subscritpion: Subscription[] = [];
  public isAuthenticated$: Observable<boolean>;

  public gridTiles: Observable<number>;

  public topGridTiles: Observable<boolean>;

  public showIcon: Observable<boolean>;

  @ViewChild('top')
  public top: ElementRef;

  @ViewChildren('anchor', {read: ElementRef})
  private anchors: QueryList<ElementRef>;

  public isHandset: Observable<boolean>;

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

    this.showIcon = breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
    ]).pipe(map(a => !a.matches));

    this.isHandset = breakpointObserver.observe([
      Breakpoints.HandsetPortrait
    ]).pipe(map(a => a.matches));

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


  public scrollToAnchor(anchor: number): void {
    if (anchor < 0) {
      this.top.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    } else {
      this.anchors.toArray()[anchor].nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  }

  public scrollToLogin(): void {
    this.openConfirmDialog();
    /*
     let valueInVh = 90;
     console.log('scroll');
     document.querySelector('mat-sidenav-content').scrollTop = valueInVh * window.innerHeight / 100;

     */

  }


  openConfirmDialog(): void {
    const dialogRef = this.dialog.open(
        LoginDialogComponent,
        {panelClass: 'no-padding-dialog'}
    );
  }

  openMail() {
    window.open('mailto:gastro.verify@gmail.com?subject=Entry Check - Sign up');
  }
}
