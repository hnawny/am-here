
export default async function callback(req, res) {
    const { code, state } = req.query;

    if (!code || !state) {
        return res.status(400).json({ error: 'Missing code or state' });
    }

    try {
        // Exchange the authorization code for an access token
        const response = await fetch('https://open-api.tiktok.com/oauth/access_token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_key: process.env.TIKTOK_CLIENT_KEY,
                client_secret: process.env.TIKTOK_CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
            }),
        });

        const data = await response.json();

        if (data.error) {
            return res.status(400).json({ error: data.error });
        }

        // Handle the access token and user information
        const { access_token, open_id } = data.data;

        // You can now use the access token to make authenticated requests to the TikTok API
        // and handle user information as needed.

        return res.status(200).json({ access_token, open_id });
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}