"""Download market and supply-chain series used by the automotive
connectedness study. Runs inside GitHub Actions; writes CSVs to datafetch/out/."""
import io, os, time, json
import pandas as pd, requests, yfinance as yf

OUT = "datafetch/out"; os.makedirs(OUT, exist_ok=True)
START = "2017-06-01"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"}

TICKERS = [
    # Stellantis (cross-listed) and the Exor/Agnelli perimeter
    "STLAM.MI", "STLAP.PA", "STLA", "RACE.MI", "CNH", "IVG.MI", "EXO.AS",
    # Volkswagen Group
    "VOW3.DE", "VOW.DE", "P911.DE", "PAH3.DE", "8TRA.DE",
    # Renault-Nissan-Mitsubishi Alliance
    "RNO.PA", "7201.T", "7211.T",
    # Toyota Group
    "7203.T", "6902.T", "6201.T", "7259.T",
    # Hyundai Motor Group
    "005380.KS", "000270.KS", "012330.KS",
    # Geely Holding
    "0175.HK", "VOLCAR-B.ST", "PSNY",
    # Independents / benchmarks
    "BMW.DE", "MBG.DE", "F", "GM", "TSLA", "1211.HK", "7267.T", "600104.SS",
    # Commodities, FX and market factors
    "BZ=F", "CL=F", "TTF=F", "HG=F", "ALI=F", "PA=F", "^STOXX50E", "^GSPC",
    "^N225", "^KS11", "^HSI", "EURUSD=X", "JPY=X", "KRW=X", "^VIX",
]

log = {}
rows = []
for t in TICKERS:
    for attempt in range(3):
        try:
            d = yf.download(t, start=START, auto_adjust=False, progress=False,
                            interval="1d", threads=False)
            if isinstance(d.columns, pd.MultiIndex):
                d.columns = d.columns.get_level_values(0)
            if len(d) == 0:
                raise ValueError("empty")
            col = "Adj Close" if "Adj Close" in d.columns else "Close"
            s = d[[col, "Close", "Volume"]].rename(
                columns={col: "adj_close", "Close": "close", "Volume": "volume"})
            s["ticker"] = t
            s.index.name = "date"
            rows.append(s.reset_index())
            log[t] = {"rows": len(s), "first": str(s.index.min().date()),
                      "last": str(s.index.max().date())}
            break
        except Exception as e:  # noqa
            log[t] = {"error": repr(e)}
            time.sleep(3)
prices = pd.concat(rows, ignore_index=True)
prices.to_csv(f"{OUT}/prices_daily.csv", index=False)

def get(url):
    r = requests.get(url, headers=UA, timeout=60)
    r.raise_for_status()
    return r.content

# NY Fed Global Supply Chain Pressure Index
try:
    raw = get("https://www.newyorkfed.org/medialibrary/research/interactives/gscpi/downloads/gscpi_data.xlsx")
    open(f"{OUT}/gscpi_data.xlsx", "wb").write(raw)
    x = pd.read_excel(io.BytesIO(raw), sheet_name=None)
    for name, df in x.items():
        df.to_csv(f"{OUT}/gscpi_sheet_{name.replace(' ', '_')}.csv", index=False)
    log["GSCPI"] = {"sheets": list(x.keys())}
except Exception as e:
    log["GSCPI"] = {"error": repr(e)}

# Caldara-Iacoviello Geopolitical Risk index
for nm, url in {"gpr_monthly": "https://www.matteoiacoviello.com/gpr_files/data_gpr_export.xls",
                "gpr_daily": "https://www.matteoiacoviello.com/gpr_files/data_gpr_daily_recent.xls"}.items():
    try:
        raw = get(url)
        open(f"{OUT}/{nm}.xls", "wb").write(raw)
        df = pd.read_excel(io.BytesIO(raw))
        df.to_csv(f"{OUT}/{nm}.csv", index=False)
        log[nm] = {"rows": len(df), "cols": list(df.columns)[:12]}
    except Exception as e:
        log[nm] = {"error": repr(e)}

# FRED series without API key (fredgraph CSV)
fred = {"DCOILBRENTEU": "Brent spot", "PNGASEUUSDM": "EU natural gas (TTF) monthly",
        "INDPRO": "US industrial production", "GEPUCURRENT": "Global EPU (current)"}
for sid in fred:
    try:
        raw = get(f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={sid}")
        open(f"{OUT}/fred_{sid}.csv", "wb").write(raw)
        log[f"FRED_{sid}"] = {"bytes": len(raw)}
    except Exception as e:
        log[f"FRED_{sid}"] = {"error": repr(e)}

json.dump(log, open(f"{OUT}/fetch_log.json", "w"), indent=1)
print(json.dumps(log, indent=1))
