import { Component, OnDestroy, OnInit } from '@angular/core'

import { Subject } from 'rxjs'

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent implements OnInit, OnDestroy {
  protected alive$ = new Subject<boolean>()

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {
    this.alive$.next(false)
  }
}
