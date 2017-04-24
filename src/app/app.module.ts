import {NgModule, Component} from "@angular/core";
import {APP_BASE_HREF, LocationStrategy, HashLocationStrategy} from '@angular/common';

import {AppRoutingModule} from './modules/app-routing.module';
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {ModalModule} from 'angular2-modal';
import {BootstrapModalModule} from 'angular2-modal/plugins/bootstrap';
import {NotificationService} from './common/notification.service';

@Component({
    selector: 'app',
    styles: [String(require('./styles/app.css'))],
    template: '<router-outlet></router-outlet>'
})
export class AppComponent {

}
@NgModule({
    declarations: [AppComponent],
    imports: [
        HttpModule,
        BrowserModule,
        AppRoutingModule,
        ModalModule.forRoot(),
        BootstrapModalModule
    ],
    exports: [],
    providers: [{
        provide: APP_BASE_HREF,
        useValue: '/'
    }, {
        provide: LocationStrategy, useClass: HashLocationStrategy
    },NotificationService],
    bootstrap: [AppComponent]
})
export class AppModule {

}