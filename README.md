# Gmail Bulk Cleanup – Google Apps Script

A Google Apps Script project that uses the Gmail API to automate bulk deletion of Gmail messages.

> ⚠️ **WARNING:** This script is designed for permanent deletion of Gmail messages. Deleted messages may not be recoverable. Use it only when you are certain that the emails can be permanently removed.

---

## 📌 Project Overview

Managing a Gmail mailbox containing tens or hundreds of thousands of messages can make manual cleanup extremely time-consuming.

This project demonstrates how Google Apps Script and the Gmail API can be used to automate large-scale Gmail mailbox cleanup using batch processing.

The script:

- Retrieves Gmail messages through the Gmail API
- Processes messages in batches
- Permanently deletes messages
- Includes messages from Spam and Trash
- Automatically schedules another execution when additional messages remain
- Continues until no messages are returned by the Gmail API

---

## 🏗️ Architecture

```text
Google Gmail
     │
     ▼
Gmail API
     │
     ▼
Google Apps Script
     │
     ├── Retrieve messages
     │
     ├── Process batches
     │
     ├── Permanently delete messages
     │
     └── Schedule next execution
     │
     ▼
Empty Gmail Mailbox
