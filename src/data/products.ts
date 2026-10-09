import { Product, CategoryInfo } from '../types';

export interface EcosystemPillar {
  id: string;
  pillarNumber: string;
  name: string;
  subtitle: string;
  badge: string;
  tagline: string;
  desc: string;
  highlights: string[];
  keyBenefits: string[];
  image: string;
  productCount: number;
}

export const ECOSYSTEM_PILLARS: EcosystemPillar[] = [
  {
    id: 'thuc-pham-an-uong',
    pillarNumber: '01',
    name: 'Lưu trữ thực phẩm & đồ dùng ăn uống',
    subtitle: 'Bữa ăn thơm ngon & Gian bếp gia đình sạch sẽ',
    badge: 'NHÓM 01',
    tagline: 'Giữ ấm yêu thương, an toàn thực phẩm mỗi ngày',
    desc: 'Túi giữ nhiệt cơm trưa 3 lớp cách nhiệt cùng khăn khô tiệt trùng và khăn bông 100% Cotton tự nhiên Daizy Daily bảo vệ sức khỏe cho cả nhà.',
    highlights: ['Giữ ấm/mát đến 6 giờ', '100% Cotton tự nhiên', 'Kháng rò rỉ nước & dầu mỡ'],
    keyBenefits: ['Hộp cơm luôn ấm nóng tròn vị', 'Khăn lau vô trùng an toàn cho mẹ & bé', 'Dễ dàng lau chùi vệ sinh sau bữa ăn'],
    image: '/images/products/hugz-lunch-bag.jpg',
    productCount: 3,
  },
  {
    id: 'vat-dung-nho',
    pillarNumber: '02',
    name: 'Lưu trữ vật dụng nhỏ',
    subtitle: 'Ngăn nắp từng chi tiết, nâng niu phụ kiện quý giá',
    badge: 'NHÓM 02',
    tagline: 'Không lo trầy xước, tạm biệt dây chuyền rối nùi',
    desc: 'Hộp túi trang sức sandwich mở gập đa tầng chống rối, phối cùng bộ túi zipper đa kích cỡ bảo quản củ sạc, tai nghe, chìa khóa và phụ kiện nhỏ.',
    highlights: ['Lớp lót nhung nỉ đào êm dịu', 'Cấu trúc sandwich đa tầng', 'Set multi-size tiện lợi'],
    keyBenefits: ['Chống rối dây chuyền và thất lạc khuyên tai', 'Phụ kiện điện tử gọn ghẽ không vướng víu', 'Kích thước bỏ túi xách linh hoạt'],
    image: '/images/products/hugz-jewelry-case.jpg',
    productCount: 2,
  },
  {
    id: 'tai-lieu',
    pillarNumber: '03',
    name: 'Túi đựng tài liệu',
    subtitle: 'Dùng ngay lấy ngay — Không lo thất lạc',
    badge: 'NHÓM 03',
    tagline: 'Giấy tờ, hộ chiếu và thẻ luôn trong tầm tay',
    desc: 'Ví kéo 2 ngăn độc lập có móc cổ tay và túi đeo chéo Outdoor chuyên dụng bảo vệ hộ chiếu, thẻ căn cước, vé máy bay và tiền mặt an toàn tuyệt đối.',
    highlights: ['2 ngăn khóa kéo độc lập', 'Quai móc cổ tay chống cướp giật', 'Vải Canvas chần dù dã ngoại'],
    keyBenefits: ['Rút thẻ và giấy tờ tùy thân trong 1 giây', 'An toàn khi di chuyển sân bay, bến xe', 'Gọn gàng trong lòng bàn tay'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGcWOo_xDbeOyrdi91bissyPfvo34DTn7pPXuiFO-SL5RRBdg0WbC5IXTYcu8pJNRZrjjgN9V7C9NED_mHPNbvnZLIWZ-KcfclppPqvGmrYJnkgSD7wh8qCrm7TBSuGj5OAouW3N0dKXLMU-ngBQEBhMiyNgqzVDQ-Ung51FNm7NrpzEFKPa5VIucdHurjlY_FsdcGMWpi2YuKs6vbXuB6_8wNXAwoLSJvYEaidl0t7K2MzBaTYPn3XySEeDOXnigK-6Y',
    productCount: 2,
  },
  {
    id: 'do-ca-nhan',
    pillarNumber: '04',
    name: 'Túi đựng đồ cá nhân',
    subtitle: 'Chăm sóc bản thân & Tự tin rạng rỡ mỗi ngày',
    badge: 'NHÓM 04',
    tagline: 'Gọn nhẹ, chống nước, họa tiết độc quyền tràn đầy năng lượng',
    desc: 'Túi Mini HUGZ Storage Bag chống nước độc quyền cùng các dòng túi mỹ phẩm form đứng dung tích lớn và túi make up vali chia ngăn cọ chuyên nghiệp.',
    highlights: ['Vải Oxford tráng màng chống thấm', 'Form đứng chống xẹp lún chai lọ', 'Ngăn cắm cọ bọc TPU vệ sinh'],
    keyBenefits: ['Bảo vệ mỹ phẩm và đồ cá nhân khỏi ngấm nước', 'Chứa trọn bộ skincare không lo đổ vỡ', 'Thời trang phong cách pastel HUGZ'],
    image: '/images/products/hugz-mini-pouch.jpg',
    productCount: 3,
  },
  {
    id: 'phan-loai-san-pham',
    pillarNumber: '05',
    name: 'Lưu trữ theo phân loại sản phẩm',
    subtitle: 'Tối ưu 60% không gian vali, tủ quần áo & Chuyến đi xa',
    badge: 'NHÓM 05',
    tagline: 'Phân loại khoa học, nhân đôi diện tích chứa đồ',
    desc: 'Set túi nén phân loại vali thông minh, túi du lịch gấp gọn 45L gài cần kéo, túi rút đựng đồ bẩn cách ẩm, thảm dã ngoại bỏ túi và chăn sữa thu đông ấm áp.',
    highlights: ['Vải Ripstop & Oxford chịu lực', 'Đai gài cần kéo vali tiện lợi', 'Túi rút cách ẩm ngăn mùi'],
    keyBenefits: ['Tìm đồ trong tích tắc mà không bới tung vali', 'Đồ sạch và đồ bẩn luôn tách biệt hoàn toàn', 'Gấp siêu mỏng tiết kiệm diện tích tủ nhà'],
    image: '/images/products/hugz-foldable-travel.jpg',
    productCount: 6,
  },
];

export const CATEGORIES: CategoryInfo[] = [
  { id: 'all', name: 'Tất cả sản phẩm', iconName: 'grid_view', count: 16, desc: 'Trọn bộ 16 sản phẩm trong Hệ sinh thái lưu trữ thông minh HUGZ' },
  { id: 'thuc-pham-an-uong', name: 'Lưu trữ thực phẩm & đồ dùng ăn uống', iconName: 'utensils', count: 3, desc: 'Túi cơm giữ nhiệt 3 lớp, khăn khô & khăn mặt bông cotton 100%', pillarIndex: 1, badge: 'Nhóm 01', subtitle: 'Bữa ăn thơm ngon & Gian bếp sạch sẽ' },
  { id: 'vat-dung-nho', name: 'Lưu trữ vật dụng nhỏ', iconName: 'sparkles', count: 2, desc: 'Túi trang sức sandwich chống rối, bộ túi đa năng zipper bảo quản phụ kiện', pillarIndex: 2, badge: 'Nhóm 02', subtitle: 'Ngăn nắp từng chi tiết' },
  { id: 'tai-lieu', name: 'Túi đựng tài liệu', iconName: 'file-text', count: 2, desc: 'Ví mini 2 khóa kéo “Dùng ngay lấy ngay”, túi đeo chéo Outdoor an toàn', pillarIndex: 3, badge: 'Nhóm 03', subtitle: 'Dùng ngay lấy ngay - Không lo thất lạc' },
  { id: 'do-ca-nhan', name: 'Túi đựng đồ cá nhân', iconName: 'heart', count: 3, desc: 'Túi Mini HUGZ chống nước, túi mỹ phẩm form đứng & túi makeup đa ngăn', pillarIndex: 4, badge: 'Nhóm 04', subtitle: 'Chăm sóc cá nhân & Làm đẹp' },
  { id: 'phan-loai-san-pham', name: 'Lưu trữ theo phân loại sản phẩm', iconName: 'layers', count: 6, desc: 'Set túi du lịch phân loại, túi gấp gọn 45L, túi đồ bẩn, thảm picnic & chăn sữa', pillarIndex: 5, badge: 'Nhóm 05', subtitle: 'Nhân đôi không gian vali & Tủ đồ' },
];

export const PRODUCTS: Product[] = [
  // 1. TÚI MINI HUGZ STORAGE BAG
  {
    id: 'tui-mini-hugz-storage-bag',
    title: 'Túi Mini HUGZ Storage Bag Chống Nước Đựng Đồ Cá Nhân',
    subtitle: 'Nhỏ gọn tiện lợi, vải Oxford chống thấm nước',
    category: 'Túi đựng đồ cá nhân',
    categorySlug: 'do-ca-nhan',
    price: 139160,
    originalPrice: 196000,
    rating: 5.0,
    reviewsCount: 349,
    soldCount: '349 đã bán',
    badge: 'SHOPEE MALL 10.10',
    badgeColor: 'primary',
    image: '/images/products/hugz-mini-pouch.jpg',
    description: 'Túi Mini HUGZ Storage Bag chống nước họa tiết động vật và lượn sóng pastel độc quyền HUGZ. Thiết kế nhỏ gọn tiện lợi mang theo son phấn, tiền lẻ, chìa khóa, sạc cáp và vật dụng cá nhân bỏ túi xách hằng ngày.',
    features: [
      'Chất liệu vải Oxford tráng màng chống thấm nước cao cấp',
      'Khóa kéo kim loại trơn tru, đường may gia cố tỉ mỉ',
      'Họa tiết độc quyền HUGZ phong cách kén ấp ấm áp cho gia đình',
      'Trọng lượng siêu nhẹ chỉ 45g, dễ dàng bỏ vào balo hoặc túi xách'
    ],
    dimensions: '14cm x 10cm x 5cm',
    material: 'Oxford tráng PU chống thấm nước',
    variants: ['Họa tiết Koala Vàng', 'Lượn sóng Chevron', 'Xanh Biển Pastel', 'Caro Tím Nhạt'],
    shopeeUrl: 'https://shopee.vn/T%C3%BAi-Mini-HUGZ-Storage-Bag-Ch%E1%BB%91ng-N%C6%B0%E1%BB%9Bc-T%C3%BAi-%C4%90%E1%BB%B1ng-%C4%90%E1%BB%93-C%C3%A1-Nh%C3%A2n-G%E1%BB%8Dn-Nh%E1%BA%B9-%C4%90a-N%C4%83ng-i.1819870467.44910117632',
    tiktokUrl: 'https://www.tiktok.com/@hugzvietnam',
    isBestSeller: true,
    isNew: true,
  },

  // 2. TÚI ĐỰNG MỸ PHẨM HUGZ DUNG TÍCH LỚN
  {
    id: 'tui-dung-my-pham-hugz-dung-tich-lon',
    title: 'Túi Đựng Mỹ Phẩm HUGZ Dung Tích Lớn, Túi Make Up Đa Năng',
    subtitle: 'Form đứng cứng cáp, chứa trọn bộ skincare',
    category: 'Túi đựng đồ cá nhân',
    categorySlug: 'do-ca-nhan',
    price: 220500,
    originalPrice: 329000,
    rating: 4.9,
    reviewsCount: 419,
    soldCount: '419 đã bán',
    badge: 'TOP MAKE UP DUNG TÍCH LỚN',
    badgeColor: 'primary',
    image: '/images/products/hugz-makeup-large.png',
    description: 'Túi đựng mỹ phẩm HUGZ form đứng dung tích lớn với họa tiết sọc thanh lịch. Chứa trọn bộ chai lọ dưỡng da, toner, kem nền và cọ trang điểm mà không bị đổ ngã, thích hợp để bàn phấn hoặc mang đi du lịch.',
    features: [
      'Form đứng vững chãi, chống xẹp lún khi đặt trên bàn trang điểm',
      'Chất liệu kháng nước, dễ dàng lau sạch vết phấn và kem nền',
      'Quai xách êm ái, tiện lợi xách tay khi đi công tác và du lịch',
      'Ngăn lưới phụ bên trong giúp phân loại phụ kiện nhỏ'
    ],
    dimensions: '24cm x 17cm x 14cm',
    material: 'Canvas dệt tráng PU chống thấm cao cấp',
    variants: ['Kẻ sọc Nâu Be', 'Kẻ sọc Đen Trắng', 'Caro Xanh Lá'],
    shopeeUrl: 'https://shopee.vn/T%C3%BAi-%C4%90%E1%BB%B1ng-M%E1%BB%B9-Ph%E1%BA%A9m-HUGZ-Dung-T%C3%ADch-L%E1%BB%9Bn-T%C3%BAi-%C4%90%E1%BB%B1ng-%C4%90%E1%BB%93-V%E1%BB%87-Sinh-Ch%E1%BB%91ng-N%C6%B0%E1%BB%9Bc-%C4%90a-N%C4%83ng-i.1819870467.44560240716?extraParams=%7B%22display_model_id%22%3A430896841833%2C%22model_selection_logic%22%3A3%7D',
    tiktokUrl: 'https://www.tiktok.com/@hugzvietnam',
    isBestSeller: true,
    isNew: true,
  },

  // 3. TÚI ĐỰNG ĐỒ MAKE UP HUGZ NHIỀU NGĂN
  {
    id: 'tui-dung-do-makeup-hugz-nhieu-ngan',
    title: 'Túi Đựng Đồ Make Up HUGZ Nhiều Ngăn, Túi Đựng Đồ Cá Nhân Du Lịch',
    subtitle: 'Mở rộng toàn phần, ngăn cọ riêng biệt',
    category: 'Túi đựng đồ cá nhân',
    categorySlug: 'do-ca-nhan',
    price: 269500,
    originalPrice: 402000,
    rating: 4.8,
    reviewsCount: 337,
    soldCount: '337 đã bán',
    badge: 'ĐA NGĂN THÔNG MINH',
    badgeColor: 'secondary',
    image: '/images/products/hugz-makeup-stripes.jpg',
    description: 'Thiết kế mở rộng toàn phần dạng vali mini với họa tiết sọc vàng tươi vui đặc trưng HUGZ. Đa ngăn cắm cọ riêng biệt có nắp chắn bụi, ngăn chống thấm cho đồ ướt và ngăn phụ kéo khóa.',
    features: [
      'Khoang chứa chia ngăn khoa học, nhìn thấy toàn bộ đồ dùng ngay khi mở',
      'Vách ngăn cọ trang điểm có màng nhựa TPU bảo vệ chống bẩn đầu cọ',
      'Chất liệu vải cao cấp kháng khuẩn và chống ẩm mốc',
      'Khóa kéo đôi mạ kim loại trơn tru bền bỉ'
    ],
    dimensions: '22cm x 16cm x 12cm',
    material: 'Polyester dệt kháng ẩm cao cấp',
    variants: ['Sọc Vàng HUGZ Sunshine', 'Sọc Hồng Baby', 'Xanh Mint Dịu Nhẹ'],
    shopeeUrl: 'https://s.shopee.vn/9pbeimilNQ',
    tiktokUrl: 'https://www.tiktok.com/@hugzvietnam',
    isBestSeller: true,
    isNew: true,
  },

  // 4. SET TÚI VẢI ĐỰNG ĐỒ DU LỊCH, SẮP XẾP QUẦN ÁO
  {
    id: 'set-tui-vai-dung-do-du-lich-sap-xep-quan-ao',
    title: 'Set Túi Vải Đựng Đồ Du Lịch, Sắp Xếp Quần Áo HUGZ',
    subtitle: 'Mua 3 & giảm 5% - Phân loại vali siêu gọn',
    category: 'Lưu trữ theo phân loại sản phẩm',
    categorySlug: 'phan-loai-san-pham',
    price: 230000,
    originalPrice: 328000,
    rating: 4.0,
    reviewsCount: 37,
    soldCount: '37 đã bán',
    badge: 'MUA 3 & GIẢM 5%',
    badgeColor: 'secondary',
    image: '/images/products/hugz-travel-cubes.jpg',
    description: 'Set túi vải phân loại hành lý thông minh HUGZ giúp bạn nhân đôi không gian vali. Các kích cỡ phân loại từ áo quần, đồ lót đến phụ kiện cá nhân, giữ trang phục luôn phẳng phiu suốt chuyến đi.',
    features: [
      'Chất liệu vải dệt siêu nhẹ không tăng trọng lượng hành lý',
      'Mặt lưới thoáng khí giúp trang phục không bị ám mùi hầm bí',
      'Dây kéo đôi mở 2 chiều tiện lợi thao tác sắp xếp',
      'Gấp gọn siêu mỏng khi không sử dụng'
    ],
    dimensions: 'Set gồm 3-4 kích thước từ 20cm đến 40cm',
    material: 'Oxford Poly dệt tổ ong kháng nước',
    variants: ['Set Sọc Cam Sunshine', 'Set Sọc Xanh Navy', 'Set Họa Tiết Tổng Hợp'],
    shopeeUrl: 'https://s.shopee.vn/9pbeimilNQ',
    tiktokUrl: 'https://www.tiktok.com/@hugzvietnam',
    isNew: true,
  },

  // 5. TÚI ĐỰNG ĐỒ DU LỊCH GẤP GỌN CHỐNG NƯỚC
  {
    id: 'tui-dung-do-du-lich-gap-gon-chong-nuoc',
    title: 'Túi Đựng Đồ Du Lịch HUGZ Gấp Gọn Chống Nước Dung Tích Lớn',
    subtitle: 'Gấp gọn siêu đỉnh, gài cần kéo vali tiện lợi',
    category: 'Lưu trữ theo phân loại sản phẩm',
    categorySlug: 'phan-loai-san-pham',
    price: 850000,
    originalPrice: 1250000,
    rating: 5.0,
    reviewsCount: 77,
    soldCount: '77 đã bán',
    badge: 'MUA ĐỂ NHẬN QUÀ',
    badgeColor: 'primary',
    image: '/images/products/hugz-foldable-travel.jpg',
    description: 'Túi du lịch cao cấp dung tích cực lớn với họa tiết kẻ ô hiện đại HUGZ. Khả năng gấp gọn thành một chiếc ví nhỏ khi cần cất trữ và có đai gài vừa vặn vào cần kéo vali.',
    features: [
      'Dung tích lớn lên đến 45L chứa thoải mái đồ cho chuyến đi 4-7 ngày',
      'Đai gài cần kéo vali du lịch chống xô lệch rơi rớt',
      'Vải dù chống thấm nước cấp độ 5, chống cào xước rách',
      'Có ngăn đựng giày dép riêng biệt tách khỏi quần áo sạch'
    ],
    dimensions: '50cm x 35cm x 22cm (Gấp gọn: 20cm x 18cm)',
    material: 'Polyester Oxford chống thấm nước chuyên dụng',
    variants: ['Caro Xanh Teal Mint', 'Vàng Mù Tạt HUGZ', 'Xám Bạc Tối Giản'],
    shopeeUrl: 'https://s.shopee.vn/9pbeimilNQ',
    tiktokUrl: 'https://www.tiktok.com/@hugzvietnam',
    isBestSeller: true,
    isNew: true,
  },

  // 6. TÚI ĐỰNG QUẦN ÁO BẨN HUGZ CHỐNG ẨM
  {
    id: 'tui-quan-ao-ban',
    title: 'Túi Đựng Quần Áo BẨn HUGZ Chống Ẩm, Túi Rút Tiện Lợi',
    subtitle: 'Dây rút kín mùi, kháng ẩm tuyệt đối',
    category: 'Lưu trữ theo phân loại sản phẩm',
    categorySlug: 'phan-loai-san-pham',
    price: 195020,
    originalPrice: 300000,
    rating: 5.0,
    reviewsCount: 174,
    soldCount: '174 đã bán',
    badge: 'KHÁNG ẨM CÁCH MÙI',
    badgeColor: 'tertiary',
    image: '/images/products/hugz-laundry-bag.jpg',
    description: 'Túi rút đựng quần áo bẩn HUGZ chuyên dụng cho du lịch và gia đình. Miệng dây rút kín giữ đồ bẩn tách biệt khỏi quần áo sạch, ngăn mùi hôi và hơi ẩm hiệu quả suốt chuyến đi.',
    features: [
      'Lớp lót chống thấm nước ngăn rò rỉ ẩm ướt sang đồ đạc khác',
      'Miệng dây rút mở đóng tức thì, có quai xách xách tay tiện lợi',
      'Họa tiết Zigzag Chevron và sọc pastel trẻ trung thời trang',
      'Giặt sạch dễ dàng bằng máy giặt mà không phai màu'
    ],
    dimensions: '48cm x 40cm',
    material: 'Oxford tráng màng kháng nước PU',
    variants: ['Zigzag Đen Trắng Chevron', 'Sọc Tím Pastel', 'Sọc Vàng Kem'],
    shopeeUrl: 'https://s.shopee.vn/9pbeimilNQ',
    tiktokUrl: 'https://www.tiktok.com/@hugzvietnam',
    isBestSeller: true,
    isNew: true,
  },

  // 7. TÚI ĐỰNG CƠM TRƯA HUGZ CHỐNG NƯỚC GIỮ NHIỆT
  {
    id: 'tui-dung-com-trua-hugz-chong-nuoc',
    title: 'Túi Đựng Cơm Trưa HUGZ Chống Nước, Túi Giữ Nhiệt Hộp Cơm',
    subtitle: 'Giữ nhiệt 3 lớp, chống nước thời trang văn phòng',
    category: 'Lưu trữ thực phẩm & đồ dùng ăn uống',
    categorySlug: 'thuc-pham-an-uong',
    price: 342020,
    originalPrice: 488000,
    rating: 5.0,
    reviewsCount: 103,
    soldCount: '103 đã bán',
    badge: 'MUA 3 & GIẢM 5%',
    badgeColor: 'secondary',
    image: '/images/products/hugz-lunch-bag.jpg',
    description: 'Túi đựng cơm trưa giữ nhiệt HUGZ với thiết kế họa tiết hoa quả và kẻ sọc bắt mắt. Cấu trúc 3 lớp cách nhiệt giữ cơm nóng sốt và nước mát lạnh suốt 4-6 tiếng.',
    features: [
      'Lớp lót màng nhôm thực phẩm phản xạ nhiệt và chống rò rỉ nước canh',
      'Lớp giữa đệm mút EPE dày 5mm cách nhiệt hiệu quả',
      'Vải ngoài Oxford kháng nước, chống bám bẩn dầu mỡ',
      'Đựng vừa hộp cơm 2-3 tầng kèm chai nước và trái cây'
    ],
    dimensions: '23cm x 15cm x 20cm',
    material: 'Oxford 600D + Mút EPE + Lớp màng nhôm cách nhiệt',
    variants: ['Sọc Vàng Chanh', 'Chấm bi Đen Trắng', 'Sọc Hồng Dưa Hấu'],
    shopeeUrl: 'https://s.shopee.vn/9pbeimilNQ',
    tiktokUrl: 'https://www.tiktok.com/@hugzvietnam',
    isBestSeller: true,
    isNew: true,
  },

  // 8. KHĂN LAU MẶT DÙNG 1 LẦN DAIZY DAILY
  {
    id: 'khan-lau-mat-dung-1-lan-daizy-daily',
    title: 'Khăn Lau Mặt Dùng 1 Lần Daizy Daily Khăn Khô Đa Năng Cotton 100%',
    subtitle: '100% Pure Cotton mềm mại, sạch mụn dưỡng da',
    category: 'Lưu trữ thực phẩm & đồ dùng ăn uống',
    categorySlug: 'thuc-pham-an-uong',
    price: 42000,
    originalPrice: 55000,
    rating: 4.8,
    reviewsCount: 69,
    soldCount: '69 đã bán',
    badge: 'MUA ĐỂ NHẬN QUÀ',
    badgeColor: 'tertiary',
    image: '/images/products/hugz-cotton-wipes.jpg',
    description: 'Khăn lau mặt dùng 1 lần Daizy Daily chiết xuất từ 100% sợi bông Cotton tự nhiên. Thay thế hoàn toàn khăn mặt ẩm mốc thông thường để ngăn ngừa vi khuẩn và mụn, chăm sóc làn da nhạy cảm.',
    features: [
      '100% Sợi bông Cotton tự nhiên không pha nilon hay sợi tái chế',
      'Dập nổi vân ngọc trai 3D tăng khả năng làm sạch sâu bã nhờn',
      'Không huỳnh quang, không mùi hóa chất, an toàn cho mẹ và bé sơ sinh',
      'Độ dai vượt trội, dùng khô hoặc nhúng nước ấm không vụn rách'
    ],
    dimensions: 'Gói 80-100 tờ (200x200mm/tờ)',
    material: '100% Bông Cotton tự nhiên nhập khẩu',
    variants: ['Gói Tím Lavender Hoa Cúc', 'Combo 2 Gói Tiết Kiệm', 'Thùng 6 Gói Gia Đình'],
    shopeeUrl: 'https://s.shopee.vn/9pbeimilNQ',
    tiktokUrl: 'https://www.tiktok.com/@hugzvietnam',
    isBestSeller: true,
    isNew: true,
  },

  // 9. THẢM DÃ NGOẠI HUGZ GẤP GỌN CHỐNG NƯỚC
  {
    id: 'tham-da-ngoai-hugz-gap-gon-chong-nuoc',
    title: 'Thảm Dã Ngoại HUGZ Gấp Gọn Chống Nước Bỏ Túi Tiện Lợi',
    subtitle: 'Kháng ẩm mặt cỏ, bỏ túi gấp gọn đi picnic',
    category: 'Lưu trữ theo phân loại sản phẩm',
    categorySlug: 'phan-loai-san-pham',
    price: 432180,
    originalPrice: 645000,
    rating: 5.0,
    reviewsCount: 92,
    soldCount: '92 đã bán',
    badge: 'CHỐNG THẤM ĐA ĐỊA HÌNH',
    badgeColor: 'primary',
    image: '/images/products/hugz-picnic-mat.jpg',
    description: 'Thảm picnic dã ngoại HUGZ họa tiết sọc xanh thiên nhiên. Mặt đáy tráng màng chống thấm nước và hơi ẩm từ cỏ ướt hay cát biển, xếp gọn thành túi có quai xách siêu nhỏ mang đi mọi nơi.',
    features: [
      'Đáy thảm tráng màng PE nhôm chống ẩm ướt và cách nhiệt mặt đất',
      'Mặt thảm vải dệt êm ái, thoáng khí cho cả gia đình 4-6 người ngồi',
      'Gấp gọn thao tác nhanh với băng dán khóa dính và quai xách tay',
      'Vệ sinh dễ dàng bằng cách giũ sạch cát bụi hoặc lau khăn ướt'
    ],
    dimensions: '150cm x 200cm (Gấp gọn: 25cm x 18cm)',
    material: 'Vải dệt Poly acrylic + Đệm EPE + Đáy chống thấm PE',
    variants: ['Kẻ sọc Xanh Trắng Forest', 'Kẻ sọc Vàng Nắng', 'Kẻ Caro Cổ Điển'],
    shopeeUrl: 'https://s.shopee.vn/9pbeimilNQ',
    tiktokUrl: 'https://www.tiktok.com/@hugzvietnam',
    isBestSeller: true,
    isNew: true,
  },

  // 10. TÚI TRANG SỨC SANDWICH HUGZ HỘP ĐỰNG PHỤ KIỆN
  {
    id: 'tui-trang-suc-sandwich',
    title: 'Túi Trang Sức Sandwich HUGZ Hộp Đựng PhỤ Kiện Du Lịch',
    subtitle: 'Mua 3 & giảm 5% - Chống rối dây chuyền, khuyên tai',
    category: 'Lưu trữ vật dụng nhỏ',
    categorySlug: 'vat-dung-nho',
    price: 395000,
    originalPrice: 520000,
    rating: 4.6,
    reviewsCount: 55,
    soldCount: '55 đã bán',
    badge: 'MUA 3 & GIẢM 5%',
    badgeColor: 'primary',
    image: '/images/products/hugz-jewelry-case.jpg',
    description: 'Hộp túi trang sức dạng Sandwich HUGZ với cấu trúc mở lật đa tầng thông minh. Giữ khuyên tai, nhẫn, vòng ngọc trai và dây chuyền luôn ngăn nắp không bị cọ xát trầy xước khi di chuyển.',
    features: [
      'Thiết kế đa tầng chống rối dây chuyền và thất lạc khuyên tai',
      'Lót nhung nỉ đào êm dịu bảo vệ bề mặt trang sức quý',
      'Form sandwich cứng cáp chống va đập đè bẹp trong hành lý',
      'Khóa kéo đôi chắc chắn mạ kim loại sang trọng'
    ],
    dimensions: '12cm x 12cm x 5.5cm',
    material: 'Da nhân tạo PU cao cấp & Lót nhung nỉ đào',
    variants: ['Hồng Phấn Sandwich', 'Sọc Xanh Navy Trắng', 'Chấm Bi Retro'],
    shopeeUrl: 'https://s.shopee.vn/9pbeimilNQ',
    tiktokUrl: 'https://www.tiktok.com/@hugzvietnam',
    isBestSeller: true,
    isNew: true,
  },

  // 11. BỘ TÚI DU LỊCH 7 MÓN PACKING
  {
    id: 'bo-tui-du-lich-7-mon',
    title: 'Bộ Túi Du Lịch 7 Món Cao Cấp HUGZ',
    subtitle: 'Giải pháp vali chuẩn mực, tiết kiệm 60% diện tích',
    category: 'Lưu trữ theo phân loại sản phẩm',
    categorySlug: 'phan-loai-san-pham',
    price: 389000,
    originalPrice: 499000,
    rating: 5.0,
    reviewsCount: 2400,
    soldCount: '5.8k đã bán',
    badge: 'FULL PACKING 7 MÓN',
    badgeColor: 'tertiary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdqMkHhcCAIa3wYCd98S5T0i2qRPjXBucRbar_wp9ui3iHOYOtZCJ7qWY1tTzEapPHF573OKg4UjKxgOp56EIWwaXdXtDX37y2lB25ppON6A5efSDJbE0h3bCKgR5bqs9CWz7v71srBtfbn5tiyzCGCrwM514DlvaW5l3NxFNkm-rpd_BbR3_A0HrwzpEqdKdR3qnxav2wZU1pGZDYA1TC7zxnFszYkeCs1ynKSXh4ar_8-I5VAjuLOFR4luq5fnQ93OE',
    description: 'Set vali chuyên nghiệp gồm hộp quần áo lớn, hộp đồ lót form đứng, túi đựng giày có vách ngăn, túi mỹ phẩm và các túi phụ kiện. Tối ưu đến 60% diện tích vali xách tay 20-24 inch.',
    features: [
      'Gồm 7 túi chuyên biệt đáp ứng đủ mọi nhu cầu chuyến đi 5-7 ngày',
      'Mặt lưới thông thoáng giúp quần áo thơm tho và dễ nhận diện',
      'Khóa kéo đôi chắc chắn chịu lực nén vali cao',
      'Dễ dàng gấp phẳng cất vào ngăn tủ khi không sử dụng'
    ],
    dimensions: 'Hộp lớn: 40x30x12cm, Hộp vừa: 32x28x12cm, Túi giày: 36x21cm...',
    material: 'Nylon Ripstop 290D siêu dai & Kháng nước',
    variants: ['Set Xanh Mint Thư Thái', 'Set Be Nude Thanh Lịch', 'Set Vàng Bơ HUGZ'],
    shopeeUrl: 'https://s.shopee.vn/9pbeimilNQ',
    tiktokUrl: 'https://www.tiktok.com/@hugzvietnam',
    isBestSeller: true,
  },

  // 12. TÚI ĐEO CHÉO NHIỀU NGĂN
  {
    id: 'tui-deo-cheo-nhieu-ngan',
    title: 'Túi Đeo Chéo Nhiều Ngăn HUGZ Outdoor',
    subtitle: 'Passport, thẻ và tiền mặt an toàn',
    category: 'Túi đựng tài liệu',
    categorySlug: 'tai-lieu',
    price: 179000,
    originalPrice: 230000,
    rating: 5.0,
    reviewsCount: 890,
    soldCount: '3.2k đã bán',
    badge: 'PASSPORT & THẺ',
    badgeColor: 'secondary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByY0HQTtOSXLQ4BABxf8-etZ9BFiUmmPYO0Ljjj8hYrAL9c2CbVsGLiVR1T0dOm85ZDRUpr6E9n8T4PW7rVw9MsAMUjvO941rrlbPtrLACTK9cZScwoR1iefkgcHh140vbMZ4-MiBtbuVd-GqiH6RauUEK2LLDi3BiTXnRh3oGngL0nZ3rw3C1uP5GxeDa-eDrZ2vTd-4WdM4G41eAN_sMdBM52o_GSLIF_8_Bthbk2P_FtPtArHcp47-8ZEYJsyBfuc0',
    description: 'Thiết kế thông minh giữ hộ chiếu, vé máy bay, căn cước công dân và tiền mặt. Dây dù bện phong cách dã ngoại năng động, điều chỉnh độ dài linh hoạt.',
    features: [
      '4 ngăn phân tầng chuyên dụng cho giấy tờ tùy thân',
      'Dây đeo bện dù leo núi dẻo dai, chốt tăng giảm thép không gỉ',
      'Trọng lượng siêu nhẹ chỉ 95g, không gây mỏi cổ',
      'Lót vải nhung chống trầy xước màn hình điện thoại'
    ],
    dimensions: '21cm x 15cm x 3cm',
    material: 'Canvas chần bông kết hợp dây dù Outdoor',
    variants: ['Họa tiết Rừng Rậm Kem', 'Caro Nâu Vintage', 'Xanh Olive Dã Ngoại'],
    shopeeUrl: 'https://s.shopee.vn/9pbeimilNQ',
    tiktokUrl: 'https://www.tiktok.com/@hugzvietnam',
  },

  // 13. TÚI ĐỰNG TÀI LIỆU MINI (VÍ 2 KHÓA KÉO)
  {
    id: 'tui-dung-tai-lieu-mini',
    title: 'Túi Đựng Tài Liệu Mini HUGZ (Ví 2 Khóa Kéo)',
    subtitle: 'Dùng ngay lấy ngay, không lo thất lạc',
    category: 'Túi đựng tài liệu',
    categorySlug: 'tai-lieu',
    price: 125000,
    originalPrice: 160000,
    rating: 5.0,
    reviewsCount: 780,
    soldCount: '2.1k đã bán',
    badge: 'DÙNG NGAY LẤY NGAY',
    badgeColor: 'primary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGcWOo_xDbeOyrdi91bissyPfvo34DTn7pPXuiFO-SL5RRBdg0WbC5IXTYcu8pJNRZrjjgN9V7C9NED_mHPNbvnZLIWZ-KcfclppPqvGmrYJnkgSD7wh8qCrm7TBSuGj5OAouW3N0dKXLMU-ngBQEBhMiyNgqzVDQ-Ung51FNm7NrpzEFKPa5VIucdHurjlY_FsdcGMWpi2YuKs6vbXuB6_8wNXAwoLSJvYEaidl0t7K2MzBaTYPn3XySEeDOXnigK-6Y',
    description: '“Dùng ngay lấy ngay, không dễ mất”. Ví kéo 2 ngăn độc lập có quai móc cổ tay tiện lợi, bảo quản thẻ xe, hóa đơn, giấy tờ tùy thân, chìa khóa và son dưỡng luôn sẵn sàng.',
    features: [
      '2 ngăn kéo khóa riêng biệt tách rời tiền và thẻ',
      'Quai móc cổ tay chắc chắn, chống cướp giật',
      'Gọn nhẹ vừa vặn trong lòng bàn tay',
      'Màu sắc trang nhã, điểm xuyết thêu tay tỉ mỉ'
    ],
    dimensions: '19cm x 11cm x 2cm',
    material: 'Cotton chần vân kim cương',
    variants: ['Họa Tiết Đóa Hoa Nhỏ', 'Caro Xanh Mint', 'Vàng Nhạt HUGZ'],
    shopeeUrl: 'https://s.shopee.vn/9pbeimilNQ',
    tiktokUrl: 'https://www.tiktok.com/@hugzvietnam',
  },

  // 14. CHĂN SỮA HUGZ THU ĐÔNG
  {
    id: 'chan-sua-hugz',
    title: 'Chăn Sữa Lông Tuyết Trẻ Em & Gia Đình HUGZ',
    subtitle: 'Mềm mượt như mây, ấm áp như cái ôm của mẹ',
    category: 'Lưu trữ theo phân loại sản phẩm',
    categorySlug: 'phan-loai-san-pham',
    price: 299000,
    originalPrice: 389000,
    rating: 5.0,
    reviewsCount: 3100,
    soldCount: '7.4k đã bán',
    badge: 'HOT TREND MÙA ĐÔNG',
    badgeColor: 'primary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy-dhihuBqQ01UYv1jcruTXfOV6ao2npzNhy6RRyjhOACGn-8_MYA6srFMCki7uz9l2C7TYzFkWzKVm62iiOx0SDCdPPMQElkpQTFsRxI4PIi6GDEmyU054gRCm2pbb3DccT2hHBOaD4sUD3MDb_HDyqSYsCjnv6iZznREKrHlL0aHBy3fcWrWKEnJoc0i6_nBTCTSLqurLG_ZuLMZFXWokOg4rgLN95ci6unGj5oyjG1XrdJdrRrEjdhgoi-vVLdUY-g',
    description: 'Chiếc chăn biểu tượng cho tinh thần HUGZ: "A warm refuge for kids with love". Lớp lông tuyết mềm mại, ấm nhanh trong 3 giây, viền chỉ cam san hô đặc trưng chống xổ lông.',
    features: [
      'Chất liệu lông tuyết vi sợi 350GSM dày dặn, ấm áp giữ nhiệt bền bỉ',
      'Kháng tĩnh điện công nghệ nano, an toàn cho da trẻ sơ sinh',
      'Không rụng lông, không phai màu sau 100 lần giặt máy',
      'Tặng kèm túi rút đựng chăn phong cách vintage'
    ],
    dimensions: '110cm x 140cm (Cỡ Bé) | 150cm x 200cm (Cỡ Lớn)',
    material: 'Microfiber Lông Tuyết Siêu Mịn',
    variants: ['Cam San Hô HUGZ Signature', 'Kem Vani Ngọt Ngào', 'Xanh Bơ Pastel'],
    shopeeUrl: 'https://s.shopee.vn/9pbeimilNQ',
    tiktokUrl: 'https://www.tiktok.com/@hugzvietnam',
    isBestSeller: true,
  },

  // 15. KHĂN KHÔ ĐA NĂNG DAIZY DAILY 200 TỜ
  {
    id: 'khan-kho-da-nang-daizy-200',
    title: 'Khăn Khô Đa Năng HUGZ Daizy Daily (200 tờ)',
    subtitle: '100% Plant-based Rayon dịu nhẹ cho mẹ & bé',
    category: 'Lưu trữ thực phẩm & đồ dùng ăn uống',
    categorySlug: 'thuc-pham-an-uong',
    price: 79000,
    originalPrice: 105000,
    rating: 5.0,
    reviewsCount: 5600,
    soldCount: '12.3k đã bán',
    badge: 'TOP 1 MẸ & BÉ 12.3k',
    badgeColor: 'tertiary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1gXne5_HDK4E5WEe5auomAGpr8PJUxPf_FyinOzg2-bWEIBpU4Drb6dNly--SmlFe0tXLk3aM0sPmsp_qQojUYzmZGIDpTXrLcEGfdSIba48Rk6JqRMzNxF7OC4Z0e032XjsFA51HDbcyw_xwHrfZm9K-qT1cX37hcnEs4CJ8bUczCdIX0mB3LD2k_9IZalF-NlgmIIw8D8BAm8euQo3aJ5C6hjNvLZiHUMTTAXZXW0WmVZZXYfcWeC8CIbt0Il0OtpU',
    description: 'Chiết xuất từ sợi cellulose thực vật lành tính. Khăn khô đa năng tiệt trùng an toàn tuyệt đối cho làn da mỏng manh của trẻ sơ sinh, dùng vệ sinh thay tã, lau miệng hoặc thấm khô nước.',
    features: [
      '100% Sợi Rayon thực vật tự phân hủy sinh học trong đất',
      'Đạt chứng nhận an toàn da liễu không cồn, không hương liệu',
      'Độ dai vượt trội, nhúng nước ấm không bị mủn rách',
      'Quy cách 200 tờ tiết kiệm cho mẹ bỉm sữa'
    ],
    dimensions: 'Gói 200 tờ (180x180mm/tờ)',
    material: 'Plant-based Rayon Cellulose',
    variants: ['Gói 200 tờ Xanh Mint', 'Combo 2 Gói Tiết Kiệm (400 tờ)', 'Thùng 6 Gói Mẹ & Bé'],
    shopeeUrl: 'https://s.shopee.vn/9pbeimilNQ',
    tiktokUrl: 'https://www.tiktok.com/@hugzvietnam',
    isBestSeller: true,
  },

  // 16. BỘ TÚI ĐA NĂNG HUGZ
  {
    id: 'bo-tui-da-nang',
    title: 'Bộ Túi Đa Năng HUGZ Zipper 3 Kích Cỡ',
    subtitle: 'Set multi-size bảo quản phụ kiện',
    category: 'Lưu trữ vật dụng nhỏ',
    categorySlug: 'vat-dung-nho',
    price: 195000,
    originalPrice: 250000,
    rating: 5.0,
    reviewsCount: 1500,
    soldCount: '4.1k đã bán',
    badge: 'SET MULTI-SIZE',
    badgeColor: 'primary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEdvM62vmoavF_U-x5IczA_8WonMMFrRURG_mGmaSkvK5AsoyPz_h8dh_fBbCypXi3f3RaTMww9iaYUfD3oGA_2K-9vcC33cpm--OwEwPC0dp6_dtdFEeNDa6M62Q5zGVg8YnsygdyAeslSdRZp95U-7IL3cOTbCM7A4WCzJz997tzF7WgqdPHiH2NnaDjD0bleOwc7iUPvWjLNDFdc3zroTcDzl7f6xIOdb1ihyaTJe5_f3BZ9NvekG1sznVBYg-R8-w',
    description: 'Bộ túi zipper nhiều kích thước cho đồ vệ sinh cá nhân, kính mát, sạc dự phòng và đồ chơi nhỏ của bé. Chống thấm nước nhẹ, vệ sinh dễ dàng bằng khăn ẩm.',
    features: [
      'Bao gồm 3 kích cỡ túi: Lớn (28cm), Vừa (20cm), Nhỏ (14cm)',
      'Khóa kéo kim loại đồng cổ không rỉ, lướt êm ái',
      'Mặt trước in họa tiết độc quyền của HUGZ',
      'Có móc treo gắn vào balo hoặc treo trong phòng tắm'
    ],
    dimensions: 'Set 3 túi: 28x20cm, 20x15cm, 14x10cm',
    material: 'Vải Cotton pha Poly tráng màng kháng nước',
    variants: ['Họa tiết Sóng Nước & Cây Cỏ', 'Bộ Ba Sắc Màu Pastel', 'Kẻ Caro Cổ Điển'],
    shopeeUrl: 'https://s.shopee.vn/9pbeimilNQ',
    tiktokUrl: 'https://www.tiktok.com/@hugzvietnam',
  },
];

export const FAQS = [
  {
    q: 'Sản phẩm HUGZ có bảo hành và chính sách đổi trả như thế nào?',
    a: 'HUGZ hỗ trợ đổi trả miễn phí trong vòng 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất (đứt chỉ, hỏng khóa kéo, sai kích thước hoặc không đúng mô tả). Khách hàng chỉ cần nhắn tin qua Zalo CSKH hoặc Shopee Mall để được bưu tá đến tận nơi thu đổi.'
  },
  {
    q: 'Khăn lau mặt Daizy Daily có tái sử dụng được không?',
    a: 'Khăn lau mặt Daizy Daily được dệt từ 100% sợi bông Cotton tự nhiên với độ dai rất cao. Sau khi lau mặt xong, bạn có thể giặt lại với nước để lau bàn trang điểm, lau bồn rửa mặt hoặc lau giày dép trước khi bỏ đi.'
  },
  {
    q: 'Làm thế nào để nhận voucher giảm giá trên Shopee Mall và TikTok Shop?',
    a: 'Bạn bấm trực tiếp vào nút "Shopee" hoặc "TikTok" ở bất kỳ sản phẩm nào trên website để chuyển sang gian hàng chính hãng. Gian hàng Shopee Mall luôn có sẵn voucher giảm giá 10% - 33%, mã Freeship Xtra và quà tặng kèm.'
  },
  {
    q: 'Thời gian giao hàng mất bao lâu?',
    a: 'Đơn hàng đặt qua Shopee Mall và TikTok Shop được xử lý hỏa tốc: nội thành Hà Nội & TP. Hồ Chí Minh nhận hàng từ 2 - 4 giờ hoặc trong ngày. Các tỉnh thành khác nhận hàng từ 2 - 3 ngày làm việc.'
  }
];

export const LOOKBOOKS = [
  {
    id: 'lookbook-1',
    title: 'Chăn Sữa HUGZ - Cảm Hứng Thu Đông',
    subtitle: 'A warm refuge for kids with love',
    tag: 'COMFORT COLLECTION',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy-dhihuBqQ01UYv1jcruTXfOV6ao2npzNhy6RRyjhOACGn-8_MYA6srFMCki7uz9l2C7TYzFkWzKVm62iiOx0SDCdPPMQElkpQTFsRxI4PIi6GDEmyU054gRCm2pbb3DccT2hHBOaD4sUD3MDb_HDyqSYsCjnv6iZznREKrHlL0aHBy3fcWrWKEnJoc0i6_nBTCTSLqurLG_ZuLMZFXWokOg4rgLN95ci6unGj5oyjG1XrdJdrRrEjdhgoi-vVLdUY-g',
    story: 'Lấy cảm hứng từ những cái ôm của mẹ, chăn sữa HUGZ được thiết kế với chất liệu lông tuyết viền cam san hô ấm áp, mang lại sự êm ái xua tan mệt mỏi của cả ngày dài làm việc và học tập.',
    productIds: ['chan-sua-hugz', 'tui-trang-suc-sandwich']
  },
  {
    id: 'lookbook-2',
    title: 'Hành Lý Du Lịch Chuẩn Mực HUGZ',
    subtitle: 'Gọn gàng từng centimet trong vali của bạn',
    tag: 'TRAVEL SMART',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdqMkHhcCAIa3wYCd98S5T0i2qRPjXBucRbar_wp9ui3iHOYOtZCJ7qWY1tTzEapPHF573OKg4UjKxgOp56EIWwaXdXtDX37y2lB25ppON6A5efSDJbE0h3bCKgR5bqs9CWz7v71srBtfbn5tiyzCGCrwM514DlvaW5l3NxFNkm-rpd_BbR3_A0HrwzpEqdKdR3qnxav2wZU1pGZDYA1TC7zxnFszYkeCs1ynKSXh4ar_8-I5VAjuLOFR4luq5fnQ93OE',
    story: 'Không còn cảnh bới tung vali tìm chiếc tất hay chai mỹ phẩm. Bộ túi HUGZ phân loại rạch ròi quần áo, đồ bẩn, đồ lót và phụ kiện bằng vải Oxford chống nước bền bỉ.',
    productIds: ['bo-tui-du-lich-7-mon', 'tui-quan-ao-ban', 'tui-dung-tai-lieu-mini']
  },
  {
    id: 'lookbook-3',
    title: 'Daizy Daily - Thuần Khiết Tự Nhiên',
    subtitle: 'Chăm sóc làn da mẹ & bé chuẩn công nghệ tự nhiên',
    tag: 'ORGANIC DAILY CARE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5U04j2MZwo0VG9Yxqqh7NzPFnWTCzR9DnfSg4i8aStqGlKgcB6RQfPJlErCultwAbLP76sL-lGpYOVtNk1Id124QJO9SHbcN5igN1BYTMvFSBcHXPLhi-OAZnZQxRNfBk9sB81sRZ8WDGIJuHfn4Ju-ppSMQZ1hVrE3_Aixpmj5rI7Sx-W1RIf3KWuxzYRZ0GPs5wfXt0xrepau0FL6zCyXAZ6sSxcc2EbtNITtSHQDzd77YhzCMiEnTHYub5HVQm-Bw',
    story: 'Khởi nguồn từ mong muốn mang đến loại khăn tinh khiết nhất cho mẹ và bé sơ sinh, Daizy Daily chỉ sử dụng 100% bông tự nhiên và sợi Rayon thực vật có thể phân hủy, êm ái như làn da em bé.',
    productIds: ['khan-lau-mat-dung-1-lan-daizy-daily', 'khan-kho-da-nang-daizy-200']
  }
];
