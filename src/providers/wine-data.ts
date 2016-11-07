import { Platform } from 'ionic-angular';
import { WineModel } from './../models/wine-model';
import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { File, Camera } from 'ionic-native';

declare var cordova:any;

@Injectable()
export class WineData {
  public currentUser: any;
  public wineList: any;
  public winePictureRef: any;

  constructor(public platform:Platform) {
    this.currentUser = firebase.auth().currentUser.uid;
    this.wineList = firebase.database().ref('wineList');
    this.winePictureRef = firebase.storage().ref('/WinePhoto/');

  }

  getWineList(): any {
    return this.wineList;
  }

  getWineDetail(wineId): any {
    return this.wineList.child(wineId);
  }



  createWine(wine : WineModel): any {
    let date = new Date(),time = date.getTime();
    wine.time=time;
    return this.wineList.push(wine).then( newWine => {
      this.wineList.child(newWine.key).child('id').set(newWine.key);
      newWine.id=newWine.key;
      if (newWine.photoPath != null) {
        this.savePhoto(newWine);         
      }
    });
    
  }

  updateWine(updateWine:WineModel, picture = null): any {  
    return this.wineList.child(updateWine.id).update(updateWine).then( wine => {
      if (updateWine.photoPath != null) {
        this.savePhoto(updateWine);         
      }
    }, error => {
      console.log("ERROR 2-> " + JSON.stringify(error));
    });  
    
  }

  removeWine(wine:WineModel){
    if(wine.photoUrl != null){
      let currentName = wine.photoPath.replace(/^.*[\\\/]/, '');
      this.winePictureRef.child(wine.id).child(currentName).delete().then(()=>{
        console.log("delete storage "+wine.id);
      }, (err) => {
        console.log('err delete storage : '+err);
      });
    }
    this.wineList.child(wine.id).remove(wine).then(()=>{
        console.log("delete db wine ");
      }, (err) => {
        console.log('err delete db : '+err);
      });
  }

  savePhoto(wine:WineModel){
    //Grab the file name
    let currentName = wine.photoPath.replace(/^.*[\\\/]/, '');
    File.readAsDataURL(cordova.file.dataDirectory,currentName).then( (base64:string)=>{
      base64=base64.substring(base64.indexOf(',')+1);
      this.winePictureRef.child(wine.id).child(currentName)
      .putString(base64, 'base64', {contentType: 'image/png'})
      .then((savedPicture) => {
        this.wineList.child(wine.id).child('photoUrl').set(savedPicture.downloadURL);
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
}