// Keep public reads explicit so new private columns are not exposed accidentally.
export const PUBLIC_PROPERTY_COLUMNS =
  "id,created_at,title,description,overview,type,category,intent,status,verified,featured,price,price_unit,location,city,suburb,plot_number,tenure,title_deed,beds,baths,parking,plot_size,building_sqm,land_sqm,year_built,images,image_labels,sketch_plan,latitude,longitude,inside_features,outside_features,agent,agent_phone,amenities,house_plan_url" as const;

export const PUBLIC_RENTAL_COLUMNS =
  "id,created_at,title,description,location,price,bedrooms,bathrooms,tenant_name,contact_number,contact_name,contact_phone,info,images,image_labels,status,student_friendly,latitude,longitude" as const;
