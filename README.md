# Event-Driven API

This project is a Node.js application that demonstrates the differences between classic and event-driven API designs.

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://<repository-url>
   cd event-driven-api
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```

## Usage

To start the development server, run:

```bash
npm run dev
```

This will start the server using `ts-node-dev`, which automatically restarts the server upon file changes. The application will typically be available at `http://localhost:3000` (or another port if configured differently).

## Available Scripts

In the project directory, you can run the following commands:

### `npm test`

Runs the test suite. (Currently a placeholder "test" script).

### `npm run dev`

Runs the app in development mode using `ts-node-dev`. This will automatically restart the server when file changes are detected.

### `npm run build`

Builds the app for production to the `dist` folder by compiling the TypeScript code.

### `npm start`

Starts the production server from the `dist` folder using `node`.

## API Endpoints

This application implements two different approaches for some of its API endpoints: Classic REST and Event-Driven REST.

### Classic REST API

These endpoints follow a traditional synchronous request-response pattern.

- **GET /classic/users**: Retrieves a list of all users.
  - Parameters: None
- **POST /classic/users**: Creates a new user.
  - Body: `{ "name": "John Doe", "email": "john.doe@example.com" }`
- **GET /classic/users/:id**: Retrieves a specific user by ID.
  - Parameters: `id` (User ID)
- **PUT /classic/users/:id**: Updates a specific user by ID.
  - Parameters: `id` (User ID)
  - Body: `{ "name": "Jane Doe", "email": "jane.doe@example.com" }`
- **DELETE /classic/users/:id**: Deletes a specific user by ID.
  - Parameters: `id` (User ID)

### Event-Driven REST API

These endpoints utilize an event-driven architecture. When a request is made, an event is typically emitted, and the client might receive an immediate acknowledgment while the actual processing happens asynchronously. The client might need to subscribe to events or poll another endpoint to get the result of the operation.

- **POST /event-driven/users**: Initiates the creation of a new user. An event is emitted, and the user creation is processed asynchronously.
  - Body: `{ "name": "John Doe", "email": "john.doe@example.com" }`
  - Response: Acknowledgment that the user creation process has started.
- **PUT /event-driven/users/:id**: Initiates an update for a specific user by ID. An event is emitted for asynchronous processing.
  - Parameters: `id` (User ID)
  - Body: `{ "name": "Jane Doe", "email": "jane.doe@example.com" }`
  - Response: Acknowledgment that the user update process has started.
- **DELETE /event-driven/users/:id**: Initiates the deletion of a specific user by ID. An event is emitted for asynchronous processing.
  - Parameters: `id` (User ID)
  - Response: Acknowledgment that the user deletion process has started.

*(Note: The event-driven GET operations might still be synchronous or might involve querying a data store that is updated by event handlers.)*

## Contributing

Information on how to contribute to the project.

## License

Information about the project's license.
