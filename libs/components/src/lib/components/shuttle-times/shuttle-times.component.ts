import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { DialogEditorBase } from '@olmi/components';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import {
  Dictionary,
  getTimeMlsValue,
  getTimeString,
  move,
  Person,
  Session,
  SessionContext,
  Shuttle
} from '@olmi/model';
import { getPersonName } from '../shuttles-utilities';
import { TimeToStringPipe } from '../pipes';
import { MatIcon } from '@angular/material/icon';
import { cloneDeep as _clone, isNumber, reduce as _reduce } from 'lodash';
import { I18nDirective } from '@olmi/common';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

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
    MatIcon,
    I18nDirective,
    FormsModule,
    NgxMaskDirective
  ],
  templateUrl: './shuttle-times.component.html',
  styleUrl: './shuttle-times.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShuttleTimesComponent extends DialogEditorBase<Shuttle> {
  title$: Observable<string>;
  items$: BehaviorSubject<PassengerTimeWrapper[]>
  subTitle$: Observable<string>;

  constructor() {
    super();
    this.title$ = this.value$.pipe(map((sht) => `${getTimeString(sht?.time||0)}  ${sht?.target||''}`));
    this.subTitle$ = combineLatest([this.manager.context$, this.value$])
      .pipe(map(([ctx, sht]: [SessionContext, Shuttle|undefined]) => getPersonName(ctx, sht?.driver||'')));
    this.items$ = new BehaviorSubject<PassengerTimeWrapper[]>(getItems(this.value$.value, this.manager.session$.value));
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
    const v = e.target.value || '';
    const time_value = getTimeMlsValue(v);
    if (time_value > 0) {
      this.updateItems((items, item) => {
        if (item) item.time = time_value;
      }, index);
    }
  }

  override applyValue = (sht: Shuttle) => {
    const items = this.items$.value;
    this.manager.updateSessionOnDay((sod) => {
      const sh = sod.shuttles.find(s => s.code === sht.code);
      if (sh) {
        sh.passengers = items.map(i => i.passenger?.code||'');
        sh.passengersTimesMap = _reduce(items, (m, i) =>
          ({ ...m, [i.passenger?.code||'']: i.time }), <Dictionary<number>>{});
      }
      return !!sh;
    });
  }
}

const getItems = (shuttle: Shuttle|undefined, session: Session|undefined): PassengerTimeWrapper[] => {
  if (!shuttle || !session) return [];

  return shuttle.passengers.map(a => {
    const w = new PassengerTimeWrapper();
    w.passenger = session.persons.find(p => p.code === a);
    w.time = (shuttle.passengersTimesMap||{})[a]||0;
    return w;
  });
}
