import { AfterViewInit, Component, computed, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import MuxPlayerElement from '@mux/mux-player';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AsyncPipe, DOCUMENT } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { BehaviorSubject } from 'rxjs';
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
  imports: [FormsModule, Link, MatIcon, MatMenuModule, AsyncPipe, GroupLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class App implements OnInit, AfterViewInit {
  protected title = 'home-page-extension';
  private storageService = inject(SaveLinks);
  private dialog = inject(MatDialog);
  private renderer = inject(Renderer2);

  protected environment = environment;

  savedLinks = this.storageService.getSavedLinks();
  // savedLinks = new BehaviorSubject<Shortcut[]>([]);

  playbackId = signal(environment.playbackId);
  videoTimeStamp = signal(environment.timeStamp);
  videoPoster = computed(() => environment.poster);

  @ViewChild('muxPlayer') muxPlayer!: ElementRef<MuxPlayerElement>;

  searchQuery = signal('');

  async ngOnInit(): Promise<void> {
    await this.storageService.retrieveSavedLinks();
    //     this.savedLinks.next([
    //     {
    //         "group": null,
    //         "id": "39780748-45dc-471d-9d3d-059d6ea99589",
    //         "name": "Youtube - Home - 2",
    //         "type": "Shortcut",
    //         "url": "https://youtube.com"
    //     },
    //     {
    //         "group": [
    //             {
    //                 "id": "bba75204-e28c-451c-8fae-17e0c1705e25",
    //                 "name": "Home Page",
    //                 "url": "https://github.com/Omdevsinh007?tab=repositories"
    //             },
    //             {
    //                 "id": "31a4a19a-858c-4897-94bf-2decb21b3742",
    //                 "name": "Profile page",
    //                 "url": "https://github.com/Omdevsinh007?tab=repositories"
    //             },
    //             {
    //                 "id": "b69feaeb-aedc-40fc-be51-63417ce15cfd",
    //                 "name": "New github page",
    //                 "url": "https://github.com/Omdevsinh007?tab=repositories"
    //             },
    //             {
    //                 "id": "7d0bc5f3-b6dd-4bf9-92dd-558dfc39deae",
    //                 "name": "Git hub",
    //                 "url": "https://github.com/Omdevsinh007?tab=repositories"
    //             }
    //         ],
    //         "id": "8cce4634-3b27-4469-8e5f-db8684f0f760",
    //         "name": "GitHub",
    //         "type": "Group",
    //         "url": null
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
}
