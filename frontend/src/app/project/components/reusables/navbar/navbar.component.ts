import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Input() pagination!:string;
  refreshAlert: boolean = false;
  constructor(public router:Router) { }

  ngOnInit(): void { this.checkDataLastUpdated(); }

  changeNavVisibility(nav:HTMLElement, arrow:HTMLElement){
    if(nav.classList.contains('hidden')) {
      nav.classList.remove('hidden');
      arrow.classList.remove('active');
    } else {
      nav.classList.add('hidden');
      arrow.classList.add('active');
    }
  }

  checkDataLastUpdated(){
    let token = localStorage.getItem('mirror-cup-token');
    if(token) {
      let tokenDecoded:any = jwt_decode(token);
      if(tokenDecoded) {
        let iat = tokenDecoded.iat * 1000;
        let date = new Date().getTime();
        if(iat+3600000<date) this.refreshAlert = true;
      }
    }
  }
}
