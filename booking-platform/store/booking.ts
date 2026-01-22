import { create } from "zustand";

interface BookingState {
  selectedProviderId: string | null;
  selectedDate: string | null;
  selectedTime: string | null;
  serviceAddress: string;
  problemDescription: string;
  setSelectedProvider: (id: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedTime: (time: string) => void;
  setServiceAddress: (address: string) => void;
  setProblemDescription: (description: string) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedProviderId: null,
  selectedDate: null,
  selectedTime: null,
  serviceAddress: "",
  problemDescription: "",
  setSelectedProvider: (id) => set({ selectedProviderId: id }),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedTime: (time) => set({ selectedTime: time }),
  setServiceAddress: (address) => set({ serviceAddress: address }),
  setProblemDescription: (description) =>
    set({ problemDescription: description }),
  resetBooking: () =>
    set({
      selectedProviderId: null,
      selectedDate: null,
      selectedTime: null,
      serviceAddress: "",
      problemDescription: "",
    }),
}));
