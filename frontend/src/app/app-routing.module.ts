import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './project/components/views/login/login.component';
import { TeamsComponent } from './project/components/views/teams/teams.component';
import { MyTeamComponent } from './project/components/views/my-team/my-team.component';
import { TournamentComponent } from './project/components/views/tournament/tournament/tournament.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'myteam', component: MyTeamComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'tournament', component: TournamentComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
