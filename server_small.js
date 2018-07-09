/**
                     __          __                         
_____________  _____/  |_  _____/  |_ ___.__.______   ____  
\____ \_  __ \/  _ \   __\/  _ \   __<   |  |\____ \_/ __ \ 
|  |_> >  | \(  <_> )  | (  <_> )  |  \___  ||  |_> >  ___/ 
|   __/|__|   \____/|__|  \____/|__|  / ____||   __/ \___  >
|__|                                  \/     |__|        \/ 

THIS IS A PROTOTYPE!

Note: you can follow the construction of the Graphql schema by starting underneath: "START CONSTRUCTING THE SERVICE"

*/

// Express for the webserver & graphql
const express = require('express');
const graphqlHTTP = require('express-graphql');
const demoResolver = require('./demo_resolver.js');
const UnionInputType = require('graphql-union-input-type');

// file system for reading files
const fs = require('fs');

// define often used GraphQL constants
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLUnionType,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLString,
  GraphQLID,
  GraphQLList,
} = require('graphql');


/**
 * START - ALL RELATED TO INTERNAL FUNCTION
 */

/**
 *  Create union input value type for converted fetch filter fields
 */

// const ConvertedFetchFilterValueType = UnionInputType({
//   name: "ValueType",
//   inputTypes: [GraphQLString, GraphQLBoolean, GraphQLFloat],
//   resolveType: function resolveType(name) {
//     //console.log(name)
//     if (typeof name === "string") {
//         return GraphQLString;
//     } 
//     else if (typeof name === "boolean") {
//         return GraphQLBoolean;
//     } 
//     else if (typeof name === "number") {
//         return GraphQLFloat;
//     }
//   },
//   typeKey: "name"
// })


/**
 *  Create filter for ConvertedFetch
 */

var filterFields = {
  EQ: { type: new GraphQLList(new GraphQLInputObjectType({ // is path equal to
    name: 'ConvertedFetchFilterEQ',
    description: 'filter where the path end should be equal to the value',
    fields: {
      path: { type: new GraphQLList(GraphQLString) },
      value: { type: GraphQLString }
    }
  }))},
  NEQ: { type: new GraphQLList(new GraphQLInputObjectType({ // path is NOT equal to
    name: 'ConvertedFetchFilterNEQ',
    description: 'filter where the path end should be not equal to the value',
    fields: {
      path: { type: new GraphQLList(GraphQLString) },
      value: { type: GraphQLString }
    }
  }))},
  IE: { type: new GraphQLList(new GraphQLInputObjectType({ //  = InEquality between values.
    name: 'ConvertedFetchFilterIE',
    description: 'filter where the path end should be inequal to the value',
    fields: {
      path: { type: new GraphQLList(GraphQLString) },
      value: { type: GraphQLString }
    }
  }))}
}

/**
 * Create class enum for filter options
 */

function createClassEnum(ontologyThings) {

  var enumValues = {}
  var counter = 0
  // loop through classes
  ontologyThings.classes.forEach(singleClass => {
    // create enum item
    enumValues[singleClass.class] = {"value": singleClass.class}

    counter += 1
  })
  
  var classEnum = new GraphQLEnumType({
    name: 'classEnum',
    description: 'enum type which denote the classes',
    values: enumValues,
  });

  return classEnum
}
 
/**
 * Create arguments for the network function
 */
var argsKeywords = new GraphQLInputObjectType({
  name: "argsKeywords",
  description: "list of keywords and weights",
  fields: {
    keyword: {
      name: "WeaviateNetworkKeywordsKeyword",
      description: "The keyword",
      type: GraphQLString
    },
    weight: {
      name: "WeaviateNetworkKeywordsWeigth",
      description: "The weight",
      type: GraphQLFloat
    }
  }
})

/**
 * create arguments for a search
 */
var propsForArgs = {} //global
function createArgs(item, withKeywords){

  // check if argument name is defined, if not, create it
  if(propsForArgs[item.class] == undefined){

    // empty argument
    propsForArgs[item.class] = {}

    // always certainty
    propsForArgs[item.class]["_certainty"] = {
      type: GraphQLFloat,
      description: "How certain about these values?"
    }
    // always return limit
    propsForArgs[item.class]["_limit"] = {
      type: GraphQLInt,
      description: "define the max returned values."
    }
    // always return skip
    propsForArgs[item.class]["_skip"] = {
      type: GraphQLInt,
      description: "define the amount of values to skip."
    }
  }
  
  return propsForArgs[item.class] // return the prop with the argument

}


/**
 * Create the subclasses of a Thing or Action in the Local function
 */
function createMetaSubClasses(ontologyThings){

  console.log("------START METASUBCLASSES--------")

  var subClasses = {};
  // loop through classes
  ontologyThings.classes.forEach(singleClass => {

    //console.log(singleClass.class)

    // create recursive sub classes
    subClasses[singleClass.class] = new GraphQLObjectType({
      name: singleClass.class + "Meta",
      description: singleClass.description,
      fields: function(){
        // declare props that should be returned
        var returnProps = {}

        returnProps["meta"] = {
          description: "meta information about class object",
          type: new GraphQLObjectType({
            name: singleClass.class + "MetaObj",
            description: "meta information about class object",
            fields: {
              counter: {
                description: "how many class instances are there",
                type: GraphQLInt
              },
              pointing: {
                description: "pointing to and from how many other things",
                type: new GraphQLObjectType({
                  name: singleClass.class + "MetaPointing",
                  description: "pointing to and from how many other things",
                  fields: {
                    to: {
                      description: "how many other classes the class is pointing to",
                      type: GraphQLInt,
                    },
                    from: {
                      description: "how many other classes the class is pointing from",
                      type: GraphQLInt
                    }
                  }
                })
              }
            }
          })
        }
        
        // loop over properties
        singleClass.properties.forEach(singleClassProperty => {
          returntypes = []
          singleClassProperty["@dataType"].forEach(singleClassPropertyDatatype => {
            // if class (start with capital, return Class)
            if(singleClassPropertyDatatype[0] === singleClassPropertyDatatype[0].toUpperCase()){
              returnProps[singleClassProperty.name] = {
                type: new GraphQLObjectType({
                  name: singleClassProperty.name + "Property",
                  description: "Property meta information",
                  fields: {
                    type: {
                      description: "datatype of the property",
                      type: GraphQLString,
                    },
                    counter: {
                      description: "total amount of found instances",
                      type: GraphQLInt,
                    },
                    pointing: {
                      description: "pointing to and from how many other things",
                      type: new GraphQLObjectType({
                        name: singleClassProperty.name + "Property" + "MetaPointing",
                        description: "pointing to and from how many other things",
                        fields: {
                          to: {
                            description: "how many other classes the class is pointing to",
                            type: GraphQLInt,
                          },
                          from: {
                            description: "how many other classes the class is pointing from",
                            type: GraphQLInt
                          }
                        }
                      })
                    }
                  }
                })
              }
            } else if(singleClassPropertyDatatype === "string") {
              returnProps[singleClassProperty.name] = {
                type: new GraphQLObjectType({
                  name: singleClassProperty.name + "Property",
                  description: "Property meta information",
                  fields: {
                    type: {
                      description: "datatype of the property",
                      type: GraphQLString,
                    },
                    counter: {
                      description: "total amount of found instances",
                      type: GraphQLInt,
                    },
                    topOccurrences: {
                      description: "most frequent property values",
                      type: new GraphQLObjectType({
                        name: singleClassProperty.name + "Property" + "TopOccurrences",
                        description: "most frequent property values",
                        fields: {
                          value: {
                            description: "property value of the most frequent properties",
                            type: GraphQLInt
                          },
                          occurs: {
                            description: "number of occurrance",
                            type: GraphQLInt
                          }
                        }
                      })
                    }
                  }
                })
              }
            } else if(singleClassPropertyDatatype === "int" || singleClassPropertyDatatype === "number") {
              returnProps[singleClassProperty.name] = {
                type: new GraphQLObjectType({
                  name: singleClassProperty.name + "Property",
                  description: "Property meta information",
                  fields: {
                    type: {
                      description: "datatype of the property",
                      type: GraphQLString,
                    },
                    lowest: {
                      description: "Lowest value occurrence",
                      type: GraphQLFloat,
                    },
                    highest: {
                      description: "Highest value occurrence",
                      type: GraphQLFloat,
                    },
                    average: {
                      description: "average number",
                      type: GraphQLFloat,
                    },
                    counter: {
                      description: "total amount of found instances",
                      type: GraphQLInt,
                    },
                    sum: {
                      description: "sum of values of found instances",
                      type: GraphQLFloat,
                    }
                  }
                })
              }
            } else if(singleClassPropertyDatatype === "boolean") {
              returnProps[singleClassProperty.name] = {
                type: new GraphQLObjectType({
                  name: singleClassProperty.name + "Property",
                  description: "Property meta information",
                  fields: {
                    type: {
                      description: "datatype of the property",
                      type: GraphQLString,
                    },
                    total_true: {
                      description: "total amount of boolean value is true",
                      type: GraphQLInt,
                    },
                    percentage_true: {
                      description: "percentage of boolean = true",
                      type: GraphQLFloat,
                    },
                    counter: {
                      description: "total amount of found instances",
                      type: GraphQLInt,
                    }
                  }
                })
              }
            } else if(singleClassPropertyDatatype === "date") {
              returnProps[singleClassProperty.name] = {
                description: singleClassProperty.description,
                type: GraphQLString // string since no GraphQL date type exists
              }} else {
              console.error("I DONT KNOW THIS VALUE! " + singleClassProperty["@dataType"][0])
              returnProps[singleClassProperty.name] = {
                description: singleClassProperty.description,
                type: GraphQLString
              }
            }
          })
        });
        return returnProps

       }
    });

  });

  console.log("------DONE METASUBCLASSES--------")

  return subClasses;
}

/**
 * Create the rootclasses of a Thing or Action in the Local function
 */
function createMetaRootClasses(ontologyThings, metaSubClasses){

  console.log("------START METAROOTCLASSES--------")

  var rootClassesFields = {}

  // loop through classes
  ontologyThings.classes.forEach(singleClass => {
    // create root sub classes
    rootClassesFields[singleClass.class] = {
      type: metaSubClasses[singleClass.class],
      description: singleClass.description,
      args: createArgs(singleClass, false),
      resolve(parentValue, args) {
        return demoResolver.metaDataResolver(parentValue.data, singleClass.class, args, parentValue._maxArraySize)
      }
    }

  })

  console.log("------STOP METAROOTCLASSES--------")

  return rootClassesFields

}

/**
 * Create the subclasses of a Thing or Action in the Local function
 */
function createSubClasses(ontologyThings){

  console.log("------START SUBCLASSES--------")

  var subClasses = {};
  // loop through classes
  ontologyThings.classes.forEach(singleClass => {

    //console.log(singleClass.class)

    // create recursive sub classes
    subClasses[singleClass.class] = new GraphQLObjectType({
      name: singleClass.class,
      description: singleClass.description,
      fields: function(){
        // declare props that should be returned
        var returnProps = {}

        // loop over properties
        singleClass.properties.forEach(singleClassProperty => {
          returntypes = []
          singleClassProperty["@dataType"].forEach(singleClassPropertyDatatype => {
            // if class (start with capital, return Class)
            if(singleClassPropertyDatatype[0] === singleClassPropertyDatatype[0].toUpperCase()){
              returntypes.push(subClasses[singleClassPropertyDatatype])
            } else if(singleClassPropertyDatatype === "string") {
              returnProps[singleClassProperty.name] = {
                description: singleClassProperty.description,
                type: GraphQLString
              }
            } else if(singleClassPropertyDatatype === "int") {
              returnProps[singleClassProperty.name] = {
                description: singleClassProperty.description,
                type: GraphQLInt
              }
            } else if(singleClassPropertyDatatype === "number") {
              returnProps[singleClassProperty.name] = {
                description: singleClassProperty.description,
                type: GraphQLFloat
              }
            } else if(singleClassPropertyDatatype === "boolean") {
              returnProps[singleClassProperty.name] = {
                description: singleClassProperty.description,
                type: GraphQLBoolean
              }
            } else if(singleClassPropertyDatatype === "date") {
              returnProps[singleClassProperty.name] = {
                description: singleClassProperty.description,
                type: GraphQLString // string since no GraphQL date type exists
              }} else {
              console.error("I DONT KNOW THIS VALUE! " + singleClassProperty["@dataType"][0])
              returnProps[singleClassProperty.name] = {
                description: singleClassProperty.description,
                type: GraphQLString
              }
            }
          })
          if (returntypes.length > 0) {
            returnProps[singleClassProperty.name[0].toUpperCase() + singleClassProperty.name.substring(1)] = {
              description: singleClassProperty.description,
              type: new GraphQLUnionType({
                name: singleClassProperty.name[0].toUpperCase() + singleClassProperty.name.substring(1) + 'UnionType', 
                types: returntypes,
                resolveType(obj, context, info) {
                  // get returntypes here to return right class types
                  return subClasses[obj.class]
                },
              }),
              //args: createArgs(thing, false),
              resolve(parentValue, obj) {
                console.log("resolve ROOT CLASS " + singleClassProperty.name[0].toUpperCase() + singleClassProperty.name.substring(1))
                if (typeof parentValue[singleClassProperty.name] === "object") {
                  return parentValue[singleClassProperty.name]
                }
                return 
              }
            }
          }
        });
        return returnProps
      }
    });

  });

  console.log("------DONE SUBCLASSES--------")

  return subClasses;
}
 

/**
 * Create the rootclasses of a Thing or Action in the Local function
 */
function createRootClasses(ontologyThings, subClasses){

  console.log("------START ROOTCLASSES--------")

  var rootClassesFields = {}

  // loop through classes
  ontologyThings.classes.forEach(singleClass => {
    // create root sub classes
    rootClassesFields[singleClass.class] = {
      type: new GraphQLList(subClasses[singleClass.class]),
      description: singleClass.description,
      args: createArgs(singleClass, false),
      resolve(parentValue, args) {
        return demoResolver.rootClassResolver(parentValue, singleClass.class, args)
      }
    }

  })

  console.log("------STOP ROOTCLASSES--------")

  return rootClassesFields

}


/**
 * Merge ontologies because both actions and things can refer to eachother
 */
function mergeOntologies(a, b){
  /*
  var contains = function(needle) {
      // Per spec, the way to identify NaN is that it is not equal to itself
      var findNaN = needle !== needle;
      var indexOf;

      if(!findNaN && typeof Array.prototype.indexOf === 'function') {
          indexOf = Array.prototype.indexOf;
      } else {
          indexOf = function(needle) {
              var i = -1, index = -1;

              for(i = 0; i < this.length; i++) {
                  var item = this[i];

                  if((findNaN && item !== item) || item === needle) {
                      index = i;
                      break;
                  }
              }

              return index;
          };
      }

      return indexOf.call(this, needle) > -1;
  };
  */
  var classCounter = [];
 
  var classes = {}
  classes["classes"] = []

  a.classes.forEach(singleClassA => {
    classCounter.push(singleClassA.class)
    classes["classes"].push(singleClassA)
  })

  b.classes.forEach(singleClassB => {
    classes["classes"].push(singleClassB)
  })

  console.log("------DONE--------")
  return classes
}

/**
 * END - ALL RELATED TO INTERNAL
 */

/**
 * START - ALL RELATED TO NETWORK
 */

/**
 * Nounfields are used in the Network service
 */
function createNounFields(nouns, depth){

  var returner = {}
  var subReturner = {}

  var splitNouns = nouns.split('\n');

  // first we create subfields
  for(var no = 0; no < splitNouns.length; no++){
    // set regex for nouns
    splitNouns[no] = splitNouns[no].replace(/\W/g, '');
    subReturner[splitNouns[no]] = {
      name: "WeaviateNetworkSubfield" + splitNouns[no],
      description: "No description available",
      args: createArgs("_", true),
      resolve() {
        console.log("resolve WeaviateNetworkSubfield" + splitNouns[no])
        return [{}] // resolve with empty array
      },
      type: GraphQLString
    }
  }

  var superSubreturner = new GraphQLObjectType({
    name: "superSubreturner",
    fields: subReturner
  })

  // second we create actual fields
  for(var no = 0; no < splitNouns.length; no++){
    // set regex for nouns
    splitNouns[no] = splitNouns[no].replace(/\W/g, '');
    // set to upper because of 
    let nounAsClass = splitNouns[no][0].toUpperCase() + splitNouns[no].substring(1);
    returner[nounAsClass] = {
      name: "WeaviateNetworkSubfield" + nounAsClass,
      description: "No description available",
      args: createArgs("_", true),
      resolve() {
        console.log("resolve WeaviateNetworkSubfield" + nounAsClass)
        return [{}] // resolve with empty array
      },
      type: superSubreturner
    }

  }

  return returner

}

/**
 * END - ALL RELATED TO INTERNAL
 */

/**
 * START CONSTRUCTING THE SERVICE
 */
fs.readFile('schemas_small/things_schema.json', 'utf8', function(err, ontologyThings) { // read things ontology
  fs.readFile('schemas_small/actions_schema.json', 'utf8', function(err, ontologyActions) { // read actions ontology
    fs.readFile('schemas_small/nounlist.txt', 'utf8', function(err, nouns) { // read the nounlist

      // merge
      classes = mergeOntologies(JSON.parse(ontologyThings), JSON.parse(ontologyActions))
    
      // create the root and sub classes based on the Weaviate schemas
      var subClasses = createSubClasses(classes);
      var rootClassesThingsFields = createRootClasses(JSON.parse(ontologyThings), subClasses);
      var rootClassesActionsFields = createRootClasses(JSON.parse(ontologyActions), subClasses);
      var classesEnum = createClassEnum(classes);
      // var PinPointField = createPinPointField(classes);
      var metaSubClasses = createMetaSubClasses(classes)
      var metaRootClassesThingsFields = createMetaRootClasses(JSON.parse(ontologyThings), metaSubClasses);
      var metaRootClassesActionsFields = createMetaRootClasses(JSON.parse(ontologyActions), metaSubClasses);

      var NounFields = createNounFields(nouns, true);

      // This is the root 
      var Weaviate = new GraphQLObjectType({
        name: 'WeaviateObj',
        description: "Location of the root query",
        fields: {
          Local: {
            name: "WeaviateLocal",
            description: "Locate on the local Weaviate",
            resolve() {
              console.log("resolve WeaviateLocal")
              return [{}] // resolve with empty array
            },
            type: new GraphQLObjectType({
              name: "WeaviateLocalObj",
              description: "Type of fetch on the internal Weaviate",
              resolve() {
                console.log("resolve WeaviateLocalObj")
                return [{}] // resolve with empty array
              },
              fields: {
                ConvertedFetch: {
                  name: "WeaviateLocalConvertedFetch",
                  description: "Do a converted fetch to search Things or Actions on the local weaviate",
                  args: {
                    _filter: { type: new GraphQLInputObjectType({
                      name: "WeaviateLocalConvertedFetchFilter",
                      description: 'Filter options for the converted fetch search, to convert the data to the filter input',
                      fields: filterFields
                    }) }
                  },
                  type: new GraphQLObjectType({
                    name: "WeaviateLocalConvertedFetchObj",
                    description: "Fetch things or actions on the internal Weaviate",
                    fields: {
                      Things: {
                        name: "WeaviateLocalConvertedFetchThings",
                        description: "Locate Things on the local Weaviate",
                        type: new GraphQLObjectType({
                          name: "WeaviateLocalConvertedFetchThingsObj",
                          description: "Fetch things on the internal Weaviate",
                          fields: rootClassesThingsFields
                        }),
                        resolve(parentValue) {
                          console.log("resolve WeaviateLocalConvertedFetchThings")
                          return parentValue.Things // resolve with empty array
                        },
                      },
                      Actions: {
                        name: "WeaviateLocalConvertedFetchActions",
                        description: "Locate Actions on the local Weaviate",
                        type: new GraphQLObjectType({
                          name: "WeaviateLocalConvertedFetchActionsObj",
                          description: "Fetch Actions on the internal Weaviate",
                          fields: rootClassesActionsFields
                        }),
                        resolve(parentValue) {
                          console.log("resolve WeaviateLocalConvertedFetchActions")
                          return parentValue.Actions // resolve with empty array
                        }
                      }
                    }
                  }),
                  resolve(parentValue, args) {
                    console.log("resolve WeaviateLocalConvertedFetch")
                    return demoResolver.resolveConvertedFetch(args._filter) // resolve with empty array
                  },
                },
                HelpersFetch: {
                  name: "WeaviateLocalHelpersFetch",
                  description: "Do a helpers fetch to search Things or Actions on the local weaviate",
                  type: new GraphQLObjectType({
                    name: "WeaviateLocalHelpersFetchObj",
                    description: "Fetch things or actions on the internal Weaviate",
                    fields: {
                      PinPoint: {
                        name: "WeaviateLocalHelpersFetchPinPoint",
                        description: "Find a set of exact ID's of Things or Actions on the local Weaviate",
                        args: {
                          _stack: {
                            type: new GraphQLEnumType({
                              name: "WeaviateLocalHelpersFetchPinPointStackEnum",
                              values: {
                                Things: {
                                  value: 0,
                                },
                                Actions: {
                                  value: 1,
                                }
                              }
                            })
                          }, //Things or Actions ENUM
                          _classes: {type: new GraphQLList(classesEnum)}, //an array of potential classes (they should be in the ontology!)
                          _properties: {type: new GraphQLList(GraphQLString)}, //an array of potential classes (they should be in the ontology, ideally related to the class!)
                          _needle: {type: GraphQLString}, //the actual field that will be used in the search. (for example: __needle: "Netflix"
                          _searchType: {
                            type: new GraphQLEnumType({
                              name: "WeaviateLocalHelpersFetchPinPointSearchTypeEnum",
                              values: {
                                standard: {
                                  value: 0,
                                }
                              }
                            })
                          }, //should be an ENUM but for now only 1 value: "standard"
                          _limit: {type: GraphQLInt}
                        },
                        type: new GraphQLObjectType({
                          name: "WeaviateLocalHelpersFetchPinPointObj",
                          description: "Fetch uuid of Things or Actions on the internal Weaviate",
                          fields: {
                            uuid: {
                              name: "WeaviateLocalHelpersFetchPinPointUuid",
                              description: "Do a fuzzy search fetch to search Things or Actions on the network weaviate",
                              type: GraphQLID,
                              resolve(parentValue) {
                                console.log("resolve WeaviateLocalHelpersFetchPinPointUuid")
                                return [{}] // demoResolver.resolvePinPoint(parentValue) // resolve with empty array
                              }
                            }
                          },
                        }),
                        resolve(_,args) {
                          console.log("resolve WeaviateLocalHelpersFetchPinPoint")
                          return args // resolve with empty array
                        },
                      }
                    }
                  }),
                  resolve() {
                    console.log("resolve WeaviateLocalHelpersFetch")
                    return [{}] // resolve with empty array
                  },
                },
                MetaFetch: {
                  name: "WeaviateLocalMetaFetch",
                  description: "Fetch meta infromation about Things or Actions on the local weaviate",
                  args: {
                    _filter: { type: new GraphQLInputObjectType({
                      name: "WeaviateLocalMetaFetchFilter",
                      description: 'Filter options for the meta fetch search, to convert the data to the filter input',
                      fields: filterFields
                    }) }
                  },
                  type: new GraphQLObjectType({
                    name: "WeaviateLocalMetaFetchObj",
                    description: "Fetch things or actions on the internal Weaviate",
                    fields: {
                      Generics: {
                        name: "WeaviateLocalMetaFetchGenerics",
                        description: "Fetch generic meta information based on the type",
                        type: new GraphQLObjectType({
                          name: "WeaviateLocalMetaFetchGenericsObj",
                          description: "Object type to fetch",
                          fields: {
                            Things: {
                              name: "WeaviateLocalMetaFetchGenericsThing",
                              description: "Thing to fetch for meta generic fetch",
                              args: {
                                _maxArraySize: { type: GraphQLString } // If there are arrays in the result, limit them to this size (for example topOccurences).
                              },
                              type: new GraphQLObjectType({
                                name: "WeaviateLocalMetaFetchGenericsThingObj",
                                description: "Thing to fetch for meta generic fetch",
                                fields: metaRootClassesThingsFields
                              }),
                              resolve(parentValue) {
                                console.log("resolve WeaviateLocalMetaFetchGenericsThing")
                                return {"data": parentValue.Things, "_maxArraySize": args._maxArraySize} // resolve with empty array
                              }
                            }, 
                            Actions: {
                              name: "WeaviateLocalMetaFetchGenericsAction",
                              description: "Action to fetch for meta generic fetch",
                              type: new GraphQLObjectType({
                                name: "WeaviateLocalMetaFetchGenericsActionObj",
                                description: "Action to fetch for meta generic fetch",
                                fields: metaRootClassesActionsFields
                              }),
                              resolve(parentValue) {
                                console.log("resolve WeaviateLocalMetaFetchGenericsAction")
                                return parentValue.Actions // resolve with empty array
                              }
                            }
                          },
                        }),
                        resolve(_,args) {
                          console.log("resolve WeaviateLocalMetaFetchGenerics")
                          return demoResolver.resolveConvertedFetch(args._filter)
                        },
                      }
                    }
                  }),
                  resolve() {
                    console.log("resolve WeaviateLocalMetaFetch")
                    return [{}] // resolve with empty array
                  },
                },
              }
            })
          },
          Network: {
            name: "WeaviateNetwork",
            description: "Locate on the Weaviate network",
            type: new GraphQLObjectType({
              name: "WeaviateNetworkObj",
              description: "Type of fetch on the Weaviate network",
              fields: {
                FuzzyFetch: {
                  name: "WeaviateNetworkFuzzyFetch",
                  description: "Do a fuzzy search fetch to search Things or Actions on the network weaviate",
                  type: new GraphQLList(GraphQLString), // no input required yet
                  resolve() {
                    console.log("resolve WeaviateNetworkFuzzyFetch")
                    return [{}] // resolve with empty array
                  },
                },
                HelpersFetch: {
                  name: "WeaviateNetworkHelpersFetch",
                  description: "Do a fetch with help to search Things or Actions on the network weaviate",
                  type: new GraphQLList(GraphQLString), // no input required yet
                  resolve() {
                    console.log("resolve WeaviateNetworkHelpersFetch")
                    return [{}] // resolve with empty array
                  },
                },
                MetaFetch: {
                  name: "WeaviateNetworkMetaFetch",
                  description: "To fetch meta information Things or Actions on the network weaviate",
                  type: new GraphQLList(GraphQLString), // no input required yet
                  resolve() {
                    console.log("resolve WeaviateNetworkMetaFetch")
                    return [{}] // resolve with empty array
                  },
                },
              }
            }) 
          }
        }
      })

      // publish the schemas, for now only the query schema
      const schema = new GraphQLSchema({
        query: Weaviate
      });

      // run the webserver
      const app = express();
      app.use(express.static(__dirname));
      app.use('/graphql', graphqlHTTP(() => ({ schema, graphiql: true })));
      app.listen(8081, function() {
        const port = this.address().port;
        console.log(`Started on http://localhost:${port}/graphql`);
      });

    });

  });

});
