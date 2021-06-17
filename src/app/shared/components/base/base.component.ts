/**
 * Base component
 *
 * @author Marjory Gaillot <marjory.gaillot@gmail.com>
 * @author Laurent David <laurent@call-learning.fr>
 * @license http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @copyright  2021 SAS CALL Learning <call-learning.fr>
 */
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
