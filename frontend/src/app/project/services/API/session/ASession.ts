import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const conf = require('../conf.json');

@Injectable({
    providedIn: 'root'
})


export class ASession {
    url = conf.SERVER.url;
    constructor(private http: HttpClient){}

    requestOptions = this.createHeader();

    getToken(user:any):Observable<any> {
        return this.http.post(`${this.url}/login`, user, this.requestOptions);
    }

    userPermisions(session:any):Observable<any> {
        return this.http.post(`${this.url}/verifyPrivileges`, session, this.requestOptions);
    }

    registrationState():Observable<any> {
        return this.http.get(`${this.url}/registrationState`, this.requestOptions);
    }

    renewToken(token:any):Observable<any> {
        return this.http.post(`${this.url}/renewToken`,token, this.requestOptions);
    }

    anonymousToken():Observable<any> {
        return this.http.get(`${this.url}/anonymousToken`, this.requestOptions);
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