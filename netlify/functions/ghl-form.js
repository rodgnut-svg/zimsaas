// netlify/functions/ghl-form.js

export async function handler(event) {
    // 1) Only allow POST from your form
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: {
          "Content-Type": "text/plain",
        },
        body: "ONLY POST ALLOWED",
      };
    }
  
    // 2) GHL Inbound Webhook URL
    const GHL_WEBHOOK_URL =
      "https://services.leadconnectorhq.com/hooks/d31VoHRqFQkp8xwPkN21/webhook-trigger/7ae7c4be-35da-4de9-988e-55f352b36d1d";
  
    // 3) Parse form-urlencoded body from the HTML form
    const params = new URLSearchParams(event.body);
    const data = Object.fromEntries(params.entries());
  
    try {
      // 4) Forward to GHL as JSON
      const res = await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      const text = await res.text();
  
      // Logging for Netlify function logs
      console.log("Sent to GHL:", data);
      console.log("GHL status:", res.status);
      console.log("GHL response:", text);
  
      // 5) On success, redirect to thank-you page
      if (res.ok) {
        return {
          statusCode: 302,
          headers: {
            Location: "/thank-you.html",
          },
        };
      }
  
      // 6) If GHL returns non-2xx, surface that as 500
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "text/plain",
        },
        body: `Error sending to GHL: ${text}`,
      };
    } catch (e) {
      console.error("Server error calling GHL:", e);
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "text/plain",
        },
        body: "Server error",
      };
    }
  }
  