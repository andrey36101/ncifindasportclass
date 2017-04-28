import { Injectable ,EventEmitter}    from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import {Promise} from 'rxjs/add/operator/toPromise';

@Injectable()
export class FeedbackService {
    private headers = new Headers();
    private feedbackUrl = 'api/feedback';  // URL to web api

    constructor(private http: Http) {this.sportAdded= new EventEmitter();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('token',localStorage.token);

    }
    getFeedbacks(options,filter:any = {}): Promise<Sport[]> {
        let apiRequestUrl=this.feedbackUrl;

        let params: URLSearchParams = new URLSearchParams();
        let searchParams = Object.keys(filter);

        for(let index in searchParams){
            params.set(searchParams[index], filter[searchParams[index]]);
        }

        if(Object.keys(options).length > 0){
            let queryString="";
            queryString+=options.rows?"rows="+options.rows:"";
            queryString+=options.pageno?"pageNo="+options.pageno:"";
            queryString+=options.sortby?"sortBy="+options.sortby:"";
            queryString+=options.sortorder?"sortOrder="+options.sortorder:"";
            apiRequestUrl=queryString?this.feedbackUrl+'?'+queryString:this.feedbackUrl;
        }

        return this.http.get(apiRequestUrl, {headers: this.headers,search:params})
            .toPromise()
            .then(response => response.json() as feedback[])
            .catch(this.handleError);
    }


    createFeedback(postArray): Promise<Sport[]> {
        return this.http
            .post(this.feedbackUrl, JSON.stringify(postArray), {headers: this.headers})
            .toPromise()
            .then(res => res as feedback[])
            .catch(this.handleError);
    }


    private handleError (error: Response | any) {
        return error;
    }
}