import { Platform } from 'ionic-angular';
import { FirebaseData } from './firebase-data';
import { Storage } from '@ionic/storage';
import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase';

/*
  Generated class for the ListData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ListData extends FirebaseData{

  public regionList:any;
  public regionRef:any;


  constructor(public platform:Platform, public storage:Storage, ngZone:NgZone) {
    super(platform,ngZone,storage);
    
    // init region list
    this.regionRef=firebase.database().ref('valueList/region');
    this.regionList=this.getSynchronizedArray(this.regionRef);
    this.initLocalStorage();

  }

  initLocalStorage(){
    this.storage.get('regionList').then(list=>{
      if(list){
        var array:any[]=JSON.parse(list);
        for(var i = 0, len = array.length; i < len; i++) {
          this.regionList.set( array[i].id, array[i] );
        }
      } 
    });
  }

  getList(listName:string): any {
    var list=[];
    if(listName=='region'){
      list=this.regionList;
    }

    return list;
  }

  syncChanges(list, ref) {
  //console.log("syncChanges");

  ref.on('child_added', (snap, prevChild) => {
    this.ngZone.run(()=>{
      var data = snap.val();
      data.id = snap.key; // assumes data is always an object
      var pos = this.positionAfter(list, prevChild);
      list.splice(pos, 0, data);
      this.storage.set('regionList',JSON.stringify(list));
      
      //console.log("child_added list :"+JSON.stringify(list));
    });
  });

  ref.on('child_removed', (snap) => {
    this.ngZone.run(()=>{    
      var i = this.positionFor(list, snap.key);
      if( i > -1 ) {
        list.splice(i, 1);            
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
