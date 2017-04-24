import {NgModule} from "@angular/core";
import {DashboardComponent} from "./dashboard.component";

var routes = [{
    path: 'dashboard',
    component: DashboardComponent
}];

@NgModule({
    declarations: [DashboardComponent],
    imports: [],
    exports: [DashboardComponent]
})
export class DashboardModule {
    static ROUTES:any=routes;
}


