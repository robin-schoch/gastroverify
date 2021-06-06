import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {CheckIn} from '../../model/CheckIn';
import {filter, map} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {Location} from '../../model/Location';
import {GastroService} from '../../service/gastro.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {NgForm} from '@angular/forms';
import {selectPartnerLocation} from '../../store/partner/partner.selector';
import {Store} from '@ngrx/store';

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
  private form: NgForm;
  private _location: Location;

  public locations$: Observable<Location[]> = this.store.select(selectPartnerLocation)


  constructor(private store: Store, private _snackBar: MatSnackBar) {

  }


  ngOnInit(): void {

  }

  checkInUser() {
    // TODO fix this
    /*
    if (!!this._location) {
      console.log(this.checkIn$.value);
      this.partnerService.addCustomEntry(this._location, <CheckIn>this.checkIn$.value).subscribe(elem => {
        this.form.resetForm();
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

     */

  }

  selectLocation(value: any) {
    this._location = value;

  }

  locatioSet() {
    return !this._location;
  }
}
