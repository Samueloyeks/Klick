import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Keyboard } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ProfilePage } from '../pages/profile/profile';
import { ActionSheetController, ToastController } from 'ionic-angular';
import { LoginPage } from '../pages/login/login';
 

import firebase from 'firebase';
import { TabsPage } from '../pages/tabs/tabs';
import { IntroPage } from '../pages/intro/intro';
import { FirebaseServiceProvider } from '../providers/firebase-service/firebase-service';
import { ProfileServiceProvider } from '../providers/profile-service/profile-service';
import { TempFriendsListPage } from '../pages/temp-friends-list/temp-friends-list';
import { FriendsListPage } from '../pages/friends-list/friends-list';
import { MenuPage } from '../pages/menu/menu';
import { TempFriendsList2Page } from '../pages/temp-friends-list2/temp-friends-list2';






@Component({
  templateUrl: 'app.html',
  providers: [FirebaseServiceProvider, ProfileServiceProvider]

})
export class MyApp {
  rootPage: any;
  loader: any;
  public usernameRef: any;
  public username: any;
  public userProfile: any;


 


  @ViewChild(Nav) private nav: Nav;

  constructor(public platform: Platform, public actionSheetCtrl: ActionSheetController,
    public FirebaseService: FirebaseServiceProvider,
    public toastCtrl: ToastController, splashScreen: SplashScreen, public storage: Storage,
    public loadingCtrl: LoadingController, public profileService: ProfileServiceProvider,public statusBar:StatusBar) {

    this.initializeApp();
  
   
  }


  

  navigateToProfile() {
    this.nav.push(ProfilePage)
  }
  navigateToTempFriendsList() {
    this.nav.push(TempFriendsListPage)
  }
  navigateToTempFriendsList2(){
    this.nav.push(TempFriendsList2Page)
  }
  navigateToFriendsList() {
    this.nav.push(FriendsListPage)
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.hide();
      this.statusBar.overlaysWebView(false);
      // this.keyboard.disableScroll(true);
      this.storage.get('introShown').then((result) => {
        if (result) {
          var that = this;

          const unsubscribe = firebase.auth().onAuthStateChanged(function (user) {
            if (!user) {
              // not signed in
              that.rootPage = LoginPage;
              unsubscribe();
            }
            else {
              // signed in
              that.rootPage = MenuPage;
              unsubscribe();
            }
          });

        } else {
          //first time user
          this.rootPage = IntroPage;
          this.storage.set('introShown', true);
        }
      });
    });
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
                this.nav.setRoot(LoginPage);
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


}

