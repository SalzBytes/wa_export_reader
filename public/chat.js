const btn = document.getElementById('loadOlder');
const container = document.getElementById('chatContainer');

if (container && btn) {
    btn.addEventListener('click', async () => {
        const page = Number(btn.dataset.page) + 1;
        btn.dataset.page = page;

        const res = await fetch(
            `/chat/${CHAT_ID}/load?page=${page}&filter=${FILTER}`
        );

        const html = await res.text();

        if (!html.trim()) {
            btn.remove();
            return;
        }

        const oldHeight = container.scrollHeight;

        container.insertAdjacentHTML('afterbegin', html);

        // jaga posisi scroll
        container.scrollTop = container.scrollHeight - oldHeight;
    });
} else {
    console.warn('Chat container or button not found');
}
