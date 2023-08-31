import { AClan } from "../../services/API/clan/AClan";
import { APlayer } from "../../services/API/player/APlayer";
import { Player } from "./Player";

export class Clan {
    tag!:string;
    name!:string;
    shortName!:string;
    user!:string;
    password!:string;


    newName!:string;
    newShortName!:string;
    players:Array<Player> = [new Player()];

    /* OBJECT MODIFICATIONS */
    setTag(tag:string){ this.tag = tag; }
    setName(name:string){ this.name = name; }
    setShortName(shortName:string){ this.shortName = shortName; }
    setUser(user:string){ this.user = user; }
    setPassword(password:string){ this.password = password; }

    setPlayers(players:Array<Player>) {
        const registeredPlayers:Array<Player> = [];
        players.forEach((p:any) => {
        const player:Player = new Player();
        player.setPlayer(p.tag,p.name);
        registeredPlayers.push(player);
      })
      this.players = registeredPlayers;
    }
    getNotDeletedPlayers() {
        return this.players.filter(p => p.deleted === false).length
    }

    copyActualValues(){
        this.newName = this.name;
        this.newShortName = this.shortName;
    }

    addPlayer(){ this.players.push(new Player()); }
    removePlayer(p:Player){  this.players = this.players.filter(item => item !== p);}


    /* OBJECT VALIDATIONS */
    async validate(APlayer:APlayer) {
        let response;
        //clan
        if(this.tag && this.name && this.shortName) {
            // players
            if(this.players.length > 4) {
                let validatedPlayers = await this.validatePlayers(APlayer)
                if(!validatedPlayers.error) {
                    response = true;
                } else response = validatedPlayers;
            } else response = { error:'Tiene que haber como mínimo 5 jugadores por equipo.' };
        } else response = {error:'Los datos del equipo no pueden estar vacios.'};

        return response;
    }

    async validatePlayers(APlayer:APlayer) {
        let response:any;
        let validatedPlayers:Array<Player> = [];
        let valid:boolean = true;
        for (const p of this.players) {
            const isValid = await p.validate(APlayer);
            if (isValid) validatedPlayers.push(p);
            else valid = false; 
        }
        if(valid) response = true;
        else {
            this.players = validatedPlayers;
            response = {error:'Algunos de los jugadores introducidos no se han encontrado en el juego, estos han sido eliminados de tu lista.'}
        }
        return response;
    }


    /* SAVE OBJECT */
    async register(APlayer:APlayer, AClan:AClan) {
        
        return new Promise<any>((resolve, reject) => {
            AClan.registerClan({tag:this.tag, name:this.name, short_name:this.shortName, user:this.user, password:this.password }).subscribe(
                async clan => {
                    const wrongPlayers = [];
                    const playersData = [];
                    for (let player = 0 ; player < this.players.length ; player++) {
                        let insert = await this.players[player].register(APlayer, this.tag);
                        if(!insert) wrongPlayers.push(this.players[player].tag)
                        else playersData.push(insert)
                    }
                    
                    if(wrongPlayers.length>0){
                        let error = 'Estos jugadores no son válidos o ya han sido registrados: ';
                        wrongPlayers.forEach( p => {
                            error+=` ${p},`;
                        })
                        error = error.slice(0, -1);
                        error+='.';
                        
                        await this.delete(AClan);
                        resolve({error})
                    } else {
                        localStorage.setItem("mirror-cup-my-team", JSON.stringify({tag:this.tag, name:this.name, short_name:this.shortName, players:playersData}));
                        let teams = localStorage.getItem("mirror-cup-teams");
                        if(teams){
                            let teamsObj:any = JSON.parse(teams);
                            console.log(teamsObj);
                            teamsObj.clans.push({tag:this.tag, name:this.name, short_name:this.shortName})
                            localStorage.setItem("mirror-cup-teams", JSON.stringify(teamsObj));
                        }
                        resolve(true)
                    }

                },
                error => { 
                    resolve({error:'El clan no es válido o ya esta inscrito.'});
                }
            )
        });
    }

    async delete(AClan:AClan) {
        return new Promise<any>((resolve, reject) => {
            AClan.deleteClan(this.tag).subscribe(
                async clan => {
                    resolve(true);
                },
                error => { 
                    resolve({error:'Error al eliminar clan'});
                }
            )
        });
    }

    async modify(AClan:AClan, data:Array<any>) {
        return new Promise<any>((resolve, reject) => {
            AClan.modifyClan(this.tag, data).subscribe(
                async clan => {
                    resolve(true);
                },
                error => { 
                    resolve({error:'Error al modificar clan'});
                }
            )
        });
    }

    async modifyPlayers(APlayer:APlayer, clan:string) {

        return new Promise<any>(async (resolve, reject) => {
            const wrongPlayers:Array<string> = [];
            const deletedPlayers:Array<number> = [];

            // delete players
            const playersToDelete = this.players.filter(p => p.deleted);
            for(let p = 0; p < playersToDelete.length; p++) {
                deletedPlayers.push(p);
                await playersToDelete[p].delete(APlayer);
            }

            // Add new players
            const newPlayer = this.players.filter(p => p.name === undefined);
            for(let p = 0; p < newPlayer.length; p++) {
                deletedPlayers.push(p);
                let player = await newPlayer[p].register(APlayer, clan);

                if(player) {
                    let  newPlayer = new Player();
                    newPlayer.setPlayer(player.tag, player.name)
                    this.players.push(newPlayer);
                }
                else wrongPlayers.push(newPlayer[p].tag)
            }

            // Remove old players and add the name to the new ones
            this.players = this.players.filter(p => p.name !== undefined && !p.deleted)

            if(wrongPlayers.length>0){
                let error = 'Estos jugadores no son válidos o ya han sido registrados: ';
                wrongPlayers.forEach( p => {
                    error+=` ${p},`;
                })
                error = error.slice(0, -1);
                error+='.';

                resolve({error})
            } else {
                localStorage.setItem("mirror-cup-my-team", JSON.stringify({tag:this.tag, name:this.name, short_name:this.shortName, players:this.players}));
                resolve(true)
            }

        });
    }
}