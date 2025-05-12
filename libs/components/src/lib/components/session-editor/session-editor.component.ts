import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorBase } from '../editor.base';
import { FlexModule } from '@angular/flex-layout';
import { DailyChatComponent } from '../daily-chat/daily-chat.component';
import { SessionHeaderComponent } from '../session-header/session-header.component';
import { SessionCalendarComponent } from '../session-calendar/session-calendar.component';
import { PersonsEditorComponent } from '../persons-editor/persons-editor.component';
import { ShuttlesEditorComponent } from '../shuttles-editor/shuttles-editor.component';
import { I18nDirective } from '@olmi/common';
import { MatButtonModule } from '@angular/material/button';
import { CalendarItem, use } from '@olmi/model';
import { CalendarItemEditorComponent } from '../calendar-item-editor/calendar-item-editor.component';
import KEYS from '../../../../../../resources.keys';
import { SessionFooterComponent } from '../session-footer/session-footer.component';

@Component({
  selector: 'session-editor',
  imports: [
    CommonModule,
    FlexModule,
    MatButtonModule,
    DailyChatComponent,
    SessionHeaderComponent,
    SessionCalendarComponent,
    I18nDirective,
    PersonsEditorComponent,
    ShuttlesEditorComponent,
    SessionFooterComponent,
  ],
  templateUrl: './session-editor.component.html',
  styleUrl: './session-editor.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionEditorComponent extends EditorBase {
  protected readonly KEYS = KEYS;

  addShuttle() {
    use(this.manager.date$, (date) =>
      this._dialog.open(CalendarItemEditorComponent, {
        data: new CalendarItem({ dayOfWeek: date.getDay() })
      }));
  }
}


