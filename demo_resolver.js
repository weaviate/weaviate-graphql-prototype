module.exports = {
	// classResolver: function(className) {
	// 	list = []
	// 	for(var i=0; i < data.all.length; i++){
	// 		if(data.all[i].class == className){
	// 			list.push(data.all[i])
	// 		}
	// 	}
	// 	return list
 	// },
 	// resolvePinPoint: function(args) {
	// 	list = []
	// 	for(var i=0; i < data.length; i++){
	// 		if(data[i].class == args._classes[0]){
	// 			list.push(data[i])
	// 		}
	// 	}
	// 	return list
	// },
	resolveConvertedFetch: function(args) {
		if (!args){
			return data.all
		}
		for (var key in args) {
			switch (key) {
				case "EQ":
					return resolve_EQ(args.EQ)
				case "NEQ": 
					return resolve_NEQ(args.NEQ)
				case "IE":
					return resolve_IE(args.IE)
			}
		}

		
   },
   rootClassResolver: function(return_data, className) {
	   // return data
	   var list = []
	   for(var i=0; i < return_data.length; i++){
		   if(return_data[i].class == className){
			   list.push(return_data[i])
		   }
	   }
	   return list
   }
}


var resolve_EQ = function (filters) {
	// loop over filter EQ list
	var return_list = []
	for(var i=0; i < filters.length; i++){
		var path = filters[i].path
		var value = filters[i].value
		
		var operatorlist = [">", "<", "=>", "<=", ">=", "=<"]

		if (!isNaN(value)) { // value is a number
			value = parseFloat(value)
		} else if (value.toLowerCase() == "true") {
			value = true
		} else if (value.toLowerCase() == "false") {
			value = false
		} else if (value == null) {
			console.log(value)
		}
		
		var object_list = data[path[0]]

		// loop over things/actions in list
		for(var j=0; j < object_list.length; j++) {
			var object = object_list[j]

			for (var p=1; p < path.length; p++) { // loop over rest of items in path
				if (p % 2 == 0) { // path item is property (or: string starts with small letter)
					if (p == (path.length - 1)) { // if last item in path list 
						if (value == object[path[p]] || value == String(object[path[p]]).toLowerCase()) { // if property value is same as path prop object value
							return_list.push(object_list[j])
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
	}
	return return_list
}

var resolve_NEQ = function (filters) {
	// loop over filter NEQ list
	var return_list = []
	for(var i=0; i < filters.length; i++){
		var path = filters[i].path
		var value = filters[i].value

		if (!isNaN(value) && !isNaN(parseFloat(value))) { // value is a number
			value = parseFloat(value)
		} else if (value == null || value == "null" || value == undefined || value == "undefined") {
			value = null
		} else if (value.toLowerCase() == "true") {
			value = true
		} else if (value.toLowerCase() == "false") {
			value = false
			console.log(value)
		}

		var object_list = data[path[0]]
		var return_list = Object.assign([], object_list)

		// loop over things/actions in list
		for(var j=0; j < object_list.length; j++) {
			var object = object_list[j]

			for (var p=1; p < path.length; p++) { // loop over rest of items in path
				if (p % 2 == 0) { // path item is property (or: string starts with small letter)
					if (p == (path.length - 1)) { // if last item in path list 
						if (value == object[path[p]] || value == String(object[path[p]]).toLowerCase()) { // if property value is same as path prop object value
							var index = return_list.indexOf(object_list[j])
							return_list.splice(index, 1)
							//return_list.push(object_list[j])
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
	}
	return return_list
}


var resolve_IE = function (filters) {
	// loop over filter EQ list
	var return_list = []
	for(var i=0; i < filters.length; i++){
		var path = filters[i].path
		var value = filters[i].value
		const operatorlist = [">", "<", "=>", "<=", ">=", "=<"]

		if (operatorlist.includes(value[0])) {
			var operator = value[0]
			var number = parseFloat(value.substring(1))
		}

		if (!isNaN(value)) { // value is a number
			value = parseFloat(value)
		} else if (value.toLowerCase() == "true") {
			value = true
		} else if (value.toLowerCase() == "false") {
			value = false
		} else if (value == null) {
			console.log(value)
		}
		
		var object_list = data[path[0]]

		// loop over things/actions in list
		for(var j=0; j < object_list.length; j++) {
			var object = object_list[j]

			for (var p=1; p < path.length; p++) { // loop over rest of items in path
				if (p % 2 == 0) { // path item is property (or: string starts with small letter)
					if (p == (path.length - 1)) { // if last item in path list 
						if (operator == ">") {
							if (parseFloat(object[path[p]]) > number) {
								return_list.push(object_list[j])
							}
						} else if (operator == "<" || operator == "<") {
							if (parseFloat(object[path[p]]) < number) {
								return_list.push(object_list[j])
							}
						} else if (operator == "=>" || operator == ">=") {
							if (parseFloat(object[path[p]]) >= number) {
								return_list.push(object_list[j])
							}
						} else if (operator == "=<" || operator == "<=") {
							if (parseFloat(object[path[p]]) <= number) {
								return_list.push(object_list[j])
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
	}
	return return_list
}



// object - list - objects (things) - strings or objects
const data = {
	"all": [{
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
		"toCity": "Utrecht",
		"fromCity": {
			"class": "City",
			"uuid": "9f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
			"name": "Amsterdam",
			"latitude": 25.4,
			"population": "1800000",
			"isCapital": true,
		}
	}],
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
		"uuid": "8f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
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
		"toCity": "Utrecht",
		"fromCity": {
			"class": "City",
			"uuid": "9f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
			"name": "Amsterdam",
			"latitude": 25.4,
			"population": "1800000",
			"isCapital": true,
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