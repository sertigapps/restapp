import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
@Injectable()
export class AuthServiceProvider {
  private url='https://nopmb791la.execute-api.us-east-1.amazonaws.com/devapp/';
   constructor( public http: Http) {
   }
  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        let data = credentials;
        return this.http.post(this.url+'auth/login', JSON.stringify(data), options)
        .map(res => res.json());
    }
  }
 
  public register(credentials) {
    if (credentials.emailaddress === null ||credentials.name === null ||credentials.lastname === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      let headers_n = new Headers();
      headers_n.append('Content-Type', 'application/json');
      headers_n.append('Authorization', 'key=AAAA-F4-g_k:APA91bFxDbleSkpYhZvEuk5jsI3SHZkoblFBQNHVDEkAWK_a_ReKiiJ4_ogiHkzUsoSXtNxLRtvlkkzpNFuGG1zZ1p-u9bbSI-LzUOCy3DI4bGI-wLzAwIgoL8dWkd_JpwpG1ET_uM_V');
      let options_n = new RequestOptions({ headers: headers_n });
      let data_n = {
        "to": "/topics/newuser",
        "priority" : "high",
        "data": {
          "message": "Nuevo Usuario",
          "note_type": "New User"
         },
         "notification" : {
          "body" : "Nuevo Usuario",
          "title" : "Nuevo Usuario",
          "icon" : "new"
        }
      };
      this.http.post('https://fcm.googleapis.com/fcm/send', JSON.stringify(data_n), options_n).map(res => res.json()).subscribe((a)=>{
        console.log('Admin Notified');
      });

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      let data = credentials;
    return this.http.post(this.url+'register', JSON.stringify(data), options)
    .map(res => res.json());
    }
  }

  public recover(credentials) {
    if (credentials.emailaddress === null ) {
      return Observable.throw("Please insert credentials");
    } else {
      credentials['app'] = 'La Barra App';
      let data = credentials;
    return this.http.post('http://34.195.122.172/upload/recover_request.php', JSON.stringify(data))
    .map(res => res.json());
    }
  }
 public logout(emailaddress:String, token:String) {
   let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('sertig_token',token.toString());
      headers.append('sertig_email',emailaddress.toString());
      let options = new RequestOptions({ headers: headers });
    return this.http.delete(this.url+'person_token/emailaddress/'+emailaddress+'/token/'+token, options)
    .map(res => res.json());
  }
}