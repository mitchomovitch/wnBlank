import { UtilData } from './util-data';
import { WineModel } from './../models/wine-model';
import { FirebaseData } from './firebase-data';
import { Platform, Events } from 'ionic-angular';
import { PriceModel } from './../models/price-model';
import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase';
import { Storage } from '@ionic/storage';

/*
  Generated class for the PriceData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PriceData extends FirebaseData{

  public priceRef: any;
  public syncPriceList: any;

  public userProfile:any;
  public priceListToDelete:any[];

  constructor(public platform:Platform, public ngZone:NgZone,public storage: Storage, 
  public util : UtilData, public events:Events) {
    super(platform,ngZone,storage);
    console.log('Hello PriceData Provider');
    this.storage.get('userProfile').then(profile=>{
      console.log('userProfile',profile)
      this.userProfile=JSON.parse(profile);
    }); 
    this.events.subscribe('userProfile:updated', (data) => {
      console.log('userProfile events',JSON.stringify(data[0]));
      this.userProfile=data[0];    
    });

    this.priceRef = firebase.database().ref('priceList');
    this.syncPriceList=this.getSynchronizedArray(this.priceRef);
    this.initLocalStorage();
     
  }

  initLocalStorage(){
    

    this.storage.get('priceList').then(list=>{
      //console.log('PriceList:'+list);
      if(list){
        console.log("use local");
        var array:any[]=JSON.parse(list);
        for(var i = 0, len = array.length; i < len; i++) {
          this.savePrice(array[i]);
        }
      }
    });
        
    this.storage.get('priceListToDelete').then(listDelete=>{
      if(listDelete){
        this.priceListToDelete=JSON.parse(listDelete);
      }
      else {
        this.priceListToDelete=[];
      }
    });
  }

  getWinePriceList(wine:WineModel): any {

    var winePriceList:any[];
    winePriceList = this.syncPriceList.filter((price) => {
      
        return (price.wineId==wine.id);
      });
    console.log('filter list:'+JSON.stringify(winePriceList));
    return winePriceList;
  }

  savePrice(price:PriceModel) {  
    if(price.id==null){
      let date = new Date(),time = date.getTime();
      price.id=this.util.uuid.generateTimeId();
      price.time=time;
      price.userId=this.userProfile.id;
      price.userPseudo=this.userProfile.pseudo; 
    }
    this.syncPriceList.set( price.id, price );
    this.storage.set('priceList',JSON.stringify(this.syncPriceList));
  }

  removePrice(price:PriceModel) {  
    console.log('remove init')
    var id=price.id;
    this.syncPriceList.remove(price.id).then((data)=>{
      console.log('remove ok')
      var i = this.positionFor(this.priceListToDelete, id);
      if( i > -1 ) {
        this.priceListToDelete.splice(i, 1);
        this.storage.set('priceListToDelete',JSON.stringify(this.priceListToDelete));
      }
      this.storage.set('priceList',JSON.stringify(this.syncPriceList));
    });
  }

  // méthode surchargé
  syncChanges(list, ref) {
  //console.log("syncChanges");

      ref.on('child_added', (snap, prevChild) => {
        this.ngZone.run(()=>{
          var data = snap.val();
          console.log('price added ',data.wineId);
          data.id = snap.key;
          list.splice(0, 0, data);
          
        });
      });

      ref.on('child_removed', (snap) => {
        this.ngZone.run(()=>{
          var data = snap.val();
          data.id = snap.key; 
            var i = this.positionFor(list, snap.key);
            if( i > -1 ) {
              console.log("syncChanges child delete");
              list.splice(i, 1);
              //mark to delete : add to the delete list
              this.priceListToDelete.push(data);
              this.storage.set('priceListToDelete',JSON.stringify(this.priceListToDelete));         
          }
        });
      });

      ref.on('child_changed', (snap) => {
        this.ngZone.run(()=>{
          
          var data = snap.val();
          console.log('price updated ',data.wineId);
          data.id = snap.key; 
            var i = this.positionFor(list, snap.key);
            if( i > -1 ) {
              list[i] = data;
              list[i].id = snap.key; // assumes data is always an object
            }    
          
        });
      });

      ref.on('child_moved', (snap, prevChild) => {
        this.ngZone.run(()=>{
          console.log("syncChanges child_moved");
          var curPos = this.positionFor(list, snap.key);
          if( curPos > -1 ) {
            var data = list.splice(curPos, 1)[0];  
            var newPos = this.positionAfter(list, prevChild);
            list.splice(newPos, 0, data);
          }
        });

      });
  }  

}
