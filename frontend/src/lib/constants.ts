export const SITE_NAME = 'Nội Thất Duy Mạnh'
export const SITE_DESCRIPTION = 'Xưởng sản xuất và thi công tủ bếp, nội thất gia đình tại Vân Nam - Phúc Thọ - Hà Nội'

export const CONTACT = {
  hotline: '094.872.8091',
  hotlineRaw: '0948728091',
  address: 'Vân Nam - Phúc Thọ - Hà Nội',
  workHours: '8h00 - 18h00',
  zaloUrl: process.env.NEXT_PUBLIC_ZALO_URL || 'https://zalo.me/0948728091',
  facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/duymanhnoithat',
  email: 'duymanhnoithat@gmail.com',
  mapsEmbedUrl: '',
} as const

export const NAV_LINKS = [
  { label: 'Trang Chủ', href: '/' },
  { label: 'Giới Thiệu', href: '/gioi-thieu' },
  { label: 'Tủ Bếp', href: '/tu-bep' },
  { label: 'Nội Thất Khác', href: '/noi-that-khac' },
  { label: 'Dự Án Thực Tế', href: '/du-an-thuc-te' },
  { label: 'Video Công Trình', href: '/video-cong-trinh' },
  { label: 'Báo Giá', href: '/bao-gia' },
  { label: 'Tin Tức', href: '/tin-tuc' },
  { label: 'Liên Hệ', href: '/lien-he' },
] as const

export const BOTTOM_NAV_ITEMS = [
  { label: 'Trang Chủ', href: '/', icon: 'Home' },
  { label: 'Tủ Bếp', href: '/tu-bep', icon: 'LayoutGrid' },
  { label: 'Báo Giá', href: '/bao-gia', icon: 'FileText', cta: true },
  { label: 'Dự Án', href: '/du-an-thuc-te', icon: 'Building2' },
  { label: 'Thêm', href: '#more', icon: 'Menu' },
] as const

export const BOTTOM_NAV_MORE_LINKS = [
  { label: 'Giới Thiệu', href: '/gioi-thieu', icon: 'Info' },
  { label: 'Nội Thất Khác', href: '/noi-that-khac', icon: 'Sofa' },
  { label: 'Video Công Trình', href: '/video-cong-trinh', icon: 'Video' },
  { label: 'Tin Tức', href: '/tin-tuc', icon: 'Newspaper' },
  { label: 'Liên Hệ', href: '/lien-he', icon: 'Phone' },
  { label: 'Đánh Giá KH', href: '/danh-gia-khach-hang', icon: 'Star' },
] as const

export const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Form Yêu Cầu', href: '/admin/forms', icon: 'FileText' },
  { label: 'Sản Phẩm', href: '/admin/products', icon: 'Package' },
  { label: 'Danh Mục SP', href: '/admin/categories', icon: 'Tag' },
  { label: 'Dự Án', href: '/admin/projects', icon: 'Building2' },
  { label: 'Video', href: '/admin/videos', icon: 'Video' },
  { label: 'Tin Tức', href: '/admin/news', icon: 'Newspaper' },
  { label: 'Bảng Giá', href: '/admin/pricing', icon: 'DollarSign' },
  { label: 'Đánh Giá', href: '/admin/reviews', icon: 'Star' },
  { label: 'Cài Đặt', href: '/admin/settings', icon: 'Settings' },
  { label: 'Người Dùng', href: '/admin/users', icon: 'Users' },
] as const

export const PRODUCT_CATEGORIES = [
  { label: 'Tủ Bếp Inox 304', slug: 'tu-bep-inox-304', href: '/tu-bep/tu-bep-inox-304' },
  { label: 'Tủ Bếp Cánh Kính', slug: 'tu-bep-canh-kinh', href: '/tu-bep/tu-bep-canh-kinh' },
  { label: 'Tủ Bếp Acrylic', slug: 'tu-bep-acrylic', href: '/tu-bep/tu-bep-acrylic' },
  { label: 'Tủ Quần Áo', slug: 'tu-quan-ao', href: '/noi-that-khac/tu-quan-ao' },
  { label: 'Vách Tivi', slug: 'vach-tivi', href: '/noi-that-khac/vach-tivi' },
  { label: 'Nội Thất Phòng Ngủ', slug: 'noi-that-phong-ngu', href: '/noi-that-khac/noi-that-phong-ngu' },
] as const

export const PROVINCES = [
  { label: 'Tất Cả', value: '' },
  { label: 'Hà Nội', value: 'Hà Nội' },
  { label: 'Phúc Thọ', value: 'Phúc Thọ' },
  { label: 'Sơn Tây', value: 'Sơn Tây' },
  { label: 'Hoà Bình', value: 'Hoà Bình' },
  { label: 'Vĩnh Phúc', value: 'Vĩnh Phúc' },
] as const
