import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './project/components/views/login/login.component';
import { NavbarComponent } from './project/components/reusables/navbar/navbar.component';
import { TeamsComponent } from './project/components/views/teams/teams.component';
import { HttpClientModule } from '@angular/common/http';
import { MyTeamComponent } from './project/components/views/my-team/my-team.component';
import { TournamentComponent } from './project/components/views/tournament/tournament/tournament.component';
import { CalendarComponent } from './project/components/views/tournament/calendar/calendar.component';
import { RankingComponent } from './project/components/views/tournament/ranking/ranking.component';
import { PlayoffComponent } from './project/components/views/tournament/playoff/playoff.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    TeamsComponent,
    MyTeamComponent,
    TournamentComponent,
    CalendarComponent,
    RankingComponent,
    PlayoffComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
