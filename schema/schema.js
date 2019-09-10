const graphql = require('graphql')
const {GraphQLObjectType,GraphQLString,GraphQLSchema,GraphQLID,GraphQLInt,GraphQLList} = graphql
const _ = require('lodash')
const axios = require('axios')


let DB =[
    {name: '不費力的力量：順勢而為的管理藝術' ,genre: '工作哲學',id:"1" ,authorId: "1"},
    {name: '霍金大見解：留給世人的十個大哉問與解答' ,genre: '天文學/地球科學',id:"2" ,authorId: "2"},
    {name: '達文西傳（達文西逝世500周年精裝紀念版）' ,genre: '傳記',id:'3',authorId: "3"},
    {name: '被消失的科學神人‧特斯拉親筆自傳' ,genre: '科普叢書',id:'4',authorId: "2"},
    {name: '只要看起來很厲害，就可以了！巧妙直入人心的暗黑心理學：優雅的狡猾才是王道，90個讓你穩居優勢的必勝人心攻略' ,genre: '人際關係',id:'5',authorId: "3"},
]

let authors =[
    {name: '齊藤勇' ,age: 45 ,id:"1"},
    {name: '華特．艾薩克森' ,age: 55 ,id:"2"},
    {name: ' Diana Renner, Steven D’Souza' ,age: 36 ,id:"3"},
]


const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author:{
            type: AuthorType,
            resolve(parent,args){
                return _.find(authors,{id:parent.authorId})
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        book:{
            type: new GraphQLList(BookType),
            resolve(parent,args){
                return _.filter(DB,{authorId: parent.id})
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        book:{
            type:BookType,
            args:{id:{type: GraphQLID}},
            resolve(parent,args){
                //這區快處理從database拿資料 
                return _.find(DB,{id: args.id})
            }
        },
        author:{
            type: AuthorType,
            args:{id:{type: GraphQLID}},
            resolve(parent,args){
                //這區快處理從database拿資料 
                return _.find(authors,{id: args.id})
                // return  {name: ' Diana Renner, Steven D’Souza' ,age: 36 ,id:3}
            }
        },
        books:{
            type: new GraphQLList(BookType),
            resolve(parent,args){
                return DB
            }
        },
        authors:{
            type: new GraphQLList(AuthorType),
            resolve(parent,args){
                return authors
            }
        }
    }
})


//寫入
const mutation =  new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addAuthor:{
            type: AuthorType,
            args:{
                name:{type: GraphQLString},
                age:{type: GraphQLInt}
            },
            resolve(parent,args){
                
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})

