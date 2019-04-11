import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';

@IonicPage()
@Component({
  selector: 'page-friend-profile',
  templateUrl: 'friend-profile.html',
})
export class FriendProfilePage {
  friendUsername:any;
  friendUid:any;
  friendProfile:any;
  friendInfo:any;
  gender:any;
  genderWord:any;
  constructor(public menuCtrl: MenuController, public navCtrl: NavController, 
    public navParams: NavParams, public platform: Platform, public profileService: ProfileServiceProvider) {
    this.friendUsername = navParams.get('friendUsername');
    this.friendUid = navParams.get('friendUid');
    console.log(this.friendUid,this.friendUsername)
  }

  ionViewWillEnter() {
    // this.platform.ready().then(() => {
      this.menuCtrl.enable(false, 'myMenu');
      this.menuCtrl.swipeEnable(false);

      this.profileService.getFriendProfile(this.friendUid).on('value', friendProfileSnapshot => {
        this.friendProfile = friendProfileSnapshot.val();
         console.log(this.friendProfile)
         this.gender = friendProfileSnapshot.val().gender;
         console.log(this.gender);
         if(this.gender =="Male"){
           this.genderWord ="his";
         }else if(this.gender =="Female"){
           this.genderWord ="her";
         }
       });
    // })

  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true, 'myMenu');
    this.menuCtrl.swipeEnable(true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendProfilePage');
  }


  ngOnInit() {
    this.platform.ready().then(() => {

  })
  }


}
