# GraphQL API

## Usage

To run the prototype: 
- Install `npm install -g nodemon`
- Install packages: `npm install`
- Run: `nodemon server_small.js`
The GraphQL API prototype will be running at `http://localhost:8081/`. To expore, you can use GraphiQL (an in-browser IDE for exploring GraphQL APIs), which can be found at `http://localhost:8081/graphql`.

To run the CLI tool:
- Install `npm install -g graphql-cli`
- `cd` into a new dir
- `graphql init` (schema for this prototype = `http://localhost:8081/graphql`)

To get the full graphql schema by the CLI tool:
- Run: `graphql get-schema`
The result will be in `./schema.graphql`

To get the full schema definitions in markdown by a graphql introspection query:
- Install `npm install -g graphql-markdown`
- Run `graphql-markdown ./path/to/schema.graphql > schema.md`


## Documentation
The full documentation can be found [here](https://github.com/creativesoftwarefdn/weaviate/tree/technical_design_document/docs)
