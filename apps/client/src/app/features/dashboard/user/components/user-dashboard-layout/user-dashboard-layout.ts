import { Component } from '@angular/core';
import { DashboardShellLayout } from '@features/dashboard/shared/components/dashboard-shell-layout/dashboard-shell-layout';
import { UserDashboardSidebar } from '../user-dashboard-sidebar/user-dashboard-sidebar';
import { UserDashboardHeader } from '../user-dashboard-header/user-dashboard-header';

@Component({
  selector: 'app-user-dashboard-layout',
  imports: [DashboardShellLayout, UserDashboardSidebar, UserDashboardHeader],
  templateUrl: './user-dashboard-layout.html'
})
export class UserDashboardLayout {}
