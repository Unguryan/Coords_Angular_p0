import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as Leaflet from 'leaflet';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent {

  @Output() newlatlngDataEvent = new EventEmitter<Leaflet.LatLng>();

  //@Output()
  //private latlng: Leaflet.LatLng | undefined;


  //options: Leaflet.MapOptions = {
  //  layers: getLayers(),
  //  zoom: 12,
  //  center: new Leaflet.LatLng(47.992416, 37.787308),
  //};


  map: Leaflet.Map | undefined;
  mark: Leaflet.Marker<any> | undefined;


  private eventsSubscription: Subscription | undefined;
  @Input()
  events: Observable<void> | undefined;

  ngOnInit() {
    this.eventsSubscription = this.events!.subscribe(() => this.removeMarker());

    this.map = Leaflet.map(document.getElementById("map_view")!).setView([47.993675, 37.784140], 15);
    Leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.map.on("click", e => {
      //this.latlng = e.latlng;
      e.latlng.lat += 0.0000211; // - to down, + to up
      e.latlng.lng -= 0.0000922; // - to left, + to right
      this.newlatlngDataEvent.emit(e.latlng);
      //alert(e.latlng); // get the coordinates

      if (this.mark != undefined) {
        this.mark.removeFrom(this.map!);
      }

      this.mark = new Leaflet.Marker(e.latlng, {
        icon: new Leaflet.Icon({
          iconSize: [50, 41],
          iconAnchor: [7, 30],// -left,+right, | -down, +up
          iconUrl: 'assets/blue-marker.svg',
          className: '.leaflet-mouse-marker'
        })
      } as Leaflet.MarkerOptions);

      //this.mark.on("mouseover", function () { ('.leaflet-mouse-marker').css('cursor', 'crosshair'); });

      //this.mark.on("mouseout", function () { ('.leaflet-mouse-marker').css('cursor', ''); });

      this.mark.addTo(this.map!);

      //Leaflet.marker([e.latlng.lat, e.latlng.lng], ).addTo(this.map!); // add the marker onclick
    });
  }

  onSingleClick(event: any) {
    var keys = Object.keys(event);

    alert(keys.length);
  }

  removeMarker() {
    if (this.mark != undefined) {
      this.mark.removeFrom(this.map!);
      this.mark = undefined;
    }
  }
}

//export const getMarkers = (): Leaflet.Marker[] => {
//  return [
//    //new Leaflet.Marker(new Leaflet.LatLng(43.5121264, 16.4700729), {
//    //  icon: new Leaflet.Icon({
//    //    iconSize: [50, 41],
//    //    iconAnchor: [13, 41],
//    //    iconUrl: 'assets/blue-marker.svg',
//    //  }),
//    //  title: 'Workspace'
//    //} as Leaflet.MarkerOptions),
//    //new Leaflet.Marker(new Leaflet.LatLng(43.5074826, 16.4390046), {
//    //  icon: new Leaflet.Icon({
//    //    iconSize: [50, 41],
//    //    iconAnchor: [13, 41],
//    //    iconUrl: 'assets/red-marker.svg',
//    //  }),
//    //  title: 'Riva'
//    //} as Leaflet.MarkerOptions),
//  ] as Leaflet.Marker[];
//};

//export const getRoutes = (): Leaflet.Polyline[] => {
//  return [
//    new Leaflet.Polyline([
//      //new Leaflet.LatLng(43.5121264, 16.4700729),
//      //new Leaflet.LatLng(43.5074826, 16.4390046),
//    ] as Leaflet.LatLng[], {
//      color: '#0d9148'
//    } as Leaflet.PolylineOptions)
//  ] as Leaflet.Polyline[];
//};

//export const getLayers = (): Leaflet.Layer[] => {
//  return [
//    // Basic style
//    new Leaflet.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//      attribution: '&copy; OpenStreetMap contributors'
//    } as Leaflet.TileLayerOptions),
//    // Pastel style, remove if you want basic style. Uncomment if you want pastel style.

//    // new Leaflet.TileLayer('https://api.maptiler.com/maps/pastel/{z}/{x}/{y}.png?key={your_key}', {
//    //   attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>',
//    // } as Leaflet.TileLayerOptions),
//    ...getMarkers(),
//    ...getRoutes(),
//    ...getPolygons()
//  ] as Leaflet.Layer[];
//};

//export const getPolygons = (): Leaflet.Polygon[] => {
//  return [
//    new Leaflet.Polygon([
//      //new Leaflet.LatLng(43.5181349, 16.4537963),
//      //new Leaflet.LatLng(43.517890, 16.439939),
//      //new Leaflet.LatLng(43.515599, 16.446556),
//      //new Leaflet.LatLng(43.518025, 16.463492)
//    ] as Leaflet.LatLng[],
//      {
//        fillColor: '#eb530d',
//        color: '#eb780d'
//      } as Leaflet.PolylineOptions)
//  ] as Leaflet.Polygon[];
//};

