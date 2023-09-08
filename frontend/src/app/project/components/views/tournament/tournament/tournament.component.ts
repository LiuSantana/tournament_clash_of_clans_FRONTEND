import { Component, OnInit } from '@angular/core';
import { PageState } from 'src/app/project/module/implementations/angular_objects/PageState';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.css']
})
export class TournamentComponent implements OnInit {
  pageState:PageState = new PageState();
  page:string = 'calendario';

  constructor() { }

  ngOnInit(): void {
    this.pageState.previewState()
    this.pageState.defaultState()
  }

  setActiveLink(menu:HTMLDivElement, link:HTMLDivElement) {
    const index = link.getAttribute('index');
    if(index && !link.classList.contains(index)){
      menu.classList.remove('lft_0', 'lft_1', 'lft_2', 'lft_3');
      menu.classList.add(`lft_${link.getAttribute('index')}`);
    }
  }
}
