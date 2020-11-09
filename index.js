//core module
const fs = require("fs");
const http = require("http");
const url = require("url");
// 3rd party module
const slugify = require("slugify");
// local module or our own module
const replaceTemplate = require("./modules/replaceTemplate");

//Blocking, synchronous way
// const textIn = fs.readFileSync('./final/txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what I know about avocado: ${textIn} \n Created on ${Date.now()}`;
// fs.writeFileSync('./final/txt/output.txt',textOut);
// console.log('File Written!');

// //Non-Blocking, asynchronous way
// fs.readFile('./final/txt/start.txt','utf-8',(err,data1) => {
//     fs.readFile(`./final/txt/${data1}.txt`,'utf-8',(err,data2) => {
//         console.log(data2);
//     });
//    // console.log(data);
// });
// console.log('will read file');

///////////////////////////////////////////////
//SERVER
// const replaceTemplate = (temp, product) => {
//     let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
//     output = output.replace(/{%IMAGE%}/g, product.image);
//     output = output.replace(/{%PRICE%}/g, product.price);
//     output = output.replace(/{%FROM%}/g, product.nutrients);
//     output = output.replace(/{%QUANTITY%}/g, product.quantity);
//     output = output.replace(/{%DESCRIPTION%}/g, product.description);
//     output = output.replace(/{%ID%}/g, product.id);

//     if(!product.organic)  output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
//     return output;
// }

const tempOverview = fs.readFileSync(
	`${__dirname}/final/templates/template-overview.html`,
	"utf-8"
);
const tempCard = fs.readFileSync(
	`${__dirname}/final/templates/template-card.html`,
	"utf-8"
);
const tempProduct = fs.readFileSync(
	`${__dirname}/final/templates/template-product.html`,
	"utf-8"
);
const data = fs.readFileSync(`${__dirname}/final/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
//creating slugs here from the array of data objects i.e. dataObj
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
//console.log(slugs);
//done

const server = http.createServer((req, res) => {
	//console.log(req);
	//console.log(req.url);
	const { query, pathname } = url.parse(req.url, true);
	//const pathName = req.url;
	//overview page
	if (pathname === "/" || pathname === "/overview") {
		res.writeHead(200, { "Content-type": "text/html" });

		const cardsHtml = dataObj
			.map((el) => replaceTemplate(tempCard, el))
			.join("");
		//console.log(cardsHtml);
		const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
		res.end(output);
	}
	//product page
	else if (pathname === "/product") {
		res.writeHead(200, { "Content-type": "text/html" });
		const product = dataObj[query.id];
		const output = replaceTemplate(tempProduct, product);
		res.end(output);
		//console.log(query);
	}
	//api here
	else if (pathname == "/api") {
		// fs.readFile(`${__dirname}/final/dev-data/data.json`,'utf-8', (err,data) =>{
		//     const productData = JSON.parse(data);
		//console.log(productData);
		res.writeHead(200, { "Content-type": "application/json" });
		res.end(data);
		// });
	}
	//NOt found
	else {
		res.writeHead(404, {
			"Content-type": "text/html",
			"my-own-header": "hello-world",
		});
		res.end("<h1>This page not found!</h1>");
	}
	//    res.end("Hello from the server!");
});

server.listen(8000, "127.0.0.1", () => {
	//here the server is listening the 8000 port
	console.log("Listening to requests on port 8000");
});
