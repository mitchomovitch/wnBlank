import { WineData } from './../../providers/wine-data';
import { Component } from '@angular/core';
import { NavController, NavParams  } from 'ionic-angular';
import { Camera, BarcodeScanner } from 'ionic-native';

/*
  Generated class for the WineDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-wine-detail',
  templateUrl: 'wine-detail.html'
})
export class WineDetailPage {
  currentWine: any;
  winePhoto: any = null;
  constructor(public nav: NavController, public navParams: NavParams, public wineData: WineData) {
    this.navParams = navParams;

    this.wineData.getWineDetail(this.navParams.get('wineId')).on('value', (snapshot) => {
      this.currentWine = snapshot.val();
    });
  }

  ionViewDidLoad() {
    console.log('Hello WineDetail Page');
  }

  ionViewWillLeave() {
      this.wineData.updateWine(this.currentWine,this.winePhoto).then( () => {
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
      this.currentWine.codebarre=barcodeData.text;
    // Success! Barcode data is here
    }, (err) => {
        console.log("ERROR -> " + JSON.stringify(err));
    });
  }

}
