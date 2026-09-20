import { createAdminClient } from "@/lib/supabase/admin";

export async function reviewPropertySubmission(id: string, action: "approve" | "reject", adminId: string, reason?: string) {
  const db = createAdminClient();
  const { data: submission, error } = await db.from("property_submissions").select("*").eq("id", id).single();
  if (error || !submission) throw new Error("Submission not found.");
  if (submission.status !== "pending") throw new Error("Submission has already been reviewed.");
  let propertyId: string | null = null;
  if (action === "approve") {
    const { data, error: insertError } = await db.from("properties").insert({
      title: submission.title || `${submission.intent === "rent" ? "Rental" : "Property"} submission`,
      description: submission.description, overview: submission.description,
      location: submission.location || "Botswana", city: submission.location || "Botswana",
      latitude: submission.latitude, longitude: submission.longitude,
      price: submission.price || 0, price_unit: submission.intent === "rent" ? "month" : "total",
      intent: submission.intent, type: "House", category: "house",
      beds: 0, baths: 0, parking: 0, plot_size: 0,
      amenities: [], image_labels: [], sketch_plan: [], status: "Available",
      images: submission.images || [], house_plan_url: submission.house_plan_url,
      agent: submission.name, agent_phone: submission.phone, verified: false,
    }).select("id").single();
    if (insertError) throw new Error(insertError.message);
    propertyId = String(data.id);
  }
  const { error: updateError } = await db.from("property_submissions").update({
    status: action === "approve" ? "approved" : "rejected",
    reviewed_at: new Date().toISOString(), reviewed_by: adminId,
    rejection_reason: action === "reject" ? (reason || "Not approved at this time.") : null,
    property_id: propertyId, updated_at: new Date().toISOString(),
  }).eq("id", id);
  if (updateError) throw new Error(updateError.message);
  if (submission.user_id) {
    await db.from("notifications").insert({
      user_id: submission.user_id, type: "property_submission",
      title: action === "approve" ? "Property request approved" : "Property request rejected",
      message: action === "approve" ? "Your property request is now published." : (reason || "Your property request was not approved."),
    });
  }
}
