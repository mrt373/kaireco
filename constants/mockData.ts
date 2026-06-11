import { Goods } from "@/types/goods";

export const MOCK_GOODS: Goods[] = [
  {
    goods_id: "1",
    title: "Sony WH-1000XM5",
    text: "最高のノイズキャンセリングヘッドフォン",
    price: 349,
    status: "keep",
    images: ["https://picsum.photos/seed/headphone/400/300"],
    tags: ["Electronics"],
    created_at: "2024-01-15",
    archived_at: null,
  },
  {
    goods_id: "2",
    title: "Leica M11 Body",
    text: "フィルムライクな描写が好きで購入",
    price: 8995,
    status: "to_sell",
    images: ["https://picsum.photos/seed/camera/400/300"],
    tags: ["Electronics"],
    created_at: "2024-02-20",
    archived_at: null,
  },
  {
    goods_id: "3",
    title: "Nike Air Max Ltd.",
    text: "普段使いのスニーカー",
    price: 210,
    status: "keep",
    images: ["https://picsum.photos/seed/shoes/400/300"],
    tags: ["Apparel"],
    created_at: "2024-03-10",
    archived_at: null,
  },
];
