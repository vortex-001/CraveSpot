# tests/capture_website_screenshots.py
import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service

def capture_screenshots():
    out_dir = os.path.join(os.path.dirname(__file__), "test_images")
    os.makedirs(out_dir, exist_ok=True)

    chrome_options = Options()
    chrome_options.add_argument("--headless=new")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1400,900")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")

    print("[*] Launching Headless Chrome WebDriver...")
    driver = webdriver.Chrome(options=chrome_options)

    pages = [
        ("01_distance_range_filtering.png", "http://127.0.0.1:5500/pages/restaurants.html", "Restaurants & Distance Filters"),
        ("02_craving_dishes_matrix.png", "http://127.0.0.1:5500/pages/dishes.html", "Dishes & Craving Moods"),
        ("03_interactive_food_map.png", "http://127.0.0.1:5500/index.html", "CraveSpot Homepage & Discovery"),
        ("04_user_profile_dashboard.png", "http://127.0.0.1:5500/pages/dish-details.html?id=1", "Dish Details & Highlights"),
        ("05_e2e_verification_report.png", "http://127.0.0.1:5500/pages/categories.html", "Categories & Regional Cuisines")
    ]

    for filename, url, desc in pages:
        filepath = os.path.join(out_dir, filename)
        print(f"[*] Navigating to {url} ({desc})...")
        driver.get(url)
        time.sleep(2.5)  # Allow DOM and API data to populate
        driver.save_screenshot(filepath)
        size_kb = os.path.getsize(filepath) / 1024
        print(f"    ✓ Captured {filename} ({size_kb:.1f} KB)")

    driver.quit()
    print("[*] All live website screenshots successfully captured!")

if __name__ == "__main__":
    capture_screenshots()
