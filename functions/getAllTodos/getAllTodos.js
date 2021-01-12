const faunadb = require("faunadb")
const q = faunadb.query
const {FAUNADB_SECRET_KEY} = process.env

const handler = async (event) => {
  try {

    // const reqObj = JSON.parse(event)
    const client = new faunadb.Client({secret: "fnAD_OP6LnACByLP4rOpB_INJBsNfftbPx7V_jUH"});

    const result = await client.query(
        q.Map(
       q.Paginate(q.Documents(q.Collection("todos"))),
        q.Lambda(x => q.Get(x))
        )

      )
    // console.log(`getAllTodos function invoked : ${result.todo} `)

    return {
      statusCode: 200,
      body: JSON.stringify(result.data),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
