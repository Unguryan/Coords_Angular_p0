import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import * as Leaflet from 'leaflet';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})


export class HomeComponent {
  public latlng: Leaflet.LatLng | undefined;

  eventsSubject: Subject<void> = new Subject<void>();
  emitRevomeMarkerEvent() {
    this.eventsSubject.next();
  }

  public loading: boolean = false;

  public exp_minutes: string | 0 = 0;
  public exp_seconds: string | 0 = 0;

  private token: string | null;

  constructor(
    private http: HttpClient,
    private router: Router) {

    this.token = localStorage.getItem('token');
    if (this.token == null || this.token === "" || this.token == undefined) {
      this.router.navigate(['/login']);
      return;
    }
  }

  ngOnInit() { }

  sendCoords(form: NgForm) {

    var details = form.value.details;

    if (this.token == null || this.token === "") {
      alert("User token NOT SET");
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
      return;
    }
    if (this.latlng == undefined) {
      alert("Coords NOT SET");
      return;
    }

    /*const data = JSON.stringify(form.value);*/

    var data = {
      Details: details,
      Longitude: this.latlng.lng,//y
      Latitude: this.latlng.lat,//x
      UserToken: this.token
    };

    var url = environment.coordsAPI + 'coord/create';

    this.http.post(url, data,
      {
        responseType: 'text',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': '*/*'
        }),
      },
    ).subscribe(response => {
      var res = JSON.parse(response) as SendCoordsResult;

      var resMessage = "";
      if (res.errorMessage != null) {
        resMessage += "\nŒ¯Ë·Í‡: " + res.errorMessage;
      }

      if (res.isValid) {
        alert("Success");
      }
      else {
        alert(resMessage);
      }

      //window.location.reload();
    }
    );

    //alert(details);


    //alert(Object.keys(form.value));
  }

  addlatlngData(event: Leaflet.LatLng) {
    this.latlng = event;
  }

  removeMarker() {
    this.latlng = undefined;
    this.emitRevomeMarkerEvent();
  }
}

interface SendCoordsResult {
  isValid: boolean;
  isSent: boolean;
  errorMessage: string | null;
}
