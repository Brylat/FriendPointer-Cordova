import { Component } from '@angular/core';
import { DatabaseService } from '../../services/database.service';

@Component({
	templateUrl: 'settings-screen.html'
})
export class SettingsScreenPage {

	private databaseService: DatabaseService;
	constructor(databaseService: DatabaseService) {
		this.databaseService = databaseService;
		this.getData();
	}
	
	public name: string = "";
	public surname: string = "";
	public destription: string = "";
	public statusText: string = "";

	private async getData()
	{
		let user = await this.databaseService.getCurrentUserData();
		this.name = user.name;
		this.surname = user.surname;
		this.destription = user.description;
		this.changeStatusText(user.status);
		console.log(user);
	}
	private async updateDestription()
	{
		let user = await this.databaseService.getCurrentUserData();
		user.description = this.destription;
		//console.log(user);
		await this.databaseService.createOrUpdateUser(user);
	}
	private async updateNameSurname()
	{
		let user = await this.databaseService.getCurrentUserData();
		user.name = this.name;
		user.surname = this.surname;
		//console.log(user);
		await this.databaseService.createOrUpdateUser(user);
	}
	private async updateStatus(status)
	{
		let user = await this.databaseService.getCurrentUserData();
		//console.log(status);
		user.status = status;
		await this.databaseService.createOrUpdateUser(user);
		this.changeStatusText(status);
	}
	private changeStatusText(status)
	{
		switch(status) { 
			case 1: { 
			   this.statusText = "Twój status to: Dostępny. :)"; 
			   break; 
			} 
			case 2: { 
				this.statusText = "Twój status to: Dostępny tylko dla znajomych. :/"; 
			   break; 
			} 
			case 3: { 
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
