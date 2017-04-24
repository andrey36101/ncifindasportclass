import {Http} from "@angular/http";
import {Observable} from "rxjs";
export class APIInterceptorService exte {
    BASE_URL;
    constructor(private http:Http){
        this.BASE_URL='/';
    }
    get(url,queryParams):Observable<any>{
        return this.http.get(url);
    }
}
