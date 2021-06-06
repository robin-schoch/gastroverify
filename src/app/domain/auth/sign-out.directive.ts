import {Directive, HostListener} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {Router} from '@angular/router';
import {GastroService} from '../../service/gastro.service';
import {signOut} from '../../store/authentication/authentication.action';
import {Store} from '@ngrx/store';

@Directive({
  selector: '[appSignOut]'
})
export class SignOutDirective {

  constructor(
      private router: Router,
      private locationService: GastroService,
      private store: Store
  ) { }

  @HostListener('touchend', ['$event'])
  @HostListener('click', ['$event'])
  onClick(e) {
    // this.authService.signOut();
    this.store.dispatch(signOut());
    this.locationService.clearPartner();
    this.locationService.loaded = false;
  }

}
