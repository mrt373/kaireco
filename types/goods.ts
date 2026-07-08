export type GoodsStatus = "keep" | "to_sell" | "archived";

export type ArchiveMethod = "donated" | "sold" | "recycled" | "other";

export type Goods = {
  goods_id: string;
  title: string;
  text: string;
  price: number;
  status: GoodsStatus;
  images: string[];
  tags: string[];
  created_at: string;
  archived_at: string | null;
  archive_method?: ArchiveMethod;
  archive_reason?: string;
  id: string;
};
