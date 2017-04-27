import {Component, OnInit,ViewContainerRef, ViewChild} from "@angular/core";
import {MessageService} from "./message.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PagerService } from '../../common/pager.service'
import { ModalDirective } from 'ng2-bootstrap';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {Overlay} from 'angular2-modal';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {ChangeDetectorRef} from "@angular/core";
import {NotificationService} from '../../common/notification.service';

@Component({
    selector:'messageList',
    template: require('./message-list.html')
})
export class MessageComponent implements OnInit{
    constructor(private messageService:MessageService,private route: ActivatedRoute,private router: Router,private pagerService: PagerService,private overlay: Overlay,private vcRef: ViewContainerRef,public modal: Modal, private changeRef:ChangeDetectorRef,public notificationService:NotificationService,private _fb: FormBuilder){
        overlay.defaultViewContainer = vcRef;
        this.messageService.messageAdded.subscribe(coupon => this.messageAdded(this.pager.PageNo));
    }
    messages:any[];
    pager: any = {};

    // paged items
    pagedItems: any[];
    currentUserData: any = {};

    public messageForm: FormGroup;
    public msgSent: boolean;
    filter: any = {};
    @ViewChild('messageModal') public messageModal:ModalDirective;
    lastMessages: any[];
    recipient: any = {};

    messageAdded(pageNo):void{
        this.getMessages(pageNo);
        this.changeRef.detectChanges();
        this.notificationService.notifyMsg('Message sent Successfully','success');
    }


    getMessages(pageNo):void{
        let options={"pageno":pageNo};
        let filter = {senderId:this.currentUserData._id,recipientId: this.currentUserData._id};
        this.messageService.getMessages(options).then(message =>{
            this.messages = message.json().messages;
            this.setPage(message.json().page+1,message.json().totalCount);
        });
    }

    ngOnInit(): void {
        this.getMessages(0);
        this.currentUserData = JSON.parse(localStorage.getItem('userProfile'));
        this.messageForm = this._fb.group({
            title: ['', [<any>Validators.required]],
            description: ['', [<any>Validators.required]],
        });
    }


    setPagination(page):void{
        this.getMessages(page-1);
    }

    setPage(page: number,totalCount:number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        // get pager object from service
        this.pager = this.pagerService.getPager(totalCount, page,3);

        // get current page of items
        this.pagedItems = this.messages.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }

    replyToMessage(recipient){
        if(recipient == undefined){
            this.notificationService.notifyMsg("Recepient profile not available",'error');
            return;

        }

        this.recipient = recipient;
        this.lastMessages = [];

        let options={"pageno":0,"rows":10,'sortOrder':'asc'};
        let filter = {senderId:this.currentUserData._id,recipientId:recipient._id};
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
            messageData["recipientId"] = this.recipient._id;
            this.messageService.createMessage(messageData).then(res =>{
                if(res.error){
                    throw res.error;
                }
                if(res.json().Status=="success") {
                    this.notificationService.notifyMsg('Your private message sent','success');
                    this.recipient = {};
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
}