import { create } from "zustand";
interface zipState {
  zipUrl: string | null 
  setZipUrl: (url: string) => void;
}
export const useZipURL = create<zipState>((set) => ({
  zipUrl: null,
  setZipUrl:(url)=>set({zipUrl:url})
}));
