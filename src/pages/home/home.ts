import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import leaflet from 'leaflet';
import { AlertController } from 'ionic-angular';
 
@Component({
  selector: 'home-page',
  templateUrl: 'home.html'
})
export class HomePage {
  data:any = {};
 
  @ViewChild('map') mapElement: ElementRef;
  map: any;
 
  constructor(public navCtrl: NavController, public geolocation: Geolocation, public http: Http, private alertCtrl: AlertController) {
    this.data.desc = '';
    this.data.response = '';

    this.http = http;
 
  }  

  ionViewDidLoad(){
    this.loadMap();
  }

  loadMap(){
      this.map = leaflet.map("map").fitWorld();
      leaflet.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18
      }).addTo(this.map);
      this.map.locate({
        setView: true,
        maxZoom: 10
      }).on('locationfound', (e) => {
        console.log('found you');
      })
 
  }

  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Login',
      inputs: [
        {
          name: 'title',
          placeholder: 'Title'
        },
        {
          name: 'desc',
          placeholder: 'Description',
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        }, {
          text: 'Submit',
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
    }
    ]
    });    
    alert.present();
  }


  submit() {
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

}


