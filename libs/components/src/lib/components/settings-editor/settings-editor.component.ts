import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { EditorBase } from '../editor.base';
import { Clipboard, ClipboardModule } from '@angular/cdk/clipboard';
import {
  CalendarItem,
  getTimeMlsValue,
  getTimeString,
  Group,
  NotificationType,
  Person,
  Times,
  WEEK_DAYS
} from '@olmi/model';
import { MatExpansionModule } from '@angular/material/expansion';
import { reduce as _reduce, remove as _remove, set as _set } from 'lodash';
import { map, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'settings-editor',
  imports: [
    CommonModule,
    FlexModule,
    ClipboardModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatInputModule,
    MatExpansionModule,
    FormsModule
  ],
  templateUrl: './settings-editor.component.html',
  styleUrl: './settings-editor.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsEditorComponent extends EditorBase {
  private readonly _clipboard = inject(Clipboard);
  groupsCount$: Observable<string>;
  personsCount$: Observable<string>;
  calendarCount$: Observable<string>;
  calendarMap$: Observable<any>;

  weekDays = WEEK_DAYS;

  constructor() {
    super();

    this.groupsCount$ = this.manager.session$.pipe(map(s =>
      ((s?.groups||[]).length>0) ? `${(s?.groups||[]).length||0}` : '' ));
    this.personsCount$ = this.manager.session$.pipe(map(s =>
      ((s?.persons||[]).length>0) ? `${(s?.persons||[]).length||0}` : '' ));
    this.calendarCount$ = this.manager.session$.pipe(map(s =>
      ((s?.calendar||[]).length>0) ? `${(s?.calendar||[]).length||0}` : '' ));
    this.calendarMap$ = this.manager.session$.pipe(map(s =>
      getCalendarMap(s?.calendar||[])));

    this.manager.session$.subscribe(ss => console.log('SESSION', ss));
  }

  share() {
    this._clipboard.copy(this.interaction.getSessionUrl(this.manager.session?.code||''));
    this.notifier.notify('url copied successfully', NotificationType.success);
  }

  addGroup() {
    this.manager.updateSession(s => {
      s.groups.push(new Group());
      return true;
    });
  }

  updateGroup(e: any, grp: Group) {
    this.manager.updateSession(s => {
      const eg = s.groups.find(g => g.code === grp.code);
      if (eg) eg.name = e.target.value || '';
      return !!eg;
    });
  }

  deleteGroup(grp: Group) {
    this.manager.updateSession(s => {
      const removed = _remove(s.groups, g => g.code === grp.code);
      return removed.length > 0;
    });
  }

  addPerson() {
    this.manager.updateSession(s => {
      s.persons.push(new Person());
      return true;
    });
  }

  updatePerson(e: any, prs: Person, target: string) {
    this.manager.updateSession(s => {
      const ep = s.persons.find(g => g.code === prs.code);
      if (ep && target) _set(ep, target, e.target.value || '');
      console.log('UPDATE PERSON', ep, '\n\tSESSION', s);
      return !!ep;
    });
  }

  deletePerson(prs: Person) {
    this.manager.updateSession(s => {
      const removed = _remove(s.persons, p => p.code === prs.code);
      return removed.length > 0;
    });
  }

  updateCalendarItem(e: any, day: number, group: string) {
    this.manager.updateSession(s => {
      let item = s.calendar.find(ci => ci.dayOfWeek===day && ci.group === group);
      const times = getTimes(e.target.value||'')
      if (!item) {
        if (!times) return false;
        item = new CalendarItem({ dayOfWeek: day, group, start: times.start, end: times.end, target: times.target });
        s.calendar.push(item);
      } else if (!times) {
        _remove(s.calendar, ci => ci===item);
      } else {
        item.start = times.start;
        item.end = times.end;
        item.target = times.target;
      }
      return true;
    });
  }
}

const getTimes = (ts: string): Times|undefined => {
  const times: string[] = [];
  const words: string[] = [];
  let m: any;
  const rgx = /(\d{1,2}:\d{1,2})|(\w+)/gm;
  while (!!(m = rgx.exec(ts))) {
    if (m.index === rgx.lastIndex) rgx.lastIndex++;
    if (m[1]) times.push(m[1]);
    if (m[2]) words.push(m[2]);
  }
  const values = times.map(t => getTimeMlsValue(t));
  values.sort();
  if (values.length !== 2) return undefined;
  return (<Times>{
    start: values[0]||0,
    end: values[1]||0,
    target: words.join(' ')||''
  });
}

const getCalendarMap = (items: CalendarItem[]): any => {
  return _reduce(items, (m, i) => {
    return { ...m, [i.dayOfWeek]: { ...m[i.dayOfWeek], [i.group]: `${getTimeString(i.start)}  ${getTimeString(i.end)}  ${i.target}` } }
  }, <any>{});
}
