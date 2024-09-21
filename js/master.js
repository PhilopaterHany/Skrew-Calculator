const invalidChars = ["-", "+", "e"];

// Initialize SweetAlert to prompt for the number of players
Swal.fire({
    title: "عدد اللاعبين",
    allowOutsideClick: false,
    confirmButtonText: "تأكيد",
    footer: '<a href="https://www.youtube.com/watch?v=by6w-Rz7bfY">قواعد اللعبة</a>',
    html: `
        <select class="swal2-input" id="player-select">
            ${Array.from(
                { length: 7 },
                (_, i) => `<option value="${i + 2}">${i + 2}</option>`
            ).join("")}
        </select>
        <i class="fas fa-chevron-down"></i>`,
    preConfirm: () => Swal.getPopup().querySelector("#player-select").value,
}).then((result) => {
    if (result.isConfirmed) {
        const numPlayers = result.value;
        renderMainLayout(numPlayers);
    }
});

// Render the main layout of the application
function renderMainLayout(numPlayers) {
    document.body.innerHTML = `
        <header>Skrew Calculator</header>
        <main id="player-table-container"></main>
        <footer>
            <p>&copy; Copyrights <span id="year">${new Date().getFullYear()}</span></p>
            <p>&reg; All Rights Reserved</p>
            <p>
                Made By
                <a href="https://github.com/PhilopaterHany/" target="_blank">Philopater Hany</a>
            </p>
        </footer>`;
    createTable(numPlayers);
}

// Create the player table
function createTable(numPlayers) {
    const mainContainer = document.getElementById("player-table-container");
    const tableHTML = generateTableHTML(numPlayers);
    mainContainer.innerHTML = tableHTML;

    attachInputListeners();
}

// Generate the HTML for the player table
function generateTableHTML(numPlayers) {
    let tableHTML = `
        <table>
            <thead>
                <tr class="names">
                    <th>أسماء اللاعبين</th>
                    ${Array.from(
                        { length: numPlayers },
                        (_, i) =>
                            `<th><input type="text" id="name-${i + 1}" /></th>`
                    ).join("")}
                </tr>
            </thead>
            <tbody>
                ${Array.from(
                    { length: 5 },
                    (_, round) => `
                    <tr>
                        <td>الجولة ${round + 1}</td>
                        ${Array.from(
                            { length: numPlayers },
                            (_, i) =>
                                `<td><input type="number" id="round-${
                                    round + 1
                                }-${i + 1}" /></td>`
                        ).join("")}
                    </tr>
                `
                ).join("")}
            </tbody>
            <tfoot>
                <tr>
                    <td>المجموع</td>
                    ${Array.from(
                        { length: numPlayers },
                        () => `<td>0</td>`
                    ).join("")}
                </tr>
            </tfoot>
        </table>`;
    return tableHTML;
}

// Attach event listeners to inputs
function attachInputListeners() {
    const numberInputs = document.querySelectorAll("input[type=number]");

    numberInputs.forEach((input) => {
        input.addEventListener("keydown", restrictInvalidInput);
        input.addEventListener("input", () => {
            highlightingCells(input);
            updateTotals();
        });
    });
}

// Restrict invalid characters in number inputs
function restrictInvalidInput(e) {
    if (invalidChars.includes(e.key)) e.preventDefault();
}

// Update the totals for each player
function updateTotals() {
    const playerCount = document.querySelectorAll("tfoot td").length - 1; // Exclude total label cell
    const totals = Array(playerCount).fill(0); // Initialize totals

    const rows = document.querySelectorAll("tbody tr");
    rows.forEach((row) => {
        const inputs = row.querySelectorAll("input[type=number]");
        inputs.forEach((input, index) => {
            const value = parseInt(input.value) || 0;
            const td = input.parentNode;

            if (!td.classList.contains("lowest-sum")) {
                totals[index] += value; // Update totals
            }
        });
    });

    const totalCells = document.querySelectorAll("tfoot td");
    totalCells.forEach((cell, index) => {
        if (index > 0) {
            cell.innerHTML = totals[index - 1]; // Update displayed total
        }
    });

    highlightLowestTotal(totalCells);
}

// Highlight the cell with the lowest total
function highlightLowestTotal(totalCells) {
    totalCells.forEach((cell) => cell.classList.remove("lowest-sum")); // Clear previous highlights

    let minTotal = Infinity;
    totalCells.forEach((cell, index) => {
        if (index > 0) {
            const value = parseInt(cell.innerHTML) || 0;
            minTotal = Math.min(minTotal, value);
        }
    });

    totalCells.forEach((cell, index) => {
        if (index > 0 && (parseInt(cell.innerHTML) || 0) === minTotal) {
            cell.classList.add("lowest-sum"); // Highlight lowest total
        }
    });
}

// Highlight the lowest score in the current row
function highlightingCells(input) {
    const rowIndex = input.parentNode.parentNode.rowIndex; // Get row index
    const rowInputs = document.querySelectorAll(
        `tr:nth-child(${rowIndex}) input[type=number]`
    );

    let minValue = Infinity;
    rowInputs.forEach((input) => {
        const inputValue = parseInt(input.value);
        if (!isNaN(inputValue)) {
            minValue = Math.min(minValue, inputValue);
        }
    });

    rowInputs.forEach((input) => {
        const value = parseInt(input.value);
        const td = input.parentNode;
        td.classList.toggle("lowest-sum", value === minValue && !isNaN(value));
    });
}

// Blur the select input when changed
document
    .getElementById("player-select")
    .addEventListener("change", function () {
        this.blur();
    });
