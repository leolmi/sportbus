import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { EditorBase } from '@olmi/components';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Session, SessionOnDay, ShuttleDirection } from '@olmi/model';
import { getMissingAthletes, getMissingDriversCount } from '../shuttles-utilities';

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

    this.message$ = combineLatest([this.manager.session$, this.manager.sessionOnDay$])
      .pipe(map(([ses, sod]: [Session | undefined, SessionOnDay | undefined]) => {
        // athleti non assegnati
        const missa = getMissingAthletes(ses, sod, this.direction||'A');
        const missa_str = (missa.length>0) ? `${missa.map(p => `${p.name}`).join(', ')} not present yet; ` : '';
        // autisti non assegnati
        const missdc = getMissingDriversCount(sod, this.direction||'A');
        const missd_str = (missdc > 0) ? `${missdc} missing driver${(missdc > 1) ? 's' : ''};` : '';
        return `${missa_str}${missd_str}`;
      }));
  }
}
