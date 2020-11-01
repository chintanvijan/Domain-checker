var dns = require("dns");
const express = require("express");

const app = express();
var bodyParser = require('body-parser');
var emailCheck = require('email-check');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// app.set('views', "./views");
app.set('view engine','ejs');
app.use(express.static('static'))

function checkAvailable(name,callback) {
  t = dns.resolve4(name).addErrback(function(e) {
    if (e.errno == dns.NXDOMAIN) callback(name);
  })
  console.log(t);
}



app.post('/',function(req,res){
	domain = req.body.domain;
	// checkAvailable(domain,console.log)

	dns.resolve4(domain, function (err, addresses) {
	  if (err) {
	  	t = false;
	  	console.log('N/A');
	  	res.render("index",{status:t});
	  }
	 else{
	 	console.log('addresses: ' + JSON.stringify(addresses));
	 	t = true;

	 	addresses.forEach(function (a) {
	 	  dns.reverse(a, function (err, domains) {
	 	    if (err) {
	 	      console.log('reverse for ' + a + ' failed: ' +
	 	        err.message);
	 	    } else {
	 	      console.log('reverse for ' + a + ': ' +
	 	        JSON.stringify(domains));
	 	    }
	 	  });
	 	});
	 	res.render("index",{status:t});
	 }
	  
	 
	  
	});

	console.log(domain);
	
});

app.get('/',function(req,res){
	res.render("index");
}).listen(process.env.PORT || 5000);