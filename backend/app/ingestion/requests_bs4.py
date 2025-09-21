import requests
from bs4 import BeautifulSoup
import time

HEADERS = {"User-Agent": "JioPay-RAG-Bot/1.0"}

def fetch_page(url: str) -> dict:
    time.sleep(1)  # polite crawling
    r = requests.get(url, headers=HEADERS, timeout=10)
    r.raise_for_status()
    soup = BeautifulSoup(r.text, "html.parser")
    title = soup.title.string if soup.title else ""
    main_text = " ".join([p.get_text(" ", strip=True) for p in soup.find_all("p")])
    return {
        "url": url,
        "title": title,
        "html": r.text,
        "text": main_text,
        "scraper": "requests_bs4"
    }
