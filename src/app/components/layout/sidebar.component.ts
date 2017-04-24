import {Component} from '@angular/core';

@Component({
    selector:'sidebar',
    template:require('./views/sidebar.html'),
    host:{
        'class':'app-aside hidden-xs bg-black'
    }
})
export class SidebarComponent{

}