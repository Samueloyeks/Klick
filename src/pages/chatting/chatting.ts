import { Component, ViewChild, NgZone, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Events, Content,LoadingController, AlertController } from 'ionic-angular';
import { ChatProvider } from '../../providers/chat/chat';
import { AutoresizeDirective } from '../../directives/autoresize/autoresize';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { FriendProfilePage } from '../friend-profile/friend-profile';
import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import * as firebase from 'firebase'
import {ImghandlerProvider} from "../../providers/imghandler/imghandler"
import { Camera } from "@ionic-native/camera";



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
  matchUid;
  newMessage;
  allMessages = [];
  photoURL;
  imgornot;
  message = "";
  userId = firebase.auth().currentUser.uid
  public base64Image: string = null;

  constructor(public zone: NgZone, public events: Events, public chatService: ChatProvider,
    public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController,public camera:Camera,public alertCtrl:AlertController,
    public actionSheetCtrl: ActionSheetController,public loadingCtrl:LoadingController,public imgStore:ImghandlerProvider) {
    this.match = this.chatService.match;
    this.matchUid = this.match.uid
    console.log(this.matchUid)
    this.scrollTo();
    this.events.subscribe('newMessage', () => {
      this.chatService.markAsSeen();
      this.allMessages = [];
      this.allMessages = this.chatService.matchMessages;
      // console.log(this.allMessages[0][`${this.matchUid}`]) 
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
    this.events.unsubscribe('newMessage')
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({

      buttons: [
        {
          text: "Select from Library",
          handler: () => {
            return this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },   {
          text: "Use Camera",
          handler: () => {
            return this.takePicture(this.camera.PictureSourceType.CAMERA);
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

  public takePicture(sourceType) {
    var options = {
      quality: 200,
      targetHeight: 200,
      targetWidth: 200,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: sourceType,
      correctOrientation: true,
      allowEdit: true,
      saveToPhotoAlbum: false
    }

    this.camera.getPicture(options).then((imageData) => {
      var loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present().then(() => {
        this.base64Image = 'data:image/jpeg;base64,' + imageData;
        console.log(JSON.stringify({ "image": this.base64Image }))

        var self = this;
        // this.apiService.fetch('services/upload', { "image": this.base64Image })
        //   .then(function (response) {
        //     response.json().then(function (data) {
        //       console.log(data);
        //       let photo = { "photoUrl":data.data["url"]}
        //       console.log(photo)

        //       if (data.status == "success") {
        //         // db.set("photo", photo);
        //         // db.set("userInfo.profilePhotoUrl",data.data["url"])
        //         loading.dismiss();
        //         console.log(data.data["url"])
        //         return data.data["url"];
                
        //         // return photo;

        //       } else {
        //         self.apiService.showApiResponseAlert(data.message);
        //         loading.dismiss();
        //       }
        //     });
        //   }).catch((error) => {
        //     this.showAlert('An error occured while performing request.Please try again');
        //     // alert(error);
        //     loading.dismiss();
        //   });
        loading.dismiss();
      })
    }, (err) => {
      console.log('error', err);
      const alert = this.alertCtrl.create({
        message: err,
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          {
            text: 'Ok',
            role: 'cancel'
          }
        ]
      });
      alert.present();
    });
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
    this.chatService.markAsSeen();
    this.chatService.getMatchMessages();
  }

  scrollTo() {
    setTimeout(() => {
      this.content.scrollToBottom();
    }, 1000);
  }

  // ionViewDidLoad() {
  //   this.chatService.markAsSeen();
  // }


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
