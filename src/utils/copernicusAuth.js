let cachedToken = null;
let tokenExpiry = null;

export async function getAccessToken() {
  if (cachedToken && tokenExpiry && Date.now() < tokenExpiry - 5 * 60 * 1000) {
    return cachedToken;
  }

  const clientId = import.meta.env.VITE_CDSE_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_CDSE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Copernicus credentials in .env file");
  }

  // Use the Vite proxy endpoint instead of direct call
  const response = await fetch("/api/copernicus-token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Authentication failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  if (!data.access_token) {
    throw new Error("No access token in response");
  }

  cachedToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;
  return cachedToken;
}