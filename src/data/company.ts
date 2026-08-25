import type { CompanyProfile } from '../types/content';

export const company: CompanyProfile = {
  name: 'PT Katalis Lintas Global',
  shortName: 'Katalis Lintas Global',
  slogan: 'Kualitas Terjaga, Spesifikasi Anda.',
  heroTitle: 'Pasokan Ikan Berkualitas Konsisten untuk Bisnis Anda',
  heroDescription:
    'Kami menyediakan tuna dan beragam ikan dasar dengan penanganan higienis serta spesifikasi yang dapat disesuaikan untuk kebutuhan distributor dan pedagang besar.',
  about:
    'PT Katalis Lintas Global melayani kebutuhan pasokan ikan skala besar bagi distributor dan pedagang besar di Indonesia dengan fokus pada konsistensi mutu, kebersihan penanganan, dan spesifikasi buyer.',
  contact: {
    whatsappNumber: import.meta.env.PUBLIC_WHATSAPP_NUMBER || '6281319426006',
    primaryContactName: import.meta.env.PUBLIC_WHATSAPP_CONTACT || 'Zuhud',
    secondaryWhatsAppNumber: import.meta.env.PUBLIC_SECONDARY_WHATSAPP_NUMBER || '628151931083',
    secondaryContactName: import.meta.env.PUBLIC_SECONDARY_WHATSAPP_CONTACT || 'Hanggi',
    email: import.meta.env.PUBLIC_COMPANY_EMAIL || undefined,
    address: import.meta.env.PUBLIC_COMPANY_ADDRESS || 'Muara Baru, Jakarta Utara',
    operatingHours: import.meta.env.PUBLIC_OPERATING_HOURS || undefined,
    mapUrl: import.meta.env.PUBLIC_MAP_URL || undefined,
  },
  proofs: [
    {
      title: 'Kualitas Konsisten',
      description: 'Standar mutu dijaga pada setiap tahap penanganan produk.',
      evidence: 'Didukung proses sortasi, grading, dan dokumentasi produk.',
      icon: 'quality',
    },
    {
      title: 'Spesifikasi Buyer',
      description: 'Kebutuhan produk dibahas sesuai karakter bisnis setiap buyer.',
      evidence: 'Ukuran, bentuk, kondisi, dan pengemasan dapat didiskusikan.',
      icon: 'specification',
    },
    {
      title: 'Penanganan Higienis',
      description: 'Kebersihan menjadi bagian penting dari proses operasional.',
      evidence: 'Didukung fasilitas, prosedur penanganan, dan dokumentasi kepatuhan.',
      icon: 'hygiene',
    },
  ],
  process: [
    { number: '01', title: 'Penerimaan', description: 'Produk diterima dan dicatat sebelum memasuki proses penanganan.' },
    { number: '02', title: 'Sortasi & Grading', description: 'Produk dikelompokkan berdasarkan mutu dan spesifikasi yang relevan.' },
    { number: '03', title: 'Penanganan Higienis', description: 'Proses dilakukan dengan perhatian pada kebersihan area dan produk.' },
    { number: '04', title: 'Penyimpanan Dingin', description: 'Produk dijaga dalam rantai dingin sebelum pengemasan dan distribusi.' },
    { number: '05', title: 'Pengemasan & Distribusi', description: 'Pengemasan dan pengiriman disiapkan sesuai kebutuhan yang disepakati.' },
  ],
};
