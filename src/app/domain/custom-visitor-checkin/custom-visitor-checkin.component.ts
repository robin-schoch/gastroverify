import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CheckIn} from '../../model/CheckIn';
import {filter, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Location} from '../../model/Location';
import {GastroService} from '../gastro-dashboard/gastro.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-custom-visitor-checkin',
  templateUrl: './custom-visitor-checkin.component.html',
  styleUrls: ['./custom-visitor-checkin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomVisitorCheckinComponent implements OnInit {

  public checkIn: Partial<CheckIn> = {
    checkIn: true
  };

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
      console.log(this.checkIn);
      this.partnerService.addCustomEntry(this._location, <CheckIn>this.checkIn).subscribe(elem => {
        this._snackBar.open('Besucher hinzugefügt', 'ok', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.checkIn = {};
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
