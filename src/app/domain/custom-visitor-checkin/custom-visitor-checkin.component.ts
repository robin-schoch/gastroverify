import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {CheckIn} from '../../model/CheckIn';
import {filter, map} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {Location} from '../../model/Location';
import {GastroService} from '../gastro-dashboard/gastro.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-custom-visitor-checkin',
  templateUrl: './custom-visitor-checkin.component.html',
  styleUrls: ['./custom-visitor-checkin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomVisitorCheckinComponent implements OnInit {

  public checkIn$: BehaviorSubject<Partial<CheckIn>> = new BehaviorSubject<Partial<CheckIn>>({
    checkIn: true
  });

  @ViewChild('signInFrom')
  private form:  NgForm;
  private _location: Location;

  public locations$: Observable<Location[]>;


  constructor(private partnerService: GastroService, private _snackBar: MatSnackBar) {
    this.partnerService.getPartner().subscribe(
        elem => this.partnerService.gastro = elem,
        error => this.partnerService.error = error
    );
    this.locations$ = this.partnerService.gastro$.pipe(
        filter(p => !!p),
        map(p => p.locations)
    );
  }


  ngOnInit(): void {

  }

  checkInUser() {
    if (!!this._location) {
      console.log(this.checkIn$.value);
      this.partnerService.addCustomEntry(this._location, <CheckIn>this.checkIn$.value).subscribe(elem => {
        this._snackBar.open('Besucher hinzugefügt', 'ok', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.checkIn$.next({
          checkIn: true
        });
      }, error => {
        this._snackBar.open('Fehler', 'ok', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      });
    }

  }

  selectLocation(value: any) {
    this._location = value;

  }

  locatioSet() {
    return !this._location;
  }
}
