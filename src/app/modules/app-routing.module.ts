import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import {HttpModule} from '@angular/http';

import {LoginModule} from './login/login.module';
import {DashboardModule} from './dashboard/dashboard.module';

import {RootComponent} from '../components/layout/root.component';
import {HeaderComponent} from '../components/layout/header.component';
import {SidebarComponent} from '../components/layout/sidebar.component';
import {LoggedInGuard} from './login/logged-in.guard';


var routes:Routes = [
    {
        path: 'login',
        loadChildren: './login/login.module#LoginModule'
    },
    {
        path: '',
        pathMatch:'full',
        redirectTo:'/dashboard',
        canActivate:[LoggedInGuard]
    },
    {
        path: '',
        component: RootComponent,
        children: [...DashboardModule.ROUTES],
        canActivate:[LoggedInGuard]
    }

];
@NgModule({
    declarations: [RootComponent,HeaderComponent,SidebarComponent],
    imports: [HttpModule,RouterModule.forRoot(routes), LoginModule, DashboardModule],
    exports: [RouterModule]
})
export class AppRoutingModule {

}