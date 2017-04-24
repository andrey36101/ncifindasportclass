import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";
@Injectable()
export class LoggedInGuard implements CanActivate {
    constructor(private authService: AuthService, private route: Router) {

    }
    canActivate() {


        return this.authService.isLoggedIn()
            .map((res: Response)=>{

                if(res.json().Status=="success"){
                    localStorage.setItem('userProfile', JSON.stringify(res.json().Data);
                    return true;
                }else
                    return false;
            })
            .take(1)
            .catch(e=> {
                if (window.location.hash == '#/login') {
                    return Observable.of(true);
                }
                this.route.navigate(['login']);
                return Observable.of(true);
            });
    }
}