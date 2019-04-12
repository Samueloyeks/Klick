
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
  userId: String

  constructor(private http: Http) {
    this.fireAuth = firebase.auth();
    this.userProfile = firebase.database().ref('userProfile');

    firebase.auth().onAuthStateChanged( (user)=> {
      if (!user) {
        return
      } else {
        this.userId = user.uid
        console.log(this.userId)
        this.updateOnConnect()
        this.updateOnDisconnect()
      }
    })
  }

  updateStatus(status: String) {
    if (!this.userId) {
      return
    } else {
      this.userProfile.child(this.userId).update({ onlineStatus: status })
    }
  }

  updateOnConnect() {
    firebase.database().ref(`.info/connected`).on('value', connected => {
      let status = connected.val() ? 'online' : 'offline'
      this.updateStatus(status)
    })
  }

  updateOnDisconnect() {
    this.userProfile.child(this.userId).onDisconnect().update({ onlineStatus: 'offline' })
  }

  loginUserService(email: string, password: string): Promise<void> {
    return this.fireAuth.signInWithEmailAndPassword(email, password);

  }

  logoutUserService(): Promise<void> {
    const userId: string = firebase.auth().currentUser.uid;
    this.updateStatus('offline')
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
          firebase.database().ref(`/requests/${firebase.auth().currentUser.uid}`).once('value', (element) => {
            // temparr = [];
            if (element.val()) {
              console.log("There are requests")
              element.forEach(function (sender) {
                firebase.database().ref(`/matches/${firebase.auth().currentUser.uid}`).once('value', snapshot => {
                  // temparr = [];
                  if (snapshot.val()) {
                    console.log("There are requests and matches...pushing this shit")
                    snapshot.forEach(function (match) {
                      if (snap.val().gender === matchGender && snap.val().age >= ageRange.lower && snap.val().age <= ageRange.upper && snap.key !== firebase.auth().currentUser.uid && snap.key !== match.val().uid && snap.key !== sender.val().sender) {
                        temparr.push({
                          uid: snap.key,
                          dob: snap.val().dob,
                          email: snap.val().email,
                          fullName: snap.val().fullName,
                          gender: snap.val().gender,
                          username: snap.val().username,
                          age: snap.val().age
                        })
                      }
                      if (matchGender == "Both") {
                        if ((snap.val().gender == "Male" || snap.val().gender == "Female") && snap.val().age >= ageRange.lower && snap.val().age <= ageRange.upper && snap.key !== firebase.auth().currentUser.uid && snap.key !== match.val().uid && snap.key !== sender.val().sender) {
                          temparr.push({
                            uid: snap.key,
                            dob: snap.val().dob,
                            email: snap.val().email,
                            fullName: snap.val().fullName,
                            gender: snap.val().gender,
                            username: snap.val().username,
                            age: snap.val().age
                          })

                        }
                      }
                    })
                  } else {
                    console.log("There are requests but no matches...moving on")
                    if (snap.val().gender === matchGender && snap.val().age >= ageRange.lower && snap.val().age <= ageRange.upper && snap.key !== firebase.auth().currentUser.uid && snap.key !== sender.val().sender) {
                      temparr.push({
                        uid: snap.key,
                        dob: snap.val().dob,
                        email: snap.val().email,
                        fullName: snap.val().fullName,
                        gender: snap.val().gender,
                        username: snap.val().username,
                        age: snap.val().age
                      })
                    }
                    if (matchGender == "Both") {
                      if ((snap.val().gender == "Male" || snap.val().gender == "Female") && snap.val().age >= ageRange.lower && snap.val().age <= ageRange.upper && snap.key !== firebase.auth().currentUser.uid && snap.key !== sender.val().sender) {
                        temparr.push({
                          uid: snap.key,
                          dob: snap.val().dob,
                          email: snap.val().email,
                          fullName: snap.val().fullName,
                          gender: snap.val().gender,
                          username: snap.val().username,
                          age: snap.val().age
                        })

                      }
                    }
                  }
                })
              })
            } else {
              console.log("No requests ...moving on")
              firebase.database().ref(`/matches/${firebase.auth().currentUser.uid}`).once('value', snapshot => {
                if (snapshot.val()) {
                  console.log("No requests but there are matches")
                  snapshot.forEach(function (match) {
                    if (snap.val().gender === matchGender && snap.val().age >= ageRange.lower && snap.val().age <= ageRange.upper && snap.key !== firebase.auth().currentUser.uid && snap.key !== match.val().uid) {
                      temparr.push({
                        uid: snap.key,
                        dob: snap.val().dob,
                        email: snap.val().email,
                        fullName: snap.val().fullName,
                        gender: snap.val().gender,
                        username: snap.val().username,
                        age: snap.val().age
                      })
                    }
                    if (matchGender == "Both") {
                      if ((snap.val().gender == "Male" || snap.val().gender == "Female") && snap.val().age >= ageRange.lower && snap.val().age <= ageRange.upper && snap.key !== firebase.auth().currentUser.uid && snap.key !== match.val().uid) {
                        temparr.push({
                          uid: snap.key,
                          dob: snap.val().dob,
                          email: snap.val().email,
                          fullName: snap.val().fullName,
                          gender: snap.val().gender,
                          username: snap.val().username,
                          age: snap.val().age
                        })
                      }
                    }
                  })
                } else {
                  console.log("No requests and no matches...pushing this shit now")
                  if (snap.val().gender === matchGender && snap.val().age >= ageRange.lower && snap.val().age <= ageRange.upper && snap.key !== firebase.auth().currentUser.uid) {
                    temparr.push({
                      uid: snap.key,
                      dob: snap.val().dob,
                      email: snap.val().email,
                      fullName: snap.val().fullName,
                      gender: snap.val().gender,
                      username: snap.val().username,
                      age: snap.val().age
                    })
                  }
                  if (matchGender == "Both") {
                    if ((snap.val().gender == "Male" || snap.val().gender == "Female") && snap.val().age >= ageRange.lower && snap.val().age <= ageRange.upper && snap.key !== firebase.auth().currentUser.uid) {
                      temparr.push({
                        uid: snap.key,
                        dob: snap.val().dob,
                        email: snap.val().email,
                        fullName: snap.val().fullName,
                        gender: snap.val().gender,
                        username: snap.val().username,
                        age: snap.val().age
                      })
                    }
                  }
                }
              })
            }
          })
        });
        console.log(temparr)
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
            username: snap.val().username,
            age: snap.val().age,
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
