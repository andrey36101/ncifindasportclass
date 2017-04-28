import {NgModule} from "@angular/core";
import {ProfileComponent} from "./profile.component";
import {ProfileService} from "./profile.service";
import { BrowserModule }  from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { ModalModule } from 'ng2-bootstrap';
import {RouterModule,Routes} from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DropzoneModule, DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

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

var routes = [{
    path: '',
    component: ProfileComponent
}];

@NgModule({
    declarations: [ProfileComponent],
    imports:   [BrowserModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        ModalModule.forRoot(),
        FlexLayoutModule,
        DropzoneModule.forRoot(DROPZONE_CONFIG)
    ],
    exports:   [ProfileComponent],
    providers: [ProfileService]
})
export class ProfileModule {
    static ROUTES:any=routes;
}

