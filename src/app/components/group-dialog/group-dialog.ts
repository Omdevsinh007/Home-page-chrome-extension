import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Link } from '../link/link';
import { Group, Shortcut } from '../../models/shortcut';
import { MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { SaveLinks } from '../../services/save-links';
import { ShortcutDialog } from '../shortcut-dialog/shortcut-dialog';
import { GroupShortcut } from '../group-shortcut/group-shortcut';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-group-dialog',
  imports: [MatDialogModule, Link, MatMenuModule, MatIcon, MatButton],
  templateUrl: './group-dialog.html',
  styleUrl: './group-dialog.css'
})
export class GroupDialog implements OnInit {
  private dialogRef = inject(MatDialogRef<GroupDialog>);
  data = inject<Shortcut>(MAT_DIALOG_DATA);
  private savedLinks = inject(SaveLinks);
  private dialog = inject(MatDialog);

  ngOnInit(): void {
    
  }

  addShortcut() {
    this.dialog.open(GroupShortcut, {
      hasBackdrop: true,
      maxWidth: '600px',
      width: '100%',
      data: { shortcut: this.data, isNewGroup: true }
    });
  }

  editShortcut(index: number) {
    this.dialog.open(GroupShortcut, {
      hasBackdrop: true,
      maxWidth: '600px',
      width: '100%',
      data: { shortcut: this.data, isNewGroup: false, index: index }
    });
  }

  closeGroup() {
    this.savedLinks.addSavedLink(this.data);
    this.dialogRef.close()
  }

  removeShortcut(id: string) {
    const group = this.data.group?.filter(g => g.id !== id);
    this.data.group = group!;
    this.savedLinks.addSavedLink(this.data);
  }
}
