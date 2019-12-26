import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { ActivatedRoute } from '@angular/router';
import { AppUser } from './models/app-user';
import { UserService } from './user.service';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { Observable, from } from 'rxjs'
@Injectable()
export class AuthService {
  user$: Observable<firebase.User>;
  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute) { 
    this.user$ = afAuth.authState;
  }
  login(){
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout(){
    this.afAuth.auth.signOut();
  }
  get appUser$() : Observable<AppUser>{
    return this.user$.switchMap((user)=>{
      if(user)
         return this.userService.get(user.uid).valueChanges();
      else
      return Observable.of(null);
    });
  }
}
