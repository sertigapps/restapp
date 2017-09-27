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
  public emailaddress:String;
  constructor(public http: Http) {
    console.log('Hello UserProvider Provider');
    this.load_new_users();
  }
  public logged_in(name,lastname,token,emailaddress,full){
    this.token = token;
    this.emailaddress = emailaddress
    this.user = new User(name,lastname,token,emailaddress,full);
  }
  load_new_users(){
    this.newusers = [];
    this.http.get(this.url+'query/person/status_code/1/EQ')
    .map(res => res.json()).subscribe(data=>{
      data.forEach(c=>{
        this.newusers.push(new User(c.name,c.lastname,'',c.emailaddress,c));
      })
    });
  }
  approve_user(user){
    debugger;
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
}
