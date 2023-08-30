import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const conf = require('../conf.json');

@Injectable({
    providedIn: 'root'
})


export class AClan {
    url = conf.SERVER.url;
    constructor(private http: HttpClient){}

    requestOptions = this.createHeader();

    getClan(tag:string):Observable<any> {
        return this.http.get(`${this.url}/clans/${encodeURIComponent(tag)}`, this.requestOptions);
    }

    getClanPlayers(tag:string):Observable<any> {
        return this.http.get(`${this.url}/clans/${encodeURIComponent(tag)}/players`, this.requestOptions);
    }
    getAllClans():Observable<any> {
        return this.http.get(`${this.url}/clans`, this.requestOptions);
    }
    registerClan(clan:any):Observable<any> {
        return this.http.post(`${this.url}/clans`, clan, this.requestOptions);
    }

    deleteClan(clan:string):Observable<any> {
        return this.http.delete(`${this.url}/clans/${encodeURIComponent(clan)}`, this.requestOptions);
    }

    modifyClan(tag:string, data:Array<any>):Observable<any> {
        return this.http.patch(`${this.url}/clans/${encodeURIComponent(tag)}`, data, this.requestOptions);
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