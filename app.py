"""A small Flask wrapper around a private, browser-local friendship story."""

import os

from flask import Flask, render_template

import config

app = Flask(__name__)


@app.context_processor
def template_config():
    return {
        "hassan_name": config.HASSAN_NAME,
        "bestie_name": config.BESTIE_NAME,
        "website_title": config.WEBSITE_TITLE,
        "personal_message": config.PERSONAL_MESSAGE,
    }


@app.get("/")
def index():
    return render_template("index.html")


@app.get("/letter")
def letter():
    return render_template("letter.html")


if __name__ == "__main__":
    # Vercel imports ``app`` above; this development server never runs there.
    app.run(host="127.0.0.1", port=int(os.environ.get("PORT", "5000")), debug=True)
