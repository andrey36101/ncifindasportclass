import {Component,ViewContainerRef, OnInit, ViewChild} from "@angular/core";
import {Overlay} from 'angular2-modal';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {SportService} from "./sport.service";
import { PagerService } from '../../common/pager.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {NotificationService} from '../../common/notification.service';
import { ModalDirective } from 'ng2-bootstrap';
import {MessageService} from "../message/message.service";
import {FeedbackService} from "./feedback.service";

import {GMapsService} from "./geocode.service";
import { NguiMapComponent } from '@ngui/map';


@Component({
    selector:'dashboard',
    template: require('./dashboard.html'),
    providers:[Modal]
})
export class DashboardComponent implements OnInit{

    sports: any[];
    perPageLimit: any=3;
    // pager object
    pager: any = {};
    // paged items
    pagedItems: any[];
    public searchForm: FormGroup;
    public messageForm: FormGroup;
    public feedbackForm: FormGroup;
    public addSportForm: FormGroup;

    public feedbackSubmitted: boolean;
    public msgSent: boolean;
    public submitted: boolean;
    public sportSubmitted: boolean;
    public isLoggedIn: boolean = false;
    public rating: number;
    public avgRating: number;
    attachedFiles: any[];
    selectedSport: any = {};
    filter: any = {};
    tab: any = "sportDetailsTab";
    zoom: number = 8;
    marker: any[];

    @ViewChild('messageModal') public messageModal:ModalDirective;

    @ViewChild('feedbackModal') public feedbackModal:ModalDirective;

    @ViewChild('addSportModal') public addSportModal:ModalDirective;

    @ViewChild('rattingModal') public rattingModal:ModalDirective;

    @ViewChild('sportDetailModal') public sportDetailModal:ModalDirective;

    lastMessages: any[];
    feedbackList: any[];
    trainer: any = {};
    currentUserData: any = {};
    sportModalTitle: string = "Add Sport";

    constructor(overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal, private feedbackService: FeedbackService,private sportService: SportService,private gMapService: GMapsService,private pagerService: PagerService,private _fb: FormBuilder,public notificationService:NotificationService,private messageService:MessageService) {
        overlay.defaultViewContainer = vcRef;
    }



    ngOnInit(): void {
        this.getSports(0);
        this.currentUserData = (JSON.parse(localStorage.getItem('userProfile')) || {});

        if(Object.keys(this.currentUserData).length > 0){
            this.isLoggedIn = true;
        } else{
            this.isLoggedIn = false;
        }

        this.searchForm = this._fb.group({
            tags: [''],
            name: [''],
            country: [''],
            state: [''],
            city: [''],
            age: [0],
            price: [0]
        });

        this.messageForm = this._fb.group({
            title: ['', [<any>Validators.required]],
            description: ['', [<any>Validators.required]],
        });

        this.feedbackForm = this._fb.group({
            content: ['', [<any>Validators.required]]
        });
        this.attachedFiles = [];


        this.initAddSportForm();

    }

    initAddSportForm(sport:any=null){

        if(sport==null){
            this.addSportForm = this._fb.group({
                sportName: ['', [<any>Validators.required]],
                sportDescription: ['', [<any>Validators.required]],
                sportPrice: ['', [<any>Validators.required]],
                sportMinAge: ['', [<any>Validators.required]],
                sportMaxAge:['', [<any>Validators.required]],
                address: this._fb.group({
                    address1: ['', <any>Validators.required],
                    address2: ['', <any>Validators.required],
                    sportCity: ['', <any>Validators.required],
                    sportState: ['', <any>Validators.required],
                    sportCountry: ['', <any>Validators.required],
                    zipcode: ['']
                })
            });
        } else {
            let address = sport.address || {};
            this.addSportForm = this._fb.group({
                sportName: [sport.name, [<any>Validators.required]],
                sportDescription: [sport.description, [<any>Validators.required]],
                sportPrice: [sport.price, [<any>Validators.required]],
                sportMinAge: [sport.minAge, [<any>Validators.required]],
                sportMaxAge:[sport.maxAge, [<any>Validators.required]],
                address: this._fb.group({
                    address1: [address.address1, <any>Validators.required],
                    address2: [address.address2, <any>Validators.required],
                    sportCity: [address.city, <any>Validators.required],
                    sportState: [address.state, <any>Validators.required],
                    sportCountry: [address.country, <any>Validators.required],
                    zipcode: [address.zipcode]
                })
            });

        }

    }

    getSports(pageNo):void{
        let options={"pageno":pageNo};

        this.sportService.getSports(options,this.filter).then(sports =>{

            this.sports = (sports.sports || []);

            this.setPage((sports.page+1 || 0) ,(sports.totalCount || 0));
        });
    }

    setPagination(page):void{
        this.getSports(page-1);
    }

    setPage(page: number,totalCount:number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        // get pager object from service
        this.pager = this.pagerService.getPager(totalCount, page,this.perPageLimit);

        // get current page of items
        this.pagedItems = this.sports.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    search(model: any, isValid: boolean):void{
        this.submitted = true; // set form submit to true
        this.filter = {};
        let fields = Object.keys(model);
        for(let i in fields){
            if(model[fields[i]]!=undefined && model[fields[i]]!= "" && model[fields[i]] != null){
                this.filter[fields[i]] = model[fields[i]];
            }
        }
        this.getSports(this.pager.currentPage - 1);

    }

    public showMessagedModal(trainer):void {


        if(trainer == undefined){
            this.notificationService.notifyMsg("Trainer profile not available",'error');
            return;

        }

        this.trainer = trainer;
        this.lastMessages = [];

        let options={"pageno":0,"rows":10,'sortOrder':'asc'};
        let filter = {senderId:this.currentUserData._id,recipientId:trainer._id};
        this.messageService.getMessages(options,filter).then(message =>{
            this.lastMessages = message.json().messages;

            this.messageModal.show();
        });

    }

    sendMessage(messageData:any,isValid):void{

        this.msgSent = true;
        if(isValid){
            messageData["senderId"] = this.currentUserData._id;
            messageData["recipientId"] = this.trainer._id;
            this.messageService.createMessage(messageData).then(res =>{
                if(res.error){
                    throw res.error;
                }
                if(res.json().Status=="success") {
                    this.notificationService.notifyMsg('Your private message sent to trainer','success');
                    this.trainer = {};
                    this.messageModal.hide();
                    this.msgSent = false;
                }
                this.messageForm = this._fb.group({
                    title: ['', [<any>Validators.required]],
                    description: ['', [<any>Validators.required]],
                });
            }).catch(e =>{
                this.notificationService.notifyMsg(e,'error');
            });
        }
    }

    public showFeedbackModal(trainer):void {


        if(trainer == undefined){
            this.notificationService.notifyMsg("Trainer profile not available",'error');
            return;

        }
        this.trainer = trainer;
        this.feedbackModal.show();

    }

    saveFeedback(feedbackData:any,isValid):void{

        this.feedbackSubmitted = true;
        if(isValid){
            feedbackData["userId"] = this.currentUserData._id;
            feedbackData["trainerId"] = this.trainer._id;
            feedbackData["rating"] = this.rating;
            console.log(feedbackData);
            this.feedbackService.createFeedback(feedbackData).then(res =>{
                if(res.error){
                    throw res.error;
                }
                if(res.json().Status=="success") {
                    this.notificationService.notifyMsg('Your feedback saved.','success');
                    this.trainer = {};
                    this.feedbackModal.hide();
                    this.feedbackSubmitted = false;
                }
                this.ratting = 0;
                this.feedbackForm = this._fb.group({
                    content: ['', [<any>Validators.required]],
                });
            }).catch(e =>{
                this.notificationService.notifyMsg(e,'error');
            });
        }
    }

    public showAddSportModal():void {
        this.sportModalTitle = "Add Sport";
        this.selectedSport = {};
        this.initAddSportForm();
        this.addSportModal.show();


    }

    public showRattingModal(trainer):void {
        console.log(trainer._id);

        let options={"pageno":0,"rows":10,'sortOrder':'asc'};
        let filter = {trainerId:trainer._id};
        this.feedbackService.getFeedbacks(options,filter).then(feedbacks =>{
            console.log(feedbacks.Data.feedbacks);
            this.feedbackList = feedbacks.Data.feedbacks;
            this.avgRating = feedbacks.Data.average;
            this.rattingModal.show();
        });

    }

    saveSport(sportData:any,isValid):void{


        let sport = {};

        if(this.attachedFiles.length){
            sport["prompPicture"] = this.attachedFiles[0].fileName;
        }

        if(sportData.sportName != undefined)
            sport["name"] = sportData.sportName;
        if(sportData.sportDescription != undefined)
            sport["description"] = sportData.sportDescription;
        if(sportData.sportPrice != undefined)
            sport["price"] = sportData.sportPrice;
        if(sportData.sportMinAge != undefined)
            sport["minAge"] = sportData.sportMinAge;
        if(sportData.sportMaxAge != undefined)
            sport["maxAge"] = sportData.sportMaxAge;

        let addressData = {};
        if(sportData.address){
            let address = sportData.address;


            if(address.address1 != undefined)
                addressData["address1"] = address.address1;
            if(address.address2 != undefined)
                addressData["address2"] = address.address2;
            if(address.sportCity != undefined)
                addressData["city"] = address.sportCity;
            if(address.sportState != undefined)
                addressData["state"] = address.sportState;
            if(address.sportCountry != undefined)
                addressData["country"] = address.sportCountry;
            if(address.zipcode != undefined)
                addressData["zipcode"] = address.zipcode;

            sport["address"] = addressData;
        }

        console.log(sport)
        console.log(addressData);


        if(this.sportModalTitle=="Edit Sport"){
            this.sportService.updateSport(sport,this.selectedSport._id).then(sports =>{
                this.sportService.updateSportAddress(addressData,this.selectedSport._id).then(sports =>{
                    this.addSportModal.hide();
                    this.sportSubmitted = false;
                    this.getSports(0);
                    this.attachedFiles = [];
                    this.notificationService.notifyMsg('Sport class updated successfully.','success');
                });
            });
        } else {
            this.sportService.createSport(sport).then(sports =>{
                this.addSportModal.hide();
                this.sportSubmitted = false;
                this.getSports(0);
                this.attachedFiles = [];
                this.notificationService.notifyMsg('Sport class successfully added.','success');
            });
        }

    }

    editSportModal(sport){

        this.sportModalTitle = "Edit Sport";
        this.selectedSport = sport;
        if(sport.prompPicture)
            this.selectedSport["prompPicture"] = '/uploads/' + sport.prompPicture;
        this.initAddSportForm(sport);
        this.addSportModal.show();
    }

    sportDetail(sport){
        console.log(sport);

        this.gMapService.getLatLan('ahmedabad, gujarat, india').then((geocode) => {
            this.marker = [];
            this.selectedSport['map'] = geocode.results[0].geometry.location;
            this.marker.push([parseFloat(geocode.results[0].geometry.location.lat), parseFloat(geocode.results[0].geometry.location.lng)]);


        });

        this.selectedSport = sport;
        this.sportDetailModal.show();
    }



    showMySports(){
        this.filter = {};
        this.filter["ownerId"] = this.currentUserData._id;
        this.getSports(0);

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
    }

    onCancelFileUpload(args: any){
        this.attachedFiles = [];

    }

}