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
import { MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'calendar-item-editor',
  imports: [
    CommonModule,
    FlexModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    NgxMaskDirective,
    MatLabel,
    I18nDirective,
  ],
  templateUrl: './calendar-item-editor.component.html',
  styleUrl: './calendar-item-editor.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarItemEditorComponent extends DialogEditorBase<CalendarItem> {
  day = '';
  start = '';
  end = '';

  constructor() {
    super();
    this.day = this.i18n.localize(DAY[this.value$.value.dayOfWeek||0]);
    this.start = getTimeString(this.value.start);
    this.end = getTimeString(this.value.end);
  }
  override validate = (item: CalendarItem) => !!item.target && !!item.group && !!item.start && !!item.end;
  override applyValue = (item: CalendarItem) => {
    this.manager.updateSessionOnDay((sod) => {
      let xci =  sod.calendar.find(ci => ci.code === item.code);
      if (!xci) {
        xci = new CalendarItem(item);
        sod.calendar.push(xci);
      } else {
        this.extend(xci, item);
      }
      return true;
    });
  }

  setTimeValue(e: any, prp: string) {
    const time = getTimeMlsValue(e.target.value);
    this.updateValue(time, prp);
  }
}
