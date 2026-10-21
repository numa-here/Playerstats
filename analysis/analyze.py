from pathlib import Path
import json
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "matches.csv"
OUTPUT_FILE = ROOT / "data" / "stats.json"

def main():
    # Load CSV into a pandas DataFrame (table-like data structure).
    df = pd.read_csv(DATA_FILE)

    # Parse dates and validate the columns that our analysis requires.
    df["match_date"] = pd.to_datetime(df["match_date"], errors="coerce")
    required = ["player", "match_id", "match_date", "kills", "deaths", "assists", "score"]
    missing = [column for column in required if column not in df.columns]
    if missing:
        raise ValueError(f"CSV is missing required columns: {missing}")

    # Convert stats to numbers; invalid values become missing values.
    for column in ["kills", "deaths", "assists", "score"]:
        df[column] = pd.to_numeric(df[column], errors="coerce")
    df = df.dropna(subset=required).copy()
    df = df.drop_duplicates(subset=["player", "match_id"])

    # Aggregate each player's match rows into season-style totals/averages.
    players = (
        df.groupby("player", as_index=False)
          .agg(
              matches=("match_id", "nunique"),
              total_kills=("kills", "sum"),
              total_deaths=("deaths", "sum"),
              total_assists=("assists", "sum"),
              total_score=("score", "sum"),
              avg_score=("score", "mean"),
              avg_kills=("kills", "mean"),
          )
          .sort_values("total_score", ascending=False)
    )

    # A timeline: average score per match date.
    trend = (
        df.groupby("match_date", as_index=False)["score"]
          .mean()
          .sort_values("match_date")
    )

    result = {
        "summary": {
            "matches": int(df["match_id"].nunique()),
            "players": int(df["player"].nunique()),
            "average_score": round(float(df["score"].mean()), 2),
            "highest_score": int(df["score"].max()),
        },
        "players": [
            {
                "player": row.player,
                "matches": int(row.matches),
                "total_kills": int(row.total_kills),
                "total_deaths": int(row.total_deaths),
                "total_assists": int(row.total_assists),
                "total_score": int(row.total_score),
                "avg_score": round(float(row.avg_score), 2),
                "avg_kills": round(float(row.avg_kills), 2),
            }
            for row in players.itertuples(index=False)
        ],
        "trend": [
            {"date": row.match_date.strftime("%Y-%m-%d"), "average_score": round(float(row.score), 2)}
            for row in trend.itertuples(index=False)
        ],
        "match_scores": [
            {
                "player": row.player,
                "match_id": int(row.match_id),
                "date": row.match_date.strftime("%Y-%m-%d"),
                "score": int(row.score),
            }
            for row in df.sort_values(["match_date", "player"]).itertuples(index=False)
        ],
    }

    OUTPUT_FILE.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(f"Analysis complete. Wrote {OUTPUT_FILE.relative_to(ROOT)}")
    print(players[["player", "matches", "total_kills", "total_score", "avg_score"]].to_string(index=False))

if __name__ == "__main__":
    main()
