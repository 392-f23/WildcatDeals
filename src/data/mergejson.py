import json

# Load the business data
with open('src/data/merged_businesses2.json', 'r') as file:
    businesses_data = json.load(file)

# Load the logo URLs data
with open('src/data/websitelogos2.json', 'r') as file:
    logos_data = json.load(file)

# Check whether logos_data contains a 'businesses' dictionary or is a dictionary of names directly
if 'businesses' in logos_data:
    # If logos_data has a 'businesses' key, use it to create logos_dict
    logos_dict = {business['name']: business['logo'] for business in logos_data['businesses'] if 'logo' in business}
else:
    # If logos_data is a dictionary of names, use it directly
    logos_dict = logos_data

# Iterate over the businesses and add the logo URLs
for business in businesses_data['businesses']:
    # Find the logo based on the business name, use None if not found
    business_name = business['name']
    logo = logos_dict.get(business_name)

    # If there's a logo in the logos data and it's not None, update it
    if logo is not None:
        business['logo'] = logo
    # If there's no logo in the logos data but the business already has a logo, keep it
    elif 'logo' in business and business['logo'] is not None:
        continue
    # If there's no logo in either, you might want to set a default or leave it as None
    else:
        business['logo'] = None  # or some default placeholder

# Save the merged data back to a file
with open('src/data/merged_businesses3.json', 'w') as file:
    json.dump(businesses_data, file, indent=4)
