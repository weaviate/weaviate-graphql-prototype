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

// For making calls to http data server
// const request = require('request');

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
 * Create arguments for the network function
 */
var argsKeywords = new GraphQLInputObjectType({
  name: "argsKeywords",
  description: "list of keywords and weights",
  fields: {
    keyword: {
      name: "WeaviateNetworkKeywordsKeyword",
      description: "The keywords",
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

    if(withKeywords === true){
      // always certainty
      propsForArgs[item.class]["_keywords"] = {
        type: new GraphQLList(argsKeywords),
        description: "Add a keyword?"
      }
    }
    
    // loop over property variables (not classes, therefor it checks if the first letter is uppercase)
    if(item.properties != undefined){
      item.properties.forEach(prop => {
        if(prop["@dataType"][0][0] !== prop["@dataType"][0][0].toUpperCase()){ // is the first letter uppercase?
          propsForArgs[item.class][prop.name] = {
            type: GraphQLString, // for now, always return a string
            description: prop.description
          }
        }
      })
    }

  }
  
  return propsForArgs[item.class] // return the prop with the argument

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

          /***
           * THERE IS A BUG HERE, ONLY THE FIRST VALUE IS USED NOW!
           */

          // if class (start with capital, return Class)
          if(singleClassProperty["@dataType"][0][0] === singleClassProperty["@dataType"][0][0].toUpperCase()){
            // return class as list, set the first to upper to show it is a class
            returnProps[singleClassProperty.name[0].toUpperCase() + singleClassProperty.name.substring(1)] = {
              description: singleClassProperty.description,
              type: new GraphQLList(subClasses[singleClassProperty["@dataType"][0]]),
              args: createArgs(singleClass, false),
              resolve() {
                console.log("resolve ROOT CLASS" + singleClassProperty.name[0].toUpperCase() + singleClassProperty.name.substring(1))
                return [{}] // resolve with empty array
              }
            }
          } else if(singleClassProperty["@dataType"][0] === "string") {
            // always return string (should be int, float, bool etc later)
            returnProps[singleClassProperty.name] = {
              description: singleClassProperty.description,
              type: GraphQLString
            }
          } else if(singleClassProperty["@dataType"][0] === "int") {
            // always return string (should be int, float, bool etc later)
            returnProps[singleClassProperty.name] = {
              description: singleClassProperty.description,
              type: GraphQLInt
            }
          } else if(singleClassProperty["@dataType"][0] === "number") {
            // always return string (should be int, float, bool etc later)
            returnProps[singleClassProperty.name] = {
              description: singleClassProperty.description,
              type: GraphQLFloat
            }
          } else {
            console.error("I DONT KNOW THIS VALUE! " + singleClassProperty["@dataType"][0])
            // always return string (should be int, float, bool etc later)
            returnProps[singleClassProperty.name] = {
              description: singleClassProperty.description,
              type: GraphQLString
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
      resolve() {
        console.log("resolve ROOT CLASS " + singleClass.class)
        /* result = request("http://localhost:3000/things?class=" + singleClass.class, { json: true }, (err, res, body) => {
          if (err) { return console.log(err); }
          console.log(body);
          console.log(body.explanation);
          return body
        });
        return result */
        return [{}] // resolve with empty array
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
      description: "BLAH",
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
      description: "BLAH",
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
fs.readFile('schemas_small/ing_things.json', 'utf8', function(err, ontologyThings) { // read things ontology
  fs.readFile('schemas_small/ing_actions.json', 'utf8', function(err, ontologyActions) { // read actions ontology
    fs.readFile('schemas_small/nounlist.txt', 'utf8', function(err, nouns) { // read the nounlist

      // merge
      classes = mergeOntologies(JSON.parse(ontologyThings), JSON.parse(ontologyActions))
    
      // create the root and sub classes based on the Weaviate schemas
      var subClasses = createSubClasses(classes);
      var rootClassesThingsFields = createRootClasses(JSON.parse(ontologyThings), subClasses);
      var rootClassesActionsFields = createRootClasses(JSON.parse(ontologyActions), subClasses);

      var NounFields = createNounFields(nouns, true);

      // This is the root 
      var Weaviate = new GraphQLObjectType({
        name: 'Weaviate',
        description: "Location of the root query",
        fields: {
          Local: {
            name: "WeaviateLocal",
            description: "Locate on the local Weaviate",
            resolve() {
              console.log("resolve WeaviateLocalTraverse")
              return [{}] // resolve with empty array
            },
            type: new GraphQLObjectType({
              name: "WeaviateLocalFetchType",
              description: "Type of fetch on the internal Weaviate",
              resolve() {
                console.log("resolve WeaviateLocalFetch")
                return [{}] // resolve with empty array
              },
              fields: {
                TargetedFetch: {
                  name: "WeaviateLocalTargetedFetch",
                  description: "Do a targeted fetch to search Things or Actions on the local weaviate",
                  type: new GraphQLObjectType({
                    name: "WeaviateLocalTargetedFetch",
                    description: "Fetch things or actions on the internal Weaviate",
                    fields: {
                      Things: {
                        name: "WeaviateLocalTargetedFetchThings",
                        description: "Locate Things on the local Weaviate",
                        type: new GraphQLObjectType({
                          name: "WeaviateLocalTargetedFetchThings",
                          description: "Fetch things on the internal Weaviate",
                          fields: rootClassesThingsFields
                        }),
                        resolve() {
                          console.log("resolve WeaviateLocalTargetedFetchThings")
                          return [{}] // resolve with empty array
                        },
                      },
                      Actions: {
                        name: "WeaviateLocalTargetedFetchActions",
                        description: "Locate Actions on the local Weaviate",
                        type: new GraphQLObjectType({
                          name: "WeaviateLocalTargetedFetchActions",
                          description: "Fetch Actions on the internal Weaviate",
                          fields: rootClassesActionsFields
                        }),
                        resolve() {
                          console.log("resolve WeaviateLocalTargetedFetchActions")
                          return [{}] // resolve with empty array
                        }
                      }
                    }
                  }),
                  resolve() {
                    console.log("resolve WeaviateLocalFetchTargeted")
                    return [{}] // resolve with empty array
                  },
                },
                HelpersFetch: {
                  name: "WeaviateLocalHelpersFetch",
                  description: "Do a helpers fetch to search Things or Actions on the local weaviate",
                  type: new GraphQLObjectType({
                    name: "WeaviateLocalHelpersFetch",
                    description: "Fetch things or actions on the internal Weaviate",
                    fields: NounFields
                  }),
                  resolve() {
                    console.log("resolve WeaviateLocalHelpersFetch")
                    return [{}] // resolve with empty array
                  },
                },
                MetaFetch: {
                  name: "WeaviateLocalMetaFetch",
                  description: "Do a helpers fetch to search Things or Actions on the local weaviate",
                  type: new GraphQLObjectType({
                    name: "WeaviateLocalMetaFetch",
                    description: "Fetch things or actions on the internal Weaviate",
                    fields: NounFields
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
              name: "WeaviateNetworkFetchType",
              description: "Type of fetch on the Weaviate network",
              fields: {
                FuzzyFetch: {
                  name: "WeaviateNetworkFuzzyFetch",
                  description: "Do a fuzzy search fetch to search Things or Actions on the network weaviate",
                  type: new GraphQLObjectType({
                    name: "WeaviateNetworkFuzzyFetch",
                    description: "Fetch things or actions on the internal and external Weaviates",
                    fields: NounFields
                  }),
                  resolve() {
                    console.log("resolve WeaviateNetworkFuzzyFetch")
                    return [{}] // resolve with empty array
                  },
                },
                HelpersFetch: {
                  name: "WeaviateNetworkHelpersFetch",
                  description: "Do a fetch with help to search Things or Actions on the network weaviate",
                  type: new GraphQLObjectType({
                    name: "WeaviateNetworkHelpersFetch",
                    description: "Fetch things or actions on the internal and external Weaviates",
                    fields: NounFields
                  }),
                  resolve() {
                    console.log("resolve WeaviateNetworkHelpersFetch")
                    return [{}] // resolve with empty array
                  },
                },
                MetaFetch: {
                  name: "WeaviateNetworkMetaFetch",
                  description: "To fetch meta information Things or Actions on the network weaviate",
                  type: new GraphQLObjectType({
                    name: "WeaviateNetworkMetaFetch",
                    description: "Fetch things or actions on the internal and external Weaviates",
                    fields: NounFields
                  }),
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
