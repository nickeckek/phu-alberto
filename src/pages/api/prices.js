export const GET = async ({ runtime, locals }) => {
    const kv = locals?.runtime?.env?.PRICES_KV || runtime?.env?.PRICES_KV;
    if (!kv) return new Response(JSON.stringify({ error: "Brak KV" }), { status: 500 });

    const data = await kv.get('current_prices');
    return new Response(data || JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};

export const POST = async ({ request, runtime, locals }) => {
    const kv = locals?.runtime?.env?.PRICES_KV || runtime?.env?.PRICES_KV;
    const pin = request.headers.get('Authorization');

    // Twój bezpieczny PIN (zmień jeśli chcesz)
    if (pin !== "1234") {
        return new Response(JSON.stringify({ error: "Zły PIN" }), { status: 401 });
    }

    try {
        const body = await request.json();
        // Zapisujemy cały obiekt produktów jako jeden string JSON
        await kv.put('current_prices', JSON.stringify(body));
        
        return new Response(JSON.stringify({ success: true }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};