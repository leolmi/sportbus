import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { I18nDirective } from '@olmi/common';
import { DialogEditorBase } from '../editor.base';
import { CalendarItem, DAY, getTimeMlsValue, getTimeString } from '@olmi/model';
import { NgxMaskDirective } from 'ngx-mask';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'day-editor',
  imports: [
    CommonModule,
    FlexModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    NgxMaskDirective,
    I18nDirective,
  ],
  templateUrl: './day-editor.component.html',
  styleUrl: './day-editor.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DayEditorComponent extends DialogEditorBase<CalendarItem> {
  day = '';
  start = '';
  end = '';

  constructor() {
    super();
    this.day = this.i18n.localize(DAY[this.value$.value.dayOfWeek||0]);
    this.start = getTimeString(this.value.start);
    this.end = getTimeString(this.value.end);
  }

  override applyValue = (item: CalendarItem) => {
    this.manager.updateSession((ses) => {
      let xci =  ses.calendar.find(ci => ci.dayOfWeek === item.dayOfWeek && ci.group === item.group);
      if (!xci) {
        xci = new CalendarItem(item);
        ses.calendar.push(xci);
      } else {
        this.extend(xci, item);
      }
      return true;
    });
  }

  setTimeValue(e: any, prp: string) {
    const time = getTimeMlsValue(e.target.value);
    this.updateValue$(this.value$, time, prp);
  }
}
