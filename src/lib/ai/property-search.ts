export interface PropertySearch {
  href: string;
  maxPrice?: number;
  type?: string;
}

export function extractPropertySearch(message: string): PropertySearch | null {
  const normalized = message.toLocaleLowerCase();
  const amountMatch = normalized.match(/(?:under|below|less than|max(?:imum)?(?: price)?(?: of)?)\s*(?:bwp|p)?\s*([\d,]+)\s*(k)?/i);
  const rawAmount = amountMatch?.[1]?.replace(/,/g, "");
  const maxPrice = rawAmount ? Number(rawAmount) * (amountMatch?.[2] ? 1000 : 1) : undefined;
  const type =
    /farm|ranch|agricultural|crop|cattle/.test(normalized) ? "Farm" :
      /plot|land|erf/.test(normalized) ? "Land" :
        /apartment|flat/.test(normalized) ? "Apartment" :
          /townhouse/.test(normalized) ? "Townhouse" :
            /office/.test(normalized) ? "Office" :
              /warehouse/.test(normalized) ? "Warehouse" :
                /commercial/.test(normalized) ? "Commercial" :
                  /house|home/.test(normalized) ? "House" : undefined;
  const hasSearchIntent = Boolean(maxPrice || type || /\b(properties|property|houses|homes|listings|plots|farms|land)\b/.test(normalized));
  if (!hasSearchIntent) return null;

  const params = new URLSearchParams();
  if (maxPrice && Number.isFinite(maxPrice)) params.set("maxPrice", String(maxPrice));
  if (type) params.set("type", type);

  return {
    href: `/buy${params.toString() ? `?${params.toString()}` : ""}`,
    maxPrice,
    type,
  };
}
