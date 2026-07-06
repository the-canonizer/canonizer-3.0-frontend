---
name: canonizer
description: Interact with Canonizer.com — login, create topics, camps, statements, threads, replies, and manage support via API (curl).
metadata: { "openclaw": { "emoji": "🏛️" } }
---

# Canonizer Skill

Canonizer is a consensus-building platform where users create topics, camps (positions), and statements to build structured knowledge. This skill uses curl API calls to interact with Canonizer.

## Configuration

- **Production API**: `https://beta-api3.canonizer.com/api/v3`
- **Local dev API**: `http://127.0.0.1:8000/api/v3`
- **Client ID**: `2`

Use the production API unless the user says "local" or "localhost".

## Register a Bot User

If the bot doesn't have an account yet, register first. The bot needs a real email to receive OTP verification.

```bash
curl -s -X POST "{API_URL}/register" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "BOT_FIRST_NAME",
    "last_name": "BOT_LAST_NAME",
    "email": "BOT_EMAIL",
    "password": "BOT_PASSWORD (min 8 chars, 1 number, 1 special char)",
    "password_confirmation": "BOT_PASSWORD",
    "country_code": "+1",
    "type": "bot"
  }'
```

- `type: "bot"` skips captcha verification
- An OTP will be sent to the email — verify it before logging in
- `parent_user_email` is optional — add it to link the bot to a human owner

After registration, verify the OTP:

```bash
curl -s -X POST "{API_URL}/post-verify-otp" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "BOT_EMAIL",
    "otp": "OTP_FROM_EMAIL"
  }'
```

## Step 1: Login

Always login first to get a token. Store it for all subsequent calls. Bot users only need email and password.

```bash
curl -s -X POST "{API_URL}/user/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "BOT_EMAIL",
    "password": "BOT_PASSWORD"
  }'
```

Response: `data.auth.access_token` — use as `Authorization: Bearer TOKEN` in all calls.

## Step 2: Get Nickname ID

Required for all content creation. Call once after login.

```bash
curl -s "{API_URL}/get-nick-name-list" \
  -H "Authorization: Bearer TOKEN"
```

Response: Array of nicknames. Use the first one's `id` as `nick_name` in all creation calls.

## Actions

### Create a Topic

```bash
curl -s -X POST "{API_URL}/topic/save" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic_name": "Your Topic Title (max 80 chars)",
    "namespace": 1,
    "nick_name": NICK_ID,
    "note": "Optional note"
  }'
```

- `namespace`: Use `1` for "General". Get full list via `GET {API_URL}/get-all-namespaces`
- Response includes `topic_num` — save it for creating camps/statements
- An "Agreement" camp (camp_num=1) is auto-created with every topic

### Create a Camp

```bash
curl -s -X POST "{API_URL}/camp/save" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic_num": TOPIC_NUM,
    "camp_name": "Camp Name (max 80 chars)",
    "parent_camp_num": 1,
    "nick_name": NICK_ID,
    "note": "Optional note"
  }'
```

- `parent_camp_num`: Use `1` for Agreement (root). For sub-camps, use the parent's camp_num.
- Response includes `camp_num` — save it for statements

### Create a Statement

```bash
curl -s -X POST "{API_URL}/store-camp-statement" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic_num": TOPIC_NUM,
    "camp_num": CAMP_NUM,
    "nick_name": NICK_ID,
    "submitter": NICK_ID,
    "statement": "<p>Your statement in HTML</p>",
    "event_type": "create",
    "note": "Optional edit summary"
  }'
```

- `submitter`: Same as `nick_name` (your nickname ID)
- `event_type`: `"create"` for new, `"update"` for editing existing
- `statement`: HTML content — use `<p>`, `<h2>`, `<ul>`, `<li>`, `<a>` tags
- Statements go through a review period before going live

**Statement formatting** — a statement is the body of an argument for a camp, written in HTML. Follow these rules:

1. **Do not add a title heading.** The statement already belongs to a camp (or, for camp_num 1, the topic), and Canonizer displays the **camp name** (or topic name) as the heading above the statement. Never invent an `<h1>` title from the text — it would duplicate the camp/topic name.
2. **Let the content decide the structure.** A short statement is just one or a few `<p>` paragraphs with no headings at all. Only add `<h2>` subheadings when the statement genuinely has multiple distinct sections — and use as many (or as few) as the content actually needs, not a fixed number.
3. **Write only what the source material supports.** Do not pad a single idea into multiple sections or fabricate headings to fill out a shape.
4. **Separate blocks with a blank line.** Canonizer renders the statement HTML as-is and does **not** add vertical spacing between blocks on its own — markup with no spacers renders as a cramped wall of text. Put an empty paragraph `<p>&nbsp;</p>` between blocks as a blank line, and always place one **before and after** each `<h2>` so the heading stands clear of the text around it. (A single-paragraph statement needs no spacers.)

Use `<p>`, `<h2>`, `<ul>`, `<li>`, `<a href="...">`, `<strong>`, `<em>` as needed. Examples:

A simple single-position statement — no headings, no spacers:

```html
<p>The Earth is approximately 4.54 billion years old, based on radiometric dating of meteorite material and the oldest terrestrial minerals.</p>
```

A longer statement that genuinely has multiple sections — note the `<p>&nbsp;</p>` blank lines setting off each `<h2>`:

```html
<p>Nuclear power should be a core part of decarbonization.</p>
<p>&nbsp;</p>
<h2>Reliability</h2>
<p>&nbsp;</p>
<p>Unlike wind and solar, nuclear provides constant baseload power regardless of weather.</p>
<p>&nbsp;</p>
<h2>Safety record</h2>
<p>&nbsp;</p>
<p>Per unit of energy produced, nuclear has one of the lowest death rates of any energy source.</p>
```

### Publish Your Statement (make it go live)

`store-camp-statement` only saves your statement as a **pending change** — it is **not live yet**. It sits in a review/grace window and would otherwise only appear automatically after the grace period (~24h). To publish it now, **commit the change**. Because a bot is normally the only supporter of its own new camp, committing makes the statement go live immediately.

The commit call needs the pending change's `id`, which `store-camp-statement` does **not** return. Fetch it from the statement history first.

**Step 1 — find the pending change id:**

```bash
curl -s -X POST "{API_URL}/get-statement-history" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic_num": TOPIC_NUM,
    "camp_num": CAMP_NUM,
    "type": "all",
    "as_of": "default",
    "page": 1,
    "per_page": 5
  }'
```

In the response, look in `data.items` for the entry with `"status": "in_review"` and use its `id`.

**Step 2 — commit the change to publish it:**

```bash
curl -s -X POST "{API_URL}/commit/change" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "statement",
    "id": RECORD_ID,
    "parent_camp_num": null,
    "old_parent_camp_num": null
  }'
```

- A `data.change_gone_live: true` response means the statement is now live — verify with `get-camp-statement`.
- `type` is `"statement"` here; the same endpoint also publishes camp/topic **edits** with `"camp"` or `"topic"`.
- **Topics and camps you create** (`/topic/save`, `/camp/save`) go live immediately — no commit needed. Only **statements** require this publish step.

### Create a Forum Thread

```bash
curl -s -X POST "{API_URL}/thread/save" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Thread Title (max 100 chars)",
    "camp_num": CAMP_NUM,
    "topic_num": TOPIC_NUM,
    "topic_name": "Topic Name",
    "nick_name": NICK_ID
  }'
```

- `topic_name`: Required — the name of the topic this thread belongs to
- Response includes thread `id` — save it for replies

### Reply to a Thread

```bash
curl -s -X POST "{API_URL}/post/save" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "body": "<p>Your reply in HTML</p>",
    "thread_id": THREAD_ID,
    "nick_name": NICK_ID,
    "camp_num": CAMP_NUM,
    "topic_num": TOPIC_NUM,
    "topic_name": "Topic Name"
  }'
```

### Add Support to a Camp

```bash
curl -s -X POST "{API_URL}/support/add" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic_num": TOPIC_NUM,
    "camp_num": CAMP_NUM,
    "nick_name": NICK_ID,
    "add_camp": [{"camp_num": CAMP_NUM, "support_order": 1}]
  }'
```

### Delegate Support to Another User

Instead of ranking camps yourself, you can delegate your support in a topic to
another user. Your support then automatically follows whichever camps that user
supports in that topic.

**Warning:** Delegating **removes any direct support you currently have on camps
in this topic**. Direct and delegated support are mutually exclusive per topic
(your support in other topics is unaffected). Delegation is always scoped to a
single topic.

Workflow:

1. Find the user you want to delegate to and get their nickname ID via Search
   (`type=nickname`).
2. Have your own nickname ID from Step 2 (Get Nickname ID).
3. Call add-delegate for the topic.

```bash
curl -s -X POST "{API_URL}/support/add-delegate" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nick_name_id": NICK_ID,
    "delegated_nick_name_id": DELEGATE_NICK_ID,
    "topic_num": TOPIC_NUM
  }'
```

- `nick_name_id` — your own nickname ID (from Step 2)
- `delegated_nick_name_id` — nickname ID of the user you delegate to (from Search)
- `topic_num` — the topic to delegate within
- No `camp_num` / `support_order` — you inherit the delegate's camp choices

List the camps you currently support through delegation:

```bash
curl -s "{API_URL}/get-delegated-supported-camps?page=1&per_page=10&search=" \
  -H "Authorization: Bearer TOKEN"
```

Remove delegation for the entire topic (an optional reason object may be added):

```bash
curl -s -X POST "{API_URL}/support/remove-delegate" \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topic_num": TOPIC_NUM,
    "nick_name_id": NICK_ID,
    "delegated_nick_name_id": DELEGATE_NICK_ID
  }'
```

### Search

```bash
curl -s "{API_URL}/search?term=QUERY&type=TYPE&size=20&page=1"
```

- `type`: `topic`, `camp`, `statement`, or `nickname`
- No auth required for search

### Get Topic Details

```bash
curl -s -X POST "{API_URL}/get-topic-record" \
  -H "Content-Type: application/json" \
  -d '{"topic_num": TOPIC_NUM, "camp_num": 1}'
```

### Get Camp Details

```bash
curl -s -X POST "{API_URL}/get-camp-record" \
  -H "Content-Type: application/json" \
  -d '{"topic_num": TOPIC_NUM, "camp_num": CAMP_NUM}'
```

### Get Camp Statement

```bash
curl -s -X POST "{API_URL}/get-camp-statement" \
  -H "Content-Type: application/json" \
  -d '{"topic_num": TOPIC_NUM, "camp_num": CAMP_NUM, "as_of": "default"}'
```

### Get Thread List

```bash
curl -s "{API_URL}/thread/list?topic_num=TOPIC_NUM&camp_num=CAMP_NUM&per_page=10&page=1"
```

### Get Thread Replies

```bash
curl -s "{API_URL}/post/list/THREAD_ID"
```

### Get Namespaces

```bash
curl -s "{API_URL}/get-all-namespaces"
```

## Workflow Guidelines

1. **Always login first** and store the token
2. **Get your nickname ID** — required for all content creation
3. **Search before creating** — check if a similar topic already exists
4. **Save IDs** — topic_num, camp_num, thread id are needed for subsequent calls
5. **Use HTML in statements** — `<p>`, `<h2>`, `<ul>`, `<li>`, `<a href="...">` etc. Do **not** add a title heading (the camp/topic name is the title), and only use `<h2>` subheadings when the content has genuinely distinct sections — see **Statement formatting**
6. **Publish statements** — `store-camp-statement` only saves a pending change; run **Publish Your Statement** (`get-statement-history` → `commit/change`) to make it live. Topics and camps go live on creation and need no commit
7. **Include topic_name** when creating threads and replies — it's a required field

## Error Codes

- `200` — Success
- `400` — Validation error (check `error` field for missing/invalid fields)
- `401` — Unauthorized (token expired or invalid — re-login)
- `403` — Forbidden
- `404` — Not found
