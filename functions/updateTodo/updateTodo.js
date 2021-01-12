const faunadb = require("faunadb")
const q = faunadb.query;
const {FAUNADB_SECRET_KEY} = process.env
const handler = async (event) => {
  try {

  

    const reqObj = JSON.parse(event.body)
    console.log(JSON.stringify(reqObj))

    const client = new faunadb.Client({secret : "fnAD_OP6LnACByLP4rOpB_INJBsNfftbPx7V_jUH"})

    const ID = reqObj.id


    const result = await client.query(
        q.Update(
          q.Ref(q.Collection("todos") , reqObj.id), {
            data : {
              todo : reqObj.todo
            }
          }
        )
    )  


    return {
      statusCode: 200,
      body: JSON.stringify({ data: result }),
      // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }

