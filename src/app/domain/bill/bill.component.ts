import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BillComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
