import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './project/components/views/login/login.component';
import { NavbarComponent } from './project/components/reusables/navbar/navbar.component';
import { TeamsComponent } from './project/components/views/teams/teams.component';
import { HttpClientModule } from '@angular/common/http';
import { MyTeamComponent } from './project/components/views/my-team/my-team.component';
import { TournamentComponent } from './project/components/views/tournament/tournament/tournament.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    TeamsComponent,
    MyTeamComponent,
    TournamentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
