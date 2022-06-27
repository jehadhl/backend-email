const express = require("express");
const nodemailer = require("nodemailer");
const smtpTransport = require('nodemailer-smtp-transport');
const PORT = process.env.PORT || 7000;
const app = express();
const cors = require("cors");
const bodyPaser = require('body-parser');

 

require("dotenv").config();

app.use(bodyPaser.urlencoded({extended : true}))
app.use(bodyPaser.json())

// middleware
app.use(express.json());
app.use(cors());


app.post("/confirm-order", async (req, res) => {
    let totalPrice = req.body.orderItems.reduce((count, item) => count + item.product.price, 0)
    const dataObject = {};
    dataObject.email = req.body.email;
    dataObject.shippingAddress1 = req.body.shippingAddress1;
    dataObject.shippingAddress2 = req.body.shippingAddress2;
    dataObject.phone = req.body.phone;
    dataObject.city= req.body.city;
    dataObject.zip = req.body.zip;
    dataObject.country = req.body.country;
    dataObject.fullName = req.body.fullName;
    dataObject.productNames = req.body.orderItems.map(orderItem => orderItem.product.name);
    dataObject.images = req.body.orderItems.map(orderItem => orderItem.product.image);
    dataObject.prices = req.body.orderItems.map(orderItem => orderItem.product.price);
  
    let imagesOutput = dataObject.images.map((image, idx) => {
      return (`<div style="display:flex;flex-direction: column !important;"><div style="display:flex ;justify-content:"space-between"><img src=${image} width="50px" height="50px"/><h5>${dataObject.productNames[idx]}</h5></div><div style="display:flex ;justify-content:"space-between"><h3>${dataObject.prices[idx]}dhs</h3></div></div>`)
    })
    imagesOutput += `</div><h3>Total Price:${totalPrice}dhs</h3></div>`;

    let output =`<div>
        <div style="background-color:#5FD068">
        <h1 style="margin:0px;color:#F6FBF4;padding:10px;text-align:center">Al Hayir</h1>
        <h1 style="text-align:center;color:#F6FBF4;margin:0px">New Order</h1>
        </div>
        <h3 style="font-size:20px; color:#000 ;">You’ve received the following order from Al Hayir:</h3>
            <div>
              <h2>User Info:</h2>

              <div style="display:flex ;width:300px !important;justify-content:space-between !important;">
              <div >
              <h3 style="color:#000 ; padding:5px ;">Address1:${dataObject.shippingAddress1}</h3>
              </div>
              <div>
                <h3 style="color:#000 ; padding:5px">Address2:${dataObject.shippingAddress2}</h3>
              </div>
              </div>

              <h3 style="color:#000 ; padding:5px ; margin:0px">City:${dataObject.city}</h3>
              <h3 style="color:#000 ; padding:5px">Zip:${dataObject.zip}</h3>
              <h3 style="color:#000 ; padding:5px">Country:${dataObject.country}</h3>
              <h3 style="color:#000 ; padding:5px">Phone:${dataObject.phone}</h3>
              <h3 style="color:#000 ; padding:5px">Full Name:${dataObject.fullName}</h3>
            </div>
        <div style="display:flex ;flex-direction: column;">`;
        output += imagesOutput;
        var message = "hello wolrd";

    var transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      }
    }));
    var mailOptions = {
        from: "jehad.hlewi22@gmail.com",
        to: "jihadjojojo2017@gmail.com",
        cc:"venomjeh22@gmail.com", 
        subject:'| new message ! |',
        text: message,
        html: output
    }
    transporter.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
           
        }else{
            res.send("hello")
            console.log("email sent")
         
        }
    });
    // sendOrderEmail(email);
  })


app.listen(PORT, () => {
  console.log(`Server start on port ${PORT}`);
});
