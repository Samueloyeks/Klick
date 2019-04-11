import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ChatHomePage } from '../chat-home/chat-home';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { UpdateStatusPage } from '../update-status/update-status';
import { Platform } from 'ionic-angular/platform/platform';
import { Events } from 'ionic-angular'
import * as firebase from 'firebase';



@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  public userProfile: any;
  public birthDate: Date;
  public createdAt: any;
  public userInfo: any;
  public userMetadata: any;
  public status: any;
  public username: firebase.database.Reference;


  constructor(public menuCtrl: MenuController, public navCtrl: NavController,public events:Events,
    public navParams: NavParams, public profileService: ProfileServiceProvider, public platform: Platform) {

  }

  ionViewWillEnter() {
    this.platform.ready().then(() => {
      this.menuCtrl.enable(false, 'myMenu');
      this.menuCtrl.swipeEnable(false);
    })

  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true, 'myMenu');
    this.menuCtrl.swipeEnable(true);
  }
  ngOnInit() {
    firebase.database().ref(`/userProfile/${firebase.auth().currentUser.uid}`).on('value', userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
      this.birthDate = userProfileSnapshot.val().dob;

      this.username = userProfileSnapshot.val().username;

    });
    this.profileService.getUserInfo().on('value', userInfoSnapshot => {
      this.userInfo = userInfoSnapshot.val();
    });
    this.createdAt = this.profileService.getMetadata().creationTime;
    // this.profileService.getUserProfile()
  }

  navigateToEditProfile() {
    this.navCtrl.push(EditProfilePage)
  }

  updateStatus() {
    this.navCtrl.push(UpdateStatusPage)
  }
  navigateToChatHome() {
    this.navCtrl.setRoot(ChatHomePage)
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
