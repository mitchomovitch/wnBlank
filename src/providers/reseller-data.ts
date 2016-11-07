import { ResellerModel } from './../models/reseller-model';
import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import firebase from 'firebase';

/*
  Generated class for the ResellerData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ResellerData {

  public currentUser: any;
  public resellerList: any;

  constructor(public platform:Platform) {
    this.currentUser = firebase.auth().currentUser.uid;
    this.resellerList = firebase.database().ref('resellerList');

  }

  getResellerList(): any {
    return this.resellerList;
  }

  getResellerDetail(resellerId): any {
    return this.resellerList.child(resellerId);
  }

  createReseller(reseller : ResellerModel): any {
    let date = new Date(),time = date.getTime();
    reseller.time=time;
    return this.resellerList.push(reseller).then( newReseller => {
      this.resellerList.child(newReseller.key).child('id').set(newReseller.key);
    }, error => {
      console.log("create reseller error-> " + JSON.stringify(error));
    });
    
  }

  updateReseller(updateReseller:ResellerModel): any {  
    return this.resellerList.child(updateReseller.id).update(updateReseller)
    .then( reseller => {
    }, error => {
      console.log("update reseller error-> " + JSON.stringify(error));
    });  
    
  }

  removeReseller(reseller:ResellerModel){
    this.resellerList.child(reseller.id).remove(reseller);
  }

}
