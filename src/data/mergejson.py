import json

# Load the business data
with open('src/data/merged_businesses.json', 'r') as file:
    businesses_data = json.load(file)

# Load the logo URLs data
with open('src/data/websitelogos.json', 'r') as file:
    logos_data = json.load(file)

# Iterate over the businesses and add the logo URLs
for business in businesses_data['businesses']:
    # Use get to return None if the business name is not found in the logos_data
    business['logo'] = logos_data.get(business['name'])

# Save the merged data back to a file
with open('src/data/merged_businesses1.json', 'w') as file:
    json.dump(businesses_data, file, indent=4)