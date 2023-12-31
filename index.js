const express = require('express');
const fs = require('fs');
var axios = require('axios');
var qs = require('qs');
const { config } = require('nodemon');
const app = express();
const port = 7001;

// body parser
app.use(express.urlencoded({extended:true}))

// rendering the home page
app.get('/',(req,res)=>{
    fs.readFile('./home.html', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          // Set the response headers for HTML content
          res.writeHead(200, { 'Content-Type': 'text/html' });
          // Send the HTML content as the response
          res.end(data);
        }
      });
})

// twillio config  for text sms and call
const accountSid ="AC7e79a17d83159b671a4a2ffe8b26a313";
const authToken ="15bb2e357a80e7c0ac49fdd4c11c5908";
const client = require('twilio')(accountSid, authToken);

//ultramsg config for whatsapp
const ultraToken = "bfw7zspuj4vddvbn"
const ultraInstance = "instance62441"

var ultraConfig = {
    method: 'post',
    url: `https://api.ultramsg.com/${ultraInstance}/messages/chat`,
    headers: {  
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  };


// route for sending message
app.post('/sendSms',(req,res)=>{
  
    client.messages
    .create({
        body: 'This is a testing message sent by zeeshan',
        from: '+17855723763',
        to: `+91${req.body.num}`
    })
    .then(message => {
      console.log(message.sid)
      res.redirect('back');
    })
    .catch((error)=>{
      console.log(error);
      res.end("error in sending message",);
      return;
    })

})

// route for making call
app.post("/makeCall",(req,res)=>{

    client.calls
      .create({
         url: 'http://demo.twilio.com/docs/voice.xml',
         to: `+91${req.body.num}`,
         from: '+17855723763',
       })
      .then(call => {
        console.log(call.sid)
        res.redirect('back');
      })
      .catch((error)=>{
        res.end("error in sending Call");
        return;
      })

      
})

app.post("/sendWhatsapp",(req,res)=>{
    var data = qs.stringify({
        "token": ultraToken,
        "to": req.body.num,
        "body": "WhatsApp API testing by zeeshan"
    });
    ultraConfig.data = data;
    axios(ultraConfig)
    .then(function (response) {
      console.log("Chat sent \n",JSON.stringify(response.data));
      res.redirect('back');
    })
    .catch(function (error) {
      console.log(error);
      res.end("error in sending message");
    });

    
})


app.listen(port,(error)=>{
    if(error){
        console.error("Error in starting server",error);
        return ;
    }
    console.log(`server is up and running at port: ${port}`);
})