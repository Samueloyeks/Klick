import { Component } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { RequestServiceProvider } from '../../providers/request-service/request-service';
import * as firebase from 'firebase';


/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
}) 
export class NotificationsPage {
  public personalReq = firebase.database().ref(`/requests/${firebase.auth().currentUser.uid}`);
  public personalAccepts = firebase.database().ref(`/acceptedTemp/${firebase.auth().currentUser.uid}`);
  notifications = "All";
  myRequests;
  myAccepts;

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      // title: 'Are you sure you want to Log out?',
      buttons: [
        { text: 'Hide notification' },

        {
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

  constructor(public alertCtrl: AlertController, public RequestService: RequestServiceProvider, public events: Events, public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public navParams: NavParams) {
  
  }

  ionViewWillEnter() {
    this.RequestService.getMyRequests();
    console.log(this.RequestService.getMyRequests());
    this.RequestService.getAcceptResponse();
    this.events.subscribe('gotRequests', (bv) => {
      this.myRequests = [];
      console.log(bv);
      
      // this.myRequests = bv
      // console.log(this.myRequests);
      this.myRequests = this.RequestService.userDetails;
      // console.log(this.myRequests)
    })
    this.events.subscribe('gotAccepts', () => {
      this.myAccepts = [];
      this.myAccepts = this.RequestService.userDetails;
    })
  }

  ionViewDidLeave() {
    this.events.unsubscribe('gotRequests');
    this.events.unsubscribe('gotAccepts');
this.clearBadge();
  }

  getMyRequests() {
    this.RequestService.getMyRequests()
  }
  getAcceptResponse() {
    this.RequestService.getAcceptResponse()
  }

  accept(item) {
    let alert = this.alertCtrl.create({
      title: 'Request accepted',
      subTitle: 'You can receive messages from ' + item.username,
      buttons: ['Ok']
    });
    this.RequestService.acceptRequest(item).then(() => {

    })
    alert.present();
  }

  ignore(item) {
    let alert = this.alertCtrl.create({
      title: 'Request declined',
      buttons: ['Ok']
    });
    this.RequestService.deleteRequest(item).then(() => {

    })
    alert.present();
  }
  remove(item) {
    this.RequestService.removeAccept(item);
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

}
