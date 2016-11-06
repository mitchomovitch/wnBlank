import { ConnectivityService } from './../../providers/connectivity-service';
import { Component} from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
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

  map: any;
 
  constructor(public navCtrl: NavController, public platform:Platform,
  public connectivityService: ConnectivityService) {
    this.platform=platform;
    this.platform.ready().then(() => {
        if(this.connectivityService.isOnline()){
            console.log("online, loading map");
            this.loadMap();
        }
        else {
            console.log("offLine, no loading map");
        }
        
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
    }, (err) => {
      console.log('Geoloaction:'+err);
    });
 
  }


  addReseller(){
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });
 
    let content = "<h4>Information!</h4>";          
 
    this.addInfoWindow(marker, content);
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
