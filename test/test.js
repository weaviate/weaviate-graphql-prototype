var assert = require('assert');
var request = require('request');
var lodash = require('lodash');
var should = require('should');
var expect = require('expect');

function doGraphQLRequest(requestBody, callback){

    request.post({
            uri: 'http://localhost:8081/graphql',
            method: 'POST',
            json: {
                "query": requestBody
            }
        },
        function (error, response, body) {            
            callback(error, response, body)
        }
    );

}

//
// START THE TESTS
//
describe('Local', function() {

    describe('Nested TargetedFetch', function() {
        // TEST 1
        it('should return data.Local.TargetedFetch.Things.City with an array', function(done) {
            doGraphQLRequest(`
            {
                Local {
                  TargetedFetch{
                    Things{
                      City{
                        name
                      }
                    }
                  }
                }
              }
            `, function(error, response, resultBody){
                // validate the test
                assert.equal(Array.isArray(resultBody.data.Local.TargetedFetch.Things.City), true);
                done();
            })
        });

        // TEST 2
        it('should return data.Local.TargetedFetch.Things.City[0] with name = null', function(done) {
            doGraphQLRequest(`
            {
                Local {
                  TargetedFetch {
                    Things {
                      City {
                        name
                        latitude
                      }
                    }
                  }
                }
              }              
            `, function(error, response, resultBody){
                // validate the test
                assert.equal(resultBody.data.Local.TargetedFetch.Things.City[0].name, null);
                done();
            })
        });

        // TEST 2
        it('should return data.Local.TargetedFetch.Things.City[0] with latitude = latitude', function(done) {
            doGraphQLRequest(`
            {
                Local {
                  TargetedFetch {
                    Things {
                      City {
                        name
                        latitude
                      }
                    }
                  }
                }
              }              
            `, function(error, response, resultBody){
                // validate the test
                assert.equal(resultBody.data.Local.TargetedFetch.Things.City[0].latitude, null);
                done();
            })
        });        
    });

    describe('Validate the Object Schemas (graphql introspection)', function() {

        //TEST 3
        it('should contain the correct naming convention: "WeaviateObj"', function(done){
            doGraphQLRequest(`
            {
                __schema {
                  types {
                    name
                  }
                }
            }`, function(error, response, resultBody){
                // lodash is used to find the "name"
                expect(lodash.filter(resultBody.data.__schema.types, x => x.name === 'WeaviateObj').length).not.toBeLessThan(1);
                done();
            })
        })

        // TEST 4
        it('should contain the correct naming convention: "WeaviateLocalObj"', function(done){
            doGraphQLRequest(`
            {
                __schema {
                  types {
                    name
                  }
                }
            }`, function(error, response, resultBody){
                // do the test
                expect(lodash.filter(resultBody.data.__schema.types, x => x.name === 'WeaviateLocalObj').length).not.toBeLessThan(1);
                done();
            })
        })
    })
});