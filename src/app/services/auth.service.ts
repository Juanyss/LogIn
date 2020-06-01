import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';

import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts:';
  private apiKey = 'AIzaSyD5owHtB_Yb-CY990f-2fEwRgfomTXovAM'

  userToken: string;

  //Create new users
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

  //Login users
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor(private http: HttpClient) {
    this.readToken();
  }

  logOut() {
    localStorage.removeItem('token');
  }

  logIn(user: UsuarioModel) {
    const authData = {
      ...user,
      returnSecureToken: true,
    };

    return this.http.post(
      `${this.url}signInWithPassword?key=${this.apiKey}`,
      authData
    ).pipe(map(resp => {
      this.saveToken(resp['idToken'],resp['expiresIn']);
      return resp;
    }))
  }

  newUser(user: UsuarioModel) {
    const authData = {
      ...user,
      returnSecureToken: true,
    };

    return this.http.post(
      `${this.url}signUp?key=${this.apiKey}`,
      authData
    ).pipe(map(resp => {
      this.saveToken(resp['idToken'],resp['expiresIn']);
      return resp;
    }))
  }


  private saveToken(idToken: string, expiresIn: number) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds(expiresIn);

    localStorage.setItem('expires', hoy.getTime().toString());
  }

  readToken(){
    if(localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

  loged(){
    if(this.userToken.length <2){
      return false;
    }

    const expire = Number(localStorage.getItem('expires'));

    const tokenExpira = new Date();
    tokenExpira.setTime(expire)

    if(tokenExpira > new Date()){
      return true;
    }

    return this.userToken.length > 2
  }
}
