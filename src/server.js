import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import productsRoute from "./products/index.js";
import reviewsRoute from "./reviews/index.js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import YAML from "yamljs";
import swaggerUI from "swagger-ui-express";

import {
  error404Handler,
  error401Handler,
  error403Handler,
  genericErrorHandler,
} from "./middlewares/errorHandler.js";

const server = express();
const port = process.env.PORT || 5000;
const swaggerDoc = YAML.load(
  join(dirname(fileURLToPath(import.meta.url))),
  "./apiDesc.yaml"
);
const loggerMiddleware = (req, res, next) => {
  console.log(`Logged ${req.url} ${req.method} -- ${new Date()}`);
  next();
};

const pathToPublic = join(
  dirname(fileURLToPath(import.meta.url)),
  "../public/img"
);

server.use(express.static(pathToPublic));
server.use(cors());
server.use(express.json());

server.use("/products", productsRoute);
server.use("/products/reviews", reviewsRoute);
server.use("/documentation", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

//ERROR HANDLERS
server.use(error404Handler);
server.use(error401Handler);
server.use(error403Handler);
server.use(genericErrorHandler);

// console.log(listEndpoints(server));

server.listen(port, () => console.log("Server is running on port: ", port));
server.on("error", (error) => console.log("Server is not running. ", error));
