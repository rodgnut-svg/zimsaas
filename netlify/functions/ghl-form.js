export async function handler(event) {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: "Method Not Allowed",
      };
    }
  
    const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/d31VoHRqFQkp8xwPkN21/webhook-trigger/7ae7c4be-35da-4de9-988e-55f352b36d1d";
  
    const params = new URLSearchParams(event.body);
    const data = Object.fromEntries(params.entries());
  
    try {
      const res = await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      return {
        statusCode: res.ok ? 200 : 500,
        body: res.ok ? "OK" : "Error sending to GHL",
      };
    } catch (e) {
      return {
        statusCode: 500,
        body: "Server error",
      };
    }
  }
  