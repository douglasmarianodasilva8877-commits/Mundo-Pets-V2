import { describe, it, expect, beforeAll } from "vitest";
import { createServer } from "node:http";
import fetch from "node-fetch";

let base = "[http://localhost:3000](http://localhost:3000)";

describe("Comments API", () => {
beforeAll(() => {
process.env.JWT_SECRET = "test_secret";
});

it("should create a comment", async () => {
const res = await fetch(`${base}/api/comments`, {
method: "POST",
body: JSON.stringify({
postId: "post_1",
petId: "pet_1",
content: "Comentário de teste",
}),
headers: { "Content-Type": "application/json" },
});

```
const json = await res.json();
expect(json.success).toBe(true);
expect(json.comment.content).toBe("Comentário de teste");
```

});

it("should list comments of a post", async () => {
const res = await fetch(`${base}/api/comments?postId=post_1`);

```
const json = await res.json();
expect(json.success).toBe(true);
expect(Array.isArray(json.comments)).toBe(true);
```

});

it("should delete a comment", async () => {
const res = await fetch(`${base}/api/comments/comment_1`, {
method: "DELETE",
});

```
const json = await res.json();
expect(json.success).toBe(true);
```

});
});
