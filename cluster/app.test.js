const cluster = require('cluster')
const numCPUs = require('os').cpus().length

/**
 * 현재 활성화되어있는 워커의 ID를 출력한다
 */
function echoLivedWorker(cluster) {
	// cluster.workers 가 array가 아니고 object로 나오는데 그 key값이 worker의 고유 아이디임
	console.log(`활성화된 워커들: ${Object.keys(cluster.workers)}`);
}

if(cluster.isMaster) {
	console.log(`Master ${process.pid} is running`)

	for (let i=0; i<numCPUs; i++) {
		let worker = cluster.fork()

		// 3초 이후에 죽었다고 가정
		if(i === 0) {
			setTimeout(() => {
				// worker.disconnect()
				worker.kill()
			}, 3000)
		}
	}

	cluster.on('exit', (worker, code, signal) => { // 워커가 죽었을 경우
		console.log('worker %d died (%s). restarting...', worker.process.pid, signal || code)
		cluster.fork() // 워크를 하나 생성한다
	})

	echoLivedWorker(cluster)

	setInterval(() => {
		echoLivedWorker(cluster)
	}, 5000)
} else {
	console.log(`Worker ${process.pid} started`)
}