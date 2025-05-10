import { ChangeDetectionStrategy, Component, inject, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FlexModule } from '@angular/flex-layout';
import { MatButton } from '@angular/material/button';

export interface ConfirmOptions {
  message: string;
  title?: string;
  showYes?: boolean;
  showNo?: boolean;
  showCancel?: boolean;
  yesCaption?: string;
  noCaption?: string;
  cancelCaption?: string;
  width?: string;
}

@Component({
  selector: 'confirm-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    FlexModule,
    MatButton
  ],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent {
  config = <ConfirmOptions>inject(MAT_DIALOG_DATA);
}


@Injectable({
  providedIn: 'root',
  deps: [MatDialogModule]
})
export class ConfirmDialogUtility {
  private readonly _dialog = inject(MatDialog);

  show(data: ConfirmOptions, handler: (r: boolean|undefined) => any) {
    this._dialog
      .open(ConfirmDialogComponent, {
        data,
        width: data.width||'300px',
        panelClass: ['spb-confirm-dialog', 'spb-not-expand']
      })
      .afterClosed()
      .subscribe(r => handler(<boolean|undefined>r));
  }

  showYesNo(message: string, yesHandler: () => any) {
    this.show({ message, showYes: true, showNo: true },
      (r) => !!r ? yesHandler() : null);
  }
}
