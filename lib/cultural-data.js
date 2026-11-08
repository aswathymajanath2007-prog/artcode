// Demonstration catalogue. These are illustrative records, NOT verified live events.
// Replace/verify each record with a local organiser or authoritative source before publication.
export const demoListings = [
  ['Kalamkari & textile traditions','Crafts','Crafts','Textile and surface-design traditions; this session is a discovery prompt, not a scheduled workshop.'],
  ['Mappila song listening session','Music','Music','Explore the history and regional character of Mappila paattu through a guided listening experience.'],
  ['Kozhikode food heritage walk','Food','Food','A suggested exploration of the city’s food culture; individual venues and timings need confirmation.'],
  ['Beypore craft and boatbuilding stories','Crafts','Crafts','Discover the maritime craft heritage associated with Beypore; confirm access with local practitioners.'],
  ['Kalaripayattu introduction','Performance','Dance & performance','An introductory cultural demonstration concept. No performance date or venue is confirmed.'],
  ['Vadakara folk performance archive','Performance','Dance & performance','A research-led introduction to northern Kerala folk performance traditions.'],
  ['Regional history reading room','Heritage','History & heritage','A self-guided heritage research stop; confirm opening hours before visiting.'],
  ['Traditional Kerala mural art','Art','Art & architecture','Explore mural vocabulary, materials and conservation through an illustrative gallery visit.'],
  ['Handloom and weaving stories','Crafts','Crafts','Meet the techniques and people behind regional weaving; contributor-led visit requires confirmation.'],
  ['Kozhikode waterfront landscape','Nature','Nature','A relaxed landscape stop to understand the relationship between coast, trade and city life.'],
  ['Thirayattam cultural introduction','Performance','Dance & performance','Learn about a ritual performance tradition through documented material and local experts.'],
  ['Local architecture photo walk','Heritage','Art & architecture','Observe streetscapes and architectural details; respect private property and local guidance.'],
  ['Spice trade and port-city stories','History','History & heritage','A thematic walk exploring Kozhikode’s historic role in Indian Ocean exchange.'],
  ['Community craft demonstration','Workshop','Workshops','A placeholder for a curator-approved hands-on session with a local craft practitioner.'],
  ['Traditional recipes and food memory','Food','Food','A conversation-based cultural experience about recipes, memory and regional foodways.'],
].map((x,i)=>({id:`demo-${i+1}`,title:x[0],category:x[1],interest:x[2],description:x[3],location:'Kozhikode, Kerala',district:'Kozhikode',state:'Kerala',date:null,start_time:null,end_time:null,venue:'To be confirmed',cultural_significance:x[3],source_url:'https://www.keralatourism.org/',organiser:'Demo catalogue',status:'sample',verified:false,kind:'Illustrative sample'}));

export const ILLUSTRATIVE_DEMO_KIND = 'Illustrative Demo Sample – Not Verified';

const districtExperienceTypes = [
  {
    slug: 'arts-crafts',
    category: 'Crafts',
    interest: 'Crafts',
    title: (district, state) => `Traditional arts and crafts of ${district}, ${state}`,
    description: (district, state) => `An illustrative prompt to research traditional arts and crafts associated with ${district}, ${state}. Confirm local practices with community sources; no specific workshop or venue is claimed.`,
  },
  {
    slug: 'folk-music',
    category: 'Music',
    interest: 'Music',
    title: (district, state) => `Folk music traditions of ${district}, ${state}`,
    description: (district, state) => `An illustrative starting point for exploring folk music connected with ${district}, ${state}. Consult local artists and reliable sources; no performance or event is scheduled.`,
  },
  {
    slug: 'dance-performance',
    category: 'Dance & performance',
    interest: 'Dance & performance',
    title: (district, state) => `Dance and performance traditions of ${district}, ${state}`,
    description: (district, state) => `A research prompt about dance and performance in ${district}, ${state}. Verify traditions and opportunities with local cultural organisations; no performance or venue is claimed.`,
  },
  {
    slug: 'traditional-food',
    category: 'Food',
    interest: 'Food',
    title: (district, state) => `Traditional foodways of ${district}, ${state}`,
    description: (district, state) => `An illustrative prompt for learning about foodways in ${district}, ${state}. Confirm regional context and current options with local sources; no restaurant or tasting is advertised.`,
  },
  {
    slug: 'heritage-history',
    category: 'History & heritage',
    interest: 'History & heritage',
    title: (district, state) => `Local history and heritage of ${district}, ${state}`,
    description: (district, state) => `A starting point for researching documented history and heritage in ${district}, ${state}. Check details with local archives or trusted sources; no specific site or opening hours are claimed.`,
  },
  {
    slug: 'community-stories',
    category: 'Art & architecture',
    interest: 'Art & architecture',
    title: (district, state) => `Community cultural stories of ${district}, ${state}`,
    description: (district, state) => `An illustrative prompt to learn about community stories and cultural life in ${district}, ${state}. Seek local perspectives and verify context; no organised experience or address is claimed.`,
  },
];

function normalizeLocationPart(value) {
  return String(value || '').trim().toLocaleLowerCase().replace(/\s+/g, ' ');
}

function listingMatchesDestination(listing, state, district) {
  const listingState = normalizeLocationPart(listing.state);
  const listingDistrict = normalizeLocationPart(listing.district);
  if (listingState && listingState !== normalizeLocationPart(state)) return false;
  if (listingDistrict && listingDistrict !== normalizeLocationPart(district)) return false;
  if (listingState && listingDistrict) return true;

  const locationParts = String(listing.location || '')
    .split(/[,;|·]/)
    .map(normalizeLocationPart);
  return (listingState || locationParts.includes(normalizeLocationPart(state)))
    && (listingDistrict || locationParts.includes(normalizeLocationPart(district)));
}

function locationSlug(value) {
  return normalizeLocationPart(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function generateDistrictDemoListings(state, district, existingListings = []) {
  if (!state || !district) return [];

  const destinationListings = existingListings.filter((listing) => listingMatchesDestination(listing, state, district));
  const existingDemoCount = destinationListings.filter((listing) => listing.status === 'sample').length;
  if (existingDemoCount >= districtExperienceTypes.length) return [];

  const existingTitles = new Set(destinationListings.map((listing) => normalizeLocationPart(listing.title)));
  const existingIds = new Set(destinationListings.map((listing) => listing.id));
  const stateSlug = locationSlug(state);
  const districtSlug = locationSlug(district);

  return districtExperienceTypes
    .map((experience, index) => {
      const title = experience.title(district, state);
      return {
        id: `demo-${index + 1}-${stateSlug}-${districtSlug}-${experience.slug}`,
        title,
        category: experience.category,
        interest: experience.interest,
        description: experience.description(district, state),
        location: `${district}, ${state}`,
        district,
        state,
        date: null,
        start_time: null,
        end_time: null,
        venue: null,
        cultural_significance: experience.description(district, state),
        source_url: null,
        organiser: null,
        status: 'sample',
        verified: false,
        kind: ILLUSTRATIVE_DEMO_KIND,
      };
    })
    .filter((listing) => !existingIds.has(listing.id) && !existingTitles.has(normalizeLocationPart(listing.title)));
}
