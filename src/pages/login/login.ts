import { Component } from '@angular/core';
import { IonicPage, NavController,AlertController,Alert, NavParams,ToastController } from 'ionic-angular';
import * as firebase from 'firebase';
import { LoadingController } from 'ionic-angular';
import {FirebaseServiceProvider} from '../../providers/firebase-service/firebase-service';
import {MenuController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';



import {ChatsPage} from '../chats/chats';
import {SignupPage} from '../signup/signup';
import { IntroPage } from '../intro/intro';
import { TabsPage } from '../tabs/tabs';
import { ResetPasswordPage } from '../reset-password/reset-password';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers:[FirebaseServiceProvider]
})
export class LoginPage {
  public loginForm: FormGroup;
  // public email:string;
  // public password:string;

  passwordType:string='password';
  passwordShown:boolean=false;

  constructor(public FirebaseService:FirebaseServiceProvider,
    public menuCtrl:MenuController,public navCtrl: NavController,
    public toastCtrl:ToastController, public navParams: NavParams,
    public loadingCtrl: LoadingController,public alertCtrl:AlertController,
    public firebaseService:FirebaseServiceProvider,formBuilder:FormBuilder) {

    this.menuCtrl.enable(false, 'myMenu');
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['',Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

 public togglePassword(){
if(this.passwordShown){
  this.passwordShown=false;
  this.passwordType='password';
}else{
  this.passwordShown=true;
  this.passwordType='string';
}
 }

   async navigateToTabs(): Promise<void>{
    var that=this;
    
    if (!this.loginForm.valid) {
      console.log(
        `Form is not valid yet, current value: ${this.loginForm.value}`
      );
    } else {
     var loader = this.loadingCtrl.create({
        content: "Please Wait..."
      });
      loader.present();

      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
     
      this.FirebaseService.loginUserService(email,password).then((authData:any) =>{
        console.log(authData.user);
        if(authData.user.emailVerified){
          loader.dismiss();
          that.navCtrl.setRoot(TabsPage);     
        }else{
          loader.dismiss();
          const Alert = this.alertCtrl.create({
            message: 'Please verify email first',
            buttons: [
              { text: 'Ok', role: 'cancel' },
            ]
          });
          Alert.present();
        }
        
      },error=>{
        loader.dismiss();
        let toast=this.toastCtrl.create({
          message:error,
          duration:3000,
          position:'top'
        });
        toast.present();
       
      });  
  }
}
 
  navigateToIntro(){
    this.navCtrl.setRoot(IntroPage)
  }
  navigateToSignup(){
    this.navCtrl.push(SignupPage)
  }
  navigateToForgotPassword(){
    this.navCtrl.push(ResetPasswordPage)
  }

  
}
