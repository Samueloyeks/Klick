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
  providers: [Badge,FirebaseServiceProvider,ProfileServiceProvider]
})
export class TabsPage {
  public picture: string=null;
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
  public personalReq = firebase.database().ref(`/requests/${firebase.auth().currentUser.uid}`);
  public personalAccepts = firebase.database().ref(`/acceptedTemp/${firebase.auth().currentUser.uid}`);

  constructor(public ProfileService: ProfileServiceProvider,private badge: Badge, public menuCtrl: MenuController, public events: Events,
    public detectorRef: ChangeDetectorRef, public RequestService: RequestServiceProvider,
    public FirebaseService: FirebaseServiceProvider) {
    this.RequestService.getMyRequests();
    this.RequestService.getAcceptResponse();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'myMenu');
    var sum1;
    var sum2;
    this.events.subscribe('gotRequests', (bv) => {
      this.requests = bv;
      var initialValue = 0;
      sum1 = this.requests.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue.req_isSee
      }, initialValue)
      this.badgeValue=sum1+sum2;
    })
    this.events.subscribe('gotAccepts', (bv) => {
      this.accepts = bv;
      var initialValue = 0;
      sum2 = this.accepts.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue.accept_isSeen;
      }, initialValue)
      this.badgeValue=sum2+sum1;
    })

  }

  clearBadge() {

    this.personalReq.orderByChild('uid').on('value', function (snapshot) {
      snapshot.forEach(function (userSnapshot) {
        let key = userSnapshot.key;
        let data = firebase.database().ref(`/requests/${firebase.auth().currentUser.uid}/${key}`);
        data.update({ isSeen: 0 })
      });
    })

    this.personalAccepts.orderByChild('uid').on('value', function (snapshot) {
      snapshot.forEach(function (userSnapshot) {
        let key = userSnapshot.key;
        let data = firebase.database().ref(`/acceptedTemp/${firebase.auth().currentUser.uid}/${key}`);
        data.update({ isSeen: 0 })
      })
    })
  }

  ionViewChildDidLeave() {
    this.clearBadge();
    this.events.unsubscribe('gotRequests');
    this.events.unsubscribe('gotRequests')
  this.badgeValue=0;
  }

  async uploadPicture():Promise<void>{
    try {
      const picture = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      });
      this.picture = picture.base64Data.slice(23);
      this.ProfileService.addPic(this.picture).then(()=>{
        this.picture = null;
    });
 
      } catch (error) {
      console.error(error);
      }
      // return this.profilePicture;
     
  }
 
}
