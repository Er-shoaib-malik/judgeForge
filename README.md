# 🚀 Online Judge Backend

A scalable Online Judge Backend built using **Node.js**, **Express.js**, **MongoDB**, **Redis**, **BullMQ**, and **JWT Authentication**.

The system allows users to solve coding problems by submitting code, automatically compiles and executes the submission against predefined test cases, and returns the verdict asynchronously using a worker-based architecture.

This project follows a production-style architecture inspired by platforms like **LeetCode**, **HackerRank**, and **Codeforces**.

---

# 📌 Features

- User Authentication (JWT + Refresh Token)
- Role Based Authorization (User/Admin)
- Problem Management (CRUD)
- Test Case Management
- Code Submission
- Asynchronous Submission Processing
- BullMQ Queue
- Redis Queue Management
- Worker Process
- Automatic Compilation
- Automatic Execution
- Multiple Test Case Evaluation
- Verdict Generation
- Runtime Measurement
- Temporary Workspace Management
- Automatic Cleanup
- Error Handling
- Modular Architecture

---

# 🛠 Tech Stack

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## Authentication

- JWT
- bcrypt
- Cookies

## Queue

- Redis
- BullMQ

## Language Supported

- C++ (Current)

Upcoming

- Python
- Java

---

# 📂 Project Structure

```
src/
│
├── compiler/
│   ├── cpp/
│   │     ├── compilerCpp.js
│   │     └── runCpp.js
│   │
│   ├── python/
│   └── java/
│
├── controllers/
│
├── middleware/
│
├── models/
│
├── queue/
│
├── routes/
│
├── services/
│   └── execution.service.js
│
├── utils/
│   ├── fileManager.js
│   ├── ApiError.js
│   ├── ApiResponse.js
│   └── ExecutionError.js
│
├── workers/
│
└── temp/
```

---

# 🧠 System Architecture

```
                Client

                   │

                   ▼

          Express API Server

                   │

                   ▼

             MongoDB Database

                   │

                   ▼

          Create Submission

                   │

                   ▼

            BullMQ Queue

                   │

                   ▼

                Redis

                   │

                   ▼

          Worker Process

                   │

                   ▼

        Execution Service

                   │

     ┌─────────────┴─────────────┐
     │                           │

     ▼                           ▼

Compile Code               Fetch Test Cases

     │                           │

     └─────────────┬─────────────┘

                   ▼

          Execute Test Cases

                   │

                   ▼

          Compare Outputs

                   │

                   ▼

          Update Submission

                   │

                   ▼

             Return Verdict
```

---

# 🔄 Complete Submission Workflow

## Step 1

User submits code.

```
POST /api/v1/problems/:problemId/submit
```

---

## Step 2

Submission is stored inside MongoDB.

Initial status

```
PENDING
```

---

## Step 3

Submission ID is pushed into BullMQ.

```
Submission

↓

Queue

↓

Redis
```

---

## Step 4

Worker receives the job.

```
Redis

↓

Worker
```

---

## Step 5

Execution Service loads submission.

```
Submission

↓

Problem

↓

Test Cases
```

---

## Step 6

Temporary working directory is created.

Example

```
temp/

687ad92b/

```

---

## Step 7

Source code is written.

Example

```
main.cpp
```

---

## Step 8

Compiler compiles source code.

```
main.cpp

↓

g++

↓

main.exe
```

---

## Step 9

Each test case executes independently.

```
input.txt

↓

Program

↓

output.txt
```

---

## Step 10

Output is compared.

```
Program Output

↓

Expected Output

↓

Verdict
```

---

## Step 11

Submission document is updated.

Example

```
Accepted

Passed 10/10

Runtime 13ms
```

---

## Step 12

Temporary workspace is deleted.

```
temp/

↓

Deleted
```

---

# ⚙ Execution Pipeline

```
Submission

↓

Create Workspace

↓

Write Source Code

↓

Compile

↓

Write Input

↓

Run Program

↓

Read Output

↓

Compare Output

↓

Next Test Case

↓

Update Submission

↓

Delete Workspace
```

---

# 📄 Database Models

## User

```
fullName
username
email
password
avatar
role
refreshToken
```

---

## Problem

```
title
difficulty
statement
constraints
examples
timeLimit
memoryLimit
```

---

## TestCase

```
problemId
input
expectedOutput
hidden
```

---

## Submission

```
userId
problemId
language
code
status
runtime
memory
passedTestCases
totalTestCases
errorMessage
errorDetails
```

---

# 📊 Submission Status

```
PENDING

RUNNING

ACCEPTED

WRONG_ANSWER

COMPILATION_ERROR

RUNTIME_ERROR

TIME_LIMIT_EXCEEDED

MEMORY_LIMIT_EXCEEDED
```

---

# 📁 Temporary Workspace

Every submission receives a separate directory.

Example

```
temp/

6854bc92/

main.cpp

main.exe

input.txt

output.txt
```

This prevents multiple submissions from interfering with each other.

---

# 🔒 Authentication

Authentication uses

- JWT Access Token
- Refresh Token
- HTTP Only Cookies
- Secure Cookies

Middleware

```
verifyJWT
```

Admin Routes

```
isAdmin
```

---

# ⚡ Queue System

BullMQ is used for asynchronous execution.

Advantages

- Fast API response
- Background execution
- Scalable workers
- Retry support
- Better fault tolerance

Flow

```
Submission

↓

BullMQ

↓

Redis

↓

Worker
```

---

# 🖥 Compiler

Currently Supported

```
C++
```

Compilation

```
g++ main.cpp -o main.exe
```

Execution

```
main.exe < input.txt > output.txt
```

---

# 🧪 Test Case Evaluation

Every test case

```
Write Input

↓

Run Program

↓

Read Output

↓

Compare

↓

Next Test Case
```

If any comparison fails

```
WRONG_ANSWER
```

Otherwise

```
ACCEPTED
```

---

# ⏱ Runtime Calculation

Runtime is measured during execution.

```
Start Timer

↓

Run Program

↓

Stop Timer

↓

Store Runtime
```

---

# 🧹 Automatic Cleanup

Every submission creates temporary files.

After execution

```
Delete Working Directory
```

using

```
fs.rm()

recursive: true

force: true
```

---

# 🚀 API Endpoints

## Authentication

```
POST /register

POST /login

POST /logout

POST /refresh-token
```

---

## Problems

```
GET /problems

GET /problems/:id

POST /problems

PATCH /problems/:id

DELETE /problems/:id
```

---

## Test Cases

```
POST /problems/:problemId/testcases
```

---

## Submission

```
POST /problems/:problemId/submit
```

---

# 🔥 Future Improvements

- Docker Sandbox
- Python Support
- Java Support
- Memory Limit Enforcement
- Custom Judge
- Interactive Problems
- Contest System
- Leaderboard
- Submission History
- Rejudge Feature
- Plagiarism Detection
- WebSocket Live Verdicts
- Distributed Workers
- Kubernetes Deployment

---

# 🏗 Future Architecture

```
Client

↓

Express

↓

Redis Queue

↓

Worker

↓

Docker Container

↓

Compiler

↓

Judge

↓

MongoDB
```

---

# 📚 Learning Outcomes

This project demonstrates concepts including:

- REST API Design
- Authentication & Authorization
- MongoDB Data Modeling
- Queue Systems
- Background Workers
- Redis
- BullMQ
- File System Operations
- Child Processes
- Code Compilation
- Process Execution
- Error Handling
- Backend Architecture
- System Design
- Scalable Service Design

---

# 👨‍💻 Author

**Shoaib Malik**

Built as a production-oriented Online Judge backend to understand how coding platforms like **LeetCode**, **Codeforces**, and **HackerRank** process and evaluate programming submissions.