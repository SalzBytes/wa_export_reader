const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const floatingDate = document.getElementById('floatingDate');
const dateSeparators = document.querySelectorAll('.date-separator');

searchBtn.addEventListener('click', () => {
    const q = searchInput.value.toLowerCase();

    document.querySelectorAll('.chat-item').forEach(el => {
        el.style.display =
            el.innerText.toLowerCase().includes(q)
                ? ''
                : 'none';
    });
});

window.addEventListener('scroll', () => {
    let current = null;

    dateSeparators.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 60) {
            current = el.dataset.date;
        }
    });

    if (current) {
        floatingDate.textContent = current;
        floatingDate.classList.remove('hidden');
    } else {
        floatingDate.classList.add('hidden');
    }
});