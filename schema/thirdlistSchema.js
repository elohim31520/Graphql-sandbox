const graphql = require('graphql')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLFloat
} = graphql
const _ = require('lodash')
const axios = require('axios')


let data
let params = {"id":"5194731065485316859419","jsonrpc":"2.0","method":"thirdparty.list","params":{"sessionId":"ae000101411B16754C51C8113E2F98ca","terminal":8,"host":"ae.bg1207.com"}}
let params2 = {"id":"5194731076161916859419","jsonrpc":"2.0","method":"thirdparty.user.balance.list","params":{"sessionId":"ae000101411B16754C51C8113E2F98ca","terminal":8,"host":"ae.bg1207.com"}}

function getThirdPartylist(){
    return axios.post('http://www.bg1207.com/tp-cloud/api/thirdparty.list',params)
}

function getBalance(){
    return axios.post('http://www.bg1207.com/tp-cloud/api/thirdparty.user.balance.list',params2)
}

async function composeThirdPartylist() {
    let list = await getThirdPartylist()
    return list
}

function getAll(){
    Promise.all([getThirdPartylist(),getBalance()])
}


const thirdPartylistType = new GraphQLObjectType({
    name: 'Thirdpartylist',
    fields: ()=>({
        name: {type: GraphQLString},
        id: {type: GraphQLID},
        balance:{
            type: balanceType,
            resolve(parent,args){
                let res = getBalance();
                return res.then(obj=>{
                    let items = obj.data.result.items
                    return _.find(items, {thirdpartyId: Number(parent.id)})
                })
            }
        }
    })
})

const balanceType = new GraphQLObjectType({
    name: 'balanceType',
    fields: ()=>({
        thirdpartyName: {type: GraphQLString},
        thirdpartyId: {type: GraphQLID},
        balance: {type: GraphQLFloat},
    })
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        balances:{
            type: new GraphQLList(balanceType),
            resolve(){
                let res = getBalance();
                return res.then(obj=>{
                    return obj.data.result.items
                })
            }
        },
        balance:{
            type: balanceType,
            args:{id:{type: GraphQLID}},
            resolve(parent,args){
                let res = getBalance();
                return res.then(obj=>{
                    let data = obj.data.result.items
                    return _.find(data,{id: args.id})
                })
            }
        },
        thirdPartylist:{
            type: thirdPartylistType,
            args:{id:{type: GraphQLID}},
            resolve(parent,args){
                //這區快處理從database拿資料 
                let res = composeThirdPartylist();
                return res.then(obj => {
                    let data = obj.data.result;
                    return _.find(data,{id: args.id})
                })
            }
        },
        thirdPartylists: {
            type: new GraphQLList(thirdPartylistType),
            resolve(parent,args){
                let result = composeThirdPartylist();
                return result.then(obj => {
                    return obj.data.result;
                })
            }
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery
})