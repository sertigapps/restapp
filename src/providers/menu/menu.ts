import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Category } from '../../app/models/category';
import { SubCategory } from '../../app/models/subcategory';
import { Item } from '../../app/models/item';
import { Ingredient } from '../../app/models/ingredient';
import { Post } from '../../app/models/post';
import 'rxjs/add/operator/map';

@Injectable()
export class MenuProvider {
  private url='https://nopmb791la.execute-api.us-east-1.amazonaws.com/devapp/';
  categories : Array<Category> = [];
  sub_categories : Array<SubCategory> = [];
  items : Array<Item> = [];
  menus : Array<Item> = [];
  ingredients : Array<Ingredient> = [];
  posts : Array<Post> = [];
  constructor(public http: Http) {
    console.log('Hello MenuProvider Provider');
    this.http.get(this.url+'query/category/status_code/1/EQ')
    .map(res => res.json()).subscribe(data=>{
      data.forEach(c=>{
        this.categories.push(new Category(c.id,c.name,c,this.http));
      });
      this.ordercategories();
    });
    this.http.get(this.url+'query/subcategory/status_code/1/EQ')
    .map(res => res.json()).subscribe(data=>{
      data.forEach(c=>{
        this.sub_categories.push(new SubCategory(c.id,c.category_id,c.name,c,this.http));
      });
      this.orderscategories();
    });
    this.http.get(this.url+'query/item/status_code/1/EQ')
    .map(res => res.json()).subscribe(data=>{
      data.forEach(c=>{
        if(c.menu_flag && c.menu_flag==1){
          this.menus.push(new Item(c.id,c.category_id,c.name,c,this.http));
        }
        else{
          this.items.push(new Item(c.id,c.category_id,c.name,c,this.http));
        }
      });
    });
    this.http.get(this.url+'query/other/type/ingredient/EQ/status_code/1/EQ')
    .map(res => res.json()).subscribe(data=>{
      data.forEach(c=>{
          this.ingredients.push(new Ingredient(c.id,c.name,c,this.http));
      });
      this.orderingredients();
    });
    this.http.get(this.url+'query/other/type/post/EQ/status_code/1/EQ')
    .map(res => res.json()).subscribe(data=>{
      data.forEach(c=>{
        this.posts.push(new Post(c.id,c.title,c,this.http));
      });
      this.posts = this.posts.filter(function(item){
        var valid = true;
        if(item.full_record.offer && item.full_record.days && item.full_record.days.indexOf((new Date()).getDay().toString()) < 0){
          valid = false;
        }
        return valid; 
      });
      this.posts.sort((a,b)=>{
        return a.full_record.create_date - b.full_record.create_date;
      })
    });
  }
  ordercategories(){
    this.categories.sort((a,b)=>{
      return a.full_record.order -b.full_record.order;
    })
  }
  orderscategories(){
    this.sub_categories.sort((a,b)=>{
      return a.full_record.order -b.full_record.order;
    })
  }
  orderingredients(){
    this.ingredients.sort((a,b)=>{
      return a.full_record.order -b.full_record.order;
    })
  }
  getitem(id_name,splitted?){
    var to_return : Item;
    var id = id_name.split(',')[0];
    this.items.forEach((i)=>{
      if(i.id==id){
        let id_new = (splitted)?i.id+splitted.toString():i.id;
        to_return = new Item(id_new,i.category_id,i.name,i.full_record,this.http);
      }
    });
    this.menus.forEach((i)=>{
      if(i.id==id){
        let id_new = (splitted)?i.id+splitted.toString():i.id;
        to_return = new Item(id_new,i.category_id,i.name,i.full_record,this.http);
      }
    });
    return to_return;
  }
  getingredient(id_name){
    var to_return : Ingredient;
    var id = id_name.split(',')[0];
    this.ingredients.forEach((i)=>{
      if(i.id==id){
        to_return = new Ingredient(i.id,i.name,i.full_record,this.http);
      }
    });
    return to_return;
  }
  getcat(id_name){
    var to_return : Ingredient;
    var id = id_name.split(',')[0];
    this.categories.forEach((i)=>{
      if(i.id==id){
        to_return = new Ingredient(i.id,i.name,i.full_record,this.http);
      }
    });
    return to_return;
  }
  insertcategory(category:Category){
    this.categories.push(category);
    this.ordercategories();
  }
  insertscategory(scategory:SubCategory){
    this.sub_categories.push(scategory);
    this.orderscategories();
  }
  updatecategory(id,attributes){
    this.categories = this.categories.filter(cat=>{
      return cat.id!=id;
    })
    this.categories.push(new Category(id,attributes.name,attributes,this.http));
    this.ordercategories();
  }
  updatesubcategory(id,attributes){
    this.sub_categories = this.sub_categories.filter(cat=>{
      return cat.id!=id;
    })
    this.sub_categories.push(new SubCategory(id,attributes.category_id,attributes.name,attributes,this.http));
    this.orderscategories();
  }
  updateitem(id,attributes){
    if(attributes.menu_flag && attributes.menu_flag ==1){
      this.menus = this.menus.filter(cat=>{
        return cat.id!=id;
      })
      this.menus.push(new Item(id,attributes.category_id,attributes.name,attributes,this.http));
    }
    else{
      this.items = this.items.filter(cat=>{
        return cat.id!=id;
      })
      this.items.push(new Item(id,attributes.category_id,attributes.name,attributes,this.http));
    }
  }
  updateingredient(id,attributes){
    this.ingredients = this.ingredients.filter(ing=>{
      return ing.id!=id;
    })
    this.ingredients.push(new Ingredient(id,attributes.name,attributes,this.http));
    this.orderingredients();
  }
  updatepost(id,attributes){
    this.posts = this.posts.filter(p=>{
      return p.id!=id;
    })
    this.posts.push(new Post(id,attributes.title,attributes,this.http));
  }
  deletecategory(cat,emailaddress,token){
    cat.delete(emailaddress,token).subscribe(data=>{
    });
    this.categories = this.categories.filter(category=>{
      return category.id!=cat.id;
    });
    this.sub_categories = this.sub_categories.filter(sub_cat=>{
      if(cat.id==sub_cat.category_id){
        sub_cat.delete(emailaddress,token).subscribe(data=>{
      });
      }
      return cat.id!=sub_cat.category_id
    })
  }
  deletesubcategory(scat,emailaddress,token){
    scat.delete(emailaddress,token).subscribe(data=>{
    });
    this.sub_categories = this.sub_categories.filter(scategory=>{
      return scategory.id!=scat.id;
    }); 
    this.orderscategories();
  }
  deleteitem(item,emailaddress,token){
    item.delete(emailaddress,token).subscribe(data=>{
    });
    this.items = this.items.filter(i=>{
      return i.id!=item.id;
    }); 
  }
  deletemenu(item,emailaddress,token){
    item.delete(emailaddress,token).subscribe(data=>{
    });
    this.menus = this.menus.filter(i=>{
      return i.id!=item.id;
    }); 
  }
  deleteingredient(ing,emailaddress,token){
    ing.delete(emailaddress,token).subscribe(data=>{
    });
    this.ingredients = this.ingredients.filter(i=>{
      return i.id!=ing.id;
    }); 
  }
  deletepost(post,emailaddress,token){
    post.delete(emailaddress,token).subscribe(data=>{
    });
    this.posts = this.posts.filter(p=>{
      return p.id!=post.id;
    }); 
  }
}
