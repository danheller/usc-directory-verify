const http = require('http');
const puppeteer = require('puppeteer');
const url  = require('url');
// const path = require('path');
// const fs   = require('fs');

//

const port = process.env.PORT || 10000;

const httpServer = http.createServer((request, response) => {
	// Getting request path
	// by using request.path
	const path = request.url;
	console.log("Request URL: ", path)
	let pvid       = path.replace('/','');
	let req        = false;
	let start      = '1';
	let countPages = false;
	let pageCount  = 0;

//	console.log ( splitpath );
//  https://uscdirectory.usc.edu/web/directory/faculty-staff/#pvid=scrj7mg5
	if( 'undefined' !== typeof pvid ) {
		keyword = String( pvid );
	}

	response.writeHead(200, {'Content-Type': 'text/json'});			

	(async () => {
		let browser;
		browser = await puppeteer.launch({
	//		defaultViewport: {width: 1920, height: 1080},
			headless: true,
	//		ignoreDefaultArgs: ["--disable-extensions"],
			args: [
			"--no-sandbox",
			"--use-gl=egl",
			"--disable-setuid-sandbox",
			],
			ignoreHTTPSErrors: true,
		});

		const page = await browser.newPage();
	//	await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36");

		try {
			await page.goto('https://uscdirectory.usc.edu/web/directory/faculty-staff/#pvid='+pvid);

			const foundElement = await page.waitForSelector('.results .error, .results .single, .results .result');
			const responseMsg = await page.evaluate(el => el.innerText, foundElement);
			if(responseMsg && responseMsg.indexOf('Sorry, we could') != -1 ){ // Your code here 
				response.end( pvid + ' was not found.' );
				browser.close();
			} else if( responseMsg ) {
				response.end( 'This person was found.' );
				browser.close();			
			} else {
				response.end( 'Server running' );
				browser.close();
			}
		} catch(err) {
			console.log(err);
		}

	})();

}).listen(port, () => {
	console.log("Server is running at port " + port);
});



