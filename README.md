# Experiment | Creating a Database with Google Sheets: Refhoster

Refhoster is an experiment. It’s a web app for sharing sources and references—especially in academic or educational work. Think of it like Linktree, but made for citations.
<br>

The twist? It uses Google Sheets and Google Apps Script as the backend. That’s right—Refhoster stores user link collections in spreadsheets and connects everything with Apps Script. It’s not built on a traditional database, because this project is testing the limits of what Google’s tools can do.
<br>

Google Apps Script isn’t made for production-grade web apps. It has strict limits: 2 million cells per sheet, up to 6 minutes per script run, and no more than 100 requests per minute. But within those bounds, it’s surprisingly capable for small-scale tools.
<br>

The frontend is hosted on Cloudflare Pages and runs lightweight JavaScript. The goal is to keep everything simple, serverless, and easy to deploy. Refhoster is not a finished product—it’s a proof of concept, a sandbox for seeing how far Apps Script can stretch.
<br>

<img src="https://raw.githubusercontent.com/linus-sch/refhoster/refs/heads/main/economics-refhoster.jpg" alt="Economics Refhoster" style="width: 100%;">
