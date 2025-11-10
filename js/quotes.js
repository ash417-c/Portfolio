
async function newQuote() { //from quotes.json
    try {
        let json_quotes = await fetch("./data/quotes.json");
        let quotes = await json_quotes.json();

        let randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        document.getElementById("quote").innerText = `"${randomQuote.quote}"`;
        document.getElementById("author").innerText = "— " + randomQuote.author;
    } catch(err) {
        console.error("Error loading quotes: ", err)
    }
    
}
window.onload = newQuote;

// Wait until the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
	quoteAnimation();
});

let animating = false;
const reloadBtn = document.getElementById("reload-quote");
reloadBtn.addEventListener("click", () => {
    if (animating) return;

    animating = true;
    newQuote();
    quoteAnimation(() => {
        animating = false;
    });
});

function quoteAnimation(onComplete) {

    // Animate quote
    gsap.from("#quote", {
        opacity: 0,
        filter: "blur(8px)",
        y: 30,
        duration: 1.6,
        ease: "power3.out",
        onComplete: onComplete
    });

    // Animate author
    gsap.from("#author", {
        duration: 1,
        delay: 0.5,
        y: 50,
        opacity: 0,
        ease: "power2.out"
    });
}