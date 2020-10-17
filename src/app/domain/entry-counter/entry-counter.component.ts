import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {GastroService} from '../gastro-dashboard/gastro.service';
import {filter, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Location} from '../../model/Location';

@Component({
  selector: 'app-entry-counter',
  templateUrl: './entry-counter.component.html',
  styleUrls: ['./entry-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryCounterComponent implements OnInit {

  public locations$: Observable<Location[]>;

  public hours: number = 6;

  constructor(
      private partnerService: GastroService,
  ) { }

  ngOnInit(): void {
    this.partnerService.getPartner().subscribe(
        elem => this.partnerService.gastro = elem,
        error => this.partnerService.error = error
    );
    this.locations$ = this.partnerService.gastro$.pipe(
        filter(p => !!p),
        map(p => p.locations)
    );
  }

  selectLocation(value: any) {
    this.getCounter(value);

  }


  getCounter(location: Location) {
    this.partnerService.getCounter(location, this.hours).subscribe(elem => console.log(elem));
  }
}
