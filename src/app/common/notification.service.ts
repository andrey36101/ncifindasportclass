import { Injectable }    from '@angular/core';
let noty=require('noty');

@Injectable()
export class NotificationService {
	notifyMsg(text,type): void{
		noty({text: text,type:type,timeout:5000});
	}
}
