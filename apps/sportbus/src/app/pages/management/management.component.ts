import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { EditorBase } from '@olmi/components';
import { MatButton } from '@angular/material/button';
import { NotificationType } from '@olmi/model';

@Component({
  imports: [
    CommonModule,
    FlexModule,
    MatButton
  ],
  selector: 'sportbus-management',
  templateUrl: './management.component.html',
  styleUrl: './management.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManagementComponent extends EditorBase {

  constructor() {
    super();
  }

  deleteAllSod() {
    this._confirm.show({
      message: 'Delete all session-an-day?',
      showYes: true,
      showNo: true
    }, (r) => {
      if (!!r) {
        this.interaction.deleteAllSod().subscribe(dr => {
          if (dr) {
            this.notifier.notify('session-on-days deleted successfully', NotificationType.success);
          } else {
            this.notifier.notify('cannot delete session-on-days', NotificationType.warning);
          }
        })
      }
    });
  }
}
