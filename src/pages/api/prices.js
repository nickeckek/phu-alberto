export const POST = async ({ request, locals, runtime }) => {
    // Próba złapania bazy z każdego możliwego miejsca w Pages
    const kv = locals?.runtime?.env?.PRICES_KV || runtime?.env?.PRICES_KV;
    
    const pin = request.headers.get('Authorization');
    
    // 1. Sprawdzenie czy baza w ogóle jest podpięta
    if (!kv) {
        return new Response(JSON.stringify({ 
            error: "Brak Bindingu PRICES_KV w panelu Cloudflare!" 
        }), { status: 500 });
    }

    // 2. Autoryzacja
    if (pin !== "1234") {
        return new Response(JSON.stringify({ error: "Zły PIN" }), { status: 401 });
    }

    try {
        const body = await request.json();
        await kv.put('current_prices', JSON.stringify(body));
        
        return new Response(JSON.stringify({ success: true }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Błąd zapisu: " + err.message }), { status: 500 });
    }
};