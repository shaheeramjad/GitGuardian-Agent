import GitGuardianService from "./services/app.service.js";

async function main() {
	const svc = new GitGuardianService();

	await svc.run();
}

main();