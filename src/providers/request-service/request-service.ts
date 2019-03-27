
import { Injectable } from '@angular/core';
import { Http } from '../../../node_modules/@angular/http';
import { connreq } from '../../models/interfaces/request';
import * as firebase from 'firebase';
import { FirebaseServiceProvider } from '../../providers/firebase-service/firebase-service';
import { Events } from 'ionic-angular'


@Injectable()
export class RequestServiceProvider {
  public fireReq = firebase.database().ref('/requests');
  public matches = firebase.database().ref('/matches');
  public acceptedTemp = firebase.database().ref('/acceptedTemp');
  userDetails;
  myTempFriends;
  myAccepters; 
  requestSenders;
  requestReceivers;

  constructor(public http: Http, public FirebaseService: FirebaseServiceProvider,
    public events: Events) {

  }


  sendRequest(req: connreq) {
    var promise = new Promise((resolve, reject) => {
      this.fireReq.child(req.recipient).push({ sender: req.sender, isSeen: 1 }).then(() => {
        resolve({ success: true });
      })
    })
    return promise;

  }

  getMyRequests() {
    let allMyRequests;
    var myRequests = [];
    var reqDetails = [];
    this.fireReq.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      allMyRequests = snapshot.val();
      myRequests = [];
      for (var i in allMyRequests) {
        myRequests.push(allMyRequests[i].sender, allMyRequests[i].isSeen);
        reqDetails.push({ req_isSeen: allMyRequests[i].isSeen });
      }

      this.FirebaseService.getMatches().then((res) => {
        var allMatches = res;
        this.userDetails = [];
        for (var j in myRequests)
          for (var key in allMatches) {
            if (myRequests[j] === allMatches[key].uid) {
              this.userDetails.push(allMatches[key])
   
            }
          }
        this.events.publish('gotRequests', reqDetails);
      })
    })
  }
  getBadgeValue() {
    let allMyRequests;
    let badgeValue;
    var myRequests = [];
    this.fireReq.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      allMyRequests = snapshot.val();
      myRequests = [];
      for (var i in allMyRequests) {
        myRequests.push(allMyRequests[i].sender);
      }

      this.FirebaseService.getMatches().then((res) => {
        var allMatches = res;
        this.userDetails = [];
        for (var j in myRequests)
          for (var key in allMatches) {
            if (myRequests[j] === allMatches[key].uid) {
              this.userDetails.push(allMatches[key])
            }
          }
        return badgeValue = myRequests.length;

      })
    })
  }
  acceptRequest(match) {
    var promise = new Promise((resolve, reject) => {
      this.myTempFriends = [];
      this.matches.child(firebase.auth().currentUser.uid).push({
        uid: match.uid, request: "Sender"
      }).then(() => {
        this.matches.child(match.uid).push({
          uid: firebase.auth().currentUser.uid, request: "Receiver"
        }).then(() => {
          this.acceptedTemp.child(match.uid).push({ uid: firebase.auth().currentUser.uid, isSeen: 1 })
            .then(() => {
              this.deleteRequest(match)
            })
        })

      })
    })
    return promise;
  }



  deleteRequest(match) {
    var promise = new Promise((reject, resolve) => {
      this.fireReq.child(firebase.auth().currentUser.uid).orderByChild('sender').equalTo(match.uid).once('value', (snapshot) => {
        let someKey;
        for (var key in snapshot.val())
          someKey = key;
        this.fireReq.child(firebase.auth().currentUser.uid).child(someKey).remove().then(() => {
          // resolve(true);
        })
      }).then(() => {

      }).catch((err) => {
        reject(err);
      })
    })
    return promise;

  }

  getTempFriends() {
    let tempFriendsuid = []
    this.matches.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      let allTempFriends = snapshot.val();
      this.myTempFriends = [];
      for (var i in allTempFriends)
        tempFriendsuid.push(allTempFriends[i].uid);

      // if (allTempFriends[i].request == "Sender") {
        this.FirebaseService.getMatches().then((matches) => {
          this.myTempFriends = [];
          for (var j in tempFriendsuid)
            for (var key in matches) {
              if (tempFriendsuid[j] === matches[key].uid) {
                this.myTempFriends.push(matches[key]);
              }
            }
          this.events.publish('tempFriends')
        }).catch((err) => {
          alert(err);
        })
      // }
    })
  }
  getRequestSenders(){
    let tempFriendsuid = []
    this.matches.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      let allTempFriends = snapshot.val();
      this.requestSenders = [];
      for (var i in allTempFriends)
        tempFriendsuid.push(allTempFriends[i].uid);

      if (allTempFriends[i].request == "Sender") {
        this.FirebaseService.getMatches().then((matches) => {
          this.requestSenders = [];
          for (var j in tempFriendsuid)
            for (var key in matches) {
              if (tempFriendsuid[j] === matches[key].uid) {
                this.requestSenders.push(matches[key]);
              }
            }
          this.events.publish('requestSenders')
        }).catch((err) => {
          alert(err);
        })
      }
    })
  }
  getRequestReceivers(){
    let tempFriendsuid = []
    this.matches.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      let allTempFriends = snapshot.val();
      this.requestReceivers = [];
      for (var i in allTempFriends)
        tempFriendsuid.push(allTempFriends[i].uid);

      if (allTempFriends[i].request == "Receiver") {
        this.FirebaseService.getMatches().then((matches) => {
          this.requestReceivers = [];
          for (var j in tempFriendsuid)
            for (var key in matches) {
              if (tempFriendsuid[j] === matches[key].uid) {
                this.requestReceivers.push(matches[key]);
              }
            } 
          this.events.publish('requestReceivers')
        }).catch((err) => {
          alert(err);
        })
      }
    })
  }

  getAcceptResponse() {
    let allMyAccepts;
    var myAccepts = [];
    var AcceptDetails = [];
    this.acceptedTemp.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      allMyAccepts = snapshot.val();
      myAccepts = [];
      for (var i in allMyAccepts) {
        myAccepts.push(allMyAccepts[i].uid, allMyAccepts[i].isSeen);
        AcceptDetails.push({ accept_isSeen: allMyAccepts[i].isSeen });
      }

      this.FirebaseService.getMatches().then((res) => {
        var allMatches = res;
        this.userDetails = [];
        for (var j in myAccepts)
          for (var key in allMatches) {
            if (myAccepts[j] === allMatches[key].uid) {
              this.userDetails.push(allMatches[key])
            }
          }
        this.events.publish('gotAccepts', AcceptDetails);
      })
    })

  }
  removeAccept(item) {
    var promise = new Promise((reject, resolve) => {
      this.acceptedTemp.child(firebase.auth().currentUser.uid).orderByChild('uid').equalTo(item.uid).once('value', (snapshot) => {
        let someKey;
        for (var key in snapshot.val())
          someKey = key;
        this.acceptedTemp.child(firebase.auth().currentUser.uid).child(someKey).remove().then(() => {

        })
      }).then(() => {

      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }


}
