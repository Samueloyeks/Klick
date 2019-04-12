import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController, App, Content } from 'ionic-angular';
import { RequestServiceProvider } from '../../providers/request-service/request-service';
import { ChatProvider } from '../../providers/chat/chat';
import { ChattingPage } from '../chatting/chatting';
import * as firebase from 'firebase'
import { ProfileServiceProvider } from '../../providers/profile-service/profile-service';
import { IfObservable } from 'rxjs/observable/IfObservable';






@IonicPage()
@Component({
  selector: 'page-chats',
  templateUrl: 'chats.html',
})

export class ChatsPage {
  @ViewChild(Content) content: Content;
  matchChats = firebase.database().ref('/matchChats')
  myRequests;
  myTempFriends = [];
  searchString: "";
  temparr = [];
  isScroll: number = 1;
  allMessages = [];
  tempFriendsuid = []
  id = String;
  messages;
  lastMessage;
  lastMessageTime;
  msgs = [];
  searchbox;
  username;
  allChats;
  chatsArr = [];
  msgArr = [];
  lastMsgArr= []
  allMatchMessages = []
  userId = firebase.auth().currentUser.uid
  chatId=[]

  public personalMessages = firebase.database().ref(`/matchChats/${firebase.auth().currentUser.uid}`);
  section: string = 'two';
  somethings: any = new Array(20);

  constructor(public zone: NgZone, public app: App, public chatService: ChatProvider,
    public menuCtrl: MenuController, public RequestService: RequestServiceProvider,
    public events: Events, public navCtrl: NavController, public profileService: ProfileServiceProvider, public navParams: NavParams) {
    this.RequestService.getMyRequests();
    this.RequestService.getAcceptResponse();
    
    this.RequestService.getTempFriends();
    this.chatService.getAllMatchMessages();

    this.events.subscribe('allMatchMessages', () => {
      this.allMatchMessages = []
      this.chatsArr = []
      this.msgArr = []
      this.lastMsgArr= []
      this.allMatchMessages = this.chatService.allMatchMessages;
      console.log(this.allMatchMessages) 
      
      if (this.allMatchMessages.length) {
        for (let i = 0; i < this.allMatchMessages.length; i++) {
          this.msgArr.push(this.allMatchMessages[i])
        }

        for (let j = 0; j < this.msgArr.length; j++) {
          this.chatsArr.push(this.objectToArray(this.msgArr[j]))
        }

        for (let k = 0; k < this.chatsArr.length; k++) {
          this.lastMsgArr.push(this.objectToArray(this.chatsArr[k]))
        }

      }

    })
    this.lastMsgArr= []

  }

  ionViewDidEnter() {
    this.chatService.getAllMatchMessages();
  }


  ionViewWillEnter() {
    this.chatService.getAllMatchMessages();
    this.RequestService.getTempFriends();
    this.myTempFriends = [];
    this.events.subscribe('tempFriends', () => {
      this.myTempFriends = [];
      this.myTempFriends = this.RequestService.myTempFriends;
      this.temparr = this.RequestService.myTempFriends;

      this.tempFriendsuid = [];
      this.tempFriendsuid = this.myTempFriends.map(personObj => personObj.uid);

      for (var k in this.tempFriendsuid) {
        this.personalMessages.child(this.tempFriendsuid[k]).on('value', (snapshot) => {
          this.allMessages = []
          this.messages = snapshot.val();
          this.allMessages.push(this.messages)
          const temp1 = this.objectToArray(this.allMessages[this.allMessages.length - 1])
          if (temp1 == null) {
            return
          } else {
            this.lastMessage = temp1[temp1.length - 1].message;
            this.lastMessageTime = temp1[temp1.length - 1].time;
          }
        })
      }
    })
  }

  objectToArray(obj: Object): Array<any> {
    if (obj == null) {
      return null;
    }
    return Array.from(Object.keys(obj), k => obj[k]);
  }

  ionViewDidLeave() { 
    this.events.unsubscribe('tempFriends');
    this.events.unsubscribe('allMatchMessages')
  }

  matchChat(item) {
    this.chatService.initializeMatch(item);
    this.app.getRootNav().push(ChattingPage);
  }


  searchUser(searchbar) {
    this.myTempFriends = this.temparr;
    var q = searchbar.target.value;
    if (q.trim() == "") {
      return;
    }
    this.myTempFriends = this.myTempFriends.filter((v) => {
      if ((v.username.toLowerCase().indexOf(q.toLowerCase())) > -1) {
        return true;
      }
      return false;
    })
  }

  ionViewWillLeave() {
    this.isScroll = 0;
  }
  ngAfterViewInit() {
    this.content.ionScroll.subscribe((data) => {
      this.isScroll = data.scrollTop;
      this.zone.run(() => {

      })
    })
  }

}
