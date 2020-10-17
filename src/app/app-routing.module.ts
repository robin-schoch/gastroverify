import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GastroDashboardComponent} from './domain/gastro-dashboard/gastro-dashboard.component';
import {LandingComponent} from './domain/landing/landing.component';
import {IsAuthenticatedGuard} from './domain/auth/guard/is-authenticated.guard';
import {GtcComponent} from './domain/gtc/gtc.component';
import {PersonalComponent} from './domain/personal/personal.component';
import {ReportComponent} from './domain/report/report.component';
import {AdminDashbaordComponent} from './domain/admin/admin-dashbaord/admin-dashbaord.component';
import {CustomVisitorCheckinComponent} from './domain/custom-visitor-checkin/custom-visitor-checkin.component';
import {EntryCounterComponent} from './domain/entry-counter/entry-counter.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: LandingComponent,
        pathMatch: 'full'
    },
    {
        path: 'location',
        canActivate: [IsAuthenticatedGuard],
        children: [
            {
                path: 'dashboard',
                component: GastroDashboardComponent,
                canActivate: [IsAuthenticatedGuard],
                pathMatch: 'full'
            },
            {
                path: 'personal',
                component: PersonalComponent,
                canActivate: [IsAuthenticatedGuard],
                pathMatch: 'full'
            },
            {
                path: 'report',
                component: ReportComponent,
                canActivate: [IsAuthenticatedGuard],
                pathMatch: 'full'
            },
            {
                path: 'counter',
                component: EntryCounterComponent,
                canActivate: [IsAuthenticatedGuard],
                pathMatch: 'full'
            },
          {
            path: 'checkIn',
            component: CustomVisitorCheckinComponent,
            canActivate: [IsAuthenticatedGuard],
            pathMatch: 'full'
          }
        ]
    },
    {
        path: 'gtc',
        component: GtcComponent,
        pathMatch: 'full'
    },

    {
        path: 'admin',
        component: AdminDashbaordComponent,
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
