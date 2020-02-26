const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

console.log('hi there');
console.log(slugify);

const replaceTemplate = require('./modules/replaceTemplate');

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

// SYNC (single use on startup)
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
// console.log(dataObj);
// console.log(slugify(dataObj[1].productName, { lower: true }));

const slugs = dataObj.map(el =>
  slugify(el.productName, {
    lower: true
  })
); // map runs through obj and returns
console.log(slugs);

// ASYNC (multi use after startup, to be used indefinitely)
const server = http.createServer((req, res) => {
  // console.log(req.url); // this is anything following the port or slash
  // console.log(url.parse(req.url, true)); // this parses the url into an obj, must say true for it to do so// querystring is any part of URL starting with ? and following it
  const { query, pathname } = url.parse(req.url, true);
  // console.log(query.id, pathname);

  // const pathname = req.url;

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'content-type': 'text/html'
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
  } else if (pathname === '/product') {
    res.writeHead(200, {
      'content-type': 'text/html'
    });
    const product = dataObj[query.id];
    output = replaceTemplate(tempProduct, product);
    // console.log(product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'content-type': 'application/json'
    });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-content': 'Hellooo out there'
    });
    res.end('<h1>Page not found!</h1>');
  }
});

// args below: port, host address (aka local current computer, usually)
server.listen(8000, '127.0.0.1', () => {
  console.log(`Server listening on port 8000...`);
});
