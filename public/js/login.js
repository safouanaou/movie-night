const form = document.querySelector('.login-form');

form.addEventListener('submit', async (e)=>{
    e.preventDefault();

    const data = new FormData(form);

    const url = '/api/auth/login';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                email: data.get('email'),
                password: data.get('password')
            })
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result)

    } catch(err){
        console.error(err.message)
    }



    
})

