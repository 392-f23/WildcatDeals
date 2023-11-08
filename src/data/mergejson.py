import json

# Load the business data
with open('src/data/merged_businesses.json', 'r') as file:
    businesses_data = json.load(file)

# Load the logo URLs data
with open('src/data/merged_businesses1.json', 'r') as file:
    logos_data = json.load(file)

# Iterate over the businesses and add/update the logo URLs
for business in businesses_data['businesses']:
    # Find the corresponding logo entry from logos_data
    logo_entry = next((item for item in logos_data['businesses'] if item['name'] == business['name']), None)
    logo = logo_entry['logo'] if logo_entry and 'logo' in logo_entry and logo_entry['logo'] is not None else None

    # Update the business logo if a new logo is found, otherwise, keep the old one or set as None if it doesn't exist
    business['logo'] = logo if logo is not None else business.get('logo', None)

# Save the merged data back to a file
with open('src/data/merged_businesses2.json', 'w') as file:
    json.dump(businesses_data, file, indent=4)
