// netlify/functions/ghl-form.js

export async function handler(event) {
    // Only allow POST from your form
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Method Not Allowed",
      };
    }
  
    // GHL Inbound Webhook URL
    const GHL_WEBHOOK_URL =
      "https://services.leadconnectorhq.com/hooks/d31VoHRqFQkp8xwPkN21/webhook-trigger/7ae7c4be-35da-4de9-988e-55f352b36d1d";
  
    // Parse form-urlencoded body from the HTML form
    const params = new URLSearchParams(event.body);
    const data = Object.fromEntries(params.entries());
  
    try {
      // Forward to GHL as JSON
      const res = await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      const text = await res.text();
  
      // Optional: basic logging for Netlify function logs
      console.log("Sent to GHL:", data);
      console.log("GHL status:", res.status);
      console.log("GHL response:", text);
  
      return {
        statusCode: res.ok ? 200 : 500,
        body: res.ok ? "OK" : `Error sending to GHL: ${text}`,
      };
    } catch (e) {
      console.error("Server error calling GHL:", e);
      return {
        statusCode: 500,
        body: "Server error",
      };
    }
  }
  