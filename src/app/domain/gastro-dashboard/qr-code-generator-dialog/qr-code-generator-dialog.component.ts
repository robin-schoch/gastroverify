import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BehaviorSubject, interval, Subject} from 'rxjs';
import {environment} from './../../../../environments/environment';
import {debounce, skip} from 'rxjs/operators';

var QRCode = require('qrcode');

export interface IQRCodeGeneratorData {
    url: string,
    text: string,
    name: string,
}


@Component({
    selector: 'app-qr-code-generator-dialog',
    templateUrl: './qr-code-generator-dialog.component.html',
    styleUrls: ['./qr-code-generator-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class QrCodeGeneratorDialogComponent implements OnInit, AfterViewInit {

    public qrUrl$: BehaviorSubject<IQRCodeGeneratorData> = new BehaviorSubject<IQRCodeGeneratorData>(null);
    private baseUrl: 'https://api.entry-check.ch/v1/checkin/';

    @ViewChild('canvas')
    canvas: ElementRef<HTMLCanvasElement>;

    /* @ViewChild('code')
     code: ElementRef<HTMLCanvasElement>;
     */

    public ctx: CanvasRenderingContext2D;
    private images: HTMLImageElement[] = [
        null,
        null
    ];
    private loadingTracker: Subject<void> = new Subject<void>();
    private tableNumber$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: IQRCodeGeneratorData,
        public dialogRef: MatDialogRef<QrCodeGeneratorDialogComponent>,
    ) {
        this.qrUrl$.next(data);
    }

    ngOnInit(): void {

        this.loadingTracker.pipe(skip(2)).subscribe(elem => {
            this.generateImage();
            this.loadingTracker.complete();
        });
        this.tableNumber$.pipe(debounce(() => interval(200)))
            .subscribe(elem => this.generateImage(elem));
        let baseImage = new Image(
            525,
            742
        );
        this.images[0] = baseImage;

        if (this.data.text === "checkin"){
            baseImage.src = 'assets/checkIn_shape.jpeg';
        } else {
            baseImage.src = 'assets/checkOut_shape.png';
        }

        baseImage.onload = () => {
            this.loadingTracker.next();
        };
        this.generateCode();


    }

    generateCode(table?: number) {

        let sub = new Subject();
        let qrCodeImage = new Image(
            350,
            350
        );
        this.images[1] = null;
        this.images[1] = qrCodeImage;
        let a = table ?
                this.generateUrlWithTable(
                    this.data.url,
                    table
                ) :
                this.generateUrl(this.data.url);

        let options = {
            width: 330,
            margin: 1
        };
        QRCode.toDataURL(
            a,
            options,
            (err, string) => {
                if (err) throw err;
                qrCodeImage.src = string;
                qrCodeImage.onload = () => {
                    this.loadingTracker.next();
                    sub.next();
                    sub.complete();
                };
                // this.ctx.drawImage(string, 0, 0);
            }
        );
        return sub.asObservable();
    }

    ngAfterViewInit() {
        //this.code.nativeElement.get

        this.ctx = this.canvas.nativeElement.getContext('2d');
        this.loadingTracker.next();
    }

    generateImage(table?: number) {

        this.generateCode(table).subscribe(elem => {
            this.ctx.drawImage(
                this.images[0],
                0,
                0
            );
            this.ctx.drawImage(
                this.images[1],
                35,
                105
            );

            if (table) {
                this.ctx.font = '30px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(
                    'Tisch ' + table,
                    200,
                    540
                );
            } else {
                this.ctx.font = '30px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(
                    this.data.name,
                    200,
                    540
                );
            }

        });

    }

    generateUrlWithTable(code: string, table: number) {
        let query = environment.qrBaseURL + code + '&table=' + table;
        // console.log(query);
        return encodeURI(query);

    }

    generateUrl(code: string): string {

        return encodeURI(environment.qrBaseURL + code);
    }

    download() {
        let dataname = this.tableNumber$.getValue() ?
                       this.data.name + '_' + this.tableNumber$.getValue() :
                       this.data.name;
        const link = document.createElement('a');
        link.download = dataname + '.png';
        link.href = this.canvas.nativeElement.toDataURL();
        link.click();
    }

    setTableNumber(value: string) {

        this.tableNumber$.next(Number(value));
    }
}
