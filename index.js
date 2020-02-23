const fs = require("fs");

// BLOCKING CODE (SYNCHRONOUS)
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// const textOut = `Hello, we the this about it: ${textIn} \nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File written.");

// NON BLOCKING CODE (ASYNC)
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
	// async here, arg1 filepath, arg2 cb function to run on completion. file encoding type is unneeded but doing it just cuz
	// cb func args = error and actual data
	fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
		console.log(data2);
		fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
			console.log(data3);
		});
	});
});
console.log('Will read file');