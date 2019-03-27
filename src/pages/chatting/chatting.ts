import { Component, ViewChild, NgZone, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Events, Content } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { AutoresizeDirective } from '../../directives/autoresize/autoresize';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { FriendProfilePage } from '../friend-profile/friend-profile';



@IonicPage()
@Component({
  selector: 'page-chatting',
  templateUrl: 'chatting.html',
  providers: [AutoresizeDirective]
})
export class ChattingPage {
  @ViewChild('content') content: Content;
  @ViewChild('myInput') myInput: ElementRef;
  @ViewChild('myInput') myFooter: ElementRef;
  match: any
  newMessage;
  allMessages = [];
  photoURL;
  imgornot;
  message = ""

  constructor(public zone: NgZone, public events: Events, public chatService: ChatProvider,
    public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController,
    public actionSheetCtrl: ActionSheetController) {
    this.match = this.chatService.match;
    this.scrollTo();
    this.events.subscribe('newMessage', () => {
      this.allMessages = [];
      this.allMessages = this.chatService.matchMessages;
      console.log(this.allMessages[this.allMessages.length - 1])
    })
  }

  onFocus() {
    this.content.resize();
    this.content.scrollToBottom();
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false, 'myMenu');
  }
  ionViewDidLeave() {
    this.menuCtrl.enable(true, 'myMenu');
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({

      buttons: [
        {
          text: 'Camera',
          handler: () => {

          }
        }, {
          text: 'Gallery',
          handler: () => {

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


  addMessage() {
    this.chatService.addNewMessage(this.newMessage).then(() => {
      this.content.scrollToBottom();
      this.newMessage = '';

    })
  }


  preventFocusChange(e) {
    e.preventDefault();
  }

  ionViewDidEnter() {
    this.chatService.getMatchMessages();
  }

  scrollTo() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ChattingPage');
  }

  navigateToFriendProfile() {
    this.navCtrl.push(FriendProfilePage, {
      friendUsername: this.match.username,
      friendUid: this.match.uid
    });
  }
  resize() {
    this.myInput.nativeElement.style.height = 'auto'
    this.myInput.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
    this.myFooter.nativeElement.style.height = 'auto'
    this.myFooter.nativeElement.style.height = this.myInput.nativeElement.scrollHeight + 'px';
  }

}
