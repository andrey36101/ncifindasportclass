import {Component} from '@angular/core';
import 'bootstrap/less/bootstrap.less';
import 'font-awesome/less/font-awesome.less';
// import 'simple-line-icons/less/simple-line-icons.less';
import '../../styles/font.css';
import '../../styles/less/main.less';

@Component({
    selector: 'root',
    template:require('./views/app.html'),
})
export class RootComponent {

}
jQuery("body").on("click","#show-side-menu",function(){
    jQuery("body").addClass('sidebar-visible');
    jQuery("#page-sidebar").css("transform","translate(280px, 0px)");
});
jQuery("body").on("click","#hide-side-menu",function(){
    jQuery("body").removeClass('sidebar-visible');
    jQuery("#page-sidebar").css("transform","translate(0px,0px)");
});

jQuery(document).ready(function(){
    jQuery('.form-group.form-group-default', 'body').click(function() {
        jQuery(this).find('input').focus();
    });
    jQuery('body').on('click', '.form-group.form-group-default input', function() {
        jQuery('.form-group.form-group-default').removeClass('focused');
        jQuery(this).parents('.form-group').addClass('focused');
    });

    jQuery('body').on('blur', '.form-group.form-group-default :input', function() {
        jQuery(this).parents('.form-group').removeClass('focused');
        if (jQuery(this).val()) {
            jQuery(this).closest('.form-group').find('label').addClass('fade');
        } else {
            jQuery(this).closest('.form-group').find('label').removeClass('fade');
        }
    });

    jQuery('.form-group.form-group-default .checkbox, .form-group.form-group-default .radio', 'body').hover(function() {
        jQuery(this).parents('.form-group').addClass('focused');
    }, function() {
        jQuery(this).parents('.form-group').removeClass('focused');
    });
})