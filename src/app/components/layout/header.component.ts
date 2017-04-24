import {Component,OnInit} from '@angular/core';
import {Router} from "@angular/router";

import {AuthService} from '../../modules/login/auth.service'
@Component({
    selector:'header',
    template:require('./views/header.html'),
    host:{

    }
})
export class HeaderComponent implements OnInit{
    constructor(private authService: AuthService,private route:Router) {}
    logOut():void{
        this.authService.logOut().then(res=>{localStorage.removeItem('currentUser');this.route.navigate(['login'])});
    }
    userName:string;
    ngOnInit() :void {
        let currentUserData = JSON.parse(localStorage.currentUser);
        this.userName=currentUserData.name;
    }
}