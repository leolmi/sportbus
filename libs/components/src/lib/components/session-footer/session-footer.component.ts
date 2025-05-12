import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EditorBase } from '../editor.base';
import { IsEmptyStringPipe } from '../pipes';
import { I18nDirective } from '@olmi/common';
import KEYS from '../../../../../../resources.keys';

@Component({
  selector: 'session-footer',
  imports: [
    CommonModule,
    FlexModule,
    MatButtonModule,
    MatIconModule,
    IsEmptyStringPipe,
    I18nDirective
  ],
  templateUrl: './session-footer.component.html',
  styleUrl: './session-footer.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionFooterComponent extends EditorBase {
  protected readonly KEYS = KEYS;

  goToConfiguration() {
    this.state.openSettingsEditor(this.manager.session?.code||'');
  }
}
