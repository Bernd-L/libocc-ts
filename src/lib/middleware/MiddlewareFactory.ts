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

  /**
   * Generates middleware returning all entities in the repository at the specified date,
   * which defaults to the latest (cached) projection.
   *
   * Specifying a data will result in re-calculating the projection for every request.
   * If nothing was found, an empty array will be returned with a 200.
   *
   * @param at The date with which to find using the repository
   */
  public makeGetAll(at?: Date): RequestHandler {
    return (_: Request, res: Response) => {
      res.json(this.repository.findAll(at));
    };
  }

  /**
   * Generates middleware returning the requested entity or a 404
   *
   * The request parameter for the `id` field must be specified, it will be
   * inserted into a partial entity and then passed on to the repository for querying.
   *
   * If the optional `at` parameter is specified, the projector will calculate the projection
   * for the requested date, if omitted, the (cached) latest projection will be used.
   *
   * @param at The date with which to find using the repository
   */
  public makeGetOneById(at?: Date): RequestHandler {
    const idSymbol = this.repository.entityMetadata.properties.find(
      (property) => property.options.isId
    )?.identifier as string | symbol;

    if (idSymbol === undefined) {
      throw new Error(
        "Invalid target; did you add the `@Entity` decorator to your entity?"
      );
    }

    return (req: Request, res: Response) => {
      try {
        const entity = this.repository.findOne(
          {
            [idSymbol]: req.params["id"],
          } as any,
          at
        );

        res.json(entity);
      } catch (err) {
        res.sendStatus(404);
      }
    };
  }

  /**
   * Generates middleware returning 201 for successful creation, 409 otherwise
   *
   * The function uses the repository to create a new entity as specified in the
   * request, and responds with a 201 status code if the operation was successful,
   * otherwise, a 409 status code is returned.
   */
  public makeCreate(): RequestHandler {
    return (req: Request, res: Response) => {
      try {
        this.repository.create(req.body);

        res.sendStatus(201);
      } catch (err) {
        res.sendStatus(409);
      }
    };
  }

  /**
   * Generates middleware returning 200 on a successful update, 409 otherwise
   *
   * The function uses the repository to update a (partial) entity included in the
   * request, and responds with a 200 status code if the operation was successful,
   * otherwise, a 409 status code is returned.
   */
  public makeUpdate(): RequestHandler {
    return (req: Request, res: Response) => {
      try {
        this.repository.update(req.body);

        res.sendStatus(200);
      } catch (err) {
        res.sendStatus(409);
      }
    };
  }

  /**
   * Generates middleware returning 200 on successful deletion, 400 otherwise
   *
   * The request parameter for the `id` field must be specified, it will be
   * inserted into a partial entity and then passed on to the repository for deletion.
   *
   * The function uses the repository to delete a (partial) entity included in the
   * request, and responds with a 200 status code if the operation was successful,
   * otherwise, a 400 status code is returned.
   */
  public makeDelete(): RequestHandler {
    const idSymbol = this.repository.entityMetadata.properties.find(
      (property) => property.options.isId
    )?.identifier as string | symbol;

    if (idSymbol === undefined) {
      throw new Error(
        "Invalid target; did you add the `@Entity` decorator to your entity?"
      );
    }

    return (req: Request, res: Response) => {
      try {
        this.repository.delete({
          [idSymbol]: req.params["id"],
        } as any);

        res.sendStatus(200);
      } catch (err) {
        res.sendStatus(400);
      }
    };
  }

  /**
   * Generates a bundle of middleware containing both `GET` endpoints
   *
   * The returned router mounts the `makeGetAll` at `/` and
   * `makeGetOneById` at `/:id`, both using the `GET` method.
   *
   * See the documentation on `makeGetAll` and `makeGetOneById` for more information.
   *
   * @param at The date with which to find using the repository
   */
  public makeQueryRouter(at?: Date): Router {
    const router = Router();

    router.get("/", this.makeGetAll(at));
    router.get("/:id", this.makeGetOneById(at));

    return router;
  }

  /**
   * Generates a bundle of middleware containing the `POST`, `PUT`, and `DELETE` endpoints
   *
   * The returned router mounts the `makeCreate` at `/` using the `POST` method,
   * `makeUpdate` at `/` using the `PUT` method,
   * and `makeDelete` at `/:id` using the `DELETE` method.
   *
   * See the documentation on `makeCreate`, `makeUpdate` and `makeDelete` for more information.
   */
  public makeMutationRouter(): Router {
    const router = Router();

    router.post("/", this.makeCreate());
    router.put("/", this.makeUpdate());
    router.delete("/:id", this.makeDelete());

    return router;
  }

  /**
   * Generates a bundle of middleware containing all `REST` endpoints
   *
   * The returned router mounts the `makeGetAll` at `/`,
   * `makeGetOneById` at `/:id`, both using the `GET` method,
   * `makeCreate` at `/` using the `POST` method,
   * `makeUpdate` at `/` using the `PUT` method,
   * and `makeDelete` at `/:id` using the `DELETE` method.
   *
   * See the documentation on `makeGetAll`, `makeGetOneById`, `makeCreate`,
   * `makeUpdate` and `makeDelete` for more information.
   *
   * @param at The date with which to find using the repository
   */
  public makeRestfulRouter(at?: Date): Router {
    const router = Router();

    router.use(this.makeQueryRouter(at));
    router.use(this.makeMutationRouter());

    return router;
  }
}
