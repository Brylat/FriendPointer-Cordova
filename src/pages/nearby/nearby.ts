import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {DatabaseService} from "../../services/database.service";

/**
 * Generated class for the NearbyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nearby',
  templateUrl: 'nearby.html',
})
export class NearbyPage {

  private databaseService: DatabaseService;
  private eventList: Array<Object>;
  constructor(public navCtrl: NavController, public navParams: NavParams, databaseService: DatabaseService) {
    this.databaseService = databaseService;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NearbyPage');
    this.databaseService.getAllEvents().then((res) => {this.eventList = (res)});
  }
}
