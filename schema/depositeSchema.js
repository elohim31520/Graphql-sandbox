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

function setParams(method){
    return {"id":"5184622065932516859419","jsonrpc":"2.0","method": method,"params":{"sessionId":"ae000101411B14908760C210EF34fad2","currency":"1","terminal":8,"host":"ae.bg1207.com"}}
}


function paymentBglist(){
    return axios.post('http://www.bg1207.com/cloud/api/sn.payment.biglist',{"id":"5192443763619016859419","jsonrpc":"2.0","method":"sn.payment.biglist","params":{"sessionId":"ae000101411B19C295CDBE112BFC1030","changeNo":"190306220802103389","isFromMobile":1,"iframeFlag":0,"terminal":8,"host":"ae.bg1207.com"}})
}

function getBalance(){
    return axios.post('http://www.bg1207.com/tp-cloud/api/thirdparty.user.balance.list',setParams())
}

// function getAllAPI(){
//     return Promise.all([paymentBglist(),getBalance()])
// }
let temp = []

const paymentType = new GraphQLObjectType({
    name: 'PaymentType',
    fields: ()=>({
        bankId: {type: GraphQLInt},
        bankName: {type: GraphQLString},
        payId: {type: GraphQLInt},
        payUrl: {type: GraphQLString},
        chargeMode: {type: GraphQLString},
        payCode: {type: GraphQLString},
    })
})

const aliType = new GraphQLObjectType({
    name: 'aliType',
    fields: ()=>({
        bankId: {type: GraphQLInt},
        bankName: {type: GraphQLString},
        payId: {type: GraphQLInt},
        payUrl: {type: GraphQLString},
        chargeMode: {type: GraphQLString},
        payCode: {type: GraphQLString},
    })
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        payment:{
            type: new GraphQLList(paymentType),
            resolve(){
                return paymentBglist().then(res => {
                    Object.values(res.data.result).forEach(el=>{
                        el.forEach(bank =>{
                            let obj = Object.values(bank)[0]
                            temp.push(obj)
                        })
                    })
                    // console.log(temp)
                    return temp
                })
            }
        },
        bank: {
            type: new GraphQLList(aliType),
            args:{bankId: {type: GraphQLInt}},
            resolve(parent,args){
                temp =[]
                return paymentBglist().then(res => {
                    Object.values(res.data.result).forEach(el=>{
                        el.forEach(bank =>{
                            let obj = Object.values(bank)[0]
                            temp.push(obj)
                        })
                    })
                    let arr =[]
                    temp.forEach(el=>{
                        if(el.bankId == args.bankId){
                            arr.push(el)
                        }
                    })
                    return arr
                })
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})