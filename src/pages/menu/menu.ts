import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ActionSheetController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { ProfilePage } from '../profile/profile';
import { TempFriendsListPage } from '../temp-friends-list/temp-friends-list';
import { FriendsListPage } from '../friends-list/friends-list';
import { LoginPage } from '../login/login';
import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import * as firebase from 'firebase';
import { Events } from 'ionic-angular'


@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  rootPage: any = TabsPage;
  public userProfile: firebase.database.Reference;
  storageRef:firebase.storage.Reference;
  public username: firebase.database.Reference;


  constructor(public profileService: ProfileServiceProvider, public actionSheetCtrl: ActionSheetController, public navCtrl: NavController,
    public navParams: NavParams, public loadingCtrl: LoadingController, public FirebaseService: FirebaseServiceProvider,public events:Events) {
     
     
  }

  ngOnInit() {
    this.profileService.getUserProfile().on('value', userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
      this.username = userProfileSnapshot.val().username;

      this.events.publish('username', this.username);
    });
  }

  navigateToProfile() {
    this.navCtrl.push(ProfilePage)
  }
  navigateToTempFriendsList() {
    this.navCtrl.push(TempFriendsListPage)
  }
  navigateToFriendsList() {
    this.navCtrl.push(FriendsListPage)
  }
  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Are you sure you want to Log out?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            var loader = this.loadingCtrl.create({ content: "Please wait..." });
            loader.present();
            this.FirebaseService.logoutUserService();
            loader.dismiss();
            this.navCtrl.setRoot(LoginPage);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

}
