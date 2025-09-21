from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

def fetch_page(url: str) -> dict:
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--disable-gpu")
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    driver.get(url)
    # Wait for a unique element or text that means content is loaded
    try:
        WebDriverWait(driver, 20).until(
            EC.text_to_be_present_in_element((By.TAG_NAME, "body"), "Digital payment acceptance made easy")
        )
    except Exception:
        pass
    html = driver.page_source
    soup = BeautifulSoup(html, "html.parser")
    title = soup.title.string if soup.title else ""
    # Extract text from <p>, <div>, and <span> tags
    main_text = " ".join([
        tag.get_text(" ", strip=True)
        for tag in soup.find_all(["p", "div", "span"])
        if tag.get_text(" ", strip=True)
    ])
    driver.quit()
    return {
        "url": url,
        "title": title,
        "html": html,
        "text": main_text,
        "scraper": "selenium"
    }