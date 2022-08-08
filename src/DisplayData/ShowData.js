import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { useRoute } from "@react-navigation/native";
import { TesseractService } from "../services/TesserartService";
import { chooseFilter } from "../utils/filterData";
// import Button from "../UI/Button";
// import TextField from "@material-ui/core/TextField";
// import Autocomplete from "@material-ui/lab/Autocomplete";
const ShowData = () => {
  const [tableData, setTableData] = useState([]);
  const [emptyColumn, setEmptyColumn] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [pushToInventory, setPushToInventory] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [itemNoDropdown, setItemNoDropdown] = useState([]);
  const [loader, setLoader] = useState(true);
  const [reviewItems, setReviewItems] = useState([]);
  const header = [
    "Serial No.",
    "Barcode",
    "POS SKU",
    "Qty Shipped",
    "ITEM NO",
    "Link Product",

    "DESCRIPTION",
    "Units in  Case",
    "Case cost",
    "Extended Price",
    "Unit Cost ",
    "Unit Price",
    "Mark up (%)",
    "Tick to delete",
    "Update POS",
    "Serial No.(2)"
  ];
  const propsData = useRoute().params;
  // console.log("route : ",props.params)
  // const [propsData,setPropsData] = useState(props.params);
  const tesseractService = new TesseractService();
  console.log("propsData : ", propsData);
  /**Fetch the data from the aws textract for the image */


  async function fetchOCRData() {
    // return chetak();

    // setLoader(true);
    const ocrData = await Promise.all(
      propsData.filename.map(async (file) => {
        try {
          console.log("FILENAME" + propsData.filename);
          const res = await tesseractService.GetOCRData(file);
          console.log("ocrData from TSRCTsrvc goes to chooseFilter");

          console.log("OCR");
          console.log(res.body);

          // scanInvoiceData.InvoiceDate = res.body[1]["2"]["1"];
          // scanInvoiceData.InvoiceNumber = res.body[1]["2"]["2"];
          // scanInvoiceData.InvoicePage = res.body[1]["2"]["3"];
          // setInvDate(res.body[1]["2"]["1"]);
          // setInvNo(res.body[1]["2"]["2"]);
          // setInvPage(res.body[1]["2"]["3"]);
          // setScanInvoiceData({InvoiceDate: invDate, InvoiceNumber: invNo, InvoicePage: invPage});

          // console.log(scanInvoiceData);

          //console.log(invDate);
          //console.log(invNo);
          //console.log(invPage);
          // console.log(scanInvoiceData);
          return chooseFilter(propsData.selectedInvoice, res.body);
        } catch (error) {
          console.log("error fetching descripton", error);
          // throw new Error(error);
        }
      })
    );
    let newData = [];
    ocrData.forEach((data) => (newData = [...newData, ...data]));
    console.log("ocrData : ", ocrData)
    return newData;
  }

  async function invoiceData() {
    console.log("invoiceData : ", propsData)
    const products = await tesseractService.GetProductDetails(
      propsData.selectedInvoice
    );
    //console.log(propsData.selectedInvoice);
    return products;
  }
  useEffect(() => {

    fetchOCRData().then((ocrData) => {
      console.log(ocrData);
      invoiceData()
        .then((products) => {
          console.log("OCR DAATA");
          console.log(ocrData);

          console.log(products);
          // console.log(ocrData);



          /**post processing the table data after returning from filter */
          function convertToUpperCase(obj) {
            let newObj = {};
            for (let key in obj) {
              newObj[key.toUpperCase()] = obj[key];
            }
            return newObj;
          }
          products = convertToUpperCase(products);
          // console.log(products);
          // scanInvoiceData.InvoiceData = ocrData;
          // setOcrProducts(ocrData);

          console.log("OCR Data");
          console.log(ocrData);

          // scanInvoiceData.InvoiceData = ocrData;
          //console.log(resScnInvDta);
          //console.log("OCERDATa", ocrData);
          console.log(products);
          //console.log(scanInvoiceData);
          let table = ocrData.map((row) => {
            /**For invoices which dont have item no, set description as item no */
            if (row.itemNo === undefined) {
              row.itemNo = row.description.trim().toUpperCase();
            }
            row.itemNo = row.itemNo.toString().toUpperCase();

            row.description = row.description;
            // products[row.itemNo] !== undefined
            //   ? products[row.itemNo].Description
            //   : row.description;
            row.pieces =
              products[row.itemNo] !== undefined
                ? products[row.itemNo].Quantity
                : 0;
            row.sku =
              products[row.itemNo] !== undefined
                ? products[row.itemNo].sku
                : "";
            row.barcode =
              products[row.itemNo] !== undefined
                ? products[row.itemNo].Barcode
                : "";
            row.posName =
              products[row.itemNo] !== undefined
                ? products[row.itemNo].POS
                : "";
            row.markup = 0;
            row.show = true;
            row.posSku =
              products[row.itemNo] !== undefined
                ? products[row.itemNo].PosSKU
                : "";
            row.isReviewed =
              products[row.itemNo] !== undefined ? products[row.itemNo].isReviewed : "";
            row.size =
              products[row.itemNo] !== undefined ? products[row.itemNo].Size : "";
            row.department =
              products[row.itemNo] !== undefined ? products[row.itemNo].Department : "";
            row.cost =
              products[row.itemNo] !== undefined ? products[row.itemNo].SellerCost : "";
            row.sellingPrice =
              products[row.itemNo] !== undefined ? products[row.itemNo].SellingPrice : "";
            row.LinkingCorrect =
              products[row.itemNo] !== undefined ? products[row.itemNo].LinkingCorrect : "";
            //console.log("department-" + row.department + "  cost-" + row.cost + "  price" + row.sellingPrice);
            let sp = 0;
            let cp = 0;
            // const barcode = products.Barcode
            if (parseInt(row.pieces)) {
              sp = (parseFloat(row.unitPrice) / parseInt(row.pieces)).toFixed(
                2
              );
              cp = sp;
            }
            if (products[row.itemNo] !== undefined) {
              // console.log(sp);
              // console.log(products[row.itemNo].SellerCost);
              // if (+row.unitPrice > +products[row.itemNo].SellerCost) {
              //   row["priceIncrease"] = 1;
              // } else if (+row.unitPrice < +products[row.itemNo].SellerCost) {
              //   row["priceIncrease"] = -1;
              // } else if (+row.unitPrice == +products[row.itemNo].SellerCost) {
              //   row["priceIncrease"] = 0;
              // }
              if (sp > +products[row.itemNo].SellerCost) {
                row["priceIncrease"] = 1;
              } else if (+sp < +products[row.itemNo].SellerCost) {
                row["priceIncrease"] = -1;
              } else if (+sp == +products[row.itemNo].SellerCost) {
                row["priceIncrease"] = 0;
              }
            } else {
              row["priceIncrease"] = 0;
            }

            /**filter out the rows for which qty shipped & extendedPrice is zero */
            if (row.qty == "0" && row.extendedPrice === "0.00") {
              return null;
            }
            /**Calulate qty for which qty is not read/scanned by textract */
            if (!row.qty) {
              row.qty = (
                parseFloat(row.extendedPrice) / parseFloat(row.unitPrice)
              ).toFixed(0);
            }
            // SerialNoInInv += 1;
            return { ...row, sp, cp };
          });


          // for(let element in products){
          //   console.log(element);
          //   console.log(ocrData)
          //   for(let e of ocrData){

          //     console.log(element !== e.itemNo)
          //     // console.log("element : ",element);
          //     // console.log("e.itemNo : ",e);
          //     // console.log("e.itemNo : ",e.qty);
          //     // console.log("e.itemNo : ",e.itemNo);
          //     // console.log("e.itemNo : ",e.description);
          //     console.log(typeof(element))
          //     console.log(typeof(e))
          //     if(element !== e.itemNo){
          //       e.LinkingCorrect = "false";
          //       console.log("element : ",element);
          //       console.log("e.itemNo : ",e.itemNo);
          //      }
          //     }

          //     // console.log(ocrData);
          //   }
          //   setLoader(false);
          console.log("fetchOcrData_table", table);
          setTableData(table.filter((data) => data !== null));
          //   setItemNoDropdown(Object.keys(products));
          //   setProductDetails(products);
        })
        .catch((err) => {
          console.log("error on mapping ocrdata", err)
          // setLoader(false);
        });
    });

  }, []);



  const renderTableData = () => {
    // console.log("renderTableData_HicksData : ",HicksData);
    console.log("renderTableData_tableData : ", tableData);
    // hicksvilleDropdown(HicksData);
    // console.log(stateUpdated);

    if (tableData) {
      console.log(tableData);

      // console.log(showPosIndex);

      let rows = tableData.map((element, index) => {
        //fuzzwuzzSuggestion = getFuzzwuzzSuggestion(element.description);
        let isEmpty =
          element.qty === "" ||
          element.itemNo === "" ||
          !element.pieces ||
          isNaN(element.unitPrice) ||
          element.unitPrice === "" ||
          isNaN(element.extendedPrice);
        if (isEmpty && element.show) {
          // let emptyColumn = [...emptyColumnList, index];
          // emptyColumnList = [...new Set(emptyColumn)];
          element.isEmpty = true
        }else{
          element.isEmpty = false
        }
        let isFree = element.qty != 0 && element.extendedPrice === "0.00";

        // return (
        //   <tr
        //     key={index}
        //     className={isEmpty ? styles.red : isFree ? styles.free : null}
        //     /* style={isUpdated === "true" ? updateIndex === index ? {backgroundColor: "lightBlue"} : {}
        //           : element.show ? { opacity: "1" } : { opacity: "0.4" }}*/

        //   >
        //     <td>{index + 1}</td>
        //     <td className={styles.element}>

        //       {/* <IconButton
        //         color="primary"
        //         aria-label="add to review"
        //         // onClick={() => addForReview(element, index)}
        //       >
        //         <InfoOutlinedIcon
        //           style={
        //             reviewItems.includes(index)
        //               ? { backgroundColor: "green" }
        //               : null
        //           }
        //         /> 
        //       </IconButton>
        //       <div className={element.isReviewed  === "true" || (showPosIndex === index && stateUpdated === "true") ? styles.tooltipIsReviewed: styles.tooltip} >
        //         <p>POS Product- {showPosIndex === index ? showPosState.pos : element.posName }</p>
        //         <p>UPC- {showPosIndex === index ? showPosState.barcode : element.barcode}</p>
        //         <p>Size- {showPosIndex === index ? showPosState.size : element.size}</p>
        //         <p>Department - {showPosIndex === index ? showPosState.department : element.department}</p>
        //         <p>Unit Cost- {showPosIndex === index ? showPosState.unitCost : element.cost}</p> 
        //         <p>Unit Price- {showPosIndex === index ? showPosState.unitPrice : element.sellingPrice}</p>
        //         <div >
        //         <button onClick={ () => {
        //                     if(notFounds === "true"){
        //                       toggleModal();
        //                     }else{
        //                       updateItem(props, (parseFloat(element.unitPrice) / parseInt(element.pieces)).toFixed(2))
        //                     }
        //                   }
        //                 } 
        //           disabled={showPosIndex === index ? false : true}
        //           style={{backgroundColor: "green",
        //           border: "none",
        //           color: "white",
        //           padding: "4px 8px",
        //           textAlign: "center",
        //           textDecoration: "none",
        //           display: "inline-block",
        //           fontSize: "14px",
        //           align: "left"}} >
        //           Update Item
        //         </button>
        //         </div> 
        //       </div> */}
        //     </td>
        //     <td>{showPosIndex === index ? showPosState.posSku : element.posSku}</td>
        //     <td>
        //       <TextField
        //         type="tel"
        //         value={element.qty}
        //         id="outlined-secondary"
        //         variant="outlined"
        //         onChange={(e) => {
        //           handleChange(index, "qty", e.target.value);
        //         }}
        //         style={{ width: 100 }}
        //       />
        //     </td>
        //     <td>
        //       <Autocomplete
        //         value={element.itemNo}
        //         onChange={(event, newValue) => {
        //           if (newValue) {
        //             handleChange(index, "itemNo", newValue);
        //           }
        //         }}
        //         id="combo-box"
        //         options={itemNoDropdown}
        //         getOptionLabel={(option) => option}
        //         style={{ width: 200 }}
        //         renderInput={(params) => (
        //           <TextField {...params} variant="outlined" />
        //         )}
        //       />
        //     </td>
        //     <td>
        //       <Autocomplete
        //         value={showPosIndex  === index ? showPosState.item : element.itemNo }
        //         onChange={(event, newValue) => {
        //           if (newValue) {
        //             let newState = { ...showPosState };
        //             console.log(newValue);
        //             // newState.item = newValue.name;
        //             newState.item = element.itemNo
        //             newState.description = element.description;
        //             newState.barcode = newValue.upc;
        //             newState.pos = newValue.name;
        //             newState.posSku = newValue.sku;
        //             newState.size = newValue.size;
        //             newState.department = newValue.department;
        //             newState.unitCost = newValue.cost;
        //             newState.unitPrice = newValue.price;
        //             setShowPosState(newState);
        //             setShowPosIndex(index);
        //             setUnitCost(newValue.cost);
        //             if(isEmpty){
        //               setNotFounds("true");
        //             }
        //             //setDisabled(false);
        //             //updateOnHoverDetails(index);
        //             //setShowPosIndex(index);
        //             // console.log(newValue);
        //             // console.log(newState);
        //             //console.log(showPosState);

        //           }
        //         }}
        //         id="combo-box"
        //         disabled
        //         // options={element.fuzzSuggestion}
        //         options={hicksvilleData}
        //         getOptionLabel={(option) => option.label ?? element.itemNo}
        //         style={{ width: 400 }}
        //         renderInput={(params) => (
        //           <TextField {...params} variant="outlined" />
        //         )}
        //       />
        //     </td>

        //     <td>{element.description}</td>
        //     {/* <td>{element.pieces}</td> */}
        //     <td>
        //       <TextField
        //         type="tel"
        //         value={element.pieces}
        //         variant="outlined"
        //         onChange={(e) => {
        //           handleChange(index, "pieces", e.target.value);
        //         }}
        //         style={{ width: 100 }}
        //       />
        //     </td>
        //     <td>
        //       <TextField
        //         type="tel"
        //         value={element.unitPrice}
        //         variant="outlined"
        //         onChange={(e) => {
        //           handleChange(index, "unitPrice", e.target.value);
        //         }}
        //         style={ 
        //           // element.priceIncrease === 1 
        //           //   ? { backgroundColor: "#1a8cff", width: 100 }
        //           //   : element.priceIncrease === -1 
        //           //   ? { backgroundColor: "#ffb31a", width: 100 }
        //           //   : { width: 100 }
        //           showPosIndex === index ? costInc==="true" ? { backgroundColor: "#1a8cff", width: 100 } : costDec==="true" ? { backgroundColor: "#ffb31a", width: 100 } : {width: 100}
        //           : element.priceIncrease === 1 
        //               ? { backgroundColor: "#1a8cff", width: 100 }
        //               : element.priceIncrease === -1 
        //               ? { backgroundColor: "#ffb31a", width: 100 }
        //               : { width: 100 }
        //         }
        //       />
        //     </td>
        //     <td>{element.extendedPrice}</td>
        //     {/* <td>{element.cp}</td> */}
        //     <td>
        //       <TextField
        //         type="tel"
        //         value={element.cp}
        //         variant="outlined"
        //         onChange={(e) => {
        //           handleChange(index, "cp", e.target.value);
        //         }}
        //         style={{ width: 100 }}
        //       />
        //     </td>
        //     <td>
        //       <TextField
        //         type="tel"
        //         value={element.sp}
        //         variant="outlined"
        //         onChange={(e) => {
        //           handleChange(index, "sp", e.target.value);
        //         }}
        //         style={{ width: 100 }}
        //       />
        //     </td>
        //     <td>{element.markup}</td>
        //     {/* <td>
        //       <Checkbox
        //         checked={!element.show}
        //         onChange={(e) => handleChange(index, "show", e.target.value)}
        //         inputProps={{ "aria-label": "primary checkbox" }}
        //       />
        //     </td> */}
        //      <td>
        //       <Button
        //         text={element.show ? "Delete" : "Undo"}
        //         color="btn btn-info"
        //         type="submit"
        //         onClick={() => deleteRow(index)}
        //       />
        //     </td>
        //     <td>
        //     <Button 
        //         text="Update POS"
        //         color="btn btn-info"
        //         type="submit"
        //         onClick={() => pushSingleItemToInventory(index)}
        //         style={{ width: 120 }}
        //       />

        //     </td>
        //     <td>{index + 1}</td>
        //     {/* <td>
        //       <Button
        //         text={element.show ? "Delete" : "Undo"}
        //         color="btn btn-info"
        //         type="submit"
        //         onClick={() => deleteRow(index)}
        //       />
        //     </td> */}
        //   </tr>
        // );

        // return (
        //   <View style={{ flexDirection: "row" }}>
        //     <View style={{ width: 100 }}>
        //       <Text>{index + 1}</Text>
        //     </View>
        //     <View style={{ width: 100 }}>
        //       <Text>{element.barcode}</Text>
        //     </View>
        //     <View style={{ width: 100 }}>
        //       <Text>{element.posSku}</Text>
        //     </View>
        //   </View>
        // )

      });

let index = 1
let i = 0
      const item = ({item})=>{
        return (
          <View style={{ flexDirection: "row" ,borderWidth:0.2,borderColor:"black",padding:10,backgroundColor:item.isEmpty===true?"red":""}}>
            <View style={{ width: 40 }}>
              <Text>{i+1}</Text>
            </View>
            <View style={{ width: 120 }}>
              <Text>{item.barcode}</Text>
            </View>
            <View style={{ width: 80 }}>
              <Text>{item.posSku}</Text>
            </View>
            <View style={{ width: 100 }}>
              <Text>{item.qty}</Text>
            </View>
            <View style={{ width: 100 }}>
              <Text>{item.itemNo}</Text>
            </View>
            <View style={{ width: 100 }}>
              <Text>{item.itemNo}</Text>
            </View>
            <View style={{ width: 300 }}>
              <Text>{item.description}</Text>
            </View>
            <View style={{ width: 100 }}>
              <Text>{item.pieces}</Text>
            </View>
            <View style={{ width: 100 }}>
              <Text>{item.unitPrice}</Text>
            </View>
            <View style={{ width: 100 }}>
              <Text>{item.extendedPrice}</Text>
            </View>
            <View style={{ width: 100 }}>
              <Text>{item.cp}</Text>
            </View>
            <View style={{ width: 100 }}>
              <Text>{item.sp}</Text>
            </View>
            <View style={{ width: 100 }}>
              <Text>{item.markup}</Text>
            </View>
            <View style={{ width: 100 }}>
              <Text>{item.markup}</Text>
            </View>
          </View>
        )
      }
      console.log("rows : ", rows)
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '10%' }}>

          <View style={{ flexDirection: "row" }}>
            <View style={{ width: 20 }}>
              <Text>ID</Text>
            </View>
            <View style={{ width: 120 }}>
              <Text>barcode</Text>
            </View>
            <View style={{ width: 60 }}>
              <Text>posSku</Text>
            </View>
            <View style={{ width: 30 }}>
              <Text>Quantity</Text>
            </View>
            <View style={{ width: 200 }}>
              <Text>itemNO</Text>
            </View>
            <View style={{ width: 200 }}>
              <Text>LINK PRODUCT</Text>
            </View>
            <View style={{ width: 300 }}>
              <Text>LINK DESCRIPTION</Text>
            </View>
            <View style={{ width: 40 }}>
              <Text>UNITS IN CASE</Text>
            </View>
            <View style={{ width: 40 }}>
              <Text>CASE COST</Text>
            </View>
            <View style={{ width: 40 }}>
              <Text>EXTENDED PRICE</Text>
            </View>
            <View style={{ width: 40 }}>
              <Text>UNIT COST</Text>
            </View>
            <View style={{ width: 40 }}>
              <Text>UNIT PRICE</Text>
            </View>
            <View style={{ width: 40 }}>
              <Text>MARK UP</Text>
            </View>
          </View>

          <FlatList
            data={tableData}
            renderItem={item}
            keyExtractor={(item,index)=>index.toString()}
          />
        </View>
      );
    }
  };

  return (
    <View>
      <Text>
        {renderTableData()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({})

export default ShowData;
