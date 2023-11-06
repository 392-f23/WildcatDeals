from selenium import webdriver
from bs4 import BeautifulSoup
import requests
import json
from selenium.common.exceptions import UnexpectedAlertPresentException
from selenium.webdriver.common.alert import Alert
import json

def get_websites(file):
    # Load the JSON data from a file
    import json

    # Load the JSON data from a file
    with open(file, 'r', encoding='utf-8') as f:
        data_str = f.read()

    # Try parsing the string to JSON
    try:
        data = json.loads(data_str)
    except json.JSONDecodeError as e:
        print(f"Failed to decode JSON: {e}")
        data = []

    # Check the type of the data variable again
    print(type(data))

    # Initialize an empty list to store the website URLs
    websites = []

    # Assuming data is a list of dictionaries
    if isinstance(data, list):
        # Iterate through the data and extract the website URLs
        for item in data:
            website = item.get('website')  # Using get() to avoid KeyError if 'website' key is missing
            if website:
                websites.append(website)

    # Now 'websites' is a list of website URLs
    print(websites)

    return websites



def get_logo_url_soup(url):
    driver = webdriver.Chrome()
    try:
        driver.get(url)
        driver.implicitly_wait(10)
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        # Attempt to find logo by common HTML/CSS patterns
        logo_img = (soup.find("img", {"class": "logo"}) or
                    soup.find("img", {"id": "logo"}) or
                    soup.find("img", alt="logo"))
        if logo_img:
            logo_url = logo_img['src']
            # Handle relative URLs
            if logo_url.startswith('/'):
                from urllib.parse import urljoin
                logo_url = urljoin(url, logo_url)
            print(f'Logo URL found for {url}: {logo_url}')
            return logo_url
        else:
            print(f'No logo found for {url}')
            return None
        # ... rest of your code to extract the logo ...
    except UnexpectedAlertPresentException:
        print(f"Unexpected alert on {url}, dismissing and skipping.")
        Alert(driver).dismiss()
    finally:
        driver.quit()

    return None  # Return None if no logo found

def save_to_json(data):
    with open('src/data/data1.json', 'w') as f:
        json.dump(data, f, indent=2)


def get_logo_url(company_name):
    api_key = 'AIzaSyAwv7dJ1ODeLX3SA5YGSbYmVwV6kKqt-8I'
    cse_id = 'a65663bbebdb44eb2'
    query = f'{company_name} logo'

    url = f'https://www.googleapis.com/customsearch/v1?q={query}&key={api_key}&cx={cse_id}&searchType=image'
    response = requests.get(url)
    response_json = response.json()

    # Check for errors in the response
    if 'error' in response_json:
        print(f'Error: {response_json["error"]["message"]}')
        return None

    # Check for empty search results
    if 'items' not in response_json:
        print(f'No search results for {company_name}')
        return None

    # Get the link of the first image result
    logo_url = response_json['items'][0]['link']
    return logo_url

# Load the JSON data


# Get the logo URLs
if __name__ == "__main__":
    with open('data.json', 'r', encoding='utf-8') as f:
        data_str = f.read()
        data = json.loads(data_str)
        logo_urls = {item['name']: get_logo_url(item['name']) for item in data}
        print(logo_urls)


#if __name__ == "__main__":
#    print("got here")
    # Example usage:
#    websites = get_websites("src/data/data.json")
#    logo_urls = {website: get_logo_url(website) for website in websites}

#    save_to_json(logo_urls)


key = ""