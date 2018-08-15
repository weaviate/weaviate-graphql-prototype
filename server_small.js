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

// const GetWhereValueType = UnionInputType({
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
var fetchWhereFields = {
  AND: {
    name: "FetchWhereFieldAND",
    description: function() {
      return getDesc("FetchWhereFieldAND")},
    type: new GraphQLList(new GraphQLInputObjectType({
      name: "FetchWhereFieldANDInpObj",
      description: function() {
        return getDesc("FetchWhereFieldANDInpObj")},
      fields: function () {return fetchWhereFields}
    }))
  },
  OR: {
    name: "FetchWhereFieldOR",
    description: function() {
      return getDesc("FetchWhereFieldOR")},
    type: new GraphQLList(new GraphQLInputObjectType({
      name: "FetchWhereFieldORInpObj",
      description: function() {
        return getDesc("FetchWhereFieldORInpObj")},
      fields: function () {return fetchWhereFields}
    }))
  },
  path: { 
    name: "FetchWherePathField",
    description: function() {
      return getDesc("FetchWherePathField")}, //"path from the root Thing or Action until class property",
    type: new GraphQLList(GraphQLString) 
  },
  value: { 
    name: "FetchWhereValueField",
    description: function() {
      return getDesc("FetchWhereValueField")}, //"the value to class property should be filtered at",
    type: GraphQLString 
  }
}


/**
 *  Create filter for Get
 */

var filterFields = {
  AND: {
    name: "FetchWhereAND",
    description: function() {
      return getDesc("FetchWhereAND")},
    type: new GraphQLInputObjectType({
      name: "FetchWhereANDInpObj",
      description: function() {
        return getDesc("FetchWhereANDInpObj")},
      fields: function () {return filterFields}
    })
  },
  OR: {
    name: "FetchWhereAND",
    description: function() {
      return getDesc("FetchWhereAND")},
    type: new GraphQLInputObjectType({
      name: "FetchWhereORInpObj",
      description: function() {
        return getDesc("FetchWhereORInpObj")},
      fields: function () {return filterFields}
    })
  },
  EQ: { 
    name: 'FetchWhereEQ',
    description: function() {
      //console.log(Object.keys(this))
      return getDesc("FetchWhereEQ")}, 
    type: new GraphQLList(new GraphQLInputObjectType({ // is path equal to
      name: 'FetchWhereEQInpObj',
      description: function() {
        return getDesc(this.name)}, 
      fields: fetchWhereFields
    }))
  },
  NEQ: { 
    name: 'FetchWhereNEQ',
    description: function() {
      return getDesc("FetchWhereNEQ")},
    type: new GraphQLList(new GraphQLInputObjectType({ // path is NOT equal to
      name: 'FetchWhereNEQInpObj',
      description: function() {
        return getDesc("FetchWhereNEQInpObj")},
      fields: fetchWhereFields
    }))
  },
  IE: { 
    name: 'FetchWhereIE',
    description: function() {
      return getDesc("FetchWhereIE")},
    type: new GraphQLList(new GraphQLInputObjectType({ //  = InEquality between values.
      name: 'FetchWhereIEInpObj',
      description: function() {
        return getDesc("FetchWhereIEInpObj")},
      fields: fetchWhereFields
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
    propsForArgs[item.class]["certainty"] = {
      name: "certaintyFilter",
      type: GraphQLFloat,
      description: function() {
        return getDesc("certaintyFilter")},
    }
    // always return limit
    propsForArgs[item.class]["limit"] = {
      name: "limitFilter",
      type: GraphQLInt,
      description: function() {
        return getDesc("limitFilter")},
    }
    // always return skip
    propsForArgs[item.class]["skip"] = {
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
                        limit: { 
                          name: "limitFilter",
                          description: function() {
                            return getDesc("limitFilter")},
                          type: GraphQLInt 
                        },
                        skip: { 
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
        return demoResolver.metaDataResolver(parentValue.data, singleClass.class, args, parentValue.maxArraySize)
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
                Get: {
                  name: "WeaviateLocalGet",
                  description: function() {
                    return getDesc("WeaviateLocalGet")},
                  args: {
                    where: { 
                      name: "WeaviateLocalGetWhere",
                      description: function() {
                        return getDesc("WeaviateLocalGetWhere")},
                      type: new GraphQLInputObjectType({
                        name: "WeaviateLocalGetWhereInpObj",
                        description: function() {
                          return getDesc("WeaviateLocalGetWhereInpObj")},
                        fields: filterFields
                      }) 
                    }
                  },
                  type: new GraphQLObjectType({
                    name: "WeaviateLocalGetObj",
                    description: function() {
                      return getDesc("WeaviateLocalGetObj")},
                    fields: {
                      Things: {
                        name: "WeaviateLocalGetThings",
                        description: function() {
                          return getDesc("WeaviateLocalGetThings")},
                        type: new GraphQLObjectType({
                          name: "WeaviateLocalGetThingsObj",
                          description: function() {
                            return getDesc("WeaviateLocalGetThingsObj")},
                          fields: rootClassesThingsFields
                        }),
                        resolve(parentValue) {
                          console.log("resolve WeaviateLocalGetThings")
                          return parentValue.Things // resolve with empty array
                        },
                      },
                      Actions: {
                        name: "WeaviateLocalGetActions",
                        description: function() {
                          return getDesc("WeaviateLocalGetActions")},
                        type: new GraphQLObjectType({
                          name: "WeaviateLocalGetActionsObj",
                          description: function() {
                            return getDesc("WeaviateLocalGetActionsObj")},
                          fields: rootClassesActionsFields
                        }),
                        resolve(parentValue) {
                          console.log("resolve WeaviateLocalGetActions")
                          return parentValue.Actions // resolve with empty array
                        }
                      }
                    }
                  }),
                  resolve(parentValue, args) {
                    console.log("resolve WeaviateLocalGet")
                    return demoResolver.resolveGet(args.where) // resolve with empty array
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
                      //     stack: {
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
                      //     classes: {
                      //       name: "WeaviateLocalHelpersFetchPinPointClasses",
                      //       description: function() {
                      //         return getDesc("WeaviateLocalHelpersFetchPinPointClasses")},
                      //       type: new GraphQLList(classesEnum)
                      //     },
                      //     properties: {
                      //       name: "WeaviateLocalHelpersFetchPinPointProperties",
                      //       description: function() {
                      //         return getDesc("WeaviateLocalHelpersFetchPinPointProperties")},
                      //       type: new GraphQLList(GraphQLString)
                      //     }, //an array of potential classes (they should be in the ontology, ideally related to the class!)
                      //     needle: {
                      //       name: "WeaviateLocalHelpersFetchPinPointNeedle",
                      //       description: function() {
                      //         return getDesc("WeaviateLocalHelpersFetchPinPointNeedle")},
                      //       type: GraphQLString}, // (for example: needle: "Netflix"
                      //     searchType: {
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
                      //     limit: {
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
                      //   resolve(,args) {
                      //     console.log("resolve WeaviateLocalHelpersFetchPinPoint")
                      //     return args // resolve with empty array
                      //   },
                      // },
                      // Relate: {
                      //   name: "WeaviateLocalHelpersFetchRelate",
                      //   description: function() {
                      //     return getDesc("WeaviateLocalHelpersFetchRelate")},
                      //   args: {
                      //     where: { 
                      //       name: "WeaviateLocalHelpersFetchRelateWhere",
                      //       description: function() {
                      //         return getDesc("WeaviateLocalHelpersFetchRelateWhere")},
                      //       type: new GraphQLInputObjectType({
                      //         name: "WeaviateLocalHelpersFetchRelateWhereInpObj",
                      //         description: function() {
                      //           return getDesc("WeaviateLocalHelpersFetchRelateWhereInpObj")},
                      //         fields: filterFields
                      //       }) 
                      //     },
                      //     classes: {
                      //       name: "WeaviateLocalHelpersFetchRelateClasses",
                      //       description: function() {
                      //         return getDesc("WeaviateLocalHelpersFetchRelateClasses")},
                      //       type: new GraphQLList(classesEnum)
                      //     },
                      //     searchType: {
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
                      //     maxPathLength: {
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
                GetMeta: {
                  name: "WeaviateLocalGetMeta",
                  description: function() {
                    return getDesc("WeaviateLocalGetMeta")},
                  args: {
                    where: { 
                      name: "WeaviateLocalGetMetaWhere",
                      description: function() {
                        return getDesc("WeaviateLocalGetMetaWhere")},
                      type: new GraphQLInputObjectType({
                        name: "WeaviateLocalGetMetaWhereInpObj",
                        description: function() {
                          return getDesc("WeaviateLocalGetMetaWhereInpObj")},
                        fields: filterFields
                      }) 
                  }
                  },
                  type: new GraphQLObjectType({
                    name: "WeaviateLocalGetMetaObj",
                    description: function() {
                      return getDesc("WeaviateLocalGetMetaObj")},
                    fields: {
                      Generics: {
                        name: "WeaviateLocalGetMetaGenerics",
                        description: function() {
                          return getDesc("WeaviateLocalGetMetaGenerics")},
                        type: new GraphQLObjectType({
                          name: "WeaviateLocalGetMetaGenericsObj",
                          description: function() {
                            return getDesc("WeaviateLocalGetMetaGenericsObj")},
                          fields: {
                            Things: {
                              name: "WeaviateLocalGetMetaGenericsThings",
                              description: function() {
                                return getDesc("WeaviateLocalGetMetaGenericsThings")},
                              args: {
                                maxArraySize: { 
                                  name: "WeaviateLocalGetMetaGenericsMaxArraySize",
                                  description: function() {
                                    return getDesc("WeaviateLocalGetMetaGenericsMaxArraySize")},
                                  type: GraphQLString 
                                } 
                              },
                              type: new GraphQLObjectType({
                                name: "WeaviateLocalGetMetaGenericsThingsObj",
                                description: function() {
                                  return getDesc("WeaviateLocalGetMetaGenericsThingsObj")},
                                fields: metaRootClassesThingsFields
                              }),
                              resolve(parentValue, args) {
                                console.log("resolve WeaviateLocalGetMetaGenericsThings")
                                return {"data": parentValue.Things, "maxArraySize": args.maxArraySize} // resolve with empty array
                              }
                            }, 
                            Actions: {
                              name: "WeaviateLocalGetMetaGenericsActions",
                              description: function() {
                                return getDesc("WeaviateLocalGetMetaGenericsActions")},
                              args: {
                                maxArraySize: { 
                                  name: "WeaviateLocalGetMetaGenericsMaxArraySize",
                                  description: function() {
                                    return getDesc("WeaviateLocalGetMetaGenericsMaxArraySize")},
                                  type: GraphQLString 
                                } 
                              },
                              type: new GraphQLObjectType({
                                name: "WeaviateLocalGetMetaGenericsActionsObj",
                                description: function() {
                                  return getDesc("WeaviateLocalGetMetaGenericsActionsObj")},
                                fields: metaRootClassesActionsFields
                              }),
                              resolve(parentValue, args) {
                                console.log("resolve WeaviateLocalGetMetaGenericsActions")
                                return {"data": parentValue.Things, "maxArraySize": args.maxArraySize} // resolve with empty array
                              }
                            }
                          },
                        }),
                        resolve(_,args) {
                          console.log("resolve WeaviateLocalGetMetaGenerics")
                          return demoResolver.resolveGet(args.where)
                        },
                      }
                    }
                  }),
                  resolve() {
                    console.log("resolve WeaviateLocalGetMeta")
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
              networkTimeout: { 
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
                GetMeta: {
                  name: "WeaviateNetworkGetMeta",
                  description: function() {
                    return getDesc("WeaviateNetworkGetMeta")},
                  type: new GraphQLObjectType({
                    name: "WeaviateNetworkGetMetaObj",
                    description: function() {
                      return getDesc("WeaviateNetworkGetMetaObj")},
                    fields: {
                      Things: {
                        name: "WeaviateNetworkGetMetaThings",
                        description: function() {
                          return getDesc("WeaviateNetworkGetMetaThings")},
                        type: new GraphQLObjectType({
                          name: "WeaviateNetworkGetMetaThingsObj",
                          description: function() {
                            return getDesc("WeaviateNetworkGetMetaThingsObj")},
                          fields: {
                            Class: {
                              name: "WeaviateNetworkGetMetaThingsClass",
                              description: function() {
                                return getDesc("WeaviateNetworkGetMetaThingsClass")},
                              args: {
                                value: { 
                                  name: "WeaviateNetworkGetMetaThingsClassValue",
                                  description: function() {
                                    return getDesc("WeaviateNetworkGetMetaThingsClassValue")},
                                  type: GraphQLString // needs to be in contextionary, weight = always 1.0
                                },
                                distance: {  // How close?
                                  name: "WeaviateNetworkGetMetaThingsClassDistance",
                                  description: function() {
                                    return getDesc("WeaviateNetworkGetMetaThingsClassDistance")},
                                  type: GraphQLFloat // needs to be between 0 and 1
                                },
                                limit: { // how many classes to return maximum
                                  name: "WeaviateNetworkGetMetaThingsClassLimit",
                                  description: function() {
                                    return getDesc("WeaviateNetworkGetMetaThingsClassLimit")},
                                  type: GraphQLFloat
                                },
                                kinds: { // Any kinds to define centroids?
                                  name: "WeaviateNetworkGetMetaThingsClassKinds",
                                  description: function() {
                                    return getDesc("WeaviateNetworkGetMetaThingsClassKinds")},
                                  type: new GraphQLList(new GraphQLInputObjectType({
                                    name: "WeaviateNetworkGetMetaThingsClassKindsObj",
                                    description: function() {
                                      return getDesc("WeaviateNetworkGetMetaThingsClassKindsObj")},
                                    fields: {
                                      value: {
                                        name: "WeaviateNetworkGetMetaThingsClassKindsValue",
                                        description: function() {
                                          return getDesc("WeaviateNetworkGetMetaThingsClassKindsValue")},
                                        type: GraphQLString // Needs to be in contextionary
                                      },
                                      weight: {
                                        name: "WeaviateNetworkGetMetaThingsClassKindsWeight",
                                        description: function() {
                                          return getDesc("WeaviateNetworkGetMetaThingsClassKindsWeight")},
                                        type: GraphQLFloat // What weight should be used to calculate centroid
                                      }
                                    }
                                  }))
                                },
                              },
                              type: new GraphQLList(new GraphQLObjectType({
                                name: "WeaviateNetworkGetMetaThingsClassObj",
                                description: function() {
                                  return getDesc("WeaviateNetworkGetMetaThingsClassObj")},
                                fields: {
                                  orbit: { // What's in orbit of this property?
                                    name: "WeaviateNetworkGetMetaThingsClassOrbit",
                                    description: function() {
                                      return getDesc("WeaviateNetworkGetMetaThingsClassOrbit")},
                                    type: new GraphQLObjectType({
                                      name: "WeaviateNetworkGetMetaThingsClassOrbitObj",
                                      description: function() {
                                        return getDesc("WeaviateNetworkGetMetaThingsClassOrbitObj")},
                                      fields: {
                                        value: { // What's the contextionary value that is closest
                                          name: "WeaviateNetworkGetMetaThingsClassOrbitValue",
                                          description: function() {
                                            return getDesc("WeaviateNetworkGetMetaThingsClassOrbitValue")},
                                          type: GraphQLString,
                                          resolve(parentValue, args) {
                                            console.log("resolve WeaviateNetworkGetMetaThingsClassOrbitValue")
                                            return [{}] // resolve with empty array
                                          }
                                        },
                                        distance: { // What is the distance to the original request?
                                          name: "WeaviateNetworkGetMetaThingsClassOrbitDistance",
                                          description: function() {
                                            return getDesc("WeaviateNetworkGetMetaThingsClassOrbitDistance")},
                                          type: GraphQLFloat,
                                          resolve(parentValue, args) {
                                            console.log("resolve WeaviateNetworkGetMetaThingsClassOrbitDistance")
                                            return [{}] // resolve with empty array
                                          }
                                        },
                                      }
                                    }),
                                    resolve(parentValue, args) {
                                      console.log("resolve WeaviateNetworkGetMetaThingsClassOrbit")
                                      return [{}] // resolve with empty array
                                    }
                                  },
                                  property: {
                                    name: "WeaviateNetworkGetMetaThingsClassProperty",
                                    description: function() {
                                      return getDesc("WeaviateNetworkGetMetaThingsClassProperty")},
                                    args: {
                                      value: { 
                                        name: "WeaviateNetworkGetMetaThingsClassPropertyValue",
                                        description: function() {
                                          return getDesc("WeaviateNetworkGetMetaThingsClassPropertyValue")},
                                        type: GraphQLString // Needs to be in contextionary, weight = always 1.0
                                      },
                                      distance: { 
                                        name: "WeaviateNetworkGetMetaThingsClassPropertyDistance",
                                        description: function() {
                                          return getDesc("WeaviateNetworkGetMetaThingsClassPropertyDistance")},
                                        type: GraphQLFloat // How close? needs to be 0-1
                                      },
                                      limit: { // How close?
                                        name: "WeaviateNetworkGetMetaThingsClassPropertyLimit",
                                        description: function() {
                                          return getDesc("WeaviateNetworkGetMetaThingsClassPropertyLimit")},
                                        type: GraphQLFloat
                                      },
                                      kinds: { // Any kinds to define centroids?
                                        name: "WeaviateNetworkGetMetaThingsClassPropertyKinds",
                                        description: function() {
                                          return getDesc("WeaviateNetworkGetMetaThingsClassPropertyKinds")},
                                        type: new GraphQLList(new GraphQLInputObjectType({
                                          name: "WeaviateNetworkGetMetaThingsClassPropertyKindsObj",
                                          description: function() {
                                            return getDesc("WeaviateNetworkGetMetaThingsClassPropertyKindsObj")},
                                          fields: {
                                            value: {
                                              name: "WeaviateNetworkGetMetaThingsClassPropertyKindsValue",
                                              description: function() {
                                                return getDesc("WeaviateNetworkGetMetaThingsClassPropertyKindsValue")},
                                              type: GraphQLString //Needs to be in contextionary
                                            },
                                            weight: {
                                              name: "WeaviateNetworkGetMetaThingsClassPropertyKindsWeight",
                                              description: function() {
                                                return getDesc("WeaviateNetworkGetMetaThingsClassPropertyKindsWeight")},
                                              type: GraphQLFloat // What weight should be used to calculate centroid 0-1
                                            }
                                          }
                                        }))
                                      },
                                    },
                                    type: new GraphQLList(new GraphQLObjectType({
                                      name: "WeaviateNetworkGetMetaThingsClassPropertyObj",
                                      description: function() {
                                        return getDesc("WeaviateNetworkGetMetaThingsClassPropertyObj")},
                                      fields: {
                                        orbit: { // What's in orbit of this property?
                                          name: "WeaviateNetworkGetMetaThingsClassPropertyOrbit",
                                          description: function() {
                                            return getDesc("WeaviateNetworkGetMetaThingsClassPropertyOrbit")},
                                          type: new GraphQLObjectType({
                                            name: "WeaviateNetworkGetMetaThingsClassPropertyOrbitObj",
                                            description: function() {
                                              return getDesc("WeaviateNetworkGetMetaThingsClassPropertyOrbitObj")},
                                            fields: {
                                              value: { // What's the contextionary value that is closest
                                                name: "WeaviateNetworkGetMetaThingsClassPropertyOrbitValue",
                                                description: function() {
                                                  return getDesc("WeaviateNetworkGetMetaThingsClassPropertyOrbitValue")},
                                                type: GraphQLString,
                                                resolve(parentValue, args) {
                                                  console.log("resolve WeaviateNetworkGetMetaThingsClassPropertyOrbitValue")
                                                  return [{}] // resolve with empty array
                                                }
                                              },
                                              distance: { // What is the distance to the original request?
                                                name: "WeaviateNetworkGetMetaThingsClassPropertyOrbitDistance",
                                                description: function() {
                                                  return getDesc("WeaviateNetworkGetMetaThingsClassPropertyOrbitDistance")},
                                                type: GraphQLFloat, // 0-1
                                                resolve(parentValue, args) {
                                                  console.log("resolve WeaviateNetworkGetMetaThingsClassPropertyOrbitDistance")
                                                  return [{}] // resolve with empty array
                                                }
                                              },
                                            }
                                          }),
                                          resolve(parentValue, args) {
                                            console.log("resolve WeaviateNetworkGetMetaThingsClassPropertyOrbit")
                                            return [{}] // resolve with empty array
                                          }
                                        },
                                      }
                                    })),
                                    resolve(parentValue, args) {
                                      console.log("resolve WeaviateNetworkGetMetaThingsClassProperty")
                                      return [{}] // resolve with empty array
                                    }
                                  }
                                }
                              })),
                              resolve(parentValue, args) {
                                console.log("resolve WeaviateNetworkGetMetaThingsClass")
                                return [{}] // resolve with empty array
                              }
                            }
                          }
                        }),
                        resolve(parentValue, args) {
                          console.log("resolve WeaviateNetworkGetMetaClass")
                          return [{}] // resolve with empty array
                        }
                      },
                      Actions: {
                        name: "WeaviateNetworkGetMetaActions",
                        description: function() {
                          return getDesc("WeaviateNetworkGetMetaActions")},
                        type: new GraphQLObjectType({
                          name: "WeaviateNetworkGetMetaActionsObj",
                          description: function() {
                            return getDesc("WeaviateNetworkGetMetaActionsObj")},
                          fields: {
                            Class: {
                              name: "WeaviateNetworkGetMetaActionsClass",
                              description: function() {
                                return getDesc("WeaviateNetworkGetMetaActionsClass")},
                              args: {
                                value: { 
                                  name: "WeaviateNetworkGetMetaActionsClassValue",
                                  description: function() {
                                    return getDesc("WeaviateNetworkGetMetaActionsClassValue")},
                                  type: GraphQLString
                                },
                                distance: { 
                                  name: "WeaviateNetworkGetMetaActionsClassDistance",
                                  description: function() {
                                    return getDesc("WeaviateNetworkGetMetaActionsClassDistance")},
                                  type: GraphQLFloat
                                },
                                limit: { 
                                  name: "WeaviateNetworkGetMetaActionsClassLimit",
                                  description: function() {
                                    return getDesc("WeaviateNetworkGetMetaActionsClassLimit")},
                                  type: GraphQLFloat
                                },
                                kinds: { 
                                  name: "WeaviateNetworkGetMetaActionsClassKinds",
                                  description: function() {
                                    return getDesc("WeaviateNetworkGetMetaActionsClassKinds")},
                                  type: new GraphQLList(new GraphQLInputObjectType({
                                    name: "WeaviateNetworkGetMetaActionsClassKindsObj",
                                    description: function() {
                                      return getDesc("WeaviateNetworkGetMetaActionsClassKindsObj")},
                                    fields: {
                                      value: {
                                        name: "WeaviateNetworkGetMetaActionsClassKindsValue",
                                        description: function() {
                                          return getDesc("WeaviateNetworkGetMetaActionsClassKindsValue")},
                                        type: GraphQLString
                                      },
                                      weight: {
                                        name: "WeaviateNetworkGetMetaActionsClassKindsWeight",
                                        description: function() {
                                          return getDesc("WeaviateNetworkGetMetaActionsClassKindsWeight")},
                                        type: GraphQLFloat
                                      }
                                    }
                                  }))
                                },
                              },
                              type: new GraphQLList(new GraphQLObjectType({
                                name: "WeaviateNetworkGetMetaActionsClassObj",
                                description: function() {
                                  return getDesc("WeaviateNetworkGetMetaActionsClassObj")},
                                fields: {
                                  orbit: {
                                    name: "WeaviateNetworkGetMetaActionsClassOrbit",
                                    description: function() {
                                      return getDesc("WeaviateNetworkGetMetaActionsClassOrbit")},
                                    type: new GraphQLObjectType({
                                      name: "WeaviateNetworkGetMetaActionsClassOrbitObj",
                                      description: function() {
                                        return getDesc("WeaviateNetworkGetMetaActionsClassOrbitObj")},
                                      fields: {
                                        value: {
                                          name: "WeaviateNetworkGetMetaActionsClassOrbitValue",
                                          description: function() {
                                            return getDesc("WeaviateNetworkGetMetaActionsClassOrbitValue")},
                                          type: GraphQLString,
                                          resolve(parentValue, args) {
                                            console.log("resolve WeaviateNetworkGetMetaActionsClassOrbitValue")
                                            return [{}] // resolve with empty array
                                          }
                                        },
                                        distance: {
                                          name: "WeaviateNetworkGetMetaActionsClassOrbitDistance",
                                          description: function() {
                                            return getDesc("WeaviateNetworkGetMetaActionsClassOrbitDistance")},
                                          type: GraphQLFloat,
                                          resolve(parentValue, args) {
                                            console.log("resolve WeaviateNetworkGetMetaActionsClassOrbitDistance")
                                            return [{}] // resolve with empty array
                                          }
                                        },
                                      }
                                    }),
                                    resolve(parentValue, args) {
                                      console.log("resolve WeaviateNetworkGetMetaActionsClassOrbit")
                                      return [{}] // resolve with empty array
                                    }
                                  },
                                  property: {
                                    name: "WeaviateNetworkGetMetaActionsClassProperty",
                                    description: function() {
                                      return getDesc("WeaviateNetworkGetMetaActionsClassProperty")},
                                    args: {
                                      value: { 
                                        name: "WeaviateNetworkGetMetaActionsClassPropertyValue",
                                        description: function() {
                                          return getDesc("WeaviateNetworkGetMetaActionsClassPropertyValue")},
                                        type: GraphQLString
                                      },
                                      distance: { 
                                        name: "WeaviateNetworkGetMetaActionsClassPropertyDistance",
                                        description: function() {
                                          return getDesc("WeaviateNetworkGetMetaActionsClassPropertyDistance")},
                                        type: GraphQLFloat
                                      },
                                      limit: { 
                                        name: "WeaviateNetworkGetMetaActionsClassPropertyLimit",
                                        description: function() {
                                          return getDesc("WeaviateNetworkGetMetaActionsClassPropertyLimit")},
                                        type: GraphQLFloat
                                      },
                                      kinds: { 
                                        name: "WeaviateNetworkGetMetaActionsClassPropertyKinds",
                                        description: function() {
                                          return getDesc("WeaviateNetworkGetMetaActionsClassPropertyKinds")},
                                        type: new GraphQLList(new GraphQLInputObjectType({
                                          name: "WeaviateNetworkGetMetaActionsClassPropertyKindsObj",
                                          description: function() {
                                            return getDesc("WeaviateNetworkGetMetaActionsClassPropertyKindsObj")},
                                          fields: {
                                            value: {
                                              name: "WeaviateNetworkGetMetaActionsClassPropertyKindsValue",
                                              description: function() {
                                                return getDesc("WeaviateNetworkGetMetaActionsClassPropertyKindsValue")},
                                              type: GraphQLString
                                            },
                                            weight: {
                                              name: "WeaviateNetworkGetMetaActionsClassPropertyKindsWeight",
                                              description: function() {
                                                return getDesc("WeaviateNetworkGetMetaActionsClassPropertyKindsWeight")},
                                              type: GraphQLFloat
                                            }
                                          }
                                        }))
                                      },
                                    },
                                    type: new GraphQLList(new GraphQLObjectType({
                                      name: "WeaviateNetworkGetMetaActionsClassPropertyObj",
                                      description: function() {
                                        return getDesc("WeaviateNetworkGetMetaActionsClassPropertyObj")},
                                      fields: {
                                        orbit: {
                                          name: "WeaviateNetworkGetMetaActionsClassPropertyOrbit",
                                          description: function() {
                                            return getDesc("WeaviateNetworkGetMetaActionsClassPropertyOrbit")},
                                          type: new GraphQLObjectType({
                                            name: "WeaviateNetworkGetMetaActionsClassPropertyOrbitObj",
                                            description: function() {
                                              return getDesc("WeaviateNetworkGetMetaActionsClassPropertyOrbitObj")},
                                            fields: {
                                              value: {
                                                name: "WeaviateNetworkGetMetaActionsClassPropertyOrbitValue",
                                                description: function() {
                                                  return getDesc("WeaviateNetworkGetMetaActionsClassPropertyOrbitValue")},
                                                type: GraphQLString,
                                                resolve(parentValue, args) {
                                                  console.log("resolve WeaviateNetworkGetMetaActionsClassPropertyOrbitValue")
                                                  return [{}] // resolve with empty array
                                                }
                                              },
                                              distance: {
                                                name: "WeaviateNetworkGetMetaActionsClassPropertyOrbitDistance",
                                                description: function() {
                                                  return getDesc("WeaviateNetworkGetMetaActionsClassPropertyOrbitDistance")},
                                                type: GraphQLFloat,
                                                resolve(parentValue, args) {
                                                  console.log("resolve WeaviateNetworkGetMetaActionsClassPropertyOrbitDistance")
                                                  return [{}] // resolve with empty array
                                                }
                                              },
                                            }
                                          }),
                                          resolve(parentValue, args) {
                                            console.log("resolve WeaviateNetworkGetMetaActionsClassPropertyOrbit")
                                            return [{}] // resolve with empty array
                                          }
                                        },
                                      }
                                    })),
                                    resolve(parentValue, args) {
                                      console.log("resolve WeaviateNetworkGetMetaActionsClassProperty")
                                      return [{}] // resolve with empty array
                                    }
                                  }
                                }
                              })),
                              resolve(parentValue, args) {
                                console.log("resolve WeaviateNetworkGetMetaActionsClass")
                                return [{}] // resolve with empty array
                              }
                            }
                          }
                        }),
                        resolve(parentValue, args) {
                          console.log("resolve WeaviateNetworkGetMetaClass")
                          return [{}] // resolve with empty array
                        }
                      },
                      Beacon: {
                        name: "WeaviateNetworkGetMetaBeacon",
                        description: function() {
                          return getDesc("WeaviateNetworkGetMetaBeacon")},
                        args: {
                          id: { // The id of the beacon like: weaviate://foo-bar-baz/UUI
                            name: "WeaviateNetworkGetMetaBeaconId",
                            description: function() {
                              return getDesc("WeaviateNetworkGetMetaBeaconId")},
                            type: GraphQLString
                          }
                        },
                        type: new GraphQLObjectType({
                          name: "WeaviateNetworkGetMetaBeaconObj",
                          description: function() {
                            return getDesc("WeaviateNetworkGetMetaBeaconObj")},
                          fields: {
                            classes: { // Returns an array of potential classes based on the contextionary
                              name: "WeaviateNetworkGetMetaBeaconClasses",
                              description: function() {
                                return getDesc("WeaviateNetworkGetMetaBeaconClasses")},
                              type: new GraphQLList(GraphQLString),
                              resolve(parentValue, args) {
                                console.log("resolve WeaviateNetworkGetMetaBeaconClasses")
                                return [{}] // resolve with empty array
                              }
                            }, 
                            distances: { // Returns an array of the distances to the request based on the contextionary
                              name: "WeaviateNetworkGetMetaBeaconDistances",
                              description: function() {
                                return getDesc("WeaviateNetworkGetMetaBeaconDistances")},
                              type: new GraphQLList(GraphQLString),
                              resolve(parentValue, args) {
                                console.log("resolve WeaviateNetworkGetMetaBeaconDistances")
                                return [{}] // resolve with empty array
                              }
                            }, 
                            properties: { 
                              name: "WeaviateNetworkGetMetaBeaconProperties",
                              description: function() {
                                return getDesc("WeaviateNetworkGetMetaBeaconProperties")},
                              type: new GraphQLList(new GraphQLObjectType({
                                name: "WeaviateNetworkGetMetaBeaconPropertiesObj",
                                description: function() {
                                  return getDesc("WeaviateNetworkGetMetaBeaconPropertiesObj")},
                                fields: {
                                  property: { // returns an array of potential properties based on the contextionary
                                    name: "WeaviateNetworkGetMetaBeaconPropertiesProperty",
                                    description: function() {
                                      return getDesc("WeaviateNetworkGetMetaBeaconPropertiesProperty")},
                                    type: GraphQLString,
                                    resolve(parentValue, args) {
                                      console.log("resolve WeaviateNetworkGetMetaBeaconPropertiesProperty")
                                      return [{}] // resolve with empty array
                                    }
                                  }, 
                                  type: { // Returns the type (id est, string, int, cref etc)
                                    name: "WeaviateNetworkGetMetaBeaconPropertiesType",
                                    description: function() {
                                      return getDesc("WeaviateNetworkGetMetaBeaconPropertiesType")},
                                    type: GraphQLString, // should be enum of type (id est, string, int, cref etc)
                                    resolve(parentValue, args) {
                                      console.log("resolve WeaviateNetworkGetMetaBeaconPropertiesType")
                                      return [{}] // resolve with empty array
                                    }
                                  }, 
                                  distance: { // Returns an array of the distances to the request based on the contextionary
                                    name: "WeaviateNetworkGetMetaBeaconPropertiesDistance",
                                    description: function() {
                                      return getDesc("WeaviateNetworkGetMetaBeaconPropertiesDistance")},
                                    type: GraphQLFloat,
                                    resolve(parentValue, args) {
                                      console.log("resolve WeaviateNetworkGetMetaBeaconPropertiesDistance")
                                      return [{}] // resolve with empty array
                                    }
                                  }
                                }
                              })),
                              resolve(parentValue, args) {
                                console.log("resolve WeaviateNetworkGetMetaBeaconProperties")
                                return [{}] // resolve with empty array
                              }
                            }
                          }
                        }),
                        resolve(parentValue, args) {
                          console.log("resolve WeaviateNetworkGetMetaBeacon")
                          return [{}] // resolve with empty array
                        }
                      }
                    }
                  }),
                  resolve() {
                    console.log("resolve WeaviateNetworkGetMeta")
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
                          class: { 
                            name: "WeaviateNetworkFuzzyFetchThingsClass",
                            description: function() {
                              return getDesc("WeaviateNetworkFuzzyFetchThingsClass")},
                            type: GraphQLString //Needs to be in contextionary, weight = always 1.0
                          },
                          kinds: { 
                            name: "WeaviateNetworkFuzzyFetchThingsKinds",
                            description: function() {
                              return getDesc("WeaviateNetworkFuzzyFetchThingsKinds")},
                            type: new GraphQLList(new GraphQLInputObjectType({
                              name: "WeaviateNetworkFuzzyFetchThingsKindsObj",
                              description: function() {
                                return getDesc("WeaviateNetworkFuzzyFetchThingsKindsObj")},
                              fields: {
                                value: {
                                  name: "WeaviateNetworkFuzzyFetchThingsKindsValue",
                                  description: function() {
                                    return getDesc("WeaviateNetworkFuzzyFetchThingsKindsValue")},
                                  type: GraphQLString,
                                },
                                weight: {
                                  name: "WeaviateNetworkFuzzyFetchThingsKindsWeight",
                                  description: function() {
                                    return getDesc("WeaviateNetworkFuzzyFetchThingsKindsWeight")},
                                  type: GraphQLFloat,
                                }
                              }
                            }))    
                          },
                          properties: { 
                            name: "WeaviateNetworkFuzzyFetchThingsProperties",
                            description: function() {
                              return getDesc("WeaviateNetworkFuzzyFetchThingsProperties")},
                            type: new GraphQLList(new GraphQLInputObjectType({
                              name: "WeaviateNetworkFuzzyFetchThingsPropertiesObj",
                              description: function() {
                                return getDesc("WeaviateNetworkFuzzyFetchThingsPropertiesObj")},
                              fields: {
                                needle: {
                                  name: "WeaviateNetworkFuzzyFetchThingsPropertiesNeedle",
                                  description: function() {
                                    return getDesc("WeaviateNetworkFuzzyFetchThingsPropertiesNeedle")},
                                  type: new GraphQLList(new GraphQLInputObjectType({
                                    name: "WeaviateNetworkFuzzyFetchThingsPropertiesNeedleObj",
                                    description: function() {
                                      return getDesc("WeaviateNetworkFuzzyFetchThingsPropertiesNeedleObj")},
                                    fields: {
                                      kinds: {
                                        name: "WeaviateNetworkFuzzyFetchThingsPropertiesNeedleKinds",
                                        description: function() {
                                          return getDesc("WeaviateNetworkFuzzyFetchThingsPropertiesNeedleKinds")},
                                        type: new GraphQLList(new GraphQLInputObjectType({
                                          name: "WeaviateNetworkFuzzyFetchThingsPropertiesNeedleKindsObj",
                                          description: function() {
                                            return getDesc("WeaviateNetworkFuzzyFetchThingsPropertiesNeedleKindsObj")},
                                          fields: {
                                            value: {
                                              name: "WeaviateNetworkFuzzyFetchThingsPropertiesNeedleKindsValue",
                                              description: function() {
                                                return getDesc("WeaviateNetworkFuzzyFetchThingsPropertiesNeedleKindsValue")},
                                              type: GraphQLString,
                                            }, 
                                            weight: {
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
                                value: {
                                  name: "WeaviateNetworkFuzzyFetchThingsPropertiesValue",
                                  description: function() {
                                    return getDesc("WeaviateNetworkFuzzyFetchThingsPropertiesValue")},
                                  type: new GraphQLInputObjectType({
                                    name: "WeaviateNetworkFuzzyFetchThingsPropertiesValueObj",
                                    description: function() {
                                      return getDesc("WeaviateNetworkFuzzyFetchThingsPropertiesValueObj")},
                                    fields: {
                                      needle: {
                                        name: "WeaviateNetworkFuzzyFetchThingsPropertiesValueNeedle",
                                        description: function() {
                                          return getDesc("WeaviateNetworkFuzzyFetchThingsPropertiesValueNeedle")},
                                        type: GraphQLString
                                      }, 
                                      type: {
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
                          class: { 
                            name: "WeaviateNetworkFuzzyFetchActionsClass",
                            description: function() {
                              return getDesc("WeaviateNetworkFuzzyFetchActionsClass")},
                            type: GraphQLString
                          },
                          kinds: { 
                            name: "WeaviateNetworkFuzzyFetchActionsKinds",
                            description: function() {
                              return getDesc("WeaviateNetworkFuzzyFetchActionsKinds")},
                            type: new GraphQLList(new GraphQLInputObjectType({
                              name: "WeaviateNetworkFuzzyFetchActionsKindsObj",
                              description: function() {
                                return getDesc("WeaviateNetworkFuzzyFetchActionsKindsObj")},
                              fields: {
                                value: {
                                  name: "WeaviateNetworkFuzzyFetchActionsKindsValue",
                                  description: function() {
                                    return getDesc("WeaviateNetworkFuzzyFetchActionsKindsValue")},
                                  type: GraphQLString,
                                },
                                weight: {
                                  name: "WeaviateNetworkFuzzyFetchActionsKindsWeight",
                                  description: function() {
                                    return getDesc("WeaviateNetworkFuzzyFetchActionsKindsWeight")},
                                  type: GraphQLFloat,
                                }
                              }
                            }))    
                          },
                          properties: { 
                            name: "WeaviateNetworkFuzzyFetchActionsProperties",
                            description: function() {
                              return getDesc("WeaviateNetworkFuzzyFetchActionsProperties")},
                            type: new GraphQLList(new GraphQLInputObjectType({
                              name: "WeaviateNetworkFuzzyFetchActionsPropertiesObj",
                              description: function() {
                                return getDesc("WeaviateNetworkFuzzyFetchActionsPropertiesObj")},
                              fields: {
                                needle: {
                                  name: "WeaviateNetworkFuzzyFetchActionsPropertiesNeedle",
                                  description: function() {
                                    return getDesc("WeaviateNetworkFuzzyFetchActionsPropertiesNeedle")},
                                  type: new GraphQLList(new GraphQLInputObjectType({
                                    name: "WeaviateNetworkFuzzyFetchActionsPropertiesNeedleObj",
                                    description: function() {
                                      return getDesc("WeaviateNetworkFuzzyFetchActionsPropertiesNeedleObj")},
                                    fields: {
                                      kinds: {
                                        name: "WeaviateNetworkFuzzyFetchActionsPropertiesNeedleKinds",
                                        description: function() {
                                          return getDesc("WeaviateNetworkFuzzyFetchActionsPropertiesNeedleKinds")},
                                        type: new GraphQLList(new GraphQLInputObjectType({
                                          name: "WeaviateNetworkFuzzyFetchActionsPropertiesNeedleKindsObj",
                                          description: function() {
                                            return getDesc("WeaviateNetworkFuzzyFetchActionsPropertiesNeedleKindsObj")},
                                          fields: {
                                            value: {
                                              name: "WeaviateNetworkFuzzyFetchActionsPropertiesNeedleKindsValue",
                                              description: function() {
                                                return getDesc("WeaviateNetworkFuzzyFetchActionsPropertiesNeedleKindsValue")},
                                              type: GraphQLString,
                                            }, 
                                            weight: {
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
                                value: {
                                  name: "WeaviateNetworkFuzzyFetchActionsPropertiesValue",
                                  description: function() {
                                    return getDesc("WeaviateNetworkFuzzyFetchActionsPropertiesValue")},
                                  type: new GraphQLInputObjectType({
                                    name: "WeaviateNetworkFuzzyFetchActionsPropertiesValueObj",
                                    description: function() {
                                      return getDesc("WeaviateNetworkFuzzyFetchActionsPropertiesValueObj")},
                                    fields: {
                                      needle: {
                                        name: "WeaviateNetworkFuzzyFetchActionsPropertiesValueNeedle",
                                        description: function() {
                                          return getDesc("WeaviateNetworkFuzzyFetchActionsPropertiesValueNeedle")},
                                        type: GraphQLString
                                      }, 
                                      type: {
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
                Get: {
                  name: "WeaviateNetworkGet",
                  description: function() {
                    return getDesc("WeaviateNetworkGet")},
                  type: new GraphQLList(GraphQLString), // no input required yet
                  resolve() {
                    console.log("resolve WeaviateNetworkGet")
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
