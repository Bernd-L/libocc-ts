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

  public project(at: Date | "latest" = "latest"): T[] {
    // TODO
    return [];
  }

  public add(event: Event<T>) {
    // TODO
  }

  /**
   * Parses an event log and returns a projection based on the event log
   *
   * @param eventLog The events to create a projection from
   */
  private parse(eventLog: Event<T>[]): T[] {
    const list: T[] = [];

    for (const event of eventLog) {
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

    // Return the finished projection
    return list;
  }
}

export enum ProjectorErrors {
  DUPLICATE_UUID = "Duplicate UUID encountered in projection",
  NO_SUCH_UUID = "Cannot mutate non-existant entity",
}
