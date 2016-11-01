import { WineModel } from './../../models/wine-model';
import { WineData } from './../../providers/wine-data';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Camera, BarcodeScanner } from 'ionic-native';

/*
  Generated class for the WineCreate page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-wine-create',
  templateUrl: 'wine-create.html'
})
export class WineCreatePage {
  nom:string='';
  annee:number;
  prix:number;
  vendeur:string='';
  note:string='';
  codebarre:string='';
  photoUrl:string='';
  winePhoto: any = null;

  wine:WineModel;

  constructor(public nav: NavController, public wineData: WineData) {
    this.nav = nav;
    this.wineData= wineData;
    this.wine = new WineModel();
  }

  ionViewDidLoad() {
    console.log('Hello WineCreate Page');
  }

  ionViewWillLeave() {
      this.wineData.createWine(this.wine,this.winePhoto).then( () => {
      });
  }

  takePicture(){
    Camera.getPicture({
      quality : 50,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : true,
      encodingType: Camera.EncodingType.PNG,
      targetWidth: 400,
      targetHeight: 600,
      saveToPhotoAlbum: false
    }).then(imageData => {
      this.winePhoto = imageData;
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }


  scan(){
    BarcodeScanner.scan().then((barcodeData) => {
      this.wine.codebarre=barcodeData.text;
    // Success! Barcode data is here
    }, (err) => {
        console.log("ERROR -> " + JSON.stringify(err));
    });
  }
  

}
