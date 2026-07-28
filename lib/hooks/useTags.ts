import { useEffect, useState } from "react";
import { supabase } from "../supabase";

type Tag = {
  tag_name: string;
  tag_id: string;
};

export default function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const fetchTags = async () => {
    const { data, error } = await supabase
      .from("tags")
      .select("tag_name, tag_id");
    if (error) return;
    setTags(
      data.map((item) => ({ tag_name: item.tag_name, tag_id: item.tag_id })),
    );
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };
  const resetSelectedTags = () => setSelectedTags([]);

  return {
    tags,
    selectedTags,
    toggleTag,
    resetSelectedTags,
    setSelectedTags,
    fetchTags,
  };
}
