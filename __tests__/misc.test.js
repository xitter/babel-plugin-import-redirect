import {compareTranspiled, transpileCode} from "./helpers";

describe('simple export', () => {
	test('should not be changed', () => {
		return compareTranspiled("examples/misc/export_noop");
	});
});

describe('for paths with corresponding redirect of false', () => {
	test('should remove imports without side effects', () => {
		return compareTranspiled("examples/misc/remove_import");
	});
	
	test('should not remove imports with side effects and exports', () => {
		return compareTranspiled("examples/misc/dont_remove_import");
	});
});

describe('for paths with corresponding redirect of object', () => {
	test('should replace require statements with the corresponding objects', () => {
		return compareTranspiled("examples/misc/replace_require");
	});
	
	test('should remove imports without side effects', () => {
		return compareTranspiled("examples/misc/dont_replace_import_but_remove");
	});
	
	test('should replace named imports with the corresponding object\'s properties', () => {
		return compareTranspiled("examples/misc/replace_import");
	});
});

describe('when code is provided not from a file', () => {
	test('assume filename to be <root>/index.js when resolving path', () => {
		const input = `
			import lib from "./lib";
			export { default as lib } from "./lib";
			require("./lib");
			import("./lib").then(module => module.default);
			custom_require_function("./lib");
			SystemJS.import("./lib");
		`;
		
		const options = {
			extraFunctions: ["custom_require_function", "SystemJS.import"],
			redirect: {
				"/examples(/\\w+)*/lib\\.js$" : "./different/lib"
			},
			root: "./examples"
		};
		
		const output = `
import lib from "./different/lib";
export { default as lib } from "./different/lib";
require("./different/lib");
import("./different/lib").then(module => module.default);
custom_require_function("./different/lib");
SystemJS.import("./different/lib");`;
		
		expect(transpileCode(input, options)).toBe(output);
	});
});

