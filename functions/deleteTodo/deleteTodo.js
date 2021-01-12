const faunadb = require("faunadb");
const q = faunadb.query
const {FAUNADB_SECRET_KEY} = process.env

const handler = async (event) => {
  try {
    const ID = JSON.parse(event.body)


    const client = new faunadb.Client({secret : "fnAD_OP6LnACByLP4rOpB_INJBsNfftbPx7V_jUH"});

    const result = await client.query(
      q.Delete(q.Ref(q.Collection('todos') , ID))
    )
    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Delete ${result}` }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
