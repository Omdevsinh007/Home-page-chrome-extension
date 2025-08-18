import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Link } from '../link/link';
import { Group, Shortcut } from '../../models/shortcut';
import { SaveLinks } from '../../services/save-links';
import { GroupShortcut } from '../group-shortcut/group-shortcut';

@Component({
  selector: 'app-group-dialog',
  imports: [MatDialogModule, Link, MatMenuModule, MatIcon, MatButton],
  templateUrl: './group-dialog.html',
  styleUrl: './group-dialog.css'
})
export class GroupDialog {
  private dialogRef = inject(MatDialogRef<GroupDialog>);
  data = inject<Shortcut>(MAT_DIALOG_DATA);
  private savedLinks = inject(SaveLinks);
  private dialog = inject(MatDialog);

  shortcutData = signal(this.data);

  addShortcut() {
    const dialog = this.dialog.open(GroupShortcut, {
      hasBackdrop: true,
      maxWidth: '600px',
      width: '100%',
      data: { shortcut: this.data, isNewGroup: true }
    });

    dialog.afterClosed().subscribe({
      next:(data) => {
        if(data?.success) {
          this.shortcutData.update((s) => ({...s, group: data.data.group}));
        }
      }
    })
  }

  editShortcut(index: number) {
    const dialog = this.dialog.open(GroupShortcut, {
      hasBackdrop: true,
      maxWidth: '600px',
      width: '100%',
      data: { shortcut: this.data, isNewGroup: false, index: index }
    });

    dialog.afterClosed().subscribe({
      next:(data) => {
        if(data?.success) {
          this.shortcutData.update((s) => ({...s, group: data.data.group}));
        }
      }
    })
  }

  closeGroup() {
    this.dialogRef.close()
  }

  removeShortcut(id: string) {
    this.shortcutData.update((v) => {
      return ({ ...v, group: v.group?.filter(g => g.id !== id)!});
    });
    this.savedLinks.addSavedLink(this.shortcutData());
  }
}
