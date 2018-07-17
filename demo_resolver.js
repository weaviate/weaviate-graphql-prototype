const _ = require('lodash');

const solve_nested_filter = function (filtername, filters, operator) {
	var return_data = {}
	var and_result = _.clone(data);
	for (var filter in filters) {
		for (var key in filters[filter]) {
			if (key == "AND") {
				var result = solve_nested_filter(filtername, filters[filter][key], "AND")
			}
			else if (key == "OR") {
				var result = solve_nested_filter(filtername, filters[filter][key], "OR")
				return_data[key] = _.union(result[key], return_data[key])
			}
			else { // no AND or OR filter given, go directly to path/value
				if (filtername == "EQ") {
					var result = resolve_EQ(filters[filter])
				} 
				else if (filtername == "NEQ") {
					var result = resolve_NEQ(filters[filter])
				} 
				else if (filtername == "IE") {
					var result = resolve_IE(filters[filter])
				}
				break;
			}
		}
		if (operator == "OR") {
			for (var key in result) {
				return_data[key] = _.union(result[key], return_data[key])
			}
		} else {  // AND
			for (var key in result) {
				if (and_result[key] !== undefined) {
					and_result[key] = result[key].filter(value => -1 !== and_result[key].indexOf(value));
				}
			}
			return_data = and_result
		}
	}
	return return_data
}


const solve_filter = function (filters, operator) {
	var return_data = {}
	var and_result = _.clone(data);
	for (var filter in filters) {
		switch (filter) {
			case "AND":
				var result = solve_filter(filters.AND, "AND")
				return result
			case "OR":
				var result = solve_filter(filters.OR, "OR")
				break;
			case "EQ":
				var result = solve_nested_filter("EQ", filters.EQ, "AND")
				break;
			case "NEQ":
				var result = solve_nested_filter("NEQ", filters.NEQ, "AND")
				break;
			case "IE":
				var result = solve_nested_filter("IE", filters.IE, "AND")
				break;
		}
		if (operator == "OR") {
			return_data[key] = _.union(result[key], return_data[key])
		} else {  // AND
			for (var key in result) {
				if (and_result[key] !== undefined) {
					and_result[key] = result[key].filter(value => -1 !== and_result[key].indexOf(value));
				}
			}
			return_data = and_result
		}
	}
	return return_data
}


module.exports = {
	resolveConvertedFetch: function(filters) {
		return solve_filter(filters, "AND")
   },
   rootClassResolver: function(return_data, className, args) {
	   // return data
	   var list = []
	   for(var i=0; i < return_data.length; i++){
		   if(return_data[i].class == className){
			   list.push(return_data[i])
		   }
	   }
	   if (args._limit) {
		   list = list.splice(0, args._limit)
	   }
	   if (args._skip) {
		   list = list.splice(args._skip)
	   }
	   return list
   },
   metaDataResolver: function(return_data, className, args, _maxArraySize) {
	   // return data
	   return meta_data[0]
	   var list = []
	   for(var i=0; i < return_data.length; i++){
		   if(return_data[i].class == className){
			   list.push(meta_data.Meta[0].Things)
			   return meta_data.Meta[0].Things
		   }
	   }
	   return list
   }
}


var resolve_EQ = function (filter) {
	// loop over filter EQ list
	var return_list = []
	var return_array = {}

	var path = filter.path
	var value = filter.value
	
	var new_list = []

	if (!isNaN(value)) { // value is a number
		value = parseFloat(value)
	} else if (value.toLowerCase() == "true") {
		value = true
	} else if (value.toLowerCase() == "false") {
		value = false
	} // else if value == null
	
	var object_list = data[path[0]]

	// loop over things/actions in list
	for(var j=0; j < object_list.length; j++) {
		var object = object_list[j]

		for (var p=1; p < path.length; p++) { // loop over rest of items in pathy
			if (path[p][0] !== path[p][0].toUpperCase()) { // path item is property (or: string starts with small letter)
				if (p == (path.length - 1)) { // if last item in path list 
					if (value == object[path[p]] || value == String(object[path[p]]).toLowerCase()) { // if property value is same as path prop object value
						new_list = _.union(new_list, [object_list[j]])
					}
				} else {
					object = object[path[p]]
				}
				continue
			}
			else if (object.class === path[p]) {
				continue
			}
			else {break}
		}
	}
	return_array[path[0]] = _.union(new_list, return_array[path[0]])
	return return_array
}

var resolve_NEQ = function (filter) {
	// loop over filter NEQ list
	var return_list = []

	var path = filter.path
	var value = filter.value

	if (!isNaN(value) && !isNaN(parseFloat(value))) { // value is a number
		value = parseFloat(value)
	} else if (value == null || value == "null" || value == undefined || value == "undefined") {
		value = null
	} else if (value.toLowerCase() == "true") {
		value = true
	} else if (value.toLowerCase() == "false") {
		value = false
	}

	var object_list = data[path[0]]
	var short_list = Object.assign([], object_list)

	// loop over things/actions in list
	for(var j=0; j < object_list.length; j++) {
		var object = object_list[j]

		for (var p=1; p < path.length; p++) { // loop over rest of items in path
			if (path[p][0] !== path[p][0].toUpperCase()) { // path item is property (or: string starts with small letter)
				if (p == (path.length - 1)) { // if last item in path list 
					if (value == object[path[p]] || value == String(object[path[p]]).toLowerCase()) { // if property value is same as path prop object value
						var index = short_list.indexOf(object_list[j])
						short_list.splice(index, 1)
					}
				} else {
					object = object[path[p]]
				}
				continue
			}
			else if (object.class === path[p]) {
				continue
			}
			else {break}
		}
	}
	return_list = _.union(return_list, short_list)
	var return_array = {}
	return_array[path[0]] = return_list
	return return_array
}

var resolve_IE = function (filters) {
	// loop over filter EQ list
	var return_list = []
	var path = filters.path
	var value = filters.value
	const operatorlist = [">", "<", "=>", "<=", ">=", "=<"]

	if (operatorlist.includes(value.substring(0,2))) {
		var operator = value.substring(0,2)
		var number = parseFloat(value.substring(1))
	} else if (operatorlist.includes(value.substring(0,1))){
		var operator = value.substring(0,1)
		var number = parseFloat(value.substring(1))
	}

	if (!isNaN(value)) { // value is a number
		value = parseFloat(value)
	} else if (value.toLowerCase() == "true") {
		value = true
	} else if (value.toLowerCase() == "false") {
		value = false
	}
	// else if (value == null) {
	// 	console.log(value)
	// }
	
	var object_list = data[path[0]]

	// loop over things/actions in list
	for(var j=0; j < object_list.length; j++) {
		var object = object_list[j]

		for (var p=1; p < path.length; p++) { // loop over rest of items in path
			if (path[p][0] !== path[p][0].toUpperCase()) { // path item is property (or: string starts with small letter)
				if (p == (path.length - 1)) { // if last item in path list 
					if (operator == ">") {
						if (parseFloat(object[path[p]]) > number) {
							//return_list.push(object_list[j])
							return_list = _.union(return_list, [object_list[j]])
						}
					} else if (operator == "<" || operator == "<") {
						if (parseFloat(object[path[p]]) < number) {
							//return_list.push(object_list[j])
							return_list = _.union(return_list, [object_list[j]])
						}
					} else if (operator == "=>" || operator == ">=") {
						if (parseFloat(object[path[p]]) >= number) {
							//return_list.push(object_list[j])
							return_list = _.union(return_list, [object_list[j]])
						}
					} else if (operator == "=<" || operator == "<=") {
						if (parseFloat(object[path[p]]) <= number) {
							//return_list.push(object_list[j])
							return_list = _.union(return_list, [object_list[j]])
						}
					}

				} else {
					object = object[path[p]]
				}
				continue
			}
			else if (object.class === path[p]) {
				continue
			}
			else {break}
		}
	}
	var return_array = {}
	return_array[path[0]] = return_list
	return return_array
}


const meta_data = [{
	"class": "City",
	"meta": {
		"counter": 2,
		"pointing": {
			"to": 3,
			"from": 0
		}
	},
	"name": {
		"type": "string", 
		"counter": 2,
		"topOccurrences": [{
			"value": "Amsterdam", 
			"occurs": 1
		}, {
			"value": "Rotterdam", 
			"occurs": 1
		}]
	},
	"population": {
		"type": "int", 
		"lowest": 1300000, 
		"total": 2, 
		"highest": 1800000,
		"average": 1550000
	},
	"isCapital": {
		"type": "boolean", 
		"total": 1 // total true
	}
}]


// object - list - objects (things) - strings or objects
const data = {
	"Things": [{
		"class": "City",
		"uuid": "9f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
		"name": "Amsterdam",
		"latitude": 25.4,
		"population": "1800000",
		"isCapital": true,
		}, 	{
		"class": "City",
		"uuid": "6f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
		"name": "Rotterdam",
		"latitude": 95.4,
		"population": "1300000",
		"isCapital": false,
	}, 	{
		"class": "Person",
		"uuid": "8f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
		"livesIn": {
			"class": "City",
			"uuid": "9f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
			"name": "Amsterdam",
			"latitude": 25.4,
			"population": "1800000",
			"isCapital": true,
		},
		"birthday": "01-02-1996",
	}, 	{
		"class": "Person",
		"uuid": "8f4b3ed1-78d1-b6df-d584-3c8045c85b5f",
		"livesIn": {
			"class": "City",
			"uuid": "6f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
			"name": "Rotterdam",
			"latitude": 95.4,
			"population": "1300000",
			"isCapital": false,
		},
		"birthday": "11-12-1986",
	}, 	{
		"class": "Person",
		"uuid": "8f4b3ed1-78d1-b6df-d584-3c8045asdfjk",
		"livesIn": {
			"class": "Person",
			"uuid": "8f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
			"livesIn": {
				"class": "City",
				"uuid": "9f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
				"name": "Amsterdam",
				"latitude": 25.4,
				"population": "1800000",
				"isCapital": true,
			},
			"birthday": "01-02-1996",
		},
		"birthday": "01-02-1996",
	}],
	"Actions": [{
		"class": "MoveAction",
		"uuid": "7f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
		"person": {
			"class": "Person",
			"uuid": "8f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
			"livesIn": {
				"class": "City",
				"uuid": "9f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
				"name": "Amsterdam",
				"latitude": 25.4,
				"population": "1800000",
				"isCapital": true,
			},
			"birthday": "01-02-1996",
		},
		"toCity": {
			"class": "City",
			"uuid": "6f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
			"name": "Rotterdam",
			"latitude": 95.4,
			"population": "1300000",
			"isCapital": false,
		},
		"fromCity": {
			"class": "City",
			"uuid": "9f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
			"name": "Amsterdam",
			"latitude": 25.4,
			"population": "1800000",
			"isCapital": true,
		}
	}, {
		"class": "MoveAction",
		"uuid": "7f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
		"person": {
			"class": "Person",
			"uuid": "8f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
			"livesIn": {
				"class": "City",
				"uuid": "9f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
				"name": "Amsterdam",
				"latitude": 25.4,
				"population": "1800000",
				"isCapital": true,
			},
			"birthday": "01-02-1996",
		},
		"toCity": {
			"class": "City",
			"uuid": "9f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
			"name": "Amsterdam",
			"latitude": 25.4,
			"population": "1800000",
			"isCapital": true,
		},
		"fromCity": {
			"class": "City",
			"uuid": "6f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
			"name": "Rotterdam",
			"latitude": 95.4,
			"population": "1300000",
			"isCapital": false,
		}
	}]
}


/*
var weaviate_data = {"things": [
	{
		"class": "City",
		"uuid": "9f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
		"schema": {
			"name": "Amsterdam",
			"latitude": 25.4,
			"population": "1800000",
			"isCapital": true,
		}
	}, 	{
		"class": "City",
		"uuid": "6f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
		"schema": {
			"name": "Rotterdam",
			"latitude": 95.4,
			"population": "1300000",
			"isCapital": false,
		}
	}, 	{
		"class": "Person",
		"uuid": "8f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
		"schema": {
			"livesIn": {
                "cref": "9f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
                "type": "Thing"
            },
			"birthday": "01-02-1996",
		}
	}, 	{
		"class": "MoveAction",
		"uuid": "7f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
		"schema": {
			"Person": {
                "cref": "8f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
                "type": "Thing"
            },
			"ToCity": {
                "cref": "6f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
                "type": "Thing"
            },
			"FromCity": {
                "cref": "9f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
                "type": "Thing"
			}
		}
	}
]}
*/