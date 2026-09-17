"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface Props {
  propertyId: number;
  initialSaved?: boolean;
  size?: "sm" | "lg";
}

export default function SavePropertyButton({
  propertyId,
  initialSaved = false,
  size = "sm",
}: Props) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);

  async function toggleSaved() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    setSaving(true);

    try {
      if (saved) {
        await supabase
          .from("saved_properties")
          .delete()
          .eq("user_id", session.user.id)
          .eq("property_id", propertyId);
        setSaved(false);
      } else {
        await supabase.from("saved_properties").upsert(
          { user_id: session.user.id, property_id: propertyId },
          { onConflict: "user_id,property_id" }
        );
        setSaved(true);
      }
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  if (size === "lg") {
    return (
      <button
        type="button"
        onClick={toggleSaved}
        disabled={saving}
        className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-xs font-bold transition-colors ${
          saved
            ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
            : "bg-slate-950 border-slate-800 text-slate-300 hover:border-cyan-400 hover:text-cyan-300"
        }`}
      >
        <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
        {saved ? "Saved" : "Save Property"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleSaved}
      disabled={saving}
      className={`absolute top-3 right-3 p-2 rounded-full border backdrop-blur-md transition-all ${
        saved
          ? "bg-cyan-400 text-slate-950 border-cyan-300"
          : "bg-slate-950/70 text-white border-white/20 hover:border-cyan-300 hover:text-cyan-300"
      }`}
      aria-label={saved ? "Remove from saved properties" : "Save property"}
    >
      <Heart className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
    </button>
  );
}