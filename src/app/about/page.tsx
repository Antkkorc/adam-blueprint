import { BRAND } from "@/lib/brand";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-white font-bold text-3xl mb-6">About {BRAND.name}</h1>
      <div className="space-y-6 text-slate-400 text-sm leading-relaxed">
        <p>
          {BRAND.name} is a Botswana-based real estate platform dedicated to
          helping Batswana find, buy, sell, and rent properties across the
          country. From Gaborone to Maun, Francistown to Palapye, we cover the
          locations that matter to you.
        </p>
        <p>
          We understand the unique aspects of Botswana property — including
          Freehold, Tribal Land, and State Land tenures. Our listings include
          critical details like title deed status, plot size, borehole
          availability, and solar backup.
        </p>
        <p>
          Whether you are looking for a family home in Phakalane, an apartment
          in Block 6, or a commercial space in the CBD, {BRAND.name} connects
          you with verified listings and real agents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
        {[
          { label: "Properties Listed", value: "100+" },
          { label: "Cities Covered", value: "6" },
          { label: "Happy Clients", value: "200+" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center"
          >
            <p className="text-emerald-400 font-bold text-2xl">{stat.value}</p>
            <p className="text-slate-500 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}