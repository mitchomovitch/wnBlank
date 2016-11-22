import { ResellerModel } from './../../models/reseller-model';
import { ResellerListPage } from './../reseller-list/reseller-list';
import { ResellerMapPage } from './../reseller-map/reseller-map';
import { ResellerCreatePage } from './../reseller-create/reseller-create';
import { WineModel } from './../../models/wine-model';
import { WineData } from './../../providers/wine-data';
import { Component } from '@angular/core';
import { NavController,ActionSheetController,NavParams,Events, Platform } from 'ionic-angular';
import { BarcodeScanner } from 'ionic-native';
import { Storage } from '@ionic/storage';
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
  wine:WineModel;
  public wineList: any;
  public modelChanged:boolean;
  public photoChanged:boolean;
  public needToSave:boolean;
  public userProfile:any;

  constructor(public navParams:NavParams,public nav: NavController, public platform:Platform,
  public actionsheetCtrl: ActionSheetController,public wineData: WineData,
  public storage: Storage,public events:Events) {
    this.nav = nav;
    this.wineData= wineData;
    this.wine = new WineModel();
    this.modelChanged=false;
    this.photoChanged=false;
    this.needToSave=true;
    this.wineList=this.navParams.get('wineList');

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


    //getUserProfile
    this.storage.get('userProfile').then(profile=>{
      this.userProfile=JSON.parse(profile);
      console.log('Pseudo '+this.userProfile.pseudo)
    });
    
  }

  ionViewDidLoad() {
    console.log('Hello WineCreate Page');
  }

  ionViewWillLeave() {
    console.log("leave WineCreatePage : wine.id "+(!this.wine.id));
    if(this.modelChanged && this.needToSave){
      if(!this.wine.id){
        console.log("create");
        this.wineData.createWine(this.wine,this.wineList);
      }
      else {
        console.log("update");
        this.wineData.updateWine(this.wine,this.photoChanged,this.wineList);
      }
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

  addReseller(){
    this.nav.push(ResellerCreatePage);
    this.needToSave=false;
  }

  searchResellerByName(){
    this.nav.push(ResellerListPage);
    this.needToSave=false;
  }

  searchResellerByMap(){
    this.nav.push(ResellerMapPage);
    this.needToSave=false;
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
        }
      ]
    });
    actionSheet.present();
    
  }

  elementChanged(){
    console.log('element Changed !');
    this.modelChanged=true;
    this.needToSave=true;
  }

  setColor(color:string){
    console.log('color :'+color);
    this.wine.color=color;
  }
}
