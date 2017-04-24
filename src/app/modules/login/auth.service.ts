import {Injectable} from "@angular/core";
import {Http,Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/take';

@Injectable()
export class AuthService {

    constructor(private http: Http) {

    }
    private headers = new Headers({'Content-Type': 'application/json'});
    isLoggedIn():Observable<any> {
        return this.http.post(`/checkLogin`,{})
            .map((r:Response)=>r)
           .take(1)
            .catch(this.handleError);
    }
    doLogin(email,password):Promise<any> {
        return this.http
            .post('/login', JSON.stringify({email: email,password:password}), {headers: this.headers})
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }
    logOut():Promise<any> {
        return this.http
            .get('/logout', {}, {headers: this.headers})
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }

    private handleError (error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);

    }
}