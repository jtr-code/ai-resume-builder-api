import dotenv from "dotenv";

import { app } from "./app";
import { connectDb } from "./db/dbConfig";

dotenv.config({
  path: "./.env",
});

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 6000, () => {
      console.log("⚙️  Server is running on port: " + process.env.PORT);
    });
  })
  .catch((err: any) => {
    console.log("db connection error: ", err);
  });
