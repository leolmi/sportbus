import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { EditorBase } from '@olmi/components';
import { combineLatest, map, Observable } from 'rxjs';
import { Session, SessionOnDay, ShuttleDirection } from '@olmi/model';
import { getMissingDriversCount, getMissingPassengers } from '../shuttles-utilities';

@Component({
  selector: 'shuttle-errors',
  imports: [
    CommonModule,
    FlexModule,
  ],
  templateUrl: './shuttle-errors.component.html',
  styleUrl: './shuttle-errors.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShuttleErrorsComponent extends EditorBase {
  message$: Observable<string>;

  @Input()
  direction: ShuttleDirection|undefined;

  constructor() {
    super();

    this.message$ = this.manager.context$
      .pipe(map((context) => {
        // passeggeri non assegnati
        const missp = getMissingPassengers(context, this.direction||'A');
        const missp_str = (missp.length>0) ? `${missp.map(p => `${p.name}`).join(', ')} not present yet; ` : '';
        // autisti non assegnati
        const missdc = getMissingDriversCount(context.sod, this.direction||'A');
        const missd_str = (missdc > 0) ? `${missdc} missing driver${(missdc > 1) ? 's' : ''};` : '';
        return `${missp_str}${missd_str}`;
      }));
  }
}
