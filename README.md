## Requirements

- Node ^18.14.1
- Yarn ^1.22.19
- Docker Compose ^2.16.0

## Usage

1. `yarn install`
2. `yarn test`

## Available Operations

### model User

- `get_user_by_public_key.ts`
- `get_user_by_public_key.test.ts`


### model Session

// A session cannot be created if there is no user associated with it.

- `create_session.`
- `create_session.test`


// Returns the sessions by id.

- `get_session_by_id`
- `get_session_by_id.test`


// The session cannot be destroyed if it does not exist.

- `destroy_session`
- `destroy_session.test`



### model SensorReadings

// `SENSOR_READINGS_BATCH_SIZE = 375;`

// A sensor readings batch cannot be written if the session has not been started or has been destroyed

- `write_sensor_readings_chunk`
- `write_sensor_readings_chunk.test`


// The `limit` should be in range between 1 and 5 (inclusive).
// It may be expanded after proper testing.

- `fetch_sensor_readings_chunk`
- `fetch_sensor_readings_chunk.test`


## Special Notes

### Seeding the database

A database should be seeded every time before using because otherwise there is no way to onboard a new users.

https://www.prisma.io/docs/guides/database/seed-database

For development purposes, there should be a predefined set of accounts (e.g. 3 accounts) with a `public_key` and corresponding `private_key` stored in the `.csv` file as well as `user_first_name`, `user_last_name` & `email`.
