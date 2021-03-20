const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLSchema, GraphQLList } = require('graphql');
const _ = require('lodash')

let users = [
    {username: "windows", user_id: "123123123", avatar: "123", flags: ["admin"], badges: ["uwu"], join_date: 123123}
]

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        user_id: { type: GraphQLID },
        username: { type: GraphQLString },
        created_at: { type: GraphQLString },
        flags: { type: new GraphQLList(GraphQLString) },
        badges: { type: new GraphQLList(GraphQLString) }
    })
})

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        status: {
            type: GraphQLString,
            resolve(parent, args) {
                return "Hello graph ql"
            }
        },
        user: {
            type: UserType,
            args: {id:{type: GraphQLID}},
            resolve(parent, args){
                return _.find(users, {'user_id':args.id})
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery
});