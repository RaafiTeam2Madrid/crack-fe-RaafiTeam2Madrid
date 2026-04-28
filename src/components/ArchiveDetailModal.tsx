'use client';

interface Archive {
  id: string;
  code: string;
  title: string;
  category: string;
  description: string;
  uploadDate: string;
}

export default function ArchiveDetailModal({ archive, onClose }: { archive: Archive, onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all">
        {/* Header Modal */}
        <div className="bg-blue-800 p-4 text-white flex justify-between items-center">
          <h3 className="text-lg font-bold">Metadata Dublin Core (Detail)</h3>
          <button onClick={onClose} className="text-2xl hover:text-gray-300 leading-none">×</button>
        </div>
        
        {/* Konten Detail */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-3">
            <span className="text-gray-500 text-sm font-medium">Judul (Title)</span>
            <span className="col-span-2 text-gray-900 font-bold">{archive.title}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-3">
            <span className="text-gray-500 text-sm font-medium">Klasifikasi (Subject)</span>
            <span className="col-span-2 text-blue-700 font-mono font-semibold">{archive.code}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-3">
            <span className="text-gray-500 text-sm font-medium">Kategori</span>
            <span className="col-span-2">
               <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold uppercase">
                {archive.category}
               </span>
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-3">
            <span className="text-gray-500 text-sm font-medium">Deskripsi & Pencipta</span>
            <span className="col-span-2 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
              {archive.description}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <span className="text-gray-500 text-sm font-medium">Tanggal Registrasi</span>
            <span className="col-span-2 text-gray-600 text-sm">
              {new Date(archive.uploadDate).toLocaleString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })} WIB
            </span>
          </div>
        </div>
        
        {/* Footer Modal */}
        <div className="bg-gray-50 p-4 flex justify-end">
          <button 
            onClick={onClose} 
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}