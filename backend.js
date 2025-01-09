async function searchCrossrefByTitle(title) {
    const url = "https://api.crossref.org/works";
    const params = new URLSearchParams({
        "query.title": title
    });
    const headers = {
        "User-Agent": "YourAppName (your_email@example.com)"
    };

    try {
        const response = await fetch(`${url}?${params}`, { headers });

        if (!response.ok) {
            return `Error: ${response.status}, ${await response.text()}`;
        }

        const data = await response.json();

        // Check if there are results
        if (data.message["total-results"] === 0) {
            return "No results found for this title.";
        }

        // Retrieve the first item for simplicity
        const item = data.message.items[0];
        const citation = {
            title: item.title?.[0] || "",
            author_last: item.author?.map(author => author.family) || [],
            author_first: item.author?.map(author => author.given) || [],
            published_date: item["published-print"]?.["date-parts"]?.[0]?.[0] || "N/A",
            journal: item["container-title"]?.[0] || "",
            doi: item.DOI || ""
        };
        return citation;

    } catch (error) {
        return `Error: ${error.message}`;
    }
}

// Function to format authors
const outputElement = document.getElementById("output");

function formatAuthor(authorLast, authorFirst) {
    if (authorLast.length === 1) {
        return `${authorLast[0]}, ${authorFirst[0]}.`;
    } else if (authorLast.length === 2) {
        return `${authorLast[0]}, ${authorFirst[0]} and ${authorLast[1]}, ${authorFirst[1]}.`;
    } else {
        return `${authorLast[0]}, ${authorFirst[0]} <i>et al.<i>`;
    }
}
document.getElementById("processLink").addEventListener("click", async () => {
    const title = document.getElementById("articleInput").value;
    const result = await searchCrossrefByTitle(title);

    if (typeof result === "string") {
        console.log(result); // Log the error or "No results found" message
    } else {
        const formattedAuthor = formatAuthor(result.author_last, result.author_first);
        output = `${formattedAuthor} (${result.published_date}) '${result.title}', '<i>${result.journal}<i>'. doi:${result.doi}`;
        outputElement.innerHTML = output;
    }
});