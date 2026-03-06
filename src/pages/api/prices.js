export const POST = async ({ request }) => {
    const pin = request.headers.get('Authorization');

    if (pin === "1234") {
        return new Response(JSON.stringify({ success: true, message: "PIN OK, ale baza KV wciąż leży" }), { 
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } else {
        return new Response(JSON.stringify({ error: "Zły PIN" }), { status: 401 });
    }
};