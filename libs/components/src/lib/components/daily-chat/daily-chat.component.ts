import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { EditorBase } from '@olmi/components';

@Component({
  selector: 'daily-chat',
  imports: [
    CommonModule,
    FlexModule,
  ],
  templateUrl: './daily-chat.component.html',
  styleUrl: './daily-chat.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DailyChatComponent extends EditorBase {

}
