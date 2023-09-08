import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  group:string = 'A';
  week:number = 0;
  screen:any = Array(screen.width > 1023 ? 5 : 3).fill(0);

  // temporal vars
  matches:any = Array(6).fill(0);
  constructor() { }

  ngOnInit(): void {
  }

  setActive(groupBox:HTMLDivElement, group:HTMLDivElement){
    if(!group.classList.contains('active')) {
      groupBox.querySelector('.active')?.classList.remove('active');
      group.classList.add('active');
    }
  }

}
