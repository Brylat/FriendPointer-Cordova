import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseService } from '../../services/database.service';
import User from '../wrapers/user';

/**
 * Generated class for the FriendsScreenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friends-screen',
  templateUrl: 'friends-screen.html',
})
export class FriendsScreenPage {

  private databaseService: DatabaseService;
  constructor(public navCtrl: NavController, public navParams: NavParams, databaseService: DatabaseService) {
    this.databaseService = databaseService;
		this.getFriendsLiset();
  }

  private friendsList: User[];

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsScreenPage');
  }

  private async getFriendsLiset()
  {
    this.friendsList = await this.databaseService.getAllFriendsData();
  }

}
