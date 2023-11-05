import { create } from "zustand";

const useDealsStore = create((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    searchQuery: "",
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    business: null,
    setBusiness: (business) => set({ business }),
    favoriteDeals: [],
    setFavoriteDeals: (favoriteDeals) => set({ favoriteDeals }),
}));

export default useDealsStore;