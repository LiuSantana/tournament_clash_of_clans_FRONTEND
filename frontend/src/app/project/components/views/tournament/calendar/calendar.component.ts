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
  screen:any = Array(screen.width > 1023 ? 5 : 3).fill(0);

  // temporal vars
  matches:any = Array(6).fill(0);
  allMatches:any = [];
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
    this.matches = this.allMatches.filter((w:any) => w.round == this.week.toString())
    console.log(this.matches);
  }

  setActive(groupBox:HTMLDivElement, group:HTMLDivElement){
    if(!group.classList.contains('active')) {
      groupBox.querySelector('.active')?.classList.remove('active');
      group.classList.add('active');
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
