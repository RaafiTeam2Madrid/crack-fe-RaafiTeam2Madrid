import { render, screen } from "@testing-library/react";
import DisposalPage from "./page";

// MOCK: Meniru respon API Backend
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  }),
) as jest.Mock;

// MOCK: Mengelabui library jsPDF agar tidak error mencari browser asli
jest.mock("jspdf", () => {
  return jest.fn().mockImplementation(() => ({
    text: jest.fn(),
    save: jest.fn(),
    autoTable: jest.fn(),
  }));
});

describe("Disposal Page UI Tests", () => {
  it("1. Harus menampilkan Tab Eksekusi dan Tab Berita Acara", async () => {
    render(<DisposalPage />);

    expect(
      await screen.findByText(/Manajemen Jadwal Retensi dan Eksekusi Rekod/i),
    ).toBeInTheDocument();

    // Mengecek apakah tombol/tab navigasi dirender dengan benar
    expect(
      await screen.findByRole("button", { name: /Antrean Eksekusi/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("button", { name: /Berita Acara/i }),
    ).toBeInTheDocument();
  });
});
