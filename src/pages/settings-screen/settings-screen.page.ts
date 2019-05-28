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

	private async getData()
	{
		let user = await this.databaseService.getCurrentUserData();
		this.name = user.name;
		this.surname = user.surname;
		this.destription = user.description;
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
	

}
