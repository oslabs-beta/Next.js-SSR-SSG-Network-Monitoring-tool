//import telemetry packages 
const process = require('process');
const opentelemetry = require('@opentelemetry/sdk-node');
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");

//import express packages
const express = require('express');
const app = express();
const cors = require('cors');

//express configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// --- OPEN TELEMETRY SETUP --- //

//define sdk
const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: "http://localhost:4000/" //export traces as http req to custom express server on port 400
  }),
  instrumentations: [new HttpInstrumentation()] //add http instrumentation 
});

//start sdk
sdk.start();

//gracefully shut down SDK on process exit
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});

// --- EXPRESS SERVER / SOCKET SETUP --- //

//helper function to detect string/array overlap
const includesAny = (array, string) => {
  for (let i = 0; i<array.length; i++){
    if(string.includes(array[i])) return true;
  }
  return false
}

//custom express server running on port 4000 to send data to front end
app.use('/',(req,res)=>{

  const clientData = [];
  const spans = req.body.resourceSpans[0].scopeSpans[0].spans; 
  const ignoreEndpoints = ['localhost','socket','nextjs']; //endpoints to ignore

  //add select span data to clientData array through deconstration of span elements
  //spans is an array of trace objects 
  //attributes is an array of nested object with one key-value pair per array element
  //ex: attributes = [{key: 'http.url', value: {stringValue: 'wwww.api.com/'}}...]
  //el.attributes.find finds the array element with a matching key desired and returns the unnested value if
  //exists or null if doesn't exist  
  spans.forEach((el)=>{
    const clientObj = {
      spanId: el.spanId,
      traceId: el.traceId,
      startTime: el.startTimeUnixNano,
      endTime: el.endTimeUnixNano,
      packageSize: el.attributes.find(attr=>attr.key === 'http.request_content_length_uncompressed') ? el.attributes.find(attr=>attr.key === 'http.request_content_length_uncompressed').value.intValue : null,
      statusCode: el.attributes.find(attr=>attr.key === 'http.status_code') ? el.attributes.find(attr=>attr.key === 'http.status_code').value.intValue : null,
      endPoint: el.attributes.find(attr=>attr.key === 'http.url') ? el.attributes.find(attr=>attr.key === 'http.url').value.stringValue : null,
      requestType: el.name
    };

    //if the endpoint is an external api add it to client data arrat
    if(clientObj.endPoint){
      if(!includesAny(ignoreEndpoints,clientObj.endPoint)){
        clientData.push(clientObj); 
      }
    }
  });
  if(clientData.length > 0) io.emit('message',JSON.stringify(clientData)); //send clientData to frontend through socket 
  res.status(200).end(); //end request response cycle
});

//start custom express server on port 4000
const server = app.listen(4000, () => {
  console.log(`Custom trace listening server on port 4000`);
});

//create socket running on top of express server (port 4000) + enable cors 
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
});


