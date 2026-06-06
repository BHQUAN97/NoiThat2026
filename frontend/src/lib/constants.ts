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
  // Miền Bắc
  { label: 'Hà Nội', value: 'Hà Nội' },
  { label: 'Hải Phòng', value: 'Hải Phòng' },
  { label: 'Hải Dương', value: 'Hải Dương' },
  { label: 'Hưng Yên', value: 'Hưng Yên' },
  { label: 'Thái Bình', value: 'Thái Bình' },
  { label: 'Nam Định', value: 'Nam Định' },
  { label: 'Ninh Bình', value: 'Ninh Bình' },
  { label: 'Hà Nam', value: 'Hà Nam' },
  { label: 'Vĩnh Phúc', value: 'Vĩnh Phúc' },
  { label: 'Bắc Ninh', value: 'Bắc Ninh' },
  { label: 'Bắc Giang', value: 'Bắc Giang' },
  { label: 'Thái Nguyên', value: 'Thái Nguyên' },
  { label: 'Phú Thọ', value: 'Phú Thọ' },
  { label: 'Phúc Thọ', value: 'Phúc Thọ' },
  { label: 'Sơn Tây', value: 'Sơn Tây' },
  { label: 'Hoà Bình', value: 'Hoà Bình' },
  { label: 'Hà Giang', value: 'Hà Giang' },
  { label: 'Cao Bằng', value: 'Cao Bằng' },
  { label: 'Bắc Kạn', value: 'Bắc Kạn' },
  { label: 'Lạng Sơn', value: 'Lạng Sơn' },
  { label: 'Tuyên Quang', value: 'Tuyên Quang' },
  { label: 'Lào Cai', value: 'Lào Cai' },
  { label: 'Yên Bái', value: 'Yên Bái' },
  { label: 'Điện Biên', value: 'Điện Biên' },
  { label: 'Lai Châu', value: 'Lai Châu' },
  { label: 'Sơn La', value: 'Sơn La' },
  { label: 'Quảng Ninh', value: 'Quảng Ninh' },
  // Miền Trung
  { label: 'Thanh Hoá', value: 'Thanh Hoá' },
  { label: 'Nghệ An', value: 'Nghệ An' },
  { label: 'Hà Tĩnh', value: 'Hà Tĩnh' },
  { label: 'Quảng Bình', value: 'Quảng Bình' },
  { label: 'Quảng Trị', value: 'Quảng Trị' },
  { label: 'Thừa Thiên Huế', value: 'Thừa Thiên Huế' },
  { label: 'Đà Nẵng', value: 'Đà Nẵng' },
  { label: 'Quảng Nam', value: 'Quảng Nam' },
  { label: 'Quảng Ngãi', value: 'Quảng Ngãi' },
  { label: 'Bình Định', value: 'Bình Định' },
  { label: 'Phú Yên', value: 'Phú Yên' },
  { label: 'Khánh Hoà', value: 'Khánh Hoà' },
  { label: 'Ninh Thuận', value: 'Ninh Thuận' },
  { label: 'Bình Thuận', value: 'Bình Thuận' },
  // Tây Nguyên
  { label: 'Kon Tum', value: 'Kon Tum' },
  { label: 'Gia Lai', value: 'Gia Lai' },
  { label: 'Đắk Lắk', value: 'Đắk Lắk' },
  { label: 'Đắk Nông', value: 'Đắk Nông' },
  { label: 'Lâm Đồng', value: 'Lâm Đồng' },
  // Miền Nam
  { label: 'TP. Hồ Chí Minh', value: 'TP. Hồ Chí Minh' },
  { label: 'Bình Dương', value: 'Bình Dương' },
  { label: 'Đồng Nai', value: 'Đồng Nai' },
  { label: 'Bà Rịa - Vũng Tàu', value: 'Bà Rịa - Vũng Tàu' },
  { label: 'Bình Phước', value: 'Bình Phước' },
  { label: 'Tây Ninh', value: 'Tây Ninh' },
  { label: 'Long An', value: 'Long An' },
  { label: 'Tiền Giang', value: 'Tiền Giang' },
  { label: 'Bến Tre', value: 'Bến Tre' },
  { label: 'Trà Vinh', value: 'Trà Vinh' },
  { label: 'Vĩnh Long', value: 'Vĩnh Long' },
  { label: 'Đồng Tháp', value: 'Đồng Tháp' },
  { label: 'An Giang', value: 'An Giang' },
  { label: 'Kiên Giang', value: 'Kiên Giang' },
  { label: 'Cần Thơ', value: 'Cần Thơ' },
  { label: 'Hậu Giang', value: 'Hậu Giang' },
  { label: 'Sóc Trăng', value: 'Sóc Trăng' },
  { label: 'Bạc Liêu', value: 'Bạc Liêu' },
  { label: 'Cà Mau', value: 'Cà Mau' },
] as const
