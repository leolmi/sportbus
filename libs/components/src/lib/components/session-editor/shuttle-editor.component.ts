import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { GroupNamePipe, PersonNamePipe, TimeToStringPipe } from './pipes';
import { EditorBase } from '@olmi/components';
import { Person, Shuttle, use } from '@olmi/model';
import { BehaviorSubject } from 'rxjs';
import { remove as _remove } from 'lodash';
import { addShuttlePerson, getPersons, withShuttle } from './shuttles-utilities';

@Component({
  selector: 'shuttle-editor',
  imports: [
    CommonModule,
    FlexModule,
    MatIconModule,
    MatMenuModule,
    GroupNamePipe,
    PersonNamePipe,
    TimeToStringPipe,
  ],
  templateUrl: './shuttle-editor.component.html',
  styleUrl: './shuttle-editor.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShuttleEditorComponent extends EditorBase {
  shuttle$: BehaviorSubject<Shuttle|undefined>;
  menuPersons$: BehaviorSubject<Person[]>;

  PERSON_ICON: any = {
    athlete: 'person',
    driver: 'sports_motorsports'
  }

  @Input()
  set shuttle(s: Shuttle|undefined|null) {
    this.shuttle$.next(s||undefined);
  }

  constructor() {
    super();
    this.menuPersons$ = new BehaviorSubject<Person[]>([]);
    this.shuttle$ = new BehaviorSubject<Shuttle|undefined>(undefined);
  }

  openPersonsMenu(trigger: MatMenuTrigger, type: string) {
    use(this.manager.sessionOnDay$, (sod) =>
      this.menuPersons$.next(getPersons(this.manager.session, type, sod, this.shuttle$.value)));
  }

  addPerson(prs: Person) {
    this.manager.updateSessionOnDay((sod) =>
      addShuttlePerson(sod, prs, this.shuttle$.value));
  }

  removeShuttleAthlete(atl: string) {
    this.manager.updateSessionOnDay((sod) => {
      return withShuttle(sod, this.shuttle$.value, (s) => {
        _remove(s.athletes, a => a === atl);
        return true;
      });
    });
  }

  deleteShuttle() {
    this.manager.updateSessionOnDay((sod) => {
      const removed = _remove(sod.shuttles, s => s.code === this.shuttle$.value?.code);
      return removed.length > 0;
    });
  }
}
