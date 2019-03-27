import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { MatchListPage } from '../match-list/match-list';
import { ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-matchup',
  templateUrl: 'matchup.html',
})
export class MatchupPage {
  loader: any;
  public matchupForm: FormGroup;

  constructor(public navCtrl: NavController, formBuilder: FormBuilder, private toastCtrl: ToastController, public navParams: NavParams, public loadingCtrl: LoadingController) {
    this.matchupForm = formBuilder.group({
      distance: ['',Validators.required],
      ageRange: ['',Validators.required],
      matchGender: ['',Validators.required],
    });
  }
  singleValue: any = 50
  knobValues: any = {
    "upper": 30,
    "lower": 18
  }

  navigateToMatchList() {
    this.presentLoading();
    this.navCtrl.push(MatchListPage, {
      distance: this.matchupForm.value.distance,
      ageRange: this.matchupForm.value.ageRange,
      matchGender: this.matchupForm.value.matchGender
    })
    this.loader.dismiss();
    this.presentToast();
  }


  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Done',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }


  presentLoading() {

    this.loader = this.loadingCtrl.create({
      content: "Searching for matches...",
    });
    this.loader.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatchupPage');
  }

}
