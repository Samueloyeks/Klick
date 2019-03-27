
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import 'rxjs/add/operator/map';
import { Http } from '../../../node_modules/@angular/http';

@Injectable()
export class FirebaseServiceProvider {
  public data: any;
  public fireAuth: any;
  public userProfile: any; 
  public matches: any = [];

  constructor(private http: Http) {
    this.fireAuth = firebase.auth();
    this.userProfile = firebase.database().ref('users');
  }

  loginUserService(email: string, password: string): Promise<void> {
    return this.fireAuth.signInWithEmailAndPassword(email, password);

  }

  logoutUserService(): Promise<void> {
    const userId: string = firebase.auth().currentUser.uid;
    firebase.database().ref(`/userProfile/${userId}`).off();
    return firebase.auth().signOut();
  }

 
  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  signupUserService(account: {} = null): Promise<any> {
    if (account != null) {

      return firebase.auth().createUserWithEmailAndPassword(account['email'], account['password']).then(newUserCredentials => {
        firebase.database().ref(`/userProfile/` + newUserCredentials.user.uid).set(account).then(() => {
          firebase.auth().currentUser.sendEmailVerification();
          //Email sent
        });
      })
        .catch(error => {
          console.error(error);
          throw new Error(error);
        });
    }
  }
 

  getAllMatches(distance, ageRange, matchGender) {
    console.log(matchGender)
    var promise = new Promise((resolve, reject) => {
      firebase.database().ref('/userProfile').orderByChild('uid').once('value', (snapshot) => {
        let temparr = [];
        snapshot.forEach(snap => {
          if (snap.val().gender === matchGender && snap.val().age>=ageRange.lower&&snap.val().age<=ageRange.upper) {
            temparr.push({
              uid: snap.key,
              dob: snap.val().dob,
              email: snap.val().email,
              fullName: snap.val().fullName,
              gender: snap.val().gender,
              username: snap.val().username,
              age:snap.val().age
            })
          }
          if(matchGender=="Both"){
            if ((snap.val().gender =="Male"||snap.val().gender =="Female") && snap.val().age>=ageRange.lower&&snap.val().age<=ageRange.upper) {
              temparr.push({
                uid: snap.key,
                dob: snap.val().dob,
                email: snap.val().email,
                fullName: snap.val().fullName,
                gender: snap.val().gender,
                username: snap.val().username,
                age:snap.val().age
              })
            }
          }
        });
        resolve(temparr);
      }).catch(err => {
        reject(err);
      })
    })
    return promise;
  }
  getMatches() {
    var promise = new Promise((resolve, reject) => {
      firebase.database().ref('/userProfile').orderByChild('uid').once('value', (snapshot) => {
        let temparr = [];
        snapshot.forEach(snap => {
          temparr.push({
            uid: snap.key,
            dob: snap.val().dob,
            email: snap.val().email,
            fullName: snap.val().fullName,
            gender: snap.val().gender,
            username: snap.val().username
          })
        });
        resolve(temparr);
      }).catch(err => {
        reject(err);
      })
    })
    return promise;
  }





}
