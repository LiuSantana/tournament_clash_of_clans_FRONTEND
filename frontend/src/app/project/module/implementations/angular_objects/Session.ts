import { AClan } from "src/app/project/services/API/clan/AClan";
import { ASession } from "src/app/project/services/API/session/ASession";

export class Session {

    getToken(ASession:ASession, user:any) {
        return new Promise<any>((resolve, reject) => {
            ASession.getToken(user).subscribe(
                async clan => {
                    resolve(clan);
                },
                error => {
                    let errorMessage;
                    switch(error.status) {
                        case 422:
                            errorMessage = 'No puede haber campos vacios';
                            break;
                        case 404:
                            errorMessage = `No se ha encontradon el usuario ${user.user}`;
                            break;
                        case 401:
                            errorMessage = `La contraseña del usuario ${user.user} no es correcta`;
                            break;
                        default:
                            errorMessage = 'Error al iniciar sesion';
                    }
                    resolve({error:errorMessage});
                }
            )
        });
    }

    /* async checkRegistrationStatus(ASession:ASession){

    }*/

    async getAllData(AClan:AClan,ASession:ASession, clan:string) {
        let response;
        try {
            let clans = await this.getAllClans(AClan);
            if(!clans) response = {error:'Ha habido un error al acceder'}
            if(clan) await this.getMyClan(AClan, clan);
            await this.setToken(ASession);
            response = true;
        } catch (error) {
            response = {error:'Ha habido un error al acceder'}
        }
        return response
    }

    async getAllClans(AClan:AClan) {
        return new Promise<any>((resolve, reject) => {
            AClan.getAllClans().subscribe(
                async clans => {
                    localStorage.setItem('mirror-cup-teams', JSON.stringify({clans:clans.data}));
                    resolve(true);
                },
                error => { 
                    resolve(false);
                }
            )
        });
    }

    async getMyClan(AClan:AClan, tag:string) {

        try {
            const clan = await AClan.getClan(tag).toPromise();
            const players = await AClan.getClanPlayers(tag).toPromise();
    
            const clanData = clan.data[0];
            const playersData = players.data;
    
            localStorage.setItem('mirror-cup-my-team', JSON.stringify({tag:clanData.tag, name:clanData.name, short_name:clanData.short_name, players: playersData}));
    
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async setToken(ASession:ASession){
        let token = localStorage.getItem('mirror-cup-token');
        if(token) {
            const newToken = await ASession.renewToken({token}).toPromise();
            if(newToken) {
                localStorage.setItem('mirror-cup-token', newToken.token);
            }
        } else {
            const newToken = await ASession.anonymousToken().toPromise();
            if(newToken) {
                localStorage.setItem('mirror-cup-token', newToken.token);
            }

        }
    }
}