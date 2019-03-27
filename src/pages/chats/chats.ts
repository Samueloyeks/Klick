import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController, App, Content } from 'ionic-angular';
import { RequestServiceProvider } from '../../providers/request-service/request-service';
import { ChatProvider } from '../../providers/chat/chat';
import { ChattingPage } from '../chatting/chatting';
import * as firebase from 'firebase'


 



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
  msgs = [];
  searchbox
  public personalMessages = firebase.database().ref(`/matchChats/${firebase.auth().currentUser.uid}`);
  section: string = 'two';
  somethings: any = new Array(20);
  
  constructor(public zone: NgZone, public app: App, public chatService: ChatProvider,
    public menuCtrl: MenuController, public RequestService: RequestServiceProvider,
    public events: Events, public navCtrl: NavController, public navParams: NavParams) {

  
  }
  getLastMessage(){
    var tempChats=[]
    this.matchChats.child(firebase.auth().currentUser.uid).on('value',(snapshot)=>{
      var messages=[];
      var temp=snapshot.val();
      for(var tempkey in temp){
       messages.push(temp[tempkey]);
       console.log(messages)
      }
    })
  }
 
  


  ionViewWillEnter() {
    this.RequestService.getTempFriends();
    this.myTempFriends = [];
    this.events.subscribe('tempFriends', () => {
      this.myTempFriends = [];
      this.myTempFriends = this.RequestService.myTempFriends;
      this.temparr = this.RequestService.myTempFriends;
      console.log(this.myTempFriends)
    
        this.tempFriendsuid = [];
        this.tempFriendsuid=this.myTempFriends.map(personObj => personObj.uid);
        console.log(this.tempFriendsuid)

        for (var k in this.tempFriendsuid) {       
          this.personalMessages.child(this.tempFriendsuid[k]).on('value', (snapshot) => {
            this.allMessages = []
            this.messages = snapshot.val();
            this.allMessages.push(this.messages)
            const temp1 = this.objectToArray(this.allMessages[this.allMessages.length - 1])
            if(temp1==null){return}else{
            this.lastMessage = temp1[temp1.length - 1].message;}
            console.log(this.lastMessage)
          })
        }
  

    })


  }
  objectToArray(obj: Object) : Array<any> {
    if( obj==null){
      return null;
    }
    return Array.from(Object.keys(obj), k => obj[k]);
  }
  // arrayToObject = (array) =>
  // array.reduce((obj, item) => {
  //    obj[item.uid] = item
  //    return obj
  //  }, {})

  ionViewDidLeave() {
    this.events.unsubscribe('tempFriends');
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

  ionViewDidEnter() {
    let temp;
    this.matchChats.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      this.messages = [];
      temp = snapshot.val();
      for (var tempkey in temp) {
        this.messages.push(temp[tempkey]);
        console.log(this.messages)
      }
      this.events.publish('messages');
    }
    )
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



  // var searchbox={
  //   topPos_open:0, topPos_close:-50, isOpen:false,
  //   open:function(){
  //       var box=document.getElementById("searchbox");
  //       box.style.top=this.topPos_open+"px";
  //         document.getElementById("searchfield").focus();
  //         this.isOpen=true;
  //   },
  //   close:function(){
  //       var box=document.getElementById("searchbox");
  //       box.style.top=this.topPos_close+"px";
  //       this.isOpen=false;
  //   },
  //   pop:function(){
  //       !this.isOpen?this.open():this.close();
  //   },
   
  // }
}
