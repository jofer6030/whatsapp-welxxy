import express from "express";

import RoutesApp from "./routers/index.routes.js";
import { errorHandler } from "./handlers/error.handler.js";

class Server {
  #app = express();
  #port = process.env.PORT || 3000;
  #routesApp = new RoutesApp();

  constructor() {
    this.#middlewares();
    this.#routes();
    this.#handlers();
  }

  #middlewares() {
    this.#app.use(express.json());
    this.#app.use(express.urlencoded({ extended: true }));
  }

  #routes() {
    this.#app.use("/", this.#routesApp.router);
  }

  #handlers() {
    this.#app.use(errorHandler);
  }

  listen() {
    this.#app.listen(this.#port, () => {
      console.log(`Server is running on port ${this.#port}.`);
    });
  }
}

export default Server;
