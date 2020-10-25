const faunadb = require("faunadb"),
  q = faunadb.query

require("dotenv").config()

exports.handler = async (event, context) => {
  if (process.env.FAUNADB_SERVER_SECRET) {
    //console.log("Faunadb Server Secret: " + process.env.FAUNADB_SERVER_SECRET);
  }
  try {
    var client = new faunadb.Client({
      secret: process.env.FAUNADB_ADMIN_SECRET,
    })
    let reqObj = JSON.parse(event.body)

    var result = await client.query(
      q.Update(q.Ref(q.Collection("messages"), reqObj.id), {
        data: { message: reqObj.message },
      })
    )
    //   console.log("Document updated in Container in Database: "  + result.data.message);
    //   console.log("Tags Appended:")
    return {
      statusCode: 200,
      body: JSON.stringify({
        id: `${result.ref.id}`,
        message: "message updated successfully",
      }),
    }
  } catch (error) {
    console.log("Error: ")
    console.log(error)
  }
}
