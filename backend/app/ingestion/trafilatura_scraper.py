import trafilatura

def fetch_page(url: str) -> dict:
    downloaded = trafilatura.fetch_url(url)
    if not downloaded:
        return {"url": url, "error": "fetch_failed", "scraper": "trafilatura"}
    extracted = trafilatura.extract(downloaded, include_links=True, include_formatting=False)
    return {
        "url": url,
        "title": "",
        "html": downloaded,
        "text": extracted or "",
        "scraper": "trafilatura"
    }
