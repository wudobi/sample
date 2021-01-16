const cluster = require('cluster')
const numCPUs = require('os').cpus().length

if(cluster.isMaster) {
	console.log(`Master ${process.pid} is running`)

	for (let i=0; i<numCPUs; i++) {
		let worker = cluster.fork()
	}

	cluster.on('exit', (worker, code, signal) => {
		console.log(`worker ${worker.process.pid} died`)
		cluster.fork()
	});
} else {
	console.log(`Worker ${process.pid} started`)
}