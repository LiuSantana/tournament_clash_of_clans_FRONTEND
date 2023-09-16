import { Component, OnInit } from '@angular/core';
import { PageState } from 'src/app/project/module/implementations/angular_objects/PageState';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  pageState:PageState = new PageState();
  group:string = 'A';
  week:number = 0;
  screen:any = Array(screen.width > 1023 ? 5 : 3).fill(0);

  // temporal vars
  matches:any = Array(6).fill(0);
  edit:boolean = true;


  constructor() {
  }

  ngOnInit(): void {}

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
