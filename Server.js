const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const path =require('path');


const app = express();

//view engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//bodyparser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

//static folder
app.use('/public', express.static(path.join(__dirname, 'public')));



app.get('/', (req,res) => {
	//res.render('contact');
  res.send('it is working!');
})


app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'test4jake@gmail.com', // generated ethereal user
        pass: 'testJake4!!'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Nodemailer Contact" <test4jake@gmail.com>', // sender address
      to: 'test4jake@gmail.com', // list of receivers
      subject: 'Node Contact Request', // Subject line
      text: 'Hello world?', // plain text body
      html: output // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('contact', {msg:'Email has been sent'});
  });
  });


// // // POST route from contact form
// app.post('/contact', function (req, res) {
//   let mailOpts, smtpTrans;
//   smtpTrans = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true,
//     auth: {
//       user: 'test4jake@gmail.com',
//       pass: 'testJake4!!'
//     },
//     tls:{
//     	rejectUnauthorized: false
//     }
//   });
//   mailOpts = {
//     from: req.body.name + ' &lt;' + req.body.email + '&gt;',
//     to: 'test4jake@gmail.com',
//     subject: 'New message from contact form',
//     text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
//   };
//   smtpTrans.sendMail(mailOpts, function (error, response) {
//     if (error) {
//       res.render('contact-failure');
//     }
//     else {
//       res.render('contact-success');
//     }
//   });
// });



app.listen(3001);