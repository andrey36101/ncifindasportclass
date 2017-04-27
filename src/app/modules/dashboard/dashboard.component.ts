import {Component,ViewContainerRef, OnInit, ViewChild} from "@angular/core";
import {Overlay} from 'angular2-modal';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {SportService} from "./sport.service";
import { PagerService } from '../../common/pager.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {NotificationService} from '../../common/notification.service';
import { ModalDirective } from 'ng2-bootstrap';
import {MessageService} from "../message/message.service";
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
    public submitted: boolean;
    filter: any = {};
    @ViewChild('messageModal') public messageModal:ModalDirective;
    lastMessages: any[];
    trainer: any = {};

    constructor(overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal, private sportService: SportService,private pagerService: PagerService,private _fb: FormBuilder,public notificationService:NotificationService,private messageService:MessageService) {
        overlay.defaultViewContainer = vcRef;
    }



    ngOnInit(): void {
        this.getSports(0);

        this.searchForm = this._fb.group({
            tags: [''],
            name: [''],
            country: [''],
            state: [''],
            city: [''],
            age: [0],
            price: [0]
        });
    }

    testFunction():void{
        console.log('andrei');
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

        let options={"pageno":0,"rows":10};
        this.messageService.getMessages(options).then(message =>{
            this.lastMessages = message.json().messages;
            this.messageModal.show();
        });

    }
}