import { Component, OnInit } from '@angular/core';
import { PageState } from 'src/app/project/module/implementations/angular_objects/PageState';
import { AWar } from 'src/app/project/services/API/war/AWar';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  pageState:PageState = new PageState();
  group:string = 'A';
  week:number = 1;
  weeks:any = Array(7).fill(0);
  screen:number = screen.width > 1023 ? 5 : 3;
  war!:any;
  admin:boolean = false;

  matches!:any;
  allMatches:any = [];
  attacks!:any;

  modifiedAttacks:any = [];


  constructor(private AWar:AWar) {
    this.getWars();
    let token = localStorage.getItem('mirror-cup-token');
    if(token) {
      let clan:any = jwt_decode(token);
      if (clan.tag == '#0000') this.admin = true;
    }
  }

  ngOnInit(): void {}

  async getWars() {
    let wars = await this.AWar.getAllWars().toPromise();
    
    let warsArr:any = wars.data.filter((w:any) => w.fase == 1);
    this.allMatches = warsArr;
    this.setMatches();
  }

  setMatches() {
    this.matches = this.allMatches.filter((w:any) => w.round == this.week.toString());
    this.matches = this.matches.filter((w:any) => w.tournament_group == this.group);
  }

  async setWar(war:any) { 
    this.war = war;

    try{
      let attacks = await this.AWar.getWarAttacks(war.id).toPromise();

      let clan = attacks.data.filter((a:any) => a.clan == war.clan_A);
      let opponent = attacks.data.filter((a:any) => a.clan == war.clan_B);
      this.attacks = {clan, opponent}
      
    } catch(e) {
      this.attacks = {};
    }
  }

  async endWar(btn:HTMLButtonElement, error:HTMLDivElement){
    btn.classList.add('loading');
    try {
      let result = await this.AWar.endWar(this.war.id).toPromise();
      if(result) {
        let war = await this.AWar.getEndedWar(this.war.id).toPromise();
        if(war) {
          this.war = war.data[0];
          this.setWar(war.data[0]);
        }
      }
      error.classList.add('hide');
      this.getWars();
    } catch(e:any) {
      error.innerHTML = e.error.error
      error.classList.remove('hide');
    }
    btn.classList.remove('loading');
  }

  modifyAttack(attack:any) {
    let position = this.modifiedAttacks.indexOf(attack.id);
    if(position != -1){
      this.modifiedAttacks.splice(position, 1);
    }
    this.modifiedAttacks.push(attack);
  }
  saveAttacks(){
    if(this.modifiedAttacks.length > 0) {
      
    }
  }

  setActive(groupBox:HTMLDivElement, group:HTMLDivElement){
    if(!group.classList.contains('active')) {
      groupBox.querySelector('.active')?.classList.remove('active');
      group.classList.add('active');
    }
  }

  previousWeek(weeksBox:HTMLDivElement){
    if(weeksBox.querySelector('div:first-child')?.classList.contains('hide')){
      let firtShownElement:any = weeksBox.querySelector('div:not(.hide)');
      if(firtShownElement){
        let previousDivPosition:any = Array.from(weeksBox.querySelectorAll('div')).indexOf(firtShownElement);
        let shownElements = weeksBox.querySelectorAll('div:not(.hide)');
        weeksBox.querySelector(`div:nth-child(${previousDivPosition})`)?.classList.remove('hide');
        shownElements[shownElements.length-1]?.classList.add('hide');
      }
    }

  }
  nextWeek(weeksBox:HTMLDivElement){
    if(weeksBox.querySelector('div:last-child')?.classList.contains('hide')){
      weeksBox.querySelector('div:not(.hide) + .hide')?.classList.remove('hide');
      weeksBox.querySelector('div:not(.hide)')?.classList.add('hide');
    }
  }

  /* function to show/hide a team attacks */
  showTeam(teamToShow:HTMLDivElement, teamToHide:HTMLDivElement) {
    teamToShow.classList.add('active');
    teamToHide.classList.remove('active');
  }

  warDetails(){
    this.pageState.extraState();
  }
  goBackToList(){
    this.pageState.defaultState();
  }

}
