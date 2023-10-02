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

  async applySanction(clanBox_san:HTMLDivElement, stars:number, percentage:number, sanction_btn:HTMLButtonElement, sanctionBox:HTMLDivElement ) {
    sanction_btn.classList.add('loading');
    const tag = clanBox_san.querySelector('.active')?.getAttribute('tag');
    let sanction = {tag, war:this.war.id, stars, percentage}
    
    try {
      await this.AWar.applySanction(sanction).toPromise();
      if(tag == this.war.clan_A) {
        this.war.stars_A = this.war.stars_A - stars;
        this.war.percentage_A = this.war.percentage_A - percentage;
      } else {
        this.war.stars_B = this.war.stars_B - stars;
        this.war.percentage_B = this.war.percentage_B - percentage;
      }
    } catch (e) {}

    sanction_btn.classList.remove('loading');
    sanctionBox.classList.add('hide');
  }

  async setWar(war:any) { 
    this.war = war;

    try {
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

  modifyAttack(attack:any, rawValue:string, type:string) {
    let value = parseInt(rawValue);
    let attackInArray = this.modifiedAttacks.find((a:any) => a.war == attack.war && a.tag == attack.tag);
    if(attackInArray){
      if(type == 'stars') attackInArray.stars = value;
      else attackInArray.percentage = value;
    } else {
      this.modifiedAttacks.push(
        {
          tag:attack.tag, clan:attack.clan, war:attack.war, 
          stars:type=='stars' ? value : attack.stars,
          percentage:type=='percentage' ? value : attack.percentage
        }
      );
    }
  }
  async saveAttacks(btn:HTMLButtonElement){
    if(this.modifiedAttacks.length > 0) {
      btn.classList.add('loading');
      await this.AWar.updateAttacks(this.modifiedAttacks).toPromise();
      btn.classList.remove('loading');
    }
  }

  async setDefaultWar(clanBox:HTMLDivElement, btn:HTMLButtonElement) {
    btn.classList.add('loading');
    let resultat;
    let group = clanBox.querySelector('.active')?.getAttribute('name');
    switch(group) {
      case 'A':
        resultat = [
          {player: '#0000', clan:this.war.clan_A, id:this.war.id, stars:0, percentage:0, duration:0},
          {player: '#0001', clan:this.war.clan_B, id:this.war.id, stars:11, percentage:400, duration:0}
        ]
        break;
      case 'B':
        resultat = [
          {player: '#0001', clan:this.war.clan_A, id:this.war.id, stars:11, percentage:400, duration:0},
          {player: '#0000', clan:this.war.clan_B, id:this.war.id, stars:0, percentage:0, duration:0}
        ]
        break;
      default:
        break;
    }
    await this.AWar.defaultWar(resultat).toPromise();
    btn.classList.remove('loading');
    if(resultat){
      this.war.stars_A = resultat[1].stars;
      this.war.percentage_A = resultat[1].percentage;
      this.war.stars_B = resultat[0].stars;
      this.war.percentage_B = resultat[0].percentage;
      this.war.state='finished';
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
