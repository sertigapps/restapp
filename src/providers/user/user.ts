import { Injectable } from '@angular/core';
import { Http,RequestOptions,Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { User } from '../../app/models/User' ;

/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UserProvider {
  private url='https://nopmb791la.execute-api.us-east-1.amazonaws.com/devapp/';
  public user:User;
  public newusers: Array<User> = [];
  public token:String;
  public language:any;
  public emailaddress:String;
  constructor(public http: Http) {
    console.log('Hello UserProvider Provider');
    //this.load_new_users();
  }
  public logged_in(name,lastname,token,emailaddress,full){
    this.token = token;
    this.emailaddress = emailaddress
    this.language = 'es';
    if(full.language){
      this.language = full.language;
    }
    full.password = '';
    this.user = new User(name,lastname,token,emailaddress,full,this.http);
  }
  load_new_users(){
    this.newusers = [];
    this.http.get(this.url+'query/person/status_code/1/EQ')
    .map(res => res.json()).subscribe(data=>{
      data.forEach(c=>{
        this.newusers.push(new User(c.name,c.lastname,'',c.emailaddress,c,this.http));
      })
    });
  }
  get_store_settings(){
    this.newusers = [];
    return this.http.get(this.url+'/atomic_id/table/store_availability')
    .map(res => res.json())
  }
  get_store_about_us(){
    this.newusers = [];
    return this.http.get(this.url+'/atomic_id/table/store_about_us')
    .map(res => res.json())
  }
  switch_order_availability(value){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    headers.append('sertig_token',this.token.toString());
    headers.append('sertig_email',this.emailaddress.toString());
  return this.http.put('https://nopmb791la.execute-api.us-east-1.amazonaws.com/devapp/atomic_id/table/store_availability', JSON.stringify({orders_available:value}), options)
  .map(res => res.json());
  }

  approve_user(user){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    headers.append('sertig_token',this.token.toString());
    headers.append('sertig_email',this.emailaddress.toString());
  this.http.put('https://nopmb791la.execute-api.us-east-1.amazonaws.com/devapp/person/id/'+user.full_record.id, JSON.stringify({"status_code":2}), options)
  .map(res => res.json()).subscribe((data)=>{
    this.newusers = this.newusers.filter((u)=>{
      return u.full_record.id !=user.full_record.id;
    });
  },(error)=>{
    console.log('Error approving user');
  });
    
  }
  block_user(emailaddress,id){
    this.http.get(this.url+'query/person_token/emailaddress/'+this.emailaddress+'/EQ/status_code/1/EQ')
    .map(res => res.json()).subscribe((data)=>{
      data.forEach((i)=>{
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        headers.append('sertig_token',this.token.toString());
        headers.append('sertig_email',this.emailaddress.toString());
        let put_data= {"status_code":-1};
      this.http.put('https://nopmb791la.execute-api.us-east-1.amazonaws.com/devapp/person_token/emailaddress/'+i.emailaddress+'/token/'+i.token
      , JSON.stringify(put_data), options).map(res => res.json()).subscribe((j)=>{
        console.log('Deleted token');
      })
      });
    });
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    headers.append('sertig_token',this.token.toString());
    headers.append('sertig_email',this.emailaddress.toString());
    let put_data= {"status_code":3};
  return this.http.put('https://nopmb791la.execute-api.us-east-1.amazonaws.com/devapp/person/id/'+id
  , JSON.stringify(put_data), options).map(res => res.json());
  }
}
