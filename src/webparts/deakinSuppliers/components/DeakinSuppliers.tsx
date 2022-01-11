import * as React from "react";
import styles from "./DeakinSuppliers.module.scss";
import { IDeakinSuppliersProps } from "./IDeakinSuppliersProps";
import "@pnp/sp/webs";

interface IDeakinSuppliersState {
  listItems: any;
  supplierTypeOnDisplay: any[];
  supplierDetails: any;
}

export default class DeakinSuppliers extends React.Component<
  IDeakinSuppliersProps,
  IDeakinSuppliersState
> {
  constructor(props) {
    super(props);
    this.state = {
      listItems: this.props.listItems,
      supplierTypeOnDisplay: [],
      supplierDetails: "",
    };
  }

  public render(): React.ReactElement<IDeakinSuppliersProps> {
    return (
      <div
        className={styles.row}
        style={{ border: "1px solid rgba(234, 234, 234, 0.78)" }}
      >
        <div className={styles.supplierList}>Supplier List</div>

        <div className={styles.row}>
          <div className={styles.column} style={{ maxWidth: "20%" }}>
            <div className={styles.deakinSuppliers}>
              {Object.keys(this.props.listItems).map((x) => (
                <span
                  className={styles.supplierTypes}
                  onClick={() => {
                    this.supplierTypeSelected(this.state.listItems[x]);
                  }}
                >
                  {x}
                </span>
              ))}
            </div>
          </div>
          <div
            className={styles.column}
            style={{ height: "650px", paddingLeft: "20px" }}
          >
            <div className={styles.row + " " + styles.headings}>
              Market Vendors
            </div>
            <div className={styles.supplierSelection}>
              <div
                className={styles.row + " " + styles.vendorRow}
                style={{ backgroundColor: "rgba(234, 234, 234, 0.78)" }}
              >
                <div
                  className={styles.column}
                  style={{
                    borderRight: "1px solid rgba(234, 234, 234, 0.78)",
                    marginRight: "10px",
                    borderRadius: "2px",
                    paddingLeft: "2px",
                  }}
                  onClick={() => {
                    // this.renderSupplierDetails(x);
                  }}
                >
                  Name
                </div>
                <div
                  className={styles.column}
                  onClick={() => {
                    this.sortFunction();
                  }}
                >
                  Location
                </div>
              </div>

              {this.state.supplierTypeOnDisplay.map((x) => x)}
            </div>
            <div
              className={styles.row + " " + styles.headings}
              style={{ height: "22px" }}
            >
              Supplier Details
            </div>
            <div className={styles.supplierDetails}>
              {this.state.supplierDetails}
            </div>
          </div>
        </div>
      </div>
    );
  }

  public sortFunction() {
    this.setState({
      supplierTypeOnDisplay: this.state.supplierTypeOnDisplay.reverse(),
    });
  }

  public supplierTypeSelected(items) {
    const sortedItems = items.sort(
      (a, b) =>
        a.field_Location && a.field_Location.localeCompare(b.field_Location)
    );

    const supplierItems = sortedItems.map((x) => {
      return (
        <div className={styles.row + " " + styles.vendorRow}>
          <div
            className={styles.column}
            style={{
              borderRight: "1px solid rgba(234, 234, 234, 0.78)",
              marginRight: "10px",
              borderRadius: "2px",
              paddingLeft: "2px",
            }}
            onClick={() => {
              this.renderSupplierDetails(x);
            }}
          >
            {(x.Title && x.Title.replace(/[^A-Za-z:0-9./@ ]/g, "")) || "-"}
          </div>
          <div className={styles.column}>
            {(x.field_Location &&
              x.field_Location.replace(/[^A-Za-z:0-9./@ ]/g, "")) ||
              "-"}
          </div>
        </div>
      );
    });
    this.setState({
      supplierTypeOnDisplay: supplierItems,
    });
  }

  public renderSupplierDetails(details) {
    const {
      Title,
      field_Contact_x0020_name,
      field_Email,
      field_Location,
      field_Notes,
      field_Phone,
      field_Supplier_x0020_type,
      field_Website,
    } = details;

    const cardDetails = (
      <div className={styles.detailsRow}>
        <div className={styles.column}>
          {this.cardFieldRow("Supplier name", Title)}
          {this.cardFieldRow("Location", field_Location)}
          {this.cardFieldRow("Contact Name", field_Contact_x0020_name)}
          {this.cardFieldRow("Notes", field_Notes)}
        </div>
        <div className={styles.column}>
          {this.cardFieldRow("Phone", field_Phone)}
          {this.cardFieldRow("Email", field_Email)}
          {this.cardFieldRow("Website", field_Website)}
        </div>
      </div>
    );
    this.setState({
      supplierDetails: cardDetails,
    });
  }
  public cardFieldRow(TitleText, ItemText) {
    return (
      <div className={styles.row}>
        <span
          className={styles.row + " " + styles.detailsTitle}
          style={{
            paddingTop: "3px",
            textDecoration: "underline",
            textDecorationThickness: "0.1px",
            textUnderlineOffset: "0.5px",
          }}
        >{`${TitleText}:`}</span>
        <span className={styles.row}>
          {(ItemText && ItemText.replace(/[^A-Za-z:0-9./@ ]/g, "")) || "-"}
        </span>
      </div>
    );
  }
}
