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
	let splitpath = path.split('/');

	let keyword    = 'advancement';
	let req        = false;
	let start      = '1';
	let countPages = false;
	let showData   = false;
	let pageCount  = 0;

//	console.log ( splitpath );
//  https://uscdirectory.usc.edu/web/directory/faculty-staff/#pvid=scrj7mg5
	if( splitpath[1] ) {
		keyword = splitpath[1];
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
			await page.goto('https://uscdirectory.usc.edu/web/directory/faculty-staff/#pvid='+keyword);
			await page.waitForTimeout(1000);
			let pageHasError = await page.$eval(".results .error" );
//			console.log( 'Page count: ' + pageCount );

			if( showData ) {
				if( pageHasError ) {
					response.end( 'error' );
					console.log( 'Missing: ', keyword );				
					browser.close();
				} else {
					response.end( 'no error!' );
					browser.close();
				}
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



