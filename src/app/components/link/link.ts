import { Component, inject, input, output } from '@angular/core';
import { Shortcut } from '../../models/shortcut';
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ShortcutDialog } from '../shortcut-dialog/shortcut-dialog';

@Component({
  selector: 'app-link',
  imports: [MatMenuModule, MatButtonModule],
  templateUrl: './link.html',
  styleUrl: './link.css'
})
export class Link {
  quickLink = input<Shortcut>();
  private dialog = inject(MatDialog);
  removeLink = output<string>();

  editShortcut() {
    this.dialog.open(ShortcutDialog, {
      hasBackdrop: true,
      maxWidth: '600px',
      width: '100%',
      data: this.quickLink()
    });
  }

  removeShortcut() {
    this.removeLink.emit(this.quickLink()!.id);
  }
}
