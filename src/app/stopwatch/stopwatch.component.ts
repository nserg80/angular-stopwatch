import { Component, Input, OnInit } from '@angular/core';
import { timer, Subscription } from "rxjs";
import { map } from "rxjs/operators";

interface TimeInterface {
  hh: string | number;
  mm: string | number;
  ss: string | number;
}

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss']
})
export class StopwatchComponent implements OnInit {

  constructor() { }

  @Input() stopwatchTitle: string;

  sub: Subscription
  isPaused = false
  isPauseClicked = false
  isStopped = true

  date = new Date(0, 0)
  pausedValue = new Date(0, 0)

  time: TimeInterface = {
    hh: '00',
    mm: '00',
    ss: '00',
  }

  startCount() {
    if (this.isStopped || this.isPaused) {
      this.isStopped = false
      this.isPaused = false
      this.sub = timer(0, 0)
        .pipe(
          map(
            tick => new Date(tick * 4 + this.pausedValue.getTime())
          )
        )
        .subscribe(val => {
          this.date = val
          this.time.ss = this.time.ss < 10 ? '0' + this.date.getSeconds() : this.date.getSeconds()
          this.time.mm = this.time.mm < 10 ? '0' + this.date.getMinutes() : this.date.getMinutes()
          this.time.hh = this.time.hh < 10 ? '0' + this.date.getHours() : this.date.getHours()
        })
    }
  }

  stopCount() {
    if (!this.isStopped) {
      for (let key in this.time) {
        this.time[key] = '00'
      }
      this.date = new Date(0, 0)
      this.isStopped = true
      this.isPaused = false
      this.pausedValue = new Date(0, 0)
      this.sub.unsubscribe()
    }
  }

  waitCount() {
    if (!this.isStopped) {
      if (this.isPauseClicked) {
        if (!this.isPaused) {
          this.isPaused = true
          this.pausedValue = this.date
          this.sub.unsubscribe()
        } else {
          this.startCount()
        }
      }
    }

    this.isPauseClicked = true

    setTimeout(() => {
      this.isPauseClicked = false
    }, 300);
  }

  resetCount() {
    if (!this.isStopped) {
      this.stopCount()
      this.startCount()
    }
  }

  ngOnInit(): void { }

}
