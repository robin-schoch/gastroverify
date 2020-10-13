import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-allgemeine-geschaetsbedienungen',
  templateUrl: './allgemeine-geschaetsbedienungen.component.html',
  styleUrls: ['./allgemeine-geschaetsbedienungen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AllgemeineGeschaetsbedienungenComponent implements OnInit {

  constructor(
      private _bottomSheetRef: MatBottomSheetRef<AllgemeineGeschaetsbedienungenComponent>,
      @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }


  closeBootmSheet(accept: boolean): void {
    this._bottomSheetRef.dismiss({accept: accept});
    event.preventDefault();
  }

}
