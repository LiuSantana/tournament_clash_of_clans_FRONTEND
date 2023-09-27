import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from 'src/app/project/module/implementations/Player';

const conf = require('../conf.json');

@Injectable({
    providedIn: 'root'
})


export class APlayer {
    url = conf.SERVER.url;
    constructor(private http: HttpClient){}

    requestOptions = this.createHeader();

    validate(id:string):Observable<any> {
        return this.http.get(`${this.url}/players/${encodeURIComponent(id)}/validate`, this.requestOptions);
    }

    register(player:any):Observable<any> {
        return this.http.post(`${this.url}/players`, player, this.requestOptions);
    }

    delete(id:string):Observable<any> {
        return this.http.delete(`${this.url}/players/${encodeURIComponent(id)}`, this.requestOptions);
    }

    getPlayerRank():Observable<any> {
        return this.http.get(`${this.url}/attacks`, this.requestOptions);
    }


    private createHeader() {

        const header = {
            'Access-Control-Allow-Origin':'*',
            'Content-Type':'application/json',
            'Accept':'application/json',
            'Acces-Control-Allow-Headers':'Origin, Content-Type, Accept,Authorization',
        }
        return {headers: new HttpHeaders(header)};
    }


}