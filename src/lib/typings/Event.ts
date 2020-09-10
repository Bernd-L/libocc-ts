import { CRUD } from "./CRUD.js";

export type Event<T> = CreateEvent<T> | UpdateEvent<T> | DeleteEvent<T>;

interface BaseEvent<_> {
  /**
   * The date the event occurred
   */
  date: Date;

  /**
   * What has happened to the data
   */
  operation: CRUD;
}

interface CreateEvent<T> extends BaseEvent<T> {
  /**
   * What has happened to the data
   */
  operation: CRUD.Create;

  /**
   * The data affected by the event
   */
  data: T & Required<{ uuid: string }>;
}

interface UpdateEvent<T> extends BaseEvent<T> {
  /**
   * What has happened to the data
   */
  operation: CRUD.Update;

  /**
   * The data affected by the event
   */
  data: Partial<T> & Required<{ uuid: string }>;
}

interface DeleteEvent<T> extends BaseEvent<T> {
  /**
   * What has happened to the data
   */
  operation: CRUD.Delete;

  /**
   * The data affected by the event
   */
  data: { uuid: string };
}
