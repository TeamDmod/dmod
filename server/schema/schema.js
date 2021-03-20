const { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLSchema, GraphQLList, GraphQLNonNull } = require('graphql');
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

const Mutation = new GraphQLObjectType({
    name: "mutation",
    fields: {
        editUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLID)},
                avatar: { type: GraphQLString },
                bio: { type: GraphQLString },
            },
            async resolve(parent, args) {
                
                let user = await users.findOne({user_id: args.id});

                if(!user) return {error: "not found"}

                user.avatar = args.avatar ? args.avatar : user.avatar;
                user.bio = args.bio ? args.bio : user.bio;
                
                await user.update();

                return user; 
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});