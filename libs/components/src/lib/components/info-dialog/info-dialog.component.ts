import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { EditorBase } from '@olmi/components';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { I18nPipe } from '@olmi/common';
import { Area } from '@olmi/model';


export interface InfoDialogOptions {
  showWelcome?: boolean;
  showHelp?: boolean;
  title?: string;
}

const INFO_AREAS: Area[] = [
  { icon: 'password', contentKey: '_info_area_code' },
  { icon: 'verified_user', contentKey: '_info_area_privacy' },
  { icon: 'badge', contentKey: '_info_area_sharing' },
  { icon: 'lock', contentKey: '_info_area_encryption' },
  { icon: 'admin_panel_settings', contentKey: '_info_area_security' },
  { icon: 'auto_delete', contentKey: '_info_area_duration' },
];

interface HelpLine {
  textKey: string;
  isTitle?: boolean;
}

const WELCOME_LINES: HelpLine[] = [
  { textKey: '_welcome_line_first' },
  { textKey: '_welcome_line_second' }
];

const HELP_LINES: HelpLine[] = [];

@Component({
  selector: 'info-dialog',
  imports: [
    CommonModule,
    FlexModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    I18nPipe
  ],
  templateUrl: './info-dialog.component.html',
  styleUrl: './info-dialog.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoDialogComponent extends EditorBase {
  protected readonly INFO_AREAS = INFO_AREAS;
  protected readonly WELCOME_LINES = WELCOME_LINES;
  protected readonly HELP_LINES = HELP_LINES;
  options = <InfoDialogOptions>inject(MAT_DIALOG_DATA)||{};
  DEFAULT_TITLE = 'what you need to know';

  constructor() {
    super();
  }
}
