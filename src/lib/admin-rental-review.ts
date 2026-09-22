import { createAdminClient } from "@/lib/supabase/admin";

export type RentalReviewAction = "approve" | "reject";

export async function reviewRentalSubmission(
  id: string,
  action: RentalReviewAction,
  reviewerId: string,
) {
  const supabase = createAdminClient();
  const { data: submission, error: fetchError } = await supabase
    .from("rental_submissions")
    .select("*")
    .eq("id", id)
    .eq("status", "pending")
    .maybeSingle();

  if (fetchError) throw fetchError;
  if (!submission) {
    throw new Error("This rental submission was not found or has already been reviewed.");
  }

  if (action === "reject") {
    const { error } = await supabase
      .from("rental_submissions")
      .update({ status: "rejected", reviewed_at: new Date().toISOString(), reviewed_by: reviewerId })
      .eq("id", id)
      .eq("status", "pending");
    if (error) throw error;
    return;
  }

  const { data: rental, error: insertError } = await supabase
    .from("tenant_rentals")
    .insert({
      title: submission.title,
      location: submission.location,
      price: submission.price,
      bedrooms: submission.bedrooms,
      bathrooms: submission.bathrooms,
      description: submission.description,
      info: submission.description,
      images: submission.images ?? [],
      image_labels: submission.image_labels ?? [],
      latitude: submission.latitude,
      longitude: submission.longitude,
      user_id: submission.user_id,
      tenant_name: submission.contact_name,
      contact_number: submission.contact_number,
      contact_name: submission.contact_name,
      contact_phone: submission.contact_number,
      student_friendly: submission.student_friendly ?? false,
      student_proof_required: submission.student_proof_type != null,
      status: "Available",
    })
    .select("id")
    .single();

  if (insertError) throw insertError;

  const { error: updateError } = await supabase
    .from("rental_submissions")
    .update({
      status: "approved",
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewerId,
    })
    .eq("id", id)
    .eq("status", "pending");

  if (updateError) {
    if (rental?.id) await supabase.from("tenant_rentals").delete().eq("id", rental.id);
    throw updateError;
  }
}
