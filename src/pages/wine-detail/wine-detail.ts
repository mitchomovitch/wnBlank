import { Storage } from '@ionic/storage';
import { ResellerModel } from './../../models/reseller-model';
import { ResellerMapPage } from './../reseller-map/reseller-map';
import { ResellerListPage } from './../reseller-list/reseller-list';
import { ResellerCreatePage } from './../reseller-create/reseller-create';
import { WineData } from './../../providers/wine-data';
import { Component } from '@angular/core';
import { NavController, NavParams,ActionSheetController,Events, Platform } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';

declare var cordova;
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
  public wineList: any;
  wine: any;
  public modelChanged:boolean;
  public photoChanged:boolean;
  public isDeleted: boolean;
  public lastModif:Date;
  constructor(public platform:Platform,public nav: NavController, public navParams: NavParams, public actionsheetCtrl: ActionSheetController, 
  public wineData: WineData,public events: Events,public storage:Storage) {

    console.log('Constructor WineDetailPage Page');
    this.navParams = navParams;
    this.wineList=this.navParams.get('wineList');
    this.wine=this.navParams.get('wine');
    this.modelChanged=false;
    this.photoChanged=false;
    this.isDeleted=false;
    this.lastModif= new Date(this.wine.time);

    this.events.subscribe('reseller:selected', (data) => {
      // data is an array of parameters, so grab our first and only arg
      let reseller:ResellerModel;
      reseller=data[0];
      if(this.wine){
        //this.wine.vendeur=reseller.nom;
        //this.elementChanged();
      }
      //console.log('Event data', JSON.stringify(data));
    });
  }

  ionViewDidLoad() {
    console.log('Hello WineDetail Page');
  }

  ionViewWillLeave() {
    console.log('Not deleted ?'+(!this.isDeleted));
    if(this.modelChanged&&!this.isDeleted){
      console.log('update wine detail');
      this.wineData.updateWine(this.wine,this.photoChanged,this.wineList);
    }
      
  }

  scan(){
    BarcodeScanner.scan().then((barcodeData) => {
      this.elementChanged();
      this.wine.codebarre=barcodeData.text;
    // Success! Barcode data is here
    }, (err) => {
        console.log("ERROR -> " + JSON.stringify(err));
    });
  }

  openMenuPhoto() {
    let actionSheet = this.actionsheetCtrl.create({
      title: 'Photo',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Prendre une photo',
          icon: 'camera',
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: 'Choisir une photo',
          icon: 'images',
          handler: () => {
            this.openPhotoLibrary();
          }
        },
        {
          text: 'Scanner un code barre',
          icon: 'barcode',
          handler: () => {
            this.scan();
          }
        }
      ]
    });
    actionSheet.present();
  }

  takePicture(){
    this.wineData.takePicture(1).then(success=>{
      this.elementChanged();
      this.photoChanged=true;
      let name = success.nativeURL.replace(/^.*[\\\/]/, '');
      this.wine.photoName=name;
      this.wine.photoPath=success.nativeURL;
      
    });
  }


  openPhotoLibrary(){
    this.wineData.takePicture(0).then(success=>{
      this.elementChanged();
      this.photoChanged=true;
      let name = success.nativeURL.replace(/^.*[\\\/]/, '');
      this.wine.photoName=name;
      this.wine.photoPath=success.nativeURL;
    });
  }

  removeWine(){
    console.log("delete notes");
    this.elementChanged();
    
    this.wineData.removeWine(this.wine,this.wineList);
    this.isDeleted=true;
    console.log("delete notes finish");
    this.nav.pop();
  }

  addReseller(){
    this.nav.push(ResellerCreatePage);
  }

  searchResellerByName(){
    this.nav.push(ResellerListPage);
  }

  searchResellerByMap(){
    this.nav.push(ResellerMapPage);
  }

  saveCloud(){

  }

  openMenuDetail()
  {
    let actionSheet = this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Vendeurs',
          icon: 'basket',
          handler: () => {
            this.searchResellerByName();
          }
        },
        {
          text: 'Supprimer',
          icon: 'trash',
          handler: () => {
            this.removeWine();
          }
        }
      ]
    });
    actionSheet.present();
    
  }

  elementChanged(){
    //console.log('element Changed !');
    this.modelChanged=true;
  }

  setColor(color:string){
    console.log('color :'+color);
    this.wine.color=color;
    this.elementChanged();
  }


}
