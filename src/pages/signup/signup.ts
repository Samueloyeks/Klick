import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CreateProfilePage } from '../create-profile/create-profile';
import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import { LoadingController, ToastController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';



@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [FirebaseServiceProvider]
})
export class SignupPage {
  public signupForm: FormGroup;

  public fullName: any;
  public email: any;
  public username: any;
  public password: any;
  public gender: any;
  public dob: any;
  public age: String;

  passwordType: string = 'password';
  passwordShown: boolean = false;

  constructor(public FirebaseService: FirebaseServiceProvider, public navCtrl: NavController,
    public navParams: NavParams, public toastCtrl: ToastController,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, formBuilder: FormBuilder,
    public locationTracker: LocationTrackerProvider) {

    this.signupForm = formBuilder.group({
      fullName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      username: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required]
    });
  }


  getAge(dob) {
    var today = new Date();
    var birthDate = new Date(dob);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  public togglePassword() {
    if (this.passwordShown) {
      this.passwordShown = false;
      this.passwordType = 'password';
    } else {
      this.passwordShown = true;
      this.passwordType = 'string';
    }
  }

  onSubmit() {
    console.log(this.signupForm);
  }

  async navigateToCreateProfile(): Promise<void> {

    this.locationTracker.startTracking();

    var account = {
      fullName: this.signupForm.value.fullName,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
      username: this.signupForm.value.username,
      gender: this.signupForm.value.gender,
      dob: this.signupForm.value.dob,
      age: this.getAge(this.signupForm.value.dob).toString(),
      status: "Hey there, I'm new on klick",
      lat:this.locationTracker.lat,
      long:this.locationTracker.lng,
    };

    if (!this.signupForm.valid) {
      console.log(
        `Form is not valid yet, current value: ${this.signupForm.value}`
      );
    } else {
      let alert = this.alertCtrl.create({
        title: 'Terms and conditions',
        message: 'By clicking "I Agree" you accept the Klick terms and conditions',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => { console.log('Cancel clicked'); }
          },
          {
            text: 'I Agree',
            handler: () => {
              console.log('Agree clicked');
              var that = this;
              var loader = this.loadingCtrl.create({ content: "Please wait..." });
              loader.present();
              this.FirebaseService.signupUserService(account).then(() => {


                loader.dismiss().then(() => {
                  this.navCtrl.setRoot(CreateProfilePage);
                  const Alert = this.alertCtrl.create({
                    message: 'A confirmation email has been sent to your email address',
                    buttons: [
                      { text: 'Cancel', role: 'cancel' },
                      {
                        text: 'Ok',
                        role: 'cancel'
                      }
                    ]
                  });
                  Alert.present();
                });
              },
                error => {
                  loader.dismiss();
                  //unable to log in
                  let toast = this.toastCtrl.create({
                    message: error,
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
                  that.password = ""
                });
            }
          }
        ]
      });
      alert.present();
    }
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

}
