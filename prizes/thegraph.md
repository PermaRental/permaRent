# The Graph Judging Criteria List
- 1 point: Simple event tracking entities like [`graph init`](https://thegraph.com/docs/en/quick-start/#3-initialize-your-subgraph-from-existing-contract)
    - https://github.com/PermaRental/permaRent/tree/main/contracts/subgraph  
- 1 point: Domain entities like Accounts, Tokens, … properly filled
    - https://github.com/PermaRental/permaRent/blob/main/contracts/subgraph/schema.graphql
- 1 point: [Best](https://thegraph.com/docs/en/cookbook/pruning/) [practices](https://thegraph.com/docs/en/cookbook/derivedfrom/) applied like getOrCreate, [Bytes as IDs, immutable entities](https://thegraph.com/docs/en/cookbook/immutable-entities-bytes-as-ids/), [etc](https://www.notion.so/The-Graph-Judging-Criteria-3fd714090f2d4401a3c95974b4d9c5e6?pvs=21)
    - https://github.com/PermaRental/permaRent/blob/main/contracts/subgraph/schema.graphql
- 1 point: [Usage of Data Source Templates](https://thegraph.com/docs/en/developing/creating-a-subgraph/#data-source-templates)
    - https://github.com/PermaRental/permaRent/blob/2d1ee61f64c224f72738efc21fa08ba4d1baef29/contracts/subgraph/subgraph.yaml#L31
- 1 point: [Usage of File Data Sources](https://thegraph.com/docs/en/developing/creating-a-subgraph/#ipfsarweave-file-data-sources)
- 1 point: [Published to The Graph Network](https://thegraph.com/docs/en/publishing/publishing-a-subgraph/)
- 1.5 points: [Aggregations](https://thegraph.com/docs/en/developing/creating-a-subgraph/#timeseries-and-aggregations)
- 0.5 point: [Full-text search](https://thegraph.com/docs/en/developing/creating-a-subgraph/#defining-fulltext-search-fields)
- 0.5 point: Schema best practices (Enums, Interfaces, Fragments)
- 1 point: Other exceptional techniques like merkle root proof in subgraph, image generation in subgraph, etc.
- 2 points: Using [Substreams-powered subgraphs](https://thegraph.com/docs/en/cookbook/substreams-powered-subgraphs/)
- 1 point: [Using Matchstick for Unit testing](https://thegraph.com/docs/en/developing/unit-testing-framework/)

### Query The Graph

- 1 point: [Simply query The Graph](https://thegraph.com/docs/en/querying/querying-the-graph/)
    - https://github.com/PermaRental/permaRent/blob/main/frontend/graph/deal-service.ts
- 2 point: [Using Graph Client](https://github.com/graphprotocol/graph-client)
    - https://github.com/PermaRental/permaRent/blob/main/frontend/graph/deal-service.ts
- 0.5 point: Using [sorting](https://thegraph.com/docs/en/querying/graphql-api/#sorting) and/or [filtering](https://thegraph.com/docs/en/querying/graphql-api/#filtering)
    - https://github.com/PermaRental/permaRent/blob/2d1ee61f64c224f72738efc21fa08ba4d1baef29/frontend/graph/deal-service.ts#L46
- 1 point: [Using large pagination](https://thegraph.com/docs/en/querying/graphql-api/#example-using-first-and-id_ge)

- 1 point: Using [logical operators](https://thegraph.com/docs/en/querying/graphql-api/#logical-operators)
- 1 point: Using [nested filtering](https://thegraph.com/docs/en/querying/graphql-api/#example-for-nested-entity-filtering)
- 1 point: Better GraphQL library like Apollo or URQL (see https://github.com/graphprotocol/query-examples/tree/main)
- 1 point: [Using GraphQL variables](https://spec.graphql.org/October2021/#sec-Language.Variables)
    - https://github.com/PermaRental/permaRent/blob/2d1ee61f64c224f72738efc21fa08ba4d1baef29/frontend/graph/deal-service.ts#L137
- 1 point: Querying The Graph Network
- 1.5 point: Querying multiple subgraphs