export const POST = async ({ request, locals, runtime }) => {
    // Próbujemy wyciągnąć bazę z 3 różnych miejsc (zależnie od wersji Astro/Adaptera)
    const kv = 
        (locals?.runtime?.env?.PRICES_KV) || 
        (runtime?.env?.PRICES_KV) || 
        (request?.env?.PRICES_KV);

    const pin = request.headers.get('Authorization');
    const body = await request.json();

    // 1. Sprawdzenie PINu (Zawsze najpierw!)
    if (pin !== "1234") {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    // 2. Sprawdzenie czy baza w ogóle istnieje w systemie
    if (!kv) {
        return new Response(JSON.stringify({ 
            error: "Błąd konfiguracji: Serwer nie widzi bazy PRICES_KV. Sprawdź Bindings w panelu Cloudflare!" 
        }), { status: 500 });
    }

    // 3. Próba zapisu
    try {
        await kv.put('current_prices', JSON.stringify(body));
        return new Response(JSON.stringify({ success: true }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: "Błąd KV: " + err.message }), { status: 500 });
    }
};