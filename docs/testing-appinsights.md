# How to Test Application Insights Integration

Follow these steps to verify that Application Insights is working in this project:

---

## 1. Set Your Application Insights Key

In your terminal, set the connection string or instrumentation key (replace with your real value):

```
export APPINSIGHTS_CONNECTION_STRING="InstrumentationKey=YOUR_KEY_HERE"
```

or

```
export APPINSIGHTS_INSTRUMENTATIONKEY="YOUR_KEY_HERE"
```

---

## 2. Build and Start the App

```
npm run build
npm start
```

Or for development mode:

```
npm run start:dev
```

---

## 3. Trigger Some Activity

- Open the app in your browser (http://localhost:PORT)
- Click around, log in, or perform actions that generate logs and requests

---

## 4. Check Application Insights in Azure Portal

- Go to your Application Insights resource in the Azure Portal
- Use **Live Metrics Stream** to see real-time requests and logs
- Use **Logs** (KQL) to query for recent traces, requests, and exceptions:

Example queries:

```
traces | order by timestamp desc
requests | order by timestamp desc
exceptions | order by timestamp desc
```

---

## 5. (Optional) Test Log Forwarding

Add this to any server file and trigger it:

```typescript
import logger from './logger'
logger.info('Test log for Application Insights')
```

Look for this message in the `traces` table in Application Insights.

---

## 6. Troubleshooting

- If you don't see data, double-check your connection string/key
- Make sure you restarted the app after setting the environment variable
- Check the Azure Portal for ingestion delays (can take a few minutes)

---

**That's it!**

If you have questions, ask a team member or check the README for more info.

