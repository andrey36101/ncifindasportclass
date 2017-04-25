import {Component,ViewContainerRef, OnInit} from "@angular/core";
import {Overlay} from 'angular2-modal';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {SportService} from "./sport.service";
import { PagerService } from '../../common/pager.service';
@Component({
    selector:'dashboard',
    template: require('./dashboard.html'),
    providers:[Modal]
})
export class DashboardComponent implements OnInit{

    constructor(overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal, private sportService: SportService,private pagerService: PagerService) {
        overlay.defaultViewContainer = vcRef;
    }

    sports: any[];
    perPageLimit: any=3;
    // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];


    ngOnInit(): void {
        this.getSports(0);
    }

    getSports(pageNo):void{
        let options={"pageno":pageNo};
        //options=this.route.queryParams.value;
        this.sportService.getSports(options).then(sports =>{

            console.log(sports);

            this.sports = sports.sports;
            this.setPage(sports.page+1,sports.totalCount);
        });
    }

    setPagination(page):void{
        let page=page-1;
        this.getSports(page);
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
}