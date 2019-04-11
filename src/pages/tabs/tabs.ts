import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events } from 'ionic-angular';
import { ChatsPage } from '../chats/chats';
import { MatchupPage } from '../matchup/matchup';
import { UploadPage } from '../upload/upload';
import { FeedPage } from '../feed/feed';
import { NotificationsPage } from '../notifications/notifications';
import { ChatHomePage } from '../chat-home/chat-home';
import { Badge } from '@ionic-native/badge';
import { RequestServiceProvider } from '../../providers/request-service/request-service';
import * as firebase from 'firebase';
import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { Plugins, CameraResultType } from '@capacitor/core';
const { Camera } = Plugins;


@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
  providers: [Badge, FirebaseServiceProvider, ProfileServiceProvider]
})
export class TabsPage {
  public picture: string = null;
  chatHomePage = ChatHomePage;
  matchupPage = MatchupPage;
  uploadPage = UploadPage;
  feedPage = FeedPage;
  notificationsPage = NotificationsPage;
  badgeValue: any;
  myRequests;
  myAccepts;
  requests = [];
  accepts;
  reqSum = 0;
  acceptSum = 0;
  username;
  public personalReq = firebase.database().ref(`/requests/${firebase.auth().currentUser.uid}`);
  public personalAccepts = firebase.database().ref(`/acceptedTemp/${firebase.auth().currentUser.uid}`);

  constructor(public ProfileService: ProfileServiceProvider, private badge: Badge, public menuCtrl: MenuController, public events: Events,
    public detectorRef: ChangeDetectorRef,public profileService: ProfileServiceProvider, public RequestService: RequestServiceProvider,
    public FirebaseService: FirebaseServiceProvider) {
    this.RequestService.getMyRequests();
    this.RequestService.getAcceptResponse();

  }

  ionViewWillLoad(){
    this.RequestService.getMyRequests();
    this.RequestService.getAcceptResponse();
    this.menuCtrl.enable(true, 'myMenu');
    //subscribe to event to get array of objects of isSeen values
    this.events.subscribe('gotRequests', (bv) => {
      if(bv!==null){
      var reqArr = bv.map(function (obj) {
        return obj.req_isSeen;
      });
      //convert array of objects to array 
      if (reqArr.length >= 1) {
        this.reqSum = reqArr.reduce(add)
      }
      //update badge value with sum of requests and accepts
      this.badgeValue = this.reqSum + this.acceptSum;
      }else{
        this.reqSum = 0;
        this.badgeValue = this.reqSum + this.acceptSum;
      }
    })

    this.events.subscribe('gotAccepts', (bv) => {
     if(bv!==null){
      var acceptArr = bv.map(function (obj) {
        return obj.accept_isSeen;
      });
      //convert array of objects to array 
      if (acceptArr.length >= 1) {
        this.acceptSum = acceptArr.reduce(add)
      }
      this.badgeValue = this.acceptSum + this.reqSum;
     }else{
      this.acceptSum = 0;
      this.badgeValue = this.reqSum + this.acceptSum;
     }
    })

    function add(accumulator, a) {
      return accumulator + a;
    }
  }

  ionViewDidLoad() {
    this.profileService.getUserProfile().on('value', userProfileSnapshot => {
      this.username = userProfileSnapshot.val().username;
      console.log(this.username)
      this.events.publish('username', this.username);
    });
  }

  async uploadPicture(): Promise<void> {
    try {
      const picture = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64,
      });
      this.picture = picture.base64Data.slice(23);
      this.ProfileService.addPic(this.picture).then(() => {
        this.picture = null;
      });

    } catch (error) {
      console.error(error);
    }
    // return this.profilePicture;

  }

}
