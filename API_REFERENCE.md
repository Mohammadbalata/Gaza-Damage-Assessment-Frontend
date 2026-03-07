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
| `neighborhood_id`      | integer | ✅       | exists:neighborhoods,id |
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
