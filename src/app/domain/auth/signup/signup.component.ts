import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {SignUp} from '../sign-up';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit {

  public newUser$: BehaviorSubject<SignUp> = new BehaviorSubject<SignUp>(new SignUp());

  constructor() { }

  ngOnInit() {
  }

  clearForm() {

  }

  signUp() {

  }
}
