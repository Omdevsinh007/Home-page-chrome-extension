import { AfterViewInit, Component, computed, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import MuxPlayerElement from '@mux/mux-player';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { map, Observable, ReplaySubject } from 'rxjs';
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

  savedLinks$!: Observable<Shortcut[]>;

  playbackId = signal(this.environment.playbackId);
  videoTimeStamp = signal(this.environment.timeStamp);
  videoPoster = computed(() => this.environment.poster);

  @ViewChild('muxPlayer') muxPlayer!: ElementRef<MuxPlayerElement>;

  searchQuery = signal('');

  linksData: WritableSignal<Shortcut[]> = signal([])

  async ngOnInit(): Promise<void> {
    if(this.environment.isProd) {
      await this.storageService.retrieveSavedLinks();
      this.savedLinks$ = this.storageService.getSavedLinks();
    } else {
      this.savedLinks$ = new ReplaySubject<Shortcut[]>(1);
      this.loadDataForDev(this.savedLinks$);
    }
    this.savedLinks$.pipe(
        map((s) => s.sort((a, b) => a?.position - b?.position))
      ).subscribe({
      next:(data) => {
        this.linksData.set(data);
      }
    })
  }

  loadDataForDev(data: any) {
    data.next(this.environment.dummyData);
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
