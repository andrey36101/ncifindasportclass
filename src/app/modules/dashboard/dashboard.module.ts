import {NgModule} from "@angular/core";
import {DashboardComponent} from "./dashboard.component";
import {SportService} from "./sport.service";
import {FeedbackService} from "./feedback.service";
import { BrowserModule }  from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ng2-bootstrap';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

var routes = [{
    path: 'sports',
    component: DashboardComponent
}];
const DROPZONE_CONFIG: DropzoneConfigInterface = {
    // Change this to your upload POST address:
    server: '/uploadfiles',
    //autoReset: 5000,
    //errorReset: 5000,
    maxFiles:1,
    maxFilesize: 5,
    acceptedFiles: 'image/*',
    addRemoveLinks: true,
    createImageThumbnails: true
};
@NgModule({
    declarations: [DashboardComponent],
    imports: [BrowserModule,CommonModule,FormsModule,ReactiveFormsModule, ModalModule.forRoot(), DropzoneModule.forRoot(DROPZONE_CONFIG)],
    exports: [DashboardComponent],
    providers:[SportService,FeedbackService]
})
export class DashboardModule {
    static ROUTES:any=routes;
}

