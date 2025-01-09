document.addEventListener('DOMContentLoaded', () => {
    // Function to copy citation to clipboard
    document.getElementById('copyButton').addEventListener('click', () => {
        const output = document.getElementById('output').innerText;
        navigator.clipboard.writeText(output).then(() => {
            const tooltip = document.querySelector('.tooltip');
            tooltip.classList.add('visible');
            setTimeout(() => {
                tooltip.classList.remove('visible');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    });

    // Function to handle citation generation
    document.getElementById("processLink").addEventListener("click", async () => {
        const title = document.getElementById("articleInput").value;
        
        try {
            const result = await searchCrossrefByTitle(title);

            if (typeof result === "string") {
                console.log(result); // Log the error or "No results found" message
                document.getElementById("output").innerText = result; // Display error message
            } else {
                const formattedAuthor = formatAuthor(result.author_last, result.author_first);
                const output = `${formattedAuthor} (${result.published_date}) '${result.title}', '<i>${result.journal}</i>'. doi:${result.doi}`;
                document.getElementById("output").innerHTML = output; // Display citation
            }
        } catch (error) {
            console.error("Error generating citation:", error);
            document.getElementById("output").innerText = "Error generating citation. Please try again.";
        }
    });
});