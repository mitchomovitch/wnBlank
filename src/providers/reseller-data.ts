import { UtilData } from './util-data';
import { FirebaseData } from './firebase-data';
import { ResellerModel } from './../models/reseller-model';
import { Platform, Events } from 'ionic-angular';
import { Injectable, NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';

/*
  Generated class for the ResellerData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ResellerData extends FirebaseData{

  public userProfile:any;
  public resellerListToDelete:any[];

  public resellerRef: any;
  public syncResellerList: any;

  constructor(public platform:Platform, ngZone:NgZone, public storage : Storage, public util : UtilData,
  public events:Events) {
    super(platform,ngZone,storage);
    //this.currentUser = firebase.auth().currentUser.uid;
    this.storage.get('userProfile').then(profile=>{
      console.log('userProfile',profile)
      this.userProfile=JSON.parse(profile);
    }); 
    this.events.subscribe('userProfile:updated', (data) => {
      console.log('userProfile events',JSON.stringify(data[0]));
      this.userProfile=data[0];    
    });

    this.resellerRef = firebase.database().ref('resellerList');
    this.syncResellerList=this.getSynchronizedArray(this.resellerRef);
    this.initLocalStorage();

  }

  initLocalStorage(){

    this.storage.get('resellerList').then(list=>{
      //console.log('resellerList:'+list);
      if(list){
        console.log("use local");
        var array:any[]=JSON.parse(list);
        for(var i = 0, len = array.length; i < len; i++) {
          this.saveReseller(array[i]);
        }
      } 
    });
        
    this.storage.get('resellerListToDelete').then(listDelete=>{
      if(listDelete){
        this.resellerListToDelete=JSON.parse(listDelete);
      }
      else {
        this.resellerListToDelete=[];
      }
    });
  }

  getResellerList(): any {
    return this.syncResellerList;
  }

  saveReseller(reseller:ResellerModel) { 
    if(reseller.id==null){
      let date = new Date(),time = date.getTime();
      reseller.id=this.util.uuid.generateTimeId();
      reseller.time=time;
    }
    this.syncResellerList.set( reseller.id, reseller );
    this.storage.set('resellerList',JSON.stringify(this.syncResellerList));
    
  }

  removeReseller(reseller:ResellerModel){
    var resellerId=reseller.id;
    this.syncResellerList.remove(reseller.id).then((data)=>{
      var i = this.positionFor(this.resellerListToDelete, resellerId);
      if( i > -1 ) {
        this.resellerListToDelete.splice(i, 1);
        this.storage.set('resellerListToDelete',JSON.stringify(this.resellerListToDelete));
      }
      this.storage.set('resellerList',JSON.stringify(this.syncResellerList));
    });
  }

  syncChanges(list, ref) {    
  //console.log("syncChanges");

  ref.on('child_added', (snap, prevChild) => {
    this.ngZone.run(()=>{
      var data = snap.val();
      data.id = snap.key; // assumes data is always an object
      var pos = this.positionAfter(list, prevChild);
      list.splice(pos, 0, data);
      this.storage.set('resellerList',JSON.stringify(list)); 
      
      //console.log("child_added list :"+JSON.stringify(list));
    });
  });

  ref.on('child_removed', (snap) => {
    this.ngZone.run(()=>{   
      var data = snap.val(); 
      var i = this.positionFor(list, snap.key);
      if( i > -1 ) {
        list.splice(i, 1);
        //mark to delete : add to the delete list
        this.resellerListToDelete.push(data);
        this.storage.set('resellerListToDelete',JSON.stringify(this.resellerListToDelete));        
      }
      //console.log("child_removed list :"+JSON.stringify(list));
    });
  });

  ref.on('child_changed', (snap) => {
    this.ngZone.run(()=>{
      //console.log("syncChanges child_changed");
      var i = this.positionFor(list, snap.key);
      if( i > -1 ) {
        list[i] = snap.val();
        list[i].id = snap.key; // assumes data is always an object
      }
      //console.log("child_changed list :"+JSON.stringify(list));
    });
  });

  ref.on('child_moved', (snap, prevChild) => {
    this.ngZone.run(()=>{
      //console.log("syncChanges child_moved");
      var curPos = this.positionFor(list, snap.key);
      if( curPos > -1 ) {
        var data = list.splice(curPos, 1)[0];
        var newPos = this.positionAfter(list, prevChild);
        list.splice(newPos, 0, data);
      }
      //console.log("child_moved list :"+JSON.stringify(list));
    });

  });
}

  

}
