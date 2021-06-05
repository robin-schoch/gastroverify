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

import {merge, Observable, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {GastroService} from '../gastro-dashboard/gastro.service';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from '../auth/login-dialog/login-dialog.component';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {filter, map, startWith} from 'rxjs/operators';
import {animate, state, style, transition, trigger,} from '@angular/animations';
import {fadeInGrow, fadeInGrowNoStagger} from '../../util/animation/fadeInGrow';
import {ContentPosition} from './landing-tile/landing-tile.component';
import {Store} from '@ngrx/store';
import {isSignedIn} from '../auth/auth.selectors';

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
      body: 'Durch die Nutzung der Entry Check App ist ein schnelles Check-in garantiert. Für die Besucher ist eine einmalige Registration erforderlich, danach muss nur noch der QR Code gescannt werden. Somit ist eine einfache und schnelle Datenübermittlung der Kunden garantiert. Dabei spielt es keine Rolle, ob sich ein Besucher ursprünglich in Ihrer oder einer anderen Bar, Restaurant oder Kino registriert hat.',
      // de link isch de richtig chlini Kathi
      imageUrl: 'https://images.unsplash.com/photo-1567611888854-8fc5781860c8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
      position: ContentPosition.TOP_LEFT,
      color: '#f5f4f4'
    },
    {
      title: 'Datensicherheit',
      body: 'Bei Entry Check wird die Datensicherheit der Kunden mit absoluter Priorität behandelt. Alle Besucherdaten werden sicher und verschlüsselt abgespeichert. Das Datencenter steht in Frankfurt. Es handelt sich hierbei um ein hoch sicheres und georedundantes Datencenter, welches zu Amazon gehört.',
      imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2244&q=80',
      position: ContentPosition.BOTTOM_LEFT,
      color: '#ffffff'
    },
    {
      title: 'Garantierte Löschung',
      body: 'Bei der Verwendung von Entry Check garantieren wir die Vernichtung der Daten nach Ablauf der Aufbewahrungspflicht; Die Daten werden 14 Tage in der Datenbank gespeichert und danach unwiderruflich gelöst.',
      imageUrl: 'https://images.unsplash.com/photo-1528190336454-13cd56b45b5a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
      position: ContentPosition.TOP_RIGHT,
      color: '#1d1d1d'
    },
    {
      title: 'Apps',
      body: 'Für die Nutzung des Entry Checks stehen Android und iOS Nutzern entsprechende Apps zur Verfügung. Allerdings kann der QR Code auch mit einem alternativen QR Code Scanner verwendet werden. Entry Check setzt somit keine zusätzlich installierte Software voraus.',
      imageUrl: 'https://images.unsplash.com/photo-1480694313141-fce5e697ee25?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
      position: ContentPosition.TOP_RIGHT,
      color: '#b5b5b5'
    },
    {
      title: 'Räumliche Unterteilung',
      body: 'Mit Entry Check können Sie Ihre Räumlichkeiten in weiter, kleinere Bereiche unterteilen. Beispielsweise ist es möglich, verschiedene QR Codes für unterschiedliche Tische, Kinosäle oder einzelne Sektoren zur Verfügung zu stellen. Entry Check ermöglicht so eine noch genauere Lokalisierung, falls es zu einem COVID-19 Fall kommen sollte.',
      imageUrl: 'https://images.unsplash.com/photo-1457364887197-9150188c107b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
      position: ContentPosition.BOTTOM_LEFT,
      color: '#dedede'
    },
    {
      title: 'Pay-as-you go',
      body: 'Bezahlen Sie nur, was Sie brauchen! Entry Check verlangt keine Kündigungs- und Einrichtungsgebühren. Kostenpflichtig ist lediglich die erste Registration des Kunden. Diese gilt für einen Tag und beträgt CHF 0.12. Ist diese Gebühr bezahlt, kann der Besucher innerhalb dieses Tages beliebig oft den QR Code scannen, ohne für Sie erneut kostenpflichtig zu werden.',
      imageUrl: 'https://images.unsplash.com/photo-1459257831348-f0cdd359235f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
      position: ContentPosition.TOP_LEFT,
      color: '#090909'

    },
    {
      title: 'Worauf warten Sie noch',
      body: 'Entry Check ist innerhalb kürzester Zeit eingerichtet. Schreiben Sie uns eine E-Mail an gastro.verify@gmail.com, wir unterstützen Sie bei der Einrichtung Ihres Entry Check Accounts und beraten Sie persönlich.',
      imageUrl: 'https://images.unsplash.com/photo-1583908701673-4cb5f290b548?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
      position: ContentPosition.TOP_RIGHT,
      color: '#1f1f1f'
    }
  ];


  private _subscritpion: Subscription[] = [];

  public isAuthenticated$ = this.store.select(isSignedIn);

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
      private store: Store,
      private router: Router,
      private ngZone: NgZone,
      public dialog: MatDialog,
      private breakpointObserver: BreakpointObserver,
      private route: ActivatedRoute
  ) {


    const breaks = [];
    breaks.push(breakpointObserver.observe([
      Breakpoints.XSmall
    ]).pipe(filter(result => result.matches), map(_ => 1)));
    breaks.push(breakpointObserver.observe([
      Breakpoints.Small
    ]).pipe(filter(result => result.matches), map(_ => 2)));
    breaks.push(breakpointObserver.observe([
      Breakpoints.Medium
    ]).pipe(filter(result => result.matches), map(_ => 2)));
    breaks.push(breakpointObserver.observe([
      Breakpoints.Large
    ]).pipe(filter(result => result.matches), map(_ => 4)));
    // @ts-ignore
    this.gridTiles = merge(
        breaks
    ).pipe(startWith(4));

    breakpointObserver.observe([
      Breakpoints.Large
    ]).pipe(filter(result => result.matches), map(_ => 4)).subscribe(elem => console.log(elem));

    this.gridTiles.subscribe(elem => console.log(elem));
    this.topGridTiles = this.gridTiles.pipe(map(elem => elem > 2));

    this.showIcon = breakpointObserver.observe([
      Breakpoints.HandsetLandscape,
    ]).pipe(map(a => !a.matches));

    this.isHandset = breakpointObserver.observe([
      Breakpoints.HandsetPortrait
    ]).pipe(map(a => a.matches));


  }


  ngOnInit() {

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
    const initAnchor = this.route.snapshot.queryParamMap.get('anchor');


    if (!!initAnchor) this.scrollToAnchor(Number(initAnchor));
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
