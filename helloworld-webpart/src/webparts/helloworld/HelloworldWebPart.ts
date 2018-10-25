import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './HelloworldWebPart.module.scss';
import * as strings from 'HelloworldWebPartStrings';
import {IHelloworldWebPartProps} from './HelloworldWebPartProps'
import { SPHttpClientResponse, SPHttpClient } from '@microsoft/sp-http';
import { SPListItem } from '@microsoft/sp-page-context';
import * as $ from "jquery"; 


export default class HelloworldWebPart extends BaseClientSideWebPart<IHelloworldWebPartProps> {

  public render(): void {
    this.domElement.innerHTML = `
      <div class="${ styles.helloworld }">
        <div class="${ styles.container }">
          <div class="${ styles.row }" style="background-color:${escape(this.properties.color)};">
            <div class="${ styles.column }">

            <p> Name:&nbsp&nbsp   <input type="text" name="name"><br></p>
            <p> Gender:
            <select>
            <option value="male">Male</option>
            <option value="female">Female</option>
            </select><br>
            </p>
            <p>
            <button id="savedata" type="button" style="margin:auto;display:block">Submit</button>
            </p>

            </div>
          </div>
        </div>
      </div>
     
      <div id="lists"></div>
      <div id="listitems" style="background-color:${escape(this.properties.color)};">
      Category:<select id="items">
      </select>
      
      </div>
      <div id="products" style="background-color:${escape(this.properties.color)};"></div>`;
      this.domElement.querySelector('#items').addEventListener('change',()=>this.getProducts());
      this.getListsInfo();
      this.getListItems();
      this.eventhandlersss();
      this.getProducts();
      //this.changed();
      //this.saveData();
   }
   
   eventhandlersss(){
     alert("asddas");
     
   //  document.getElementById('items').addEventListener('change',()=>this.getProducts());
   }
  //  public changed():void{
  //    $(document).ready(function(){
  //     alert("ready");
  //     $('#items').change(function(){
  //       alert("come");
  //       var selectedval=$(this);
  //       alert(selectedval);
  //     });
  //    });

  //  }
   //<span class="${ styles.title }">Welcome to SharePoint!</span>
   //<p class="${ styles.subTitle }">Customize SharePoint experiences using Web Parts.</p>
   //<p class="${ styles.description }">${escape(this.properties.description)}</p>
   //<p class="${ styles.description }">${escape(this.properties.color)}</p>
   //<a href="https://aka.ms/spfx" class="${ styles.button }">
   //<span class="${ styles.label }">Learn more</span>
   //</a>
//style="background-color:${escape(this.properties.color)};
  //public saveData(){
    //   alert("data saved to list");

  //}
  public getListsInfo() {
    let html: string = '';
    if (Environment.type === EnvironmentType.Local) {
      this.domElement.querySelector('#lists').innerHTML = "Sorry this does not work in local workbench";
    } else {
    this.context.spHttpClient.get
    (
      this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=Hidden eq false`, 
      SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        response.json().then((listsObjects: any) => {
          listsObjects.value.forEach(listObject => {
            html += `
                    <ul>
                        <li>
                            <span class="ms-font-l">${listObject.Title}</span>
                        </li>
                    </ul>`;
          });
          this.domElement.querySelector('#lists').innerHTML = html;
        });
      });        
    }
  }
  public getListItems() {
    let html: string = '';
    if (Environment.type === EnvironmentType.Local) {
      this.domElement.querySelector('#listitems').innerHTML = "Sorry this does not work in local workbench";
    } else {
    this.context.spHttpClient.get
    (
      this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getByTitle('Category')/items?$select=Title,ID`, 
      SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        response.json().then((items: any) => {
          items.value.forEach(SPListItem => {
            html += `<option value="${SPListItem.ID}">${SPListItem.Title}</option>`;
          });
          this.domElement.querySelector('#items').innerHTML = html;
        });
      });        
    }
  }
 public getProducts() {
  //if(Environment.type === EnvironmentType.Local){
    // this.domElement.querySelector('#productresult').innerHTML = `error occured in the web part`;
    // }else{
    // this.context.spHttpClient.get(
    // this.context.pageContext.web.absoluteUrl+"/_api/Web/Lists/getByTitle('Products')/items?$select=Title,ID&$filter=(Category/ID eq "+selectedValue+")", SPHttpClient.configurations.v1
    // ).then((Respons: SPHttpClientResponse)=>{
    // Respons.json().then((item : any)=>{
    // item.value.forEach(SPListItem =>{
    // categoryData += `
    // <ul>
    // <li>
    // <span class="ms-font-l">${SPListItem.Title}</span>
    // </li>
    // </ul>`;
    // });
    // this.domElement.querySelector('#productresult').innerHTML = categoryData;
    // });
    
    // });
    // } 
    alert("products displayed");
    var product= $('#items').val();
    alert("product"+product);
    let html: string = '';
    if (Environment.type === EnvironmentType.Local) {
      this.domElement.querySelector('#products').innerHTML = "Sorry this does not work in local workbench";
    } else {
    this.context.spHttpClient.get
    (
      this.context.pageContext.web.absoluteUrl + `/_api/web/lists/getByTitle('Products')/items?$select=Title, ID&$filter=(Category/ID eq `+product+`)`, 
      SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        response.json().then((items: any) => {
          items.value.forEach(SPListItem => {
            html += `
                    <ul>
                        <li>
                            <span class="ms-font-l">${SPListItem.Title}</span>
                        </li>
                    </ul>`;
          });
          this.domElement.querySelector('#products').innerHTML = html;
        });
      });        
    }
    
  }
  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneDropdown('color',{
                  label:"Drop Down",
                  selectedKey:"cyan",
                  options:[
                    {key: "red",text: 'Red'},
                    {key: "green",text: 'Green'},
                    {key: "blue",text: 'Blue'},
                    {key: "cyan",text: 'Cyan'}
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}