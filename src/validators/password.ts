import { FormControl } from '@angular/forms';
import {AbstractControl} from '@angular/forms';

export class PasswordValidator {

    static MatchPassword(control:AbstractControl) {
       let password = control.get('password').value; // to get value in input tag
       let retypePassword = control.get('retypePassword').value; // to get value in input tag
        if(password != retypePassword) {
            console.log('false');
            control.get('retypePassword').setErrors( {MatchPassword: true} )
        } else {
            console.log('true');
            return null
        }
    }
}