export const POST = async ({ request, runtime, locals }) => {
    // Łapiemy bazę z podpiętego Bindingu
    const kv = locals?.runtime?.env?.PRICES_KV || runtime?.env?.PRICES_KV;
    const pin = request.headers.get('Authorization');

    if (pin !== "1234") {
        return new Response(JSON.stringify({ error: "Zły PIN" }), { status: 401 });
    }

    if (!kv) {
        return new Response(JSON.stringify({ error: "Błąd: Baza KV niepodpięta w panelu!" }), { status: 500 });
    }

    try {
        const body = await request.json();
        // FAKTYCZNY ZAPIS DO BAZY
        await kv.put('current_prices', JSON.stringify(body));
        
        return new Response(JSON.stringify({ success: true }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Błąd zapisu: " + err.message }), { status: 500 });
    }
};