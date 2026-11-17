# Operation: Hassan Ko Manao 💌

A personal, interactive friendship apology made with Flask, HTML, CSS, and vanilla JavaScript. The five supplied photos are included. There is no database, analytics, form submission, or paid API. Progress stays in the visitor's browser `localStorage`; Google Fonts are optional and have local font fallbacks.

## Run locally on Windows

Open this repository in VS Code, then run in PowerShell:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe app.py
```

Open **http://127.0.0.1:5000**. Press `Ctrl+C` to stop. The `app.py` development server has debug mode enabled only when run directly. Vercel imports `app` and does not run that block.

## Personalize before sharing

Edit [`config.py`](config.py):

- `HASSAN_NAME`: recipient's name.
- `BESTIE_NAME`: signature, currently “Your Bestie”.
- `WEBSITE_TITLE`: browser title.
- `BIRTHDAY_DATE`: optional private reference, not displayed by default.
- `PERSONAL_MESSAGE`: optional extra paragraph in the story and printable letter.

The printable letter is at `/letter`; its **Print or save as PDF** button opens the browser's print dialog. The final “One more birthday celebration” button resets the candles.

## Import into Vercel

This repository is ready for [Vercel's zero-configuration Flask deployment](https://vercel.com/docs/frameworks/backend/flask). A root `app.py` exports `app = Flask(__name__)`, and `requirements.txt` declares Flask. No `vercel.json`, build command, output directory, or start command is needed.

1. Open [vercel.com/new](https://vercel.com/new) and sign in with GitHub.
2. Import **noah07027-boop/Hassan-Sorry**.
3. Set **Root Directory** to the repository root (the folder containing `app.py`). Leave the detected Flask defaults in place.
4. Deploy, then open the generated URL on a phone.
5. Check the welcome envelope, all five photos, gallery, candles, apology game, mood choices, and `/letter`.

The source assets live in `static/` for local Flask. Matching copies live in `public/static/` for [Vercel's CDN](https://vercel.com/kb/guide/ship-a-flask-app-on-vercel#serve-static-assets-from-the-cdn). Both paths must stay in sync when an asset changes. The templates use Flask `url_for('static', ...)` and produce `/static/...` URLs, which work locally and match the Vercel public copies. All five original photos are included in both folders; none are uploaded to a third-party image service.

**Privacy:** The photos are committed to GitHub as requested. Anyone with access to the repository can see them. Once this project is deployed publicly, the photos at `/static/images/` are also publicly reachable.

## Project layout

```text
app.py                  Flask app and the / and /letter routes
config.py               Editable personal details
requirements.txt        Flask runtime dependency
templates/              Story and printable letter
static/                 Flask development assets, including five photos
public/static/          Identical assets for Vercel's CDN
```
