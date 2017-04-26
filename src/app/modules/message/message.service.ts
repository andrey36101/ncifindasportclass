import {Injectable,EventEmitter} from "@angular/core";
import {Http,Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/take';

@Injectable()
export class MessageService {
    private headers = new Headers();
    private messageUrl = "api/messages";
    public messageAdded: EventEmitter;

    constructor(private http: Http) {
        this.messageAdded= new EventEmitter();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('token',localStorage.token);
    }


    getMessages(options):Promise<any> {
        let apiRequestUrl=this.messageUrl;
        if(Object.keys(options).length > 0){

            let queryString="";
            queryString+=options.rows?"rows="+options.rows:"";
            queryString+=options.pageno?"pageNo="+options.pageno:"";
            queryString+=options.sortby?"sortBy="+options.sortby:"";
            queryString+=options.sortorder?"sortOrder="+options.sortorder:"";
            apiRequestUrl=queryString?this.messageUrl+'?'+queryString:this.messageUrl;

        }
        return this.http
            .get(apiRequestUrl,{headers: this.headers})
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }

    createMessage(postArray): Promise<message[]> {
        return this.http
            .post(this.messageUrl, JSON.stringify(postArray), {headers: this.headers})
            .toPromise()
            .then(res => res as message[])
            .catch(this.handleError);
    }

    getMessageDetails(messageId):Promise<CouponData[]>{
        let apiRequestUrl=this.messageUrl+'/'+messageId;
        return this.http.get(apiRequestUrl,  {headers: this.headers})
            .toPromise()
            .then(response => response as message[])
            .catch(this.handleError);
    }

    notifyMessageAdded(): void{
        this.messageAdded.emit();
    }


    private handleError (error: Response | any) {
        return error;
    }
}