
// Removed require('node-fetch'); assuming Node 18+

async function testRegister() {
    const url = 'http://localhost:3000/api/auth/register';
    // Use data that mimics the user request
    const body = {
        nombre: 'Pato',
        run: '14.086.126-K',
        correo: 'patricio@duocuc.cl',
        contrasena: 'password123',
        telefono: '+56 9 1234 5678'
    };

    try {
        console.log(`Sending POST to ${url}`);
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        console.log(`Status: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.log('Raw response body:');
        console.log(text);

        try {
            const json = JSON.parse(text);
            console.log('Parsed JSON:', json);
        } catch (e) {
            console.log('Failed to parse JSON:', e.message);
        }

    } catch (error) {
        console.error('Network or other error:', error);
        if (error.cause) console.error('Cause:', error.cause);
    }
}

testRegister();
