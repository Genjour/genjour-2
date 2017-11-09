import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import {MatChipInputEvent} from '@angular/material';
import {ENTER} from '@angular/cdk/keycodes';
const COMMA = 188;
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  tiles = [
      {text: 'One', cols: 1, rows: 1, color: 'lightblue'},
      {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
      {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
      {text: 'Four', cols: 1, rows: 1, color: '#DDBDF1'},
      {text: 'five', cols: 1, rows: 1, color: '#DDFDF1'},
    ];


      visible: boolean = true;
      selectable: boolean = true;
      removable: boolean = true;
      addOnBlur: boolean = true;

      // Enter, comma
      separatorKeysCodes = [ENTER, COMMA];

      tags = [
        { name: 'Genjour' },
      ];


      add(event: MatChipInputEvent): void {
        let input = event.input;
        let value = event.value;

        // Add our person
        if ((value || '').trim()) {
          this.tags.push({ name: value.trim() });
        }

        // Reset the input value
        if (input) {
          input.value = '';
        }
      }

      remove(tag: any): void {
        let index = this.tags.indexOf(tag);

        if (index >= 0) {
          this.tags.splice(index, 1);
        }
      }


}
