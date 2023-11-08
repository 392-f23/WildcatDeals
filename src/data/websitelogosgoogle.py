import requests
import json

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


def save_to_json(data):
    with open('src/data/websitelogos1.json', 'w') as f:
        json.dump(data, f, indent=2)

''' OLD CODE
# Load the JSON data
with open('src/data/data.json', 'r', encoding='utf-8') as f:
    data_str = f.read()
    data = json.loads(data_str)

# Get the logo URLs

start_index = next((index for (index, d) in enumerate(data) if d['name'] == 'Kovet Boutique'), None)

# Check if the start_name exists in the data
if start_index is not None:
    # Create the dictionary only for items starting from the 'start_name'
    logo_urls = {item['name']: get_logo_url(item['name']) for item in data[start_index:]}
    print(logo_urls)
    save_to_json(logo_urls)'''

# Load the main JSON data
with open('src/data/data.json', 'r', encoding='utf-8') as f:
    main_data = json.load(f)

# Load the second JSON data if it exists or create an empty dictionary
try:
    with open('src/data/websitelogos1.json', 'r', encoding='utf-8') as f:
        logo_data = json.load(f)
except FileNotFoundError:
    logo_data = {}

# Get the start index
start_index = next((index for (index, d) in enumerate(main_data) if d['name'] == 'Kovet Boutique'), None)

# Check if the start_name exists in the data
if start_index is not None:
    # Iterate over the items starting from 'start_index' and merge logo URLs
    for item in main_data[start_index:]:
        # Use 'get_logo_url' to fetch the logo URL for each name
        logo_url = get_logo_url(item['name'])
        # Add the logo URL to the item with 'name' in the main data
        item['logo'] = logo_url
        # Also update the logo_data with the new or updated logo URL
        logo_data[item['name']] = logo_url
        
    print(logo_data)

# Now save the updated main_data to a new merged JSON file
save_to_json(main_data)

# You might also want to save the updated logo URLs to the websitelogos1.json
save_to_json(logo_data)