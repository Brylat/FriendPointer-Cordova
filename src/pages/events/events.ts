import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

/**
 * Generated class for the EventsPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html'
})
export class EventsPage {

  yourRoot = 'YourPage'
  nearbyRoot = 'NearbyPage'


  constructor(public navCtrl: NavController) {}

}
