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
const demoResolver = require('./demo_resolver/demo_resolver.js');
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
  GraphQLScalarType
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
 *  Get descriptions from json file. 
 * NOTE: getDesc(this.name) not possible because this.name refers to keyname of object, and not the key 'name' IN the object (this 'name' is reserved)
 */
const descriptions = JSON.parse(fs.readFileSync('descriptions.json', 'utf8'));
function getDesc(name) {
  return descriptions[name]
}

/**
 * Create class enum for filter options
 */
var fuzzyFetchEnum = new GraphQLEnumType({
  name: "fuzzyFetchPropertiesValueTypeEnum",
  description: function() {
    return getDesc("fuzzyFetchPropertiesValueTypeEnum")},
  values: {
    "EQ": {
      value: "EQ"
    }, 
    "NEQ": {
      value: "NEQ"
    }, 
    "PREFIX": {
      value: "PREFIX"
    }, 
    "REGEX": {
      value: "REGEX"
    }, 
    "FUZZY": {
      value: "FUZZY"
    }
  }
})


/**
 * Create filter fields for fetching queries
 */
var fetchFilterFields = {
  AND: {
    name: "FetchFilterFieldAND",
    description: function() {
      return getDesc("FetchFilterFieldAND")},
    type: new GraphQLList(new GraphQLInputObjectType({
      name: "FetchFilterFieldANDInpObj",
      description: function() {
        return getDesc("FetchFilterFieldANDInpObj")},
      fields: function () {return fetchFilterFields}
    }))
  },
  OR: {
    name: "FetchFilterFieldOR",
    description: function() {
      return getDesc("FetchFilterFieldOR")},
    type: new GraphQLList(new GraphQLInputObjectType({
      name: "FetchFilterFieldORInpObj",
      description: function() {
        return getDesc("FetchFilterFieldORInpObj")},
      fields: function () {return fetchFilterFields}
    }))
  },
  path: { 
    name: "FetchFilterPathField",
    description: function() {
      return getDesc("FetchFilterPathField")}, //"path from the root Thing or Action until class property",
    type: new GraphQLList(GraphQLString) 
  },
  value: { 
    name: "FetchFilterValueField",
    description: function() {
      return getDesc("FetchFilterValueField")}, //"the value to class property should be filtered at",
    type: GraphQLString 
  }
}


/**
 *  Create filter for ConvertedFetch
 */

var filterFields = {
  AND: {
    name: "FetchFilterAND",
    description: function() {
      return getDesc("FetchFilterAND")},
    type: new GraphQLInputObjectType({
      name: "FetchFilterANDInpObj",
      description: function() {
        return getDesc("FetchFilterANDInpObj")},
      fields: function () {return filterFields}
    })
  },
  OR: {
    name: "FetchFilterAND",
    description: function() {
      return getDesc("FetchFilterAND")},
    type: new GraphQLInputObjectType({
      name: "FetchFilterORInpObj",
      description: function() {
        return getDesc("FetchFilterORInpObj")},
      fields: function () {return filterFields}
    })
  },
  EQ: { 
    name: 'FetchFilterEQ',
    description: function() {
      //console.log(Object.keys(this))
      return getDesc("FetchFilterEQ")}, 
    type: new GraphQLList(new GraphQLInputObjectType({ // is path equal to
      name: 'FetchFilterEQInpObj',
      description: function() {
        return getDesc(this.name)}, 
      fields: fetchFilterFields
    }))
  },
  NEQ: { 
    name: 'FetchFilterNEQ',
    description: function() {
      return getDesc("FetchFilterNEQ")},
    type: new GraphQLList(new GraphQLInputObjectType({ // path is NOT equal to
      name: 'FetchFilterNEQInpObj',
      description: function() {
        return getDesc("FetchFilterNEQInpObj")},
      fields: fetchFilterFields
    }))
  },
  IE: { 
    name: 'FetchFilterIE',
    description: function() {
      return getDesc("FetchFilterIE")},
    type: new GraphQLList(new GraphQLInputObjectType({ //  = InEquality between values.
      name: 'FetchFilterIEInpObj',
      description: function() {
        return getDesc("FetchFilterIEInpObj")},
      fields: fetchFilterFields
    }))
  }
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
    description: function() {
      return getDesc("classEnum")},
    values: enumValues,
  });

  return classEnum
}
 
/**
 * Create arguments for the network function
 */
var argsKeywords = new GraphQLInputObjectType({
  name: "argsKeywords",
  description: function() {
    return getDesc("argsKeywords")},
  fields: {
    keyword: {
      name: "WeaviateNetworkKeywordsKeyword",
      description: function() {
        return getDesc("WeaviateNetworkKeywordsKeyword")},
      type: GraphQLString
    },
    weight: {
      name: "WeaviateNetworkKeywordsWeight",
      description: function() {
        return getDesc("WeaviateNetworkKeywordsWeight")},
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
      name: "certaintyFilter",
      type: GraphQLFloat,
      description: function() {
        return getDesc("certaintyFilter")},
    }
    // always return limit
    propsForArgs[item.class]["_limit"] = {
      name: "limitFilter",
      type: GraphQLInt,
      description: function() {
        return getDesc("limitFilter")},
    }
    // always return skip
    propsForArgs[item.class]["_skip"] = {
      name: "skipFilter",
      type: GraphQLInt,
      description: function() {
        return getDesc("skipFilter")},
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
      name: "Meta" + singleClass.class,
      description: singleClass.description,
      fields: function(){
        // declare props that should be returned
        var returnProps = {}

        returnProps["meta"] = {
          name: "Meta"+ singleClass.class + "Meta",
          description: function() {
            return getDesc("MetaClassMeta")},
          type: new GraphQLObjectType({
            name: "Meta" + singleClass.class + "MetaObj",
            description: function() {
              return getDesc("MetaClassMetaObj")},
            fields: {
              kind: {
                name: "Meta" + singleClass.class + "MetaKind",
                description: function() {
                  return getDesc("MetaClassMetaKind")},
                type: GraphQLString
              },
              counter: {
                name: "Meta" + singleClass.class + "MetaCounter",
                description: function() {
                  return getDesc("MetaClassMetaCounter")},
                type: GraphQLInt
              },
              pointing: {
                name: "Meta" + singleClass.class + "MetaPointing",
                description: function() {
                  return getDesc("MetaClassMetaPointing")},
                type: new GraphQLObjectType({
                  name: "Meta" + singleClass.class + "MetaPointingObj",
                  description: function() {
                    return getDesc("MetaClassMetaPointingObj")},
                  fields: {
                    to: {
                      name: "Meta" + singleClass.class + "MetaPointingTo",
                      description: function() {
                        return getDesc("MetaClassMetaPointingTo")},
                      type: GraphQLInt,
                    },
                    from: {
                      name: "Meta" + singleClass.class + "MetaPointingFrom",
                      description: function() {
                        return getDesc("MetaClassMetaPointingFrom")},
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
          standard_fields = {
            type: {
              name: "Meta" + singleClass.class + singleClassProperty.name + "Type",
              description: function() {
                return getDesc("MetaClassPropertyType")},
              type: GraphQLString,
            },
            counter: {
              name: "Meta" + singleClass.class + singleClassProperty.name + "Counter",
              description: function() {
                return getDesc("MetaClassPropertyCounter")},
              type: GraphQLInt,
            },
            kind: {
              name: "Meta" + singleClass.class + singleClassProperty.name + "Kind",
              description: function() {
                return getDesc("MetaClassPropertyKind")},
              type: GraphQLString,
            }
          }
          singleClassProperty["@dataType"].forEach(singleClassPropertyDatatype => {

            // if class (start with capital, return Class)
            if(singleClassPropertyDatatype[0] === singleClassPropertyDatatype[0].toUpperCase()){
              returnProps[singleClassProperty.name] = {
                name: "Meta" + singleClass.class + singleClassProperty.name,
                description: "Meta information about the property \"" + singleClassProperty.name + "\"",
                type: new GraphQLObjectType({
                  name: "Meta" + singleClass.class + singleClassProperty.name + "Obj",
                  description: function() {
                    return getDesc("MetaClassPropertyObj")},
                  fields: Object.assign(standard_fields, {
                    pointing: {
                      name: "Meta" + singleClass.class + singleClassProperty.name + "Pointing",
                      description: function() {
                        return getDesc("MetaClassPropertyPointing")},
                      type: new GraphQLObjectType({
                        name: "Meta" + singleClass.class + singleClassProperty.name + "PointingObj",
                        description: function() {
                          return getDesc("MetaClassPropertyPointingObj")},
                        fields: {
                          to: {
                            name: "Meta" + singleClass.class + singleClassProperty.name + "PointingTo",
                            description: function() {
                              return getDesc("MetaClassPropertyPointingTo")},
                            type: GraphQLInt,
                          },
                          from: {
                            name: "Meta" + singleClass.class + singleClassProperty.name + "PointingFrom",
                            description: function() {
                              return getDesc("MetaClassPropertyPointingFrom")},
                            type: GraphQLInt
                          }
                        }
                      })
                    }
                  })
                })
              }
            } else if(singleClassPropertyDatatype === "string" || singleClassPropertyDatatype === "date") {
              topOccurrencesType = new GraphQLObjectType({
                name: "Meta" + singleClass.class + singleClassProperty.name + "TopOccurrencesObj",
                description: function() {
                  return getDesc("MetaClassPropertyTopOccurrencesObj")},
                fields: {
                  value: {
                    name: "Meta" + singleClass.class + singleClassProperty.name + "TopOccurrencesValue",
                    description: function() {
                      return getDesc("MetaClassPropertyTopOccurrencesValue")},
                    type: GraphQLString
                  },
                  occurs: {
                    name: "Meta" + singleClass.class + singleClassProperty.name + "TopOccurrencesOccurs",
                    description: function() {
                      return getDesc("MetaClassPropertyTopOccurrencesOccurs")},
                    type: GraphQLInt
                  }
                }
              })
              returnProps[singleClassProperty.name] = {
                name: "Meta" + singleClass.class + singleClassProperty.name,
                description: "Meta information about the property \"" + singleClassProperty.name + "\"",
                type: new GraphQLObjectType({
                  name: "Meta" + singleClass.class + singleClassProperty.name + "Obj",
                  description: function() {
                    return getDesc("MetaClassPropertyObj")},
                  fields: Object.assign(standard_fields, {
                    topOccurrences: {
                      name: "Meta" + singleClass.class + singleClassProperty.name + "TopOccurrences",
                      description: function() {
                        return getDesc("MetaClassPropertyTopOccurrences")},
                      type: new GraphQLList( topOccurrencesType ),
                      args: {
                        _limit: { 
                          name: "limitFilter",
                          description: function() {
                            return getDesc("limitFilter")},
                          type: GraphQLInt 
                        },
                        _skip: { 
                          name: "skipFilter",
                          description: function() {
                            return getDesc("skipFilter")},
                          type: GraphQLInt 
                        }
                      }
                    }
                  })
                })
              }
            } else if(singleClassPropertyDatatype === "int" || singleClassPropertyDatatype === "number") {
              returnProps[singleClassProperty.name] = {
                name: "Meta" + singleClass.class + singleClassProperty.name,
                description: "Meta information about the property \"" + singleClassProperty.name + "\"",
                type: new GraphQLObjectType({
                  name: "Meta" + singleClass.class + singleClassProperty.name + "Obj",
                  description: function() {
                    return getDesc("MetaClassPropertyObj")},
                  fields: Object.assign(standard_fields, {
                    lowest: {
                      name: "Meta" + singleClass.class + singleClassProperty.name + "Lowest",
                      description: function() {
                        return getDesc("FetchFilterPathField")},
                      type: GraphQLFloat,
                    },
                    highest: {
                      name: "Meta" + singleClass.class + singleClassProperty.name + "Highest",
                      description: function() {
                        return getDesc("MetaClassPropertyLowest")},
                      type: GraphQLFloat,
                    },
                    average: {
                      name: "Meta" + singleClass.class + singleClassProperty.name + "Average",
                      description: function() {
                        return getDesc("MetaClassPropertyHighest")},
                      type: GraphQLFloat,
                    },
                    sum: {
                      name: "Meta" + singleClass.class + singleClassProperty.name + "Sum",
                      description: function() {
                        return getDesc("MetaClassPropertySum")},
                      type: GraphQLFloat,
                    }
                  })
                })
              }
            } else if(singleClassPropertyDatatype === "boolean") {
              returnProps[singleClassProperty.name] = {
                name: "Meta" + singleClass.class + singleClassProperty.name,
                description: "Meta information about the property \"" + singleClassProperty.name + "\"",
                type: new GraphQLObjectType({
                  name: "Meta" + singleClass.class + singleClassProperty.name + "Obj",
                  description: function() {
                    return getDesc("MetaClassPropertyObj")},
                  fields: Object.assign(standard_fields, {
                    totalTrue: {
                      name: "Meta" + singleClass.class + singleClassProperty.name + "TotalTrue",
                      description: function() {
                        return getDesc("MetaClassPropertyTotalTrue")},
                      type: GraphQLInt,
                    },
                    percentageTrue: {
                      name: "Meta" + singleClass.class + singleClassProperty.name + "PercentageTrue",
                      description: function() {
                        return getDesc("MetaClassPropertyPerentageTrue")},
                      type: GraphQLFloat,
                    }
                  })
                })
              }
              // TO DO: CREATE META INFORMATION FOR DATE, NOW THIS IS SAME AS STRING DATATYPE
            // } else if(singleClassPropertyDatatype === "date") {
            //   returnProps[singleClassProperty.name] = {
            //     name: "Meta" + singleClass.class + singleClassProperty.name,
            //     description: singleClassProperty.description,
            //     type: GraphQLString // string since no GraphQL date type exists
            //   }
            } else {
              console.error("I DONT KNOW THIS VALUE! " + singleClassProperty["@dataType"][0])
              returnProps[singleClassProperty.name] = {
                name: "Meta" + singleClass.class + singleClassProperty.name,
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
      name: "Meta" + singleClass.class,
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

        // add uuid to props
        returnProps["uuid"] = {
          name: "SubClassUuid",
          description: function() {
            return getDesc("SubClassUuid")},
          type: GraphQLString
        }

        // loop over properties
        singleClass.properties.forEach(singleClassProperty => {
          returntypes = []
          singleClassProperty["@dataType"].forEach(singleClassPropertyDatatype => {
            // if class (start with capital, return Class)
            if(singleClassPropertyDatatype[0] === singleClassPropertyDatatype[0].toUpperCase()){
              returntypes.push(subClasses[singleClassPropertyDatatype])
            } else if(singleClassPropertyDatatype === "string") {
              returnProps[singleClassProperty.name] = {
                name: singleClass.class + singleClassProperty.name,
                description: singleClassProperty.description,
                type: GraphQLString
              }
            } else if(singleClassPropertyDatatype === "int") {
              returnProps[singleClassProperty.name] = {
                name: singleClass.class + singleClassProperty.name,
                description: singleClassProperty.description,
                type: GraphQLInt
              }
            } else if(singleClassPropertyDatatype === "number") {
              returnProps[singleClassProperty.name] = {
                name: singleClass.class + singleClassProperty.name,
                description: singleClassProperty.description,
                type: GraphQLFloat
              }
            } else if(singleClassPropertyDatatype === "boolean") {
              returnProps[singleClassProperty.name] = {
                name: singleClass.class + singleClassProperty.name,
                description: singleClassProperty.description,
                type: GraphQLBoolean
              }
            } else if(singleClassPropertyDatatype === "date") {
              returnProps[singleClassProperty.name] = {
                name: singleClass.class + singleClassProperty.name,
                description: singleClassProperty.description,
                type: GraphQLString // string since no GraphQL date type exists
              }} else {
              console.error("I DONT KNOW THIS VALUE! " + singleClassProperty["@dataType"][0])
              returnProps[singleClassProperty.name] = {
                name: singleClass.class + singleClassProperty.name,
                description: singleClassProperty.description,
                type: GraphQLString
              }
            }
          })
          if (returntypes.length > 0) {
            returnProps[singleClassProperty.name[0].toUpperCase() + singleClassProperty.name.substring(1)] = {
              name: singleClass.class + singleClassProperty.name[0].toUpperCase() + singleClassProperty.name.substring(1),
              description: singleClassProperty.description,
              type: new GraphQLUnionType({
                name: singleClass.class + singleClassProperty.name[0].toUpperCase() + singleClassProperty.name.substring(1) + 'Obj', 
                description: singleClassProperty.description,
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
function createRootClasses(ontologyThings, subClasses, domain){

  console.log("------START ROOTCLASSES--------")

  var rootClassesFields = {}

  // loop through classes
  ontologyThings.classes.forEach(singleClass => {
    // create root sub classes
    rootClassesFields[singleClass.class] = {
      name: singleClass.class,
      type: new GraphQLList(subClasses[singleClass.class]),
      description: singleClass.description,
      args: createArgs(singleClass, domain),
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
 * Create contextionary input fields
 */
function createContextionaryInputFields(nouns){

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
    splitNouns[no] = splitNouns[no].replace(/[\W-]/g, '');
    
    // skip empty items and items containing numbers
    if ((splitNouns[no].length == 0) || /\d/.test(splitNouns[no])) {
      continue
    }
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
 * Nounfields are used in the Network service
 */
function createContextionaryFields(nouns, depth){

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
    splitNouns[no] = splitNouns[no].replace(/[\W-]/g, '');
    
    // skip empty items and items containing numbers
    if ((splitNouns[no].length == 0) || /\d/.test(splitNouns[no])) {
      continue
    }
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
fs.readFile('demo_schemas/things_schema.json', 'utf8', function(err, ontologyThings) { // read things ontology
  fs.readFile('demo_schemas/actions_schema.json', 'utf8', function(err, ontologyActions) { // read actions ontology
    fs.readFile('schema/words.txt', 'utf8', function(err, nouns) { // read the words contextionary

      // merge
      classes = mergeOntologies(JSON.parse(ontologyThings), JSON.parse(ontologyActions))

      // create GraphQL fields for words in contextionary
      var contextionaryWords = createContextionaryFields(nouns);
    
      // create the root and sub classes based on the Weaviate schemas
      var localSubClasses = createSubClasses(classes);
      var rootClassesThingsFields = createRootClasses(JSON.parse(ontologyThings), localSubClasses);
      var rootClassesActionsFields = createRootClasses(JSON.parse(ontologyActions), localSubClasses);
      var classesEnum = createClassEnum(classes);
      // var PinPointField = createPinPointField(classes);
      var metaSubClasses = createMetaSubClasses(classes)
      var metaRootClassesThingsFields = createMetaRootClasses(JSON.parse(ontologyThings), metaSubClasses);
      var metaRootClassesActionsFields = createMetaRootClasses(JSON.parse(ontologyActions), metaSubClasses);

      // var NounFields = createNounFields(nouns, true);

      // This is the root 
      var Weaviate = new GraphQLObjectType({
        name: 'WeaviateObj',
        description: function() {
          return getDesc("WeaviateObj")},
        fields: {
          Local: {
            name: "WeaviateLocal",
            description: function() {
              return getDesc("WeaviateLocal")},
            resolve() {
              console.log("resolve WeaviateLocal")
              return [{}] // resolve with empty array
            },
            type: new GraphQLObjectType({
              name: "WeaviateLocalObj",
              description: function() {
                return getDesc("WeaviateLocalObj")},
              resolve() {
                console.log("resolve WeaviateLocalObj")
                return [{}] // resolve with empty array
              },
              fields: {
                ConvertedFetch: {
                  name: "WeaviateLocalConvertedFetch",
                  description: function() {
                    return getDesc("WeaviateLocalConvertedFetch")},
                  args: {
                    _filter: { 
                      name: "WeaviateLocalConvertedFetchFilter",
                      description: function() {
                        return getDesc("WeaviateLocalConvertedFetchFilter")},
                      type: new GraphQLInputObjectType({
                        name: "WeaviateLocalConvertedFetchFilterInpObj",
                        description: function() {
                          return getDesc("WeaviateLocalConvertedFetchFilterInpObj")},
                        fields: filterFields
                      }) 
                    }
                  },
                  type: new GraphQLObjectType({
                    name: "WeaviateLocalConvertedFetchObj",
                    description: function() {
                      return getDesc("WeaviateLocalConvertedFetchObj")},
                    fields: {
                      Things: {
                        name: "WeaviateLocalConvertedFetchThings",
                        description: function() {
                          return getDesc("WeaviateLocalConvertedFetchThings")},
                        type: new GraphQLObjectType({
                          name: "WeaviateLocalConvertedFetchThingsObj",
                          description: function() {
                            return getDesc("WeaviateLocalConvertedFetchThingsObj")},
                          fields: rootClassesThingsFields
                        }),
                        resolve(parentValue) {
                          console.log("resolve WeaviateLocalConvertedFetchThings")
                          return parentValue.Things // resolve with empty array
                        },
                      },
                      Actions: {
                        name: "WeaviateLocalConvertedFetchActions",
                        description: function() {
                          return getDesc("WeaviateLocalConvertedFetchActions")},
                        type: new GraphQLObjectType({
                          name: "WeaviateLocalConvertedFetchActionsObj",
                          description: function() {
                            return getDesc("WeaviateLocalConvertedFetchActionsObj")},
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
                  description: function() {
                    return getDesc("WeaviateLocalHelpersFetch")},
                  type: GraphQLString,
                  // type: new GraphQLObjectType({
                  //   name: "WeaviateLocalHelpersFetchObj",
                  //   description: function() {
                  //     return getDesc("WeaviateLocalHelpersFetchObj")},
                  //   fields: GraphQLString,
                    // {
                      // PinPoint: {
                      //   name: "WeaviateLocalHelpersFetchPinPoint",
                      //   description: function() {
                      //     return getDesc("WeaviateLocalHelpersFetchPinPoint")},
                      //   args: {
                      //     _stack: {
                      //       name: "WeaviateLocalHelpersFetchPinPointStack",
                      //       description: function() {
                      //         return getDesc("WeaviateLocalHelpersFetchPinPointStack")},
                      //       type: new GraphQLEnumType({
                      //         name: "WeaviateLocalHelpersFetchPinPointStackEnum",
                      //         description: function() {
                      //           return getDesc("WeaviateLocalHelpersFetchPinPointStackEnum")},
                      //         values: {
                      //           Things: {
                      //             value: 0,
                      //           },
                      //           Actions: {
                      //             value: 1,
                      //           }
                      //         }
                      //       })
                      //     }, //Things or Actions ENUM
                      //     _classes: {
                      //       name: "WeaviateLocalHelpersFetchPinPointClasses",
                      //       description: function() {
                      //         return getDesc("WeaviateLocalHelpersFetchPinPointClasses")},
                      //       type: new GraphQLList(classesEnum)
                      //     },
                      //     _properties: {
                      //       name: "WeaviateLocalHelpersFetchPinPointProperties",
                      //       description: function() {
                      //         return getDesc("WeaviateLocalHelpersFetchPinPointProperties")},
                      //       type: new GraphQLList(GraphQLString)
                      //     }, //an array of potential classes (they should be in the ontology, ideally related to the class!)
                      //     _needle: {
                      //       name: "WeaviateLocalHelpersFetchPinPointNeedle",
                      //       description: function() {
                      //         return getDesc("WeaviateLocalHelpersFetchPinPointNeedle")},
                      //       type: GraphQLString}, // (for example: __needle: "Netflix"
                      //     _searchType: {
                      //       name: "WeaviateLocalHelpersFetchPinPointSearchType",
                      //       description: function() {
                      //         return getDesc("WeaviateLocalHelpersFetchPinPointSearchType")},
                      //       type: new GraphQLEnumType({
                      //         name: "WeaviateLocalHelpersFetchPinPointSearchTypeEnum",
                      //         description: function() {
                      //           return getDesc("WeaviateLocalHelpersFetchPinPointSearchTypeEnum")},
                      //         values: {
                      //           standard: {
                      //             value: 0,
                      //           }
                      //         }
                      //       })
                      //     }, 
                      //     _limit: {
                      //       name: "WeaviateLocalHelpersFetchPinPointLimit",
                      //       description: function() {
                      //         return getDesc("WeaviateLocalHelpersFetchPinPointLimit")},
                      //       type: GraphQLInt}
                      //   },
                      //   type: new GraphQLObjectType({
                      //     name: "WeaviateLocalHelpersFetchPinPointObj",
                      //     description: function() {
                      //       return getDesc("WeaviateLocalHelpersFetchPinPointObj")},
                      //     fields: {
                      //       uuid: {
                      //         name: "WeaviateLocalHelpersFetchPinPointUuid",
                      //         description: function() {
                      //           return getDesc("WeaviateLocalHelpersFetchPinPointUuid")},
                      //         type: GraphQLID,
                      //         resolve(parentValue) {
                      //           console.log("resolve WeaviateLocalHelpersFetchPinPointUuid")
                      //           return [{}] // resolve with empty array
                      //         }
                      //       }
                      //     },
                      //   }),
                      //   resolve(_,args) {
                      //     console.log("resolve WeaviateLocalHelpersFetchPinPoint")
                      //     return args // resolve with empty array
                      //   },
                      // },
                      // Relate: {
                      //   name: "WeaviateLocalHelpersFetchRelate",
                      //   description: function() {
                      //     return getDesc("WeaviateLocalHelpersFetchRelate")},
                      //   args: {
                      //     _filter: { 
                      //       name: "WeaviateLocalHelpersFetchRelateFilter",
                      //       description: function() {
                      //         return getDesc("WeaviateLocalHelpersFetchRelateFilter")},
                      //       type: new GraphQLInputObjectType({
                      //         name: "WeaviateLocalHelpersFetchRelateFilterInpObj",
                      //         description: function() {
                      //           return getDesc("WeaviateLocalHelpersFetchRelateFilterInpObj")},
                      //         fields: filterFields
                      //       }) 
                      //     },
                      //     _classes: {
                      //       name: "WeaviateLocalHelpersFetchRelateClasses",
                      //       description: function() {
                      //         return getDesc("WeaviateLocalHelpersFetchRelateClasses")},
                      //       type: new GraphQLList(classesEnum)
                      //     },
                      //     _searchType: {
                      //       name: "WeaviateLocalHelpersFetchRelateSearchType",
                      //       description: function() {
                      //         return getDesc("WeaviateLocalHelpersFetchRelateSearchType")},
                      //       type: new GraphQLEnumType({
                      //         name: "WeaviateLocalHelpersFetchRelateSearchTypeEnum",
                      //         description: function() {
                      //           return getDesc("WeaviateLocalHelpersFetchRelateSearchTypeEnum")},
                      //         values: {
                      //           standard: {
                      //             value: 0,
                      //           }
                      //         }
                      //       })
                      //     }, 
                      //     _maxPathLength: {
                      //       name: "WeaviateLocalHelpersFetchRelateMaxPathLength",
                      //       description: function() {
                      //         return getDesc("WeaviateLocalHelpersFetchRelateMaxPathLength")},
                      //       type: GraphQLInt}
                      //   },
                    //     type: new GraphQLObjectType({
                    //       name: "WeaviateLocalHelpersFetchRelateObj",
                    //       description: function() {
                    //         return getDesc("WeaviateLocalHelpersFetchRelateObj")},
                    //       fields: {
                    //         uuid: {
                    //           name: "WeaviateLocalHelpersFetchRelateUuid",
                    //           description: function() {
                    //             return getDesc("WeaviateLocalHelpersFetchRelateUuid")},
                    //           type: GraphQLID,
                    //           resolve(parentValue) {
                    //             console.log("resolve WeaviateLocalHelpersFetchRelateUuid")
                    //             return [{"uuid": 123}] // resolve with empty array
                    //           }
                    //         },
                    //         className: {
                    //           name: "WeaviateLocalHelpersFetchRelateClassName",
                    //           description: function() {
                    //             return getDesc("WeaviateLocalHelpersFetchRelateClassName")},
                    //           type: GraphQLString,
                    //           resolve(parentValue) {
                    //             console.log("resolve WeaviateLocalHelpersFetchRelateClassName")
                    //             return [{}] // resolve with empty array
                    //           }
                    //         },
                    //         type: {
                    //           name: "WeaviateLocalHelpersFetchRelateType",
                    //           description: function() {
                    //             return getDesc("WeaviateLocalHelpersFetchRelateType")},
                    //           type: GraphQLString,
                    //           resolve(parentValue) {
                    //             console.log("resolve WeaviateLocalHelpersFetchRelateType")
                    //             return [{}] // resolve with empty array
                    //           }
                    //         }
                    //       },
                    //     }),
                    //     resolve(_,args) {
                    //       console.log("resolve WeaviateLocalHelpersFetchRelate")
                    //       return [{}] // resolve with empty array
                    //     },
                    //   }
                    // }
                  // }),
                  resolve() {
                    console.log("resolve WeaviateLocalHelpersFetch")
                    return [{}] // resolve with empty array
                  },
                },
                MetaFetch: {
                  name: "WeaviateLocalMetaFetch",
                  description: function() {
                    return getDesc("WeaviateLocalMetaFetch")},
                  args: {
                    _filter: { 
                      name: "WeaviateLocalMetaFetchFilter",
                      description: function() {
                        return getDesc("WeaviateLocalMetaFetchFilter")},
                      type: new GraphQLInputObjectType({
                        name: "WeaviateLocalMetaFetchFilterInpObj",
                        description: function() {
                          return getDesc("WeaviateLocalMetaFetchFilterInpObj")},
                        fields: filterFields
                      }) 
                  }
                  },
                  type: new GraphQLObjectType({
                    name: "WeaviateLocalMetaFetchObj",
                    description: function() {
                      return getDesc("WeaviateLocalMetaFetchObj")},
                    fields: {
                      Generics: {
                        name: "WeaviateLocalMetaFetchGenerics",
                        description: function() {
                          return getDesc("WeaviateLocalMetaFetchGenerics")},
                        type: new GraphQLObjectType({
                          name: "WeaviateLocalMetaFetchGenericsObj",
                          description: function() {
                            return getDesc("WeaviateLocalMetaFetchGenericsObj")},
                          fields: {
                            Things: {
                              name: "WeaviateLocalMetaFetchGenericsThings",
                              description: function() {
                                return getDesc("WeaviateLocalMetaFetchGenericsThings")},
                              args: {
                                _maxArraySize: { 
                                  name: "WeaviateLocalMetaFetchGenericsMaxArraySize",
                                  description: function() {
                                    return getDesc("WeaviateLocalMetaFetchGenericsMaxArraySize")},
                                  type: GraphQLString 
                                } 
                              },
                              type: new GraphQLObjectType({
                                name: "WeaviateLocalMetaFetchGenericsThingsObj",
                                description: function() {
                                  return getDesc("WeaviateLocalMetaFetchGenericsThingsObj")},
                                fields: metaRootClassesThingsFields
                              }),
                              resolve(parentValue, args) {
                                console.log("resolve WeaviateLocalMetaFetchGenericsThings")
                                return {"data": parentValue.Things, "_maxArraySize": args._maxArraySize} // resolve with empty array
                              }
                            }, 
                            Actions: {
                              name: "WeaviateLocalMetaFetchGenericsActions",
                              description: function() {
                                return getDesc("WeaviateLocalMetaFetchGenericsActions")},
                              args: {
                                _maxArraySize: { 
                                  name: "WeaviateLocalMetaFetchGenericsMaxArraySize",
                                  description: function() {
                                    return getDesc("WeaviateLocalMetaFetchGenericsMaxArraySize")},
                                  type: GraphQLString 
                                } 
                              },
                              type: new GraphQLObjectType({
                                name: "WeaviateLocalMetaFetchGenericsActionsObj",
                                description: function() {
                                  return getDesc("WeaviateLocalMetaFetchGenericsActionsObj")},
                                fields: metaRootClassesActionsFields
                              }),
                              resolve(parentValue, args) {
                                console.log("resolve WeaviateLocalMetaFetchGenericsActions")
                                return {"data": parentValue.Things, "_maxArraySize": args._maxArraySize} // resolve with empty array
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
            description: function() {
              return getDesc("WeaviateNetwork")},
            args: {
              _networkTimeout: { 
                name: "WeaviateNetworkNetworkTimeout",
                description: function() {
                  return getDesc("WeaviateNetworkNetworkTimeout")},
                type: GraphQLInt
              } 
            },
            type: new GraphQLObjectType({
              name: "WeaviateNetworkObj",
              description: function() {
                return getDesc("WeaviateNetworkObj")},
              fields: {
                MetaFetch: {
                  name: "WeaviateNetworkMetaFetch",
                  description: function() {
                    return getDesc("WeaviateNetworkMetaFetch")},
                  type: new GraphQLObjectType({
                    name: "WeaviateNetworkMetaFetchObj",
                    description: function() {
                      return getDesc("WeaviateNetworkMetaFetchObj")},
                    fields: {
                      Things: {
                        name: "WeaviateNetworkMetaFetchThings",
                        description: function() {
                          return getDesc("WeaviateNetworkMetaFetchThings")},
                        type: new GraphQLObjectType({
                          name: "WeaviateNetworkMetaFetchThingsObj",
                          description: function() {
                            return getDesc("WeaviateNetworkMetaFetchThingsObj")},
                          fields: {
                            Class: {
                              name: "WeaviateNetworkMetaFetchThingsClass",
                              description: function() {
                                return getDesc("WeaviateNetworkMetaFetchThingsClass")},
                              args: {
                                _value: { 
                                  name: "WeaviateNetworkMetaFetchThingsClassValue",
                                  description: function() {
                                    return getDesc("WeaviateNetworkMetaFetchThingsClassValue")},
                                  type: GraphQLString // needs to be in contextionary, weight = always 1.0
                                },
                                _distance: {  // How close?
                                  name: "WeaviateNetworkMetaFetchThingsClassDistance",
                                  description: function() {
                                    return getDesc("WeaviateNetworkMetaFetchThingsClassDistance")},
                                  type: GraphQLFloat // needs to be between 0 and 1
                                },
                                _limit: { // how many classes to return maximum
                                  name: "WeaviateNetworkMetaFetchThingsClassLimit",
                                  description: function() {
                                    return getDesc("WeaviateNetworkMetaFetchThingsClassLimit")},
                                  type: GraphQLFloat
                                },
                                _kinds: { // Any kinds to define centroids?
                                  name: "WeaviateNetworkMetaFetchThingsClassKinds",
                                  description: function() {
                                    return getDesc("WeaviateNetworkMetaFetchThingsClassKinds")},
                                  type: new GraphQLList(new GraphQLInputObjectType({
                                    name: "WeaviateNetworkMetaFetchThingsClassKindsObj",
                                    description: function() {
                                      return getDesc("WeaviateNetworkMetaFetchThingsClassKindsObj")},
                                    fields: {
                                      _value: {
                                        name: "WeaviateNetworkMetaFetchThingsClassKindsValue",
                                        description: function() {
                                          return getDesc("WeaviateNetworkMetaFetchThingsClassKindsValue")},
                                        type: GraphQLString // Needs to be in contextionary
                                      },
                                      _weight: {
                                        name: "WeaviateNetworkMetaFetchThingsClassKindsWeight",
                                        description: function() {
                                          return getDesc("WeaviateNetworkMetaFetchThingsClassKindsWeight")},
                                        type: GraphQLFloat // What weight should be used to calculate centroid
                                      }
                                    }
                                  }))
                                },
                              },
                              type: new GraphQLList(new GraphQLObjectType({
                                name: "WeaviateNetworkMetaFetchThingsClassObj",
                                description: function() {
                                  return getDesc("WeaviateNetworkMetaFetchThingsClassObj")},
                                fields: {
                                  orbit: { // What's in orbit of this property?
                                    name: "WeaviateNetworkMetaFetchThingsClassOrbit",
                                    description: function() {
                                      return getDesc("WeaviateNetworkMetaFetchThingsClassOrbit")},
                                    type: new GraphQLObjectType({
                                      name: "WeaviateNetworkMetaFetchThingsClassOrbitObj",
                                      description: function() {
                                        return getDesc("WeaviateNetworkMetaFetchThingsClassOrbitObj")},
                                      fields: {
                                        value: { // What's the contextionary value that is closest
                                          name: "WeaviateNetworkMetaFetchThingsClassOrbitValue",
                                          description: function() {
                                            return getDesc("WeaviateNetworkMetaFetchThingsClassOrbitValue")},
                                          type: GraphQLString,
                                          resolve(parentValue, args) {
                                            console.log("resolve WeaviateNetworkMetaFetchThingsClassOrbitValue")
                                            return [{}] // resolve with empty array
                                          }
                                        },
                                        distance: { // What is the distance to the original request?
                                          name: "WeaviateNetworkMetaFetchThingsClassOrbitDistance",
                                          description: function() {
                                            return getDesc("WeaviateNetworkMetaFetchThingsClassOrbitDistance")},
                                          type: GraphQLFloat,
                                          resolve(parentValue, args) {
                                            console.log("resolve WeaviateNetworkMetaFetchThingsClassOrbitDistance")
                                            return [{}] // resolve with empty array
                                          }
                                        },
                                      }
                                    }),
                                    resolve(parentValue, args) {
                                      console.log("resolve WeaviateNetworkMetaFetchThingsClassOrbit")
                                      return [{}] // resolve with empty array
                                    }
                                  },
                                  property: {
                                    name: "WeaviateNetworkMetaFetchThingsClassProperty",
                                    description: function() {
                                      return getDesc("WeaviateNetworkMetaFetchThingsClassProperty")},
                                    args: {
                                      _value: { 
                                        name: "WeaviateNetworkMetaFetchThingsClassPropertyValue",
                                        description: function() {
                                          return getDesc("WeaviateNetworkMetaFetchThingsClassPropertyValue")},
                                        type: GraphQLString // Needs to be in contextionary, weight = always 1.0
                                      },
                                      _distance: { 
                                        name: "WeaviateNetworkMetaFetchThingsClassPropertyDistance",
                                        description: function() {
                                          return getDesc("WeaviateNetworkMetaFetchThingsClassPropertyDistance")},
                                        type: GraphQLFloat // How close? needs to be 0-1
                                      },
                                      _limit: { // How close?
                                        name: "WeaviateNetworkMetaFetchThingsClassPropertyLimit",
                                        description: function() {
                                          return getDesc("WeaviateNetworkMetaFetchThingsClassPropertyLimit")},
                                        type: GraphQLFloat
                                      },
                                      _kinds: { // Any kinds to define centroids?
                                        name: "WeaviateNetworkMetaFetchThingsClassPropertyKinds",
                                        description: function() {
                                          return getDesc("WeaviateNetworkMetaFetchThingsClassPropertyKinds")},
                                        type: new GraphQLList(new GraphQLInputObjectType({
                                          name: "WeaviateNetworkMetaFetchThingsClassPropertyKindsObj",
                                          description: function() {
                                            return getDesc("WeaviateNetworkMetaFetchThingsClassPropertyKindsObj")},
                                          fields: {
                                            _value: {
                                              name: "WeaviateNetworkMetaFetchThingsClassPropertyKindsValue",
                                              description: function() {
                                                return getDesc("WeaviateNetworkMetaFetchThingsClassPropertyKindsValue")},
                                              type: GraphQLString //Needs to be in contextionary
                                            },
                                            _weight: {
                                              name: "WeaviateNetworkMetaFetchThingsClassPropertyKindsWeight",
                                              description: function() {
                                                return getDesc("WeaviateNetworkMetaFetchThingsClassPropertyKindsWeight")},
                                              type: GraphQLFloat // What weight should be used to calculate centroid 0-1
                                            }
                                          }
                                        }))
                                      },
                                    },
                                    type: new GraphQLList(new GraphQLObjectType({
                                      name: "WeaviateNetworkMetaFetchThingsClassPropertyObj",
                                      description: function() {
                                        return getDesc("WeaviateNetworkMetaFetchThingsClassPropertyObj")},
                                      fields: {
                                        orbit: { // What's in orbit of this property?
                                          name: "WeaviateNetworkMetaFetchThingsClassPropertyOrbit",
                                          description: function() {
                                            return getDesc("WeaviateNetworkMetaFetchThingsClassPropertyOrbit")},
                                          type: new GraphQLObjectType({
                                            name: "WeaviateNetworkMetaFetchThingsClassPropertyOrbitObj",
                                            description: function() {
                                              return getDesc("WeaviateNetworkMetaFetchThingsClassPropertyOrbitObj")},
                                            fields: {
                                              value: { // What's the contextionary value that is closest
                                                name: "WeaviateNetworkMetaFetchThingsClassPropertyOrbitValue",
                                                description: function() {
                                                  return getDesc("WeaviateNetworkMetaFetchThingsClassPropertyOrbitValue")},
                                                type: GraphQLString,
                                                resolve(parentValue, args) {
                                                  console.log("resolve WeaviateNetworkMetaFetchThingsClassPropertyOrbitValue")
                                                  return [{}] // resolve with empty array
                                                }
                                              },
                                              distance: { // What is the distance to the original request?
                                                name: "WeaviateNetworkMetaFetchThingsClassPropertyOrbitDistance",
                                                description: function() {
                                                  return getDesc("WeaviateNetworkMetaFetchThingsClassPropertyOrbitDistance")},
                                                type: GraphQLFloat, // 0-1
                                                resolve(parentValue, args) {
                                                  console.log("resolve WeaviateNetworkMetaFetchThingsClassPropertyOrbitDistance")
                                                  return [{}] // resolve with empty array
                                                }
                                              },
                                            }
                                          }),
                                          resolve(parentValue, args) {
                                            console.log("resolve WeaviateNetworkMetaFetchThingsClassPropertyOrbit")
                                            return [{}] // resolve with empty array
                                          }
                                        },
                                      }
                                    })),
                                    resolve(parentValue, args) {
                                      console.log("resolve WeaviateNetworkMetaFetchThingsClassProperty")
                                      return [{}] // resolve with empty array
                                    }
                                  }
                                }
                              })),
                              resolve(parentValue, args) {
                                console.log("resolve WeaviateNetworkMetaFetchThingsClass")
                                return [{}] // resolve with empty array
                              }
                            }
                          }
                        }),
                        resolve(parentValue, args) {
                          console.log("resolve WeaviateNetworkMetaFetchClass")
                          return [{}] // resolve with empty array
                        }
                      },
                      Actions: {
                        name: "WeaviateNetworkMetaFetchActions",
                        description: function() {
                          return getDesc("WeaviateNetworkMetaFetchActions")},
                        type: new GraphQLObjectType({
                          name: "WeaviateNetworkMetaFetchActionsObj",
                          description: function() {
                            return getDesc("WeaviateNetworkMetaFetchActionsObj")},
                          fields: {
                            Class: {
                              name: "WeaviateNetworkMetaFetchActionsClass",
                              description: function() {
                                return getDesc("WeaviateNetworkMetaFetchActionsClass")},
                              args: {
                                _value: { 
                                  name: "WeaviateNetworkMetaFetchActionsClassValue",
                                  description: function() {
                                    return getDesc("WeaviateNetworkMetaFetchActionsClassValue")},
                                  type: GraphQLString
                                },
                                _distance: { 
                                  name: "WeaviateNetworkMetaFetchActionsClassDistance",
                                  description: function() {
                                    return getDesc("WeaviateNetworkMetaFetchActionsClassDistance")},
                                  type: GraphQLFloat
                                },
                                _limit: { 
                                  name: "WeaviateNetworkMetaFetchActionsClassLimit",
                                  description: function() {
                                    return getDesc("WeaviateNetworkMetaFetchActionsClassLimit")},
                                  type: GraphQLFloat
                                },
                                _kinds: { 
                                  name: "WeaviateNetworkMetaFetchActionsClassKinds",
                                  description: function() {
                                    return getDesc("WeaviateNetworkMetaFetchActionsClassKinds")},
                                  type: new GraphQLList(new GraphQLInputObjectType({
                                    name: "WeaviateNetworkMetaFetchActionsClassKindsObj",
                                    description: function() {
                                      return getDesc("WeaviateNetworkMetaFetchActionsClassKindsObj")},
                                    fields: {
                                      _value: {
                                        name: "WeaviateNetworkMetaFetchActionsClassKindsValue",
                                        description: function() {
                                          return getDesc("WeaviateNetworkMetaFetchActionsClassKindsValue")},
                                        type: GraphQLString
                                      },
                                      _weight: {
                                        name: "WeaviateNetworkMetaFetchActionsClassKindsWeight",
                                        description: function() {
                                          return getDesc("WeaviateNetworkMetaFetchActionsClassKindsWeight")},
                                        type: GraphQLFloat
                                      }
                                    }
                                  }))
                                },
                              },
                              type: new GraphQLList(new GraphQLObjectType({
                                name: "WeaviateNetworkMetaFetchActionsClassObj",
                                description: function() {
                                  return getDesc("WeaviateNetworkMetaFetchActionsClassObj")},
                                fields: {
                                  orbit: {
                                    name: "WeaviateNetworkMetaFetchActionsClassOrbit",
                                    description: function() {
                                      return getDesc("WeaviateNetworkMetaFetchActionsClassOrbit")},
                                    type: new GraphQLObjectType({
                                      name: "WeaviateNetworkMetaFetchActionsClassOrbitObj",
                                      description: function() {
                                        return getDesc("WeaviateNetworkMetaFetchActionsClassOrbitObj")},
                                      fields: {
                                        value: {
                                          name: "WeaviateNetworkMetaFetchActionsClassOrbitValue",
                                          description: function() {
                                            return getDesc("WeaviateNetworkMetaFetchActionsClassOrbitValue")},
                                          type: GraphQLString,
                                          resolve(parentValue, args) {
                                            console.log("resolve WeaviateNetworkMetaFetchActionsClassOrbitValue")
                                            return [{}] // resolve with empty array
                                          }
                                        },
                                        distance: {
                                          name: "WeaviateNetworkMetaFetchActionsClassOrbitDistance",
                                          description: function() {
                                            return getDesc("WeaviateNetworkMetaFetchActionsClassOrbitDistance")},
                                          type: GraphQLFloat,
                                          resolve(parentValue, args) {
                                            console.log("resolve WeaviateNetworkMetaFetchActionsClassOrbitDistance")
                                            return [{}] // resolve with empty array
                                          }
                                        },
                                      }
                                    }),
                                    resolve(parentValue, args) {
                                      console.log("resolve WeaviateNetworkMetaFetchActionsClassOrbit")
                                      return [{}] // resolve with empty array
                                    }
                                  },
                                  property: {
                                    name: "WeaviateNetworkMetaFetchActionsClassProperty",
                                    description: function() {
                                      return getDesc("WeaviateNetworkMetaFetchActionsClassProperty")},
                                    args: {
                                      _value: { 
                                        name: "WeaviateNetworkMetaFetchActionsClassPropertyValue",
                                        description: function() {
                                          return getDesc("WeaviateNetworkMetaFetchActionsClassPropertyValue")},
                                        type: GraphQLString
                                      },
                                      _distance: { 
                                        name: "WeaviateNetworkMetaFetchActionsClassPropertyDistance",
                                        description: function() {
                                          return getDesc("WeaviateNetworkMetaFetchActionsClassPropertyDistance")},
                                        type: GraphQLFloat
                                      },
                                      _limit: { 
                                        name: "WeaviateNetworkMetaFetchActionsClassPropertyLimit",
                                        description: function() {
                                          return getDesc("WeaviateNetworkMetaFetchActionsClassPropertyLimit")},
                                        type: GraphQLFloat
                                      },
                                      _kinds: { 
                                        name: "WeaviateNetworkMetaFetchActionsClassPropertyKinds",
                                        description: function() {
                                          return getDesc("WeaviateNetworkMetaFetchActionsClassPropertyKinds")},
                                        type: new GraphQLList(new GraphQLInputObjectType({
                                          name: "WeaviateNetworkMetaFetchActionsClassPropertyKindsObj",
                                          description: function() {
                                            return getDesc("WeaviateNetworkMetaFetchActionsClassPropertyKindsObj")},
                                          fields: {
                                            _value: {
                                              name: "WeaviateNetworkMetaFetchActionsClassPropertyKindsValue",
                                              description: function() {
                                                return getDesc("WeaviateNetworkMetaFetchActionsClassPropertyKindsValue")},
                                              type: GraphQLString
                                            },
                                            _weight: {
                                              name: "WeaviateNetworkMetaFetchActionsClassPropertyKindsWeight",
                                              description: function() {
                                                return getDesc("WeaviateNetworkMetaFetchActionsClassPropertyKindsWeight")},
                                              type: GraphQLFloat
                                            }
                                          }
                                        }))
                                      },
                                    },
                                    type: new GraphQLList(new GraphQLObjectType({
                                      name: "WeaviateNetworkMetaFetchActionsClassPropertyObj",
                                      description: function() {
                                        return getDesc("WeaviateNetworkMetaFetchActionsClassPropertyObj")},
                                      fields: {
                                        orbit: {
                                          name: "WeaviateNetworkMetaFetchActionsClassPropertyOrbit",
                                          description: function() {
                                            return getDesc("WeaviateNetworkMetaFetchActionsClassPropertyOrbit")},
                                          type: new GraphQLObjectType({
                                            name: "WeaviateNetworkMetaFetchActionsClassPropertyOrbitObj",
                                            description: function() {
                                              return getDesc("WeaviateNetworkMetaFetchActionsClassPropertyOrbitObj")},
                                            fields: {
                                              value: {
                                                name: "WeaviateNetworkMetaFetchActionsClassPropertyOrbitValue",
                                                description: function() {
                                                  return getDesc("WeaviateNetworkMetaFetchActionsClassPropertyOrbitValue")},
                                                type: GraphQLString,
                                                resolve(parentValue, args) {
                                                  console.log("resolve WeaviateNetworkMetaFetchActionsClassPropertyOrbitValue")
                                                  return [{}] // resolve with empty array
                                                }
                                              },
                                              distance: {
                                                name: "WeaviateNetworkMetaFetchActionsClassPropertyOrbitDistance",
                                                description: function() {
                                                  return getDesc("WeaviateNetworkMetaFetchActionsClassPropertyOrbitDistance")},
                                                type: GraphQLFloat,
                                                resolve(parentValue, args) {
                                                  console.log("resolve WeaviateNetworkMetaFetchActionsClassPropertyOrbitDistance")
                                                  return [{}] // resolve with empty array
                                                }
                                              },
                                            }
                                          }),
                                          resolve(parentValue, args) {
                                            console.log("resolve WeaviateNetworkMetaFetchActionsClassPropertyOrbit")
                                            return [{}] // resolve with empty array
                                          }
                                        },
                                      }
                                    })),
                                    resolve(parentValue, args) {
                                      console.log("resolve WeaviateNetworkMetaFetchActionsClassProperty")
                                      return [{}] // resolve with empty array
                                    }
                                  }
                                }
                              })),
                              resolve(parentValue, args) {
                                console.log("resolve WeaviateNetworkMetaFetchActionsClass")
                                return [{}] // resolve with empty array
                              }
                            }
                          }
                        }),
                        resolve(parentValue, args) {
                          console.log("resolve WeaviateNetworkMetaFetchClass")
                          return [{}] // resolve with empty array
                        }
                      },
                      Beacon: {
                        name: "WeaviateNetworkMetaFetchBeacon",
                        description: function() {
                          return getDesc("WeaviateNetworkMetaFetchBeacon")},
                        args: {
                          _id: { // The id of the beacon like: weaviate://foo-bar-baz/UUI
                            name: "WeaviateNetworkMetaFetchBeaconId",
                            description: function() {
                              return getDesc("WeaviateNetworkMetaFetchBeaconId")},
                            type: GraphQLString
                          }
                        },
                        type: new GraphQLObjectType({
                          name: "WeaviateNetworkMetaFetchBeaconObj",
                          description: function() {
                            return getDesc("WeaviateNetworkMetaFetchBeaconObj")},
                          fields: {
                            classes: { // Returns an array of potential classes based on the contextionary
                              name: "WeaviateNetworkMetaFetchBeaconClasses",
                              description: function() {
                                return getDesc("WeaviateNetworkMetaFetchBeaconClasses")},
                              type: new GraphQLList(GraphQLString),
                              resolve(parentValue, args) {
                                console.log("resolve WeaviateNetworkMetaFetchBeaconClasses")
                                return [{}] // resolve with empty array
                              }
                            }, 
                            distances: { // Returns an array of the distances to the request based on the contextionary
                              name: "WeaviateNetworkMetaFetchBeaconDistances",
                              description: function() {
                                return getDesc("WeaviateNetworkMetaFetchBeaconDistances")},
                              type: new GraphQLList(GraphQLString),
                              resolve(parentValue, args) {
                                console.log("resolve WeaviateNetworkMetaFetchBeaconDistances")
                                return [{}] // resolve with empty array
                              }
                            }, 
                            properties: { 
                              name: "WeaviateNetworkMetaFetchBeaconProperties",
                              description: function() {
                                return getDesc("WeaviateNetworkMetaFetchBeaconProperties")},
                              type: new GraphQLList(new GraphQLObjectType({
                                name: "WeaviateNetworkMetaFetchBeaconPropertiesObj",
                                description: function() {
                                  return getDesc("WeaviateNetworkMetaFetchBeaconPropertiesObj")},
                                fields: {
                                  property: { // returns an array of potential properties based on the contextionary
                                    name: "WeaviateNetworkMetaFetchBeaconPropertiesProperty",
                                    description: function() {
                                      return getDesc("WeaviateNetworkMetaFetchBeaconPropertiesProperty")},
                                    type: GraphQLString,
                                    resolve(parentValue, args) {
                                      console.log("resolve WeaviateNetworkMetaFetchBeaconPropertiesProperty")
                                      return [{}] // resolve with empty array
                                    }
                                  }, 
                                  type: { // Returns the type (id est, string, int, cref etc)
                                    name: "WeaviateNetworkMetaFetchBeaconPropertiesType",
                                    description: function() {
                                      return getDesc("WeaviateNetworkMetaFetchBeaconPropertiesType")},
                                    type: GraphQLString, // should be enum of type (id est, string, int, cref etc)
                                    resolve(parentValue, args) {
                                      console.log("resolve WeaviateNetworkMetaFetchBeaconPropertiesType")
                                      return [{}] // resolve with empty array
                                    }
                                  }, 
                                  distance: { // Returns an array of the distances to the request based on the contextionary
                                    name: "WeaviateNetworkMetaFetchBeaconPropertiesDistance",
                                    description: function() {
                                      return getDesc("WeaviateNetworkMetaFetchBeaconPropertiesDistance")},
                                    type: GraphQLFloat,
                                    resolve(parentValue, args) {
                                      console.log("resolve WeaviateNetworkMetaFetchBeaconPropertiesDistance")
                                      return [{}] // resolve with empty array
                                    }
                                  }
                                }
                              })),
                              resolve(parentValue, args) {
                                console.log("resolve WeaviateNetworkMetaFetchBeaconProperties")
                                return [{}] // resolve with empty array
                              }
                            }
                          }
                        }),
                        resolve(parentValue, args) {
                          console.log("resolve WeaviateNetworkMetaFetchBeacon")
                          return [{}] // resolve with empty array
                        }
                      }
                    }
                  }),
                  resolve() {
                    console.log("resolve WeaviateNetworkMetaFetch")
                    return [{}] // resolve with empty array
                  }
                },
                FuzzyFetch: {
                  name: "WeaviateNetworkFuzzyFetch",
                  description: function() {
                    return getDesc("WeaviateNetworkFuzzyFetch")},
                  type: new GraphQLObjectType({
                    name: "WeaviateNetworkFuzzyFetchObj",
                    description: function() {
                      return getDesc("WeaviateNetworkFuzzyFetchObj")},
                    fields: {
                      Things: {
                        name: "WeaviateNetworkFuzzyFetchThings",
                        description: function() {
                          return getDesc("WeaviateNetworkFuzzyFetchThings")},
                        args: {
                          _class: { 
                            name: "WeaviateNetworkFuzzyFetchThingsClass",
                            description: function() {
                              return getDesc("WeaviateNetworkFuzzyFetchThingsClass")},
                            type: GraphQLString //Needs to be in contextionary, weight = always 1.0
                          },
                          _kinds: { 
                            name: "WeaviateNetworkFuzzyFetchThingsKinds",
                            description: function() {
                              return getDesc("WeaviateNetworkFuzzyFetchThingsKinds")},
                            type: new GraphQLList(new GraphQLInputObjectType({
                              name: "WeaviateNetworkFuzzyFetchThingsKindsObj",
                              description: function() {
                                return getDesc("WeaviateNetworkFuzzyFetchThingsKindsObj")},
                              fields: {
                                _value: {
                                  name: "WeaviateNetworkFuzzyFetchThingsKindsValue",
                                  description: function() {
                                    return getDesc("WeaviateNetworkFuzzyFetchThingsKindsValue")},
                                  type: GraphQLString,
                                },
                                _weight: {
                                  name: "WeaviateNetworkFuzzyFetchThingsKindsWeight",
                                  description: function() {
                                    return getDesc("WeaviateNetworkFuzzyFetchThingsKindsWeight")},
                                  type: GraphQLFloat,
                                }
                              }
                            }))    
                          },
                          _properties: { 
                            name: "WeaviateNetworkFuzzyFetchThingsProperties",
                            description: function() {
                              return getDesc("WeaviateNetworkFuzzyFetchThingsProperties")},
                            type: new GraphQLList(new GraphQLInputObjectType({
                              name: "WeaviateNetworkFuzzyFetchThingsPropertiesObj",
                              description: function() {
                                return getDesc("WeaviateNetworkFuzzyFetchThingsPropertiesObj")},
                              fields: {
                                _needle: {
                                  name: "WeaviateNetworkFuzzyFetchThingsPropertiesNeedle",
                                  description: function() {
                                    return getDesc("WeaviateNetworkFuzzyFetchThingsPropertiesNeedle")},
                                  type: new GraphQLList(new GraphQLInputObjectType({
                                    name: "WeaviateNetworkFuzzyFetchThingsPropertiesNeedleObj",
                                    description: function() {
                                      return getDesc("WeaviateNetworkFuzzyFetchThingsPropertiesNeedleObj")},
                                    fields: {
                                      _kinds: {
                                        name: "WeaviateNetworkFuzzyFetchThingsPropertiesNeedleKinds",
                                        description: function() {
                                          return getDesc("WeaviateNetworkFuzzyFetchThingsPropertiesNeedleKinds")},
                                        type: new GraphQLList(new GraphQLInputObjectType({
                                          name: "WeaviateNetworkFuzzyFetchThingsPropertiesNeedleKindsObj",
                                          description: function() {
                                            return getDesc("WeaviateNetworkFuzzyFetchThingsPropertiesNeedleKindsObj")},
                                          fields: {
                                            _value: {
                                              name: "WeaviateNetworkFuzzyFetchThingsPropertiesNeedleKindsValue",
                                              description: function() {
                                                return getDesc("WeaviateNetworkFuzzyFetchThingsPropertiesNeedleKindsValue")},
                                              type: GraphQLString,
                                            }, 
                                            _weight: {
                                              name: "WeaviateNetworkFuzzyFetchThingsPropertiesNeedleKindsWeight",
                                              description: function() {
                                                return getDesc("WeaviateNetworkFuzzyFetchThingsPropertiesNeedleKindsWeight")},
                                              type: GraphQLFloat,
                                            }
                                          }
                                        }))
                                      }
                                    }
                                  }))
                                },
                                _value: {
                                  name: "WeaviateNetworkFuzzyFetchThingsPropertiesValue",
                                  description: function() {
                                    return getDesc("WeaviateNetworkFuzzyFetchThingsPropertiesValue")},
                                  type: new GraphQLInputObjectType({
                                    name: "WeaviateNetworkFuzzyFetchThingsPropertiesValueObj",
                                    description: function() {
                                      return getDesc("WeaviateNetworkFuzzyFetchThingsPropertiesValueObj")},
                                    fields: {
                                      _needle: {
                                        name: "WeaviateNetworkFuzzyFetchThingsPropertiesValueNeedle",
                                        description: function() {
                                          return getDesc("WeaviateNetworkFuzzyFetchThingsPropertiesValueNeedle")},
                                        type: GraphQLString
                                      }, 
                                      _type: {
                                        name: "WeaviateNetworkFuzzyFetchThingsPropertiesValueType",
                                        description: function() {
                                          return getDesc("WeaviateNetworkFuzzyFetchThingsPropertiesValueType")},
                                        type: fuzzyFetchEnum // should be an ENUM of: [EQ, NEQ, PREFIX, REGEX, FUZZY] https://docs.janusgraph.org/latest/index-parameters.html#_full_text_search
                                      }
                                    }
                                  }),
                                }
                              }
                            }))
                          }
                        },
                        type: new GraphQLList(new GraphQLObjectType({
                          name: "WeaviateNetworkFuzzyFetchThingsObj",
                          description: function() {
                            return getDesc("WeaviateNetworkFuzzyFetchThingsObj")},
                          fields: {
                            beacons: {
                              name: "WeaviateNetworkFuzzyFetchThingsBeacons",
                              description: function() {
                                return getDesc("WeaviateNetworkFuzzyFetchThingsBeacons")},
                              type: new GraphQLList(new GraphQLObjectType({
                                name: "WeaviateNetworkFuzzyFetchThingsBeaconsObj",
                                description: function() {
                                  return getDesc("WeaviateNetworkFuzzyFetchThingsBeaconsObj")},
                                fields: {
                                  beacon: { // The beacon to do a convertedfetch
                                    name: "WeaviateNetworkFuzzyFetchThingsBeaconsBeacon",
                                    description: function() {
                                      return getDesc("WeaviateNetworkFuzzyFetchThingsBeaconsBeacon")},
                                    type: GraphQLString,
                                    resolve(parentValue, args) {
                                      console.log("resolve WeaviateNetworkFuzzyFetchThingsBeaconsBeacon")
                                      return [{}] // resolve with empty array
                                    }
                                  }, 
                                  distance: { //  What is the distance to the original request?
                                    name: "WeaviateNetworkFuzzyFetchThingsBeaconsBeaconDistance",
                                    description: function() {
                                      return getDesc("WeaviateNetworkFuzzyFetchThingsBeaconsBeaconDistance")},
                                    type: GraphQLFloat, // should be enum of type (id est, string, int, cref etc)
                                    resolve(parentValue, args) {
                                      console.log("resolve WeaviateNetworkFuzzyFetchThingsBeaconsBeaconDistance")
                                      return [{}] // resolve with empty array
                                    }
                                  }
                                }
                              })),
                              resolve(parentValue, args) {
                                console.log("resolve WeaviateNetworkFuzzyFetchThingsBeacons")
                                return [{}] // resolve with empty array
                              }
                            },
                          }
                        })),
                        resolve(parentValue, args) {
                          console.log("resolve WeaviateNetworkFuzzyFetchThings")
                          return [{}] // resolve with empty array
                        }
                      },
                      Actions: {
                        name: "WeaviateNetworkFuzzyFetchActions",
                        description: function() {
                          return getDesc("WeaviateNetworkFuzzyFetchActions")},
                        args: {
                          _class: { 
                            name: "WeaviateNetworkFuzzyFetchActionsClass",
                            description: function() {
                              return getDesc("WeaviateNetworkFuzzyFetchActionsClass")},
                            type: GraphQLString
                          },
                          _kinds: { 
                            name: "WeaviateNetworkFuzzyFetchActionsKinds",
                            description: function() {
                              return getDesc("WeaviateNetworkFuzzyFetchActionsKinds")},
                            type: new GraphQLList(new GraphQLInputObjectType({
                              name: "WeaviateNetworkFuzzyFetchActionsKindsObj",
                              description: function() {
                                return getDesc("WeaviateNetworkFuzzyFetchActionsKindsObj")},
                              fields: {
                                _value: {
                                  name: "WeaviateNetworkFuzzyFetchActionsKindsValue",
                                  description: function() {
                                    return getDesc("WeaviateNetworkFuzzyFetchActionsKindsValue")},
                                  type: GraphQLString,
                                },
                                _weight: {
                                  name: "WeaviateNetworkFuzzyFetchActionsKindsWeight",
                                  description: function() {
                                    return getDesc("WeaviateNetworkFuzzyFetchActionsKindsWeight")},
                                  type: GraphQLFloat,
                                }
                              }
                            }))    
                          },
                          _properties: { 
                            name: "WeaviateNetworkFuzzyFetchActionsProperties",
                            description: function() {
                              return getDesc("WeaviateNetworkFuzzyFetchActionsProperties")},
                            type: new GraphQLList(new GraphQLInputObjectType({
                              name: "WeaviateNetworkFuzzyFetchActionsPropertiesObj",
                              description: function() {
                                return getDesc("WeaviateNetworkFuzzyFetchActionsPropertiesObj")},
                              fields: {
                                _needle: {
                                  name: "WeaviateNetworkFuzzyFetchActionsPropertiesNeedle",
                                  description: function() {
                                    return getDesc("WeaviateNetworkFuzzyFetchActionsPropertiesNeedle")},
                                  type: new GraphQLList(new GraphQLInputObjectType({
                                    name: "WeaviateNetworkFuzzyFetchActionsPropertiesNeedleObj",
                                    description: function() {
                                      return getDesc("WeaviateNetworkFuzzyFetchActionsPropertiesNeedleObj")},
                                    fields: {
                                      _kinds: {
                                        name: "WeaviateNetworkFuzzyFetchActionsPropertiesNeedleKinds",
                                        description: function() {
                                          return getDesc("WeaviateNetworkFuzzyFetchActionsPropertiesNeedleKinds")},
                                        type: new GraphQLList(new GraphQLInputObjectType({
                                          name: "WeaviateNetworkFuzzyFetchActionsPropertiesNeedleKindsObj",
                                          description: function() {
                                            return getDesc("WeaviateNetworkFuzzyFetchActionsPropertiesNeedleKindsObj")},
                                          fields: {
                                            _value: {
                                              name: "WeaviateNetworkFuzzyFetchActionsPropertiesNeedleKindsValue",
                                              description: function() {
                                                return getDesc("WeaviateNetworkFuzzyFetchActionsPropertiesNeedleKindsValue")},
                                              type: GraphQLString,
                                            }, 
                                            _weight: {
                                              name: "WeaviateNetworkFuzzyFetchActionsPropertiesNeedleKindsWeight",
                                              description: function() {
                                                return getDesc("WeaviateNetworkFuzzyFetchActionsPropertiesNeedleKindsWeight")},
                                              type: GraphQLFloat,
                                            }
                                          }
                                        }))
                                      }
                                    }
                                  }))
                                },
                                _value: {
                                  name: "WeaviateNetworkFuzzyFetchActionsPropertiesValue",
                                  description: function() {
                                    return getDesc("WeaviateNetworkFuzzyFetchActionsPropertiesValue")},
                                  type: new GraphQLInputObjectType({
                                    name: "WeaviateNetworkFuzzyFetchActionsPropertiesValueObj",
                                    description: function() {
                                      return getDesc("WeaviateNetworkFuzzyFetchActionsPropertiesValueObj")},
                                    fields: {
                                      _needle: {
                                        name: "WeaviateNetworkFuzzyFetchActionsPropertiesValueNeedle",
                                        description: function() {
                                          return getDesc("WeaviateNetworkFuzzyFetchActionsPropertiesValueNeedle")},
                                        type: GraphQLString
                                      }, 
                                      _type: {
                                        name: "WeaviateNetworkFuzzyFetchActionsPropertiesValueType",
                                        description: function() {
                                          return getDesc("WeaviateNetworkFuzzyFetchActionsPropertiesValueType")},
                                        type: fuzzyFetchEnum // should be an ENUM of: [EQ, NEQ, PREFIX, REGEX, FUZZY] https://docs.janusgraph.org/latest/index-parameters.html#_full_text_search
                                      }
                                    }
                                  }),
                                }
                              }
                            }))
                          }
                        },
                        type: new GraphQLList(new GraphQLObjectType({
                          name: "WeaviateNetworkFuzzyFetchActionsObj",
                          description: function() {
                            return getDesc("WeaviateNetworkFuzzyFetchActionsObj")},
                          fields: {
                            beacons: {
                              name: "WeaviateNetworkFuzzyFetchActionsBeacons",
                              description: function() {
                                return getDesc("WeaviateNetworkFuzzyFetchActionsBeacons")},
                              type: new GraphQLList(new GraphQLObjectType({
                                name: "WeaviateNetworkFuzzyFetchActionsBeaconsObj",
                                description: function() {
                                  return getDesc("WeaviateNetworkFuzzyFetchActionsBeaconsObj")},
                                fields: {
                                  beacon: {
                                    name: "WeaviateNetworkFuzzyFetchActionsBeaconsBeacon",
                                    description: function() {
                                      return getDesc("WeaviateNetworkFuzzyFetchActionsBeaconsBeacon")},
                                    type: GraphQLString,
                                    resolve(parentValue, args) {
                                      console.log("resolve WeaviateNetworkFuzzyFetchActionsBeaconsBeacon")
                                      return [{}] // resolve with empty array
                                    }
                                  }, 
                                  distance: {
                                    name: "WeaviateNetworkFuzzyFetchActionsBeaconsBeaconDistance",
                                    description: function() {
                                      return getDesc("WeaviateNetworkFuzzyFetchActionsBeaconsBeaconDistance")},
                                    type: GraphQLFloat, // should be enum of type (id est, string, int, cref etc)
                                    resolve(parentValue, args) {
                                      console.log("resolve WeaviateNetworkFuzzyFetchActionsBeaconsBeaconDistance")
                                      return [{}] // resolve with empty array
                                    }
                                  }
                                }
                              })),
                              resolve(parentValue, args) {
                                console.log("resolve WeaviateNetworkFuzzyFetchActionsBeacons")
                                return [{}] // resolve with empty array
                              }
                            },
                          }
                        })),
                        resolve(parentValue, args) {
                          console.log("resolve WeaviateNetworkFuzzyFetchActions")
                          return [{}] // resolve with empty array
                        }
                      },
                    }
                  }),
                  resolve() {
                    console.log("resolve WeaviateNetworkFuzzyFetch")
                    return [{}] // resolve with empty array
                  },
                },
                ConvertedFetch: {
                  name: "WeaviateNetworkConvertedFetch",
                  description: function() {
                    return getDesc("WeaviateNetworkConvertedFetch")},
                  type: new GraphQLList(GraphQLString), // no input required yet
                  resolve() {
                    console.log("resolve WeaviateNetworkConvertedFetch")
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
