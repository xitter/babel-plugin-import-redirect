import {transformFile} from "babel-core";
import importRedirect from "../../src";

export default function (filename, options = {}) {
	// console.log(filename);
	// console.log("DIRNAME", __dirname);
	return new Promise((resolve, reject) => {
		transformFile(filename, {
			babelrc: false,
			plugins: [
				[importRedirect, options]
			]
		}, function (err, out) {
			if(err) return reject(err);
			
			// TODO: reject when out is undefined
			resolve(out.code);
		});
	});
}