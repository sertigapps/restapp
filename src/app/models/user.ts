export class User {
  emailaddress: string;
  token: string;
  name:string;
  lastname:string;
  full_record:any;
 
  constructor(name: string,lastname:string,token:string, emailaddress: string,full_record:any) {
    this.name = name;
    this.token = token;
    this.lastname = lastname;
    this.emailaddress = emailaddress;
    this.full_record = full_record;
  }
}