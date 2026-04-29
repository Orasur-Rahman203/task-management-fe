import { create } from "zustand";

interface TaskFiltersState {
  search: string;
  status: string;
  priority: string;
  setSearch: (search: string) => void;
  setStatus: (status: string) => void;
  setPriority: (priority: string) => void;
  resetFilters: () => void;
}

export const useTaskFiltersStore = create<TaskFiltersState>((set) => ({
  search: "",
  status: "",
  priority: "",
  setSearch: (search) => set({ search }),
  setStatus: (status) => set({ status }),
  setPriority: (priority) => set({ priority }),
  resetFilters: () => set({ search: "", status: "", priority: "" }),
}));
