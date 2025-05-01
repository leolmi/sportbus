import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { EditorBase } from '@olmi/components';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Session, SessionOnDay, ShuttleDirection } from '@olmi/model';
import { getMissingAthletes, getMissingDriversCount } from './shuttles-utilities';

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
  messages$: Observable<string[]>;

  @Input()
  direction: ShuttleDirection|undefined;

  constructor() {
    super();

    this.messages$ = combineLatest([this.manager.session$, this.manager.sessionOnDay$])
      .pipe(map(([ses, sod]: [Session | undefined, SessionOnDay | undefined]) => {
        // athleti non assegnati
        const missa = getMissingAthletes(ses, sod, this.direction)
          .map(p => `${p.name} not included yet`);
        // autisti non assegnati
        const missdc = getMissingDriversCount(sod, this.direction);
        const missd = (missdc > 0) ? [`${missdc} missing driver${(missdc > 1) ? 's' : ''}`] : [];
        // messaggi d'errore
        return [...missa, ...missd];
      }));
  }
}
