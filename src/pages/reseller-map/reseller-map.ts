import { ResellerCreatePage } from './../reseller-create/reseller-create';
import { ResellerModel } from './../../models/reseller-model';
import { ResellerData } from './../../providers/reseller-data';
import { ConnectivityService } from './../../providers/connectivity-service';
import { Component,NgZone} from '@angular/core';
import { NavController, Platform,NavParams } from 'ionic-angular';
import { Geolocation } from 'ionic-native';

declare var google;

/*
  Generated class for the ResellerMap page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-reseller-map',
  templateUrl: 'reseller-map.html'
})
export class ResellerMapPage {
  public resellerList: any;
  reseller: ResellerModel;
  map: any;
 
  constructor(public nav: NavController,public navParams: NavParams, public platform:Platform,
  public connectivityService: ConnectivityService,
  public resellerData:ResellerData, private ngZone:NgZone) {
    this.platform=platform;
    this.navParams = navParams;
    this.resellerList=this.navParams.get('resellerList');

    this.platform.ready().then(() => {
      this.loadMap();
        /*if(this.connectivityService.isOnline()){
            console.log("online, loading map");
            this.loadMap();
        }
        else {
            console.log("offLine, no loading map");
        }*/
        
    });
  }
 
  loadMap(){
    console.log('alert loading map');
    Geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  
      let mapOptions = {
        center: latLng,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
  
      this.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
      this.addMarkers();
    }, (err) => {
      console.log('Geoloaction:'+err);
    });
 
  }

  locate(){
    Geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      this.map.setCenter(latLng);
      
    }, (err) => {
      console.log('Geoloaction:'+err);
    });
  }


  addReseller(){
    this.nav.push(ResellerCreatePage);
  
  }

  addMarkers(){
    for(let i=0;i<this.resellerList.length;i++){
        this.reseller=this.resellerList[i];
        console.log("add reseller marker for :"+this.reseller.nom);
        var latlngStr = this.reseller.latlng.split(',', 2);
        var latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
        console.log("latLng:"+JSON.stringify(latlng));
        let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: latlng,
        title: this.reseller.nom
        });

        let content = "<h1>"+this.reseller.nom+"</h1>"+"<h4>"+this.reseller.horaire+"</h4>";          
    
        this.addInfoWindow(marker, content);
    }
      
  }

  addInfoWindow(marker, content){
 
      let infoWindow = new google.maps.InfoWindow({
        content: content
      });
    
      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker);
      });
 
  }

}
