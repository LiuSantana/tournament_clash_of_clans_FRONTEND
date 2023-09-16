import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-playoff',
  templateUrl: './playoff.component.html',
  styleUrls: ['./playoff.component.css']
})
export class PlayoffComponent implements OnInit, AfterViewInit {

  // temporal vars
  rounds:any = [
    {round: 5, wars:[1,2,3,4,5,6,7,8,1,2,3,4,5,6,7,8]},
    {round: 4, wars:[1,2,3,4,1,2,3,4]},
    {round: 3, wars:[1,2,1,2]},
    {round: 2, wars:[1,1]},
    {round: 1, wars:[1]},
  ];
  
  constructor() { }

  ngOnInit(): void {
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
