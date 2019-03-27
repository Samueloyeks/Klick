import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Alert, ToastController, LoadingController } from 'ionic-angular';
import { connreq } from '../../models/interfaces/request';
import * as firebase from 'firebase'
import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import { RequestServiceProvider } from '../../providers/request-service/request-service';
import { MenuController } from 'ionic-angular/components/app/menu-controller';


@IonicPage()
@Component({
  selector: 'page-match-list',
  templateUrl: 'match-list.html',
  providers: [FirebaseServiceProvider]
})
export class MatchListPage {
  newRequest = {} as connreq;
  filteredMatches = [];
  temparr = [];
  distance: any
  ageRange: any
  matchGender: any
  loader:any;
  constructor(public toastCtrl:ToastController,public alertCtrl: AlertController, public navCtrl: NavController,
    public navParams: NavParams, public FirebaseService: FirebaseServiceProvider,public menuCtrl:MenuController,
     public RequestService: RequestServiceProvider,public loadingCtrl:LoadingController) {
    this.distance = navParams.get('distance');
    this.ageRange = navParams.get('ageRange');
    this.matchGender = navParams.get('matchGender');
    this.FirebaseService.getAllMatches(this.distance, this.ageRange, this.matchGender).then((res: any) => {
      this.filteredMatches = res;
      this.temparr = res;
    })
  }



  ionViewWillEnter() {
    this.menuCtrl.enable(false,'myMenu');
  }
  ionViewDidLeave() {
    this.menuCtrl.enable(true,'myMenu');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchListPage');
  }

  searchUser(searchbar) {
  
  }

  sendreq(recipient) {
    this.newRequest.sender = firebase.auth().currentUser.uid;
    this.newRequest.recipient = recipient.uid;

    if (this.newRequest.sender === this.newRequest.recipient) {
      alert('You cannot send yourself a request');
    } else {
      let successAlert = this.alertCtrl.create({
        title: 'Request sent!',
        subTitle: 'Your request was sent to ' + recipient.username,
        buttons: ['Ok']
      });

      this.RequestService.sendRequest(this.newRequest).then((res: any) => {
        if (res.success) {
          successAlert.present();
          let sentUser = this.filteredMatches.indexOf(recipient);
          this.filteredMatches.splice(sentUser, 1);
        }
      }).catch((err) => {
        alert(err);
      })
    }
    console.log(recipient);
  }

//   var myMarker = null;

// // get current position
// navigator.geolocation.getCurrentPosition(showPosition);

// // show current position on map
// function showPosition(position) {
//    myMarker = new google.maps.Marker({
//       position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
//       map: new google.maps.Map(document.getElementById("map")),
//       icon: 'img/icons/myicon.png'
//   });
// }

// // watch user's position
// navigator.geolocation.watchPosition(watchSuccess, watchError, watchOptions);

// // change marker location everytime position is updated
// function watchSuccess(position) {
//     var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//     // set marker position
//     marker.setPosition(latLng);
// }


}
