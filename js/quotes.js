
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