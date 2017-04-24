import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {AppModule} from './app.module';
let platformBrowser = platformBrowserDynamic();
platformBrowser.bootstrapModule(AppModule);