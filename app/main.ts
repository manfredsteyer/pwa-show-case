import {bootstrap}    from '@angular/platform-browser-dynamic';
import {HTTP_PROVIDERS} from '@angular/http';
import {FlightSearchComponent} from './flightsearch.component';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';


var service = [
    HTTP_PROVIDERS
];

bootstrap(FlightSearchComponent, service);
