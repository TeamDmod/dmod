const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLSchema, GraphQLList } = require('graphql');
const users = require('../models/user');


const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        user_id: { type: GraphQLID },
        username: { type: GraphQLString },
        join_date: { type: GraphQLString },
        avatar: { type: GraphQLString },
        bio: { type: GraphQLString },
        flags: { type: new GraphQLList(GraphQLString) },
        badges: { type: new GraphQLList(GraphQLString) },
        cv_id: { type: GraphQLString }
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
                return users.findOne({user_id:args.id})
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery
});