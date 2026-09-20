import { MapPin, MessageCircle } from "lucide-react";
import Image from "next/image";

export interface TenantRental {
  id: string;
  created_at?: string;
  title: string;
  description: string;
  location: string;
  price: number;
  contact_name: string;
  contact_phone: string;
  images: string[];
  user_id?: string;
}

export default function TenantRentalCard({ rental }: { rental: TenantRental }) {
  const image =
    rental.images?.[0] ||
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";

  const price = new Intl.NumberFormat("en-BW", {
    style: "currency",
    currency: "BWP",
    maximumFractionDigits: 0,
  }).format(Number(rental.price || 0));

  const phone = (rental.contact_phone || "").replace(/\D/g, "");
  const message = encodeURIComponent(
    `Hello, I am interested in your rental listing "${rental.title}" in ${rental.location}. Is it still available?`
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition-all group">
      <div className="relative h-52">
        <Image
          src={image}
          alt={rental.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-extrabold uppercase">
          Community Listing
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-white font-bold text-sm line-clamp-1">
            {rental.title}
          </h3>
          <p className="text-slate-400 text-xs flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-cyan-400" />
            {rental.location}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-cyan-400 font-extrabold text-sm">{price}</p>
            <p className="text-[10px] text-slate-500">per month</p>
          </div>
          <p className="text-[10px] text-slate-500">
            Listed by {rental.contact_name || "Owner"}
          </p>
        </div>

        <p className="text-slate-400 text-xs line-clamp-2">
          {rental.description}
        </p>

        {phone && (
          <a
            href={`https://wa.me/${phone}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Contact via WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}