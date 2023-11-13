import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AWar } from 'src/app/project/services/API/war/AWar';

@Component({
  selector: 'app-playoff',
  templateUrl: './playoff.component.html',
  styleUrls: ['./playoff.component.css']
})
export class PlayoffComponent implements OnInit, AfterViewInit {

  rounds:any = [];
  
  constructor(private aWar:AWar) { }

  async ngOnInit() {
    let wars = await this.aWar.getAllWars().toPromise();
    wars = wars.data;
    wars = wars.filter((w:any) => w.format == 'playoff');
    this.setRounds(wars);
    
    setTimeout(() => {
      this.setGridColumns();
      this.setBraketMargins(1, 10, 10);

    },500)
  }
  setRounds(warList:any) {
    let roundNumber = Array.from(new Set(warList.map((w:any) => w['round'].split('-')[0]))).length;
    for(let i = 1; i < roundNumber+1; i++) {
      let wars:any = [];
      let roundMatches = warList.filter((w:any) => w.round.includes(`R${i}`));
      roundMatches.sort((a: { round: string }, b: { round: string }) => a.round.localeCompare(b.round));
      roundMatches.forEach((w:any) => wars.push(w));
      this.rounds.push({round:roundNumber+1-i, wars:wars})
    }
  }

  ngAfterViewInit(): void {
    this.setGridColumns();
    this.setBraketMargins(1, 10, 10);
  }
  matchName(round:number) {
    let result;
    if(round == 1) result = 'final';
    if(round == 2) result = 'semifinal';
    if(round > 2) {
      result = `${Math.pow(2, round)/2}-avos`
    }
    return result
  }

  
  /*****************
   * CALCULATED CSS STYLES
  *****************/
  setGridColumns() {
    let braket:any = document.querySelector('.braket');
    if(braket) {
      let roundsWidth:any = braket.style.getPropertyValue('--width');
      braket.style.setProperty('grid-template-columns', 'repeat(' + this.rounds.length + ', ' + roundsWidth +')');
    }
  }


  setBraketMargins(round:number, gapTop:number , gapMid:number){
    const war_height = 60; // 60px
    if(round > 1) {
      let lastRound_height = (war_height*2) + gapMid;
      gapTop = (lastRound_height - 60)/2 + gapTop;
      gapMid = lastRound_height - 60 + gapMid;

      let round_HTMLElement:any = document.querySelectorAll(`.braket > .round:nth-child(${round}) > .war`);

      let contador = 1;
      if(round_HTMLElement) {
        round_HTMLElement.forEach((w:any)=> {
          w.style.margin = `${gapMid}px 0 0 1rem`;
          contador++;
        });
        round_HTMLElement[0].style.margin = `${gapTop}px 0 0 1rem`
      }
    }
    round++;
    if(round <= this.rounds.length) this.setBraketMargins(round, gapTop , gapMid);
  }
}
