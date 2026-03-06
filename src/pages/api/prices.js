export const POST = async ({ request, locals }) => {
    const kv = locals.runtime.env.PRICES_KV;
    const body = await request.json();
    const pin = request.headers.get('Authorization');

    // SPRAWDŹ TĘ LINIĘ:
    if (pin !== "1234") {
        return new Response("Unauthorized", { status: 401 });
    }

    await kv.put('current_prices', JSON.stringify(body));
    return new Response(JSON.stringify({ success: true }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};