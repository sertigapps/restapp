import { Http, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs'
import 'rxjs/add/operator/map';

export class Order {
  id:number;
  private url='https://nopmb791la.execute-api.us-east-1.amazonaws.com/devapp/';
  emailaddress:number;
  personid:number;
  create_date:number;
  total:number;
  full_record:any;
  base_record:any;
  create_label:string;
  http:Http;
 
  constructor(id:number,emailaddress:number,personid: number,create_date: number,total: number, full_record:any, http:Http) {
    this.personid = personid;
    this.id = id;
    this.emailaddress = emailaddress;
    this.create_date = create_date;
    this.total=total;
    this.http=http;
    this.create_label = (new Date(create_date)).toLocaleString();
    this.full_record = full_record;
  }
  advance(emailaddress,token,estimated_time){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    headers.append('sertig_token',token.toString());
    headers.append('sertig_email',emailaddress.toString());
    let new_stage= this.full_record.stage+1;
    let put_data= {"stage":new_stage};
    if(new_stage==4){
      put_data['status_code']=2;
    }
    if(estimated_time!=''){
      put_data['estimated_time'] = estimated_time;
    }
  return this.http.put('https://nopmb791la.execute-api.us-east-1.amazonaws.com/devapp/order/id/'+this.id, JSON.stringify(put_data), options)
  .map(res => res.json());
  }
  fetch_record(){
    return this.http.get(this.url+'/order/id/'+this.id)
    .map(res => res.json());
  }
  cancel(emailaddress,token){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    headers.append('sertig_token',token.toString());
    headers.append('sertig_email',emailaddress.toString());
    this.full_record.stage =5;
    this.full_record.status_code =2;
    let put_data= {"stage":5};
      put_data['status_code']=2;
  return this.http.put('https://nopmb791la.execute-api.us-east-1.amazonaws.com/devapp/order/id/'+this.id, JSON.stringify(put_data), options)
  .map(res => res.json());
  }
  notify_update(estimated_time){
    this.http.get(this.url+'query/person_token/emailaddress/'+this.emailaddress+'/EQ/status_code/1/EQ')
    .map(res => res.json()).subscribe((data)=>{
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Authorization', 'key=AAAA-F4-g_k:APA91bFxDbleSkpYhZvEuk5jsI3SHZkoblFBQNHVDEkAWK_a_ReKiiJ4_ogiHkzUsoSXtNxLRtvlkkzpNFuGG1zZ1p-u9bbSI-LzUOCy3DI4bGI-wLzAwIgoL8dWkd_JpwpG1ET_uM_V');
      let options = new RequestOptions({ headers: headers });
      data.forEach(element => {
        if(element.notification && (element.platform =='android'||element.platform =='android')){
        let data_not = {
          "to": element.notification,
          "data": {
            "message": "Orden Actualizada",
            "note_type":"Order Updated",
            "order_id":this.id,
            "emailaddress": element.emailaddress,
            "new_status":this.full_record.stage+1,
            "estimated_time":estimated_time
           }
          }
          this.http.post('https://fcm.googleapis.com/fcm/send', JSON.stringify(data_not), options).map(res => res.json()).subscribe((data)=>{
            console.log('User Notified');
          });
        }
      });
    });
  }

}