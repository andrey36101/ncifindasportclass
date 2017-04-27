import {Component, OnInit,ViewContainerRef} from "@angular/core";
import {MessageService} from "./message.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PagerService } from '../../common/pager.service'


import {Overlay} from 'angular2-modal';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {ChangeDetectorRef} from "@angular/core";
import {NotificationService} from '../../common/notification.service';

@Component({
    selector:'messageList',
    template: require('./message-list.html')
})
export class MessageComponent implements OnInit{
    constructor(private messageService:MessageService,private route: ActivatedRoute,private router: Router,private pagerService: PagerService,private overlay: Overlay,private vcRef: ViewContainerRef,public modal: Modal, private changeRef:ChangeDetectorRef,public notificationService:NotificationService){
        overlay.defaultViewContainer = vcRef;
        this.messageService.messageAdded.subscribe(coupon => this.messageAdded(this.pager.PageNo));
    }
    messages:any[];
    pager: any = {};

    // paged items
    pagedItems: any[];
    messageAdded(pageNo):void{
        this.getMessages(pageNo);
        this.changeRef.detectChanges();
        this.notificationService.notifyMsg('Message sent Successfully','success');
    }


    getMessages(pageNo):void{
        let options={"pageno":pageNo};
        this.messageService.getMessages(options).then(message =>{
            this.messages = message.json().messages;
            this.setPage(message.json().page+1,message.json().totalCount);
        });
    }

    ngOnInit(): void {
        this.getMessages(0);
    }


    setPagination(page):void{
        let page=page-1;
        this.getMessages(page);
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
}