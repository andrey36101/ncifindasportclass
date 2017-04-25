import {NgModule} from "@angular/core";
import {DashboardComponent} from "./dashboard.component";
import {SportService} from "./sport.service";
import { BrowserModule }  from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
var routes = [{
    path: 'sports',
    component: DashboardComponent
}];

@NgModule({
    declarations: [DashboardComponent],
    imports: [BrowserModule,CommonModule],
    exports: [DashboardComponent],
    providers:[SportService]
})
export class DashboardModule {
    static ROUTES:any=routes;
}

