"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface Props {
  rentalId: string;
  rentalTitle: string;
}

export default function RentalInquiryForm({ rentalId, rentalTitle }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isStudent, setIsStudent] = useState(false);
  const [proofType, setProofType] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    let proofPath = "";

    try {
      if (isStudent && !proofType) throw new Error("Choose the student proof you want to provide.");
      if (isStudent && proof && (proof.size > 5 * 1024 * 1024 || !proof.type.startsWith("image/") && proof.type !== "application/pdf")) {
        throw new Error("Student proof must be an image or PDF smaller than 5 MB.");
      }

      const { data: auth } = await supabase.auth.getUser();
      if (isStudent && proof && !auth.user) {
        throw new Error("Please sign in before uploading student proof.");
      }
      if (isStudent && proof && auth.user) {
        const safeName = proof.name.replace(/[^a-zA-Z0-9.]/g, "_");
        proofPath = `${auth.user.id}/${Date.now()}-${safeName}`;
        const { error } = await supabase.storage.from("student-proofs").upload(proofPath, proof);
        if (error) throw error;
      }

      const studentNote = isStudent
        ? `Student applicant: yes. Proof type: ${proofType}. Proof file: ${proofPath || "not uploaded"}.`
        : "Student applicant: no.";
      const { error } = await supabase.from("enquiries").insert({
        name,
        email,
        phone,
        message: `Rental enquiry for "${rentalTitle}" (listing ${rentalId}).\n\n${message}\n\n${studentNote}`,
        type: "rental_inquiry",
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      setStatus("Enquiry sent. The team will review it and get back to you.");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setProof(null);
      setProofType("");
      setIsStudent(false);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to send enquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-6">
      <h2 className="text-lg font-bold">Interested in this rental?</h2>
      <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="w-full rounded-xl bg-slate-800 p-3 text-sm" />
      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="w-full rounded-xl bg-slate-800 p-3 text-sm" />
      <input required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" className="w-full rounded-xl bg-slate-800 p-3 text-sm" />
      <textarea required minLength={10} maxLength={2000} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what you need..." rows={3} className="w-full rounded-xl bg-slate-800 p-3 text-sm" />
      <label className="flex items-center gap-3 text-sm font-semibold">
        <input type="checkbox" checked={isStudent} onChange={(e) => setIsStudent(e.target.checked)} className="h-5 w-5 accent-cyan-500" />
        I am applying as a student
      </label>
      {isStudent && (
        <div className="space-y-3 rounded-xl border border-slate-700 p-3">
          <select required value={proofType} onChange={(e) => setProofType(e.target.value)} className="w-full rounded-xl bg-slate-800 p-3 text-sm">
            <option value="">Choose proof</option>
            <option value="student_id">Student ID</option>
            <option value="enrollment_confirmation">Enrollment confirmation</option>
            <option value="registration_proof">Registration proof</option>
            <option value="admission_letter">Admission letter</option>
          </select>
          <input type="file" accept="image/*,.pdf" onChange={(e) => setProof(e.target.files?.[0] || null)} className="w-full text-xs text-slate-300" />
          <p className="text-xs text-slate-500">Your proof is private and only reviewed for this rental enquiry.</p>
        </div>
      )}
      <button disabled={loading} className="glass-icon glass-icon-primary btn-pop w-full rounded-xl px-4 py-3 text-sm font-bold text-slate-950">
        {loading ? "Sending..." : "Send rental enquiry"}
      </button>
      {status && <p className="text-xs text-slate-300">{status}</p>}
    </form>
  );
}
