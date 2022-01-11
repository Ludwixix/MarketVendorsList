import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "DeakinSuppliersWebPartStrings";
import DeakinSuppliers from "./components/DeakinSuppliers";
import { IDeakinSuppliersProps } from "./components/IDeakinSuppliersProps";
import { sp, Lists, ILists } from "@pnp/sp/presets/all";

export interface IDeakinSuppliersWebPartProps {
  description: string;
  listItems: any;
}

export default class DeakinSuppliersWebPart extends BaseClientSideWebPart<IDeakinSuppliersWebPartProps> {
  public onInit(): Promise<void> {
    return super.onInit().then((_) => {
      sp.setup({
        spfxContext: this.context,
      });
    });
  }

  // get list items and extract desired properties
  public async getListItems() {
    const items: any[] = await sp.web.lists
      .getByTitle("Preferred Suppliers")
      .items.get();
    const cleanedItems = items.map((item) => {
      const {
        Title,
        field_Contact_x0020_name,
        field_Email,
        field_Location,
        field_Notes,
        field_Phone,
        field_Supplier_x0020_type,
        field_Website,
      } = item;
      return {
        Title,
        field_Contact_x0020_name,
        field_Email,
        field_Location,
        field_Notes,
        field_Phone,
        field_Supplier_x0020_type,
        field_Website,
      };
    });

    // get all supplier types and remove duplicates
    const supplierTypes = [
      ...new Set(cleanedItems.map((item) => item.field_Supplier_x0020_type)),
    ];

    // create supplier types object arrayd to push children to (going to use the supplier type as the key)
    let suppliers = {};
    supplierTypes.map((x) => {
      {
        suppliers[x] = [];
      }
    });

    //push items to supplier type
    cleanedItems.forEach((supplier) => {
      suppliers[supplier.field_Supplier_x0020_type].push(supplier);
    });

    return suppliers;
  }

  public async render(): Promise<void> {
    const element: React.ReactElement<IDeakinSuppliersProps> =
      React.createElement(DeakinSuppliers, {
        description: this.properties.description,
        context: this.context,
        listItems: await this.getListItems(),
      });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
