import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-navbar.component.html',
  styleUrls: ['./user-navbar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserNavbarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
