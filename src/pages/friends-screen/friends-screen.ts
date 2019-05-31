import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseService } from '../../services/database.service';
import { AlertController } from 'ionic-angular';
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
  constructor(public navCtrl: NavController, public navParams: NavParams, databaseService: DatabaseService, private alertCtrl: AlertController) {
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

  private getMenu(user)
  {
    let alert = this.alertCtrl.create({
			title: user.name+" "+user.surname,
			buttons: [
				{
					text: 'Pokaż na mapie',
					handler: data => {
            console.log("Poka");
            console.log(user);
          }
        },
        {
					text: 'Usuń ze znajomych',
					handler: data => {
            console.log("usun");
            console.log(user);
					}
        },
        {
					text: 'Anuluj',
					role: 'cancel',
					handler: data => {
					}
				}
			]
		});
		alert.present();


  }

}
