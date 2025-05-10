import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { EditorBase, GroupNamePipe, TimeToStringPipe } from '@olmi/components';

@Component({
  selector: 'session-calendar',
  imports: [
    CommonModule,
    FlexModule,
    GroupNamePipe,
    TimeToStringPipe
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
}
