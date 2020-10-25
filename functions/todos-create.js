

const faunadb = require('faunadb'),
  q = faunadb.query;



exports.handler = async (event, context) => {
  try {

    // Only allow POST
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    let reqObj = JSON.parse(event.body);

    const client = new faunadb.Client({ secret: process.env.FAUNADB_ADMIN_SECRET });

    let result = await client.query(
      q.Create(
        q.Collection('messages'),
        { data: { message: reqObj.message} },
      )
    );
    
    console.log("Entry Created and Inserted in Container: " + result.ref.id);
   
    
    return {
      statusCode: 200,
      body: JSON.stringify({ id: `${result.ref.id}` }),
    
    }
  } catch (err) {
    return { statusCode: 400, body: err.toString() }
  }
}