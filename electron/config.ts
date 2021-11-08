import * as dotenv from "dotenv";

dotenv.config();

const config = {
	dev: process.env.NODE_ENV === "development",
	test: process.env.NODE_ENV === "test",
	ghToken: String(process.env.GH_TOKEN),
};

export { config };
