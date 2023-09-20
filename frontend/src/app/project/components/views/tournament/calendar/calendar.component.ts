import { Component, OnInit } from '@angular/core';
import { PageState } from 'src/app/project/module/implementations/angular_objects/PageState';
import { AWar } from 'src/app/project/services/API/war/AWar';

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

  matches!:any;
  allMatches:any = [];
  attacks!:any;
  // temporal vars
  edit:boolean = true;


  constructor(private AWar:AWar) {
    this.getWars()
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
