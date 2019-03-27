import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import {User,UserMetadata,AuthCredential} from '@firebase/auth-types'
import { Http } from '../../../node_modules/@angular/http';
import { Plugins } from '@capacitor/core';
const { Camera } = Plugins;


@Injectable()
export class ProfileServiceProvider {
  public userProfile: firebase.database.Reference;
  public currentUser: firebase.User;
  public userInfo:firebase.database.Reference;
  public currentUserMetadata:UserMetadata;
  storageRef:firebase.storage.Reference;
  public username:any;
  public friendProfile:firebase.database.Reference;
  public friendInfo:firebase.database.Reference;
  // public profilePicture: string = null;

  constructor(public http: Http) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
        this.userInfo=firebase.database().ref(`/userProfile/${user.uid}/info`);
        this.storageRef = firebase.storage().ref(`/userProfile/${user.uid}/profilePicture.png`);
        this.currentUserMetadata=user.metadata
      }
    });
    
  } 

 getMetadata():UserMetadata{
  return this.currentUserMetadata;
 }
 
 getUsername(){
  this.userProfile.on('value',userProfileSnapshot=>{
    this.username=userProfileSnapshot.val().username;
  })
  return this.username;
 }
  getUserProfile(): firebase.database.Reference {
    return this.userProfile;
  }
  getUserInfo():firebase.database.Reference{
    return this.userInfo;
  }

  updateName(fullName: Date): Promise<any> {
    return this.userProfile.update({ fullName });
  }

  updateUsername(username:string){
    return this.userProfile.update({username});
  }

  updateGender(gender:string){
    return this.userProfile.update({gender});
  }

  updateDOB(dob: Date): Promise<any> {
    return this.userProfile.update({ dob });
  }

  updateStatus(status:any){
    this.userProfile.update({status});
  }
  getFriendProfile(friendUid:any){
    this.friendProfile = this.userProfile = firebase.database().ref(`/userProfile/${friendUid}`);
    return this.friendProfile;
  }
  getFriendInfo(friendUid:any){
    this.friendInfo = this.userInfo=firebase.database().ref(`/userProfile/${friendUid}/info`);
    return this.friendInfo; 
  }
 
  addInfo(info:{}):firebase.database.ThenableReference{   
    return this.userInfo.push(info);
  }

  addPic(profilePicture:string=null): PromiseLike<any>{
    if (profilePicture != null) {
      return this.storageRef.putString(profilePicture, 'base64', { contentType: 'image/png' }).then(() => {
          return this.storageRef.getDownloadURL().then(downloadURL => {
            return this.userInfo.child(`/profilePicture`).set(downloadURL);
          });
        });
    }
  }

  updateEmail(newEmail: string, password: string): Promise<any> {
    const credential: firebase.auth.AuthCredential =
      firebase.auth.EmailAuthProvider.credential(
        this.currentUser.email,
        password
      );
    return this.currentUser
      .reauthenticateAndRetrieveDataWithCredential(credential)
      .then(() => {
        this.currentUser.updateEmail(newEmail).then(() => {
          this.userProfile.update({ email: newEmail });
        });
      })
      .catch(error => {
        console.error(error);
      });
  }


  updatePassword(newPassword: string, oldPassword: string): Promise<any> {
    const credential: firebase.auth.AuthCredential =
    firebase.auth.EmailAuthProvider.credential(
    this.currentUser.email,
    oldPassword
    );
    return this.currentUser
    .reauthenticateAndRetrieveDataWithCredential(credential)
    .then(() => {
    this.currentUser.updatePassword(newPassword).then(() => {
    console.log('Password Changed');
    })
    })
    .catch(error => {
    console.error(error);
    });
    }
    
}
