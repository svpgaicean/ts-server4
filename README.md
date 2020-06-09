# Description
Personal project developed with the purpose of applying OOP concepts, good
design practices, REST API design and learning of the TypeScript language
in depth. Also improved my understanding of project configuration,
TypeScript compilation process, Database setup.

### Applied Concepts
Generic Types, use of Decorators, OOP principles (composition over inheritance),
SOLID principles, code refactoring based on KISS and DRY.

### Features
Request Validation, Class Properties Validation, Error Handling,
Utility Functions for Object Manipulation, Environment Variables Configuration,
Testing with Jest.

## Architecture
Monolithic app composed of a data layer and an application layer.

Data sent/received to/from the clients is stored as Models.<br />
All application logic is done using Entities.<br />
Data sent/received to/from the database is done through MongoDB Models
based on defined Schemas.<br />

Model = Request/Response Model<br />
Entity = Business Object<br />
Schema = Database Model<br />

### Data Layer
#### Controller
Controller handles routes and validation of body/query params. Request/response
handling. Deals with Models only.
#### Handler
Handlers cover all the business logic, validate Models and check for errors.<br />
Transforms Models to Entities, sends Entities to the Persistence layer,
retrieves Database Models as Entities and converts them back to Reponse Models.

### Persistence Layer
Persistence layer uses composition to achieve the flexibility in picking a
database implementation.

The Repository implements a Database Interface that has the database
functionality defined, allowing the Interface to use whatever type of database
it wants as long as it implements the agreed upon functions.

The Repository is implemented using composition, requiring a separate
implementation for the chosen Database, matching the Database Interface.
