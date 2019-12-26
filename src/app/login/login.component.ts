import { Component, OnInit, Injectable } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
@Injectable()
export class LoginComponent {
  user: firebase.User;
  constructor(private auth: AuthService) {
  }

  login(){
    this.auth.login();
  }
  
}
