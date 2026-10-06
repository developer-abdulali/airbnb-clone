import { fetchDemoProperties, type DemoProperty } from "./demo-properties";
import { prisma } from "./prisma";

const demoListingDescription = (city: string) => {
  return `A curated demo stay in ${city} with a modern setup ideal for short trips and long weekends.`;
};

const demoHostEmail = (property: DemoProperty) => {
  return `demo-host-${property.id}@stayscape.com`;
};

const ensureDemoHostUser = async (property: DemoProperty) => {
  return prisma.user.upsert({
    where: { email: demoHostEmail(property) },
    create: {
      email: demoHostEmail(property),
      name: property.hostName,
    },
    update: { name: property.hostName },
    select: { id: true },
  });
};

const upsertDemoListingRow = async (hostId: string, property: DemoProperty) => {
  const roomCount = Math.max(1, Math.round(property.maxGuests / 2));
  const bathroomCount = Math.max(1, Math.round(property.maxGuests / 3));

  await prisma.listing.upsert({
    where: { id: property.id },
    create: {
      id: property.id,
      title: property.title,
      description: demoListingDescription(property.city),
      imageSrc: property.image,
      imageGallery: [property.image],
      category: "Demo Stay",
      roomCount,
      bathroomCount,
      guestCount: property.maxGuests,
      locationValue: property.city,
      pricePerNight: property.pricePerNight,
      userId: hostId,
    },

    update: {
      title: property.title,
      description: demoListingDescription(property.city),
      imageSrc: property.image,
      imageGallery: [property.image],
      category: "Demo Stay",
      roomCount,
      bathroomCount,
      guestCount: property.maxGuests,
      locationValue: property.city,
      pricePerNight: property.pricePerNight,
      userId: hostId,
    },
  });
};

export const syncDemoListingsById = async (listingId: string) => {
  const demoProperties = await fetchDemoProperties();
  const property = demoProperties.find((p) => p.id === listingId);

  if (!property) {
    throw new Error(`Demo property with ID ${listingId} not found.`);
  }

  const host = await ensureDemoHostUser(property);
  await upsertDemoListingRow(host.id, property);
};

export const syncDemoListingsToDatabase = async () => {
  const demoProperties = await fetchDemoProperties();

  for (const property of demoProperties) {
    const host = await ensureDemoHostUser(property);
    await upsertDemoListingRow(host.id, property);
  }
};
