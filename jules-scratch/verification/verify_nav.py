from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Get the absolute path to the HTML files
        base_dir = os.getcwd()

        # Verify index.html
        page.goto(f"file://{base_dir}/index.html")
        page.screenshot(path="jules-scratch/verification/index.png")

        # Verify Book-List-Generator.html
        page.goto(f"file://{base_dir}/Book-List-Generator.html")
        page.screenshot(path="jules-scratch/verification/book-list-generator.png")

        # Verify Random Task Generator.html
        page.goto(f"file://{base_dir}/Random Task Generator.html")
        page.screenshot(path="jules-scratch/verification/random-task-generator.png")

        # Verify Not at all chores.html
        page.goto(f"file://{base_dir}/Not at all chores.html")
        page.screenshot(path="jules-scratch/verification/not-at-all-chores.png")

        browser.close()

if __name__ == "__main__":
    run()