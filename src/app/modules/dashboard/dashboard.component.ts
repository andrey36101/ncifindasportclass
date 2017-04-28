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
    public ratting: number;

    filter: any = {};
    @ViewChild('messageModal') public messageModal:ModalDirective;

    @ViewChild('feedbackModal') public feedbackModal:ModalDirective;

    @ViewChild('addSportModal') public addSportModal:ModalDirective;

    lastMessages: any[];
    trainer: any = {};
    currentUserData: any = {};

    constructor(overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal, private feedbackService: FeedbackService,private sportService: SportService,private pagerService: PagerService,private _fb: FormBuilder,public notificationService:NotificationService,private messageService:MessageService) {
        overlay.defaultViewContainer = vcRef;
    }



    ngOnInit(): void {
        this.getSports(0);
        this.currentUserData = JSON.parse(localStorage.getItem('userProfile'));
        console.log(this.currentUserData,'currentUserData');
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


        this.addSportForm = this._fb.group({
            sportName: ['', [<any>Validators.required]],
            sportDescription: ['', [<any>Validators.required]],
            sportPrice: ['', [<any>Validators.required]],
            sportAge: ['', [<any>Validators.required]],
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
        console.log(trainer);

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
            console.log(this.lastMessages);
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
        console.log(trainer);

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
            console.log(feedbackData,this.ratting);
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
        console.log('showAddSportModal')
        this.addSportModal.show();

    }

    saveSport(sportData:any,isValid):void{

        console.log(sportData,isValid);
    }

}