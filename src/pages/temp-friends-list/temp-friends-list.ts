import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController } from 'ionic-angular';
import { RequestServiceProvider } from '../../providers/request-service/request-service';
import { ChatProvider } from '../../providers/chat/chat';
import { FriendProfilePage } from '../friend-profile/friend-profile';

/**
 * Generated class for the TempFriendsListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-temp-friends-list',
  templateUrl: 'temp-friends-list.html',
})
export class TempFriendsListPage {
  match;
  myRequests;
  myTempFriends;
  requestSenders;
  requestReceivers;
  tempFriends = "All";
  constructor(public menuCtrl:MenuController,public navCtrl: NavController, public navParams: NavParams,
    public chatService: ChatProvider,public RequestService:RequestServiceProvider,public events:Events,) {
      // this.match = this.chatService.match;
  }



  ionViewWillEnter() {
    this.menuCtrl.enable(false,'myMenu');
    this.RequestService.getRequestReceivers();
    this.requestReceivers = []; 
    this.events.subscribe('requestReceivers',()=>{
      this.requestReceivers = [];
      this.requestReceivers=this.RequestService.requestReceivers;
      console.log(this.RequestService.requestReceivers)
    })

    this.RequestService.getRequestSenders();
    this.requestSenders = [];
    this.events.subscribe('requestSenders',()=>{
      this.requestSenders = [];
      this.requestSenders=this.RequestService.requestSenders;
      console.log(this.RequestService.requestSenders)
    })

    this.RequestService.getTempFriends();
    this.myTempFriends = [];
    this.events.subscribe('tempFriends',()=>{
      this.myTempFriends = [];
      this.myTempFriends=this.RequestService.myTempFriends;
      console.log(this.RequestService.myTempFriends)
    })
  } 
 
  ionViewDidLeave(){
    this.menuCtrl.enable(true,'myMenu');
    this.events.unsubscribe('requestReceivers');
    this.events.unsubscribe('requestSenders');
    this.events.unsubscribe('myTempFriends');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TempFriendsListPage');
  }
  navigateToFriendProfile(username:String,uid:String) {
    this.navCtrl.push(FriendProfilePage, {
      friendUsername: username, 
      friendUid: uid  
    });
  }


  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
}
