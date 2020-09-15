import {
  RequestHandler,
  Request,
  Response,
  NextFunction,
  Router,
} from "express";
import { Repository } from "../core/Repository.js";

export class MiddlewareFactory<T> {
  constructor(private repository: Repository<T>) {}

  // Individual REST

  public makeGetAll(): RequestHandler {
    return function (req: Request, res: Response, next: NextFunction) {
      // TODO
      next();
    };
  }

  public makeGetOneById(): RequestHandler {
    return function (req: Request, res: Response, next: NextFunction) {
      // TODO
      next();
    };
  }

  public makeCreate(): RequestHandler {
    return function (req: Request, res: Response, next: NextFunction) {
      // TODO
      next();
    };
  }

  public makeUpdate(): RequestHandler {
    return function (req: Request, res: Response, next: NextFunction) {
      // TODO
      next();
    };
  }

  public makeDelete(): RequestHandler {
    return function (req: Request, res: Response, next: NextFunction) {
      // TODO
      next();
    };
  }

  // Router bundles

  public makeQueryRouter(): Router {
    const router = Router();

    router.get("/", this.makeGetAll());
    router.get("/:id", this.makeGetOneById());

    return router;
  }

  public makeMutationRouter(): Router {
    const router = Router();

    router.post("/", this.makeCreate());
    router.put("/:id", this.makeUpdate());
    router.delete("/:id", this.makeDelete());

    return router;
  }

  public makeRestfulRouter(): Router {
    const router = Router();

    router.use(this.makeQueryRouter());
    router.use(this.makeMutationRouter());

    return router;
  }
}
