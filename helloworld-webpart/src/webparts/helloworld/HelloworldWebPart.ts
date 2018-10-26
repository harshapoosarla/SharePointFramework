import { Version, Environment, EnvironmentType } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPComponentLoader } from '@microsoft/sp-loader'; 

import styles from './HelloworldWebPart.module.scss';
import * as strings from 'HelloworldWebPartStrings';
import {IHelloworldWebPartProps} from './HelloworldWebPartProps'
import { SPHttpClientResponse, SPHttpClient } from '@microsoft/sp-http';
import { SPListItem } from '@microsoft/sp-page-context';
import * as $ from "jquery"; 
//import "jquery";
require("bootstrap");


export default class HelloworldWebPart extends BaseClientSideWebPart<IHelloworldWebPartProps> {

  public render(): void {
    let cssURL = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";
    SPComponentLoader.loadCss(cssURL); 
    this.domElement.innerHTML = `
      <div class="${ styles.helloworld }">
        <div class="${ styles.container }">
          <div class="${ styles.row }" style="background-color:${escape(this.properties.color)};">
            <div class="${ styles.column }">
              <div class="form-group">
                <label for="usr">Name:</label>
                <input type="text" class="form-control" id="usr">
                
                <label for="usr">Gender:</label></br>
                <select class="form-control" id="genderDrop">
                <option >Male</option>
                <option >Female</option>
                </select> </br>
               
                <button type="button" class="btn btn-primary btn-sm">Submit</button>
              </div>
            </div>
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
     // this.eventhandlersss();
      this.getProducts();
   }
   
  //  eventhandlersss(){
     
  //   }
  //<span class="${ styles.title }">Welcome to SharePoint!</span>
  //<p class="${ styles.subTitle }">Customize SharePoint experiences using Web Parts.</p>
  //<p class="${ styles.description }">${escape(this.properties.description)}</p>
  //<p class="${ styles.description }">${escape(this.properties.color)}</p>
  //<a href="https://aka.ms/spfx" class="${ styles.button }">
  //<span class="${ styles.label }">Learn more</span>
  //</a>
  //style="background-color:${escape(this.properties.color)};

  public getListsInfo() {
    let html: string = '';
    if (Environment.type === EnvironmentType.Local) {
      this.domElement.querySelector('#lists').innerHTML = "Sorry this does not work in local workbench";
    } else {
    this.context.spHttpClient.get(
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