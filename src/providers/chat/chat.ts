import { Injectable } from '@angular/core';
import * as firebase from 'firebase'
import { resolve } from 'url';
import { Events } from 'ionic-angular';

@Injectable()
export class ChatProvider {
  matchChats = firebase.database().ref('/matchChats')
  match: any 
  matchMessages = [];
  messages = [];
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
          time: time
        }).then(() => {
          this.matchChats.child(this.match.uid).child(firebase.auth().currentUser.uid).push({
            sentBy: firebase.auth().currentUser.uid,
            message: msg,
            timeStamp: firebase.database.ServerValue.TIMESTAMP,
            time: time
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
      for (var tempkey in temp) {
        this.matchMessages.push(temp[tempkey]);
      }
      this.events.publish('newMessage');
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
 

}
