import { Component, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './layout/navbar/navbar';
import { Sidebar } from './layout/sidebar/sidebar';
import { TeamsMeetingRoom } from './components/teams-meeting-room/teams-meeting-room';
import { TeamsCallService } from './services/teams-call.service';

@Component({
  selector: 'app-admin',
  imports: [Navbar, Sidebar, RouterOutlet, TeamsMeetingRoom],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  sidebarOpen = signal(false);
  sidebarCollapsed = signal(false);

  public teamsCall = inject(TeamsCallService);

  toggleSidebar() {
    this.sidebarOpen.update((v) => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  toggleCollapse() {
    this.sidebarCollapsed.update((v) => !v);
  }
}
