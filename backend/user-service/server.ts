import http from "http";
import index from "./app.ts";
import dotenv from "dotenv";
import { connectToDB } from "./model/repository";

dotenv.config();

const port = process.env.PORT || 3001;

const server = http.createServer(index);

if (process.env.NODE_ENV !== "test") {
  await connectToDB()
    .then(() => {
      console.log("MongoDB Connected!");

      server.listen(port);
      console.log("User service server listening on http://localhost:" + port);
    })
    .catch((err) => {
      console.error("Failed to connect to DB");
      console.error(err);
    });
}
