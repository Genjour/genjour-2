import { LoginService } from './../login/login.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private loginService : LoginService) { }
user : any[]=[];

  ngOnInit() {
    this.loginService.getGoogle().subscribe(data=>{
      //this.user =data.user;
      console.log(data.user);
    })

  }



}
