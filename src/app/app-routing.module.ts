import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GastroDashboardComponent} from './domain/gastro-dashboard/gastro-dashboard.component';
import {LandingComponent} from './domain/landing/landing.component';
import {IsAuthenticatedGuard} from './domain/auth/guard/is-authenticated.guard';

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
        path: 'gastro',
        canActivate: [IsAuthenticatedGuard],
        children: [
            {
                path: '',
                component: GastroDashboardComponent,
                pathMatch: 'full'
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
