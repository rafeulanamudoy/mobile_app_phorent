import { Server } from "http";
import app from "./app";
import config from "./config";
import redis from "./shared/redis";

async function main() {
  await redis.ping();
  const server: Server = app.listen(config.port, () => {
    console.log("Sever is running on port ", config.port);

  });


  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.info("Server closed!");
      });
    }
    process.exit(1);
  };
  process.on("uncaughtException", (error) => {
    console.log(error);
    exitHandler();
  });

  process.on("unhandledRejection", (error) => {
    console.log(error);
    exitHandler();
  });
}

main();
