import {NgModule} from "@angular/core";
import {ProfileComponent} from "./profile.component";
import {ProfileService} from "./profile.service";
import { BrowserModule }  from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'
import { ModalModule } from 'ng2-bootstrap';
import {RouterModule,Routes} from '@angular/router';


var routes = [{
    path: '',
    component: ProfileComponent
}];

@NgModule({
    declarations: [ProfileComponent],
    imports:   [BrowserModule,CommonModule,ReactiveFormsModule,RouterModule,ModalModule.forRoot()],
    exports:   [ProfileComponent],
    providers: [ProfileService]
})
export class ProfileModule {
    static ROUTES:any=routes;
}

