'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  QrCode,
  MapPin,
  Shield,
  Users,
  CheckCircle,
  BarChart3,
  Bell,
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  Star,
  Zap,
  Eye,
  FileCheck,
  Smartphone,
  Globe,
  Clock,
  TrendingUp,
  UserCheck,
  AlertCircle,
  ChevronRight
} from 'lucide-react'

// ── Animated Counter ──────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 2000
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target])

  return (
    <span>
      {count.toLocaleString('id-ID')}
      {suffix}
    </span>
  )
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Fitur', href: '#fitur' },
    { label: 'Cara Kerja', href: '#cara-kerja' },
    { label: 'Peran Pengguna', href: '#peran' },
    { label: 'FAQ', href: '#faq' }
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Logo SIMPAN" className="w-9 h-9 rounded-xl object-cover" />
            <span
              className={`font-bold tracking-tight transition-colors ${scrolled ? 'text-[#1E293B]' : 'text-white'}`}
              style={{ fontSize: '1.125rem' }}>
              SIMPAN
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  scrolled
                    ? 'text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                scrolled ? 'text-[#2563EB] hover:bg-blue-50' : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}>
              Masuk
            </Link>
            <Link
              href="/daftar"
              className="px-5 py-2 bg-[#2563EB] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
              Daftar Sekarang
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-[#1E293B] hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-lg text-[#1E293B] hover:bg-blue-50 hover:text-[#2563EB] text-sm font-medium transition-colors">
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
              <Link
                href="/login"
                className="px-4 py-3 rounded-lg text-[#2563EB] hover:bg-blue-50 text-sm font-medium text-center transition-colors">
                Masuk
              </Link>
              <Link
                href="/daftar"
                className="px-4 py-3 bg-[#2563EB] text-white rounded-lg text-sm font-medium text-center hover:bg-blue-700 transition-colors">
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

// ── Hero Section ──────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#1D4ED8]">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-900/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-blue-400/10 rounded-full blur-2xl" />
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-28 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Text */}
          <div className="text-white">
            <h1
              className="text-white mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 700, lineHeight: 1.2 }}>
              Penyaluran Bantuan Sosial yang <span className="text-yellow-300">Tepat Sasaran</span>
            </h1>

            <p className="text-white/80 mb-8 max-w-xl" style={{ fontSize: '1.125rem', lineHeight: 1.7 }}>
              SIMPAN menghadirkan teknologi QR Code untuk memastikan bantuan sosial sampai ke penerima yang berhak —
              transparan, akurat, dan bebas dari penyimpangan.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link
                href="/daftar"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#2563EB] rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Daftar Sebagai Masyarakat
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#cara-kerja"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20 backdrop-blur-sm">
                <Eye className="w-4 h-4" />
                Lihat Cara Kerja
              </a>
            </div>
          </div>

          {/* Right — App Preview */}
          <div className="relative">
            {/* Main card mockup */}
            <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-2xl">
              {/* Mock header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#2563EB] rounded-lg flex items-center justify-center">
                    <QrCode className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white font-semibold text-sm">Dashboard Masyarakat</span>
                </div>
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Status card */}
              <div className="bg-white/10 rounded-2xl p-4 mb-4 border border-white/10">
                <p className="text-white/60 text-xs mb-1">Nomor Pengajuan</p>
                <p className="text-white font-semibold text-sm mb-2">PNG-2025-00247</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-400/20 text-green-300 rounded-full text-xs border border-green-400/30">
                  <CheckCircle className="w-3 h-3" />
                  Disetujui
                </span>
              </div>

              {/* QR Code mock */}
              <div className="bg-white rounded-2xl p-4 text-center mb-4">
                <div className="w-28 h-28 mx-auto mb-2 relative">
                  {/* Stylized QR pattern */}
                  <div className="w-full h-full grid grid-cols-7 gap-0.5">
                    {Array.from({ length: 49 }, (_, i) => {
                      const corners = [
                        0, 1, 2, 3, 4, 5, 6, 7, 13, 14, 20, 21, 27, 28, 34, 35, 41, 42, 43, 44, 45, 46, 47, 48
                      ]
                      const inner = [
                        8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29, 30, 31, 32, 33, 36, 37, 38, 39, 40
                      ]
                      const filled = i % 3 === 0 || i % 7 === 0 || corners.includes(i)
                      return <div key={i} className={`rounded-sm ${filled ? 'bg-[#1E293B]' : 'bg-gray-100'}`} />
                    })}
                  </div>
                </div>
                <p className="text-[#64748B] text-xs">Tunjukkan ke Petugas</p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Periode', value: "Apr '25", color: 'bg-blue-400/20 text-blue-200' },
                  { label: 'Distribusi', value: 'Aktif', color: 'bg-green-400/20 text-green-200' },
                  { label: 'Notifikasi', value: '3 Baru', color: 'bg-yellow-400/20 text-yellow-200' }
                ].map((stat) => (
                  <div key={stat.label} className={`${stat.color} rounded-xl p-2.5 text-center`}>
                    <p className="text-xs opacity-70 mb-0.5">{stat.label}</p>
                    <p className="font-semibold text-xs">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating scan card */}
            <div className="absolute -right-4 top-1/4 bg-white rounded-2xl shadow-xl p-4 w-44 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-[#1E293B] text-xs font-semibold">Scan Berhasil</span>
              </div>
              <p className="text-[#64748B] text-xs">Shafa Rabbani</p>
              <p className="text-[#64748B] text-xs">3275 ************</p>
              <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-4/5 bg-green-500 rounded-full" />
              </div>
            </div>

            {/* Floating notif */}
            <div className="absolute -left-4 bottom-1/4 bg-white rounded-2xl shadow-xl p-3 w-48 border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bell className="w-4 h-4 text-[#2563EB]" />
                </div>
                <div>
                  <p className="text-[#1E293B] text-xs font-semibold">Notifikasi</p>
                  <p className="text-[#64748B] text-xs">QR Code siap digunakan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Stats Section ─────────────────────────────────────────────────────────────
function StatsSection() {
  const stats = [
    { value: 125000, suffix: '+', label: 'Penerima Terdaftar', icon: Users, color: '#2563EB' },
    { value: 98, suffix: '%', label: 'Akurasi Distribusi', icon: TrendingUp, color: '#16A34A' },
    { value: 34, suffix: ' Kab/Kota', label: 'Wilayah Terjangkau', icon: MapPin, color: '#D97706' },
    { value: 12500, suffix: '+', label: 'Distribusi Berhasil', icon: CheckCircle, color: '#7C3AED' }
  ]

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={stat.label}>
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: stat.color + '15' }}>
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <div className="mb-1" style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1E293B' }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-[#64748B] text-sm">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Features Section ──────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    {
      icon: QrCode,
      title: 'Verifikasi QR Code Instan',
      desc: 'Setiap penerima mendapatkan QR Code unik yang terenkripsi. Petugas lapangan hanya perlu memindai untuk memverifikasi identitas dalam hitungan detik.',
      color: '#2563EB',
      bg: '#EFF6FF'
    },
    {
      icon: Shield,
      title: 'Anti-Duplikasi & Anti-Fraud',
      desc: 'Sistem otomatis mendeteksi dan mencegah penerimaan ganda. Setiap distribusi tercatat real-time sehingga tidak ada bantuan yang diterima dua kali.',
      color: '#DC2626',
      bg: '#FEF2F2'
    },
    {
      icon: MapPin,
      title: 'Monitoring Peta Real-Time',
      desc: 'Admin dapat memantau progres distribusi di seluruh wilayah melalui peta interaktif. Setiap titik distribusi tervisualisasi secara langsung.',
      color: '#16A34A',
      bg: '#F0FDF4'
    },
    {
      icon: FileCheck,
      title: 'Pengajuan Online Mudah',
      desc: 'Masyarakat dapat mengajukan bantuan sosial secara online dengan mengisi data diri dan mengunggah foto kondisi rumah. Proses mudah dan cepat.',
      color: '#D97706',
      bg: '#FFFBEB'
    },
    {
      icon: Bell,
      title: 'Notifikasi Status Real-Time',
      desc: 'Penerima mendapatkan notifikasi langsung ketika status pengajuan berubah — dari menunggu, ditinjau, disetujui, hingga QR Code siap digunakan.',
      color: '#7C3AED',
      bg: '#F5F3FF'
    },
    {
      icon: BarChart3,
      title: 'Laporan & Analitik Lengkap',
      desc: 'Admin mendapatkan laporan komprehensif tentang progres distribusi, statistik penerima, dan kinerja petugas lapangan dalam satu dashboard.',
      color: '#0891B2',
      bg: '#ECFEFF'
    }
  ]

  return (
    <section id="fitur" className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-[#2563EB] rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Fitur Unggulan
          </span>
          <h2 className="text-[#1E293B] mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700 }}>
            Semua yang Anda Butuhkan dalam Satu Platform
          </h2>
          <p className="text-[#64748B] max-w-2xl mx-auto" style={{ fontSize: '1.0625rem', lineHeight: 1.7 }}>
            SIMPAN dirancang untuk memenuhi kebutuhan semua pihak — dari masyarakat penerima hingga admin pusat — dengan
            antarmuka yang mudah digunakan.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 group h-full">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: feat.bg }}>
                <feat.icon className="w-6 h-6" style={{ color: feat.color }} />
              </div>
              <h3 className="text-[#1E293B] mb-2" style={{ fontSize: '1rem', fontWeight: 600 }}>
                {feat.title}
              </h3>
              <p className="text-[#64748B] text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── How It Works ──────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState(0)

  const roles = [
    {
      name: 'Masyarakat',
      icon: Users,
      color: '#2563EB',
      steps: [
        {
          step: '01',
          title: 'Daftar Akun',
          desc: 'Buat akun dengan data email dan nomor telepon Anda.'
        },
        {
          step: '02',
          title: 'Lengkapi Profil',
          desc: 'Isi data diri, data ekonomi, dan unggah 8 foto kondisi rumah.'
        },
        {
          step: '03',
          title: 'Kirim Pengajuan',
          desc: 'Tinjau data dan kirimkan pengajuan bantuan sosial Anda.'
        },
        {
          step: '04',
          title: 'Terima QR Code',
          desc: 'Setelah disetujui, QR Code unik akan tersedia di dashboard Anda.'
        },
        {
          step: '05',
          title: 'Ambil Bantuan',
          desc: 'Tunjukkan QR Code kepada petugas saat jadwal distribusi.'
        }
      ]
    },
    {
      name: 'Petugas Lapangan',
      icon: UserCheck,
      color: '#16A34A',
      steps: [
        {
          step: '01',
          title: 'Login & Cek Penugasan',
          desc: 'Masuk ke sistem dan lihat detail wilayah dan periode penugasan.'
        },
        {
          step: '02',
          title: 'Mulai Scan QR',
          desc: 'Buka kamera scan dan arahkan ke QR Code penerima bantuan.'
        },
        {
          step: '03',
          title: 'Verifikasi Identitas',
          desc: 'Sistem menampilkan identitas penerima dan status penerimaan.'
        },
        {
          step: '04',
          title: 'Konfirmasi Distribusi',
          desc: 'Konfirmasi penyerahan bantuan dengan menekan tombol konfirmasi.'
        },
        {
          step: '05',
          title: 'Lihat Riwayat',
          desc: 'Semua distribusi tercatat otomatis di riwayat distribusi Anda.'
        }
      ]
    },
    {
      name: 'Admin',
      icon: Shield,
      color: '#7C3AED',
      steps: [
        {
          step: '01',
          title: 'Tinjau Pengajuan',
          desc: 'Review data dan foto kondisi rumah dari setiap pengajuan masuk.'
        },
        {
          step: '02',
          title: 'Setujui / Tolak',
          desc: 'Berikan keputusan pada setiap pengajuan disertai catatan.'
        },
        {
          step: '03',
          title: 'Buat Periode Bansos',
          desc: 'Buat periode distribusi baru dengan nama, jenis, dan jadwal.'
        },
        {
          step: '04',
          title: 'Tugaskan Petugas',
          desc: 'Tetapkan petugas lapangan untuk setiap wilayah distribusi.'
        },
        {
          step: '05',
          title: 'Monitor Distribusi',
          desc: 'Pantau progres real-time melalui dashboard dan peta interaktif.'
        }
      ]
    }
  ]

  const active = roles[activeTab]

  return (
    <section id="cara-kerja" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-[#16A34A] rounded-full text-sm font-medium mb-4">
            <Clock className="w-4 h-4" />
            Cara Kerja
          </span>
          <h2 className="text-[#1E293B] mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700 }}>
            Proses Mudah untuk Semua Peran
          </h2>
          <p className="text-[#64748B] max-w-xl mx-auto">Pilih peran Anda untuk melihat bagaimana SIMPAN bekerja.</p>
        </div>

        {/* Tab selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {roles.map((role, i) => (
            <button
              key={role.name}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === i ? 'text-white shadow-md' : 'bg-gray-100 text-[#64748B] hover:bg-gray-200'
              }`}
              style={activeTab === i ? { backgroundColor: role.color } : {}}>
              <role.icon className="w-4 h-4" />
              {role.name}
            </button>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {active.steps.map((step, i) => (
          <div key={step.step} className="relative">
            {/* Connector line */}
            {i < active.steps.length - 1 && (
              <div
                className="hidden lg:block absolute top-6 left-[calc(100%-8px)] w-full h-0.5 z-0"
                style={{ backgroundColor: active.color + '30' }}
              />
            )}
            <div className="relative bg-[#F8FAFC] rounded-2xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all h-full">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-white text-sm font-bold"
                style={{ backgroundColor: active.color }}>
                {step.step}
              </div>
              <h4 className="text-[#1E293B] mb-1.5" style={{ fontSize: '0.9375rem', fontWeight: 600 }}>
                {step.title}
              </h4>
              <p className="text-[#64748B] text-sm leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── User Roles Section ────────────────────────────────────────────────────────
function UserRolesSection() {
  const roles = [
    {
      icon: Users,
      role: 'Masyarakat',
      title: 'Ajukan Bantuan dengan Mudah',
      desc: 'Daftarkan diri dan ajukan permohonan bantuan sosial secara online. Pantau status pengajuan dan gunakan QR Code untuk menerima bantuan.',
      color: '#2563EB',
      bg: 'from-blue-500 to-blue-700',
      features: [
        'Registrasi & pengajuan online',
        'Tracking status real-time',
        'QR Code digital unik',
        'Notifikasi otomatis',
        'Riwayat penerimaan bantuan'
      ],
      cta: 'Daftar Sekarang',
      link: '/daftar',
      image: 'https://images.unsplash.com/photo-1722252799188-87e1db708544?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400'
    },
    {
      icon: UserCheck,
      role: 'Petugas Lapangan',
      title: 'Distribusi Lebih Cepat & Akurat',
      desc: 'Verifikasi penerima bantuan hanya dengan scan QR Code. Tidak ada lagi antrian panjang atau kesalahan identitas di lapangan.',
      color: '#16A34A',
      bg: 'from-green-500 to-green-700',
      features: [
        'Scan QR Code real-time',
        'Deteksi otomatis duplikat',
        'Riwayat distribusi lengkap',
        'Input manual sebagai backup',
        'Dashboard penugasan harian'
      ],
      cta: 'Masuk sebagai Petugas',
      link: '/login',
      image: 'https://images.unsplash.com/photo-1742302212525-d0e8b63ed7f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400'
    },
    {
      icon: Shield,
      role: 'Admin',
      title: 'Kelola & Monitor Seluruh Distribusi',
      desc: 'Dashboard lengkap untuk mengelola pengajuan, periode distribusi, penugasan petugas, dan memantau seluruh proses secara real-time.',
      color: '#7C3AED',
      bg: 'from-purple-500 to-purple-700',
      features: [
        'Review & verifikasi pengajuan',
        'Manajemen periode distribusi',
        'Penugasan petugas lapangan',
        'Monitoring peta interaktif',
        'Laporan & analitik lengkap'
      ],
      cta: 'Masuk sebagai Admin',
      link: '/login',
      image: 'https://images.unsplash.com/photo-1686061592689-312bbfb5c055?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400'
    }
  ]

  return (
    <section id="peran" className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-purple-100 text-[#7C3AED] rounded-full text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            Peran Pengguna
          </span>
          <h2 className="text-[#1E293B] mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700 }}>
            Dirancang untuk Semua Pihak
          </h2>
          <p className="text-[#64748B] max-w-xl mx-auto">
            Satu platform, tiga peran dengan fitur yang disesuaikan untuk kebutuhan masing-masing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role, i) => (
            <div
              key={role.role}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
              {/* Image header */}
              <div className={`relative h-44 bg-gradient-to-br ${role.bg} overflow-hidden`}>
                <img src={role.image} alt={role.role} className="w-full h-full object-cover opacity-25 mix-blend-overlay" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-2 border border-white/30">
                    <role.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-white font-semibold text-sm bg-white/15 px-3 py-1 rounded-full border border-white/20">
                    {role.role}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-[#1E293B] mb-2" style={{ fontWeight: 700, fontSize: '1.0625rem' }}>
                  {role.title}
                </h3>
                <p className="text-[#64748B] text-sm leading-relaxed mb-5">{role.desc}</p>

                <ul className="space-y-2 mb-6 flex-1">
                  {role.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm text-[#1E293B]">
                      <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: role.color }} />
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link
                  href={role.link}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium text-white text-sm transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{ backgroundColor: role.color }}>
                  {role.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Why Trust Section ─────────────────────────────────────────────────────────
function TrustSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 text-[#D97706] rounded-full text-sm font-medium mb-5">
              <Star className="w-4 h-4" />
              Kenapa SIMPAN?
            </span>
            <h2
              className="text-[#1E293B] mb-5"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.125rem)', fontWeight: 700, lineHeight: 1.3 }}>
              Bantuan Sosial yang Tepat, Transparan, dan Terpercaya
            </h2>
            <p className="text-[#64748B] mb-8 leading-relaxed">
              Kami memahami bahwa bantuan sosial harus sampai kepada mereka yang benar-benar membutuhkan. SIMPAN hadir
              sebagai solusi digital yang memastikan setiap rupiah bantuan sosial tersalurkan dengan akurat.
            </p>

            <div className="space-y-5">
              {[
                {
                  icon: Shield,
                  title: 'Keamanan Data Terjamin',
                  desc: 'Seluruh data penerima dienkripsi dan dilindungi sesuai standar keamanan siber nasional.',
                  color: '#2563EB'
                },
                {
                  icon: Zap,
                  title: 'Proses Distribusi 5x Lebih Cepat',
                  desc: 'Verifikasi QR Code hanya membutuhkan 3 detik, dibandingkan verifikasi manual yang bisa 2-3 menit.',
                  color: '#D97706'
                },
                {
                  icon: AlertCircle,
                  title: 'Nol Toleransi Duplikasi',
                  desc: 'Sistem secara otomatis memblokir klaim ganda, memastikan setiap penerima hanya mendapat bantuan sekali per periode.',
                  color: '#DC2626'
                },
                {
                  icon: Globe,
                  title: 'Dapat Digunakan di Seluruh Indonesia',
                  desc: 'Dirancang untuk koneksi internet yang tidak stabil sekalipun, dengan mode offline yang akan tersinkronisasi saat online.',
                  color: '#16A34A'
                }
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: item.color + '15' }}>
                    <item.icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <div>
                    <h4 className="text-[#1E293B] mb-1" style={{ fontWeight: 600, fontSize: '0.9375rem' }}>
                      {item.title}
                    </h4>
                    <p className="text-[#64748B] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — visual */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1660749416929-0791645dd142?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600"
            alt="Distribusi bantuan sosial"
            className="rounded-3xl w-full object-cover h-80 lg:h-[420px]"
          />
          {/* Overlay card */}
          <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[#1E293B] font-semibold text-sm">Progres Distribusi</span>
              <span className="text-[#16A34A] font-bold text-sm">78% Selesai</span>
            </div>
            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
              <div style={{ width: '78%' }} className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" />
            </div>
            <div className="flex justify-between text-xs text-[#64748B]">
              <span>9.750 sudah menerima</span>
              <span>2.750 belum</span>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -top-4 -right-4 bg-[#2563EB] text-white rounded-2xl p-4 shadow-xl">
            <div className="text-center">
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>98%</div>
              <div className="text-xs opacity-80">Akurasi</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Screenshots Section ───────────────────────────────────────────────────────
function ScreenshotsSection() {
  const screens = [
    {
      title: 'Dashboard Masyarakat',
      desc: 'Pantau status pengajuan dan akses QR Code Anda',
      color: 'from-blue-500 to-blue-600',
      icon: Users
    },
    {
      title: 'Scan QR Petugas',
      desc: 'Verifikasi penerima dengan scan kamera real-time',
      color: 'from-green-500 to-green-600',
      icon: QrCode
    },
    {
      title: 'Dashboard Admin',
      desc: 'Kelola seluruh data dan monitoring distribusi',
      color: 'from-purple-500 to-purple-600',
      icon: BarChart3
    },
    {
      title: 'Monitoring Peta',
      desc: 'Visualisasi distribusi di seluruh wilayah',
      color: 'from-orange-500 to-orange-600',
      icon: MapPin
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-[#1E293B] to-[#0F172A] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-white/80 rounded-full text-sm font-medium mb-4 border border-white/10">
            <Smartphone className="w-4 h-4" />
            Tampilan Aplikasi
          </span>
          <h2 className="text-white mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700 }}>
            Antarmuka yang Bersih & Intuitif
          </h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Desain minimalis modern yang mudah digunakan oleh semua kalangan, termasuk pengguna lanjut usia.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {screens.map((screen, i) => (
            <div key={screen.title} className="group cursor-pointer">
              {/* Mockup frame */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4 hover:bg-white/10 transition-all hover:border-white/20 group-hover:-translate-y-1">
                <div
                  className={`h-44 bg-gradient-to-br ${screen.color} rounded-xl flex flex-col items-center justify-center gap-3 opacity-90 group-hover:opacity-100 transition-opacity`}>
                  <screen.icon className="w-10 h-10 text-white" />
                  {/* Mock UI elements */}
                  <div className="w-3/4 space-y-2">
                    <div className="h-2 bg-white/30 rounded-full" />
                    <div className="h-2 bg-white/20 rounded-full w-2/3" />
                  </div>
                  <div className="flex gap-2 w-3/4">
                    <div className="h-6 bg-white/20 rounded-lg flex-1" />
                    <div className="h-6 bg-white/30 rounded-lg flex-1" />
                  </div>
                </div>
              </div>
              <h4 className="text-white font-semibold text-sm mb-1">{screen.title}</h4>
              <p className="text-white/50 text-xs">{screen.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#2563EB] text-white rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5">
            Coba Aplikasi Sekarang
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── FAQ Section ───────────────────────────────────────────────────────────────
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      q: 'Siapa saja yang bisa mendaftar sebagai penerima bantuan sosial?',
      a: 'Semua warga negara Indonesia yang memenuhi kriteria kelayakan penerima bantuan sosial. Kelayakan ditentukan berdasarkan data ekonomi, kondisi tempat tinggal, dan verifikasi oleh admin. Sistem kami menggunakan data yang Anda masukkan untuk penilaian yang adil dan transparan.'
    },
    {
      q: 'Bagaimana keamanan data pribadi saya terjamin?',
      a: 'Semua data pribadi Anda dienkripsi menggunakan standar enkripsi AES-256 dan disimpan di server yang aman. NIK dan data sensitif lainnya di-mask saat ditampilkan. Hanya petugas dan admin yang berwenang yang dapat mengakses data Anda sesuai dengan kebijakan privasi yang berlaku.'
    },
    {
      q: 'Apa yang terjadi jika QR Code saya hilang atau rusak?',
      a: 'QR Code Anda tersimpan secara digital di dashboard dan dapat diakses kapan saja melalui akun Anda. Anda juga dapat mengunduh dan mencetak QR Code sebagai backup. Jika akun tidak dapat diakses, hubungi admin setempat untuk mendapatkan QR Code pengganti.'
    },
    {
      q: 'Berapa lama proses review pengajuan?',
      a: 'Proses review biasanya membutuhkan waktu 3-7 hari kerja. Anda akan mendapatkan notifikasi otomatis ketika status pengajuan Anda berubah. Jika pengajuan memerlukan data tambahan, admin akan mengirimkan catatan yang bisa Anda lihat di dashboard.'
    },
    {
      q: 'Apakah ada biaya untuk mendaftar dan menggunakan SIMPAN?',
      a: 'Tidak, SIMPAN sepenuhnya gratis untuk semua pengguna. Tidak ada biaya pendaftaran, biaya pengajuan, atau biaya tersembunyi apapun. Hati-hati terhadap oknum yang meminta pembayaran atas nama SIMPAN.'
    },
    {
      q: 'Bagaimana jika saya tidak memiliki smartphone?',
      a: 'QR Code dapat dicetak dan dibawa secara fisik. Petugas lapangan juga memiliki opsi verifikasi manual menggunakan nomor token yang tertera pada surat distribusi yang dikirimkan ke alamat Anda jika diperlukan.'
    }
  ]

  return (
    <section id="faq" className="py-20 bg-[#F8FAFC]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-[#2563EB] rounded-full text-sm font-medium mb-4">
            <AlertCircle className="w-4 h-4" />
            FAQ
          </span>
          <h2 className="text-[#1E293B] mb-4" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', fontWeight: 700 }}>
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-[#64748B]">Tidak menemukan jawaban yang Anda cari? Hubungi tim kami.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors">
                <span className="text-[#1E293B] font-medium pr-4" style={{ fontSize: '0.9375rem' }}>
                  {faq.q}
                </span>
                <div className="flex-shrink-0">
                  <ChevronDown className="w-5 h-5 text-[#64748B]" />
                </div>
              </button>
              <div
                className="overflow-hidden"
                style={{ height: openIndex === i ? 'auto' : 0, opacity: openIndex === i ? 1 : 0 }}>
                <div className="px-6 pb-5">
                  <p className="text-[#64748B] text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA Section ───────────────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#1D4ED8] rounded-3xl px-8 py-16 text-center overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-900/30 rounded-full" />
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '28px 28px'
              }}
            />
          </div>

          <div className="relative">
            <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-white/20">
              <QrCode className="w-7 h-7 text-white" />
            </div>

            <h2 className="text-white mb-4" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 700 }}>
              Mulai Ajukan Bantuan Sosial Anda Sekarang
            </h2>
            <p className="text-white/75 mb-8 max-w-lg mx-auto" style={{ fontSize: '1.0625rem', lineHeight: 1.7 }}>
              Daftarkan diri Anda dan nikmati kemudahan pengajuan dan penerimaan bantuan sosial secara digital. Gratis,
              cepat, dan aman.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/daftar"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-[#2563EB] rounded-xl font-semibold hover:bg-blue-50 transition-all shadow-lg">
                Daftar Sebagai Masyarakat
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20">
                Sudah punya akun? Masuk
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10 pt-8 border-t border-white/15">
              {[
                { icon: Shield, text: '100% Gratis' },
                { icon: Clock, text: 'Proses 3-7 Hari' },
                { icon: CheckCircle, text: 'Data Terenkripsi' },
                { icon: Globe, text: 'Seluruh Indonesia' }
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-white/70">
                  <item.icon className="w-4 h-4" />
                  <span className="text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const footerLinks = {
    Aplikasi: [
      { label: 'Fitur', href: '#fitur' },
      { label: 'Cara Kerja', href: '#cara-kerja' },
      { label: 'Peran Pengguna', href: '#peran' },
      { label: 'FAQ', href: '#faq' }
    ],
    Pengguna: [
      { label: 'Daftar Masyarakat', href: '/daftar' },
      { label: 'Login', href: '/login' },
      { label: 'Portal Petugas', href: '/login' },
      { label: 'Portal Admin', href: '/login' }
    ],
    Bantuan: [
      { label: 'Pusat Bantuan', href: '#' },
      { label: 'Kontak Kami', href: '#' },
      { label: 'Laporan Bug', href: '#' },
      { label: 'Status Sistem', href: '#' }
    ],
    Legal: [
      { label: 'Kebijakan Privasi', href: '#' },
      { label: 'Syarat & Ketentuan', href: '#' },
      { label: 'Keamanan Data', href: '#' }
    ]
  }

  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-[#2563EB] rounded-xl flex items-center justify-center">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white" style={{ fontSize: '1.0625rem' }}>
                SIMPAN
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-5">
              Sistem Informasi Bantuan Sosial berbasis QR Code untuk distribusi yang tepat sasaran.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/50 text-xs">Sistem Aktif</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h5 className="text-white/80 font-semibold text-sm mb-4">{group}</h5>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {'href' in link && link.href.startsWith('/') ? (
                      <Link href={link.href} className="text-white/45 hover:text-white/80 text-sm transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <Link href={link.href} className="text-white/45 hover:text-white/80 text-sm transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/35 text-sm">© 2025 SIMPAN. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-2">
            <span className="text-white/35 text-sm">Dibuat untuk Indonesia yang lebih baik</span>
            <span className="text-red-400">❤</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Landing Page ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UserRolesSection />
      <TrustSection />
      <ScreenshotsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  )
}
