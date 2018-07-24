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
function createRootClasses(ontologyThings, subClasses){

  console.log("------START ROOTCLASSES--------")

  var rootClassesFields = {}

  // loop through classes
  ontologyThings.classes.forEach(singleClass => {
    // create root sub classes
    rootClassesFields[singleClass.class] = {
      name: singleClass.class,
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
fs.readFile('demo_schemas/things_schema.json', 'utf8', function(err, ontologyThings) { // read things ontology
  fs.readFile('demo_schemas/actions_schema.json', 'utf8', function(err, ontologyActions) { // read actions ontology
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
                  type: new GraphQLObjectType({
                    name: "WeaviateLocalHelpersFetchObj",
                    description: function() {
                      return getDesc("WeaviateLocalHelpersFetchObj")},
                    fields: {
                      PinPoint: {
                        name: "WeaviateLocalHelpersFetchPinPoint",
                        description: function() {
                          return getDesc("WeaviateLocalHelpersFetchPinPoint")},
                        args: {
                          _stack: {
                            name: "WeaviateLocalHelpersFetchPinPointStack",
                            description: function() {
                              return getDesc("WeaviateLocalHelpersFetchPinPointStack")},
                            type: new GraphQLEnumType({
                              name: "WeaviateLocalHelpersFetchPinPointStackEnum",
                              description: function() {
                                return getDesc("WeaviateLocalHelpersFetchPinPointStackEnum")},
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
                          _classes: {
                            name: "WeaviateLocalHelpersFetchPinPointClasses",
                            description: function() {
                              return getDesc("WeaviateLocalHelpersFetchPinPointClasses")},
                            type: new GraphQLList(classesEnum)
                          },
                          _properties: {
                            name: "WeaviateLocalHelpersFetchPinPointProperties",
                            description: function() {
                              return getDesc("WeaviateLocalHelpersFetchPinPointProperties")},
                            type: new GraphQLList(GraphQLString)
                          }, //an array of potential classes (they should be in the ontology, ideally related to the class!)
                          _needle: {
                            name: "WeaviateLocalHelpersFetchPinPointNeedle",
                            description: function() {
                              return getDesc("WeaviateLocalHelpersFetchPinPointNeedle")},
                            type: GraphQLString}, // (for example: __needle: "Netflix"
                          _searchType: {
                            name: "WeaviateLocalHelpersFetchPinPointSearchType",
                            description: function() {
                              return getDesc("WeaviateLocalHelpersFetchPinPointSearchType")},
                            type: new GraphQLEnumType({
                              name: "WeaviateLocalHelpersFetchPinPointSearchTypeEnum",
                              description: function() {
                                return getDesc("WeaviateLocalHelpersFetchPinPointSearchTypeEnum")},
                              values: {
                                standard: {
                                  value: 0,
                                }
                              }
                            })
                          }, 
                          _limit: {
                            name: "WeaviateLocalHelpersFetchPinPointLimit",
                            description: function() {
                              return getDesc("WeaviateLocalHelpersFetchPinPointLimit")},
                            type: GraphQLInt}
                        },
                        type: new GraphQLObjectType({
                          name: "WeaviateLocalHelpersFetchPinPointObj",
                          description: function() {
                            return getDesc("WeaviateLocalHelpersFetchPinPointObj")},
                          fields: {
                            uuid: {
                              name: "WeaviateLocalHelpersFetchPinPointUuid",
                              description: function() {
                                return getDesc("WeaviateLocalHelpersFetchPinPointUuid")},
                              type: GraphQLID,
                              resolve(parentValue) {
                                console.log("resolve WeaviateLocalHelpersFetchPinPointUuid")
                                return [{}] // resolve with empty array
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
                FuzzyFetch: {
                  name: "WeaviateNetworkFuzzyFetch",
                  description: function() {
                    return getDesc("WeaviateNetworkFuzzyFetch")},
                  type: new GraphQLList(GraphQLString), // no input required yet
                  resolve() {
                    console.log("resolve WeaviateNetworkFuzzyFetch")
                    return [{}] // resolve with empty array
                  },
                },
                HelpersFetch: {
                  name: "WeaviateNetworkHelpersFetch",
                  description: function() {
                    return getDesc("WeaviateNetworkHelpersFetch")},
                  type: new GraphQLObjectType({
                    name: "WeaviateNetworkHelpersFetchObj",
                    description: function() {
                      return getDesc("WeaviateNetworkHelpersFetchObj")},
                    fields: {
                      OntologyExplorer: {
                        name: "WeaviateNetworkHelpersFetchOntologyExplorer",
                        description: function() {
                          return getDesc("WeaviateNetworkHelpersFetchOntologyExplorer")},
                        args: {
                          _distance: { 
                            name: "WeaviateNetworkHelpersFetchOntologyExplorerDistance",
                            description: function() {
                              return getDesc("WeaviateNetworkHelpersFetchOntologyExplorerDistance")},
                            type: GraphQLFloat 
                          }
                        },
                        type: new GraphQLObjectType({
                            name: "WeaviateNetworkHelpersFetchOntologyExplorerObj",
                            description: function() {
                              return getDesc("WeaviateNetworkHelpersFetchOntologyExplorerObj")},
                            fields: {
                              Things: {
                                name: "WeaviateNetworkHelpersFetchOntologyExplorerThings",
                                description: function() {
                                  return getDesc("WeaviateNetworkHelpersFetchOntologyExplorerThings")},
                                args: {
                                  _distance: { 
                                    name: "WeaviateNetworkHelpersFetchOntologyExplorerThingsDistance",
                                    description: function() {
                                      return getDesc("WeaviateNetworkHelpersFetchOntologyExplorerThingsDistance")},
                                    type: GraphQLFloat 
                                  }
                                },
                                type: new GraphQLObjectType({
                                  name: "WeaviateNetworkHelpersFetchOntologyExplorerThingsObj",
                                  description: function() {
                                    return getDesc("WeaviateNetworkHelpersFetchOntologyExplorerThingsObj")},
                                  fields: rootClassesThingsFields
                                }),
                                resolve(parentValue) {
                                  console.log("resolve WeaviateNetworkHelpersFetchOntologyExplorerThings")
                                  return [{}] // resolve with empty array
                                }
                              }, 
                              Actions: {
                                name: "WeaviateNetworkHelpersFetchOntologyExplorerActions",
                                description: function() {
                                  return getDesc("WeaviateNetworkHelpersFetchOntologyExplorerActions")},
                                args: {
                                  _distance: { 
                                    name: "WeaviateNetworkHelpersFetchOntologyExplorerActionsDistance",
                                    description: function() {
                                      return getDesc("WeaviateNetworkHelpersFetchOntologyExplorerActionsDistance")},
                                    type: GraphQLFloat 
                                  }
                                },
                                type: new GraphQLObjectType({
                                  name: "WeaviateNetworkHelpersFetchOntologyExplorerActionsObj",
                                  description: function() {
                                    return getDesc("WeaviateNetworkHelpersFetchOntologyExplorerActionsObj")},
                                  fields: rootClassesActionsFields
                                }),
                                resolve(parentValue) {
                                  console.log("resolve WeaviateNetworkHelpersFetchOntologyExplorerActions")
                                  return [{}] // resolve with empty array
                                }
                              }
                            }
                          }),
                        resolve() {
                          console.log("resolve WeaviateNetworkHelpersFetchOntologyExplorer")
                          return [{}] // resolve with empty array
                        }
                      }
                    }
                  }),
                  resolve() {
                    console.log("resolve WeaviateNetworkHelpersFetch")
                    return [{}] // resolve with empty array
                  },
                },
                MetaFetch: {
                  name: "WeaviateNetworkMetaFetch",
                  description: function() {
                    return getDesc("WeaviateNetworkMetaFetch")},
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
