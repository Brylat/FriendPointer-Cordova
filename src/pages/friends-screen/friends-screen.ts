import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseService } from '../../services/database.service';
import { AlertController } from 'ionic-angular';
import User from '../wrapers/user';
import { SingleGoogleMapsPage } from '../single-google-maps/single-google-maps.page';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'page-friends-screen',
  templateUrl: 'friends-screen.html',
})
export class FriendsScreenPage {

  private databaseService: DatabaseService;
  constructor(public navCtrl: NavController, public navParams: NavParams, databaseService: DatabaseService, private alertCtrl: AlertController, private authService: AuthService) {
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

  private getMenu(user: User)
  {
    let alert = this.alertCtrl.create({
			title: user.name+" "+user.surname,
			buttons: [
				{
					text: 'Pokaż na mapie',
					handler: data => {
						if (user.status > 0) {
							if (user.status == 1 && user.friends.indexOf(this.authService.getUID()) < -1){
								this.alertCtrl.create({
									title: 'Nie można pokazać lokalizacji',
									message: 'Użytkownik w tym momencie udostępnia lokalizację tylko dla swoich znajomych',
									buttons: ['Ok']
								}).present()
							} else {
								this.navCtrl.push(SingleGoogleMapsPage,{
									user:user
									});
							}		
						} else {
							this.alertCtrl.create({
								title: 'Nie można pokazać lokalizacji',
								message: 'Użytkownik w tym momencie jest niewidoczny na mapie',
								buttons: ['Ok']
							}).present()
						}        
          }
        },
        {
					text: 'Usuń ze znajomych',
					handler: data => {
            this.databaseService.deleteFriend(user.uid);
            this.friendsList = this.friendsList.filter(x => x.uid !== user.uid)

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
	
  private getStatusText(status)
	{
    switch(status) 
    { 
			case 2: { 
			   return " Dostępny. :)"; 
			   
			} 
			case 1: { 
				return " Dostępny tylko dla znajomych. :/"; 
			    
			} 
			case 0: { 
				return " Niedostępny. :("; 
				
			 } 
			default: { 
				return " Error";  
			    
			} 
		 } 
	}


}
