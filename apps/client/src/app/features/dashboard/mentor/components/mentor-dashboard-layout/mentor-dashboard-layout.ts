import { Component } from '@angular/core';
import { DashboardShellLayout } from '@features/dashboard/shared/components/dashboard-shell-layout/dashboard-shell-layout';
import { MentorDashboardSidebar } from '../mentor-dashboard-sidebar/mentor-dashboard-sidebar';
import { MentorDashboardHeader } from '../mentor-dashboard-header/mentor-dashboard-header';

@Component({
  selector: 'app-mentor-dashboard-layout',
  imports: [DashboardShellLayout, MentorDashboardSidebar, MentorDashboardHeader],
  templateUrl: './mentor-dashboard-layout.html'
})
export class MentorDashboardLayout {}
