(function (window) {
	var jsonStringify = JSON.stringify;

	function stringifyDebug(root, options) {

		function def(val, defVal) { return val != null ? val : defVal; }
		var maxDepth = def(options && options.maxDepth, 5);
		var maxArrayLength = def(options && options.maxArrayLength, -1);
		var maxStringLength = def(options && options.maxStringLength, -1);

		var enumerable = def(options && options.enumerable, true);
		var inherited = def(options && options.inherited, false);
		var mergeInherited = def(options && options.mergeInherited, true);
		var purge = def(options && options.purge, false);
		var purgingList = purge ? [] : null;

		function stringifyObject(obj, depth) {
			var result = "{", i, j, prop, protoObj, ownProps, first = true, visibleProps = mergeInherited ? {} : null, objs = [obj];

			if (inherited) {
				protoObj = obj;
				while (protoObj = Object.getPrototypeOf(protoObj)) {
					objs.push(protoObj);
				}
			}

			function stringifyOwned(objs, protoDepth) {
				obj = objs.shift();
				if (obj) {
					if (protoDepth && !mergeInherited) {
						result += (first ? "\"__proto__\":{" : ",\"__proto__\":{");
						first = true;
					}
					ownProps = Object.getOwnPropertyNames(obj);
					for (j = 0; j < ownProps.length; ++j) {
						prop = ownProps[j];
						if ((!visibleProps || visibleProps[prop] !== null) &&
							(enumerable === "all" || obj.propertyIsEnumerable(prop) === enumerable)) {
							result += (first ? "" : ",") + jsonStringify(prop) + ":" + stringify(obj[prop], depth + 1);
							first = false;
							if (visibleProps) {
								visibleProps[prop] = null;
							}
						}
					}
					stringifyOwned(objs, protoDepth + 1);
					if (protoDepth && !mergeInherited) {
						result += "}";
					}
				}
			}
			stringifyOwned(objs, 0);
			return result + "}";
		}
		function stringifyArray(arr, depth) {
			var result = "",
				length = maxArrayLength > 0 ? Math.min(arr.length, maxArrayLength) : arr.length;
			for (var i = 0; i < length; ++i) {
				if (i) {
					result += ",";
				}
				var val = arr[i];
				result += stringify(val === undefined ? null : val, depth + 1);
			}
			return result;
		}

		function stringify(o, depth) {
			switch (typeof (o)) {
				case "undefined":
					return depth == 0 ? undefined : "";
				case "boolean": case "number": case "string":
					return jsonStringify(o);
				case "object": {
					if (o === null) {
						return "null";
					} else {
						if (purgingList) {
							if (purgingList.indexOf(o) >= 0) {
								return "\"purged\""
							}
							purgingList.push(o);
						}
						if (Array.isArray(o)) {
							if (depth >= 0 && depth >= maxDepth) {
								return "\"Array(length=" + o.length + ")\"";
							}
							return "[" + stringifyArray(o, depth) + "]";
						}
						else {
							if (typeof o.toJSON === "function") {
								return "\"" + o.toJSON() + "\"";
							} else if (depth >= 0 && depth >= maxDepth) {
								return "\"Object()\"";
							}
							return stringifyObject(o, depth);
						}

					}
				}
				case "function":
					return depth == 0 ? undefined : "\"function " + o.name + "()\"";
			}
		}
		return stringify(root, 0);
	}


	if (typeof exports !== "undefined") {
		module.exports = stringifyDebug;
	} else if (typeof define === "function" && define.amd) {
		define(function () {
			return stringifyDebug;
		})
	} else {
		JSON.prototype = createNamedRegex;
	}

})(typeof window === "undefined" ? this : window);