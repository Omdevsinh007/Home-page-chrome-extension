import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { GroupShortcut } from '../group-shortcut/group-shortcut';
import { MatButtonModule } from '@angular/material/button';
import { Shortcut } from '../../models/shortcut';

@Component({
  selector: 'app-group-name',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatButtonModule],
  templateUrl: './group-name.html',
  styleUrl: './group-name.css'
})
export class GroupName implements OnInit {

  private dialogRef = inject(MatDialogRef<GroupName>);
  readonly data = inject<{ name: string }>(MAT_DIALOG_DATA);
  private dialog = inject(MatDialog)

  ngOnInit(): void {
    if(this.data && this.data.name) {
      this.groupName = this.data.name;
    }
  }

  groupName = "";

  createGroup() {
    this.dialog.open(GroupShortcut, {
      hasBackdrop: true,
      maxWidth: '600px',
      width: '100%',
      data: { name: this.groupName, isNewGroup: true }
    });
    this.dialogRef.close()
  }

  // editGroup(data: Shortcut, index: number) {
  //   this.dialog.open(GroupShortcut, {
  //     hasBackdrop: true,
  //     maxWidth: '600px',
  //     width: '100%',
  //     data: { shortcut: data, index: index ,name:this.groupName }
  //   });
  //   this.dialogRef.close()
  // }

  saveGroup() {

  }
}
