import { render, screen } from '@testing-library/react';
import SearchPage from './page';

// Mocking fungsi fetch bawaan browser agar test tidak mencoba menelepon Backend beneran
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
) as jest.Mock;

describe('SearchPage UI Tests', () => {
  it('1. Harus menampilkan judul Pencarian Terpadu dengan benar', () => {
    render(<SearchPage />);
    
    // Mengecek apakah teks utama muncul di layar
    const headingText = screen.getByText(/Pencarian/i);
    expect(headingText).toBeInTheDocument();
    
    const subHeadingText = screen.getByText(/Temukan Rekod Berdasarkan Metadata/i);
    expect(subHeadingText).toBeInTheDocument();
  });

  it('2. Harus menampilkan input pencarian dan tombol Cari Berkas', () => {
    render(<SearchPage />);
    
    // Mengecek keberadaan kolom input
    const searchInput = screen.getByPlaceholderText(/Cari berdasarkan judul dokumen atau kode klasifikasi/i);
    expect(searchInput).toBeInTheDocument();

    // Mengecek keberadaan tombol
    const searchButton = screen.getByRole('button', { name: /Cari Berkas/i });
    expect(searchButton).toBeInTheDocument();
  });
});