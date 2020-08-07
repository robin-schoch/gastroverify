import {Directive, HostListener} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {Router} from '@angular/router';

@Directive({
    selector: '[appSignOut]'
})
export class SignOutDirective {

    constructor(private authService: AuthenticationService, private router: Router) { }

    @HostListener(
        'click',
        ['$event']
    )
    onClick(e) {
        this.authService.signOut()
    }

}
