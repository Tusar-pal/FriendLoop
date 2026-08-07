
// Create an empty object to store ss event connection

const connection = {};

// controller function for the sse endpoint

export const sseController = (req,res) =>{
    const {userId} = req.params

    console.log('New Client connected : ', userId)

    // Set SSE header
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection' , 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin' , '*');

    // Add the client's response object to the connection object
    connection[userId]= res
}
