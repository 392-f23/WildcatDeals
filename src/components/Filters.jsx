import React, { useState, useEffect } from 'react';
import { CheckboxGroup, Checkbox } from '@nextui-org/react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';
import useDealsStore from '../utilities/stores';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name, selectedNames, theme) {
    return {
        fontWeight:
            selectedNames.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const Filters = ({ deals, setFilteredDeals }) => {
    const theme = useTheme();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedAudiences, setSelectedAudiences] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);
    const setSearchQuery = useDealsStore((state) => state.setSearchQuery);
    const searchQuery = useDealsStore((state) => state.searchQuery);

    // Unique categories, audiences, and cities derived from the deals
    let uniqueCategories = Array.from(new Set(deals.flatMap(deal => deal.categories)));
    let uniqueAudiences = Array.from(new Set(deals.flatMap(deal => deal.audience)));
    let uniqueCities = Array.from(new Set(deals.flatMap(deal => deal.city)));

    uniqueCategories = uniqueCategories.filter(category => category !== '');
    uniqueAudiences = uniqueAudiences.filter(audience => audience !== '');
    uniqueCities = uniqueCities.filter(city => city !== '');

    const applyFilters = () => {
        let filtered = deals;

        // Filter by categories
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(deal => deal.categories.some(cat => selectedCategories.includes(cat)));
        }

        // Filter by audience
        if (selectedAudiences.length > 0) {
            filtered = filtered.filter(deal => selectedAudiences.some(audience => deal.audience.includes(audience)));
        }

        // Filter by city
        if (selectedCities.length > 0) {
            filtered = filtered.filter(deal => selectedCities.some(city => deal.city.includes(city)));
        }

        // Filter by search query if not empty or whitespace
        if (searchQuery.trim() !== '') {
            // Look though the title, description, website, phone, and address (they may be undefined)
            filtered = filtered.filter(deal => {
                const title = deal.name ?? '';
                const description = deal.description ?? '';
                const website = deal.website ?? '';
                const phone = deal.phone ?? '';
                const address = deal.address ?? '';

                // Check if any of the above contain the search query
                return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    website.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    address.toLowerCase().includes(searchQuery.toLowerCase());
            }
            );
        }

        setFilteredDeals(filtered);
    };

    // Whenever a filter changes, apply the filters again
    useEffect(() => {
        applyFilters();
    }, [selectedCategories, selectedAudiences, selectedCities, searchQuery]);

    // When first loading the page, set the search query to empty
    useEffect(() => {
        setSearchQuery('');
    }, []);

    return (
        <Box className="filters-container flex flex-col items-center mt-10 px-6 md:px-12">
            <CheckboxGroup
                label="Select categories"
                orientation="horizontal"
                color="secondary"
                defaultValue={[]}
                onChange={setSelectedCategories}
                className='hidden md:flex mb-4'
            >
                {uniqueCategories.map((category) => (
                    <Checkbox key={category} value={category}>{category}</Checkbox>
                ))}
            </CheckboxGroup>

            <Box className="flex flex-col md:flex-row justify-between w-full gap-2">
                <div className='sm:hidden w-full'>
                    <FormControl fullWidth>
                        <InputLabel id="category-multiple-chip-label">Select Categories</InputLabel>
                        <Select
                            labelId="category-multiple-chip-label"
                            id="category-multiple-chip"
                            multiple
                            value={selectedCategories}
                            onChange={(e) => setSelectedCategories(e.target.value)}
                            input={<OutlinedInput id="select-multiple-category-chip" label="Select Categories" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                        >
                            {uniqueCategories.map((category) => (
                                <MenuItem
                                    key={category}
                                    value={category}
                                    style={getStyles(category, selectedCategories, theme)}
                                >
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                <FormControl fullWidth className="md:w-1/2 md:pr-2">
                    <InputLabel id="audience-multiple-chip-label">Select Audience</InputLabel>
                    <Select
                        labelId="audience-multiple-chip-label"
                        id="audience-multiple-chip"
                        multiple
                        value={selectedAudiences}
                        onChange={(e) => setSelectedAudiences(e.target.value)}
                        input={<OutlinedInput id="select-multiple-audience-chip" label="Select Audience" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >
                        {uniqueAudiences.map((audience) => (
                            <MenuItem
                                key={audience}
                                value={audience}
                                style={getStyles(audience, selectedAudiences, theme)}
                            >
                                {audience}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth className="md:w-1/2 md:pr-2">
                    <InputLabel id="city-multiple-chip-label">Select City</InputLabel>
                    <Select
                        labelId="city-multiple-chip-label"
                        id="city-multiple-chip"
                        multiple
                        value={selectedCities}
                        onChange={(e) => setSelectedCities(e.target.value)}
                        input={<OutlinedInput id="select-multiple-city-chip" label="Select City" />}
                        renderValue={(selected) => (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} />
                                ))}
                            </Box>
                        )}
                        MenuProps={MenuProps}
                    >
                        {uniqueCities.map((city) => (
                            <MenuItem
                                key={city}
                                value={city}
                                style={getStyles(city, selectedCities, theme)}
                            >
                                {city}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </Box>
    );
};

export default Filters;
