import * as childProcess from "child_process";
import * as net from "net";

const ONE_SECOND = 1000;
const client = new net.Socket();
let electronStarted = false;

client.connect({ port: 3000 });

client.on("connect", () => {
	client.end();
	if (!electronStarted) {
		electronStarted = true;
		console.log("Starting electron connection...");

		childProcess.exec('nodemon --watch "public" --exec "electron public/main.js"', {
			windowsHide: true,
		});
	}
});

client.on("error", () => {
	console.log(
		!electronStarted
			? "React server is not online yet."
			: "Lost connection with React dev server."
	);
	setTimeout(() => {
		client.connect({ port: 3000 });
	}, ONE_SECOND * 10);
});
