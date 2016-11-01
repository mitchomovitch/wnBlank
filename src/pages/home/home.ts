import { WineModel } from './../../models/wine-model';
import { WineCreatePage } from './../wine-create/wine-create';
import { WineData } from './../../providers/wine-data';
import { WineDetailPage } from './../wine-detail/wine-detail';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera } from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public wineList: any;
  winePhoto: any = null;

  constructor(public nav: NavController, public wineData:WineData) {
    this.nav = nav;
    this.wineData = wineData;

    this.wineData.getWineList().on('value', snapshot => {
      let rawList = [];
      snapshot.forEach( snap => {
        rawList.push({
          id: snap.key,
          nom: snap.val().nom,
          annee: snap.val().annee,
          codebarre: snap.val().codebarre,
          prix: snap.val().prix,
          vendeur: snap.val().vendeur,
          note: snap.val().note,
          photoUrl: snap.val().photoUrl
        });
      });
      this.wineList = rawList;
    });
  }

  goToWineDetail(wineId){
    this.nav.push(WineDetailPage, {
      wineId: wineId,
    });
  }

  createWine(){
    console.log('createWine');
    this.nav.push(WineCreatePage);
  }

  searchWine(){
    console.log('searchWine');
  }

  takePicture(){
    Camera.getPicture({
      quality : 80,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : true,
      encodingType: Camera.EncodingType.PNG,
      targetWidth: 500,
      targetHeight: 500,
      saveToPhotoAlbum: true
    }).then(imageData => {
      this.winePhoto = imageData;
      this.wineData.createWine(new WineModel(),this.winePhoto).then( () => {
      });
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

}
