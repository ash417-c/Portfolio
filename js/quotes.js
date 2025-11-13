
let quotesCache = null;

// Loads quotes.json once
async function loadQuotes() {
    if (!quotesCache) {
        try {
            let res = await fetch("./data/quotes.json");
            quotesCache = await res.json();
        } catch (err) {
            console.error("Error loading quotes.json:", err);
        }
    }
    return quotesCache;
}

async function newQuote() {
    const quotes = await loadQuotes();
    if (!quotes) return; // Safety

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById("quote").innerText = `"${randomQuote.quote}"`;
    document.getElementById("author").innerText = "— " + randomQuote.author;
}
window.onload = newQuote;

// Animate quote
let quoteTween = gsap.from("#quote", {
    opacity: 0,
    filter: "blur(8px)",
    y: 30,
    duration: 1.6,
    ease: "power3.out"
});

// Animate author
let authorTween = gsap.from("#author", {
    duration: 1,
    delay: 0.5,
    y: 50,
    opacity: 0,
    ease: "power2.out"
});

const reloadBtn = document.getElementById("reload-quote");
reloadBtn.addEventListener("click", () => {
    newQuote();
    quoteTween.restart();
    authorTween.restart(true);
});
