import {Injectable} from "@angular/core";
import {Http,Headers, Response} from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/take';

@Injectable()
export class ProfileService {
    private headers = new Headers();
    private profileUrl = "api/user";

    constructor(private http: Http) {
        this.headers.append('Content-Type', 'application/json');
        this.headers.append('token',localStorage.token);
    }

    updateProfile(postArray,profileId): Promise<profile[]> {
        let apiRequestUrl=this.profileUrl+'/'+profileId;
        return this.http
            .put(apiRequestUrl, JSON.stringify(postArray), {headers: this.headers})
            .toPromise()
            .then(res => res as profile[])
            .catch(this.handleError);
    }

    updateProfileAddress(postArray,profileId): Promise<profile[]> {
        let apiRequestUrl=this.profileUrl+'/'+profileId+'/address';
        return this.http
            .put(apiRequestUrl, JSON.stringify(postArray), {headers: this.headers})
            .toPromise()
            .then(res => res as profile[])
            .catch(this.handleError);
    }

    getProfileDetails(profileId):Promise<CouponData[]>{
        let apiRequestUrl=this.profileUrl+'/'+profileId;
        return this.http.get(apiRequestUrl,  {headers: this.headers})
            .toPromise()
            .then(response => response as profile[])
            .catch(this.handleError);
    }

    private handleError (error: Response | any) {
        return error;
    }
}