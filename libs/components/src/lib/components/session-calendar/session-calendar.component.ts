import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import {
  CalendarItemEditorComponent,
  EditorBase,
  GroupNamePipe,
  IsSodCalendarItemPipe,
  TimeToStringPipe
} from '@olmi/components';
import { MatIconModule } from '@angular/material/icon';
import { CalendarItem, use } from '@olmi/model';
import { remove as _remove } from 'lodash';
import { MatTooltipModule } from '@angular/material/tooltip';
import { I18nDirective, I18nPipe } from '@olmi/common';

@Component({
  selector: 'session-calendar',
  imports: [
    CommonModule,
    FlexModule,
    GroupNamePipe,
    TimeToStringPipe,
    MatIconModule,
    IsSodCalendarItemPipe,
    MatTooltipModule,
    I18nPipe,
    I18nDirective
  ],
  templateUrl: './session-calendar.component.html',
  styleUrl: './session-calendar.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionCalendarComponent extends EditorBase {
  constructor() {
    super();
  }

  removeSodItem(ci: CalendarItem) {
    this.manager.updateSessionOnDay((sod) =>
      _remove(sod.calendar, i => i.code === ci.code).length > 0);
  }

  editSodItem(data: CalendarItem) {
    this._dialog.open(CalendarItemEditorComponent, { data });
  }

  addSodItem() {
    use(this.manager.date$, (date) =>
      this._dialog.open(CalendarItemEditorComponent, {
        data: new CalendarItem({ dayOfWeek: date.getDay() })
      }));
  }
}
