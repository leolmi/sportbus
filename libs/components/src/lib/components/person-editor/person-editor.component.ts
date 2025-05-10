import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { I18nDirective, I18nPipe } from '@olmi/common';
import { DialogEditorBase } from '../editor.base';
import { Person } from '@olmi/model';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'person-editor',
  imports: [
    CommonModule,
    FlexModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    I18nDirective,
    MatFormField,
    MatLabel,
    I18nPipe
  ],
  templateUrl: './person-editor.component.html',
  styleUrl: './person-editor.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonEditorComponent extends DialogEditorBase<Person> {
  override applyValue = (p: Person) => this.manager.updatePerson(p);
}
