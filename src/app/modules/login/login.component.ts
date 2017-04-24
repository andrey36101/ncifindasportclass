import {Component, OnInit} from "@angular/core";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {NotificationService} from '../../common/notification.service';


@Component({
    selector: 'login',
    template: require('./login.html')
})
export class LoginComponent implements OnInit {
    loginFailedMsg: String;
    tab: String;
    types: String[];
    public regForm: FormGroup;
    public submitted: boolean;

    constructor(private authService: AuthService, private route: Router,private _fb: FormBuilder,public notificationService:NotificationService) {
        authService.isLoggedIn().subscribe(r=>{
            if(r.json().Status=="success")
                route.navigate(['dashboard']);
        });
    }

    doLogIn(email,password,event):void{
        event.preventDefault();
        this.authService.doLogin(email,password).then(res =>{
            if(res.error){
                throw res.error;
            }
            if(res.json().Status=="success") {
                this.notificationService.notifyMsg('You are logged in successfully','success');
                localStorage.setItem('token', res.json().Data.token);
                localStorage.setItem('userProfile', JSON.stringify(res.json().Data.user));
                this.route.navigate(['dashboard']);
            }
        }).catch(e =>{
            this.notificationService.notifyMsg(e,'error');
        });
    }

    save(model: User, isValid: boolean):void{
        this.submitted = true; // set form submit to true

        console.log(model, isValid);
        if(model.regPassowrd !== model.regConfirmPassword)
            isValid = false;
        if(isValid){
            let user = {email:model.regEmail,name:model.regName,password:model.regPassword,type:model.type};
            this.authService.doRegister(user).then(res =>{
                if(res.error){
                    throw res.error;
                }
                if(res.json().Status=="success") {
                    this.notificationService.notifyMsg('You have been registered successfully, Please login','success');
                    this.tab = 'login';
                }
                else
                    this.loginFailedMsg=res.json().message;
            }).catch(e =>{
                this.notificationService.notifyMsg(e,'error');
            });
        }

    }

    ngOnInit() {
        this.tab = 'login';
        this.types = ['Customer','Trainer'];
        this.submitted = false;
        this.regForm = this._fb.group({
            regName: ['', [<any>Validators.required]],
            regEmail: ['', [<any>Validators.required]],
            regPassword: ['', [<any>Validators.required]],
            regConfirmPassword: ['', [<any>Validators.required]],
            type: ['Customer', [<any>Validators.required]]
        });


    }

}