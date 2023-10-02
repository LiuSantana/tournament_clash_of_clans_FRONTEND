import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const conf = require('../conf.json');

@Injectable({
    providedIn: 'root'
})


export class AWar {
    url = conf.SERVER.url;
    constructor(private http: HttpClient){}

    requestOptions = this.createHeader();

    getAllWars():Observable<any> {
        return this.http.get(`${this.url}/wars`, this.requestOptions);
    }
    getWarAttacks(id:number):Observable<any> {
        return this.http.get(`${this.url}/wars/${id}/attacks`, this.requestOptions);
    }
    getRanking():Observable<any> {
        return this.http.get(`${this.url}/wars/ranking`, this.requestOptions);
    }
    getEndedWar(id:string):Observable<any> {
        return this.http.get(`${this.url}/wars/${id}/results`, this.requestOptions);
    }


    endWar(id:string):Observable<any> {
        return this.http.post(`${this.url}/wars/${id}`, this.requestOptions);
    }
    defaultWar(wars:any):Observable<any> {
        return this.http.post(`${this.url}/wars/default`, wars,  this.requestOptions);
    }
    applySanction(sanction:any):Observable<any> {
        return this.http.post(`${this.url}/wars/sanction`, sanction,  this.requestOptions);
    }

    
    updateAttacks(attacks:any):Observable<any> {
        return this.http.patch(`${this.url}/wars/attacks`, attacks,  this.requestOptions);
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