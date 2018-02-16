import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { Router } from '@angular/router';

import { Observable } from "rxjs/Rx"


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private loginService:LoginService,
    private router:Router
  ) { }

  ngOnInit() {
  }

  // facebookButton(){
    
  //   return this.loginService.facebook().subscribe(data=>{
  //     if(data.success){
  //       this.router.navigate(['/feeds']);
  //     }else{
  //       this.router.navigate(['/genjourist']);
  //     }
  //   });

  // }

  googleButton(){
    var api = '/auth/google';
    window.location.href = api;
   
  }

}
