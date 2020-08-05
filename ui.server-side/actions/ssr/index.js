require("regenerator-runtime/runtime");
const processor = require('../common/app');

async function main(args) {
  let response = '';
  try {
    response = await processor.processSPA(args);   
  } catch (err) {
    console.error("Error: " + err);
    return response;
  }
  console.log(response);
  return { 
     headers: { 
       'Content-Type': 'text/html'
     }, 
     statusCode: 200,
     body: response }
}

exports.main = main;
