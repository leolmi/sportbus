import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { EditorBase } from '@olmi/components';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { Dictionary, getTimeMlsValue, getTimeString, move, Person, Session, Shuttle } from '@olmi/model';
import { getPersonName } from '../shuttles-utilities';
import { TimeToStringPipe } from '../pipes';
import { MatIcon } from '@angular/material/icon';
import { cloneDeep as _clone, isNumber, reduce as _reduce } from 'lodash';

class PassengerTimeWrapper {
  passenger: Person|undefined;
  time: number = 0;
}

@Component({
  selector: 'shuttle-times',
  imports: [
    CommonModule,
    FlexModule,
    MatDialogModule,
    MatButtonModule,
    TimeToStringPipe,
    MatIcon
  ],
  templateUrl: './shuttle-times.component.html',
  styleUrl: './shuttle-times.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShuttleTimesComponent extends EditorBase {
  shuttle = <Shuttle|undefined>inject(MAT_DIALOG_DATA);
  title$: Observable<string>;
  items$: BehaviorSubject<PassengerTimeWrapper[]>
  subTitle$: BehaviorSubject<string>;
  result$: Observable<Shuttle>;

  constructor() {
    super();
    this.title$ = this.manager.session$.pipe(map(ses =>
      getTile(this.shuttle, ses)));
    this.subTitle$ = new BehaviorSubject<string>(this.shuttle?.target||'');

    this.items$ = new BehaviorSubject<PassengerTimeWrapper[]>(getItems(this.shuttle, this.manager.session$.value));
    this.result$ = this.items$.pipe(map(items => {
      const sh = _clone(this.shuttle||new Shuttle());
      sh.passengers = items.map(i => i.passenger?.code||'');
      sh.passengersTimesMap = _reduce(items, (m, i) =>
        ({ ...m, [i.passenger?.code||'']: i.time }), <Dictionary<number>>{});
      return sh;
    }))
  }

  updateItems(handler: (items: PassengerTimeWrapper[], item?: PassengerTimeWrapper) => any, index?: number) {
    const items = _clone(this.items$.value);
    const item = isNumber(index) ? items[index] : undefined;
    handler(items, item);
    this.items$.next(items);
  }

  moveItem(index: number, delta = 1) {
    this.updateItems((items) => move(items, index, index + delta));
  }

  updateTime(e: any, index: number) {
    const v = e.target.value||'';
    const time_value = getTimeMlsValue(v);
    if (time_value>0) {
      this.updateItems((items, item) => {
        if (item) item.time = time_value;
      }, index);
    }
  }
}

const getTile = (shuttle: Shuttle|undefined, session: Session|undefined) =>
  `${getTimeString(shuttle?.time||0)}  (${getPersonName(session, shuttle?.driver||'')})`

const getItems = (shuttle: Shuttle|undefined, session: Session|undefined): PassengerTimeWrapper[] => {
  if (!shuttle || !session) return [];

  return shuttle.passengers.map(a => {
    const w = new PassengerTimeWrapper();
    w.passenger = session.persons.find(p => p.code === a);
    w.time = (shuttle.passengersTimesMap||{})[a]||0;
    return w;
  });
}
