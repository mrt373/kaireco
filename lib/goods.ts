import { Goods } from "@/types/goods";
import { supabase } from "./supabase";

type GoodsRow = {
  goods_id: string;
  title: string;
  text: string | null;
  price: number;
  status: Goods["status"];
  images: string[] | null;
  created_at: string;
  archived_at: string | null;
  archive_method: Goods["archive_method"] | null;
  archive_reason: string | null;
  goods_tags: { tags: { tag_name: string } | null }[];
};

const GOODS_SELECT = `
  goods_id, title, text, price, status, images, created_at, archived_at, archive_method, archive_reason,
  goods_tags ( tags ( tag_name ) )
`;

// Row型からGoods型に変換する関数
function mapRow(row: GoodsRow): Goods {
  return {
    goods_id: row.goods_id,
    title: row.title,
    text: row.text ?? "",
    price: Number(row.price),
    status: row.status,
    images: row.images ?? [],
    tags: row.goods_tags
      .map((gt) => gt.tags?.tag_name)
      .filter((t): t is string => !!t),
    created_at: row.created_at,
    archived_at: row.archived_at,
    archive_method: row.archive_method ?? undefined,
    archive_reason: row.archive_reason ?? undefined,
    id: row.goods_id,
  };
}

// ユーザーのアクティブな商品を取得する関数
export async function fetchActiveGoods(userId: string): Promise<Goods[]> {
  const { data, error } = await supabase
    .from("goods")
    .select(GOODS_SELECT)
    .eq("user_id", userId)
    .in("status", ["keep", "to_sell"])
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as GoodsRow[]).map(mapRow);
}

//idから情報を取得する関数
export async function fetchGoodsById(goodsId: string): Promise<Goods | null> {
  const { data, error } = await supabase
    .from("goods")
    .select(GOODS_SELECT)
    .eq("goods_id", goodsId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data as unknown as GoodsRow) : null;
}

// ユーザーのアーカイブ済み商品を取得する関数
export async function fetchArchivedGoods(userId: string): Promise<Goods[]> {
  const { data, error } = await supabase
    .from("goods")
    .select(GOODS_SELECT)
    .eq("user_id", userId)
    .not("archived_at", "is", null)
    .order("archived_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as GoodsRow[]).map(mapRow);
}
