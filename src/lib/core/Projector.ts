import { CRUD } from "../typings/CRUD.js";
import { Event } from "../typings/Event.js";
import { EntityMetadata } from "../typings/EntityMetadata.js";

export class Projector<T> {
  private projection: T[];

  constructor(
    private idSymbol: string | symbol,
    private entityMetadata: EntityMetadata,
    public eventLog: Event<T>[] = []
  ) {
    this.projection = this.parse(this.eventLog);
  }

  /**
   * Projects an event log onto a list of entities
   *
   * If `"latest"` is specified (which is also the default value), the projector will simply return
   * the cached projection. If a data is specified, the projector will iterate over all entities in
   * the event log until the specified date is reached or exceeded.
   *
   * @param at Either `"latest"` or a `Date` object specifying the date to stop projecting
   */
  public project(at: Date | "latest"): T[] {
    if (at === "latest") {
      return this.projection;
    } else if (at instanceof Date) {
      // Create a new list
      const list: T[] = [];

      // Iterate over all events until the
      for (const event of this.eventLog) {
        // Check if the specified date has been reached yet
        if (event.date <= at) {
          // Project the event onto the list
          this.parseOne(list, event);
        } else {
          // If the specified date is reached, stop projecting
          break;
        }
      }

      // Return the entity-list from the projected events
      return list;
    } else {
      throw new Error(ProjectorErrors.DATE_INVALID);
    }
  }

  public add(event: Event<T>): void {
    this.eventLog.push(event);
    this.parseOne(this.projection, event);
  }

  /**
   * Parses an event log and returns a projection based on the event log
   *
   * @param eventLog The events to create a projection from
   */
  private parse(eventLog: Event<T>[]): T[] {
    const list: T[] = [];

    // Parse all events in the event log
    eventLog.forEach((event) => this.parseOne(list, event));

    // Return the finished projection
    return list;
  }

  /**
   * Applies an event to the list of projected entities
   *
   * @param list The mutable list of projected entities
   * @param event The event to be projected onto the list
   */
  private parseOne(list: T[], event: Event<T>) {
    // Check for the ID
    if ((event.data as any)[this.idSymbol] === undefined) {
      throw new Error(ProjectorErrors.INVALID_UUID);
    }

    const i = list.findIndex(
      (el) => (el as any)[this.idSymbol] === (event.data as any)[this.idSymbol]
    );

    switch (event.operation) {
      case CRUD.Create:
        if (i !== -1) {
          throw new Error(ProjectorErrors.DUPLICATE_UUID);
        }

        // Push the new entity onto the list
        list.push(this.copyApplicableProperties(event.data) as T);
        break;

      case CRUD.Update:
        if (i === -1) {
          throw new Error(ProjectorErrors.NO_SUCH_UUID);
        }

        // Assign the remaining values
        this.copyApplicableProperties(event.data, list[i]);

        break;

      case CRUD.Delete:
        if (i === -1) {
          throw new Error(ProjectorErrors.NO_SUCH_UUID);
        }

        // Remove the entity from the list
        list.splice(i, 1);
        break;
    }
  }

  /**
   * Copies all fields with the `@Property` decorator from source to destination, provided they are not `undefined`
   *
   * This operation requires the source object to be decorated with the `@Entity` decorator.
   *
   * @param source The source object of which to copy properties from
   * @param destination The destination object to which to copy properties to
   */
  private copyApplicableProperties(
    source: Partial<T>,
    destination = {} as Partial<T>
  ): Partial<T> | T {
    for (const key in source) {
      if (
        this.entityMetadata.properties.some((p) => p.identifier === key) &&
        Object.prototype.hasOwnProperty.call(source, key) &&
        source[key] !== undefined
      ) {
        destination[key] = source[key];
      }
    }

    return destination;
  }
}

/**
 * A list of possible errors which may occur when working with the Projector class
 */
export enum ProjectorErrors {
  /**
   * An error encountered when attempting to create a new instance
   * of an entity type with an ID which is already in use
   */
  DUPLICATE_UUID = "Duplicate UUID encountered in projection",

  /**
   * An error encountered when attempting to mutate or delete an entity which could
   * not be found using the provided ID
   */
  NO_SUCH_UUID = "Cannot mutate non-existant entity",

  /**
   * An error encountered when attempting to use an invalid date
   */
  DATE_INVALID = 'The `at` parameter needs to be `"latest"` or of type `Date`',

  /**
   * An error encountered when attempting to use an invalid ID value
   */
  INVALID_UUID = "Cannot project event with an invalid UUID",
}
