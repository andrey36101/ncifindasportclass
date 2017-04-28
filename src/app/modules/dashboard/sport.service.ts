import { Injectable ,EventEmitter}    from '@angular/core';
import { Headers, Http, URLSearchParams } from '@angular/http';
import {Promise} from 'rxjs/add/operator/toPromise';

@Injectable()
export class SportService {
    private headers = new Headers();
    private sportUrl = 'api/sports';  // URL to web api

    constructor(private http: Http) {this.sportAdded= new EventEmitter();
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('token',localStorage.token);

    }
    getSports(options,filter:any = {}): Promise<Sport[]> {
        let apiRequestUrl=this.sportUrl;

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
            apiRequestUrl=queryString?this.sportUrl+'?'+queryString:this.sportUrl;
        }

        return this.http.get(apiRequestUrl, {headers: this.headers,search:params})
            .toPromise()
            .then(response => response.json() as sport[])
            .catch(this.handleError);
    }


    getSportsDetails(sportId):Promise<sportData[]>{
        let apiRequestUrl=this.sportUrl+'/'+sportId;
        return this.http.get(apiRequestUrl,  {headers: this.headers})
            .toPromise()
            .then(response => response as sport[])
            .catch(this.handleError);
    }

    createSport(postArray): Promise<Sport[]> {
        return this.http
            .post(this.sportUrl, JSON.stringify(postArray), {headers: this.headers})
            .toPromise()
            .then(res => res as sport[])
            .catch(this.handleError);
    }

    updateSport(postArray,sportId): Promise<profile[]> {
        let apiRequestUrl=this.sportUrl+'/'+sportId;
        return this.http
            .put(apiRequestUrl, JSON.stringify(postArray), {headers: this.headers})
            .toPromise()
            .then(res => res as profile[])
            .catch(this.handleError);
    }

    updateSportAddress(postArray,sportId): Promise<profile[]> {
        let apiRequestUrl=this.sportUrl+'/'+sportId+'/address';
        return this.http
            .put(apiRequestUrl, JSON.stringify(postArray), {headers: this.headers})
            .toPromise()
            .then(res => res as profile[])
            .catch(this.handleError);
    }


    private handleError (error: Response | any) {
        return error;
    }
}