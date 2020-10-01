import {animate, query, stagger, style, transition, trigger} from '@angular/animations';

export const upAndDonw = trigger('fadeInGrow', [
  transition(':enter',
      query('*', [
            style({opacity: 0}),
            stagger('1000ms', [
              animate('2000ms', style({opacity: 1}))
            ])
          ]
      )
  )
]);
