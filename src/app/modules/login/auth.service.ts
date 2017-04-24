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
        let token = localStorage.getItem('token');
        return this.http.post(`/checkLogin`,JSON.stringify({token:token}),{headers: this.headers})
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
    doRegister(user):Promise<any> {
        return this.http
            .post('/user', JSON.stringify(user), {headers: this.headers})
            .toPromise()
            .then(res => res)
            .catch(this.handleError);
    }

    logOut():Promise<any> {
        return new Promise<boolean>((resolve, reject) => {
            localStorage.removeItem('token');
            localStorage.removeItem('userProfile');
            resolve(true);
        });

    }

    private handleError (error: Response | any) {

        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            console.log('body',body);
            const err = body.Error.message || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.Error.message ? error.Error.message : error.toString();
        }
        console.log(errMsg);

        return Observable.throw(errMsg);

    }
}