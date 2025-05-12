import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { GroupNamePipe, PassengerTimePipe, PersonIconPipe, PersonNamePipe, TimeToStringPipe } from '../pipes';
import { EditorBase, isReadyOnDirection } from '@olmi/components';
import { Person, SessionContext, SessionOnDay, Shuttle, use } from '@olmi/model';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { remove as _remove } from 'lodash';
import { addShuttlePerson, getPersons, withShuttle } from '../shuttles-utilities';
import { ShuttleTimesComponent } from '../shuttle-times/shuttle-times.component';
import { MatDialogConfig } from '@angular/material/dialog';
import { I18nDirective } from '@olmi/common';

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
    I18nDirective
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
  isDirectionOk$: Observable<boolean>;
  allowAddAll$: BehaviorSubject<boolean>;
  passengers$: Observable<Person[]>;
  drivers$: Observable<Person[]>;
  hasPassengers$: Observable<boolean>;

  @Input()
  set shuttle(s: Shuttle|undefined|null) {
    this.shuttle$.next(s||undefined);
  }

  constructor() {
    super();
    this.menuPersons$ = new BehaviorSubject<Person[]>([]);
    this.shuttle$ = new BehaviorSubject<Shuttle|undefined>(undefined);
    this.asDriver$ = new BehaviorSubject<boolean>(false);
    this.allowAddAll$ = new BehaviorSubject<boolean>(false);

    this.isDirectionOk$ = combineLatest([this.manager.sessionOnDay$, this.shuttle$])
      .pipe(map(([sod, s]: [SessionOnDay|undefined, Shuttle|undefined]) => isReadyOnDirection(sod, s?.direction)))

    this.passengers$ = combineLatest([this.manager.context$, this.shuttle$])
      .pipe(map(([ctx, sht]: [SessionContext, Shuttle|undefined]) => getPersons(ctx, false, sht)));
    this.drivers$ = this.manager.context$.pipe(map(ctx => getPersons(ctx, true)));

    this.hasPassengers$ = this.passengers$.pipe(map(prss => prss.length>0));
  }

  openPersonsMenu(trigger: MatMenuTrigger, driver: boolean) {
    this.asDriver$.next(driver);
    this.allowAddAll$.next(false);
    if (driver) {
      use(this.drivers$, prss => {
        this.menuPersons$.next(prss);
      });
    } else {
      const actual = (this.shuttle$.value?.passengers || []).length;
      use(this.passengers$, prss => {
        this.allowAddAll$.next(prss.length > 0 && prss.length <= (4 - actual));
        this.menuPersons$.next(prss);
      });
    }
  }

  addPerson(prs: Person) {
    this.manager.updateSessionOnDay((sod) =>
      addShuttlePerson(sod, prs, this.shuttle$.value, this.asDriver$.value));
  }

  addAllPersons(prss: Person[]) {
    this.manager.updateSessionOnDay((sod) => {
      return withShuttle(sod, this.shuttle$.value, (sht) => {
        prss.forEach(p => {
          if (!sht.passengers.includes(p.code)) {
            sht.passengers.push(p.code);
          }
        });
        return true;
      })
    });
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
    this._dialog.open(ShuttleTimesComponent, <MatDialogConfig>{
      data: this.shuttle$.value,
      width: '500px',
    });
  }
}
