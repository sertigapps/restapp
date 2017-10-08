import { Http, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs'
import 'rxjs/add/operator/map';
export class User {
  emailaddress: string;
  token: string;
  name:string;
  lastname:string;
  full_record:any;
  base_record:any;
 
  constructor(name: string,lastname:string,token:string, emailaddress: string,full_record:any,public http:Http) {
    this.name = name;
    this.token = token;
    this.lastname = lastname;
    this.emailaddress = emailaddress;
    if(this.full_record){
      this.full_record.password = '';
    }
    this.full_record = full_record;
    this.base_record = JSON.parse(JSON.stringify(full_record));
  }
  save(emailaddress,token){
    if(this.full_record.id===0){
    let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let options = new RequestOptions({ headers: headers });
      headers.append('sertig_token',token.toString());
      headers.append('sertig_email',emailaddress.toString());
      Object.keys(this.full_record).forEach(attr=>{
        if( this.full_record[attr]==[] || this.full_record[attr] =="" || this.full_record[attr]==[""] ){
          delete this.full_record[attr];
        }
      });
      let data = {item:this.full_record};
    return this.http.post('https://nopmb791la.execute-api.us-east-1.amazonaws.com/devapp/person', JSON.stringify(data), options)
    .map(res => res.json());
    }
    else{
      var attr_to_change = {};
      var counter = 0;
      Object.keys(this.full_record).forEach(attr=>{
        if(this.full_record[attr]!==this.base_record[attr] && (this.full_record[attr]!=[] && this.full_record[attr] !="" && this.full_record[attr]!=[""] )){
          attr_to_change[attr]=this.full_record[attr];
          counter++;
        }
      });
      Object.keys(this.full_record).forEach(attr=>{
        if(this.full_record[attr]!==this.base_record[attr]){
          attr_to_change[attr]=this.full_record[attr];
          counter++;
        }
      });
      if(counter){
          let headers = new Headers();
          headers.append('Content-Type', 'application/json');
          let options = new RequestOptions({ headers: headers });
          headers.append('sertig_token',token.toString());
          headers.append('sertig_email',emailaddress.toString());
        return this.http.put('https://nopmb791la.execute-api.us-east-1.amazonaws.com/devapp/person/id/'+this.full_record.id, JSON.stringify(attr_to_change), options)
        .map(res => res.json());
      }
      else{
        return Observable.of({}).delay(500);
      }
    }
  }
  delete(emailaddress,token){
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        headers.append('sertig_token',token.toString());
        headers.append('sertig_email',emailaddress.toString());
            return this.http.delete('https://nopmb791la.execute-api.us-east-1.amazonaws.com/devapp/category/id/'+this.full_record.id,  options)
            .map(res => res.json());
  }
}