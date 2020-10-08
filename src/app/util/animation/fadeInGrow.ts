import {animate, query, stagger, style, transition, trigger} from '@angular/animations';

export const fadeInGrow = trigger('fadeInGrow', [
  transition(':enter',
      query('button, h1, pre, span', [
            style({opacity: 0, transform: 'scale(1) translateY(50px)'}),
            stagger('100ms', [
              animate('500ms', style({opacity: 1, transform: 'scale(1) translateY(0)'}))
            ])
          ]
      )
  )
]);

export const fadeInGrowNoStagger = trigger('fadeInGrowNoStagger', [
  transition(':enter',
      query('*', [
            style({transform: 'scale(0.5) translateY(50px)'}),
            animate('100ms', style({transform: 'scale(1) translateY(0)'}))
          ]
      )
  )
]);

export const testFadein = trigger('testFadein', [
  transition(':enter', [
    style({opacity: 0, transform: 'translateY(10px)'}),
    animate('1000ms', style({opacity: 1, transform: 'translateY(0)'})),
  ]),
  transition(':leave', [
    animate('500ms', style({opacity: 0, transform: 'translateY(10px)'})),
  ]),
]);


export const testq = trigger('testq', [
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

