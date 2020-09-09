import { Event } from "../typings/Event.js";
import { Entity } from "../typings/Entity.js";
import { CRUD } from "../typings/CRUD.js";

export class Projector<T extends Entity> {
  // private projections: {
  //   latest: T[];
  //   [at: string]: T[];
  // };

  // TODO
  private projection: T[];

  constructor(private eventLog: Event<T>[]) {
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
  public project(at: Date | "latest" = "latest"): T[] {
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
    const i = list.findIndex((el) => el.uuid === event.data.uuid);

    switch (event.operation) {
      case CRUD.Create:
        if (i !== -1) {
          throw new Error(ProjectorErrors.DUPLICATE_UUID);
        }

        // Push the new entity onto the list
        list.push(event.data);
        break;

      case CRUD.Update:
        if (i === -1) {
          throw new Error(ProjectorErrors.NO_SUCH_UUID);
        }

        // Remove undefined values
        Object.keys(event.data).forEach(
          (key) => key === undefined && delete event.data[key]
        );

        // Assign the remaining values
        Object.assign(list[i], event.data);

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
}

export enum ProjectorErrors {
  DUPLICATE_UUID = "Duplicate UUID encountered in projection",
  NO_SUCH_UUID = "Cannot mutate non-existant entity",
  DATE_INVALID = 'The `at` parameter needs to be `"latest"` or of type `Date`',
}
