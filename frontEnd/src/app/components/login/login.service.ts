import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class LoginService {

  constructor(
    private http:Http
  ) { }

 
  facebook(){
    return this.http.get('http://localhost:8080/auth/facebook')
  }

  google(){
    let headers=new Headers
    return this.http.get('http://localhost:8080/auth/google',{headers:headers})
  }

  getGoogle(){
    let headers=new Headers
    return this.http.get('http://localhost:8080/auth/google/callback',{headers:headers}).map(res=>res.json());
  }
}
