import json
import requests
from bs4 import BeautifulSoup

# Function to fetch HTML content from a URL
def fetch_html_content(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
    response = requests.get(url, headers=headers)
    response.raise_for_status()  # Raises an HTTPError if the HTTP request returned an unsuccessful status code
    return response.text

# Function to extract all discount data using the identified container class
def extract_discounts_with_images(soup, container_class):
    discounts_data = []

    # Find all discount containers
    discount_containers = soup.find_all(class_=container_class)

    for container in discount_containers:
        # Extract the name and discount description as before
        name_tag = container.find('a', class_='css-1fdgq8f')
        name = name_tag.text if name_tag else None

        discount_description_tag = container.find('h4', itemprop='name')
        discount_description = discount_description_tag.get('title') if discount_description_tag else None

        # Attempt to find the background and company images
        images = container.find_all('img', src=lambda x: x and not x.startswith('data:'))
        background_picture_url = images[0]['src'] if images else None
        company_picture_url = images[1]['src'] if len(images) > 1 else None

        # Compile the discount data
        discount_data = {
            'name': name,
            'background_picture_url': background_picture_url,
            'company_picture_url': company_picture_url,
            'discount_description': discount_description
        }

        discounts_data.append(discount_data)

    return discounts_data

# Main function to process a URL and save the extracted data to a JSON file
def process_url(url, json_output_path):
    # Fetch the HTML content from the URL
    html_content = fetch_html_content(url)

    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')

    # Extract all discounts data with images using the identified container class 'css-1x8046w'
    all_discounts_data = extract_discounts_with_images(soup, 'css-1b0petf')

    # Write the extracted data to a JSON file
    with open(json_output_path, 'w', encoding='utf-8') as json_file:
        json.dump(all_discounts_data, json_file, ensure_ascii=False, indent=4)

    print(f"Data extracted and saved to {json_output_path}")

if __name__ == "__main__":
    url = 'https://www.studentbeans.com/student-discount/us/cats/finance?source=nav'
    json_output_path = 'student_dicounts_finance.json'
    process_url(url, json_output_path)
