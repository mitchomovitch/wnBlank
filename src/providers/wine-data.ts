import { WineModel } from './../models/wine-model';
import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class WineData {
  public currentUser: any;
  public wineList: any;
  public winePictureRef: any;

  constructor() {
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

  createWine(wine : WineModel,picture = null): any {
    return this.wineList.push(wine).then( newWine => {
      this.wineList.child(newWine.key).child('id').set(newWine.key);
      if (picture != null) {
        this.winePictureRef.child(newWine.key).child('winePhoto.png')
      .putString(picture, 'base64', {contentType: 'image/png'})
        .then((savedPicture) => {
          this.wineList.child(newWine.key).child('photoUrl').set(savedPicture.downloadURL);
        });        
      }
    });
    
  }

  updateWine(wine:any, picture = null): any {
    alert("savePicture"+picture);
    
    return this.wineList.child(wine.id).update(wine).then( wine => {
      
      if (picture != null) {
        this.winePictureRef.child(wine.id).child('winePhoto.png')
      .putString(picture, 'base64', {contentType: 'image/png'})
        .then((savedPicture) => {
          
          this.wineList.child(wine.id).child('photoUrl').set(savedPicture.downloadURL);
        });        
      }
    });  
    
  }

}