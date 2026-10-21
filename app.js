const numberFormat = new Intl.NumberFormat("en-IN");
let dashboardData;
let leaderboardChart;
let trendChart;

async function loadDashboard() {
  const status = document.getElementById("status");
  try {
    const response = await fetch("data/stats.json");
    if (!response.ok) throw new Error("Could not load data/stats.json. Run the Python analysis first.");
    dashboardData = await response.json();
    renderSummary(dashboardData.summary);
    populatePlayerFilter(dashboardData.players);
    renderTable(dashboardData.players);
    renderCharts(dashboardData);
    status.textContent = "Analysis loaded successfully.";
  } catch (error) {
    status.textContent = error.message + " Then refresh this page.";
    console.error(error);
  }
}

function renderSummary(summary) {
  document.getElementById("matches-value").textContent = numberFormat.format(summary.matches);
  document.getElementById("players-value").textContent = numberFormat.format(summary.players);
  document.getElementById("average-value").textContent = numberFormat.format(summary.average_score);
  document.getElementById("highest-value").textContent = numberFormat.format(summary.highest_score);
}

function populatePlayerFilter(players) {
  const select = document.getElementById("player-filter");
  players.forEach(({ player }) => {
    const option = document.createElement("option");
    option.value = player;
    option.textContent = player;
    select.appendChild(option);
  });
  select.addEventListener("change", () => {
    renderTable(dashboardData.players);
    renderCharts(dashboardData);
  });
}

function renderTable(players) {
  const selected = document.getElementById("player-filter").value;
  const filtered = selected === "all" ? players : players.filter(p => p.player === selected);
  const body = document.getElementById("players-table");
  body.replaceChildren();
  filtered.forEach((p, index) => {
    const row = document.createElement("tr");
    const values = [index + 1, p.player, p.matches, p.total_kills, p.total_deaths,
      p.total_assists, numberFormat.format(p.total_score), numberFormat.format(p.avg_score)];
    values.forEach((value, cellIndex) => {
      const cell = document.createElement("td");
      cell.textContent = value;
      if (cellIndex === 0) cell.className = "rank";
      row.appendChild(cell);
    });
    body.appendChild(row);
  });
}

function renderCharts(data) {
  const selected = document.getElementById("player-filter").value;
  const players = selected === "all" ? data.players : data.players.filter(p => p.player === selected);
  if (leaderboardChart) leaderboardChart.destroy();
  if (trendChart) trendChart.destroy();

  leaderboardChart = new Chart(document.getElementById("leaderboard-chart"), {
    type: "bar",
    data: {
      labels: players.map(p => p.player),
      datasets: [{ label: "Total score", data: players.map(p => p.total_score),
        backgroundColor: "#69d8c4", borderRadius: 7, maxBarThickness: 48 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { ticks: { color: "#a5b3cc" }, grid: { display: false } },
        y: { beginAtZero: true, ticks: { color: "#a5b3cc" }, grid: { color: "#26344e" } }
      }
    }
  });

  const selectedRows = selected === "all"
    ? data.match_scores
    : data.match_scores.filter(row => row.player === selected);
  const grouped = new Map();
  selectedRows.forEach(row => {
    if (!grouped.has(row.date)) grouped.set(row.date, []);
    grouped.get(row.date).push(row.score);
  });
  const dates = [...grouped.keys()].sort();
  const averages = dates.map(date => {
    const scores = grouped.get(date);
    return scores.reduce((sum, value) => sum + value, 0) / scores.length;
  });

  trendChart = new Chart(document.getElementById("trend-chart"), {
    type: "line",
    data: { labels: dates, datasets: [{ label: "Average score", data: averages,
      borderColor: "#a99bff", backgroundColor: "rgba(169,155,255,.15)",
      fill: true, tension: .3, pointRadius: 4 }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#c5d0e5" } } },
      scales: {
        x: { ticks: { color: "#a5b3cc" }, grid: { display: false } },
        y: { beginAtZero: true, ticks: { color: "#a5b3cc" }, grid: { color: "#26344e" } }
      }
    }
  });
}

loadDashboard();
