// =========================
// CONSTANTS & GLOBALS
// =========================
const invalidChars = ["-", "+", "e"];
const yearEl = document.getElementById("year");
yearEl.innerHTML = new Date().getFullYear();

const mainEl = document.querySelector("main");

// =========================
// NAV TOGGLE
// =========================
const menuIcon = document.querySelector("nav .fa-bars");
const navList = document.querySelector("nav ul");

menuIcon.addEventListener("click", () => {
    navList.classList.toggle("show");
    if (navList.classList.contains("show")) {
        menuIcon.classList.remove("fa-bars");
        menuIcon.classList.add("fa-times");
    } else {
        menuIcon.classList.remove("fa-times");
        menuIcon.classList.add("fa-bars");
    }
});

// =========================
// NAV: PLAY
// =========================
document.getElementById("playBtn").addEventListener("click", () => {
    menuIcon.click();
    Swal.fire({
        title: "Players",
        allowOutsideClick: false,
        confirmButtonText: "Confirm",
        html: `
        <select class="swal2-input" id="player-select">
        ${Array.from(
            { length: 6 },
            (_, i) => `<option value="${i + 2}">${i + 2}</option>`
        ).join("")}
        </select>
        <i class="fas fa-chevron-down"></i>
        `,
    }).then((result) => {
        if (result.isConfirmed) {
            const numPlayers = parseInt(
                document.getElementById("player-select").value
            );

            // Build game table inside main
            mainEl.innerHTML = `
                <table>
                    <thead><tr><th>Players</th></tr></thead>
                    <tbody>
                        <tr><td>Round 1</td></tr>
                        <tr><td>Round 2</td></tr>
                        <tr><td><span class="note">(Silent)</span> Round 3</td></tr>
                        <tr><td><span class="note">(Double)</span> Round 4</td></tr>
                        <tr><td><span class="note">(Blind)</span> Round 5</td></tr>
                    </tbody>
                    <tfoot><tr><td>Total</td></tr></tfoot>
                </table>
                <div class="btns">
                    <button id="screenBtn">Screenshot <i class="fas fa-image"></i></button>
                    <button id="saveBtn">Save <i class="fas fa-floppy-disk"></i></button>
                </div>
            `;

            fillPlayerColumns(numPlayers);
            attachInputListeners();

            document
                .getElementById("screenBtn")
                .addEventListener("click", screenshotTable);
            document
                .getElementById("saveBtn")
                .addEventListener("click", saveMatch);
        }
    });
});

// =========================
// NAV: RULES
// =========================
document.getElementById("rulesBtn").addEventListener("click", () => {
    menuIcon.click();
    mainEl.innerHTML = `
        <section class="rules">
            <h2>Rules & Instructions</h2>
            <section class="video">
                <iframe src="https://www.youtube.com/embed/by6w-Rz7bfY" title="Rules Video"></iframe>
            </section>
            <hr />
            <section id="setup">
                <h3>Setup</h3>
                <ul>
                    <li>At the beginning, each player gets 4 cards.</li>
                    <li>Each player must look at their bottom two cards only.</li>
                </ul>
            </section>
            <hr />
            <section>
                <h3>How to Play</h3>
                <p>When it is your turn, you can:</p>
                <ol>
                    <li>
                        Draw a card from the deck.
                        <ul>
                            <li>Only you look at it.</li>
                            <li>If it helps, keep it and swap with one of your cards.</li>
                        </ul>
                    </li>
                    <li>
                        Match &amp; Discard (Tebasar) a card with the same value as the top of the discard pile.
                    </li>
                    <li>
                        Play a Command Card (see <b><a href="#cards">Cards Table</a></b>).
                    </li>
                    <li>
                        Call <b>“Skrew”</b> if you believe you have the lowest total.
                        <ul>
                            <li>Round continues until your turn comes back, then all reveal.</li>
                        </ul>
                    </li>
                </ol>
            </section>
            <hr />
            <section id="scoring">
                <h3>Scoring</h3>
                <ul>
                    <li>Lowest total wins the round and scores 0.</li>
                    <li>All others sum their visible values normally.</li>
                    <li>If a player calls Skrew and is not the lowest their score is doubled.</li>
                </ul>
            </section>
            <hr />
            <section id="rounds">
                <h3>Rounds</h3>
                <ul>
                    <li>The game has 5 rounds in total.</li>
                    <li><b>Round 3:</b> Silent round — no talking allowed.</li>
                    <li><b>Round 4:</b> All scores are doubled except the winner.</li>
                    <li><b>Round 5:</b> Blind round — players start without looking at any of their cards.</li>
                </ul>
            </section>
            <hr />
            <section>
                <h3>Cards</h3>
                <table id="cards">
                    <thead>
                        <tr>
                            <th>Card</th>
                            <th>Effect</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1 ~ 6</td>
                            <td>Normal Cards.</td>
                        </tr>
                        <tr>
                            <td>7 - 8</td>
                            <td>Look at one of your own cards.</td>
                        </tr>
                        <tr>
                            <td>9 - 10</td>
                            <td>Look at one card from any player.</td>
                        </tr>
                        <tr>
                            <td>5od w hat</td>
                            <td>Swap one card with another player; nobody sees the swapped cards.</td>
                        </tr>
                        <tr>
                            <td>5od bas</td>
                            <td>Give one card to any player without taking one back.</td>
                        </tr>
                        <tr>
                            <td>Ka3b dayer</td>
                            <td>Look at one card from every player OR two of your own cards.</td>
                        </tr>
                        <tr>
                            <td>Basra</td>
                            <td>Throw it, then place another card on top of it to lower your score.</td>
                        </tr>
                        <tr>
                            <td>See & Swap</td>
                            <td>Look at a player’s card. If you want it, take it and give them one of yours unseen; if not, pass it to another player with a swap</td>
                        </tr>
                        <tr>
                            <td>3la kefak</td>
                            <td>Choose any command to play.</td>
                        </tr>
                        <tr>
                            <td>+20</td>
                            <td>Must be discarded as soon as possible.</td>
                        </tr>
                        <tr>
                            <td>Red Skrew</td>
                            <td>+25, can burn a green skrew on the pile.</td>
                        </tr>
                        <tr>
                            <td>Green Skrew</td>
                            <td>Worth zero points.</td>
                        </tr>
                        <tr>
                            <td>-1</td>
                            <td>Strong negative value, keep it safe.</td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </section>
    `;
});

// =========================
// NAV: HISTORY
// =========================
document.getElementById("historyBtn").addEventListener("click", () => {
    menuIcon.click();
    const matches = JSON.parse(localStorage.getItem("matchHistory")) || [];

    if (!matches.length) {
        mainEl.innerHTML = `<p class="no-history">No saved matches found.</p>`;
        return;
    }

    let historyHTML = `
        <table class="history-table">
            <thead>
                <tr><th>Date</th><th>Players</th><th>Totals</th><th>Winner</th></tr>
            </thead>
            <tbody>
    `;

    matches.forEach((match) => {
        const totalsStr = match.totals.join(" - ");
        historyHTML += `
            <tr>
                <td>${match.date}</td>
                <td>${match.players.join(" - ")}</td>
                <td>${totalsStr}</td>
                <td>${match.winner}</td>
            </tr>
        `;
    });

    historyHTML += `</tbody></table>
        <button id="clearHistoryBtn">Clear History</button>`;

    mainEl.innerHTML = historyHTML;

    document.getElementById("clearHistoryBtn").addEventListener("click", () => {
        Swal.fire({
            title: "Are you sure?",
            text: "This will clear all history!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, clear it!",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("matchHistory");
                mainEl.innerHTML = `<p class="no-history">History cleared!</p>`;
                Swal.fire(
                    "Cleared!",
                    "Your history has been cleared.",
                    "success"
                );
            }
        });
    });
});

// =========================
// TABLE SETUP FUNCTIONS
// =========================
function fillPlayerColumns(numPlayers) {
    const headerRow = document.querySelector("table thead tr");
    const footerRow = document.querySelector("table tfoot tr");
    const bodyRows = document.querySelectorAll("table tbody tr");

    const totalCols = 1 + numPlayers;
    const colWidth = 100 / totalCols + "%";

    for (let i = 1; i <= numPlayers; i++) {
        const th = document.createElement("th");
        th.innerHTML = `<input type="text" id="name-${i}" />`;
        th.style.width = colWidth;
        headerRow.appendChild(th);

        const td = document.createElement("td");
        td.innerText = "0";
        td.style.width = colWidth;
        footerRow.appendChild(td);
    }

    bodyRows.forEach((row, roundIndex) => {
        for (let i = 1; i <= numPlayers; i++) {
            const td = document.createElement("td");
            td.innerHTML = `<input type="number" id="round-${
                roundIndex + 1
            }-${i}" />`;
            td.style.width = colWidth;
            row.appendChild(td);
        }
    });

    headerRow.cells[0].style.width = colWidth;
    bodyRows.forEach((row) => (row.cells[0].style.width = colWidth));
    footerRow.cells[0].style.width = colWidth;
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

    const minTotal = Math.min(
        ...Array.from(totalCells)
            .slice(1)
            .map((cell) => parseInt(cell.textContent) || 0)
    );

    totalCells.forEach((cell, index) => {
        if (index > 0 && (parseInt(cell.textContent) || 0) === minTotal) {
            cell.classList.add("lowest-sum");
        }
    });
}

function highlightRowLowest(input) {
    const rowInputs = input
        .closest("tr")
        .querySelectorAll("input[type=number]");
    const minValue = Math.min(
        ...Array.from(rowInputs)
            .map((inp) => parseInt(inp.value))
            .filter((v) => !isNaN(v))
    );

    rowInputs.forEach((inp) => {
        inp.parentNode.classList.toggle(
            "lowest-sum",
            parseInt(inp.value) === minValue && !isNaN(minValue)
        );
    });
}

// =========================
// STORAGE FUNCTIONS
// =========================
function saveMatch() {
    const inputs = document.querySelectorAll(
        "tbody input[type='number'], thead input[type='text']"
    );

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

    const players = Array.from(
        document.querySelectorAll("thead input[type='text']")
    ).map((input) => input.value.trim());

    const totals = Array.from(document.querySelectorAll("tfoot td"))
        .slice(1)
        .map((td) => parseInt(td.textContent, 10) || 0);

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

// =========================
// HELPERS
// =========================
function screenshotTable() {
    html2canvas(document.querySelector("table")).then((canvas) => {
        const link = document.createElement("a");
        const timestamp = new Date().toISOString().replace(/[:.-]/g, "_");
        link.download = `table_${timestamp}.jpg`;
        link.href = canvas.toDataURL("image/jpeg");
        link.click();
    });
}
