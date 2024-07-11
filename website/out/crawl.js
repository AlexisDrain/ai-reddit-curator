let client_id = process.env['REDDIT_CLIENTID'];
let reddit_secret = process.env['REDDIT_SECRET'];
export async function get_headers_with_access_token() {
    const credentials = btoa(`${client_id}:${reddit_secret}`);
    try {
        const response = await fetch("https://www.reddit.com/api/v1/access_token", {
            headers: {
                'Authorization': `Basic ${credentials}`
            }
        });
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    }
}
;
