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
        this.authService.logOut().then(res=>{
            this.route.navigate(['login'])
        });
    }
    userName:string;
    user:any = {};
    public isLoggedIn:boolean = false;
    ngOnInit() :void {
        let currentUserData = JSON.parse(localStorage.getItem('userProfile'));

        if(currentUserData != undefined){
            this.userName=currentUserData.name;
            this.user = currentUserData;
            this.isLoggedIn = true;
        } else {
            this.userName='Guest';
            this.user = {};
            this.isLoggedIn = false;
        }

    }
}