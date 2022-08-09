import Axios from "../axios";
import axios from "axios"
// import imageToBase64 from "image-to-base64";
import RNFS from 'react-native-fs';

import textractHelper from 'aws-textract-helper';
import { ICMS_FRONTEND_IP } from "../variable";
const appendURL = process.env.NODE_ENV === "production" ? "/server" : "";
export class TesseractService {
    async PostImage(images) {

        console.log("start")

        let filename = []
        await Promise.all(
            images.map(async (image) => {

                console.log("image : ", image)
                let ext = "jpg";
                // console.log("ext : ", ext);

                var resBase64 = await RNFS.readFile(image, 'base64').then(res => { return res });

                // console.log("resBase64 : ",resBase64)

                let base64 = resBase64

                // console.log("base64 : ",base64);
                // console.log("base64 : ",typeof base64);

                let imageId = Date.now().toString();
                // console.log("imageId : ",imageId);

                let options = {
                    method: "POST",
                    headers: { "x-api-key": "DGYDatNOtmtLg2ykakJxAOixNf+w2XQ+5YzUSt1b" },
                    body: JSON.stringify({ img: base64, fileExt: ext, imageID: imageId }),
                    json: true,
                    redirect: 'follow'
                };


                const res = await fetch("https://rn93zjgpv6.execute-api.us-east-1.amazonaws.com/default/icms_mobile_scanner", options)
                    .then((res) => {
                        console.log("res1 : ", res)
                        return res.text();
                    })
                    .then((res) => {
                        console.log("res2 : ", res)

                        filename.push(`\"${imageId + "." + ext}\"`);

                    })
                    .catch((err) => {
                        console.log("err : ", err)
                    })
                console.log("res : ", res)
                // return filename
            }))
        console.log("filename : ", filename)

        return filename
    }

    async GetProductDetails(invoiceName) {
        console.log("invoiceName : ", invoiceName);
        // var res = await Axios.get("http://192.168.1.19:5002/api/product?invoiceName='chetak'", {
        //     params: { invoiceName: invoiceName },
        // });

        let res ;
        var config = {
            method: 'get',
            url: `${ICMS_FRONTEND_IP}/api/product?invoiceName=${invoiceName}`,
            headers: { }
          };
          
         await axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
            console.log("res : ",response.data)
            res =  response.data
          })
          .catch(function (error) {
            console.log(error);
          });
        return res
    }

    async GetOCRData(filename) {
        // var res = await Axios.post("http://65.1.117.32:5000"+`/api/ocr`, { data: {filename} });
        // console.log(res);

        // let filename = `\"${imageId+"."+ext}\"`
        console.log("filename : ", filename)
        let obj;




        var myHeaders = new Headers();
        myHeaders.append("x-api-key", "DGYDatNOtmtLg2ykakJxAOixNf+w2XQ+5YzUSt1b");
        myHeaders.append("Content-Type", "text/plain");

        let options2 = {
            method: "POST",
            // url: "https://cwvuilrnxh.execute-api.us-east-1.amazonaws.com/Production" + "/ocr",
            headers: myHeaders,
            body: `${filename}`,
            // json: true,
            redirect: 'follow'
        };

        //             const ocrRes = fetch("https://cwvuilrnxh.execute-api.us-east-1.amazonaws.com/Production/ocr", options2)
        //                 .then((res) => {
        //                     console.log("res3 : ", res)
        //                     return res.text();
        //                 })
        //                 .then((res) => {
        //                     console.log(JSON.parse(res))
        //                     let resOCR = JSON.parse(res).body
        //                     console.log("resOCR : ", resOCR);

        //                     const tables = textractHelper.createTables(resOCR)
        //                     console.log("tables : ", tables)
        //                     obj = { statusCode: 200, body: tables }
        //                     console.log("obj2 : ",obj);
        //                     // return obj
        //                 })



        // console.log("ocrRes : ",ocrRes);
        // console.log("obj : ",obj);

        var config = {
            method: 'post',
            url: 'https://cwvuilrnxh.execute-api.us-east-1.amazonaws.com/Production/ocr',
            headers: {
                'x-api-key': 'DGYDatNOtmtLg2ykakJxAOixNf+w2XQ+5YzUSt1b',
                'Content-Type': 'text/plain'
            },
            data: filename
        };

        var res = await axios(config);
        console.log("obj : ", res);
        console.log("obj : ", res.data);
        console.log("obj : ", res.data.body);

        const tables = textractHelper.createTables(res.data.body)
        console.log("tables : ", tables)
        obj = { statusCode: 200, body: tables }
        console.log("obj2 : ", obj);
        
        return obj
    }

    async GetSavedInvoiceData(invoiceName, invoiceNo, date) {
        console.log("IN TESSERACT SERVICE");
        var res = await Axios.get("http://65.1.117.32:5000" + "/api/invoice/getsaveinvoicedata/", { params: { invoiceName: invoiceName, invoiceNo: invoiceNo, date: date } });
        console.log(res);
        return res.data;
    }
}