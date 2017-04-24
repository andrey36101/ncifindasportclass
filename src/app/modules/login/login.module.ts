import {NgModule} from "@angular/core";
import {LoginComponent} from "./login.component";
import {RouterModule} from "@angular/router";
import {AuthService} from "./auth.service";
import {LoggedInGuard} from "./logged-in.guard";
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


var routes = [{
    path: 'login',
    component: LoginComponent
}];
@NgModule({
    declarations: [LoginComponent],
    imports:[
        CommonModule,
        RouterModule.forChild(routes),
        BrowserModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [LoginComponent],
    providers:[AuthService,LoggedInGuard]
})
export class LoginModule {
}