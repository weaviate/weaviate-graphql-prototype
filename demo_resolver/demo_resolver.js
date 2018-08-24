const _ = require('lodash');
// file system for reading files
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./demo_resolver/demo_data.json', 'utf8'));


var resolve_IE = function (operator, path, value) {
	// loop over filter EQ list
	var return_list = []	
	var object_list = data[path[0]]

	// loop over things/actions in list
	for(var j=0; j < object_list.length; j++) {
		var object = object_list[j]

		for (var p=1; p < path.length; p++) { // loop over rest of items in path			
			if (object.class === path[p]) {
				continue
			}
			else {
				for (var key in object) {
					if (key == path[p] || (key.toLowerCase() == path[p].toLowerCase())) {
						if (p == (path.length - 1)) { // if last item in path list 
							if (operator == "GreaterThan") {
								if (parseFloat(object[path[p]]) > value) {
									//return_list.push(object_list[j])
									return_list = _.union(return_list, [object_list[j]])
								}
							} else if (operator == "LessThan") {
								if (parseFloat(object[path[p]]) < value) {
									//return_list.push(object_list[j])
									return_list = _.union(return_list, [object_list[j]])
								}
							} else if (operator == "GreaterThanEqual") {
								if (parseFloat(object[path[p]]) >= value) {
									//return_list.push(object_list[j])
									return_list = _.union(return_list, [object_list[j]])
								}
							} else if (operator == "LessThanEqual") {
								if (parseFloat(object[path[p]]) <= value) {
									//return_list.push(object_list[j])
									return_list = _.union(return_list, [object_list[j]])
								}
							}
						} else {
							if (path[p][0] !== path[p][0].toUpperCase()) {
								object = object[path[p]]
							}
							else { // object is undefined because capital differences
								prop = path[p][0].toLowerCase() + path[p].substring(1)
								object = object[prop]
							}
						}
						continue
					}
				}
			}
		}
	}
	var return_array = {}
	return_array[path[0]] = return_list
	return return_array
}


var resolve_NEQ = function (path, value) {
	// loop over filter NEQ list
	var return_list = []
	var object_list = data[path[0]]
	var short_list = Object.assign([], object_list)

	// loop over things/actions in list
	for(var j=0; j < object_list.length; j++) {
		var object = object_list[j]

		for (var p=1; p < path.length; p++) { // loop over rest of items in path
			if (object.class === path[p]) {
				continue
			}
			else { // path item is property (or: string starts with small letter)
				for (var key in object) {
					if (key == path[p] || (key.toLowerCase() == path[p].toLowerCase())) {
						if (p == (path.length - 1)) { // if last item in path list 
							if (value == object[path[p]] || value == String(object[path[p]]).toLowerCase()) { // if property value is same as path prop object value
								var index = short_list.indexOf(object_list[j])
								short_list.splice(index, 1)
							}
						} else {
							if (path[p][0] !== path[p][0].toUpperCase()) {
								object = object[path[p]]
							}
							else { // object is undefined because capital differences
								prop = path[p][0].toLowerCase() + path[p].substring(1)
								object = object[prop]
							}
						}
						continue
					}
				}
			}
		}
	}
	return_list = _.union(return_list, short_list)
	var return_array = {}
	return_array[path[0]] = return_list
	return return_array
}


var resolve_EQ = function (path, value) {
	// loop over filter EQ list
	var return_array = {}
	var new_list = []

	var object_list = data[path[0]]

	// loop over things/actions in list
	for(var j=0; j < object_list.length; j++) {
		var object = object_list[j]

		for (var p=1; p < path.length; p++) { // loop over rest of items in path
			if (object.class === path[p]) {
				continue
			}
			else { // path item is property (or: string starts with small letter)
				for (var key in object) {
					if (key == path[p] || (key.toLowerCase() == path[p].toLowerCase())) {
						if (p == (path.length - 1)) { // if last item in path list 
							if (value == object[path[p]] || value == String(object[path[p]]).toLowerCase()) { // if property value is same as path prop object value
								new_list = _.union(new_list, [object_list[j]])
							}
						} else {
							if (path[p][0] !== path[p][0].toUpperCase()) {
								object = object[path[p]]
							}
							else { // object is undefined because capital differences
								prop = path[p][0].toLowerCase() + path[p].substring(1)
								object = object[prop]
							}
						}
						continue
					}
				}
			}
		}
	}
	return_array[path[0]] = _.union(new_list, return_array[path[0]])
	return return_array
}


const solve_path = function (operator, path, value) {

	if (["GreaterThan", "GreaterThanEqual", "LessThan", "LessThanEqual"].includes(operator)) {
		// IE
		return resolve_IE(operator, path, value)
	}
	else if (operator == "Equal") {
		// EQ
		return resolve_EQ(path, value)
	}
	else if (operator == "Not" || operator == "NotEqual") {
		// NEQ
		return resolve_NEQ(path, value)
	}
}


const solve_operands = function (operator, operands) {
	return_data = {}

	for (var i in operands) {
		operand = operands[i]

		if (operand.operator == 'And' || operand.operator == 'Or') {
			result = solve_operands(operand.operator, operand.operands)
		}
		else if ((operand.operator == 'Not' || operand.operator == 'NotEqual') && operand.operands) {
			result = solve_operands(operand.operator, operand.operands)
		}
		else {
			if (operand.valueString) {
				result = solve_path(operand.operator, operand.path, operand.valueString)
			}
			else if (operand.valueInt) {
				result = solve_path(operand.operator, operand.path, operand.valueInt)
			}
			else if (operand.valueBoolean) {
				result = solve_path(operand.operator, operand.path, operand.valueBoolean)
			}
			else if (operand.valueFloat) {
				result = solve_path(operand.operator, operand.path, operand.valueFloat)
			}
		}

		if (operator == 'And') {
			for (var key in result) {
				if (all_data[key] !== undefined) {
					all_data[key] = result[key].filter(value => -1 !== all_data[key].indexOf(value));
				}
			}
			return_data = all_data
		}
		else if (operator == 'Or') {
			for (var key in result) {
				all_data[key] = _.union(result[key], all_data[key])
			}
			return_data = all_data
		}
		else if (operator == 'Not' || operator == 'NotEqual') {
			for (var key in result) { // list of things and actions
				all_data[key] = _.differenceWith(data[key], result[key], _.isEqual)
			}
			return_data = all_data
		}
	}
	return return_data
}


module.exports = {
	resolveGet: function(filter) {
		all_data = _.clone(data);
		if (filter) {
			if (filter.operator == 'And' || filter.operator == 'Or') {
				return solve_operands(filter.operator, filter.operands)
			}
			else if ((filter.operator == 'Not' || filter.operator == 'NotEqual') && filter.operands) {
				return solve_operands(filter.operator, filter.operands)
			}
			else {
				if (filter.valueString) {
					return solve_path(filter.operator, filter.path, filter.valueString)
				}
				else if (filter.valueInt) {
					return solve_path(filter.operator, filter.path, filter.valueInt)
				}
				else if (filter.valueBoolean) {
					return solve_path(filter.operator, filter.path, filter.valueBoolean)
				}
				else if (filter.valueFloat) {
					return solve_path(filter.operator, filter.path, filter.valueFloat)
				}
			}
		}
		else {
			return data
		}
   },
   rootClassResolver: function(return_data, className, args) {
	   // return data
	   var list = []
	   for(var i=0; i < return_data.length; i++){
		   if(return_data[i].class == className){
			   list.push(return_data[i])
		   }
	   }
	   if (args.after) {
		   list = list.splice(args.after)
	   }
	   if (args.first) {
		   list = list.splice(0, args.first)
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
