import {Component} from "@angular/core";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";

import {Observable} from "rxjs/Observable";
@Component({
    selector: 'login',
    template: require('./login.html')
})
export class LoginComponent {
    loginFailedMsg: String;
    constructor(private authService: AuthService, private route: Router) {
        authService.isLoggedIn().subscribe(r=>{
            if(r.json().status=="success")
                route.navigate(['dashboard']);
        });
    }
    loginFailedMsg:string="";
        doLogIn(email,password,event):void{
            event.preventDefault();
        this.authService.doLogin(email,password).then(res =>{
            if(res.json().status=="success") {
                localStorage.setItem('currentUser', JSON.stringify(res.json().data[0]));
                this.route.navigate(['dashboard']);
            }
            else
                this.loginFailedMsg=res.json().message;

        });

    }
}