import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import leaflet from 'leaflet';
import 'leaflet-search';
// import 'leaflet-easybutton';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {
 
  data:any = {};
 
  @ViewChild('map') mapElement: ElementRef;
  map: any;
 
  constructor(public navCtrl: NavController, 
              public geolocation: Geolocation, 
              public http: Http, 
              private alertCtrl: AlertController,
              private menu: MenuController
              ) {
    this.data.desc = '';
    this.data.response = '';

    this.http = http;
 
  }  

  openMenu() {
    this.menu.open();
  }

  closeMenu() {
    this.menu.close();
  }

  toggleMenu() {
    this.menu.toggle();
  }

  ionViewDidLoad(){
    this.loadMap();
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Αναφορά Προβλήματος',
      inputs: [
        {
          name: 'title',
          placeholder: 'Τίτλος'
        },
        {
          name: 'desc',
          placeholder: 'Περιγραφή',
        }
      ],
      buttons: [
        {
          text: 'ΥΠΟΒΟΛΗ',
          handler: () => {
            this.geolocation.getCurrentPosition().then((position) => {
              let lat = position.coords.latitude;
              let lon = position.coords.longitude;
              let latLng = {lat: lat, lon:lon}
          
              var title = this.data.title;
              var desc = this.data.desc;
              var desc_loc = {lat: lat, lon: lon, title: title, desc: desc}
              var link = 'http://192.168.1.6:8000/results/';
              var myData = JSON.stringify(desc_loc);
       
       
          this.http.post(link, myData)
            .subscribe(data => {
            this.data.response = data["_body"]; 
            }, error => {
            console.log("Oooops!");
          });
        });
       } 
      }, {
        text: 'ΚΛΕΙΣΙΜΟ',
        role: 'cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      }
     ]
    });    
    alert.present();
  }

  loadMap(){
      this.map = leaflet.map("map").fitWorld();
      leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
      }).addTo(this.map);
      this.map.locate({
        setView: true,
        maxZoom: 16
      }).on('locationfound', (e) => {
        let markerGroup = leaflet.featureGroup();
        let marker: any = leaflet.marker([e.latitude, e.longitude]).on('click', () => {
          alert('You are here !');
        })
        markerGroup.addLayer(marker);
        this.map.addLayer(markerGroup);
      }).on('locationerror', (err) => {
          alert(err.message);
      })
      console.log(this.map.addControl( new leaflet.Control.Search()));
      this.map.addControl( new leaflet.Control.Search({ 
        url: 'https://nominatim.openstreetmap.org/search?format=json&q={s}',
		    jsonpParam: 'json_callback',
	    	propertyName: 'display_name',
	    	propertyLoc: ['lat','lon'],
	    	marker: leaflet.circleMarker([0,0],{radius:30}),
	    	autoCollapse: true,
	    	autoType: false,
	    	minLength: 2
	      }) );
      
      //searchLayer is a L.LayerGroup contains searched markers
      
      this.map.setView(new leaflet.LatLng(35.2551600,25.028161), 7);
      // this.map.panTo(new leaflet.LatLng(35.3376661,24.1276382));

  }

}


