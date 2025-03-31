import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface BookmarkedVehicle {
  id: string;
  brand: string;
  name: string;
  image: string;
  price: number;
  slug: string;
}

interface BookmarkStore {
  bookmarks: BookmarkedVehicle[];
  addBookmark: (vehicle: BookmarkedVehicle) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  clearBookmarks: () => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      
      addBookmark: (vehicle) => set((state) => {
        // Check if already bookmarked to avoid duplicates
        if (state.bookmarks.some(b => b.id === vehicle.id)) {
          return state;
        }
        return { bookmarks: [...state.bookmarks, vehicle] };
      }),
      
      removeBookmark: (id) => set((state) => ({
        bookmarks: state.bookmarks.filter(item => item.id !== id)
      })),
      
      isBookmarked: (id) => {
        return get().bookmarks.some(bookmark => bookmark.id === id);
      },
      
      clearBookmarks: () => set({ bookmarks: [] }),
    }),
    {
      name: 'vehicle-bookmarks',
    }
  )
);
