module.exports = replaceTemplate = (template, product) => {
	// template gets searched for strings and replaced with the json element values
	// console.log(product);

	let output = template.replace(/{%PRODUCTNAME}/g, product.productName); // replaces all placeholders in template with actual dataObj values. Use regex to find all instances matching ${PRODUCTNAME}
	output = output.replace(/{%IMAGE}/g, product.image);
	output = output.replace(/{%PRICE}/g, product.price);
	output = output.replace(/{%FROM}/g, product.from);
	output = output.replace(/{%NUTRIENTS}/g, product.nutrients);
	output = output.replace(/{%QUANTITY}/g, product.quantity);
	output = output.replace(/{%DESCRIPTION}/g, product.description);
	output = output.replace(/{%ID}/g, product.id);
	if (!product.organic)
		output = output = output.replace(/{%NOT_ORGANIC}/g, "not-organic");
	// console.log(output);

	return output;
};