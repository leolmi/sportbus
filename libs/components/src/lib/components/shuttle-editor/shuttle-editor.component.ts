import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { PassengerTimePipe, GroupNamePipe, PersonNamePipe, TimeToStringPipe, PersonIconPipe } from '../pipes';
import { EditorBase } from '@olmi/components';
import { Person, Shuttle, use } from '@olmi/model';
import { BehaviorSubject, filter } from 'rxjs';
import { remove as _remove } from 'lodash';
import { addShuttlePerson, getPersons, withShuttle } from '../shuttles-utilities';
import { ShuttleTimesComponent } from '../shuttle-times/shuttle-times.component';
import { MatDialogConfig } from '@angular/material/dialog';

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
    PassengerTimePipe,
    PersonIconPipe,
  ],
  templateUrl: './shuttle-editor.component.html',
  styleUrl: './shuttle-editor.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShuttleEditorComponent extends EditorBase {
  shuttle$: BehaviorSubject<Shuttle|undefined>;
  menuPersons$: BehaviorSubject<Person[]>;
  asDriver$: BehaviorSubject<boolean>;

  @Input()
  set shuttle(s: Shuttle|undefined|null) {
    this.shuttle$.next(s||undefined);
  }

  constructor() {
    super();
    this.menuPersons$ = new BehaviorSubject<Person[]>([]);
    this.shuttle$ = new BehaviorSubject<Shuttle|undefined>(undefined);
    this.asDriver$ = new BehaviorSubject<boolean>(false);
  }

  openPersonsMenu(trigger: MatMenuTrigger, driver: boolean) {
    this.asDriver$.next(driver);
    use(this.manager.sessionOnDay$, (sod) =>
      this.menuPersons$.next(getPersons(this.manager.session, driver, sod, this.shuttle$.value)));
  }

  addPerson(prs: Person) {
    this.manager.updateSessionOnDay((sod) =>
      addShuttlePerson(sod, prs, this.shuttle$.value, this.asDriver$.value));
  }

  removeShuttlePassenger(code: string) {
    this.manager.updateSessionOnDay((sod) =>
      withShuttle(sod, this.shuttle$.value, (s) =>
        _remove(s.passengers, a => a === code).length > 0));
  }

  deleteShuttle() {
    this.manager.updateSessionOnDay((sod) => {
      const removed = _remove(sod.shuttles, s => s.code === this.shuttle$.value?.code);
      return removed.length > 0;
    });
  }

  editTimes() {
    this._dialog
      .open(ShuttleTimesComponent, <MatDialogConfig>{
        data: this.shuttle$.value,
        width: '500px',
      })
      .afterClosed()
      .pipe(filter(r => !!r))
      .subscribe((r: Shuttle) => {
        this.manager.updateSessionOnDay((sod) => {
          const sh = sod.shuttles.find(s => s.code === r.code);
          if (sh) {
            sh.passengers = [...r.passengers];
            sh.passengersTimesMap = { ...r.passengersTimesMap };
          }
          return !!sh;
        });
      });
  }
}
