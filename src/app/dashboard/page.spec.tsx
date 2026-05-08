import { render, screen } from "@testing-library/react";
import DashboardPage from "./page";

// MOCK: Mengelabui sistem agar komponen grafik (Recharts) tidak error saat di-test tanpa browser asli
jest.mock("recharts", () => {
  const OriginalModule = jest.requireActual("recharts");
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    BarChart: () => <div>BarChart Mock</div>,
    Bar: () => <div>Bar</div>,
    XAxis: () => <div>XAxis</div>,
    Tooltip: () => <div>Tooltip</div>,
  };
});

// MOCK: Mengelabui fungsi Link dari Next.js
jest.mock("next/link", () => {
  return ({ children }: any) => {
    return <a>{children}</a>;
  };
});

// MOCK: Meniru respon API Backend
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  }),
) as jest.Mock;

describe("Dashboard HomePage UI Tests", () => {
  beforeEach(() => {
    // Kosongkan cookie sebelum setiap tes dijalankan
    Object.defineProperty(window.document, "cookie", {
      writable: true,
      value: "",
    });
    jest.clearAllMocks();
  });

  it("1. Tampilan ADMIN: Harus menampilkan analitik Total Arsip", async () => {
    // Simulasi login sebagai Admin
    window.document.cookie = "userRole=ADMIN; userName=Aditya Raafi Yudhatama";
    render(<DashboardPage />);

    // Ekspektasi: Harus menemukan teks Total Arsip
    expect(await screen.findByText(/Total Arsip/i)).toBeInTheDocument();
  });

  it("2. Tampilan STAFF: Harus menampilkan portal peminjaman dan menyembunyikan analitik", async () => {
    // Simulasi login sebagai Staf
    window.document.cookie = "userRole=STAFF; userName=Akun Staf";
    render(<DashboardPage />);

    // Ekspektasi: Harus menemukan teks Portal Layanan
    expect(
      await screen.findByText(/Portal Layanan Peminjaman Rekod/i),
    ).toBeInTheDocument();
    expect(await screen.findByText(/Tiket Aktif Anda/i)).toBeInTheDocument();

    // Ekspektasi: Teks Total Arsip milik Admin TIDAK BOLEH bocor ke Staf
    expect(screen.queryByText(/Total Arsip/i)).not.toBeInTheDocument();
  });
});
