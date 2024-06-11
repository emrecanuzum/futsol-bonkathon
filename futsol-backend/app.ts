import { PrismaClient } from "@prisma/client";
import express from "express";
import userRouter from "./src/user/router";
import teamRouter from "./src/team/router";
import footballPlayerRouter from "./src/footballPlayer/router";
import { login } from "./src/authentication/login";
import cors from "cors";
import bodyParser from "body-parser";
require("dotenv").config();
export const prisma = new PrismaClient();

const app = express();
const port = 8080;

app.use(
  cors({
    origin: true,
  })
);

app.use(bodyParser.json());

app.use("/user", userRouter);
app.use("/team", teamRouter);
app.use("/players", footballPlayerRouter);

app.get("/", (req, res) => {
  res.send("Server is running at port:" + port);
});

app.post("/login", login);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
