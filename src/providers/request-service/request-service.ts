
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
  myTempFriends;
  myAccepters;
  requestSenders;
  requestReceivers;
  userDetails;
  requesterDetails;
  accepterDetails;
  reqDates=[];
  acceptDates=[];

  constructor(public http: Http, public FirebaseService: FirebaseServiceProvider,
    public events: Events) {

  }

  sendRequest(req: connreq) {
    var d = new Date().toISOString();
      // var time = d.toLocaleTimeString().replace(/:\d+ /, ' ');
    var promise = new Promise((resolve, reject) => {
      firebase.database().ref(`/matches/${firebase.auth().currentUser.uid}`).once('value',element=>{
        if(element.val()){
          element.forEach(function(matched){
           if(matched.val().uid == req.recipient){
            resolve({ done: true });
           }else{
            firebase.database().ref(`/requests/${req.recipient}`).once('value',snapshot=>{
              if(snapshot.val()){
                snapshot.forEach(function(sender){
                  if(sender.val().sender == req.sender){
                    console.log("receiver has request from this user")
                    // return null;
                    resolve({ failure: true })
                  }else{
                    console.log("receiver has no requests from this user")
                    firebase.database().ref('/requests').child(req.recipient).push({ sender: req.sender, isSeen: 1 ,date: d,}).then(() => {
                      resolve({ success: true });
                    })
                  }
                })
              }else{ 
                console.log("receiver has no requests")
                firebase.database().ref('/requests').child(req.recipient).push({ sender: req.sender, isSeen: 1 ,date: d,}).then(() => {
                  resolve({ success: true });
                })
              }
            }) 
           }
          })
        }else{
          firebase.database().ref(`/requests/${req.recipient}`).once('value',snapshot=>{
            if(snapshot.val()){
              snapshot.forEach(function(sender){
                if(sender.val().sender == req.sender){
                  console.log("receiver has request from this user")
                  // return null;
                  resolve({ failure: true })
                }else{
                  console.log("receiver has no requests from this user")
                  firebase.database().ref('/requests').child(req.recipient).push({ sender: req.sender, isSeen: 1 ,date: d,}).then(() => {
                    resolve({ success: true });
                  })
                }
              })
            }else{
              console.log("receiver has no requests")
              this.fireReq.child(req.recipient).push({ sender: req.sender, isSeen: 1 ,date: d,}).then(() => {
                resolve({ success: true });
              })
            }
          }) 
        }
        })
        })
        return promise;
  }

  getMyRequests() {
    let allMyRequests;
    var myRequests = [];
    this.requesterDetails = [];
      //get all the user's requests from firebase
      this.fireReq.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
        
        allMyRequests = snapshot.val();
       if(snapshot.val()){
        myRequests = [];
        var reqDetails = [];
        this.reqDates =[];
        for (var i in allMyRequests) {
          //put uid of all request senders in array myRequests
          myRequests.push(allMyRequests[i].sender, allMyRequests[i].isSeen);
          console.log(myRequests)
          //put all isSeen values in array reqDetails
          reqDetails.push({ req_isSeen: allMyRequests[i].isSeen });
          this.reqDates.push({reqDate:allMyRequests[i].date})
        }
        this.events.publish('myRequests', myRequests);
        //get all users from firebase
        this.FirebaseService.getMatches().then((res) => {
          var allMatches = res;
          this.requesterDetails = [];
          //compare uid's from above to all users in database in order to get user details of all request senders and push them int array userDetails
          for (var j in myRequests) {
            for (var key in allMatches) {
              if (myRequests[j] === allMatches[key].uid) {
                this.requesterDetails.push(allMatches[key])
                console.log(this.requesterDetails)
              }
            }
          }
          //publish the isSeen values to be used in notification badge in tab
          this.events.publish('gotRequests', reqDetails);
        })
       }else{
        this.requesterDetails=[]
        this.events.publish('gotRequests', null);
       }
      })
    
  }

  acceptRequest(match) {
    var d = new Date().toISOString();
    var promise = new Promise((resolve, reject) => {
      this.myTempFriends = [];
      this.matches.child(firebase.auth().currentUser.uid).push({
        uid: match.uid, request: "Sender"
      }).then(() => {
        this.matches.child(match.uid).push({
          uid: firebase.auth().currentUser.uid, request: "Receiver"
        }).then(() => {
          this.acceptedTemp.child(match.uid).push({ uid: firebase.auth().currentUser.uid, isSeen: 1 ,date:d})
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
          this.getMyRequests()
        })
      }).then(() => {

      }).catch((err) => {
        reject(err);
      })
    })
    return promise;
  }

  getTempFriends() {
    this.myTempFriends = [];
    let tempFriendsuid = []
    this.matches.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      let allTempFriends = snapshot.val();
      this.myTempFriends = [];
      let tempFriendsuid = []
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

  getRequestSenders() {
    let tempFriendsuid = []
    this.matches.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
  if(snapshot.val()){
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
  }
    })
  }
  getRequestReceivers() {
    let tempFriendsuid = []
    this.matches.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
     if(snapshot.val()){
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
     }
    })
  }

  getAcceptResponse() {
    let allMyAccepts;
    var myAccepts = [];
    this.acceptedTemp.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
      
      allMyAccepts = snapshot.val();
    if(snapshot.val()){
      myAccepts = [];
      var AcceptDetails = [];
      this.acceptDates=[];
      for (var i in allMyAccepts) {
        myAccepts.push(allMyAccepts[i].uid, allMyAccepts[i].isSeen);
        AcceptDetails.push({ accept_isSeen: allMyAccepts[i].isSeen });
        this.acceptDates.push({acceptDate:allMyAccepts[i].date})
      }

      this.FirebaseService.getMatches().then((res) => {
        var allMatches = res;
        this.accepterDetails = [];
        for (var j in myAccepts){
          for (var key in allMatches) {
            if (myAccepts[j] === allMatches[key].uid) {
              this.accepterDetails.push(allMatches[key])
            }
          }
        }
        this.events.publish('gotAccepts', AcceptDetails);
      })
    }else{
      this.accepterDetails=[]
        this.events.publish('gotAccepts', null);
    }
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
