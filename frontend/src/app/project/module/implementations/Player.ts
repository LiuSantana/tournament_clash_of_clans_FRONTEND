import { APlayer } from "../../services/API/player/APlayer";

export class Player {
    tag!:string;
    deleted:boolean = false;
    name!:string;


    setTag(tag:string) { this.tag = tag; }
    deletePlayer() { this.deleted = true; console.log('DELETED') }

    /**
     * DB player to object, so it is only used for already registered players
     * @param tag 
     * @param name 
     */
    setPlayer(tag:string, name:string){
        this.tag = tag;
        this.name = name;
    }

    async validate(APlayer: APlayer): Promise<any> {
        return new Promise<boolean>((resolve, reject) => {
            APlayer.validate(this.tag).subscribe(
                player => {
                    resolve(player.data);
                },
                error => {
                    resolve(false);
                }
            );
        });
    }

    async register(APlayer:APlayer, clan:string):Promise<any> {
        return new Promise<boolean>((resolve, reject) => {
            APlayer.register({tag:this.tag, clan}).subscribe(
                player => {
                    resolve(player.data);
                },
                error => {
                    resolve(false);
                }
            );
        });
    }

    async delete(APlayer:APlayer):Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            APlayer.delete(this.tag).subscribe(
                player => {
                    resolve(player.data);
                },
                error => {
                    resolve(false);
                }
            );
        });
    }

}