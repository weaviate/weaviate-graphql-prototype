module.exports = {
	classResolver: function(className) {
		list = []
		for(var i=0; i < data.length; i++){
			if(data[i].class == className){
				list.push(data[i])
			}
		}
		return list
 	},
 	resolvePinPoint: function(args) {
		list = []
		for(var i=0; i < data.length; i++){
			if(data[i].class == args._classes[0]){
				list.push(data[i])
			}
		}
		return list
	}
}

var data = [
	{
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
		"toCity": "stringggggggggggg",
		"fromCity": {
			"class": "City",
			"uuid": "9f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
			"name": "Amsterdam",
			"latitude": 25.4,
			"population": "1800000",
			"isCapital": true,
		}
	}
]



// var weaviate_data = {"things": [
// 	{
// 		"class": "City",
// 		"uuid": "9f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
// 		"schema": {
// 			"name": "Amsterdam",
// 			"latitude": 25.4,
// 			"population": "1800000",
// 			"isCapital": true,
// 		}
// 	}, 	{
// 		"class": "City",
// 		"uuid": "6f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
// 		"schema": {
// 			"name": "Rotterdam",
// 			"latitude": 95.4,
// 			"population": "1300000",
// 			"isCapital": false,
// 		}
// 	}, 	{
// 		"class": "Person",
// 		"uuid": "8f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
// 		"schema": {
// 			"livesIn": {
//                 "cref": "9f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
//                 "type": "Thing"
//             },
// 			"birthday": "01-02-1996",
// 		}
// 	}, 	{
// 		"class": "MoveAction",
// 		"uuid": "7f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
// 		"schema": {
// 			"Person": {
//                 "cref": "8f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
//                 "type": "Thing"
//             },
// 			"ToCity": {
//                 "cref": "6f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
//                 "type": "Thing"
//             },
// 			"FromCity": {
//                 "cref": "9f4b3ed1-78d1-b6df-d584-3c8045c85b1f",
//                 "type": "Thing"
// 			}
// 		}
// 	}
// ]}