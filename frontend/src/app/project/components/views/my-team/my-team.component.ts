import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Clan } from 'src/app/project/module/implementations/Clan';
import { PageState } from 'src/app/project/module/implementations/angular_objects/PageState';
import { Session } from 'src/app/project/module/implementations/angular_objects/Session';
import { AClan } from 'src/app/project/services/API/clan/AClan';
import { APlayer } from 'src/app/project/services/API/player/APlayer';
import { ASession } from 'src/app/project/services/API/session/ASession';

@Component({
  selector: 'app-my-team',
  templateUrl: './my-team.component.html',
  styleUrls: ['./my-team.component.css']
})
export class MyTeamComponent implements OnInit {
  pageState: PageState = new PageState();
  /**
   * loadingState = LOADING
   * defaultState = REGISTER
   * updateState = MODIFICATE
   * previewState = VIEW OTHER CLAN
   * extraState = LOGIN
   */
  clan:Clan = new Clan();
  regOpen:Boolean = false;
  permisionOnClan:Boolean = false;

  constructor(private APlayer:APlayer, private AClan:AClan, private route: ActivatedRoute, private ASession:ASession, public router:Router) { }


  ngOnInit() {
    setTimeout( async () => {
      await this.getClan();
    }, 750)
  }

  async getClan() {
    try {
      const myTeam = localStorage.getItem('mirror-cup-my-team');
      this.regOpen = await this.getRegistrationState();
      this.route.queryParams.subscribe( async params => {
        if(params['clan']) {
          let clan = await this.AClan.getClan(params['clan']).toPromise();
          let players = await this.AClan.getClanPlayers(params['clan']).toPromise();
  
          this.setClan(clan.data[0], players.data);
          this.permisionOnClan = await this.getPermission();

          this.checkPageStateIfClan();
  
        } else if(myTeam) {
          const myTeam_obj = JSON.parse(myTeam);
          this.setClan(myTeam_obj, myTeam_obj.players);
          this.permisionOnClan = await this.getPermission();
          this.checkPageStateIfClan();
        } else if(this.regOpen)this.pageState.defaultState();
        else this.pageState.extraState();
      });

    } catch (err) {
      console.log(err)
    }
  }

  setClan(clan:any, players:any){
    this.clan.setTag(clan.tag);
    this.clan.setName(clan.name);
    this.clan.setShortName(clan.short_name);
    this.clan.setPlayers(players);
  }

  checkPageStateIfClan() {
    if(this.permisionOnClan && this.regOpen) {
      this.clan.copyActualValues();
      this.pageState.updateState();
    } else this.pageState.previewState();
  }

  async getPermission() {
    let response = false;
    let token = localStorage.getItem('mirror-cup-token');
    if(token) {
      try{
        let permision = await this.ASession.userPermisions({token, clan:this.clan.tag}).toPromise();
        if(permision.data == 'OK') response = true;
      }
      catch(error){}
    }
    return response;
  }

  async getRegistrationState(){
    let response = false;
    try {
      let state = await this.ASession.registrationState().toPromise();
      if(state.data == 'OK') response = true;
    } catch(err){}
    return response;
  }

  showError(errorDiv:HTMLDivElement, error:string){
    errorDiv.classList.remove('hide');
    errorDiv.innerHTML=error;

  }
  async permanentDeleteClan(deletePopup:HTMLDivElement){
    await this.clan.delete(this.AClan);
    localStorage.removeItem('mirror-cup-my-team');
    this.pageState.defaultState();
    deletePopup.classList.add('hide');
  }

  async register(errorDiv:HTMLDivElement, registerBtn:HTMLButtonElement) {
    if(!registerBtn.classList.contains('loading')) { // avoids multiple clicks
      registerBtn.classList.add('loading'); // adds loading effect
      // Validate data form is valid
      const validContent = await this.clan.validate(this.APlayer);
      if(validContent.error) this.showError(errorDiv, validContent.error )
      else {
        errorDiv.classList.add('hide');
        // register clan
        let clan = await this.clan.register(this.APlayer, this.AClan);
        if(!clan.error) {
          this.getClan()
          let token = await this.ASession.getToken({user:this.clan.user, password:this.clan.password}).toPromise();
          localStorage.setItem('mirror-cup-token', token.token);
          this.getClan()
        } else this.showError(errorDiv, clan.error);
      }
      registerBtn.classList.remove('loading');
    }
  }

  async modifyTeam(errorDiv:HTMLDivElement, saveBtn:HTMLButtonElement) {
    if(!saveBtn.classList.contains('loading')) { // avoids multiple clicks
      saveBtn.classList.add('loading'); // adds loading effect
      // Validate data form is valid
      const validContent = await this.clan.validate(this.APlayer);
      if(validContent.error) this.showError(errorDiv, validContent.error )
      else {
        errorDiv.classList.add('hide');
        const errors = [];
        // modify clan
        const modifications:any = [];
        this.modifyClanData(modifications,this.clan.name, this.clan.newName, 'name');
        this.modifyClanData(modifications,this.clan.shortName, this.clan.newShortName, 'short_name');

        if(modifications.length > 0) {
          let clan = await this.clan.modify(this.AClan, modifications);
          if(clan.error) errors.push(clan.error)
        }

        //modify players
        let players = await this.clan.modifyPlayers(this.APlayer, this.clan.tag);
        if(players.error) errors.push(players.error)

        if(errors.length == 0) {
          // TODO: sucess message
          console.log('OK')
        } else this.showError(errorDiv, errors[0])
      }
      saveBtn.classList.remove('loading');
    }
  }

  modifyClanData(modifications:Array<object>, value:string, previous:string, property:string):void {
    if(value && value != previous) {
      modifications.push({property, value})
    }
  }
}
