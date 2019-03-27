import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController } from 'ionic-angular';
import { RequestServiceProvider } from '../../providers/request-service/request-service';
import { ChatProvider } from '../../providers/chat/chat';
import { FriendProfilePage } from '../friend-profile/friend-profile';


@IonicPage()
@Component({
  selector: 'page-temp-friends-list2',
  templateUrl: 'temp-friends-list2.html',
})
export class TempFriendsList2Page {
  match;
  myRequests;
  myTempFriends;
  requestSenders;
  requestReceivers;
  constructor(public menuCtrl:MenuController,public navCtrl: NavController, public navParams: NavParams,
    public chatService: ChatProvider,public RequestService:RequestServiceProvider,public events:Events,) {
      // this.match = this.chatService.match;
  }



  ionViewWillEnter() {
    this.menuCtrl.enable(false,'myMenu');
    this.RequestService.getRequestSenders();
    this.requestSenders = [];
    this.events.subscribe('requestSenders',()=>{
      this.requestSenders = [];
      this.requestSenders=this.RequestService.requestSenders;
      console.log(this.RequestService.requestSenders)
    })
  } 

  ionViewDidLeave(){
    this.menuCtrl.enable(true,'myMenu');
    this.events.unsubscribe('requestSenders');
  }
  ionViewDidLoad() { 
    console.log('ionViewDidLoad TempFriendsList2Page');
  }
  navigateToFriendProfile(username:String,uid:String) {
    this.navCtrl.push(FriendProfilePage, {
      friendUsername: username, 
      friendUid: uid  
    });
  }

}
