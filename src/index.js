import { ApolloServer, makeExecutableSchema } from "apollo-server"

// Models
import models from "./models";

// Type definitions & resolvers
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/types";

// Schema
const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})

// Apollo Server
const apolloServer = new ApolloServer({
    schema,
    context: {
        models
    }
})

// Running Apollo server
const alter = true
const force = false

models.sequelize.sync({ alter, force }).then(() => {
    apolloServer.listen(5000).then(({ url }) => console.log(`Running on ${url}`))
})