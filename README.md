# Run prototype

- Install `npm install -g nodemon`
- Install packages: `npm install`
- Run: `nodemon server_small.js`

# Run cli tool

- `npm install -g graphql-cli`
- `cd` into a new dir
- `graphql init` (schema for this prototype = `http://localhost:8081/graphql`)

Get the schema:
- `graphql get-schema`

Result will be in: `./schema.graphql`

Get documentation:
- Install: `npm install -g graphql-docs`
- Run: `graphql-docs-gen http://localhost:8081/graphql docs/documentation.html`

# Naming conventions

Names of query fields are structured as follows. 
The root query is called 'Weaviate'. The GraphQL Object Type names of the fields are built on top of the root query, so that the names trickle down the path of the query.
For example, the query 

```
{
  	Local{
    	TargetedFetch{
			Things{
				City{
					name
				}
			}
		}
  	}
}
```

Has GraphQLObjectType names:

```
{
	<WeaviateObj>{
		<WeaviateLocalObj>{
			<WeaviateLocalTargetedFetchObj>{
				<WeaviateLocalTargetedFetchThingsObj>{
						<PropertyName>
				}
			}
		}
	}
}
```

Important to note is that the GraphQLObjectTypes names itself end with `Obj`, while the Field names do not. The Field names of the objects in the example above are:

```
{
	<WeaviateLocal>{
		<WeaviateLocalTargetedFetch>{
			<WeaviateLocalTargetedFetchThings>{
				City{
					name
				}
			}
		}
	}
}
```

# Schema definitions

View the schema documentation: https://github.com/bobvanluijt/weaviate-graphql-prototype/blob/master/docs/documentation.html.
