import cron from "node-cron";
import User from "../models/User.js";
import emailQueue from "../queue/email.queue.js";

cron.schedule("0 0 1 * *", async () => {
  const authors = await User.find({ role: "author" });

  authors.forEach(author => {
    emailQueue.add({
      to: author.email,
      subject: "Monthly Revenue Report",
      text: `Your total revenue is ₹${author.revenue}`
    });
  });

  console.log("Monthly revenue emails queued.");
});
