import { Injectable } from '@angular/core';
import * as firebase from 'firebase'
import { resolve } from 'url';
import { Events } from 'ionic-angular';

@Injectable()
export class ChatProvider {
  matchChats = firebase.database().ref('/matchChats')
  matches = firebase.database().ref('/matches')
  match: any
  matchMessages = [];
  messages = [];
  msgArr = []
  chatsArr = []
  lastMsgArr = []
  allMatchMessages = []
  userId = firebase.auth().currentUser.uid;
  constructor(public events: Events) {

  }

  initializeMatch(match) {
    this.match = match;
  }

  addNewMessage(msg) {
    if (this.match) {
      var d = new Date();
      var time = d.toLocaleTimeString().replace(/:\d+ /, ' ');
      var promise = new Promise((resolve, reject) => {
        this.matchChats.child(firebase.auth().currentUser.uid).child(this.match.uid).push({
          sentBy: firebase.auth().currentUser.uid,
          message: msg,
          timeStamp: firebase.database.ServerValue.TIMESTAMP,
          time: time,
          [this.userId]: 0,
          [this.match.uid]: 1,
        }).then(() => {
          this.matchChats.child(this.match.uid).child(firebase.auth().currentUser.uid).push({
            sentBy: firebase.auth().currentUser.uid,
            message: msg,
            timeStamp: firebase.database.ServerValue.TIMESTAMP,
            time: time,
            [this.userId]: 0,
            [this.match.uid]: 1,
          }).then(() => {
            resolve(true);
          })
          // .catch((err)=>{ 
          //   reject(err)
          // })
        })
      })
      return promise;
    }
  }


  getMatchMessages() {
    let temp;
    this.matchChats.child(firebase.auth().currentUser.uid).child(this.match.uid).on('value', (snapshot) => {
      this.matchMessages = [];
      temp = snapshot.val();
      console.log(temp)
      for (var tempkey in temp) {
        this.matchMessages.push(temp[tempkey]);
      }
      this.events.publish('newMessage');
    })
  }

  getAllMatchMessages() {
    let matchArr = []
    let chatArr = []
    this.allMatchMessages = []

    this.matches.child(firebase.auth().currentUser.uid).once('value', (snapshot) => {
      snapshot.forEach(function (snap) {
        let key = snap.key
        firebase.database().ref(`/matches/${firebase.auth().currentUser.uid}/${key}`).once('value', (snap) => {
          matchArr.push(snap.val().uid)
        })
      })
      console.log(matchArr)
    }).then(()=>{
      this.matchChats.child(firebase.auth().currentUser.uid).on('value', (snapshot) => {
        let chatArr = []
        this.allMatchMessages = []
        snapshot.forEach(function (snap) {
          let key = snap.key
          chatArr.push(key)
        })
        console.log(matchArr)
        console.log(chatArr); 
  
        if (snapshot.val()) {
          for (var match of matchArr) {
            if (chatArr.indexOf(match) > -1) {
              this.matchChats.child(firebase.auth().currentUser.uid).child(match).orderByChild('uid').once('value', (snapshot) => {
                this.allMatchMessages.push(snapshot.val());
              })
            } else {
              this.allMatchMessages.push({})
            }
          }
          console.log(this.allMatchMessages)
          this.events.publish('allMatchMessages');
        }
   
      })
    })




  }

  getMessages() {
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
    return this.messages;
  }


  markAsSeen() {
    let match = this.match.uid
    this.matchChats.child(match).child(firebase.auth().currentUser.uid).orderByChild('uid').once('value', function (snapshot) {
      snapshot.forEach(function (chatSnapshot) {
        let key = chatSnapshot.key;
        let data = firebase.database().ref(`/matchChats/${match}/${firebase.auth().currentUser.uid}/${key}`)
        data.update({ [firebase.auth().currentUser.uid]: 0 })
      });
    })
      .then(() => {
        this.matchChats.child(firebase.auth().currentUser.uid).child(match).orderByChild('uid').once('value', function (snapshot) {
          snapshot.forEach(function (chatSnapshot) {
            let key = chatSnapshot.key;
            let data = firebase.database().ref(`/matchChats/${firebase.auth().currentUser.uid}/${match}/${key}`)
            data.update({ [firebase.auth().currentUser.uid]: 0 })
          });
        })
      })
  }


}
