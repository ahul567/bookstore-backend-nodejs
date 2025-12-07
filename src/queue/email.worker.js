import emailQueue from "./email.queue.js";
import { transporter } from "../config/emailTransporter.js";

emailQueue.process(async (job) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: job.data.to,
    subject: job.data.subject,
    text: job.data.text
  });

  console.log("Email sent to:", job.data.to);
});
