import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class LoginService {

  constructor(
    private http:Http
  ) { }


  private headers = new Headers( { 
      'Content-Type': 'application/json',

        } );
  private opts = new RequestOptions({
    headers:this.headers,
    withCredentials:true
  })  
  facebook(){
    

    return this.http.get('http://localhost:8080/auth/facebook',this.opts)
    .map(res => {res.json()
      console.log("raj amit",res);
    });
  }

  google(){
    console.log("u r logggd in google");
  }
}
