/**
 * @author Eugene Pashkovsky <pashkovskiy.eugen@gmail.com>
 */

import express, { Express, Request, Response } from "express";
import * as dotenv from "dotenv";
import path from "path";
import swaggerUi from "swagger-ui-express";
import errorMiddleware from "./middlewares/errorMiddleware";
import { RegisterRoutes as registerRoutes } from "./routes/routes";
import cors from "cors";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
if (!process.env.dev) {
  if (!process.env.PASSWORD_SALT)
    throw new Error("PASSWORD_SALT is not defined");
  if (!process.env.ACCESS_TOKEN_SECRET)
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  if (!process.env.REFRESH_TOKEN_SECRET)
    throw new Error("REFRESH_TOKEN_SECRET is not defined");
}

const app: Express = express();
app.disable("x-powered-by");
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:80",
  "http://192.168.49.2:80",
];

const options: cors.CorsOptions = {
  credentials: true,
  origin: allowedOrigins,
};

app.use(cors(options));
app.use(express.static(path.resolve(__dirname, "public")));
app.use(
  "/auth/docs",
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: {
      url: "/swagger.json",
    },
  })
);
registerRoutes(app);
app.use(errorMiddleware);
app.get("*", async (_req: Request, res: Response) => {
  res.status(404).end();
});

export default app;
