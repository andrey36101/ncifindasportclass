import {NgModule} from "@angular/core";
import {LoginComponent} from "./login.component";
import {RouterModule} from "@angular/router";
import {AuthService} from "./auth.service";
import {LoggedInGuard} from "./logged-in.guard";
var routes = [{
    path: 'login',
    component: LoginComponent
}];
@NgModule({
    declarations: [LoginComponent],
    imports:[RouterModule.forChild(routes)],
    exports: [LoginComponent],
    providers:[AuthService,LoggedInGuard]
})
export class LoginModule {
}