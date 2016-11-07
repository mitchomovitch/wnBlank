import { Platform } from 'ionic-angular';
import { WineModel } from './../models/wine-model';
import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase';
import { File, Camera } from 'ionic-native';

declare var cordova:any;

@Injectable()
export class WineData {
  public currentUser: any;
  public wineList: any;
  public winePictureRef: any;

  constructor(public platform:Platform, public ngZone:NgZone) {
    this.currentUser = firebase.auth().currentUser.uid;
    this.wineList = firebase.database().ref('wineList');
    this.winePictureRef = firebase.storage().ref('/WinePhoto/');

  }

  getWineList(): any {
    return this.getSynchronizedArray(this.wineList);;
  }

  getWineDetail(wineId): any {
    return this.wineList.child(wineId);
  }

  createWine(wine : WineModel, list:any) {
    let date = new Date(),time = date.getTime();
    wine.time=time;
    var newRecordId = list.add(wine).key;
    wine.id=newRecordId;
    if (wine.photoPath != null) {
        this.savePhoto(wine,list);         
    }
    
  }

  updateWine(updateWine:WineModel, list:any) {  
    list.set( updateWine.id, updateWine );
    if (updateWine.photoPath != null) {
        this.savePhoto(updateWine,list);         
    } 
  }

  removeWine(wine:WineModel, list:any){
    if(wine.photoUrl != null){
      let currentName = wine.photoPath.replace(/^.*[\\\/]/, '');
      this.winePictureRef.child(wine.id).child(currentName).delete().then(()=>{
        console.log("delete storage "+wine.id);
      }, (err) => {
        console.log('err delete storage : '+err);
      });
    }
    list.remove(wine.id);
  }

  savePhoto(wine:WineModel, list:any){
    //Grab the file name
    let currentName = wine.photoPath.replace(/^.*[\\\/]/, '');
    File.readAsDataURL(cordova.file.dataDirectory,currentName).then( (base64:string)=>{
      base64=base64.substring(base64.indexOf(',')+1);
      this.winePictureRef.child(wine.id).child(currentName)
      .putString(base64, 'base64', {contentType: 'image/png'})
      .then((savedPicture) => {
        wine.photoUrl=savedPicture.downloadURL;
        list.set( wine.id, wine );
        //this.wineList.child(wine.id).child('photoUrl').set(savedPicture.downloadURL);
      }, (err) => {
        console.log('err putString : '+err);
      });
    }, (err) => {
      console.log('err read file : '+err);    
    });
  }


  uploadFile(imageData:any){
    
  }

  takePicture(sourceType:number):Promise<any>{
    return Camera.getPicture({
      quality : 40,
      destinationType : Camera.DestinationType.FILE_URI,
      //CAMERA. PHOTOLIBRARY : 0, CAMERA : 1, SAVEDPHOTOALBUM : 2
      sourceType : sourceType,
      allowEdit : true,
      encodingType: Camera.EncodingType.PNG,
      targetWidth: 400,
      targetHeight: 600,
      saveToPhotoAlbum: false
    }).then( path => {
      
      if(this.platform.is('ios')){
          let currentName = path.replace(/^.*[\\\/]/, '');
          //Create a new file name
              let d = new Date(),
                  n = d.getTime(),
                  newFileName = n + ".png";
          return File.moveFile(cordova.file.tempDirectory, currentName, cordova.file.dataDirectory, newFileName);
      
      } else {
          return new Promise(function(resolve, reject) {
            resolve('some success stuff');
            reject('some fail stuff');
          });
      }


    });
  }


  //*************************
getSynchronizedArray(firebaseRef):any {
  var list = [];
  this.syncChanges(list, firebaseRef);
  this.wrapLocalCrudOps(list, firebaseRef);
  //console.log("getSynchronizedArray return :"+JSON.stringify(list));
  return list;
}

syncChanges(list, ref) {
  //console.log("syncChanges");

  ref.on('child_added', (snap, prevChild) => {
    this.ngZone.run(()=>{
      //console.log("syncChanges child_added");
      var data = snap.val();
      data.id = snap.key; // assumes data is always an object
      var pos = this.positionAfter(list, prevChild);
      list.splice(pos, 0, data);
      //console.log("child_added list :"+JSON.stringify(list));
    });
  });

  ref.on('child_removed', (snap) => {
    this.ngZone.run(()=>{
      //console.log("syncChanges child_removed");
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

wrapLocalCrudOps(list, firebaseRef):any {
  //console.log("wrapLocalCrudOps");
   // we can hack directly on the array to provide some convenience methods
   list.add = function(data) {
     //console.log("wrapLocalCrudOps add");
      return firebaseRef.push(data);
   };

   list.remove = function(key) {
     //console.log("wrapLocalCrudOps remove");
     firebaseRef.child(key).remove();
   };

   list.set = function(key, newData) {
     //console.log("wrapLocalCrudOps set");
     // make sure we don't accidentally push our id prop
     if( newData.hasOwnProperty('id') ) { delete newData.id; }
     firebaseRef.child(key).set(newData);
   };

   list.indexOf = function(key) {
     //console.log("wrapLocalCrudOps indexOf");
     return this.positionFor(list, key); // positionFor in examples above
   }
}

// similar to indexOf, but uses id to find element
positionFor(list, key):number {
  for(var i = 0, len = list.length; i < len; i++) {
    if( list[i].id === key ) {
      return i;
    }
  }
  return -1;
}

// using the Firebase API's prevChild behavior, we
// place each element in the list after it's prev
// sibling or, if prevChild is null, at the beginning
positionAfter(list, prevChild):number {
  if( prevChild === null ) {
    return 0;
  }
  else {
    var i = this.positionFor(list, prevChild);
    if( i === -1 ) {
      return list.length;
    }
    else {
      return i+1;
    }
  }
}
}