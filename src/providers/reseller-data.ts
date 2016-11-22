import { FirebaseData } from './firebase-data';
import { ResellerModel } from './../models/reseller-model';
import { Platform } from 'ionic-angular';
import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase';

/*
  Generated class for the ResellerData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ResellerData extends FirebaseData{

  public currentUser: any;
  public resellerList: any;

  constructor(public platform:Platform, ngZone:NgZone) {
    super(platform,ngZone);
    //this.currentUser = firebase.auth().currentUser.uid;
    this.resellerList = firebase.database().ref('resellerList');

  }

  getResellerList(): any {
    return this.getSynchronizedArray(this.resellerList);
  }

  getResellerDetail(resellerId): any {
    return this.resellerList.child(resellerId);
  }

  createReseller(reseller : ResellerModel, list:any) {
    let date = new Date(),time = date.getTime();
    reseller.time=time;
    list.add(reseller).key;
  }

  updateReseller(updateReseller:ResellerModel, list:any) {  
    list.set( updateReseller.id, updateReseller );
    
  }

  removeReseller(reseller:ResellerModel, list:any){
    list.remove(reseller.id);
  }

}
