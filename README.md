HEAD
# Playerstats
An interactive player statistics dashboard built with Python, Pandas, JavaScript, and Chart.js.

# Player Stats Dashboard

A beginner-friendly data analysis and visualization project using Python, Pandas, HTML, CSS, JavaScript and Chart.js.

> **Important:** `data/matches.csv` contains fictional sample data for learning. Do not present it as official game statistics.

## Features
- KPI cards for match count, player count, average score and highest score
- Player leaderboard by total score
- Average score trend by match date
- Player filter and a detailed statistics table
- Python/Pandas data cleaning and aggregation, exported to JSON

## Requirements
- Python 3.10 or newer
- A code editor (VS Code recommended)
- A browser
- Git and a GitHub account (for version control)

## Run locally (Windows PowerShell)
1. Open this folder in VS Code.
2. Create and activate a virtual environment:

   ```powershell
   py -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

   If PowerShell blocks activation, you can instead run `.venv\Scripts\python.exe -m pip install -r requirements.txt` and `.venv\Scripts\python.exe analysis\analyze.py`.

3. Install Python dependencies:

   ```powershell
   python -m pip install -r requirements.txt
   ```

4. Run the analysis script:

   ```powershell
   python analysis\analyze.py
   ```

   This creates `data/stats.json`. It is generated output, so you can choose to commit it to GitHub to make the static dashboard work when deployed.

5. Start a local web server from the project root:

   ```powershell
   python -m http.server 8000
   ```

6. Open `http://localhost:8000` in your browser. Keep the terminal running while you use the page. Do not open `index.html` by double-clicking; browsers commonly block `fetch()` when a page is opened with the `file://` protocol.

## How the data flow works
`data/matches.csv` → `analysis/analyze.py` (Pandas) → `data/stats.json` → `app.js` → Chart.js charts and table.

## Data dictionary
- `player`: player display name
- `match_id`: unique match identifier
- `match_date`: date of the match, YYYY-MM-DD
- `game`: game title
- `team`: team name
- `kills`, `deaths`, `assists`: per-player match statistics
- `score`: the score metric used in this demonstration

The example score is a provided dataset field, not a universal esports scoring formula.

## Use a real public dataset
A possible next step is an Overwatch League player-statistics dataset on Kaggle: https://www.kaggle.com/datasets/sherrytp/overwatch-league-stats-lab . Review its license, column definitions and terms before using it. Different datasets have different schemas; do not assume its columns match this demo. Keep a copy of the original data and adapt the Python cleaning/aggregation code to the actual CSV.

## Suggested Git workflow
```bash
git init
git add .
git commit -m "Build initial player stats dashboard"
```
Create an empty repository on GitHub, then connect it using the exact repository URL GitHub gives you:
```bash
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

## Limitations and future improvements
- Static demo; no login, database, or live game API.
- Sample data is fictional.
- Chart.js and Papa Parse are loaded from CDNs, so internet access is required for those libraries.
- Next steps: real data, dataset-specific cleaning, date filters, accessibility polish, tests, and deployment.
 2d47d8b (Initial player stats dashboard)
