import type { Metadata } from 'next'
import { Award, CheckCircle2, Clock, Shield } from 'lucide-react'
import { PageBanner } from '@/components/shared/PageBanner'

export const metadata: Metadata = {
  title: 'Giới thiệu - Nội Thất Duy Mạnh',
  description:
    'Xưởng sản xuất tủ bếp và nội thất gia đình Duy Mạnh tại Vân Nam, Phúc Thọ, Hà Nội. Hơn 10 năm kinh nghiệm, 500+ công trình hoàn thành.',
}

const HERO_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAUH7WPHs7Hdu5hOLGrf6EuKO5To8WzIOMWY0x_WHYgsIPpL6374msknhNrOGdRNlhRyaNY_6C8yFyD9Jb9kwWt6BVl8UDmk2Puf5C5JOCEwpwqYOJpb_wivvrJlRnFjLg0bcPUtdLcdUXL_2ssmNkCOvFpNXVB841-MeAiLhnbdBO2N0MTcBKKNCOAWkjdXwRo0fKeJp8sshokh3mSVA8WW_q-SMfxi-ot7h559D8g1BCjglMUSi-fnT3RgBlH2uryZzTn51wgB7gK'

const STORY_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDvB3-HpRPKYcrraeXQYFcMfo51YpjCax6qv4WHMDJr6V-gxo9SnL5g5pL3W3fjAoaWKN6YacxNx5-yYG0Eig6vNG-pQtEdO0s-Gy4hLDikAcHkYCy-RyXQgfL2FTn_C721v6UO9fjBkfeSb1T8IS4AZcCxiw33Y5Ti6WCLA6Umepze-5sS247y2XF4e1FfUFkqQMTsUmfx2tP6DWC9JzcaMm5zHdR75QYUoRFGzFU9lvkI4E8wZ5ISAYcwAMdNUY3xbiI4_GJXPVzo'

const WORK_PROCESS = [
  { step: '01', title: 'Tư vấn & khảo sát', desc: 'Đo đạc tận nhà, tư vấn vật liệu và phương án bố trí phù hợp ngân sách.' },
  { step: '02', title: 'Thiết kế 3D', desc: 'Dựng phối cảnh để khách hàng nhìn rõ màu sắc, công năng và tỉ lệ trước sản xuất.' },
  { step: '03', title: 'Báo giá', desc: 'Tách rõ từng hạng mục, vật liệu, phụ kiện và điều khoản bảo hành.' },
  { step: '04', title: 'Sản xuất', desc: 'Gia công tại xưởng, kiểm tra kích thước và hoàn thiện trước khi xuất xưởng.' },
  { step: '05', title: 'Lắp đặt', desc: 'Đội thợ thi công tại nhà, xử lý gọn gàng và bàn giao theo tiến độ.' },
  { step: '06', title: 'Bảo hành', desc: 'Theo dõi sau bàn giao, bảo hành kỹ thuật và hỗ trợ bảo dưỡng định kỳ.' },
]

const COMMITMENTS = [
  { icon: Shield, title: 'Vật liệu rõ nguồn gốc', desc: 'Inox 304, MDF chống ẩm, Acrylic và phụ kiện được tư vấn minh bạch theo nhu cầu.' },
  { icon: CheckCircle2, title: 'Đúng thiết kế', desc: 'Thi công theo bản vẽ đã thống nhất, không tự ý đổi vật liệu hoặc kích thước.' },
  { icon: Clock, title: 'Đúng tiến độ', desc: 'Lịch sản xuất và lắp đặt được chốt ngay từ đầu, có cập nhật trong quá trình làm.' },
  { icon: Award, title: 'Bảo hành 5 năm', desc: 'Xử lý lỗi kỹ thuật phát sinh trong thời gian bảo hành theo cam kết hợp đồng.' },
]

export default function AboutPage() {
  return (
    <>
      <PageBanner
        slug="gioi-thieu"
        title="Nội Thất Duy Mạnh"
        subtitle="Hơn 10 năm đồng hành cùng các gia đình tại Hà Nội, tập trung vào tủ bếp và nội thất bền, dễ dùng, thi công trực tiếp từ xưởng."
        label="Về chúng tôi"
      />

      <section className="bg-surface-bright px-4 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-content items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 font-label text-xs uppercase tracking-[0.22em] text-tertiary">Câu chuyện</p>
            <h2 className="max-w-xl font-headline text-3xl font-bold leading-tight text-primary md:text-5xl">
              Từ xưởng nhỏ đến thương hiệu được tin chọn
            </h2>
            <div className="mt-8 space-y-5 text-body-md leading-relaxed text-on-surface-variant">
              <p>
                Nội Thất Duy Mạnh bắt đầu từ một xưởng mộc tại Vân Nam, Phúc Thọ. Lợi thế lớn nhất là làm trực tiếp tại xưởng, kiểm soát được vật liệu, kích thước và tiến độ.
              </p>
              <p>
                Đến nay, đội ngũ đã hoàn thành hơn <strong className="font-semibold text-primary">500 công trình</strong> tủ bếp và nội thất gia đình tại Hà Nội cùng các tỉnh lân cận.
              </p>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="border-l border-outline-variant pl-5">
                <p className="font-headline text-4xl font-bold text-primary">500+</p>
                <p className="mt-1 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Công trình</p>
              </div>
              <div className="border-l border-outline-variant pl-5">
                <p className="font-headline text-4xl font-bold text-primary">10+</p>
                <p className="mt-1 font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Năm kinh nghiệm</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-xl bg-surface-container shadow-card">
              <img src={STORY_IMAGE} alt="Không gian sản xuất nội thất" className="h-full w-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden max-w-[260px] rounded-xl bg-surface-bright p-5 shadow-card md:block">
              <p className="font-headline text-xl font-bold text-primary">Sản xuất tại xưởng</p>
              <p className="mt-2 text-body-sm leading-relaxed text-on-surface-variant">
                Kiểm tra từng chi tiết trước khi lắp đặt tại nhà.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low px-4 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-content">
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 font-label text-xs uppercase tracking-[0.22em] text-tertiary">Quy trình</p>
            <h2 className="font-headline text-3xl font-bold leading-tight text-primary md:text-5xl">
              6 bước làm việc rõ ràng
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WORK_PROCESS.map(({ step, title, desc }) => (
              <div key={step} className="rounded-xl border border-outline-variant/70 bg-surface-bright p-6 shadow-ambient-sm">
                <span className="font-label text-xs uppercase tracking-widest text-tertiary">{step}</span>
                <h3 className="mt-4 font-headline text-xl font-bold text-primary">{title}</h3>
                <p className="mt-3 text-body-sm leading-relaxed text-on-surface-variant">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-bright px-4 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-content">
          <div className="mb-12 text-center">
            <p className="mb-4 font-label text-xs uppercase tracking-[0.22em] text-tertiary">Cam kết</p>
            <h2 className="font-headline text-3xl font-bold leading-tight text-primary md:text-5xl">
              Chất lượng nhìn được, dùng được
            </h2>
          </div>
          <div className="mx-auto grid max-w-4xl gap-5 sm:grid-cols-2">
            {COMMITMENTS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 rounded-xl bg-surface-container-low p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-tertiary/10">
                  <Icon className="h-5 w-5 text-tertiary" />
                </div>
                <div>
                  <h3 className="font-headline text-lg font-bold text-primary">{title}</h3>
                  <p className="mt-2 text-body-sm leading-relaxed text-on-surface-variant">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
