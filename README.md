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
- Run: `graphql-docs-gen https://localhost:8081/graphql docs/documentation.html`

# Naming definitions

View the naming definitions: https://github.com/bobvanluijt/weaviate-graphql-prototype/blob/master/docs/documentation.html.

# Schema definitions

Todo: https://github.com/bobvanluijt/weaviate-graphql-prototype/issues/3
