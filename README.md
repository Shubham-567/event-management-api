# Event Management API

A simple REST API to manage events and user registrations using Node.js, Express, and PostgreSQL/Supabase.

---

## Deployed API Link

You can access the API here:

[https://event-management-api-zro2.onrender.com/api](https://event-management-api-zro2.onrender.com/api)

---

## Features

- Create and view events
- Register and cancel users for events
- See upcoming events sorted by date and location
- Get event stats (total registrations, remaining spots, capacity used)
- Prevent double registrations and overbooking
- Handles past events and concurrency with Transaction

---

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgreSQL / Supabase
- **Modules**: ES Modules
- **Environment**: dotenv

---

## Setup

1.  **Clone repo**

    ```sh
    git clone https://github.com/Shubham-567/event-management-api.git
    cd event-management-api
    ```

2.  **Install dependencies**

    ```sh
    npm install
    ```

3.  **Add environment variables in `.env`:**

    ```env
    PORT=5000

    DB_HOST=<host>
    DB_PORT=<port>
    DB_NAME=<name>
    DB_USER=<user>
    DB_PASSWORD=<password>
    ```

4.  **Create tables:** by running the setup script.

    ```sh
    node setupTables.js
    ```

5.  **Start the server**
    ```sh
    node server.js
    ```
    The server will be running on `http://localhost:5000`.

---

## API Endpoints

### Users
* `POST /api/users` → create a user
* `GET /api/users/:id` → get user info

### Events
* `POST /api/events` → create event
* `GET /api/events/:id` → event details + registrations
* `POST /api/events/:id/register` → register a user
* `DELETE /api/events/:id/register/:userId` → cancel registration
* `GET /api/events/upcoming/list` → list upcoming events
* `GET /api/events/:id/stats` → event stats

---

## Rules & Validation

* Capacity: 1–1000
* No registration for past events
* Duplicate registrations blocked
* Email validated
* Field limits: title ≤ 255, location ≤ 255, name ≤ 100
* Uses transactions to prevent overbooking

---

## Example Requests

### Create Event

`POST /api/events`

```json
{
  "title": "Tech Meetup",
  "datetime": "2025-11-01T18:00:00Z",
  "location": "Mumbai",
  "capacity": 50
}
```

### Susscess Response

```josn
{
    "message": "Event created successfully",
    "event": {
        "id": 1,
        "title": "Tech Meetup",
        "datetime": "2025-10-01T12:30:00.000Z",
        "location": "Mumbai",
        "capacity": 50
    }
}
```

### Register User for an Event

`POST /api/events/1/register`

```json
{
  "userId": 1
}
```

### Susscess Response

```josn
{
    "message": "User registered successfully"
}
```

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

Copyright (c) 2025 Shubham
