import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Http, URLSearchParams, Headers} from '@angular/http';
import { Booking} from './booking';
import { BookingsDoc} from './bookings-doc';
import { BookingService} from './booking.service';
import { BookingStatusPipe} from './booking-status.pipe';

import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar';
import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';
import { MD_LIST_DIRECTIVES } from '@angular2-material/list';
import { MD_ICON_DIRECTIVES, MdIconRegistry} from '@angular2-material/icon';


const APP_MD_DIRECTIVES = [
    MD_CARD_DIRECTIVES,
    MD_BUTTON_DIRECTIVES,
    MD_TOOLBAR_DIRECTIVES,
    MD_SIDENAV_DIRECTIVES,
    MD_LIST_DIRECTIVES,
    MD_ICON_DIRECTIVES
];

@Component({
    selector: 'flight-search', // <my-app></my-app>
    templateUrl: 'app/flightsearch.component.html',
    styleUrls: ['app/flightsearch.component.css', 'node_modules/bootstrap/dist/css/bootstrap.css'],
    directives: [APP_MD_DIRECTIVES],
    providers: [BookingService, MdIconRegistry],
    pipes: [BookingStatusPipe]
})
export class FlightSearchComponent implements OnInit {
    
    public bookings: Array<Booking> = [];
    
    constructor(
        private changeDetectionRef: ChangeDetectorRef,
        private bookingervice: BookingService) {
    }
    
    ngOnInit() {
        this.setupPushNotifications();
        this.syncData();
    }
    
    syncData() {
        let hasPendingRequest = true;
        let that = this;

        this.bookingervice.sync().then((b: Booking[]) => {
            hasPendingRequest = false;
            that.bookings = b;        
            that.changeDetectionRef.detectChanges();
        });
        
        this.bookingervice.fetchLocal().then((b: BookingsDoc) => {
            if (!hasPendingRequest) return;
            if (!b) return;
            that.bookings = b.bookings;
            that.changeDetectionRef.detectChanges();
        });
        
    }
    
    requestUpload() {
        
        let nav:any = navigator;
        
        if ('serviceWorker' in nav && 'SyncManager' in window) {
            nav.serviceWorker
                .ready
                .then(reg => {
                    return reg.sync.register('upload');   
                })
                .catch(_ => {
                    return this.bookingervice.upload();   
                });
        } 
        else {
            this.bookingervice.upload();            
        }
        
    }

    setupPushNotifications() {

        let nav:any = navigator;

        if ('serviceWorker' in navigator) {
            console.log('Service Worker is supported');
            nav.serviceWorker.ready.then(function(reg) {
                reg.pushManager.subscribe({
                    userVisibleOnly: true
                }).then(function(sub) {
                    console.log('endpoint:', sub.endpoint);
                });
            }).catch(function(error) {
                console.log('Error:', error);
            });
        }
    
    }
    
    checkin(b: Booking) {
        b.buchungsStatus = 1;
        b.isDirty = true;
        this.bookingervice.save(this.bookings);
        this.requestUpload();
    }

    boarding(b: Booking) {
        b.buchungsStatus = 2;
        b.isDirty = true;
        this.bookingervice.save(this.bookings);
        this.requestUpload();
    }

    booked(b: Booking) {
        b.buchungsStatus = 0;
        b.isDirty = true;
        this.bookingervice.save(this.bookings);
        this.requestUpload();
    }
    
}