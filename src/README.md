How the Email Queue Works
Step 1 — Add email to Queue

Whenever a purchase occurs or a monthly report is generated:

emailQueue.add({
  to: author.email,
  subject: "...",
  text: "..."
});

Step 2 — Bull Queue Rate Limiting

Configured to send:

Max 100 emails per 60 seconds
const emailQueue = new Queue("emailQueue", {
  limiter: { max: 100, duration: 60000 }
});

Step 3 — Email Worker Processes Jobs

A separate worker handles sending:

emailQueue.process(async (job) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: job.data.to,
    subject: job.data.subject,
    text: job.data.text
  });
});

Step 4 — Monthly Revenue Email via Cron Job
cron.schedule("0 0 1 * *", async () => {
  // Sends monthly revenue summary to all authors
});

3. Database Design & Implementation Choices

Below is the reasoning behind the chosen MongoDB schema design.

### A. MongoDB was chosen because:

Flexible document structure

Easy to scale

Natural storage model for nested entities (authors, purchases)

Great match with Node.js event-driven architecture

### B. Three Main Collections
1. Users Collection

Fields:

name

email

password

role

revenue

Why this design?

✔ Storing revenue directly avoids expensive aggregation queries
✔ Multiple roles allow RBAC authorization
✔ Passwords hashed using bcrypt

2. Books Collection

Fields:

bookId

title (unique)

slug

price

authors[]

Why this design?

✔ Unique bookId allows clean readable URLs
✔ Slug allows SEO-friendly book URLs
✔ Supports multiple authors per book

3. Purchase Collection

Fields:

purchaseId (unique incremental format)

userId

bookId

quantity

price at purchase time

Why this design?

✔ PurchaseId format YYYY-MM-N is predictable
✔ Storing price ensures historical accuracy
✔ Decoupling purchases from books ensures no bloat in book document

### C. Purchase ID Generation Logic

Format:

{YEAR}-{MONTH}-{increment}
Example: 2025-01-3

Why?

✔ Ensures chronological tracking
✔ Avoids UUID randomness
✔ Human-readable

Implementation ensures:

No duplication

No gaps

Atomic increment using find().sort() with latest ID

4. Email Rate Limiting Explanation

To satisfy the requirement:

Only 100 emails can be sent per minute

Bull Queue's limiter property is used:

limiter: { max: 100, duration: 60000 }


This guarantees:

No more than 100 jobs processed in 60 seconds

Queue automatically delays excess jobs

Prevents email provider banning

5. Summary of Design Choices

✔ Dynamic sellCount → ensures accuracy
✔ Bull Queue → handles bulk email efficiently
✔ Redis → handles job persistence and queuing
✔ Mongoose → simple and robust ODM
✔ Cron Job → monthly emails automated
✔ Modular route/controller structure → scalable project

6. How to Run the Project
Install dependencies
npm install

Environment Variables

Create .env:

MONGO_URI=mongodb://127.0.0.1:27017/bookstore
JWT_SECRET=yourjwtsecret
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
REDIS_URL=redis://127.0.0.1:6379

Start server
npm run dev

Start email worker
npm run worker

 7. API Endpoints
Authentication

POST /auth/register

POST /auth/login

Books

POST /books/ (admin, author)

GET /books/

Purchase

POST /purchase/ (retail user)

GET /purchase/history