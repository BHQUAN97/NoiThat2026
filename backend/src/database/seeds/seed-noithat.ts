/**
 * Seed script cho NoiThat2026.
 * Chạy: npx ts-node -r tsconfig-paths/register src/database/seeds/seed-noithat.ts
 */
import 'reflect-metadata'
import { AppDataSource } from '../data-source'
import * as bcrypt from 'bcrypt'
import { ulid } from 'ulid'
import { toSlug } from '../../common/helpers/slug.helper'

type CategorySeed = {
  slug: string
  name: string
  description: string
  thumbnail_url: string
}

type ProductSeed = {
  categorySlug: string
  name: string
  short_description: string
  description: string
  thumbnail_url: string
  specs: Record<string, string>
  featured?: boolean
}

type ProjectSeed = {
  name: string
  province: string
  location: string
  area_sqm: string
  description: string
  thumbnail_url: string
  gallery_urls: string[]
  featured?: boolean
}

const img = (q: string) =>
  `https://images.unsplash.com/featured/?${encodeURIComponent(q + ' interior design')}`

const paragraphs = (...items: string[]) => items.join('\n\n')

async function seed() {
  await AppDataSource.initialize()
  console.log('DB connected')

  const queryRunner = AppDataSource.createQueryRunner()
  await queryRunner.connect()

  try {
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@duymanhnoithat.vn'
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@2026!'

    const existingUser = await queryRunner.query('SELECT id FROM users WHERE email = ?', [adminEmail])

    if (existingUser.length === 0) {
      const hashedPw = await bcrypt.hash(adminPassword, 12)
      await queryRunner.query(
        `INSERT INTO users (id, full_name, email, password_hash, role, status)
         VALUES (?, ?, ?, ?, 'super_admin', 'active')`,
        [ulid(), 'Admin Duy Mạnh', adminEmail, hashedPw],
      )
      console.log('✓ Created admin user:', adminEmail)
    } else {
      console.log('→ Admin user already exists, skipped')
    }

    const categories: CategorySeed[] = [
      {
        slug: 'tu-bep',
        name: 'Tủ bếp',
        description: 'Tủ bếp gỗ công nghiệp, gỗ tự nhiên và hệ phụ kiện bếp theo kích thước thực tế.',
        thumbnail_url: img('modern kitchen cabinet'),
      },
      {
        slug: 'phong-khach',
        name: 'Phòng khách',
        description: 'Sofa, kệ TV, vách trang trí và hệ lưu trữ cho không gian tiếp khách gia đình.',
        thumbnail_url: img('modern living room furniture'),
      },
      {
        slug: 'phong-ngu',
        name: 'Phòng ngủ',
        description: 'Giường, tủ áo, bàn trang điểm và giải pháp lưu trữ tối ưu cho phòng ngủ.',
        thumbnail_url: img('bedroom wardrobe interior'),
      },
      {
        slug: 'phong-tre-em',
        name: 'Phòng trẻ em',
        description: 'Giường tầng, bàn học, tủ đồ an toàn và linh hoạt theo từng độ tuổi.',
        thumbnail_url: img('kids room furniture'),
      },
      {
        slug: 'van-phong',
        name: 'Văn phòng',
        description: 'Bàn làm việc, module lưu trữ, phòng họp và pantry cho doanh nghiệp.',
        thumbnail_url: img('office interior furniture'),
      },
      {
        slug: 'nha-hang-khach-san',
        name: 'Nhà hàng - khách sạn',
        description: 'Nội thất F&B, khách sạn, homestay và không gian dịch vụ có tần suất sử dụng cao.',
        thumbnail_url: img('hotel restaurant interior'),
      },
      {
        slug: 'showroom-cua-hang',
        name: 'Showroom - cửa hàng',
        description: 'Quầy kệ trưng bày, tủ hàng, quầy thu ngân và hệ nhận diện không gian bán lẻ.',
        thumbnail_url: img('retail showroom interior'),
      },
      {
        slug: 'phong-tho',
        name: 'Phòng thờ',
        description: 'Tủ thờ, vách thờ, bàn thờ treo và không gian thờ tự trang nghiêm.',
        thumbnail_url: img('wood altar room interior'),
      },
      {
        slug: 'phu-kien-thiet-bi',
        name: 'Phụ kiện - thiết bị',
        description: 'Ray trượt, bản lề, tay nâng, đèn LED, đá bếp và phụ kiện hoàn thiện.',
        thumbnail_url: img('cabinet hardware interior'),
      },
      {
        slug: 'noi-that-tron-goi',
        name: 'Nội thất trọn gói',
        description: 'Gói thiết kế, sản xuất và thi công đồng bộ cho căn hộ, nhà phố, biệt thự.',
        thumbnail_url: img('full home interior'),
      },
    ]

    const categoryIds = new Map<string, string>()
    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i]
      const exists = await queryRunner.query('SELECT id FROM product_categories WHERE slug = ?', [cat.slug])
      if (exists.length === 0) {
        const id = ulid()
        await queryRunner.query(
          `INSERT INTO product_categories (id, name, slug, description, thumbnail_url, sort_order, is_active)
           VALUES (?, ?, ?, ?, ?, ?, 1)`,
          [id, cat.name, cat.slug, cat.description, cat.thumbnail_url, i + 1],
        )
        categoryIds.set(cat.slug, id)
        console.log('✓ Created category:', cat.name)
      } else {
        categoryIds.set(cat.slug, exists[0].id)
      }
    }

    const products: ProductSeed[] = [
      {
        categorySlug: 'tu-bep',
        name: 'Tủ bếp chữ L MDF chống ẩm phủ Acrylic',
        short_description: 'Giải pháp tủ bếp hiện đại cho căn hộ 70-100m2, bề mặt bóng gương dễ vệ sinh.',
        description: paragraphs(
          'Hệ tủ dưới dùng MDF lõi xanh chống ẩm, thùng tủ phủ Melamine hai mặt, cánh Acrylic không đường line cạnh. Thiết kế chữ L giúp tối ưu tam giác bếp và tạo thêm mặt bàn thao tác.',
          'Bộ phụ kiện khuyến nghị gồm bản lề giảm chấn, ray hộp, giá xoong nồi, thùng gạo âm và hệ đèn LED dưới tủ trên. Phù hợp gia đình 3-5 người nấu ăn hằng ngày.',
        ),
        thumbnail_url: img('white acrylic kitchen cabinet'),
        specs: {
          'Vật liệu': 'MDF lõi xanh chống ẩm, Acrylic An Cường',
          'Đơn giá tham khảo': '4.200.000 - 5.800.000 đ/md',
          'Thời gian sản xuất': '15 - 20 ngày',
          'Bảo hành': '24 tháng',
        },
        featured: true,
      },
      {
        categorySlug: 'tu-bep',
        name: 'Tủ bếp gỗ Sồi Nga sơn Inchem',
        short_description: 'Tủ bếp gỗ tự nhiên cho nhà phố và biệt thự thích vân gỗ ấm.',
        description: paragraphs(
          'Gỗ Sồi Nga đã tẩm sấy, xử lý chống cong vênh và sơn Inchem giữ vân tự nhiên. Kiểu dáng phù hợp các không gian bán cổ điển, Indochine nhẹ hoặc nhà vườn.',
          'Cấu hình có thể kết hợp mặt đá thạch anh, kính ốp bếp cường lực và phụ kiện Hafele/Eurogold tùy ngân sách.',
        ),
        thumbnail_url: img('oak wood kitchen cabinet'),
        specs: {
          'Vật liệu': 'Gỗ Sồi Nga tự nhiên',
          'Bề mặt': 'Sơn Inchem mờ 35%',
          'Đơn giá tham khảo': '6.800.000 - 8.500.000 đ/md',
          'Bảo hành': '36 tháng',
        },
        featured: true,
      },
      {
        categorySlug: 'tu-bep',
        name: 'Tủ bếp Laminate chống xước cho nhà cho thuê',
        short_description: 'Cấu hình bền, dễ bảo trì, hợp căn hộ dịch vụ và nhà cho thuê dài hạn.',
        description: paragraphs(
          'Bề mặt Laminate chịu xước tốt hơn Melamine thông thường, màu vân gỗ hoặc màu trơn trung tính giúp ít lỗi thời. Thùng tủ bố trí modul tiêu chuẩn để dễ thay thế cánh, ray hoặc phụ kiện.',
          'Phù hợp chủ đầu tư cần kiểm soát chi phí nhưng vẫn muốn sản phẩm dùng ổn định trong môi trường khai thác liên tục.',
        ),
        thumbnail_url: img('laminate kitchen cabinet'),
        specs: {
          'Vật liệu': 'MDF chống ẩm phủ Laminate',
          'Nhóm khách hàng': 'Căn hộ cho thuê, homestay',
          'Đơn giá tham khảo': '3.600.000 - 4.900.000 đ/md',
          'Bảo trì': 'Dễ thay cánh theo module',
        },
      },
      {
        categorySlug: 'phong-khach',
        name: 'Kệ TV treo tường kết hợp tủ trang trí',
        short_description: 'Kệ TV gọn sàn, đi dây âm và có khoang trưng bày cho phòng khách nhỏ.',
        description: paragraphs(
          'Thiết kế treo tường giúp sàn thoáng, robot hút bụi hoạt động dễ hơn. Phần tủ cao có khoang kính, đèn LED và ngăn kín để giấu đồ dùng ít đẹp mắt.',
          'Kích thước, màu sắc và tỷ lệ mảng đặc-rỗng được đo theo đúng vị trí TV, ổ điện và chiều rộng sofa.',
        ),
        thumbnail_url: img('floating tv cabinet living room'),
        specs: {
          'Vật liệu': 'MDF chống ẩm phủ Melamine hoặc Laminate',
          'Kích thước phổ biến': '2.4m - 3.2m',
          'Phụ kiện': 'Ray bi giảm chấn, LED hắt',
          'Đơn giá tham khảo': '8.500.000 - 18.000.000 đ/bộ',
        },
        featured: true,
      },
      {
        categorySlug: 'phong-khach',
        name: 'Vách ốp sau sofa nano vân gỗ',
        short_description: 'Tạo điểm nhấn ấm cho phòng khách mà không phải thi công gỗ tự nhiên nặng chi phí.',
        description: paragraphs(
          'Vách nano vân gỗ kết hợp chỉ inox hoặc lam sóng giúp xử lý mảng tường trống sau sofa. Vật liệu nhẹ, thi công nhanh và dễ bảo trì trong căn hộ đã ở.',
          'Có thể tích hợp đèn hắt, tranh treo hoặc module tủ mỏng để tăng công năng.',
        ),
        thumbnail_url: img('wood wall panel living room'),
        specs: {
          'Vật liệu': 'Tấm nano, lam nhựa giả gỗ, chỉ inox',
          'Thời gian thi công': '1 - 2 ngày',
          'Ứng dụng': 'Căn hộ, nhà phố, văn phòng nhỏ',
          'Đơn giá tham khảo': '1.150.000 - 1.850.000 đ/m2',
        },
      },
      {
        categorySlug: 'phong-ngu',
        name: 'Tủ áo cánh lùa kịch trần',
        short_description: 'Tối ưu lối đi phòng ngủ hẹp, chia khoang theo thói quen sử dụng thực tế.',
        description: paragraphs(
          'Cánh lùa giúp không cần khoảng mở cánh trước tủ, đặc biệt hợp phòng ngủ căn hộ. Bên trong chia khoang treo dài, treo ngắn, ngăn kéo phụ kiện, hộc vali và đèn cảm biến.',
          'Ray lùa giảm chấn được chọn theo trọng lượng cánh để hạn chế xệ cánh sau thời gian dài sử dụng.',
        ),
        thumbnail_url: img('sliding wardrobe bedroom'),
        specs: {
          'Vật liệu': 'MDF chống ẩm phủ Melamine/Laminate',
          'Chiều cao': 'Kịch trần theo hiện trạng',
          'Phụ kiện': 'Ray lùa giảm chấn, đèn cảm biến',
          'Đơn giá tham khảo': '3.200.000 - 4.800.000 đ/m2 mặt cánh',
        },
        featured: true,
      },
      {
        categorySlug: 'phong-ngu',
        name: 'Giường hộp có ngăn kéo lưu trữ',
        short_description: 'Giường ngủ tích hợp kho đồ cho phòng nhỏ hoặc gia đình có nhiều chăn ga.',
        description: paragraphs(
          'Khung giường dạng hộp vững, hộc kéo hai bên hoặc cuối giường tùy mặt bằng. Thiết kế đầu giường có thể bọc nệm, ốp gỗ hoặc tích hợp tab liền khối.',
          'Sản phẩm được đo theo kích thước nệm thực tế, ổ cắm đầu giường và khoảng mở hộc kéo.',
        ),
        thumbnail_url: img('storage bed bedroom'),
        specs: {
          'Kích thước nệm': '1.6x2m hoặc 1.8x2m',
          'Vật liệu': 'MDF chống ẩm, khung gia cường',
          'Công năng': '2 - 4 ngăn kéo lưu trữ',
          'Đơn giá tham khảo': '9.500.000 - 18.000.000 đ/bộ',
        },
      },
      {
        categorySlug: 'phong-tre-em',
        name: 'Giường tầng trẻ em tích hợp bàn học',
        short_description: 'Cụm giường, tủ áo và bàn học tiết kiệm diện tích cho phòng 8-12m2.',
        description: paragraphs(
          'Thiết kế ưu tiên bo góc, lan can cao, bậc thang có tay vịn và vật liệu phát thải thấp. Bàn học đặt gần nguồn sáng tự nhiên, có kệ sách và bảng ghim.',
          'Module tủ dưới cầu thang tận dụng cho đồ chơi, cặp sách và chăn ga.',
        ),
        thumbnail_url: img('kids bunk bed study desk'),
        specs: {
          'Vật liệu': 'MDF chuẩn E1 phủ Melamine',
          'An toàn': 'Bo góc, lan can cao, thang rộng',
          'Độ tuổi phù hợp': '6 - 14 tuổi',
          'Đơn giá tham khảo': '24.000.000 - 42.000.000 đ/bộ',
        },
      },
      {
        categorySlug: 'van-phong',
        name: 'Cụm bàn làm việc module 6 người',
        short_description: 'Cụm bàn linh hoạt cho team vận hành, kế toán, sale hoặc kỹ thuật.',
        description: paragraphs(
          'Khung sắt sơn tĩnh điện, mặt bàn MFC chống trầy, vách ngăn nỉ hoặc mica mờ. Hệ máng điện và lỗ chờ dây giúp mặt bàn sạch, dễ quản lý thiết bị.',
          'Có thể mở rộng theo dãy 4, 6, 8 người và đồng bộ tủ phụ cá nhân.',
        ),
        thumbnail_url: img('office workstation desk'),
        specs: {
          'Kích thước mỗi chỗ': '1200x600mm hoặc 1400x700mm',
          'Vật liệu': 'Khung sắt, MFC phủ Melamine',
          'Phụ kiện': 'Máng điện, vách ngăn, hộc di động',
          'Đơn giá tham khảo': '2.600.000 - 4.200.000 đ/chỗ',
        },
        featured: true,
      },
      {
        categorySlug: 'van-phong',
        name: 'Tủ hồ sơ cao kịch trần cho văn phòng',
        short_description: 'Tăng dung lượng lưu trữ hồ sơ nhưng giữ mặt bằng làm việc gọn.',
        description: paragraphs(
          'Tủ chia khoang hồ sơ A4, khoang khóa riêng và khoang mở trưng bày. Cánh dưới kín chống bụi, cánh trên kính hoặc mở để giảm cảm giác nặng.',
          'Phù hợp văn phòng luật, kế toán, công ty dịch vụ và phòng hành chính.',
        ),
        thumbnail_url: img('office storage cabinet'),
        specs: {
          'Vật liệu': 'MFC/MDF chống ẩm',
          'Chiều cao': 'Theo trần thực tế',
          'Tải trọng kệ': '25 - 35kg/khoang',
          'Đơn giá tham khảo': '2.400.000 - 3.600.000 đ/m2',
        },
      },
      {
        categorySlug: 'nha-hang-khach-san',
        name: 'Bộ bàn ghế nhà hàng khung gỗ nệm simili',
        short_description: 'Cấu hình bền cho nhà hàng gia đình, quán lẩu nướng và khách sạn nhỏ.',
        description: paragraphs(
          'Ghế khung gỗ cao su hoặc ash, nệm mút D40 bọc simili dễ lau. Bàn dùng mặt laminate hoặc đá nhân tạo tùy concept và cường độ sử dụng.',
          'Thiết kế ưu tiên vệ sinh nhanh, dễ thay nệm và đồng bộ màu nhận diện thương hiệu.',
        ),
        thumbnail_url: img('restaurant dining furniture'),
        specs: {
          'Vật liệu': 'Gỗ cao su/ash, nệm simili',
          'Tần suất sử dụng': 'Cao',
          'Ứng dụng': 'Nhà hàng, cafe, khách sạn',
          'Đơn giá tham khảo': '1.450.000 - 3.200.000 đ/ghế',
        },
      },
      {
        categorySlug: 'showroom-cua-hang',
        name: 'Quầy thu ngân kết hợp kệ trưng bày',
        short_description: 'Quầy bán lẻ có khoang máy POS, máy in hóa đơn và tủ khóa nhân viên.',
        description: paragraphs(
          'Quầy được chia mặt giao dịch, mặt thao tác nhân viên và khoang kỹ thuật để giấu dây. Mặt ngoài có thể ốp lam, đá, acrylic hoặc logo phát sáng.',
          'Phù hợp showroom nội thất, spa, cửa hàng thời trang, mỹ phẩm và vật liệu hoàn thiện.',
        ),
        thumbnail_url: img('retail cashier counter'),
        specs: {
          'Vật liệu': 'MDF chống ẩm, Laminate, đá nhân tạo',
          'Chiều dài phổ biến': '1.6m - 2.8m',
          'Tích hợp': 'POS, máy in, két nhỏ, LED logo',
          'Đơn giá tham khảo': '12.000.000 - 38.000.000 đ/bộ',
        },
        featured: true,
      },
      {
        categorySlug: 'phong-tho',
        name: 'Tủ thờ gỗ Sồi phong cách hiện đại',
        short_description: 'Mẫu tủ thờ gọn, trang nghiêm cho chung cư và nhà phố.',
        description: paragraphs(
          'Tủ thờ dùng gỗ Sồi hoặc gỗ Gõ tùy ngân sách, kiểu dáng tiết chế chi tiết chạm khắc để hợp căn hộ hiện đại. Có ngăn kéo đồ lễ, khoang chứa và vách hậu CNC.',
          'Kích thước được tư vấn theo không gian, hướng đặt và khoảng thông thoáng phía trên bàn thờ.',
        ),
        thumbnail_url: img('modern wooden altar cabinet'),
        specs: {
          'Vật liệu': 'Gỗ Sồi/Gõ tự nhiên',
          'Hoàn thiện': 'Sơn PU mờ',
          'Ứng dụng': 'Chung cư, nhà phố',
          'Đơn giá tham khảo': '14.000.000 - 45.000.000 đ/bộ',
        },
      },
      {
        categorySlug: 'phu-kien-thiet-bi',
        name: 'Combo phụ kiện bếp Eurogold tiêu chuẩn',
        short_description: 'Bộ phụ kiện nền tảng cho tủ bếp mới, cân bằng giữa chi phí và trải nghiệm.',
        description: paragraphs(
          'Combo gồm giá xoong nồi, giá bát nâng hạ hoặc cố định, thùng gạo, thùng rác âm, khay chia thìa dĩa và kệ gia vị. Kích thước chọn theo khoang tủ thực tế.',
          'Đội thi công kiểm tra ray, độ vuông khoang và tải trọng trước khi lắp để tránh kẹt hoặc xệ sau sử dụng.',
        ),
        thumbnail_url: img('kitchen cabinet accessories hardware'),
        specs: {
          'Thương hiệu': 'Eurogold hoặc tương đương',
          'Chất liệu': 'Inox 304/201 tùy hạng mục',
          'Bảo hành': '12 - 24 tháng',
          'Đơn giá tham khảo': '8.000.000 - 22.000.000 đ/combo',
        },
      },
      {
        categorySlug: 'noi-that-tron-goi',
        name: 'Gói nội thất căn hộ 2 phòng ngủ',
        short_description: 'Thiết kế, sản xuất và lắp đặt đồng bộ cho căn hộ 55-75m2.',
        description: paragraphs(
          'Gói bao gồm tủ bếp, kệ TV, sofa cơ bản, bàn ăn, 2 giường, 2 tủ áo, bàn học/bàn làm việc và rèm. Phương án phù hợp gia đình trẻ cần dọn vào ở nhanh.',
          'Khách hàng nhận layout, phối màu, báo giá theo từng hạng mục và tiến độ sản xuất trước khi chốt hợp đồng.',
        ),
        thumbnail_url: img('two bedroom apartment interior package'),
        specs: {
          'Diện tích phù hợp': '55 - 75m2',
          'Thời gian triển khai': '25 - 35 ngày',
          'Ngân sách tham khảo': '145.000.000 - 260.000.000 đ',
          'Bảo hành': '24 tháng',
        },
        featured: true,
      },
    ]

    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      const slug = toSlug(product.name)
      const categoryId = categoryIds.get(product.categorySlug)
      if (!categoryId) continue

      const exists = await queryRunner.query('SELECT id FROM products WHERE slug = ?', [slug])
      if (exists.length === 0) {
        await queryRunner.query(
          `INSERT INTO products
           (id, category_id, name, slug, short_description, description, thumbnail_url, gallery_urls, specs, is_featured, sort_order, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [
            ulid(),
            categoryId,
            product.name,
            slug,
            product.short_description,
            product.description,
            product.thumbnail_url,
            JSON.stringify([product.thumbnail_url, img(`${product.name} detail`), img(`${product.name} showroom`)]),
            JSON.stringify(product.specs),
            product.featured ? 1 : 0,
            i + 1,
          ],
        )
      }
    }
    console.log(`✓ Products seeded: ${products.length}`)

    const projects: ProjectSeed[] = [
      {
        name: 'Căn hộ 2PN Vinhomes Smart City',
        province: 'Hà Nội',
        location: 'Tây Mỗ, Nam Từ Liêm',
        area_sqm: '68m2',
        description: paragraphs(
          'Thi công trọn gói căn hộ 2 phòng ngủ cho gia đình trẻ, ưu tiên công năng lưu trữ và màu gỗ sáng.',
          'Hạng mục gồm tủ bếp chữ L, kệ TV treo, vách sofa, tủ áo kịch trần, giường hộp và bàn học trẻ em. Tổng thời gian sản xuất lắp đặt 28 ngày.',
        ),
        thumbnail_url: img('small apartment vietnam interior'),
        gallery_urls: [img('apartment living room'), img('apartment kitchen'), img('apartment bedroom')],
        featured: true,
      },
      {
        name: 'Nhà phố 4 tầng Phúc Thọ',
        province: 'Hà Nội',
        location: 'Vân Nam, Phúc Thọ',
        area_sqm: '185m2',
        description: paragraphs(
          'Dự án nhà phố hoàn thiện nội thất theo từng tầng: khách-bếp, phòng ngủ bố mẹ, hai phòng con và phòng thờ.',
          'Gia chủ chọn gỗ Sồi cho các điểm nhấn chính, kết hợp MDF chống ẩm cho hệ tủ lớn để cân bằng ngân sách.',
        ),
        thumbnail_url: img('vietnam townhouse interior'),
        gallery_urls: [img('townhouse kitchen'), img('townhouse bedroom'), img('wood altar room')],
        featured: true,
      },
      {
        name: 'Biệt thự Ecopark phong cách Contemporary',
        province: 'Hưng Yên',
        location: 'Khu đô thị Ecopark',
        area_sqm: '320m2',
        description: paragraphs(
          'Không gian biệt thự dùng bảng màu trung tính, gỗ óc chó và đá vân nhẹ. Thiết kế tập trung vào phòng khách lớn, bếp đảo và master suite.',
          'Các hệ tủ được sản xuất theo kích thước thực tế để xử lý dầm, cột và hệ điều hòa âm trần.',
        ),
        thumbnail_url: img('villa walnut contemporary interior'),
        gallery_urls: [img('villa living room'), img('villa kitchen island'), img('villa master bedroom')],
        featured: true,
      },
      {
        name: 'Văn phòng công ty xây dựng tại Cầu Giấy',
        province: 'Hà Nội',
        location: 'Duy Tân, Cầu Giấy',
        area_sqm: '240m2',
        description: paragraphs(
          'Fit-out văn phòng 45 nhân sự gồm khu làm việc mở, hai phòng họp, phòng giám đốc, pantry và tủ hồ sơ.',
          'Vật liệu MFC chống trầy, khung sắt sơn tĩnh điện và hệ điện âm bàn giúp không gian vận hành gọn.',
        ),
        thumbnail_url: img('office fitout interior'),
        gallery_urls: [img('open office workstation'), img('meeting room interior'), img('office pantry')],
        featured: true,
      },
      {
        name: 'Nhà hàng lẩu nướng tại Mỹ Đình',
        province: 'Hà Nội',
        location: 'Mỹ Đình, Nam Từ Liêm',
        area_sqm: '210m2',
        description: paragraphs(
          'Thi công bàn ghế, vách ngăn, quầy thu ngân và hệ tủ phụ cho nhà hàng có công suất phục vụ cao.',
          'Bề mặt vật liệu ưu tiên khả năng lau chùi, chịu nhiệt và dễ thay thế khi khai thác lâu dài.',
        ),
        thumbnail_url: img('bbq restaurant interior'),
        gallery_urls: [img('restaurant booth seating'), img('restaurant cashier counter'), img('restaurant dining room')],
      },
      {
        name: 'Showroom vật liệu hoàn thiện Hoài Đức',
        province: 'Hà Nội',
        location: 'Hoài Đức',
        area_sqm: '160m2',
        description: paragraphs(
          'Thiết kế showroom trưng bày mẫu gỗ, đá, thiết bị vệ sinh và phụ kiện nội thất. Lối đi được tính theo hành trình tư vấn khách hàng.',
          'Quầy tư vấn tích hợp khoang catalogue, máy POS và tủ khóa hồ sơ hợp đồng.',
        ),
        thumbnail_url: img('material showroom interior'),
        gallery_urls: [img('retail display shelves'), img('material sample wall'), img('showroom consultation desk')],
      },
      {
        name: 'Homestay Ba Vì 6 phòng',
        province: 'Hà Nội',
        location: 'Ba Vì',
        area_sqm: '280m2',
        description: paragraphs(
          'Dự án homestay dùng vật liệu bền, dễ thay thế và phong cách mộc hiện đại để phù hợp khai thác lưu trú.',
          'Các phòng dùng giường hộp, tủ mở, bàn trang điểm nhỏ và vách đầu giường tạo điểm nhận diện.',
        ),
        thumbnail_url: img('homestay bedroom interior'),
        gallery_urls: [img('homestay room'), img('wood cabin interior'), img('boutique hotel bedroom')],
      },
      {
        name: 'Căn hộ studio cho thuê tại Hà Đông',
        province: 'Hà Nội',
        location: 'Văn Quán, Hà Đông',
        area_sqm: '36m2',
        description: paragraphs(
          'Căn hộ studio nhỏ được xử lý bằng giường có hộc, tủ bếp chữ I, bàn ăn gấp và tủ áo cánh lùa.',
          'Mục tiêu là tăng công năng nhưng vẫn giữ chi phí phù hợp mô hình cho thuê dài hạn.',
        ),
        thumbnail_url: img('studio apartment space saving interior'),
        gallery_urls: [img('studio kitchen'), img('murphy bed interior'), img('small wardrobe')],
      },
    ]

    for (let i = 0; i < projects.length; i++) {
      const project = projects[i]
      const slug = toSlug(project.name)
      const exists = await queryRunner.query('SELECT id FROM projects WHERE slug = ?', [slug])
      if (exists.length === 0) {
        await queryRunner.query(
          `INSERT INTO projects
           (id, name, slug, province, location, area_sqm, description, thumbnail_url, gallery_urls, is_featured, sort_order, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
          [
            ulid(),
            project.name,
            slug,
            project.province,
            project.location,
            project.area_sqm,
            project.description,
            project.thumbnail_url,
            JSON.stringify(project.gallery_urls),
            project.featured ? 1 : 0,
            i + 1,
          ],
        )
      }
    }
    console.log(`✓ Projects seeded: ${projects.length}`)

    const pricings = [
      {
        name: 'Gói Căn Hộ Tiết Kiệm',
        description: 'Phù hợp căn hộ 1-2PN cần nội thất cơ bản, dễ bảo trì.',
        items: [
          { label: 'Tủ bếp MDF Melamine', price: '2.800.000 - 3.600.000', unit: 'md' },
          { label: 'Tủ áo cánh mở', price: '2.400.000 - 3.200.000', unit: 'm2 mặt cánh' },
          { label: 'Kệ TV treo', price: '5.500.000 - 9.000.000', unit: 'bộ' },
        ],
      },
      {
        name: 'Gói Gia Đình Cao Cấp',
        description: 'Dùng MDF chống ẩm, Laminate/Acrylic và phụ kiện giảm chấn đồng bộ.',
        items: [
          { label: 'Tủ bếp Acrylic/Laminate', price: '4.200.000 - 6.500.000', unit: 'md' },
          { label: 'Tủ áo cánh lùa', price: '3.600.000 - 5.200.000', unit: 'm2 mặt cánh' },
          { label: 'Giường hộp lưu trữ', price: '12.000.000 - 22.000.000', unit: 'bộ' },
        ],
      },
      {
        name: 'Gói Gỗ Tự Nhiên',
        description: 'Cho nhà phố, biệt thự hoặc khách hàng ưu tiên độ bền và vân gỗ thật.',
        items: [
          { label: 'Tủ bếp gỗ Sồi', price: '6.800.000 - 8.500.000', unit: 'md' },
          { label: 'Tủ thờ gỗ tự nhiên', price: '14.000.000 - 45.000.000', unit: 'bộ' },
          { label: 'Ốp vách gỗ', price: '2.800.000 - 5.500.000', unit: 'm2' },
        ],
      },
      {
        name: 'Gói Văn Phòng',
        description: 'Bàn ghế, tủ hồ sơ, phòng họp và pantry cho doanh nghiệp nhỏ đến vừa.',
        items: [
          { label: 'Cụm bàn làm việc', price: '2.600.000 - 4.200.000', unit: 'chỗ' },
          { label: 'Tủ hồ sơ kịch trần', price: '2.400.000 - 3.600.000', unit: 'm2' },
          { label: 'Bàn họp 8-12 người', price: '12.000.000 - 28.000.000', unit: 'bộ' },
        ],
      },
      {
        name: 'Gói F&B - Khách Sạn',
        description: 'Nội thất chịu tần suất sử dụng cao cho nhà hàng, cafe, homestay, khách sạn.',
        items: [
          { label: 'Ghế nhà hàng', price: '1.450.000 - 3.200.000', unit: 'ghế' },
          { label: 'Bàn nhà hàng', price: '2.200.000 - 6.800.000', unit: 'bàn' },
          { label: 'Quầy thu ngân/bar', price: '18.000.000 - 65.000.000', unit: 'bộ' },
        ],
      },
    ]

    for (let i = 0; i < pricings.length; i++) {
      const pricing = pricings[i]
      const exists = await queryRunner.query('SELECT id FROM pricing_tables WHERE name = ?', [pricing.name])
      if (exists.length === 0) {
        await queryRunner.query(
          `INSERT INTO pricing_tables (id, name, description, items, sort_order, is_active)
           VALUES (?, ?, ?, ?, ?, 1)`,
          [ulid(), pricing.name, pricing.description, JSON.stringify(pricing.items), i + 1],
        )
      }
    }
    console.log(`✓ Pricing tables seeded: ${pricings.length}`)

    const news = [
      {
        title: 'Nên chọn Acrylic hay Laminate cho tủ bếp gia đình?',
        excerpt: 'So sánh thực tế về độ bền, khả năng vệ sinh, thẩm mỹ và ngân sách khi làm tủ bếp.',
        content: paragraphs(
          'Acrylic tạo bề mặt bóng sâu, hợp căn hộ hiện đại và dễ lau dầu mỡ. Điểm cần lưu ý là bề mặt bóng dễ lộ vết xước dăm nếu dùng khăn cứng.',
          'Laminate có lợi thế chống xước tốt, nhiều mã vân gỗ và màu trơn. Với gia đình nấu ăn nhiều hoặc nhà cho thuê, Laminate thường là lựa chọn an toàn hơn.',
          'Cách chọn thực tế là dùng Acrylic cho mảng trên hoặc điểm nhấn, Laminate cho khu vực chịu va chạm nhiều. Đội Duy Mạnh thường tư vấn theo tần suất nấu và ngân sách hoàn thiện.',
        ),
      },
      {
        title: 'Checklist đo hiện trạng trước khi đóng nội thất',
        excerpt: 'Những vị trí phải đo kỹ để tránh tủ vướng ổ điện, cửa mở hoặc dầm trần.',
        content: paragraphs(
          'Bản đo hiện trạng cần có chiều dài, rộng, cao từng phòng, vị trí cửa, cửa sổ, dầm, cột, hộp kỹ thuật và ổ điện.',
          'Riêng khu bếp phải kiểm tra đường cấp thoát nước, vị trí máy hút mùi, ổ cắm bếp từ, máy rửa bát và chiều cao trần sau khi hoàn thiện.',
          'Nên chụp ảnh toàn bộ mặt bằng kèm video quét chậm từng góc. Việc này giúp xưởng giảm sai số khi lên bản vẽ sản xuất.',
        ),
      },
      {
        title: 'Làm nội thất căn hộ 2PN cần ngân sách bao nhiêu?',
        excerpt: 'Khoảng giá tham khảo theo ba mức: tiết kiệm, tiêu chuẩn và cao cấp.',
        content: paragraphs(
          'Với căn hộ 55-75m2, gói tiết kiệm thường nằm trong khoảng 145-180 triệu đồng nếu dùng Melamine và phụ kiện cơ bản.',
          'Gói tiêu chuẩn dùng MDF chống ẩm, Laminate/Acrylic cho bếp và tủ áo tốt hơn thường nằm trong khoảng 190-260 triệu đồng.',
          'Ngân sách cao cấp có thể vượt 300 triệu đồng khi dùng nhiều gỗ tự nhiên, đá bếp tốt, phụ kiện Hafele/Blum và đồ rời đồng bộ.',
        ),
      },
      {
        title: 'Cách chọn phụ kiện bếp để không phải sửa sau 2 năm',
        excerpt: 'Ray, bản lề, giá xoong nồi và tay nâng nên chọn theo tải trọng thay vì chỉ nhìn giá.',
        content: paragraphs(
          'Phụ kiện bếp là phần vận hành mỗi ngày nên cần chọn theo tải trọng khoang tủ. Giá xoong nồi, ray hộp và tay nâng phải tương thích kích thước tủ.',
          'Nếu ngân sách giới hạn, nên ưu tiên bản lề giảm chấn, ray ngăn kéo và giá xoong nồi trước. Các phụ kiện ít dùng có thể nâng cấp sau.',
          'Trước khi lắp, thợ cần kiểm tra độ vuông khoang và độ chắc của vách tủ để phụ kiện chạy êm lâu dài.',
        ),
      },
      {
        title: 'Vật liệu nào phù hợp cho nội thất văn phòng?',
        excerpt: 'MFC, MDF, khung sắt và laminate nên dùng ở đâu để bền và dễ bảo trì.',
        content: paragraphs(
          'Văn phòng có tần suất sử dụng cao nên mặt bàn cần chống trầy, dễ lau và thay thế được theo module. MFC phủ Melamine là lựa chọn kinh tế cho bàn làm việc số lượng lớn.',
          'Khu vực tiếp khách, phòng họp hoặc phòng giám đốc có thể nâng cấp Laminate, veneer hoặc đá nhân tạo để tăng nhận diện thương hiệu.',
          'Khung sắt sơn tĩnh điện giúp bàn dài vững hơn, đặc biệt với cụm bàn nhiều người và hệ máng điện.',
        ),
      },
    ]

    for (let i = 0; i < news.length; i++) {
      const item = news[i]
      const slug = toSlug(item.title)
      const exists = await queryRunner.query('SELECT id FROM news WHERE slug = ?', [slug])
      if (exists.length === 0) {
        await queryRunner.query(
          `INSERT INTO news
           (id, title, slug, excerpt, content, thumbnail_url, is_active, is_featured, published_at)
           VALUES (?, ?, ?, ?, ?, ?, 1, ?, NOW())`,
          [ulid(), item.title, slug, item.excerpt, item.content, img(item.title), i < 2 ? 1 : 0],
        )
      }
    }
    console.log(`✓ News seeded: ${news.length}`)

    const reviews = [
      ['Anh Hùng', 'Phúc Thọ, Hà Nội', 'Tủ bếp lắp đúng bản vẽ, phụ kiện chạy êm. Đội thi công xử lý phần hộp kỹ thuật rất gọn nên bếp nhìn rộng hơn dự kiến.'],
      ['Chị Mai Anh', 'Nam Từ Liêm, Hà Nội', 'Căn hộ 2 phòng ngủ được bàn giao đúng hẹn. Phần tủ áo và giường hộp chứa được nhiều đồ, màu sắc giống phối cảnh.'],
      ['Anh Quang', 'Cầu Giấy, Hà Nội', 'Văn phòng mới gọn hơn nhiều, dây điện bàn làm việc được giấu sạch. Nhân viên dùng một tháng chưa có vấn đề phát sinh.'],
      ['Chị Hạnh', 'Hoài Đức, Hà Nội', 'Showroom có quầy tư vấn và kệ mẫu rất tiện. Khách vào xem vật liệu dễ hình dung hơn so với cách trưng bày cũ.'],
      ['Anh Tuấn', 'Ba Vì, Hà Nội', 'Homestay dùng nội thất đơn giản nhưng chắc. Các phòng đồng bộ, dễ vệ sinh và thay đồ khi vận hành.'],
    ]

    for (let i = 0; i < reviews.length; i++) {
      const [customerName, location, content] = reviews[i]
      const exists = await queryRunner.query('SELECT id FROM reviews WHERE customer_name = ? AND location = ?', [
        customerName,
        location,
      ])
      if (exists.length === 0) {
        await queryRunner.query(
          `INSERT INTO reviews
           (id, customer_name, location, rating, content, avatar_url, is_active, is_featured, sort_order)
           VALUES (?, ?, ?, 5, ?, ?, 1, ?, ?)`,
          [ulid(), customerName, location, content, img(`portrait ${customerName}`), i < 3 ? 1 : 0, i + 1],
        )
      }
    }
    console.log(`✓ Reviews seeded: ${reviews.length}`)

    // Videos cần YouTube ID thật — thêm qua admin panel sau khi upload video lên kênh YouTube của xưởng.
    console.log('→ Videos: bỏ qua (thêm YouTube ID thật qua admin)')

    const configs = [
      { key: 'site_name', value: 'Nội Thất Duy Mạnh' },
      { key: 'hotline', value: '094.872.8091' },
      { key: 'address', value: 'Vân Nam - Phúc Thọ - Hà Nội' },
      { key: 'working_hours', value: '8h00 - 18h00, Thứ 2 - Chủ nhật' },
      { key: 'email_contact', value: 'duymanhnoithat@gmail.com' },
      { key: 'zalo_url', value: 'https://zalo.me/0948728091' },
      { key: 'facebook_url', value: 'https://facebook.com/duymanhnoithat' },
      { key: 'meta_title', value: 'Nội Thất Duy Mạnh - Thiết kế, sản xuất và thi công nội thất Hà Nội' },
      {
        key: 'meta_description',
        value:
          'Xưởng nội thất Duy Mạnh tại Phúc Thọ, Hà Nội: tủ bếp, căn hộ, nhà phố, văn phòng, showroom, nhà hàng và nội thất trọn gói theo đo đạc thực tế.',
      },
      { key: 'admin_email', value: 'duymanhnoithat@gmail.com' },
      { key: 'resend_from', value: 'no-reply@duymanhnoithat.vn' },
    ]

    for (const cfg of configs) {
      const exists = await queryRunner.query('SELECT `key` FROM site_config WHERE `key` = ?', [cfg.key])
      if (exists.length === 0) {
        await queryRunner.query(`INSERT INTO site_config (\`key\`, value) VALUES (?, ?)`, [cfg.key, cfg.value])
      } else {
        await queryRunner.query(`UPDATE site_config SET value = ? WHERE \`key\` = ?`, [cfg.value, cfg.key])
      }
    }
    console.log('✓ Site config seeded')

    console.log('\n✅ Seed hoàn thành!')
    console.log(`   Admin: ${adminEmail} / ${adminPassword}`)
  } catch (err) {
    console.error('❌ Seed thất bại:', err)
    throw err
  } finally {
    await queryRunner.release()
    await AppDataSource.destroy()
  }
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
