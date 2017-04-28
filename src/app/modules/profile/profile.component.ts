import {Component, OnInit,ViewContainerRef, ViewChild} from "@angular/core";
import {ProfileService} from "./profile.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Overlay} from 'angular2-modal';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {ChangeDetectorRef} from "@angular/core";
import {NotificationService} from '../../common/notification.service';

@Component({
    selector:'profile',
    template: require('./profile.html')
})
export class ProfileComponent implements OnInit{
    constructor(private profileService:ProfileService,private route: ActivatedRoute,private router: Router,private overlay: Overlay,private vcRef: ViewContainerRef,public modal: Modal, private changeRef:ChangeDetectorRef,public notificationService:NotificationService,private _fb: FormBuilder){
        overlay.defaultViewContainer = vcRef;
    }
    profile:any[];
    currentUserData: any = {};

    public profileForm: FormGroup;
    public formSubmitted: boolean;
    public types:any = [];
    filter: any = {};

    getProfile():void{


        this.profileService.getProfileDetails(this.currentUserData._id).then(profile =>{
            console.log(profile);
            this.profile = profile.json();
            console.log(this.profile);
            this.profileForm = this._fb.group({
                name: [this.profile.name, [<any>Validators.required]],
                email: [this.profile.email, [<any>Validators.required]],
                type: ['', [<any>Validators.required]],
                gender: ['', [<any>Validators.required]],
                password: ['', [<any>Validators.required]],
                confirmPassword: ['', [<any>Validators.required]],
                address: this._fb.group({
                    address1: ['', <any>Validators.required],
                    address2: ['', <any>Validators.required],
                    sportCity: ['', <any>Validators.required],
                    sportState: ['', <any>Validators.required],
                    sportCountry: ['', <any>Validators.required],
                    zipcode: ['8000']
                })
            });
        });
    }

    ngOnInit(): void {

        this.currentUserData = JSON.parse(localStorage.getItem('userProfile'));
        this.getProfile();
        this.types = ['Customer','Trainer'];
        this.formSubmitted = false;
        this.profileForm = this._fb.group({
            name: ['', [<any>Validators.required]],
            email: ['', [<any>Validators.required]],
            type: ['', [<any>Validators.required]],
            gender: ['', [<any>Validators.required]],
            password: ['', [<any>Validators.required]],
            confirmPassword: ['', [<any>Validators.required]],
            address: this._fb.group({
                address1: ['', <any>Validators.required],
                address2: ['', <any>Validators.required],
                sportCity: ['', <any>Validators.required],
                sportState: ['', <any>Validators.required],
                sportCountry: ['', <any>Validators.required],
                zipcode: ['8000']
            })
        });
    }


    saveProfile(profileData:any,isValid):void{

        console.log(profileData,isValid);
    }
}