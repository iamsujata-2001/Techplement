document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const quoteContainer = document.getElementById('quote-container');
    const randomQuote = document.getElementById('random-quote');
    const quoteImage = document.getElementById('quote-image');
    const quoteAuthor = document.getElementById('quote-author');
    const searchForm = document.getElementById('search-form');
    const searchResults = document.getElementById('search-results');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'dashboard.html';
                } else {
                    alert('Login failed');
                }
            });
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, username, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'index.html';
                } else {
                    alert('Registration failed');
                }
            });
        });
    }

    if (quoteContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const quoteId = urlParams.get('quoteId');

        if (quoteId) {
            fetch(`http://127.0.0.1:8080/randomQuote/api/v1/quote?id=${quoteId}`)
                .then(response => response.json())
                .then(data => {
                    randomQuote.textContent = `"${data.quote}"`;;
                    quoteImage.src = data.imagelink;
                    quoteImage.style.display = 'block';
                    quoteAuthor.textContent = `— ${data.author}`;
                });
        } else {
            fetch('/api/random-quote')
                .then(response => response.json())
                .then(data => {
                    randomQuote.textContent = data.quote;
                    quoteImage.src = data.imagelink;
                    quoteImage.style.display = 'block';
                    quoteAuthor.textContent = `— ${data.author}`;
                });
        }
    }

    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const author = document.getElementById('search-author').value;

            fetch(`http://127.0.0.1:8080/randomQuote/api/v1/quoteByAuthor?author=${author}`)
                .then(response => response.json())
                .then(data => {
                    searchResults.innerHTML = '';
                    data.forEach(quote => {
                        const quoteElement = document.createElement('p');
                        const quoteLink = document.createElement('a');
                        quoteLink.href = `dashboard.html?quoteId=${quote.srno}`;
                        quoteLink.textContent = quote.quote;
                        quoteElement.appendChild(quoteLink);
                        searchResults.appendChild(quoteElement);
                    });
                });
        });
    }
});
