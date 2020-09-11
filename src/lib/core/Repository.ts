import { ReflectMetadata } from "../private/reflect-as-any.js";
import {
  entityMetadataKey,
  entityMetadataPropertyKey,
} from "../private/symbols.js";
import { CRUD } from "../typings/CRUD.js";
import { EntityMetadata } from "../typings/EntityMetadata.js";
import { Event } from "../typings/Event.js";
import { Projector } from "./Projector.js";

export class Repository<T> {
  private projector: Projector<T>;

  private idSymbol: string | symbol;

  constructor(target: new () => T, private eventLog: Event<T>[] = []) {
    const entityMetadata: EntityMetadata = ReflectMetadata.getMetadata(
      entityMetadataKey,
      target.prototype,
      entityMetadataPropertyKey
    );

    this.idSymbol = entityMetadata.properties.find(
      (property) => property.options.isId
    )?.identifier as string | symbol;

    if (this.idSymbol === undefined) {
      throw new Error(
        "Invalid target; did you add the `@Entity` decorator to your entity?"
      );
    }

    this.projector = new Projector(this.idSymbol, eventLog);
  }

  /**
   * Creates an entity by emitting an event to the event log
   *
   * @param entity The entity to create
   */
  public create(entity: Required<T>) {
    this.projector.add({
      date: new Date(),
      operation: CRUD.Create,
      data: entity,
    });
  }

  /**
   * Updates an entity by emitting an event to the event log
   *
   * @param entity The entity to update
   */
  public update(entity: Partial<T>) {
    this.projector.add({
      date: new Date(),
      operation: CRUD.Update,
      data: entity,
    });
  }

  /**
   * Delete an entity by emitting an event to the event log
   *
   * @param entity The entity to delete
   */
  public delete(entity: Partial<T>) {
    this.projector.add({
      date: new Date(),
      operation: CRUD.Delete,
      data: entity,
    });
  }

  /**
   * Finds one entity using a projection of the event log at the current (cached) or a specified timestamp
   *
   * @param entity The partial entity containing its ID
   * @param at The date at which to search
   */
  public findOne(entity: Partial<T>, at?: Date): T | undefined {
    return this.projector
      .project(at ?? "latest")
      .find(
        (e) => (e as any)[this.idSymbol] === (entity as any)[this.idSymbol]
      );
  }

  /**
   * Returns all entities at the current (cached) or a specified timestamp
   *
   * @param at The date at which to get all entities
   */
  public findAll(at?: Date): T[] {
    return this.projector.project(at ?? "latest");
  }

  /**
   * Persists the event log using a specified callback function
   *
   * @param persistFn The callback function to persist the event log
   */
  public persistEventLog<R>(persistFn: (eventLog: Event<T>[]) => R): R {
    return persistFn(this.projector.eventLog);
  }
}
