import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import logger from "morgan";
import path from "path";
dotenv.config();

import * as trpcExpress from "@trpc/server/adapters/express";
import {kompetansesjekkerRouter} from "./routes/kompetansesjekker";
import {router} from "./trpc";
import {slackRouter, slackRouterV2} from "./routes/slack";
const PORT = 3000;

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context

export const appRouter = router({
  kompetansesjekker: kompetansesjekkerRouter,
  slack: slackRouterV2,
});

export type AppRouter = typeof appRouter;

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "/public")));

app.use("/slack", slackRouter);
app.use(
  "/",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.listen(process.env.PORT || PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
