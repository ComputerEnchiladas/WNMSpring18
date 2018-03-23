import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { AppSocketService } from "../../app/app.socket.service";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    public curTemp;
    private host = 'http://127.0.0.1:6085'; // NETWORK IP+PORT <OR> DOMAIN NAME
    constructor(public navCtrl: NavController, private http: Http, private app: AppSocketService) {
        app.on().subscribe( (val) => {
            switch( val['event'] ) {
                case 'event:temp':
                    this.curTemp = val['value'];
                    break;
            }
        });
    }
}