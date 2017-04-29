
import { Http } from '@angular/http';
import {Promise} from 'rxjs/add/operator/toPromise';
import { Injectable ,EventEmitter}    from '@angular/core';

@Injectable()
export class GMapsService{
    constructor(private http: Http) {

    }

    getLatLan(address: string) : Promise<any> {
        console.log('Getting Address - ', address);
        return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address)
            .toPromise()
            .then(response => response.json() as any)
            .catch(this.handleError);
    }
    handleError(error){
        return error;
    }
}