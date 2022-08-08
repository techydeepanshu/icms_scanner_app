import { POSAxios, WordpressAxios } from "./axios";
import Axios from "./axios";
const appendURL = process.env.NODE_ENV === "production" ? "/server" : "";

export class InventoryService {
  async GetProductDetails(productSKU) {
    const response = await WordpressAxios.get(`/products/`, {
      params: { sku: productSKU },
    });
    return response.data;
  }

  async UpdateProductDetails(productId, data) {
    const res = await WordpressAxios.put(`/products/${productId}`, data);
    return res.data;
  }
  async getAllProducts() {
    const res = await WordpressAxios.get("products");
    return res.data;
  }
  async createProduct(data) {
    const res = await WordpressAxios.post("products", data);
    return res.data;
  }

  async GetPOSProductDetails(upc, itemName = "") {
    const response = await Axios.get("http://65.1.117.32:5000" + "/api/getPOSProduct", {
      params: { upc, itemName },
    });
    return response.data;
  }
  async UpdatePOSProducts(data) {
    console.log(data);
    const res = await Axios.post(
      "http://65.1.117.32:5000" + "/api/pos/Product/ManageItem",
      data
    );
    return res.data;
  }
  async SyncInventory() {
    const res = await Axios.get("http://65.1.117.32:5000" + "/api/sync");
    console.log(res.data);
    return res.data;
  }
  async UpdateProductFields(data) {
    /**
     ***** data format
     * data = {invoiceName: "chetak", itemName:"CAS 123", value:{"Description": "jnckwc", "Price": "44"}}
     */
    //  console.log(data);
    const res = await Axios.put(
      "http://65.1.117.32:5000" + "/api/invoice/product/update",
      data
    );
    return res.data;
  }

  // added by Deepanshu
  async UpdateHandWrittenProductFields(data) {
    const res = await Axios.put(
      "http://65.1.117.32:5000" + "/api/handwritteninvoice/product/update",
      data
    );
    return res.data;
  }

  async CreateNotFoundItems(data) {
    /**
     * data format
     * {Item:String,Description:String,Quantity:String,Price:String,sku:String,Barcode:String,PosSKU:String,InvoiceName:String}
     */
    const res = await Axios.post("http://65.1.117.32:5000" + "/api/invoice/notfound", data);
    return res.data;
  }

  async CreateScanInvoiceData(data) {
    //console.log("IN INVENTORY SERVICE");
    //console.log(data);
    const res = await Axios.post(
      "http://65.1.117.32:5000" + "/api/invoice/scaninvoicedata",
      data
    );
    return res.data;
  }
  async UpdateInvoiceData(invoiceName, invoiceNo, date, itemNo) {
    console.log(invoiceName);
    console.log(invoiceNo);
    console.log(itemNo);
    console.log(date);
    const res = await Axios.post("http://65.1.117.32:5000" + "/api/invoice/updateinvoicedata", {
      params: {
        invoiceName: invoiceName,
        invoiceNo: invoiceNo,
        date: date,
        itemNo: itemNo,
      },
    });
    return res.data;
  }

  async UpdateDBafterPosUpdate(data) {
    console.log(data);
    const res = await Axios.post(
      "http://65.1.117.32:5000" + "/api/invoice/updatedbafterposupdate",
      data
    );
    console.log(res);
  }

  async saveDetails(data) {
    console.log(data);
    const res = await Axios.post("http://65.1.117.32:5000" + "/api/invoice/savedetails", data);
    return res.data;
  }

  async reversePOSUpdate(invoiceName, invoiceNo, date, itemNo) {
    console.log(invoiceName);
    console.log(invoiceNo);
    console.log(itemNo);
    console.log(date);
    const res = await Axios.post("http://65.1.117.32:5000" + "/api/invoice/reverseposupdate", {
      params: {
        invoiceName: invoiceName,
        invoiceNo: invoiceNo,
        date: date,
        itemNo: itemNo,
      },
    });
    return res.data;
  }

  async gethandwrittenPosLogs(data) {
    console.log("data : ", data);

    const res = await Axios.get(
      "http://65.1.117.32:5000" + "/api/invoice/gethandwrittenposlogs",
      {
        params: {
          invoicename: data.invoicename,
          itemNo: data.itemNo,
          sku: data.sku,
          updatedate: data.updatedate,
        },
      }
    );
    return res.data;
  }

  async linkingCorrect(data) {
    console.log(data);
    const res = await Axios.post(
      "http://65.1.117.32:5000" + "/api/invoice/linkingcorrect",
      data
    );
    return res;
  }

  // added by Deepanshu
  async linkingCorrectInScaninvoice(data) {
    console.log(data);
    const res = await Axios.post(
      "http://65.1.117.32:5000" + "/api/invoice/linkingCorrectInScaninvoice",
      data
    );
    return res;
  }

  async saveDetailsInScaninvoice(data) {
    console.log(data);
    const res = await Axios.post(
      "http://65.1.117.32:5000" + "/api/invoice/saveDetailsInScaninvoice",
      data
    );
    return res.data;
  }

  async linkManually(data) {
    console.log(data);

    const res = await Axios.post("http://65.1.117.32:5000" + "/api/invoice/linkmanually", data);
    return res;
  }

  async getHicksvilleData(value) {
    console.log("in inventory for hicks data");
    const res = await Axios.get("http://65.1.117.32:5000" + "/api/invoice/gethicksvilledata", {
      params: { input: value },
    });
    return res.data;
  }

  async getSavedInvoices(data) {
    console.log("in inventory for saved invoices");
    console.log(data);
    const res = await Axios.get("http://65.1.117.32:5000" + "/api/invoice/getsavedinvoices", {
      params: data,
    });
    return res.data;
  }

  async UpdateDBProduct(data) {
    console.log(data);
    const res = await Axios.put("http://65.1.117.32:5000" + "/api/invoice/pos/update", data);
    return res.data;
  }
  async CreateDBProduct(data) {
    const res = await Axios.post("http://65.1.117.32:5000" + "/api/invoice/pos/create", data);
    return res.data;
  }

  async getInitialSyncedData(dateObj) {
    console.log("In inventory service");
    console.log(dateObj);
    const res = await Axios.get("http://65.1.117.32:5000" + "/api/invoice/pos", dateObj);
    console.log(res);
    return res.data;
  }

  async generateLog(data) {
    console.log(data);
    const res = await Axios.post("http://65.1.117.32:5000" + "/api/invoice/generatelog", data);
    return res;
  }

  async linkManuallyLog(data) {
    console.log(data);
    const res = await Axios.post(
      "http://65.1.117.32:5000" + "/api/invoice/linkmanuallylog",
      data
    );
    return res;
  }

  // added by Deepanshu
  async getLinkingLogsXlsx(data) {
    console.log(data);
    const res = await Axios({
      url: "http://65.1.117.32:5000" + "/api/invoice/getlinkinglogsxlsx",
      headers: { "Contant-Type": "application/json" },
      params: data,
      method: "GET",
      responseType: "blob",
    });
    return res;
  }

  // added by Deepanshu
  async getPosLogsXlsx(data) {
    console.log(data);
    const res = await Axios({
      url: "http://65.1.117.32:5000" + "/api/invoice/getposLogsxlsx",
      headers: { "Contant-Type": "application/json" },
      params: data,
      method: "GET",
      responseType: "blob",
    });
    return res;
  }

  async reverseUpdate(data) {
    console.log(data);

    const res = await Axios.post(
      "http://65.1.117.32:5000" + "/api/invoice/reverseupdate",
      data
    );
    return res.data;
  }

  async UnidentifiedLog(data) {
    console.log(data);
    const res = await Axios.post(
      "http://65.1.117.32:5000" + "/api/invoice/unidentifiedlog",
      data
    );
    return res;
  }

  async handwrittenPosLogs(data) {
    console.log(data);
    const res = await Axios.post(
      "http://65.1.117.32:5000" + "/api/invoice/handwrittenposlogs",
      data
    );
    return res;
  }
  async GethandwrittenLogs(invName) {
    const data = {
      invoiceName: invName,
    };
    console.log(data);
    const res = await Axios.get("http://65.1.117.32:5000" + "/api/invoice/gethandwrittenlogs", {
      params: data,
    });
    return res;
  }

  async fetchProductFromPosList(data) {
    console.log(data);
    const res = await Axios.get(
      "http://65.1.117.32:5000" + "/api/invoice/fetchproductfromposlist",
      data
    );
    return res.data;
  }

  async posLogs(data) {
    console.log(data);
    const res = await Axios.post("http://65.1.117.32:5000" + "/api/invoice/poslogs", data);
    return res.data;
  }

  async getItemForHandwrittenInvoice(data) {
    console.log(data);
    const res = await Axios.get("http://65.1.117.32:5000" + "/api/invoice/getitemhandwritten", {
      params: data,
    });
    return res.data;
  }
  async UpdateInvoiceDetails(data) {
    /**
     ***** data format
     * data = {invoiceName: "chetak", itemName:"CAS 123", value:{"Description": "jnckwc", "Price": "44"}}
     */
    //  console.log(data);
    const res = await Axios.put(
      "http://65.1.117.32:5000" + "/api/invoice/updateinvoicedetails",
      data
    );
    return res.data;
  }
  async UpdateVerifyDetails(data) {
  
    const res = await Axios.put(
      "http://65.1.117.32:5000" + "/api/invoice/updateverifydetails",
      data
    );
    return res.data;
  }
  async linkingCorrectTrue(data) {
    console.log(data);
    const res = await Axios.post("http://65.1.117.32:5000"+ "/api/invoice/linkingcorrecttrue", data);
    return res;
  }
  async InsertAllProducts(data) {
    console.log(data);
    const res = await Axios.post("http://65.1.117.32:5000" + "/api/allproducts",data);
    return res.data;
  }
  async getAllProductsDataByUsername(data) {
    // console.log(barcode);
    const res = await Axios.get("http://65.1.117.32:5000" + "/api/getallproductsdatabyusername",{
      params: data,
    });
    return res.data;
  }
}
