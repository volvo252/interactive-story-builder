# API Design
This document describes the current REST API decisions for the story editor.

## Response Format
Successful responses use:
{
  "data": {}
}
Error responses use:
{
  "error": {
    "message": "Story not found"
  }
}

## Stories
GET /api/stories/:id
- 200 data
- 400 invalid id
- 404 not found
- 500 internal server error

POST /api/stories
- 201 created
- 400 invalid payload
- 409 already exists
- 500 internal server error

PATCH /api/stories/:id
- 200 data
- 400 invalid id / invalid payload
- 404 not found
- 500 internal server error

DELETE /api/stories/:id
- 200 deleted
- 400 invalid id
- 404 not found
- 500 internal server error


Decisions
- Story, scene, and choice ids are generated on the client as UUIDs.
- POST /api/stories creates the first persisted version of a story.
- PATCH /api/stories/:id updates an already persisted story.
- API responses use a consistent { data } or { error: { message } } shape.
- DELETE returns 200 with a JSON body instead of 204 to make API testing easier during this learning stage.