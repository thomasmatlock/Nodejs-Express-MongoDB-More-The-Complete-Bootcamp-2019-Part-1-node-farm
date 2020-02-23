const fs = require("fs");
const http = require("http");
const url = require("url");

////////////////////////
// FILES

// BLOCKING CODE (SYNCHRONOUS)
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// const textOut = `Hello, we the this about it: ${textIn} \nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written.");

// NON BLOCKING CODE (ASYNC)
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
// 	// async here, arg1 filepath, arg2 cb function to run on completion. file encoding type is unneeded but doing it just cuz
// 	// cb func args = error and actual data
// 	// if (err) return console.log('Error!');
// 	fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
// 		// console.log(data2);
// 		fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
// 			// console.log(data3);
// 			fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
// 				console.log('Your file has been written!');

// 				if (err) {
// 					console.log(err);
// 				}
// 			})
// 		});
// 	});
// });
// console.log('Will read file');

///////////////////////
// SERVER

const replaceTemplate = (temp, product) => {
	// template gets searched for strings and replaced with the json element values
	// console.log(product);
	
	let output = temp.replace(/{%PRODUCTNAME}/g, product.productName); // replaces all placeholders in template with actual dataObj values. Use regex to find all instances matching ${PRODUCTNAME}
	output = output.replace(/{%IMAGE}/g, product.image);
	output = output.replace(/{%PRICE}/g, product.price);
	output = output.replace(/{%FROM}/g, product.from);
	output = output.replace(/{%NUTRIENTS}/g, product.nutrients);
	output = output.replace(/{%QUANTITY}/g, product.quantity);
	output = output.replace(/{%DESCRIPTION}/g, product.description);
	output = output.replace(/{%ID}/g, product.id);
	if (!product.organic) output = output = output.replace(/{%NOT_ORGANIC}/g, 'not-organic');
	// console.log(output);
	
	return output;
};

// SYNC
const tempOverview = fs.readFileSync(
	`${__dirname}/templates/template-overview.html`,
	"utf-8"
);
const tempCard = fs.readFileSync(
	`${__dirname}/templates/template-card.html`,
	"utf-8"
);
const tempProduct = fs.readFileSync(
	`${__dirname}/templates/template-product.html`,
	"utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

// ASYNC
const server = http.createServer((req, res) => {
	const pathName = req.url;

	// Overview page
	if (pathName === "/" || pathName === "/overview") {
		res.writeHead(200, {
			"content-type": "text/html"
		});

		// loop through each el in our json file, calling a function for each one
		// pass it templateCard, and the json element, basically the placeholder html, and the json values we want to insert into it
		// this creates an array which we combine into one string with .join
		const cardsHTML = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
		// console.log(cardsHTML);
		const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML); // replaces placeholder with updated html that contains replaced placholders
		// change cardsHTML from array to big string

		

		res.end(output);

		// Product page
	} else if (pathName === "/product") {
		res.end("This is the PRODUCT page.");

		// API
	} else if (pathName === "/api") {
		res.writeHead(200, {
			"content-type": "application/json"
		});
		res.end(data);

		// Not found
	} else {
		res.writeHead(404, {
			"Content-type": "text/html",
			"my-own-content": "Hellooo out there"
		});
		res.end("<h1>Page not found!</h1>");
	}
});

// args below: port, host address (aka local current computer, usually)
server.listen(8000, "127.0.0.1", () => {
	console.log(`Server listening on port 8000...`);
});