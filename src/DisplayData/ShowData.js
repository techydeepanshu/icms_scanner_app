import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, ActivityIndicator, Modal, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { useRoute } from "@react-navigation/native";
import { TesseractService } from "../services/TesserartService";
import { chooseFilter } from "../utils/filterData";
// import DatePicker from 'react-native-modern-datepicker';
import DatePicker from 'react-native-datepicker'
import { InventoryService } from "../services/InventoryService";
// import Button from "../UI/Button";
// import TextField from "@material-ui/core/TextField";
// import Autocomplete from "@material-ui/lab/Autocomplete";

const ShowData = ({navigation}) => {
  const [tableData, setTableData] = useState([]);
  const [emptyColumn, setEmptyColumn] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [pushToInventory, setPushToInventory] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [itemNoDropdown, setItemNoDropdown] = useState([]);
  const [loader, setLoader] = useState(true);
  const [reviewItems, setReviewItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState({ date: "", invoiceNo: "" });
  // const [modalLoader, setModalLoader] = useState({ loader: true, done: false });
  const [modalLoader, setModalLoader] = useState({ loader: false, done: false });
  const [ocrProducts, setOcrProducts] = useState([]);
  const [currentDate, setCurrentDate] = useState();
  const propsData = useRoute().params;
  // console.log("route : ",props.params)
  // const [propsData,setPropsData] = useState(props.params);
  const tesseractService = new TesseractService();
  console.log("propsData : ", propsData);
  /**Fetch the data from the aws textract for the image */
  const inventoryService = new InventoryService();

  const scanInvoiceData =
  {
    InvoiceName: propsData.selectedInvoice,
    InvoiceDate: "",
    InvoiceNumber: "",
    InvoicePage: "",
    InvoiceData: [],
    SavedDate: "",
    SavedInvoiceNo: ""
  }

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
    // setLoading(true)
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
          setOcrProducts(ocrData);

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
          setLoading(false)
        })
        .catch((err) => {
          console.log("error on mapping ocrdata", err)
          setLoading(false)
          // setLoader(false);
        });
    });
    const curDate = new Date();
    console.log(curDate);
    let date =
      curDate.getFullYear() +
      "-" +
      (curDate.getMonth() + 1) +
      "-" +
      curDate.getDate();
    console.log("currentdate : ",date);
    setCurrentDate(date)
  }, []);


  const saveInvoiceData = async () => {
    console.log("saveInvoiceData : ", selectedData)

    try {


      setModalLoader((prev) => {
        return { loader: true, done: false }
      })
      // console.log(invDate);
      // console.log(invNo);
      // console.log(invPage);
      // console.log(ocrProducts);

      ocrProducts.map((product) => { product.isUpdated = "false" });
      console.log(ocrProducts);

      scanInvoiceData.InvoiceName = propsData.selectedInvoice;
      scanInvoiceData.InvoiceDate = selectedData.date;
      scanInvoiceData.InvoiceNumber = selectedData.invoiceNo;
      scanInvoiceData.InvoicePage = "";
      scanInvoiceData.InvoiceData = ocrProducts;


      // setScanInvoiceData(data);
      // console.log(scanInvoiceData);
      scanInvoiceData.SavedDate = selectedData.date;
      scanInvoiceData.SavedInvoiceNo = selectedData.invoiceNo;
      console.log(scanInvoiceData);
      // const resScnInvDta =  await inventoryService.CreateScanInvoiceData(scanInvoiceData);
      // console.log(resScnInvDta);
      // if(resScnInvDta === "exist") {
      //   alert("Invoice with same no. and date already exists, change either of the 2 values");
      //   toggleModal();
      // }else {
      //   alert("Invoice Saved Successfully");

      // }

      const resScnInvDta = await inventoryService.CreateScanInvoiceData(scanInvoiceData).then(async (res) => {
        console.log(res)
        if (res !== "exist") {
          console.log("ocrProducts : ", ocrProducts)
          console.log("tableData : ", tableData)
          await Promise.all(
            tableData.filter((elem) => elem.qty !== "" || elem.qty !== "0").map(async (element, i) => {
              await inventoryService.InsertAllProducts({
                SerialNoInInv: i + 1,
                barcode: element.barcode,
                itemNo: element.itemNo,
                invDescription: element.description,
                invQty: element.qty,
                unitInCase: element.pieces,
                totalQty: element.qty * element.pieces,
                invCaseCost: element.unitPrice,
                invExtendedPrice: element.extendedPrice,
                invSku: element.posSku,
                invUnitCost: element.cp,
                invUnitPrice: element.sellingPrice,
                markup: element.markup,
                posName: element.posName,
                posSku: element.posSku,
                posSize: element.size,
                posDepartment: element.department,
                posUnitCost: element.cost,
                posUnitPrice: element.sellingPrice,
                priceIncrease: element.priceIncrease,
                show: element.show,
                invProductUnit: "",
                isUpdated: "false",
                isReviewed: element.isReviewed,
                linkingCorrect: element.LinkingCorrect,
                oldInventory: "",
                newInventory: element.qty * element.pieces,
                isInventoryUpdated: "",
                invoiceNo: selectedData.invoiceNo,
                invoiceName: propsData.selectedInvoice,
                invoiceSavedDate: selectedData.date,
                lastUpdationDate: currentDate,
                linkByBarcode: "",
                linkByName: "",
                person: ""
              })

            })
          )
          setModalLoader((prev) => {
            return { loader: false, done: true }
          })
          setTimeout(()=>{
            
            setModalVisible(!modalVisible)
            navigation.navigate("Dropdown")
          
          }, 1000);
          
          // Alert.alert("Invoice Saved Successfully");

        } else {
          Alert.alert("Invoice with same no. and date already exists, change either of the 2 values");
          // Alert.alert("Some Error, Please Try Again");
          
          setModalLoader((prev) => {
            return { loader: false, done: false }
          })
          
        }
      });

    } catch (err) {
      Alert.alert("Some Error, Please Try Again");
      setModalVisible(!modalVisible)
      setModalLoader((prev) => {
        return { loader: false, done: false }
      })
    }
  };


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
        } else {
          element.isEmpty = false
        }
        let isFree = element.qty != 0 && element.extendedPrice === "0.00";



      });

      let index = 1
      let i = 0
      const item = ({ item }) => {
        return (
          <View style={{ flexDirection: "row", borderWidth: 0.2, borderColor: "black", padding: 10, backgroundColor: item.isEmpty === true ? "red" : "" }}>
            <View style={{ width: 40 }}>
              <Text>{i + 1}</Text>
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
      // console.log("rows : ", rows)
      return (
        <>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: '10%' }}>


            <TouchableOpacity
              style={{ position: "absolute", bottom: 30, zIndex: 2, backgroundColor: "green", padding: 20, borderRadius: 20, shadowColor: "grey", shadowOpacity: 5 }}
              onPress={() => setModalVisible(true)}
            >
              <Text style={{ color: "white", fontSize: 20 }}>Save Invoice</Text>
            </TouchableOpacity>


            {/*<View style={{ flexDirection: "row" }}>
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
      </View>*/}

            <FlatList
              style={{margin:10,padding:10}}
              data={tableData}
              renderItem={item}
              keyExtractor={(item, index) => index.toString()}
            />

          </View>
        </>
      );
    }
  };


  return (
    <View>
      <Text>
        {loading ? <View style={{
          display: "flex",
          justifyContent: "center",
          // alignSelf: 'center',
          // position: 'absolute',
          // alignItems: "center",
          // alignContent:"center",
          // bottom: 110,
          // flexDirection: "row",
          fontSize: 30,
          // paddingEnd: 30,
          // paddingStart: 30,
          // paddingVertical: 16,
          borderRadius: 9,
          height: "100%",
          width: "100%"
          // margin:70

        }}>

          <View style={{ width: 400 }}>
            <ActivityIndicator animating={loading} size="large" color="#0000ff" />
            <View >
              <Text style={{ alignSelf: "center" }}>Loading...</Text>
            </View>
          </View>

        </View> :
          renderTableData()

        }

      </Text>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        {modalLoader.loader == true && modalLoader.done == false ?
          <View style={styles.centeredView}>
            <View style={{ ...styles.modalView, padding: 40 }}>

              <View>
                <ActivityIndicator animating={modalLoader.loader} size="large" color="#0000ff" />
                <View >
                  <Text style={{ alignSelf: "center" }}>Saving...</Text>
                </View>
              </View>
            </View>
          </View>

          :

          modalLoader.loader == false && modalLoader.done == true ?
            <View style={styles.centeredView}>
              <View style={{ ...styles.modalView, }}>

                <Image style={{ height: 150, width: 150 }} source={require('../images/icons.gif')} />
                
              </View>
            </View>
            :

            <View style={styles.centeredView}>
              <View style={styles.modalView}>

                <Text style={styles.modalText}>Invoice Data</Text>

                <DatePicker
                  style={{ width: 250}}
                  date={selectedData.date}
                  mode="date"
                  placeholder="Invoice Date"
                  format="YYYY-MM-DD"

                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      marginLeft: 0,
                      display: "none",
                      
                    },
                    dateInput: {
                      marginLeft: 0,
                      borderRadius: 12,
                      borderColor: "#f2f4f7",
                      backgroundColor: "#f2f4f7",
                      borderWidth:0.5,
                      borderColor:"grey"
                    }
                    // ... You can check the source to find the other keys.
                  }}
                  onDateChange={(date) => setSelectedData((prev) => {
                    return { ...prev, date: date }
                  })}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={(data) => setSelectedData((prev) => {
                    return { ...prev, invoiceNo: data }
                  })

                  }
                  value={selectedData.invoiceNo}
                  placeholder="Invoice Number"
                
                />
                <View style={{ flexDirection: "row-reverse" }}>

                {selectedData.date!==""&&selectedData.invoiceNo!==""?
                  <TouchableOpacity
                    style={{ backgroundColor: "green", padding: 15, borderRadius: 40, shadowColor: "grey", shadowOpacity: 5, marginLeft: 20 }}
                    onPress={() => saveInvoiceData()}
                  >
                    <Text style={{ color: "white", fontSize: 15 }}>➜</Text>
                  </TouchableOpacity>

                :
                null}

                  <TouchableOpacity
                    style={{ backgroundColor: "red", padding: 15, borderRadius: 40, shadowColor: "grey", shadowOpacity: 5 }}
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <Text style={{ color: "white", fontSize: 15 }}>✘</Text>
                  </TouchableOpacity>

                </View>
              </View>


            </View>}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    // width:400
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 250,
    borderColor: "#f2f4f7",
    backgroundColor: "#f2f4f7",
    borderRadius: 12,
    borderWidth:0.5,
                      borderColor:"grey"
  },
  modalClosebtn: { backgroundColor: "#ff9494", padding: 15, borderRadius: 40, shadowColor: "grey", shadowOpacity: 2 }
})

export default ShowData;
