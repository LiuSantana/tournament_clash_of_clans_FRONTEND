import { Component, OnInit } from '@angular/core';
import { PageState } from 'src/app/project/module/implementations/angular_objects/PageState';
import { Session } from 'src/app/project/module/implementations/angular_objects/Session';
import { ASession } from 'src/app/project/services/API/session/ASession';

import jwt_decode from 'jwt-decode';
import { AClan } from 'src/app/project/services/API/clan/AClan';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  pageState:PageState = new PageState();
  session:Session = new Session();
  loadingBar!:string;
  clan!:string | null;
  tag!:string | null;

  constructor(private ASession:ASession, private AClan:AClan, private Router:Router) { }

  ngOnInit(): void {
    this.sessionManagement();
  }

  decodeToken(token:string) {
    let tokenDecoded;
    try {
        tokenDecoded = jwt_decode(token);
    } catch (error) {
        console.error('Error al decodificar el token:', error);
    }
    return tokenDecoded;
}

  /********************
   * ACCOUNT MANAGEMENT
   *******************/
  sessionManagement() {
    let token = localStorage.getItem('mirror-cup-token');
    if(token) {
      if(token == "undefined"){
        this.pageState.defaultState();
        this.closeSession();
      } else {
        this.pageState.defaultState();
        let tokenDecoded:any = this.decodeToken(token);
        this.clan = tokenDecoded.clan;
        this.tag = tokenDecoded.tag;
      }
    } else this.pageState.defaultState();
  }

  closeSession() {
    localStorage.removeItem("mirror-cup-teams");
    localStorage.removeItem("mirror-cup-my-team");
    localStorage.removeItem("mirror-cup-token");
    this.clan = null;
    this.tag = null;
    this.pageState.defaultState();
  }


  /********************
   * LOGIN ACTIONS
   *******************/
  async getTeam(button:HTMLElement, error:HTMLDivElement, user:string, password:string) {
    button.classList.add('loading');

    let token = await this.session.getToken(this.ASession, {user, password});
    localStorage.setItem('mirror-cup-token', token.token);
    button.classList.remove('loading');
    if(!token.error) {
      error.classList.add('hide');
      this.pageState.defaultState();
      token = this.decodeToken(token.token);
      this.clan = token.clan;
      this.tag = token.tag;
    } else {
      error.classList.remove('hide');
      error.innerHTML = token.error;
    }
  }

  async login() {
    this.pageState.loadingState();
    this.loadingBar = 'loading';
    let session = await this.session.getAllData(this.AClan,this.ASession, this.tag);
    setTimeout(() => {
      if(session) {
        this.loadingBar = 'loaded';
        setTimeout(() => {this.Router.navigate(['/teams']);}, 500);
      } else {
        this.pageState.defaultState();
      }
    }, 2000);
  }
  
  async getLocalStorageItems() {
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

}
