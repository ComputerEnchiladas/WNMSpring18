import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Http } from '@angular/http';
import { AppSocketService } from "../../app/app.socket.service";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  public curTemp;
  public setTemp;
  public setMargin;
  private host = 'http://127.0.0.1:6085';
  constructor(public navCtrl: NavController, private http: Http,
              private app: AppSocketService) {
    app.on().subscribe( (val) => {
      switch( val['event'] ) {
        case 'event:temp':
          this.curTemp = val['value'];
          break;
        case 'event:target':
          this.setTemp = val['value'];
          break;
        case 'event:margin':
          this.setMargin = val['value'];
          break;
      }
    })
  }
  onTempChanged(){
    this.http.post(this.host + '/setting', {targetTemp: this.setTemp}).toPromise().then( res => {})
  }

  onMarginChanged(){
    this.http.post(this.host + '/setting', {marginTempControl: this.setMargin}).toPromise().then( res => {})
  }
}
