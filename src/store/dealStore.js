import { create } from "zustand";
import { writeToDb } from "../utilities/firebase";

const useDealStore = create((set) => ({
    deals: null,
    setdeals: (deals) => set({ deals }),
    adddeal: (selecteddealType, deal, user) => set((state) => {
        let deals = { ...state.deals };
        console.log(deals);
        deals[selecteddealType].push(deal);
        // create {dealtype: [deals]} object
        const dealObj = {};
        dealObj[selecteddealType] = deals[selecteddealType];
        writeToDb(`deals`, dealObj);
        writeToDb(`userdata/${user.uid}/deals/${selecteddealType}/${deal.id}`, deal);
        return { deals };
    }),
    categories: [],
    setCategories: (categories) => set({ categories }),
    addcategory: (category) => set((state) => ({ categories: { ...state.categories, [category.id]: category } })),
    user: null,
    setUser: (user) => set({ user }),
    searchQuery: "",
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    favoritedeals: [],
    setFavoritedeals: (favoritedeals) => set({ favoritedeals }),
}));

export default useDealStore;