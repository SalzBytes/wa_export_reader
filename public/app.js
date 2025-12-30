const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const currentShowingDate = document.getElementById('currentShowingDate');
const chatContainer = document.getElementById('chatContainer');

if (!chatContainer) {
    console.warn('chatContainer not found');
}

/* ======================
   SEARCH FILTER
====================== */
if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
        const q = searchInput.value.toLowerCase();

        chatContainer.querySelectorAll('.chat-item').forEach(el => {
            el.style.display = el.innerText.toLowerCase().includes(q)
                ? ''
                : 'none';
        });
    });
}

/* ======================
   FLOATING DATE (FIXED)
====================== */
if (chatContainer) {
    chatContainer.addEventListener('scroll', () => {
        let current = null;

        chatContainer.querySelectorAll('.date-separator').forEach(el => {
            const r = el.getBoundingClientRect();
            const p = chatContainer.getBoundingClientRect();

            if (r.top - p.top <= 10) {
                current = el.dataset.date;
            }
        });

        if (current) {
            currentShowingDate.textContent = current;
        }
    });
}