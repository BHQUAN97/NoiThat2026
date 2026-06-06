/**
 * Seed script cho NoiThat2026
 * Chạy: npx ts-node -r tsconfig-paths/register src/database/seeds/seed-noithat.ts
 */
import 'reflect-metadata'
import { AppDataSource } from '../data-source'
import * as bcrypt from 'bcrypt'
import { ulid } from 'ulid'

async function seed() {
  await AppDataSource.initialize()
  console.log('DB connected')

  const queryRunner = AppDataSource.createQueryRunner()
  await queryRunner.connect()

  try {
    // ─── 1. Super Admin User ─────────────────────────────────────────────────
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@duymanhnoithat.vn'
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@2026!'

    const existingUser = await queryRunner.query(
      'SELECT id FROM users WHERE email = ?', [adminEmail]
    )

    if (existingUser.length === 0) {
      const hashedPw = await bcrypt.hash(adminPassword, 12)
      await queryRunner.query(
        `INSERT INTO users (id, full_name, email, password_hash, role, status)
         VALUES (?, ?, ?, ?, 'super_admin', 'active')`,
        [ulid(), 'Admin Duy Mạnh', adminEmail, hashedPw]
      )
      console.log('✓ Created admin user:', adminEmail)
    } else {
      console.log('→ Admin user already exists, skipped')
    }

    // ─── 2. Product Categories ───────────────────────────────────────────────
    const categories = [
      { slug: 'tu-bep-go-tu-nhien',   name: 'Tủ Bếp Gỗ Tự Nhiên',   sort_order: 1 },
      { slug: 'tu-bep-go-cong-nghiep', name: 'Tủ Bếp Gỗ Công Nghiệp', sort_order: 2 },
      { slug: 'tu-bep-acrylic',        name: 'Tủ Bếp Acrylic',         sort_order: 3 },
      { slug: 'tu-bep-laminate',       name: 'Tủ Bếp Laminate',        sort_order: 4 },
      { slug: 'tu-bep-melamine',       name: 'Tủ Bếp Melamine',        sort_order: 5 },
      { slug: 'noi-that-phong-ngu',    name: 'Nội Thất Phòng Ngủ',     sort_order: 6 },
    ]

    for (const cat of categories) {
      const exists = await queryRunner.query(
        'SELECT id FROM product_categories WHERE slug = ?', [cat.slug]
      )
      if (exists.length === 0) {
        await queryRunner.query(
          `INSERT INTO product_categories (id, name, slug, sort_order, is_active)
           VALUES (?, ?, ?, ?, 1)`,
          [ulid(), cat.name, cat.slug, cat.sort_order]
        )
        console.log('✓ Created category:', cat.name)
      }
    }

    // ─── 3. Pricing Tables ───────────────────────────────────────────────────
    const pricings = [
      {
        name: 'Gói Tiêu Chuẩn',
        description: 'Gỗ công nghiệp MDF, bề mặt Melamine — Phù hợp tài chính tốt',
        sort_order: 1,
        items: [
          { label: 'Tủ bếp dưới', price: '2,500,000', unit: 'm dài' },
          { label: 'Tủ bếp trên', price: '2,000,000', unit: 'm dài' },
          { label: 'Tủ kết hợp', price: '3,500,000', unit: 'm dài' },
          { label: 'Kệ đảo bếp', price: '1,800,000', unit: 'm dài', note: 'Nếu có' },
        ],
      },
      {
        name: 'Gói Cao Cấp',
        description: 'Gỗ công nghiệp HDF/MFC cao cấp, bề mặt Laminate/Acrylic',
        sort_order: 2,
        items: [
          { label: 'Tủ bếp dưới', price: '3,500,000', unit: 'm dài' },
          { label: 'Tủ bếp trên', price: '2,800,000', unit: 'm dài' },
          { label: 'Tủ kết hợp', price: '4,800,000', unit: 'm dài' },
          { label: 'Kệ đảo bếp', price: '2,500,000', unit: 'm dài', note: 'Nếu có' },
        ],
      },
      {
        name: 'Gói Premium',
        description: 'Gỗ tự nhiên cao cấp (Sồi, Óc chó, Xoan đào) — Bền đẹp vĩnh cửu',
        sort_order: 3,
        items: [
          { label: 'Tủ bếp dưới', price: 'Liên hệ báo giá', unit: 'm dài', note: 'Tùy loại gỗ' },
          { label: 'Tủ bếp trên', price: 'Liên hệ báo giá', unit: 'm dài', note: 'Tùy loại gỗ' },
          { label: 'Tủ kết hợp', price: 'Liên hệ báo giá', unit: 'm dài', note: 'Tùy loại gỗ' },
        ],
      },
    ]

    for (const pricing of pricings) {
      const exists = await queryRunner.query(
        'SELECT id FROM pricing_tables WHERE name = ?', [pricing.name]
      )
      if (exists.length === 0) {
        await queryRunner.query(
          `INSERT INTO pricing_tables (id, name, description, items, sort_order, is_active)
           VALUES (?, ?, ?, ?, ?, 1)`,
          [ulid(), pricing.name, pricing.description, JSON.stringify(pricing.items), pricing.sort_order]
        )
        console.log('✓ Created pricing:', pricing.name)
      }
    }

    // ─── 4. Site Config ──────────────────────────────────────────────────────
    const configs = [
      { key: 'site_name',       value: 'Nội Thất Duy Mạnh' },
      { key: 'hotline',         value: '094.872.8091' },
      { key: 'address',         value: 'Vân Nam - Phúc Thọ - Hà Nội' },
      { key: 'working_hours',   value: '8h00 - 18h00' },
      { key: 'email_contact',   value: 'duymanhnoithat@gmail.com' },
      { key: 'zalo_url',        value: 'https://zalo.me/0948728091' },
      { key: 'facebook_url',    value: 'https://facebook.com/duymanhnoithat' },
      { key: 'meta_title',      value: 'Nội Thất Duy Mạnh - Tủ Bếp Đẹp Tại Phúc Thọ Hà Nội' },
      { key: 'meta_description', value: 'Xưởng sản xuất và thi công tủ bếp, nội thất gia đình uy tín tại Vân Nam - Phúc Thọ - Hà Nội.' },
      { key: 'admin_email',     value: 'duymanhnoithat@gmail.com' },
      { key: 'resend_from',     value: 'no-reply@duymanhnoithat.vn' },
    ]

    for (const cfg of configs) {
      const exists = await queryRunner.query(
        'SELECT `key` FROM site_config WHERE `key` = ?', [cfg.key]
      )
      if (exists.length === 0) {
        await queryRunner.query(
          `INSERT INTO site_config (\`key\`, value) VALUES (?, ?)`,
          [cfg.key, cfg.value]
        )
      } else {
        await queryRunner.query(
          `UPDATE site_config SET value = ? WHERE \`key\` = ?`,
          [cfg.value, cfg.key]
        )
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

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
