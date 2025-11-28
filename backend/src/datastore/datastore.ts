/**
 * @fileoverview Manage all sqlite related interactions, including bootstrapping,
 * table schemas and integrity checking.
 */

 // Likely going to setup knex here. + knex paginate
 // Singleton
 // Load / Create main sql lite file
 // Construct all tables
 
 // Each extension will get its own sql lite file and a read only connection
 // to the main db. One can attach the extension's sql lite file to the connection
 // and do joins. Use will need to create its own connection to 
 // its own sqllite file to write.

