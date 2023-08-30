import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageState } from 'src/app/project/module/implementations/angular_objects/PageState';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {
  pageState:PageState = new PageState();
  teams:Array<any> = [];
  constructor(public router:Router) {}

  ngOnInit(): void {
    let teams = localStorage.getItem('mirror-cup-teams');
    if(teams) {
      let teamsObj = JSON.parse(teams);
      if(teamsObj.length == 0) this.pageState.updateState();
      else {
        this.pageState.defaultState();
        this.teams = teamsObj.clans;
      }
    } else this.router.navigate(['']);
  }
}
