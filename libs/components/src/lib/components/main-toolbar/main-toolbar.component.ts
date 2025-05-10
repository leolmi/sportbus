import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { EditorBase, EssentialToolbarComponent } from '@olmi/components';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NAME_PART_ACCENT, NAME_PART_STANDARD, SPORTBUS_AUTHOR_LINK } from '@olmi/model';

@Component({
  selector: 'main-toolbar',
  imports: [
    CommonModule,
    FlexModule,
    MatToolbarModule,
    MatMenuModule,
    MatTooltipModule,
    EssentialToolbarComponent
  ],
  templateUrl: './main-toolbar.component.html',
  styleUrl: './main-toolbar.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainToolbarComponent extends EditorBase {
  protected readonly NAME_PART_STANDARD = NAME_PART_STANDARD;
  protected readonly NAME_PART_ACCENT = NAME_PART_ACCENT;
  clickOnLogo = () => window.open(SPORTBUS_AUTHOR_LINK, "_blank");
}
