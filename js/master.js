// =========================
// CONSTANTS & GLOBALS
// =========================
const invalidChars = ["-", "+", "e"];
const yearEl = document.getElementById("year");
yearEl.innerHTML = new Date().getFullYear();

// =========================
// SWEETALERT: PLAYER PROMPT
// =========================
Swal.fire({
    title: "Players",
    allowOutsideClick: false,
    confirmButtonText: "Confirm",
    footer: '<a href="https://www.youtube.com/watch?v=by6w-Rz7bfY">Game Rules</a>',
    html: `
        <select class="swal2-input" id="player-select">
            ${Array.from(
                { length: 5 },
                (_, i) => `<option value="${i + 2}">${i + 2}</option>`
            ).join("")}
        </select>
        <i class="fas fa-chevron-down"></i>
    `,
    didOpen: () => toggleTableVisibility(false),
    willClose: () => toggleTableVisibility(true),
}).then((result) => {
    if (result.isConfirmed) {
        const numPlayers = parseInt(
            document.getElementById("player-select").value
        );
        fillPlayerColumns(numPlayers);
        attachInputListeners();
    }
});

// =========================
// TABLE SETUP FUNCTIONS
// =========================
function fillPlayerColumns(numPlayers) {
    const headerRow = document.querySelector("table thead tr");
    const footerRow = document.querySelector("table tfoot tr");
    const bodyRows = document.querySelectorAll("table tbody tr");

    // Reset columns
    while (headerRow.cells.length > 2) headerRow.deleteCell(2);
    while (footerRow.cells.length > 1) footerRow.deleteCell(1);
    bodyRows.forEach((row) => {
        while (row.cells.length > 1) row.deleteCell(1);
    });

    // Add new columns
    for (let i = 1; i <= numPlayers; i++) {
        headerRow.insertCell(-1).innerHTML = `<input type="text" id="name-${i}" />`;
        footerRow.insertCell(-1).innerText = "0";
    }

    // Add score inputs
    bodyRows.forEach((row, roundIndex) => {
        for (let i = 1; i <= numPlayers; i++) {
            row.insertCell(-1).innerHTML = `<input type="number" id="round-${roundIndex + 1}-${i}" />`;
        }
    });
}

function toggleTableVisibility(visible) {
    document.querySelector("table").style.visibility = visible ? "visible" : "hidden";
    document.querySelector(".btns").style.visibility = visible ? "visible" : "hidden";
}

// =========================
// INPUT HANDLING
// =========================
function attachInputListeners() {
    document.querySelectorAll("input[type=number]").forEach((input) => {
        input.addEventListener("keydown", restrictInvalidInput);
        input.addEventListener("input", () => {
            highlightRowLowest(input);
            updateTotals();
        });
    });
}

function restrictInvalidInput(e) {
    if (invalidChars.includes(e.key)) e.preventDefault();
}

function updateTotals() {
    const playerCount = document.querySelectorAll("tfoot td").length - 1;
    const totals = Array(playerCount).fill(0);

    document.querySelectorAll("tbody tr").forEach((row) => {
        row.querySelectorAll("input[type=number]").forEach((input, index) => {
            if (!input.parentNode.classList.contains("lowest-sum")) {
                totals[index] += parseInt(input.value) || 0;
            }
        });
    });

    const totalCells = document.querySelectorAll("tfoot td");
    totalCells.forEach((cell, index) => {
        if (index > 0) cell.textContent = totals[index - 1];
    });

    highlightLowestTotal(totalCells);
}

function highlightLowestTotal(totalCells) {
    totalCells.forEach((cell) => cell.classList.remove("lowest-sum"));

    const minTotal = Math.min(...Array.from(totalCells).slice(1).map((cell) => parseInt(cell.textContent) || 0));

    totalCells.forEach((cell, index) => {
        if (index > 0 && (parseInt(cell.textContent) || 0) === minTotal) {
            cell.classList.add("lowest-sum");
        }
    });
}

function highlightRowLowest(input) {
    const rowInputs = input.closest("tr").querySelectorAll("input[type=number]");
    const minValue = Math.min(...Array.from(rowInputs).map((inp) => parseInt(inp.value)).filter((v) => !isNaN(v))
    );

    rowInputs.forEach((inp) => {
        inp.parentNode.classList.toggle("lowest-sum", parseInt(inp.value) === minValue && !isNaN(minValue));
    });
}

// =========================
// STORAGE FUNCTIONS
// =========================
function saveMatch() {
    const inputs = document.querySelectorAll("tbody input[type='number'], thead input[type='text']");

    for (const input of inputs) {
        if (input.value.trim() === "") {
            Swal.fire({
                icon: "error",
                title: "Missing input",
                text: "Please fill in all fields before saving.",
            });
            return;
        }
    }

    const now = new Date();
    const options = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    };
    const formattedDate = now.toLocaleString("en-GB", options);

    const players = Array.from(document.querySelectorAll("thead input[type='text']")).map((input) => input.value.trim());

    const totals = Array.from(document.querySelectorAll("tfoot td")).slice(1).map((td) => parseInt(td.textContent, 10) || 0);

    const minScore = Math.min(...totals);
    const winnerIndex = totals.indexOf(minScore);
    const winner = players[winnerIndex];

    const match = { date: formattedDate, players, totals, winner };

    const history = JSON.parse(localStorage.getItem("matchHistory") || "[]");
    history.push(match);
    localStorage.setItem("matchHistory", JSON.stringify(history));

    Swal.fire({
        icon: "success",
        title: "Saved!",
        text: "Match data has been saved.",
        timer: 1500,
    });
}

function showHistory() {
    const matches = JSON.parse(localStorage.getItem("matchHistory")) || [];
    console.log(matches[1]);

    if (!matches.length) {
        Swal.fire({
            icon: "info",
            title: "No History",
            text: "No saved matches found.",
        });
        return;
    }

    let historyHTML = `
        <div class="history-container">
            <table class="history-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Players</th>
                        <th>Totals</th>
                        <th>Winner</th>
                    </tr>
                </thead>
                <tbody>
    `;

    matches.forEach((match) => {
        const totalsArr = match.totals.map(Number);
        const totalsStr = totalsArr.join(" - ");

        let winner = match.winner;
        if (!winner || winner === "N/A") {
            const minScore = Math.min(...totalsArr);
            const winners = match.players.filter((_, i) => totalsArr[i] === minScore);
            winner = winners.join(" - ");
        }

        historyHTML += `
        <tr>
            <td>${match.date}</td>
            <td>${match.players.join(" - ")}</td>
            <td>${totalsStr}</td>
            <td>${winner}</td>
        </tr>
    `;
    });

    historyHTML += `
                </tbody>
            </table>
            <button id="clearHistoryBtn" class="clear-history-btn">Clear History</button>
        </div>
    `;

    Swal.fire({
        title: "Match History",
        html: historyHTML,
        width: 800,
        showConfirmButton: false,
    });

    // Clear history button
    const clearBtn = document.getElementById("clearHistoryBtn");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            Swal.fire({
                title: "Are you sure?",
                text: "This will permanently delete all match history.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, clear it",
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem("matchHistory");
                    Swal.fire({ icon: "success", title: "History cleared!" });
                }
            });
        });
    }
}

function clearHistory() {
    Swal.fire({
        title: "Are you sure?",
        text: "This will delete all saved matches permanently.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, clear it!",
        cancelButtonText: "Cancel",
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("matchHistory");
            Swal.fire({
                icon: "success",
                title: "History Cleared",
                text: "All saved matches have been deleted.",
            });
        }
    });
}

// =========================
// EVENT LISTENERS
// =========================
document.getElementById("screenBtn").addEventListener("click", () => {
    html2canvas(document.querySelector("table")).then((canvas) => {
        const link = document.createElement("a");
        link.download = "table.jpg";
        link.href = canvas.toDataURL("image/jpeg");
        link.click();
    });
});

document.getElementById("saveBtn").addEventListener("click", saveMatch);
document.getElementById("historyBtn").addEventListener("click", showHistory);
