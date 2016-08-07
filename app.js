var stringify = require("./lib/json-stringify-debug");

// Shape - superclass
function Shape() {
	this.x = 3;
	this.y = 4;
}
Shape.prototype.move = function (x, y) {
  this.x += x;
  this.y += y;
  console.info('Shape moved.');
};
function Rectangle() {
  Shape.call(this); // call super constructor.
		this.z = 14;
}
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle
Rectangle.prototype.move = function (x, y) {
  this.x += x;
  this.y += y;
  console.info('Shape moved.');
};

var recursion = { a: "13" };
recursion.rec = recursion;

var recursion1 = [1, 2];
recursion1.push(recursion1);



var test = [recursion, recursion1, new Rectangle(), {}, true, "aaa", [], [1, "w"], { x: null, a: [3, "d", undefined, null, { m: 34 }] }, new Error("msg"), new Date(2006, 0, 2, 15, 4, 5)];
test.forEach(function (i) {
	console.log("");
	console.log(i);
	var json = stringify(i, { maxDepth: 20, inherited: false, enumerable: "all", mergeInherited: true, purge: true });
	console.dir(json);
	console.dir(JSON.parse(json));
});

