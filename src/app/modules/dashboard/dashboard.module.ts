import {NgModule} from "@angular/core";
import {DashboardComponent} from "./dashboard.component";
import {SportService} from "./sport.service";
import {FeedbackService} from "./feedback.service";
import { BrowserModule }  from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ng2-bootstrap';

var routes = [{
    path: 'sports',
    component: DashboardComponent
}];

@NgModule({
    declarations: [DashboardComponent],
    imports: [BrowserModule,CommonModule,FormsModule,ReactiveFormsModule, ModalModule.forRoot()],
    exports: [DashboardComponent],
    providers:[SportService,FeedbackService]
})
export class DashboardModule {
    static ROUTES:any=routes;
}

