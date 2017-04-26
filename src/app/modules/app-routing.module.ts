import {NgModule} from '@angular/core';
import {RouterModule,Routes} from '@angular/router';
import {HttpModule} from '@angular/http';

import {LoginModule} from './login/login.module';
import {DashboardModule} from './dashboard/dashboard.module';
import {MessageModule} from './message/message.module';
import {RootComponent} from '../components/layout/root.component';
import {HeaderComponent} from '../components/layout/header.component';
import {SidebarComponent} from '../components/layout/sidebar.component';
import {LoggedInGuard} from './login/logged-in.guard';
import { DropdownModule } from 'ng2-bootstrap';

import {PagerService} from '../common/pager.service';
var routes:Routes = [
    {
        path: 'login',
        loadChildren: './login/login.module#LoginModule'
    },
    {
        path: '',
        pathMatch:'full',
        redirectTo:'/sports',
        canActivate:[LoggedInGuard]
    },
    {
        path: '',
        component: RootComponent,
        children: [...DashboardModule.ROUTES],
        canActivate:[LoggedInGuard]
    },
    {
        path: 'messages',
        component: RootComponent,
        children: [...MessageModule.ROUTES],
        canActivate:[LoggedInGuard]
    },

];
@NgModule({
    declarations: [RootComponent,HeaderComponent,SidebarComponent],
    imports: [DropdownModule.forRoot(),HttpModule,RouterModule.forRoot(routes), LoginModule, DashboardModule, MessageModule],
    exports: [RouterModule],
    providers:[PagerService]
})
export class AppRoutingModule {

}