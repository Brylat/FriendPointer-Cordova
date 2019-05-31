import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import User from '../wrapers/user';

@Component({
	templateUrl: 'settings-screen.html'
})
export class SettingsScreenPage {

	private databaseService: DatabaseService;
	constructor(databaseService: DatabaseService) {
		this.databaseService = databaseService;
		this.getData();
	}
	
	private currentUser: User;
	public name: string = "";
	public surname: string = "";
	public destription: string = "";
	public statusText: string = "";

	private async getData()
	{
		this.currentUser = await this.databaseService.getCurrentUserData();
		if(!this.currentUser) this.currentUser = new User();
		this.name = this.currentUser.name;
		this.surname = this.currentUser.surname;
		this.destription = this.currentUser.description;
		this.changeStatusText(this.currentUser.status ? this.currentUser.status : 1);
	}
	private async updateDate()
	{
		this.currentUser.name = this.name;
		this.currentUser.surname = this.surname;
		this.currentUser.description = this.destription;
		await this.databaseService.createOrUpdateUser(this.currentUser);
	}
	private async updateStatus(status)
	{
		this.currentUser.status = status;
		await this.databaseService.createOrUpdateUser(this.currentUser);
		this.changeStatusText(status);
	}
	private changeStatusText(status)
	{
		switch(status) { 
			case 2: { 
			   this.statusText = "Twój status to: Dostępny. :)"; 
			   break; 
			} 
			case 1: { 
				this.statusText = "Twój status to: Dostępny tylko dla znajomych. :/"; 
			   break; 
			} 
			case 0: { 
				this.statusText = "Twój status to: Niedostępny. :("; 
				break; 
			 } 
			default: { 
				this.statusText = "Error";  
			   break; 
			} 
		 } 
	}

}
