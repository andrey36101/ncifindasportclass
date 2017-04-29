import {Component, OnInit,ViewContainerRef, ViewChild} from "@angular/core";
import {ProfileService} from "./profile.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Overlay} from 'angular2-modal';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {ChangeDetectorRef} from "@angular/core";
import {NotificationService} from '../../common/notification.service';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';

@Component({
    selector:'profile',
    template: require('./profile.html')
})
export class ProfileComponent implements OnInit{
    constructor(private profileService:ProfileService,private route: ActivatedRoute,private router: Router,private overlay: Overlay,private vcRef: ViewContainerRef,public modal: Modal, private changeRef:ChangeDetectorRef,public notificationService:NotificationService,private _fb: FormBuilder){
        overlay.defaultViewContainer = vcRef;
    }
    profile:any = {};
    currentUserData: any = {};

    public profileForm: FormGroup;
    public formSubmitted: boolean;
    public types:any = [];
    filter: any = {};
    attachedFiles: any[];

    getProfile():void{


        this.profileService.getProfileDetails(this.currentUserData._id).then(profile =>{

            this.profile = profile.json();
            if(profile.profilePic != undefined)
                this.profile.profilePic = '/uploads/' + profile.profilePic;

            let address = this.profile.address || {};
            this.profileForm = this._fb.group({
                name: [this.profile.name, [<any>Validators.required]],
                email: [this.profile.email, [<any>Validators.required]],
                type: [this.profile.type, [<any>Validators.required]],
                gender: [this.profile.gender, [<any>Validators.required]],
                // password: ['', [<any>Validators.required]],
                // confirmPassword: ['', [<any>Validators.required]],
                address: this._fb.group({
                    address1: [address.address1, <any>Validators.required],
                    address2: [address.address2, <any>Validators.required],
                    city: [address.city, <any>Validators.required],
                    state: [address.state, <any>Validators.required],
                    country: [address.country, <any>Validators.required],
                    zipcode: [address.zipcode]
                })
            });
        });
    }

    ngOnInit(): void {

        this.currentUserData = JSON.parse(localStorage.getItem('userProfile'));
        this.getProfile();
        this.attachedFiles = [];
        this.types = ['customer','trainer'];
        this.formSubmitted = false;

        if(this.currentUserData.profilePic)
            this.profile['profilePic'] = '/uploads/' + this.currentUserData.profilePic;
        else
            this.profile['profilePic'] = 'assets/images/profile-pic.png';

        this.profileForm = this._fb.group({
            name: ['', [<any>Validators.required]],
            email: ['', [<any>Validators.required]],
            type: ['', [<any>Validators.required]],
            gender: ['', [<any>Validators.required]],
            // password: ['', [<any>Validators.required]],
            // confirmPassword: ['', [<any>Validators.required]],
            address: this._fb.group({
                address1: ['', <any>Validators.required],
                address2: ['', <any>Validators.required],
                city: ['', <any>Validators.required],
                state: ['', <any>Validators.required],
                country: ['', <any>Validators.required],
                zipcode: ['']
            })
        });
    }


    saveProfile(profileData:any,isValid):void{

        let profile = {};

        if(this.attachedFiles.length){
            profile["profilePic"] = this.attachedFiles[0].fileName;
        }

        if(profileData.name != undefined)
            profile["name"] = profileData.name;

        if(profileData.email != undefined)
            profile["email"] = profileData.email;

        if(profileData.gender != undefined)
            profile["gender"] = profileData.gender;

        if(profileData.type != undefined)
            profile["type"] = profileData.type;


        let address = profileData.address;



        this.profileService.updateProfile(profile,this.currentUserData._id).then(profile =>{
            this.profile = profile.json();
            if(address!=undefined){
                this.profileService.updateProfileAddress(address,this.currentUserData._id).then(address=>{
                    this.notificationService.notifyMsg('Your profile updated.','success');
                })
            }
        }).catch(e =>{
            this.notificationService.notifyMsg('Something went wrong while updating your profile.','error');
        });
    }

    onUploadError(args: any) {
        console.log('onUploadError:', args);
    }

    onUploadSuccess(args: any) {
        let response = args[1].Data;

        this.attachedFiles.push({
            path:response[0].path,
            contentType:response[0].contentType,
            fileName:response[0].fileName
        });
        console.log('onUploadSuccess:', args);
    }

    onCancelFileUpload(args: any){
        this.attachedFiles = [];

    }
}