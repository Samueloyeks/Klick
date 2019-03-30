import { Component } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { RequestServiceProvider } from '../../providers/request-service/request-service';
import * as firebase from 'firebase';
import { TabsPage } from '../tabs/tabs';


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
  requestDates;
  acceptDates;

  // doRefresh(refresher) {
  //   this.RequestService.getMyRequests();
  //     this.RequestService.getAcceptResponse();
  //   console.log('Begin async operation', refresher);

  //   setTimeout(() => {
  //     console.log('Async operation has ended');
  //     refresher.complete();
  //   }, 2000);
  // }

  constructor(public alertCtrl: AlertController, public RequestService: RequestServiceProvider, public events: Events,
    public navCtrl: NavController, public actionSheetCtrl: ActionSheetController, public navParams: NavParams) {
    this.RequestService.getMyRequests();
    this.RequestService.getAcceptResponse();
  }

  doRefresh(refresher) {
    this.RequestService.getMyRequests();
    this.RequestService.getAcceptResponse();

    this.myRequests = this.RequestService.requesterDetails;
    this.myAccepts = this.RequestService.accepterDetails;

    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

  ionViewWillEnter() {
    this.RequestService.getMyRequests();
    this.RequestService.getAcceptResponse();
    this.events.subscribe('gotRequests', (bv) => {
      this.myRequests = [];
      this.requestDates=[];
      this.myRequests = this.RequestService.requesterDetails;
      this.requestDates = this.RequestService.reqDates;
      console.log(this.myRequests)
      console.log(this.requestDates)
    })
    this.events.subscribe('gotAccepts', () => {
      this.myAccepts = [];
      this.acceptDates=[];
      this.myAccepts = this.RequestService.accepterDetails;
      this.acceptDates = this.RequestService.acceptDates;
      console.log(this.acceptDates)

    })
  }

  ionViewDidLeave() {
    this.clearBadge();
    this.RequestService.getMyRequests();
    this.RequestService.getAcceptResponse();
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
    this.RequestService.getMyRequests();
    this.RequestService.getAcceptResponse();
  }

  presentAlert(item) {
    let alert = this.alertCtrl.create({
      title: item.username + ' sent you a request',
      message: 'Accept request to receive messages from ' + item.username,
      buttons: [
        {
          text: 'Accept',
          handler: () => {
            this.accept(item)
          }
        },
        {
          text: 'Decline',
          handler: () => {
            this.ignore(item)
          }
        }
      ]
    });
    alert.present();
  }


}
