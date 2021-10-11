import { BaseComponent } from 'src/app/shared/components/base/base.component'
import {
  SituationsFilters,
  SituationsFiltersService,
} from '../../../core/services/situations-filters.service'
import { Component, OnInit } from '@angular/core'
import { takeUntil } from 'rxjs/operators'

@Component({
  selector: 'app-popover-situations-list-filters',
  templateUrl: './popover-situations-list-filters.component.html',
  styleUrls: ['./popover-situations-list-filters.component.scss'],
})
export class PopoverSituationsListFiltersComponent
  extends BaseComponent
  implements OnInit
{
  situationsFilters: SituationsFilters

  constructor(private situationsFiltersService: SituationsFiltersService) {
    super()
  }

  ngOnInit() {
    this.situationsFiltersService.situationsFilter$
      .pipe(takeUntil(this.alive$))
      .subscribe((res) => {
        this.situationsFilters = res
      })
  }

  filtersChanged() {
    this.situationsFiltersService.situationsFilter$.next(this.situationsFilters)
  }
}
