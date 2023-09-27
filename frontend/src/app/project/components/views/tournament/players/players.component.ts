import { Component, OnInit } from '@angular/core';
import { APlayer } from 'src/app/project/services/API/player/APlayer';

@Component({
  selector: 'app-players',
  templateUrl: './players.component.html',
  styleUrls: ['./players.component.css']
})
export class PlayersComponent implements OnInit {
  players:any;

  constructor(private APlayer:APlayer) { }

  ngOnInit(): void {
    this.getPlayers();
  }

  async getPlayers() {
    let players = await this.APlayer.getPlayerRank().toPromise();
    this.players = players;
    console.log(players);
  }
}
