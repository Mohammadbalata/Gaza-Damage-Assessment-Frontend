# API Reference

All API routes are defined in `routes/api.php`. Base URL: `/api`

## Authentication

All authenticated endpoints require Sanctum token-based authentication.

**Header:**

```
Authorization: Bearer <sanctum_token>
```

**Standard Response Envelope:**

```json
{
  "status": true,
  "code": 200,
  "message": "Success message",
  "data": { ... }
}
```

---

## 1. Citizen Authentication

### POST `/api/auth/login`

Login an existing citizen.

| Field         | Type   | Required | Validation |
| ------------- | ------ | -------- | ---------- |
| `national_id` | string | ✅       | —          |
| `password`    | string | ✅       | —          |

**Success Response (200):**

```json
{
  "status": true,
  "code": 200,
  "message": "Login successful",
  "data": {
    "citizen": { ... },
    "token": "1|abc123..."
  }
}
```

**Error Responses:** `401` (invalid credentials), `404` (citizen not found)

---

### POST `/api/auth/complete-signup`

Complete citizen registration after verification. **Unauthenticated.**

| Field                   | Type   | Required | Validation                  |
| ----------------------- | ------ | -------- | --------------------------- |
| `national_id`           | string | ✅       | exists:citizens,national_id |
| `full_name`             | string | ✅       | max:255                     |
| `phone_number`          | string | ✅       | unique:citizens, max:15     |
| `email`                 | string | ❌       | email, unique:citizens      |
| `whatsapp_number`       | string | ❌       | unique:citizens, max:15     |
| `password`              | string | ✅       | min:6, confirmed            |
| `password_confirmation` | string | ✅       | —                           |
| `avatar`                | file   | ❌       | image, max:2048             |

**Success Response (201):**

```json
{
  "status": true,
  "code": 201,
  "message": "Signup completed",
  "data": {
    "citizen": { ... },
    "token": "1|abc123..."
  }
}
```

---

### POST `/api/auth/logout`

Revoke the current Sanctum token. **Requires auth.**

**Success Response (200):**

```json
{
    "status": true,
    "code": 200,
    "message": "Logged out successfully"
}
```

---

## 2. Citizen Verification

### POST `/api/auth/verification/national-id`

Verify a citizen's national ID against the civil registry. **Unauthenticated.**

| Field         | Type   | Required | Validation |
| ------------- | ------ | -------- | ---------- |
| `national_id` | string | ✅       | —          |

**Logic:** Looks up `civil_registry` table by `national_id`. If found, upserts a `citizens` record and returns generated security questions.

**Success Response (200):**

```json
{
  "status": true,
  "code": 200,
  "message": "National ID verified",
  "data": {
    "citizen": { ... },
    "questions": [
      {
        "question": "What is your father's name?",
        "options": ["Option A", "Option B", "Option C", "Option D"]
      }
    ]
  }
}
```

---

### POST `/api/auth/verification/security-questions`

Validate answers to security questions. **Unauthenticated.**

| Field                    | Type   | Required | Validation |
| ------------------------ | ------ | -------- | ---------- |
| `national_id`            | string | ✅       | —          |
| `answers`                | array  | ✅       | —          |
| `answers.*.question_key` | string | ✅       | —          |
| `answers.*.answer`       | string | ✅       | —          |

**Success Response (200):**

```json
{
  "status": true,
  "code": 200,
  "message": "Verification successful",
  "data": {
    "citizen": { ... },
    "verification_complete": true
  }
}
```

---

## 3. Citizen Profile

> All profile endpoints require `auth:sanctum` middleware.

### GET `/api/me`

Get the authenticated citizen's profile.

**Success Response (200):**

```json
{
  "status": true,
  "code": 200,
  "message": "Profile retrieved",
  "data": { "citizen": { ... } }
}
```

---

### PUT `/api/me`

Update the authenticated citizen's profile.

| Field                   | Type    | Required | Validation                         |
| ----------------------- | ------- | -------- | ---------------------------------- |
| `full_name`             | string  | ❌       | max:255                            |
| `phone_number`          | string  | ❌       | unique:citizens, max:15            |
| `email`                 | string  | ❌       | email, unique:citizens             |
| `whatsapp_number`       | string  | ❌       | unique:citizens, max:15            |
| `avatar`                | file    | ❌       | image, max:2048                    |
| `mother_name`           | string  | ❌       | max:255                            |
| `family_members_number` | integer | ❌       | min:1                              |
| `place_of_birth`        | string  | ❌       | max:255                            |
| `country`               | string  | ❌       | max:255                            |
| `date_of_birth`         | date    | ❌       | before:today                       |
| `gender`                | string  | ❌       | in:MALE,FEMALE                     |
| `marital_status`        | string  | ❌       | in:SINGLE,MARRIED,DIVORCED,WIDOWED |

---

### PUT `/api/current-location`

Update the citizen's current location.

body request : 
```json
{
    "governorate_id":1,
    "municipality_id":5,
    "neighborhood_id":21,
    "landmark_id":45,
    "longitude":"34.4668",
    "latitude": "31.5017",
    "address":"the address ... in Palestine",
    "street": "شارع الهلال",
    "house_number": "23446"
}
```

| Field             | Type    | Required | Validation              |
| ----------------- | ------- | -------- | ----------------------- |
| `latitude`        | numeric | ✅       | between:-90,90          |
| `longitude`       | numeric | ✅       | between:-180,180        |
| `address`         | string  | ❌       | max:255                 |
| `neighborhood_id` | integer | ❌       | exists:neighborhoods,id |

---

## 4. Damage Reports

> All damage report endpoints require `auth:sanctum` middleware.

### GET `/api/damage-reports`

List the authenticated citizen's damage reports.

**Success Response (200):**

```json
{
  "status": true,
  "code": 200,
  "message": "Reports retrieved",
  "data": [
    {
      "id": 1,
      "report_code": "DR-ABC123",
      "status": "SUBMITTED",
      "latitude": 31.5204,
      "longitude": 34.4667,
      ...
    }
  ]
}
```

---

### POST `/api/damage-reports`

Create a new damage report.

| Field                  | Type    | Required | Validation              |
| ---------------------- | ------- | -------- | ----------------------- |
| `latitude`             | numeric | ✅       | between:-90,90          |
| `longitude`            | numeric | ✅       | between:-180,180        |
| `governorate_id`       | integer | ✅       | exists:governorates,id  |
| `municipality_id`      | integer | ✅       | exists:municipalities,id|
| `neighborhood_id`      | integer | ✅       | exists:neighborhoods,id |
| `landmark_id`          | integer | ✅       | exists:landmarks,id     |
| `address`              | string  | ❌       | max:255                 |
| `landmark`             | string  | ❌       | max:255                 |
| `description`          | string  | ❌       | max:1000                |
| `initial_damage_level` | string  | ❌       | —                       |
| `damage_details`       | json    | ❌       | —                       |
| `images[]`             | file(s) | ❌       | image, max:5120 each    |

**Logic:**

1. Wraps in DB transaction
2. Generates unique `report_code` (e.g., `DR-ABC123`)
3. Creates `DamageReport` record
4. Stores each image as `DamageAttachment` record
5. Returns 201

---

### PUT `/api/damage-reports/{id}`

Update an existing damage report.

| Field                  | Type       | Required | Validation                   |
| ---------------------- | ---------- | -------- | ---------------------------- |
| `latitude`             | numeric    | ❌       | between:-90,90               |
| `longitude`            | numeric    | ❌       | between:-180,180             |
| `neighborhood_id`      | integer    | ❌       | exists:neighborhoods,id      |
| `address`              | string     | ❌       | max:255                      |
| `landmark`             | string     | ❌       | max:255                      |
| `description`          | string     | ❌       | max:1000                     |
| `initial_damage_level` | string     | ❌       | —                            |
| `damage_details`       | json       | ❌       | —                            |
| `images[]`             | file(s)    | ❌       | image, max:5120 each         |
| `remove_images[]`      | integer(s) | ❌       | IDs of attachments to delete |

---

### GET `/api/track/{reportCode}`

Track a damage report by its code. **Public — no auth required.**

| Param        | Type         | Description                            |
| ------------ | ------------ | -------------------------------------- |
| `reportCode` | string (URL) | Unique report code (e.g., `DR-ABC123`) |

**Success Response (200):**

```json
{
  "status": true,
  "code": 200,
  "message": "Report found",
  "data": {
    "report_code": "DR-ABC123",
    "status": "IN_PROGRESS",
    ...
  }
}
```

---

### GET `/api/locations/governorates`
**Success Response (200):**

```json
{
    "status": true,
    "code": 200,
    "message": "Governorates retrieved successfully",
    "governorates": [
        {
            "id": 1,
            "name": "﻿شمال غزة",
            "latitude": "31.5440960",
            "longitude": "34.5094170"
        },
        {
            "id": 2,
            "name": "غزة",
            "latitude": "31.4882980",
            "longitude": "34.4456630"
        },
        {
            "id": 3,
            "name": "دير البلح",
            "latitude": "31.4206310",
            "longitude": "34.3713490"
        },
        {
            "id": 4,
            "name": "خان يونس",
            "latitude": "31.3359630",
            "longitude": "34.3188150"
        },
        {
            "id": 5,
            "name": "رفح",
            "latitude": "31.2828490",
            "longitude": "34.2712290"
        }
    ]
}
```
---

### GET `/api/locations/municipalities`
body request

```json
{
    "governorate_id": 1
}
```

**Success Response (200):**

```json
{
    "status": true,
    "code": 200,
    "message": "Municipalities retrieved successfully",
    "municipalities": [
        {
            "id": 5,
            "name": "أم النصر",
            "latitude": "31.5589480",
            "longitude": "34.5177220"
        },
        {
            "id": 6,
            "name": "بيت لاهيا",
            "latitude": "31.5616720",
            "longitude": "34.4935560"
        },
        {
            "id": 7,
            "name": "بيت حانون",
            "latitude": "31.5340350",
            "longitude": "34.5404400"
        },
        {
            "id": 8,
            "name": "جباليا",
            "latitude": "31.5273370",
            "longitude": "34.4948120"
        }
    ]
}
```
---

### GET `/api/locations/neighborhoods`
body request

```json
{
    "municipality_id": 5
}
```

**Success Response (200):**

```json
{
    "status": true,
    "code": 200,
    "message": "Neighborhoods retrieved successfully",
    "neighborhoods": [
        {
            "id": 21,
            "name": "القرية الأولى",
            "latitude": "31.5572430",
            "longitude": "34.5177360"
        },
        {
            "id": 22,
            "name": "القرية الثانية",
            "latitude": "31.5629360",
            "longitude": "34.5173580"
        },
        {
            "id": 185,
            "name": "الأبراج",
            "latitude": "31.5538830",
            "longitude": "34.5199640"
        }
    ]
}
```
---

### GET `/api/locations/landmarks`
body request

```json
{
    "neighborhood_id": 21
}
```

**Success Response (200):**

```json
{
    "status": true,
    "code": 200,
    "message": "Landmarks retrieved successfully",
    "landmarks": [
        {
            "id": 45,
            "name": "بلدية أم النصر",
            "latitude": "31.5557610",
            "longitude": "34.5183600"
        }
    ]
}
```
---


## 5. Route Summary Table

| Method | URI                                         | Controller                                              | Auth | Description               |
| ------ | ------------------------------------------- | ------------------------------------------------------- | ---- | ------------------------- |
| `POST` | `/api/auth/login`                           | `AuthController@login`                                  | ❌   | Citizen login             |
| `POST` | `/api/auth/complete-signup`                 | `AuthController@completeSignup`                         | ❌   | Complete registration     |
| `POST` | `/api/auth/logout`                          | `AuthController@logout`                                 | ✅   | Revoke token              |
| `POST` | `/api/auth/verification/national-id`        | `CitizenVerificationController@verifyNationalId`        | ❌   | Verify national ID        |
| `POST` | `/api/auth/verification/security-questions` | `CitizenVerificationController@verifySecurityQuestions` | ❌   | Answer security questions |
| `GET`  | `/api/me`                                   | `CitizenProfileController@show`                         | ✅   | Get profile               |
| `PUT`  | `/api/me`                                   | `CitizenProfileController@update`                       | ✅   | Update profile            |
| `PUT`  | `/api/current-location`                     | `CitizenProfileController@updateCurrentLocation`        | ✅   | Update location           |
| `GET`  | `/api/damage-reports`                       | `DamageReportController@index`                          | ✅   | List user's reports       |
| `POST` | `/api/damage-reports`                       | `DamageReportController@store`                          | ✅   | Create report             |
| `PUT`  | `/api/damage-reports/{id}`                  | `DamageReportController@update`                         | ✅   | Update report             |
| `GET`  | `/api/track/{reportCode}`                   | `DamageReportController@track`                          | ❌   | Public report tracking    |



