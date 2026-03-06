export const POST = async ({ request, locals }) => {
    // 1. Wyciągamy bazę z locals (standard dla Astro + Cloudflare Pages)
    const env = locals.runtime.env;
    const kv = env.PRICES_KV;
    
    const body = await request.json();
    const pin = request.headers.get('Authorization');

    // 2. Sprawdzenie PINu
    if (pin !== "1234") {
        return new Response(JSON.stringify({ error: "Zły PIN" }), { status: 401 });
    }

    // 3. Zapis do bazy
    try {
        await kv.put('current_prices', JSON.stringify(body));
        return new Response(JSON.stringify({ success: true }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        // Jeśli tu wejdzie, to znaczy że Binding PRICES_KV nie działa
        return new Response(JSON.stringify({ error: "Błąd bazy: " + err.message }), { status: 500 });
    }
};