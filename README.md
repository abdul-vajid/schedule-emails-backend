# **Technical Assignment - Backend Developer**

This repository contains APIs built using Node.js, MongoDB, Nodemailer, and Node-Scheduler. The API enables email scheduling and management, allowing users to effortlessly schedule, reschedule, list, update, and delete email sending tasks.

**The following tools were utilized for the project:**

- Backend Framework: Node.js
- Database: MongoDB
- Email Provider: Nodemailer
- libraries: Node-Scheduler, Mongoose, Morgan, Helmet, and Joi


## API Reference

#### Schedule an email

```http
  POST /api/v1/emails
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `toEmail` | `string` | **Required**. Recipient's email address |
| `subject` | `string` | **Required**. Email subject. Max length: 75 characters. |
| `text` | `string` | **Required**. Email content |
| `scheduledAt` | `string` | **Required**. Scheduled sending date in ISO format. |

#### Get all Scheduled emails

```http
  GET /api/v1/emails
```

|  Query Parameters | Description                       |
| :-------- | :-------------------------------- |
| `search`      |  **Optional**. For searching by email Ids. |
| `sort`      |  **Optional**. Sorting order for emails ("latest" by default) |
| `filter`      |  **Optional**. Filter criteria for emails ("all" by default). Possible values: "all", "sent", "pending", "failed". |
| `page`      |  **Optional**. Page number for paginated results (default: 1) |
| `limit`      |  **Optional**. Number of results per page (default: 10) |

#### Reschedule an email

```http
  PUT /api/v1/emails/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` (in URL) | `string` | **Required**. Document ID of the email to be rescheduled |
| `toEmail` | `string` | **Optional**. Recipient's email address |
| `subject` | `string` | **Optional**. Email subject. Max length: 75 characters. |
| `text` | `string` | **Optional**. Email content |
| `scheduledAt` | `string` | **Optional**. Scheduled sending date in ISO format. |

#### Get an email by Id

```http
  GET /api/v1/emails/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` (in URL) | `string` | **Required**. Document ID of the email to retrieve |

#### Delete an scheduled email

```http
  DELETE /api/v1/emails/:id
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` (in URL) | `string` | **Required**. Document ID of the email to retrieve |



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT` The port number that the server will listen on

`MONGO_URI`: The MongoDB connection string or URI that your application will use to connect to the database

`CLIENT_URL`: The URL of the client application that will communicate with the server. This is required for Cross-Origin Resource Sharing (CORS) settings.

`GMAIL_USERNAME`: The Gmail username or email address that will be used as the sender for sending emails using Nodemailer.

`GMAIL_SECURITY_PIN`: The application-specific password for the Gmail account. This is needed to authenticate the email sender using Nodemailer.

