import { AfterViewInit, Component, computed, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, Renderer2, runInInjectionContext, signal, ViewChild, WritableSignal } from '@angular/core';
import MuxPlayerElement from '@mux/mux-player';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AsyncPipe, DOCUMENT } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatRipple } from '@angular/material/core';
import { Link } from "./components/link/link";
import { SaveLinks } from './services/save-links';
import { ShortcutDialog } from './components/shortcut-dialog/shortcut-dialog';
import { Shortcut } from './models/shortcut';
import { GroupShortcut } from './components/group-shortcut/group-shortcut';
import { GroupName } from './components/group-name/group-name';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [FormsModule, Link, MatIcon, MatMenuModule, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class App implements OnInit, AfterViewInit {
  protected title = 'home-page-extention';
  private storageService = inject(SaveLinks);
  private dialog = inject(MatDialog);
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);

  protected environment = environment;

  savedLinks = this.storageService.getSavedLinks();

  playbackId = signal(environment.playbackId);
  videoTimeStamp = signal(environment.timeStamp);
  videoPoster = computed(() => environment.poster);

  @ViewChild('muxPlayer') muxPlayer!: ElementRef<MuxPlayerElement>;

  searchQuery = signal('');

  async ngOnInit(): Promise<void> {
    await this.storageService.retrieveSavedLinks();
    // this.savedLinks.(() => [{ id: '1', url: 'https://webflow.com', name: 'Webflow', type: "Shortcut", group:null }]);
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
}
