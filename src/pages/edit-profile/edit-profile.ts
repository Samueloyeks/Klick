
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import * as firebase from 'firebase';
import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import 'firebase/auth';
import 'firebase/database';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { Platform } from 'ionic-angular/platform/platform';



@IonicPage() 
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
  providers: [FirebaseServiceProvider]
})
export class EditProfilePage {

  public userProfile: any;
  public birthDate: Date;
 

  navigateToTabs() {
    this.navCtrl.setRoot(TabsPage)
  }
  constructor(public menuCtrl:MenuController,public alertCtrl: AlertController, public firebaseService: FirebaseServiceProvider,
    public profileService: ProfileServiceProvider, public navCtrl: NavController, public navParams: NavParams, public platform: Platform) {
  
    }

  ngOnInit() {
    this.profileService.getUserProfile().on('value', userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
      this.birthDate = userProfileSnapshot.val().dob;
    });
  }
  
  ionViewWillEnter() {
    this.platform.ready().then(() => {
      this.menuCtrl.enable(false, 'myMenu');
      this.menuCtrl.swipeEnable(false);
    })

  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true,'myMenu');
    this.menuCtrl.swipeEnable(true);
  }


  async updateName(): Promise<void> {
    const alert = await this.alertCtrl.create({
      title: 'Your full name',
      inputs: [
        {
          type: 'text',
          name: 'fullName',
          placeholder: 'Your full name',
          value: this.userProfile.fullName,
        },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileService.updateName(data.fullName);
          },
        },
      ],
    });
    await alert.present();
  }

  async updateEmail(): Promise<void> {
    const alert = await this.alertCtrl.create({
      inputs: [
        { type: 'text', name: 'newEmail', placeholder: 'Your new email' },
        { name: 'password', placeholder: 'Your password', type: 'password' },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileService
              .updateEmail(data.newEmail, data.password)
              .then(() => {
                console.log('Email Changed Successfully');
              })
              .catch(error => {
                console.log('ERROR: ' + error.message);
              });
          },
        },
      ],
    });
    await alert.present();
  }
  
  async updatePassword(): Promise<void> {
    const alert = await this.alertCtrl.create({
      inputs: [
        { name: 'newPassword', placeholder: 'New password', type: 'password' },
        { name: 'oldPassword', placeholder: 'Old password', type: 'password' },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileService.updatePassword(
              data.newPassword,
              data.oldPassword
            )
          },
        },
      ],
    });
    await alert.present();
  }

  async updateUsername(): Promise<void> {
    const alert = await this.alertCtrl.create({
      title: 'Username',
      inputs: [
        {
          type: 'text',
          name: 'username',
          placeholder: 'Username',
          value: this.userProfile.username,
        },
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileService.updateUsername(data.username);
          },
        },
      ],
    });
    await alert.present();
  }

  async updateGender(): Promise<void> {
    const alert = await this.alertCtrl.create({
      title: 'Gender',
      inputs: [
        {
          type: 'radio',
          label:'Male',         
          value:'Male',
          checked:false
        },
        {
          type: 'radio',
          label:'Female',         
          value:'Female',
          checked:false
        },
      ],
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            this.profileService.updateGender(data);
          },
        },
      ],
    });
    await alert.present();
  }

  updateDOB(birthDate: any): void {
    console.log(birthDate);
    if (birthDate === undefined) {
    return;
    } else if (
    birthDate.year === undefined ||
    birthDate.month === undefined ||
    birthDate.day === undefined
    ) {
    return;
    }
    const dob: Date = new Date(
    birthDate.year.value,
    birthDate.month.value - 1,
    birthDate.day.value
    );
    this.profileService.updateDOB(dob);
  }    

  navigateToProfile(){
    this.navCtrl.pop()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateProfilePage');
  }

}