/**
 * Keep track of the database model
 * TODO: use these return types in the repos
 * so after this, we'll have DBEvent and lib event.
 * I kind of want a better way of composing the ID into the interface.
 * or just have the thing with the id, and explicitly omit it every time
 *
 * completely separate the
 */

export interface DBEvent {
  owner: string;
  name: string;
  start: number;
  end: number;
}

export interface DB {
  events: DBEvent[];
}
