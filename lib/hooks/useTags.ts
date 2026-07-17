import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function useTags() {
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase.from("tags").select("tag_name");
      if (error) return;
      setTags(data.map((item) => item.tag_name));
    };
    fetchTags();
  }, []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };
  const resetSelectedTags = () => setSelectedTags([]);

  return { tags, selectedTags, toggleTag, resetSelectedTags, setSelectedTags };
}
