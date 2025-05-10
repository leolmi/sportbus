import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { I18nDirective, I18nPipe } from '@olmi/common';
import { DialogEditorBase } from '../editor.base';
import { Group } from '@olmi/model';

@Component({
  selector: 'group-editor',
  imports: [
    CommonModule,
    FlexModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    I18nDirective,
  ],
  templateUrl: './group-editor.component.html',
  styleUrl: './group-editor.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupEditorComponent extends DialogEditorBase<Group> {
  override applyValue = (grp: Group) => {
    this.manager.updateSession((ses) => {
      const sg = ses.groups.find(g => g.code === grp.code);
      this.extend(sg, grp);
      return true;
    })
  }
}
