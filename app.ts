import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import {router} from "./trpc";
import {kompetansesjekkerRouter} from "./routes/kompetansesjekker";
import {createHTTPServer} from "@trpc/server/adapters/standalone";
const PORT = 3000;

export const appRouter = router({
  kompetansesjekker: kompetansesjekkerRouter,
});

export type AppRouter = typeof appRouter;

createHTTPServer({
  middleware: cors(),
  router: appRouter,
  createContext() {
    return {};
  },
}).listen(2022);

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "frontend/build")));

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
