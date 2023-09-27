import { Component, OnInit } from '@angular/core';
import { AWar } from 'src/app/project/services/API/war/AWar';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {
  group:string = 'A';

  // temporal variables
  teams!:any;
  Allteams!:any;
  constructor(private AWar:AWar) { }

  ngOnInit(): void {
    this.getRanking();
    console.log(this.Allteams)
  }

  async getRanking() {
    let wars:any = await this.AWar.getRanking().toPromise();
    if(wars) {
      console.log(wars);
      this.Allteams = wars.data;
      this.filterRanking();
    }
  }

  filterRanking() {
    this.teams = this.Allteams.filter((t:any) => t.tournament_group == this.group);
  }
  
  setActive(groupBox:HTMLDivElement, group:HTMLDivElement){
    if(!group.classList.contains('active')) {
      groupBox.querySelector('.active')?.classList.remove('active');
      group.classList.add('active');
    }
  }
}
