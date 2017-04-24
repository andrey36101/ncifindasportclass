import {Component,ViewContainerRef} from "@angular/core";
import {Overlay} from 'angular2-modal';
import {Modal} from 'angular2-modal/plugins/bootstrap';

@Component({
    selector:'dashboard',
    template: require('./dashboard.html'),
    providers:[Modal]
})
export class DashboardComponent{

    constructor(overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) {
        overlay.defaultViewContainer = vcRef;
    }
}