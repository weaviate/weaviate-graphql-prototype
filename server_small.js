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
 *  Get descriptions from json file. 
 * NOTE: getDesc(this.name) not possible because this.name refers to keyname of object, and not the key 'name' IN the object (this 'name' is reserved)
 */
const descriptions = JSON.parse(fs.readFileSync('descriptions.json', 'utf8'));
function getDesc(name) {
  return descriptions[name]
}

/**
 * START - ALL RELATED TO INTERNAL FUNCTION
 */

var NetworkIntrospectThingsActionsFields = {
  className: {
    name: "WeaviateNetworkIntrospectClassName",
    description: function() {
      return getDesc("WeaviateNetworkIntrospectClassName")},
    type: GraphQLString
  },
  certainty: {
    name: "WeaviateNetworkIntrospectCertainty",
    description: function() {
      return getDesc("WeaviateNetworkIntrospectCertainty")},
    type: GraphQLFloat
  },
  properties: {
    name: "WeaviateNetworkIntrospectProperties",
    description: function() {
      return getDesc("WeaviateNetworkIntrospectProperties")},
    type: new GraphQLList(new GraphQLObjectType({
      name: "WeaviateNetworkIntrospectPropertiesObj",
      description: function() {
        return getDesc("WeaviateNetworkIntrospectPropertiesObj")},
      fields: {
        propertyName: {
          name: "WeaviateNetworkIntrospectPropertiesPropertyName",
          description: function() {
            return getDesc("WeaviateNetworkIntrospectPropertiesPropertyName")},
          type: GraphQLString
        },
        certainty: {
          name: "WeaviateNetworkIntrospectPropertiesCertainty",
          description: function() {
            return getDesc("WeaviateNetworkIntrospectPropertiesCertainty")},
          type: GraphQLFloat
        }
      }
    }))
  }
}


/**
 * Create enum for filter operators
 */
var WhereOperators = new GraphQLEnumType({
  name: "WhereOperatorEnum",
  description: function() {
    return getDesc("WhereOperatorEnum")},
  values: {
    "And": {
      value: "And"
    }, 
    "Or": {
      value: "Or"
    }, 
    "Equal": {
      value: "Equal"
    }, 
    "Not": {
      value: "NotEqual"
    }, 
    "NotEqual": {
      value: "NotEqual"
    }, 
    "GreaterThan": {
      value: "GreaterThan"
    }, 
    "GreaterThanEqual": {
      value: "GreaterThanEqual"
    }, 
    "LessThan": {
      value: "LessThan"
    },
    "LessThanEqual": {
      value: "LessThanEqual"
    },
  }
})

/**
 * Create filter fields for queries
 */
var whereFields = {
  operator: {
    name: "WhereOperator",
    description: function() {
      return getDesc("WhereOperator")},
    type: WhereOperators
  },
  operands: {
    name: "WhereOperands",
    description: function() {
      return getDesc("WhereOperands")},
    type: new GraphQLList(new GraphQLInputObjectType({
      name: "WhereOperandsInpObj",
      description: function() {
        return getDesc("WhereOperandsInpObj")},
      fields: function () {return whereFields}
    }))
  },
  path: { 
    name: "WherePath",
    description: function() {
      return getDesc("WherePath")},
    type: new GraphQLList(GraphQLString) 
  },
  valueInt: { 
    name: "WhereValueInt",
    description: function() {
      return getDesc("WhereValueInt")},
    type: GraphQLInt 
  },
  valueFloat: { 
    name: "WhereValueFloat",
    description: function() {
      return getDesc("WhereValueFloat")},
    type: GraphQLFloat
  },
  valueBoolean: { 
    name: "WhereValueBoolean",
    description: function() {
      return getDesc("WhereValueBoolean")},
    type: GraphQLBoolean
  },
  valueString: { 
    name: "WhereValueString",
    description: function() {
      return getDesc("WhereValueString")},
    type: GraphQLString 
  }
}


var NetworkFetchWherePropertyFilterFields = {
  name: {
    name: "NetworkFetchWherePropertyWhereName",
    description: function() {
      return getDesc("NetworkFetchWherePropertyWhereName")},
    type: GraphQLString,
  }, 
  kinds: {
    name: "NetworkFetchWherePropertyWhereKinds",
    description: function() {
      return getDesc("NetworkFetchWherePropertyWhereKinds")},
    type: new GraphQLList(new GraphQLInputObjectType({
      name: "NetworkFetchWherePropertyWhereKindsInpObj",
      description: function() {
        return getDesc("NetworkFetchWherePropertyWhereKindsInpObj")},
      fields: {
        value: {
          name: "NetworkFetchWherePropertyWhereKindsValue",
          description: function() {
            return getDesc("NetworkFetchWherePropertyWhereKindsValue")},
          type: GraphQLString,
        },
        weight: {
          name: "NetworkFetchWherePropertyWhereKindsWeight",
          description: function() {
            return getDesc("NetworkFetchWherePropertyWhereKindsWeight")},
          type: GraphQLFloat,
        }
      }
    }))
  }, 
  certainty: {
    name: "NetworkFetchWherePropertyWhereCertainty",
    description: function() {
      return getDesc("NetworkFetchWherePropertyWhereCertainty")},
    type: GraphQLFloat,
  },
  operator: {
    name: "NetworkFetchWherePropertyWhereOperator",
    description: function() {
      return getDesc("NetworkFetchWherePropertyWhereOperator")},
    type: WhereOperators
  },
  valueInt: { 
    name: "NetworkFetchWherePropertyWhereValueInt",
    description: function() {
      return getDesc("NetworkFetchWherePropertyWhereValueInt")},
    type: GraphQLInt 
  },
  valueFloat: { 
    name: "NetworkFetchWherePropertyWhereValueFloat",
    description: function() {
      return getDesc("NetworkFetchWherePropertyWhereValueFloat")},
    type: GraphQLFloat
  },
  valueBoolean: { 
    name: "NetworkFetchWherePropertyWhereValueBoolean",
    description: function() {
      return getDesc("NetworkFetchWherePropertyWhereValueBoolean")},
    type: GraphQLBoolean
  },
  valueString: { 
    name: "NetworkFetchWherePropertyWhereValueString",
    description: function() {
      return getDesc("NetworkFetchWherePropertyWhereValueString")},
    type: GraphQLString 
  }
}

/**
 * Create class and property filter options for network fetch 
 */
var NetworkIntrospectWhereClassAndPropertyFilterFields = {
  name: {
    name: "WeaviateNetworkWhereName",
    description: function() {
      return getDesc("WeaviateNetworkWhereName")},
    type: GraphQLString,
  }, 
  kinds: {
    name: "WeaviateNetworkWhereNameKinds",
    description: function() {
      return getDesc("WeaviateNetworkWhereNameKinds")},
    type: new GraphQLList(new GraphQLInputObjectType({
      name: "WeaviateNetworkWhereNameKindsInpObj",
      description: function() {
        return getDesc("WeaviateNetworkWhereNameKindsInpObj")},
      fields: {
        value: {
          name: "WeaviateNetworkWhereNameKindsValue",
          description: function() {
            return getDesc("WeaviateNetworkWhereNameKindsValue")},
          type: GraphQLString,
        },
        weight: {
          name: "WeaviateNetworkWhereNameKindsWeight",
          description: function() {
            return getDesc("WeaviateNetworkWhereNameKindsWeight")},
          type: GraphQLFloat,
        }
      }
    }))
  }, 
  certainty: {
    name: "WeaviateNetworkWhereCertainty",
    description: function() {
      return getDesc("WeaviateNetworkWhereCertainty")},
    type: GraphQLFloat,
  }, 
  first: {
    name: "WeaviateNetworkWhereFirst",
    description: function() {
      return getDesc("WeaviateNetworkWhereFirst")},
    type: GraphQLFloat,
  }
}


/**
 * Create filter options for network fetch 
 */
var NetworkIntrospectWhereFilterFields = {
  where: { 
    name: "WeaviateNetworkIntrospectWhere",
    description: function() {
      return getDesc("WeaviateNetworkIntrospectWhere")},
    type: new GraphQLList(new GraphQLInputObjectType({
      name: "WeaviateNetworkIntrospectWhereInpObj",
      description: function() {
        return getDesc("WeaviateNetworkIntrospectWhereInpObj")},
      fields: {
        class: {
          name: "WeaviateNetworkIntrospectWhereClass",
          description: function() {
            return getDesc("WeaviateNetworkIntrospectWhereClass")},
          type: new GraphQLList(new GraphQLInputObjectType({
            name: "WeaviateNetworkIntrospectWhereClassObj",
            description: function() {
              return getDesc("WeaviateNetworkIntrospectWhereClassObj")},
            fields: NetworkIntrospectWhereClassAndPropertyFilterFields
          }))
        },
        properties: {
          name: "WeaviateNetworkIntrospectWhereProperties",
          description: function() {
            return getDesc("WeaviateNetworkIntrospectWhereProperties")},
          type: new GraphQLList(new GraphQLInputObjectType({
            name: "WeaviateNetworkIntrospectWherePropertiesObj",
            description: function() {
              return getDesc("WeaviateNetworkIntrospectWherePropertiesObj")},
            fields: NetworkIntrospectWhereClassAndPropertyFilterFields
          }))
        }
      }
    })) //Needs to be in contextionary, weight = always 1.0
  }
}


var NetworkFetchFilterFields = {
  where: { 
    name: "NetworkFetchWhere",
    description: function() {
      return getDesc("NetworkFetchWhere")},
    type: new GraphQLList(new GraphQLInputObjectType({
      name: "NetworkFetchWhereInpObj",
      description: function() {
        return getDesc("NetworkFetchWhereInpObj")},
      fields: {
        class: {
          name: "NetworkFetchWhereInpObjClass",
          description: function() {
            return getDesc("NetworkFetchWhereInpObjClass")},
          type: new GraphQLList(new GraphQLInputObjectType({
            name: "NetworkFetchWhereInpObjClassInpObj",
            description: function() {
              return getDesc("NetworkFetchWhereInpObjClassInpObj")},
            fields: NetworkIntrospectWhereClassAndPropertyFilterFields
          }))
        },
        properties: {
          name: "NetworkFetchWhereInpObjProperties",
          description: function() {
            return getDesc("NetworkFetchWhereInpObjProperties")},
          type: new GraphQLList(new GraphQLInputObjectType({
            name: "NetworkFetchWhereInpObjProperties",
            description: function() {
              return getDesc("NetworkFetchWhereInpObjProperties")},
            fields: NetworkFetchWherePropertyFilterFields
          }))
        },
        first: {
          name: "NetworkFetchWhereInpObjFirst",
          description: function() {
            return getDesc("NetworkFetchWhereInpObjFirst")},
          type: GraphQLInt,
        }
      }
    })) //Needs to be in contextionary, weight = always 1.0
  }
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
 * Create class enum for filter options
 */

function createClassEnum(ontologyThings) {

  var enumValues = {}
  var count = 0
  // loop through classes
  ontologyThings.classes.forEach(singleClass => {
    // create enum item
    enumValues[singleClass.class] = {"value": singleClass.class}

    count += 1
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
function createArgs(item){

  // check if argument name is defined, if not, create it
  if(propsForArgs[item.class] == undefined){

    // empty argument
    propsForArgs[item.class] = {}

    // always return first
    propsForArgs[item.class]["first"] = {
      name: "firstFilter",
      type: GraphQLInt,
      description: function() {
        return getDesc("firstFilter")},
    }
    // always return after
    propsForArgs[item.class]["after"] = {
      name: "afterFilter",
      type: GraphQLInt,
      description: function() {
        return getDesc("afterFilter")},
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
              count: {
                name: "Meta" + singleClass.class + "MetaCount",
                description: function() {
                  return getDesc("MetaClassMetaCount")},
                type: GraphQLInt
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
            count: {
              name: "Meta" + singleClass.class + singleClassProperty.name + "Count",
              description: function() {
                return getDesc("MetaClassPropertyCount")},
              type: GraphQLInt,
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
                    pointingTo: {
                      name: "Meta" + singleClass.class + singleClassProperty.name + "PointingTo",
                      description: function() {
                        return getDesc("MetaClassPropertyPointingTo")},
                      type: new GraphQLList(GraphQLString)
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
                        first: { 
                          name: "firstFilter",
                          description: function() {
                            return getDesc("firstFilter")},
                          type: GraphQLInt 
                        },
                        after: { 
                          name: "afterFilter",
                          description: function() {
                            return getDesc("afterFilter")},
                          type: GraphQLInt 
                        }
                      },
                      resolve(parentValue, args) {
                        data = parentValue.topOccurrences
                        if (args.after) {
                          data = data.splice(args.after)
                        }
                        if (args.first) {
                          data = data.splice(0, args.first)
                        }
                        return data
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
                        return getDesc("MetaClassPropertyLowest")},
                      type: GraphQLFloat,
                    },
                    highest: {
                      name: "Meta" + singleClass.class + singleClassProperty.name + "Highest",
                      description: function() {
                        return getDesc("MetaClassPropertyHighest")},
                      type: GraphQLFloat,
                    },
                    average: {
                      name: "Meta" + singleClass.class + singleClassProperty.name + "Average",
                      description: function() {
                        return getDesc("MetaClassPropertyAverage")},
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
      args: createArgs(singleClass),
      resolve(parentValue, args) {
        return demoResolver.metaRootClassResolver(parentValue, singleClass.class, args)
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
      args: createArgs(singleClass),
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
  var classCount = [];
 
  var classes = {}
  classes["classes"] = []

  a.classes.forEach(singleClassA => {
    classCount.push(singleClassA.class)
    classes["classes"].push(singleClassA)
  })

  b.classes.forEach(singleClassB => {
    classes["classes"].push(singleClassB)
  })

  console.log("------MERGED ONTOLOGIES--------")
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
// function createContextionaryInputFields(nouns){

//   var returner = {}
//   var subReturner = {}

//   var splitNouns = nouns.split('\n');

//   // first we create subfields
//   for(var no = 0; no < splitNouns.length; no++){
//     // set regex for nouns
//     splitNouns[no] = splitNouns[no].replace(/\W/g, '');
//     subReturner[splitNouns[no]] = {
//       name: "WeaviateNetworkSubfield" + splitNouns[no],
//       description: "No description available",
//       args: createArgs("_", true),
//       resolve() {
//         console.log("resolve WeaviateNetworkSubfield" + splitNouns[no])
//         return [{}] // resolve with empty array
//       },
//       type: GraphQLString
//     }
//   }

//   var superSubreturner = new GraphQLObjectType({
//     name: "superSubreturner",
//     fields: subReturner
//   })

//   // second we create actual fields
//   for(var no = 0; no < splitNouns.length; no++){
//     // set regex for nouns
//     splitNouns[no] = splitNouns[no].replace(/[\W-]/g, '');
    
//     // skip empty items and items containing numbers
//     if ((splitNouns[no].length == 0) || /\d/.test(splitNouns[no])) {
//       continue
//     }
//     // set to upper because of 
//     let nounAsClass = splitNouns[no][0].toUpperCase() + splitNouns[no].substring(1);
//     returner[nounAsClass] = {
//       name: "WeaviateNetworkSubfield" + nounAsClass,
//       description: "No description available",
//       args: createArgs("_", true),
//       resolve() {
//         console.log("resolve WeaviateNetworkSubfield" + nounAsClass)
//         return [{}] // resolve with empty array
//       },
//       type: superSubreturner
//     }

//   }

//   return returner

// }


/**
 * Nounfields are used in the Network service
 */
// function createContextionaryFields(nouns, depth){

//   var returner = {}
//   var subReturner = {}

//   var splitNouns = nouns.split('\n');

//   // first we create subfields
//   for(var no = 0; no < splitNouns.length; no++){
//     // set regex for nouns
//     splitNouns[no] = splitNouns[no].replace(/\W/g, '');
//     subReturner[splitNouns[no]] = {
//       name: "WeaviateNetworkSubfield" + splitNouns[no],
//       description: "No description available",
//       args: createArgs("_", true),
//       resolve() {
//         console.log("resolve WeaviateNetworkSubfield" + splitNouns[no])
//         return [{}] // resolve with empty array
//       },
//       type: GraphQLString
//     }
//   }

//   var superSubreturner = new GraphQLObjectType({
//     name: "superSubreturner",
//     fields: subReturner
//   })

//   // second we create actual fields
//   for(var no = 0; no < splitNouns.length; no++){
//     // set regex for nouns
//     splitNouns[no] = splitNouns[no].replace(/[\W-]/g, '');
    
//     // skip empty items and items containing numbers
//     if ((splitNouns[no].length == 0) || /\d/.test(splitNouns[no])) {
//       continue
//     }
//     // set to upper because of 
//     let nounAsClass = splitNouns[no][0].toUpperCase() + splitNouns[no].substring(1);
//     returner[nounAsClass] = {
//       name: "WeaviateNetworkSubfield" + nounAsClass,
//       description: "No description available",
//       args: createArgs("_", true),
//       resolve() {
//         console.log("resolve WeaviateNetworkSubfield" + nounAsClass)
//         return [{}] // resolve with empty array
//       },
//       type: superSubreturner
//     }

//   }

//   return returner

// }


/**
 * END - ALL RELATED TO INTERNAL
 */

/**
 * START CONSTRUCTING THE SERVICE
 */
fs.readFile('demo_schemas/things_schema.json', 'utf8', function(err, ontologyThings) { // read things ontology
  fs.readFile('demo_schemas/actions_schema.json', 'utf8', function(err, ontologyActions) { // read actions ontology

    // merge
    classes = mergeOntologies(JSON.parse(ontologyThings), JSON.parse(ontologyActions))

    // create GraphQL fields for words in contextionary
    // var contextionaryWords = createContextionaryFields(nouns);
  
    // create the root and sub classes based on the Weaviate schemas
    var localSubClasses = createSubClasses(classes);
    var rootClassesThingsFields = createRootClasses(JSON.parse(ontologyThings), localSubClasses);
    var rootClassesActionsFields = createRootClasses(JSON.parse(ontologyActions), localSubClasses);
    var classesEnum = createClassEnum(classes);
    // var PinPointField = createPinPointField(classes);
    var metaSubClasses = createMetaSubClasses(classes)
    var metaRootClassesThingsFields = createMetaRootClasses(JSON.parse(ontologyThings), metaSubClasses);
    var metaRootClassesActionsFields = createMetaRootClasses(JSON.parse(ontologyActions), metaSubClasses);

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
                      fields: whereFields
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
                      fields: whereFields
                    }) 
                }
                },
                type: new GraphQLObjectType({
                  name: "WeaviateLocalGetMetaObj",
                  description: function() {
                    return getDesc("WeaviateLocalGetMetaObj")},
                  fields: {
                    Things: {
                      name: "WeaviateLocalGetMetaThings",
                      description: function() {
                        return getDesc("WeaviateLocalGetMetaThings")},
                      type: new GraphQLObjectType({
                        name: "WeaviateLocalGetMetaThingsObj",
                        description: function() {
                          return getDesc("WeaviateLocalGetMetaThingsObj")},
                        fields: metaRootClassesThingsFields
                      }),
                      resolve(parentValue, args) {
                        console.log("resolve WeaviateLocalGetMetaThings")
                        return parentValue.Things // resolve with empty array
                      }
                    }, 
                    Actions: {
                      name: "WeaviateLocalGetMetaActions",
                      description: function() {
                        return getDesc("WeaviateLocalGetMetaActions")},
                      type: new GraphQLObjectType({
                        name: "WeaviateLocalGetMetaActionsObj",
                        description: function() {
                          return getDesc("WeaviateLocalGetMetaActionsObj")},
                        fields: metaRootClassesActionsFields
                      }),
                      resolve(parentValue, args) {
                        console.log("resolve WeaviateLocalGetMetaActions")
                        return parentValue.Actions // resolve with empty array
                      }
                    }
                  },
                }),
                resolve(parentValue, args) {
                  console.log("resolve WeaviateLocalGetMeta")
                  return demoResolver.resolveGet(args.where) // resolve with empty array
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
              Fetch: {
                name: "WeaviateNetworkFetch",
                description: function() {
                  return getDesc("WeaviateNetworkFetch")},
                type: new GraphQLObjectType({
                  name: "WeaviateNetworkFetchObj",
                  description: function() {
                    return getDesc("WeaviateNetworkFetchObj")},
                  fields: {
                    Things: {
                      name: "WeaviateNetworkFetchThings",
                      description: function() {
                        return getDesc("WeaviateNetworkFetchThings")},
                      args: NetworkFetchFilterFields,
                      type: new GraphQLList(new GraphQLObjectType({
                        name: "WeaviateNetworkFetchThingsObj",
                        description: function() {
                          return getDesc("WeaviateNetworkFetchThingsObj")},
                        fields: {
                          beacon: { // The beacon to do a convertedfetch
                            name: "WeaviateNetworkFetchThingsBeacon",
                            description: function() {
                              return getDesc("WeaviateNetworkFetchThingsBeacon")},
                            type: GraphQLString,
                            resolve(parentValue, args) {
                              console.log("resolve WeaviateNetworkFetchThingsBeacon")
                              return [{}] // resolve with empty array
                            }
                          }, 
                          certainty: { //  What is the certainty to the original request?
                            name: "WeaviateNetworkFetchThingsCertainty",
                            description: function() {
                              return getDesc("WeaviateNetworkFetchThingsCertainty")},
                            type: GraphQLFloat, // should be enum of type (id est, string, int, cref etc)
                            resolve(parentValue, args) {
                              console.log("resolve WeaviateNetworkFetchThingsCertainty")
                              return [{}] // resolve with empty array
                            }
                          }
                        }
                      })),
                      resolve(parentValue, args) {
                        console.log("resolve WeaviateNetworkFetchThings")
                        return [{}] // resolve with empty array
                      }
                    },
                    Actions: {
                      name: "WeaviateNetworkFetchActions",
                      description: function() {
                        return getDesc("WeaviateNetworkFetchActions")},
                      args: NetworkFetchFilterFields,
                      type: new GraphQLList(new GraphQLObjectType({
                        name: "WeaviateNetworkFetchActionsObj",
                        description: function() {
                          return getDesc("WeaviateNetworkFetchActionsObj")},
                        fields: {
                          beacon: {
                            name: "WeaviateNetworkFetchActionsBeacon",
                            description: function() {
                              return getDesc("WeaviateNetworkFetchActionsBeacon")},
                            type: GraphQLString,
                            resolve(parentValue, args) {
                              console.log("resolve WeaviateNetworkFetchActionsBeacon")
                              return [{}] // resolve with empty array
                            }
                          }, 
                          certainty: {
                            name: "WeaviateNetworkFetchActionsCertainty",
                            description: function() {
                              return getDesc("WeaviateNetworkFetchActionsCertainty")},
                            type: GraphQLFloat, // should be enum of type (id est, string, int, cref etc)
                            resolve(parentValue, args) {
                              console.log("resolve WeaviateNetworkFetchActionsCertainty")
                              return [{}] // resolve with empty array
                            }
                          }
                        }
                      })),
                      resolve(parentValue, args) {
                        console.log("resolve WeaviateNetworkFetchActions")
                        return [{}] // resolve with empty array
                      }
                    },
                  }
                }),
                resolve() {
                  console.log("resolve WeaviateNetworkFetch")
                  return [{}] // resolve with empty array
                },
              },
              Introspect: {
                name: "WeaviateNetworkIntrospect",
                description: function() {
                  return getDesc("WeaviateNetworkIntrospect")},
                type: new GraphQLObjectType({
                  name: "WeaviateNetworkIntrospectObj",
                  description: function() {
                    return getDesc("WeaviateNetworkIntrospectObj")},
                  fields: {
                    Things: {
                      name: "WeaviateNetworkIntrospectThings",
                      description: function() {
                        return getDesc("WeaviateNetworkIntrospectThings")},
                      args: NetworkIntrospectWhereFilterFields,
                      type: new GraphQLList(new GraphQLObjectType({
                        name: "WeaviateNetworkIntrospectThingsObj",
                        description: function() {
                          return getDesc("WeaviateNetworkIntrospectThingsObj")},
                        fields: NetworkIntrospectThingsActionsFields
                      })),
                      resolve(parentValue, args) {
                        console.log("resolve WeaviateNetworkIntrospectThings")
                        return [{}] // resolve with empty array
                      }
                    },
                    Actions: {
                      name: "WeaviateNetworkIntrospectActions",
                      description: function() {
                        return getDesc("WeaviateNetworkIntrospectActions")},
                      args: NetworkIntrospectWhereFilterFields,
                      type: new GraphQLObjectType({
                        name: "WeaviateNetworkIntrospectActionsObj",
                        description: function() {
                          return getDesc("WeaviateNetworkIntrospectActionsObj")},
                        fields: NetworkIntrospectThingsActionsFields
                      }),
                      resolve(parentValue, args) {
                        console.log("resolve WeaviateNetworkIntrospectClass")
                        return [{}] // resolve with empty array
                      }
                    },
                    Beacon: {
                      name: "WeaviateNetworkIntrospectBeacon",
                      description: function() {
                        return getDesc("WeaviateNetworkIntrospectBeacon")},
                      args: {
                        id: { // The id of the beacon like: weaviate://foo-bar-baz/UUI
                          name: "WeaviateNetworkIntrospectBeaconId",
                          description: function() {
                            return getDesc("WeaviateNetworkIntrospectBeaconId")},
                          type: GraphQLString
                        }
                      },
                      type: new GraphQLObjectType({
                        name: "WeaviateNetworkIntrospectBeaconObj",
                        description: function() {
                          return getDesc("WeaviateNetworkIntrospectBeaconObj")},
                        fields: NetworkIntrospectThingsActionsFields
                      }),
                      resolve(parentValue, args) {
                        console.log("resolve WeaviateNetworkIntrospectBeacon")
                        return [{}] // resolve with empty array
                      }
                    }
                  }
                }),
                resolve() {
                  console.log("resolve WeaviateNetworkIntrospect")
                  return [{}] // resolve with empty array
                }
              }
            }
          })
        }
      }
    })

    // publish the schemas, for now only the query schema
    const schema = new GraphQLSchema({
      name: "RootQuery",
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
