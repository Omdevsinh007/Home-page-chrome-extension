import { AfterViewInit, Component, computed, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import MuxPlayerElement from '@mux/mux-player';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Link } from "./components/link/link";
import { ShortcutDialog } from './components/shortcut-dialog/shortcut-dialog';
import { GroupName } from './components/group-name/group-name';
import { GroupLink } from "./components/group-link/group-link";
import { GroupDialog } from './components/group-dialog/group-dialog';
import { SaveLinks } from './services/save-links';
import { Shortcut } from './models/shortcut';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [FormsModule, Link, MatIcon, MatMenuModule, GroupLink, DragDropModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class App implements OnInit, AfterViewInit {
  protected title = 'home-page-extension';
  private storageService = inject(SaveLinks);
  private dialog = inject(MatDialog);

  protected environment = environment;

  savedLinks$!: Observable<Shortcut[]>
  // savedLinks$ = new BehaviorSubject<Shortcut[]>([]);

  playbackId = signal(environment.playbackId);
  videoTimeStamp = signal(environment.timeStamp);
  videoPoster = computed(() => environment.poster);

  @ViewChild('muxPlayer') muxPlayer!: ElementRef<MuxPlayerElement>;

  searchQuery = signal('');

  linksData: WritableSignal<Shortcut[]> = signal([])

  async ngOnInit(): Promise<void> {
    await this.storageService.retrieveSavedLinks();
    this.savedLinks$ = this.storageService.getSavedLinks().pipe(
      map((s) => s.sort((a, b) => a?.position - b?.position))
    );
    this.savedLinks$.subscribe({
      next:(data) => {
        this.linksData.set(data);
      }
    })
    //     this.savedLinks$.next([
    //     {
    //         "group": null,
    //         "id": "39780748-45dc-471d-9d3d-059d6ea99589",
    //         "name": "Youtube - Home - 2",
    //         "type": "Shortcut",
    //         "url": "https://youtube.com",
    //         position: 3
    //     },
    //     {
    //         "group": null,
    //         "id": "39780748-45dc-471d-9d3d-059d6ea99589",
    //         "name": "Youtube - Home - 1",
    //         "type": "Shortcut",
    //         "url": "https://youtube.com",
    //         position: 1
    //     },
    //     {
    //         "group": [
    //             {
    //                 "id": "bba75204-e28c-451c-8fae-17e0c1705e25",
    //                 "name": "Home Page",
    //                 "url": "https://github.com/Omdevsinh007?tab=repositories",
    //                 position: 1
    //             },
    //             {
    //                 "id": "31a4a19a-858c-4897-94bf-2decb21b3742",
    //                 "name": "Profile page",
    //                 "url": "https://github.com/Omdevsinh007?tab=repositories",
    //                 position: 2
    //             },
    //             {
    //                 "id": "b69feaeb-aedc-40fc-be51-63417ce15cfd",
    //                 "name": "New github page",
    //                 "url": "https://github.com/Omdevsinh007?tab=repositories",
    //                 position: 3
    //             },
    //             {
    //                 "id": "7d0bc5f3-b6dd-4bf9-92dd-558dfc39deae",
    //                 "name": "Git hub",
    //                 "url": "https://github.com/Omdevsinh007?tab=repositories",
    //                 position: 4
    //             }
    //         ],
    //         "id": "8cce4634-3b27-4469-8e5f-db8684f0f760",
    //         "name": "GitHub",
    //         "type": "Group",
    //         "url": null,
    //         position: 2
    //     }
    // ]);
  }

  ngAfterViewInit(): void {
    this.muxPlayer.nativeElement.playbackId = this.playbackId();
    this.muxPlayer.nativeElement.style.aspectRatio = '16/9';
    this.muxPlayer.nativeElement.poster = this.videoPoster();
  }

  addShortcut() {
    this.dialog.open(ShortcutDialog, {
      hasBackdrop: true,
      maxWidth: '600px',
      width: '100%'
    });
  }

  editShortcut(value: Shortcut) {
    this.dialog.open(ShortcutDialog, {
      hasBackdrop: true,
      maxWidth: '600px',
      width: '100%',
      data: value
    });
  }

  async removeShortcut(id: string) {
    await this.storageService.removeSavedLink(id);
  }

  addGroup() {
    this.dialog.open(GroupName, {
      hasBackdrop: true,
      maxWidth: '600px',
      width: '100%'
    });
  }

  openShortcutGroup(shortcut: Shortcut) {
    this.dialog.open(GroupDialog, {
      maxWidth: '70dvw',
      maxHeight: '70dvh',
      height: '100%',
      width: '100%',
      id: "dialog-group-overlay",
      data: shortcut,
      disableClose: true
    });
  }

  async drop(event: CdkDragDrop<Shortcut[]>) {
    moveItemInArray(this.linksData(), event.previousIndex, event.currentIndex);
    this.linksData.update((value) => value.map((data, index) => ({...data, position: index})));
    await this.storageService.setShortcuts(this.linksData());
  }
}
