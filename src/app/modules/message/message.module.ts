import {NgModule} from "@angular/core";
import {MessageComponent} from "./message-list.component";
import {MessageService} from "./message.service";
import { BrowserModule }  from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'

import {RouterModule,Routes} from '@angular/router';


var routes = [{
    path: '',
    component: MessageComponent
}];

@NgModule({
    declarations: [MessageComponent],
    imports:   [BrowserModule,CommonModule,ReactiveFormsModule,RouterModule],
    exports:   [MessageComponent],
    providers: [MessageService]
})
export class MessageModule {
    static ROUTES:any=routes;
}

