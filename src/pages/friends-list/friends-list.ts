import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

/**
 * Generated class for the FriendsListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friends-list',
  templateUrl: 'friends-list.html',
})
export class FriendsListPage {

  constructor(public menuCtrl:MenuController,public navCtrl: NavController, public navParams: NavParams) {
  }


  ionViewWillEnter() {
    this.menuCtrl.enable(false,'myMenu');
   
  }

  ionViewDidLeave(){
    this.menuCtrl.enable(true,'myMenu');
  
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsListPage');
  }

}
