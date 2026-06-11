export type GoodsStatus = "keep" | "to_sell" | "archived";

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
};
