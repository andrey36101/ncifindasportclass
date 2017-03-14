var app=require('./app');
var server=app.listen(config.server.port,()=>{
	console.log(`Server listening on ${server.address().address} @ ${server.address().port}`);
});