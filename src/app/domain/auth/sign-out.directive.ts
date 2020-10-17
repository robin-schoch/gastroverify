import {Directive, HostListener} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {Router} from '@angular/router';
import {GastroService} from '../gastro-dashboard/gastro.service';

@Directive({
  selector: '[appSignOut]'
})
export class SignOutDirective {

  constructor(
      private authService: AuthenticationService,
      private router: Router,
      private locationService: GastroService
  ) { }

  @HostListener('touchend', ['$event'])
  @HostListener('click', ['$event'])
  onClick(e) {

    this.authService.signOut();
    this.authService.role = [];
    this.locationService.clearPartner();
    this.locationService.loaded = false;
  }

}
