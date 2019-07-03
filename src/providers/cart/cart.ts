import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Order } from '../../app/models/order';
import { Observable } from 'rxjs'
import { Account } from '../../app/models/account';
import 'rxjs/add/operator/map';

/*
  Generated class for the CartProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class CartProvider {
  private url='https://nopmb791la.execute-api.us-east-1.amazonaws.com/devapp/';
  myorders: Array<Order> = [];
  orders_indexed:any={};
  orders: Array<Order> = [];
  my_new_orders:number;
  loaded_prev:boolean;
  new_orders:number=0;
  last_loaded:number;
  accounts: Array<any> = [];
  local_orders: Array<any> = [];
  
  constructor(public http: Http) {
    console.log('Hello CartProvider Provider');
    
  }
  getAccounts(){
    this.http.get(this.url + 'query/other/type/account/EQ/status_code/1/EQ')
      .map(res => res.json()).subscribe(data => {
        console.log(data);
        data.forEach(c => {
          this.accounts.push(new Account(c.id, c.name, c, this.http));
        });
        this.http.get(this.url + 'query/order/status_code/3/EQ/create_date/0/GT')
          .map(res => res.json()).subscribe(data => {
            data.forEach(c => {
              this.local_orders.push(new Order(c.id, c.emailaddress, c.personid, c.create_date, c.total, c, this.http));
            });
            this.calculate_total_locals();
          });
      });
  }
  calculate_total_locals(){
    this.accounts.forEach((acc)=>{
      var total = 0;
      this.local_orders.filter((ord)=>{
        return acc.id == ord.full_record.account_id;
      })
      .forEach((ord)=>{
        total+= parseInt(ord.total);
      });
      acc.full_record.total = total;
    });

  }
  add_order(data,notify){
    if(notify){
      this.myorders.push(new Order(data.id,data.emailaddress,data.personid,data.create_date,data.total,data,this.http));
      this.my_new_orders = this.myorders.filter((o)=>{return o.full_record.status_code == 1 }).length;
    }
    else{
      this.local_orders.push(new Order(data.id, data.emailaddress, data.personid, data.create_date, data.total, data, this.http));
      this.calculate_total_locals();
    }
  }
  get_user_orders(emailaddress){
    return this.http.get(this.url+'query/order/emailaddress/'+emailaddress+'/EQ/status_code/0/GT')
    .map(res => res.json());
  }
  fetch_my_orders(emailaddress){
    this.http.get(this.url+'query/order/emailaddress/'+emailaddress+'/EQ/status_code/1/EQ')
    .map(res => res.json()).subscribe(data=>{
      data.forEach(c=>{
        this.myorders.push(new Order(c.id,c.emailaddress,c.personid,c.create_date,c.total,c,this.http));
        this.orders_indexed[c.id]=true;
      });
      this.my_new_orders = this.myorders.filter((o)=>{return o.full_record.stage < 4 }).length;
      this.myorders.sort((a,b)=>{
        return a.create_date - b.create_date;
      });
    });
  }
  fetch_my_prev_orders(emailaddress){
    this.http.get(this.url+'query/order/emailaddress/'+emailaddress+'/EQ/status_code/2/EQ')
    .map(res => res.json()).subscribe(data=>{
      this.myorders =this.myorders.filter((o)=>{return o.full_record.status_code == 1 });
      data.forEach(c=>{
        this.myorders.push(new Order(c.id,c.emailaddress,c.personid,c.create_date,c.total,c,this.http));
        this.orders_indexed[c.id]=true;
      });
      this.my_new_orders = this.myorders.filter((o)=>{return o.full_record.stage < 4 }).length;
      this.myorders.sort((a,b)=>{
        return a.create_date - b.create_date;
      });
      this.loaded_prev = true;
    });
  }
  refresh_my_orders(emailaddress){
    this.http.get(this.url+'query/order/emailaddress/'+emailaddress+'/EQ/status_code/1/EQ')
    .map(res => res.json()).subscribe(data=>{
      this.myorders =this.myorders.filter((o)=>{return o.full_record.status_code == 2 });
      data.forEach(c=>{
        this.myorders.push(new Order(c.id,c.emailaddress,c.personid,c.create_date,c.total,c,this.http));
        this.orders_indexed[c.id]=true;
      });
      this.my_new_orders = this.myorders.filter((o)=>{return o.full_record.stage < 4 }).length;
      this.myorders.sort((a,b)=>{
        return a.create_date - b.create_date;
      });
    });
  }
  update_counters(){
    this.new_orders = this.orders.filter((o)=>{return o.full_record.stage <4 }).length;
    this.my_new_orders = this.myorders.filter((o)=>{return o.full_record.stage < 4 }).length;
  }
  fetch_new_orders(){
    this.new_orders = 0;
    this.orders = [];
    this.last_loaded = (new Date()).getTime();
    this.http.get(this.url+'query/order/status_code/1/EQ/create_date/0/GT')
    .map(res => res.json()).subscribe(data=>{
      data.forEach(c=>{
        this.orders.push(new Order(c.id,c.emailaddress,c.personid,c.create_date,c.total,c,this.http));
      });
      this.new_orders = this.orders.filter((o)=>{return o.full_record.stage <4 }).length;
    });
    this.orders.sort((a,b)=>{
      return a.create_date - b.create_date;
    });
  }
  
  fetch_more_orders(){
    this.orders =[];
    this.last_loaded = (new Date()).getTime()-36000;
    return this.http.get(this.url+'query/order/status_code/1/EQ/create_date/0/GT')
    .map(res => res.json())
  }
  place_order_request(order,emailaddress,token){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    headers.append('sertig_token',token.toString());
    headers.append('sertig_email',emailaddress.toString());
    let data = {item:order};
  return this.http.post('https://nopmb791la.execute-api.us-east-1.amazonaws.com/devapp/order', JSON.stringify(data), options).map(res => res.json());
  }
  notify_new_order(emailaddress,notify){
    if(notify){
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'key=AAAA-F4-g_k:APA91bFxDbleSkpYhZvEuk5jsI3SHZkoblFBQNHVDEkAWK_a_ReKiiJ4_ogiHkzUsoSXtNxLRtvlkkzpNFuGG1zZ1p-u9bbSI-LzUOCy3DI4bGI-wLzAwIgoL8dWkd_JpwpG1ET_uM_V');
      let options = new RequestOptions({ headers: headers });
      let data = {
        "to": "/topics/neworder",
        "priority" : "high",
        "data": {
          "message": "Nueva Orden Recibida",
          "note_type": "New Order Received",
          "emailaddress": emailaddress
        },
        "notification" : {
          "body" : "Nueva Orden Recibida",
          "title" : "Nueva Orden Recibida",
          "icon" : "new"
        }
      };
    return this.http.post('https://fcm.googleapis.com/fcm/send', JSON.stringify(data), options).map(res => res.json());
  }
  else{
      return Observable.of({}).delay(500);
  }
  }
  fetch_report_orders(start_date,end_date){
    let start = (new Date(start_date.split('T')[0]+' 00:00:00')).getTime();
    let end = (new Date(end_date.split('T')[0]+' 23:59:00')).getTime();
    return this.http.get(this.url+'query/order/status_code/2/EQ/create_date/'+start+','+end+'/BT')
    .map(res => res.json());
  }
  updateaccount(id:number,attributes:any){
    this.accounts = this.accounts.filter(acc => {
      return acc.id != id;
    })
    this.accounts.push(new Account(id, attributes.name, attributes, this.http));
  }
}
