import { animate, style, transition, trigger } from "@angular/animations";

export const slideAnimation = trigger('slide', [
  transition(':enter', [
    style({opacity: 0}),
    animate('300ms ease-in-out', style({opacity: 1}))
  ]),
  transition(':leave', [
    animate('300ms ease-in-out', style({opacity: 0}))
  ])
])