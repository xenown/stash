/**
 * @fileoverview Manage all sqlite related interactions, including bootstrapping,
 * table schemas and integrity checking.
 */

import { v4 } from "uuid";

class Datastore {
  constructor() {
    this.userId = v4();
    this.language = "en";
  }

  public getUserId(): string {
    return this.userId;
  }

  public getPlaidLanguage(): string {
    // English by default, but eventually we want the client to be able to
    // store an override.
    return this.language;
  }

  private userId: string;
  private language: string;
}

const datastore = () => {
  if (!datastoreVariable) {
    datastoreVariable = new Datastore();
  }
  return datastoreVariable;
};

// Lazy setup our singleton so that our test files can at least import the module
let datastoreVariable: Datastore | null = null;

// Likely going to setup knex here. + knex paginate
// Singleton
// Load / Create main sql lite file
// Construct all tables

// Each extension will get its own sql lite file and a read only connection
// to the main db. One can attach the extension's sql lite file to the connection
// and do joins. Use will need to create its own connection to
// its own sqllite file to write.

export { datastore };
