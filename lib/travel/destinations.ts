/**
 * The destination library: what a travel brief knows about a place before the
 * agent types anything. Each entry gives the prompt builder real, visual
 * material (landmarks, scenery, signature experiences and food) so a teaser
 * for Santorini looks like Santorini and not a generic beach.
 *
 * Keep entries factual and visual. `bestMonths` is display-only guidance for
 * the agent; it never goes into a prompt.
 */

export const REGIONS = [
  "Europe",
  "Middle East",
  "Asia",
  "Africa",
  "Americas",
  "Oceania",
] as const

export type Region = (typeof REGIONS)[number]

export interface Destination {
  slug: string
  name: string
  country: string
  region: Region
  /** Visual anchors, most recognisable first. */
  landmarks: readonly string[]
  /** One line of light, colour and texture for the image models. */
  scenery: string
  /** Signature things travellers do there. */
  experiences: readonly string[]
  /** Signature dishes or drinks for food content. */
  cuisine: readonly string[]
  /** Broad best-time guidance shown to the agent. */
  bestMonths: string
}

export const DESTINATIONS: readonly Destination[] = [
  /* ── Europe ─────────────────────────────────────────────────────────── */
  {
    slug: "paris",
    name: "Paris",
    country: "France",
    region: "Europe",
    landmarks: ["the Eiffel Tower", "the Louvre pyramid", "the Seine bridges"],
    scenery:
      "cream Haussmann facades, wrought-iron balconies, café terraces and soft golden light along the Seine",
    experiences: [
      "a sunset Seine cruise",
      "café breakfast on a terrace",
      "strolling Montmartre",
    ],
    cuisine: ["fresh croissants", "macarons", "a cheese and wine board"],
    bestMonths: "Apr–Jun, Sep–Oct",
  },
  {
    slug: "santorini",
    name: "Santorini",
    country: "Greece",
    region: "Europe",
    landmarks: [
      "Oia's blue-domed churches",
      "the caldera cliffs",
      "whitewashed cave houses",
    ],
    scenery:
      "whitewashed cliffside villages, cobalt domes, infinity pools over a deep blue Aegean caldera at sunset",
    experiences: [
      "watching the Oia sunset",
      "a catamaran caldera cruise",
      "a cliffside infinity pool",
    ],
    cuisine: [
      "grilled octopus",
      "a Greek salad with feta",
      "local Assyrtiko wine",
    ],
    bestMonths: "May–Oct",
  },
  {
    slug: "rome",
    name: "Rome",
    country: "Italy",
    region: "Europe",
    landmarks: ["the Colosseum", "the Trevi Fountain", "St Peter's Basilica"],
    scenery:
      "warm ochre and terracotta streets, ancient marble ruins, cobbled piazzas and umbrella pines",
    experiences: [
      "touring the Colosseum",
      "tossing a coin in the Trevi Fountain",
      "an evening in Trastevere",
    ],
    cuisine: ["cacio e pepe", "Roman-style pizza", "gelato"],
    bestMonths: "Apr–Jun, Sep–Oct",
  },
  {
    slug: "amalfi-coast",
    name: "Amalfi Coast",
    country: "Italy",
    region: "Europe",
    landmarks: [
      "Positano's pastel cliffside houses",
      "the winding coastal road",
      "lemon terraces",
    ],
    scenery:
      "pastel villages stacked on steep cliffs, turquoise Tyrrhenian water, striped beach umbrellas and lemon groves",
    experiences: [
      "a private boat day along the coast",
      "driving the coastal road in a convertible",
      "a terrace dinner over the sea",
    ],
    cuisine: ["fresh seafood pasta", "limoncello", "lemon granita"],
    bestMonths: "May–Jun, Sep",
  },
  {
    slug: "barcelona",
    name: "Barcelona",
    country: "Spain",
    region: "Europe",
    landmarks: [
      "the Sagrada Família",
      "Park Güell's mosaic terrace",
      "Barceloneta beach",
    ],
    scenery:
      "Gaudí's organic architecture, colourful mosaics, palm-lined boulevards and a Mediterranean beachfront",
    experiences: [
      "touring Gaudí landmarks",
      "tapas hopping in the Gothic Quarter",
      "sunset at Bunkers del Carmel",
    ],
    cuisine: ["seafood paella", "tapas", "churros with chocolate"],
    bestMonths: "May–Jun, Sep–Oct",
  },
  {
    slug: "london",
    name: "London",
    country: "United Kingdom",
    region: "Europe",
    landmarks: ["Tower Bridge", "Big Ben and Westminster", "the London Eye"],
    scenery:
      "Thames riverside skyline, red double-decker buses, Victorian brick and glass towers under soft grey-blue light",
    experiences: [
      "a ride on the London Eye",
      "afternoon tea",
      "exploring Borough Market",
    ],
    cuisine: ["afternoon tea with scones", "fish and chips", "a Sunday roast"],
    bestMonths: "May–Sep",
  },
  {
    slug: "swiss-alps",
    name: "Swiss Alps",
    country: "Switzerland",
    region: "Europe",
    landmarks: [
      "the Matterhorn",
      "the Jungfrau region",
      "Lauterbrunnen valley waterfalls",
    ],
    scenery:
      "snow-capped peaks, emerald alpine meadows, wooden chalets, glacier lakes and red mountain trains",
    experiences: [
      "a scenic panoramic train ride",
      "skiing fresh powder",
      "hiking alpine meadows",
    ],
    cuisine: ["cheese fondue", "raclette", "Swiss chocolate"],
    bestMonths: "Dec–Mar for snow, Jun–Sep for hiking",
  },
  {
    slug: "iceland",
    name: "Iceland",
    country: "Iceland",
    region: "Europe",
    landmarks: [
      "Kirkjufell mountain",
      "Skógafoss waterfall",
      "black sand beaches",
    ],
    scenery:
      "volcanic black sand, moss-covered lava fields, thundering waterfalls, glaciers and the northern lights",
    experiences: [
      "chasing the northern lights",
      "soaking in a geothermal lagoon",
      "exploring an ice cave",
    ],
    cuisine: ["Icelandic lamb soup", "skyr", "fresh Arctic char"],
    bestMonths: "Jun–Aug, Sep–Mar for aurora",
  },
  {
    slug: "prague",
    name: "Prague",
    country: "Czech Republic",
    region: "Europe",
    landmarks: [
      "Charles Bridge",
      "Prague Castle",
      "the Old Town astronomical clock",
    ],
    scenery:
      "red-tiled rooftops, Gothic spires, baroque facades and misty mornings over the Vltava river",
    experiences: [
      "a sunrise walk across Charles Bridge",
      "a river cruise",
      "exploring Old Town Square",
    ],
    cuisine: ["trdelník pastry", "goulash with dumplings", "Czech pilsner"],
    bestMonths: "Apr–Jun, Sep–Oct",
  },
  {
    slug: "lisbon",
    name: "Lisbon",
    country: "Portugal",
    region: "Europe",
    landmarks: ["yellow Tram 28", "Belém Tower", "the Alfama viewpoints"],
    scenery:
      "hilly streets of pastel houses, blue azulejo tiles, yellow trams and golden light over the Tagus river",
    experiences: [
      "riding the historic tram",
      "sunset at a miradouro viewpoint",
      "an evening of fado music",
    ],
    cuisine: ["pastéis de nata", "grilled sardines", "port wine"],
    bestMonths: "Mar–Jun, Sep–Oct",
  },
  {
    slug: "istanbul",
    name: "Istanbul",
    country: "Türkiye",
    region: "Europe",
    landmarks: ["Hagia Sophia", "the Blue Mosque", "the Bosphorus"],
    scenery:
      "domes and minarets on the skyline, ferries crossing the Bosphorus, bazaar lanterns and spice stalls",
    experiences: [
      "a Bosphorus cruise",
      "shopping the Grand Bazaar",
      "a traditional hammam",
    ],
    cuisine: [
      "Turkish breakfast spread",
      "baklava",
      "Turkish tea in tulip glasses",
    ],
    bestMonths: "Apr–May, Sep–Nov",
  },
  {
    slug: "cappadocia",
    name: "Cappadocia",
    country: "Türkiye",
    region: "Europe",
    landmarks: [
      "fairy chimney rock formations",
      "Göreme valley",
      "cave hotels",
    ],
    scenery:
      "dozens of hot air balloons rising at dawn over soft pink and honey-coloured rock valleys",
    experiences: [
      "a sunrise hot air balloon flight",
      "staying in a cave hotel",
      "hiking the Rose Valley",
    ],
    cuisine: ["testi kebab cooked in a clay pot", "gözleme", "local wine"],
    bestMonths: "Apr–Jun, Sep–Oct",
  },

  /* ── Middle East ────────────────────────────────────────────────────── */
  {
    slug: "dubai",
    name: "Dubai",
    country: "United Arab Emirates",
    region: "Middle East",
    landmarks: ["the Burj Khalifa", "the Burj Al Arab", "Palm Jumeirah"],
    scenery:
      "glittering glass skyline, golden desert dunes, turquoise Gulf water and luxury resorts",
    experiences: [
      "a desert safari with dune bashing",
      "the view from the Burj Khalifa",
      "a dhow dinner cruise",
    ],
    cuisine: ["Arabic mezze", "shawarma", "dates with Arabic coffee"],
    bestMonths: "Nov–Mar",
  },
  {
    slug: "abu-dhabi",
    name: "Abu Dhabi",
    country: "United Arab Emirates",
    region: "Middle East",
    landmarks: [
      "the Sheikh Zayed Grand Mosque",
      "the Louvre Abu Dhabi dome",
      "Yas Island",
    ],
    scenery:
      "white marble domes, reflecting pools, mangrove lagoons and calm turquoise water",
    experiences: [
      "visiting the Grand Mosque at golden hour",
      "kayaking the mangroves",
      "a theme park day on Yas Island",
    ],
    cuisine: ["Emirati machboos", "luqaimat dumplings", "fresh dates"],
    bestMonths: "Nov–Mar",
  },
  {
    slug: "petra",
    name: "Petra",
    country: "Jordan",
    region: "Middle East",
    landmarks: ["the Treasury (Al-Khazneh)", "the Siq canyon", "the Monastery"],
    scenery:
      "rose-red sandstone facades carved into cliffs, narrow canyon walls and warm desert light",
    experiences: [
      "walking the Siq to the Treasury",
      "Petra by Night candlelight",
      "a night in a Wadi Rum desert camp",
    ],
    cuisine: ["mansaf", "falafel and hummus", "sweet mint tea"],
    bestMonths: "Mar–May, Sep–Nov",
  },

  /* ── Asia ───────────────────────────────────────────────────────────── */
  {
    slug: "bali",
    name: "Bali",
    country: "Indonesia",
    region: "Asia",
    landmarks: [
      "Tegallalang rice terraces",
      "Pura Ulun Danu Bratan temple",
      "the Ubud jungle",
    ],
    scenery:
      "emerald rice terraces, jungle villas with private pools, stone temples and soft tropical light",
    experiences: [
      "a floating breakfast in a private pool villa",
      "a jungle swing over rice fields",
      "a Balinese spa ritual",
    ],
    cuisine: ["nasi goreng", "a smoothie bowl", "satay skewers"],
    bestMonths: "Apr–Oct",
  },
  {
    slug: "maldives",
    name: "Maldives",
    country: "Maldives",
    region: "Asia",
    landmarks: ["overwater villas", "white sandbanks", "the house reef"],
    scenery:
      "overwater villas on stilts above crystal-clear turquoise lagoons, white sand and endless horizon",
    experiences: [
      "snorkelling with manta rays",
      "a sandbank picnic",
      "a sunset dolphin cruise",
    ],
    cuisine: [
      "a candlelit beach dinner",
      "fresh reef fish curry",
      "tropical fruit platter",
    ],
    bestMonths: "Nov–Apr",
  },
  {
    slug: "phuket",
    name: "Phuket",
    country: "Thailand",
    region: "Asia",
    landmarks: [
      "Phang Nga Bay limestone karsts",
      "the Big Buddha",
      "Patong beach",
    ],
    scenery:
      "towering limestone karsts in emerald water, longtail boats, palm-fringed beaches and warm sunsets",
    experiences: [
      "island hopping to Phi Phi",
      "a longtail boat ride",
      "a Thai cooking class",
    ],
    cuisine: ["pad thai", "green curry", "mango sticky rice"],
    bestMonths: "Nov–Apr",
  },
  {
    slug: "tokyo",
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    landmarks: ["Shibuya Crossing", "Tokyo Tower", "Senso-ji temple"],
    scenery:
      "neon-lit streets at night, glowing signs, rain reflections, quiet temple gardens and cherry blossoms",
    experiences: [
      "crossing Shibuya at night",
      "a sushi counter dinner",
      "cherry blossom viewing",
    ],
    cuisine: ["omakase sushi", "ramen", "matcha desserts"],
    bestMonths: "Mar–May, Oct–Nov",
  },
  {
    slug: "kyoto",
    name: "Kyoto",
    country: "Japan",
    region: "Asia",
    landmarks: [
      "Fushimi Inari's vermilion torii gates",
      "the Arashiyama bamboo grove",
      "Kinkaku-ji golden pavilion",
    ],
    scenery:
      "vermilion shrine gates, wooden machiya streets, zen gardens, maple leaves and lantern light",
    experiences: [
      "walking the torii gate tunnels",
      "a tea ceremony",
      "staying in a ryokan with an onsen",
    ],
    cuisine: ["kaiseki dinner", "matcha tea", "wagashi sweets"],
    bestMonths: "Mar–May, Oct–Nov",
  },
  {
    slug: "singapore",
    name: "Singapore",
    country: "Singapore",
    region: "Asia",
    landmarks: [
      "Marina Bay Sands",
      "the Gardens by the Bay Supertrees",
      "the Merlion",
    ],
    scenery:
      "futuristic skyline, glowing Supertree groves, lush vertical gardens and a sparkling bay at night",
    experiences: [
      "the Supertree light show",
      "a rooftop infinity pool",
      "hawker centre food tour",
    ],
    cuisine: ["chilli crab", "Hainanese chicken rice", "kaya toast"],
    bestMonths: "Feb–Apr",
  },
  {
    slug: "seoul",
    name: "Seoul",
    country: "South Korea",
    region: "Asia",
    landmarks: [
      "Gyeongbokgung Palace",
      "N Seoul Tower",
      "Bukchon hanok village",
    ],
    scenery:
      "royal palaces with painted eaves, hanok rooftops, neon shopping streets and mountains around the city",
    experiences: [
      "wearing hanbok at the palace",
      "night markets",
      "a Korean barbecue dinner",
    ],
    cuisine: ["Korean barbecue", "bibimbap", "street-food tteokbokki"],
    bestMonths: "Apr–Jun, Sep–Nov",
  },
  {
    slug: "ha-long-bay",
    name: "Ha Long Bay",
    country: "Vietnam",
    region: "Asia",
    landmarks: [
      "thousands of limestone islets",
      "floating fishing villages",
      "hidden caves",
    ],
    scenery:
      "jade-green water dotted with towering limestone islands, traditional junk boats and morning mist",
    experiences: [
      "an overnight cruise on a junk boat",
      "kayaking through sea caves",
      "sunrise tai chi on deck",
    ],
    cuisine: ["pho", "fresh spring rolls", "Vietnamese iced coffee"],
    bestMonths: "Mar–May, Sep–Nov",
  },
  {
    slug: "sri-lanka",
    name: "Sri Lanka",
    country: "Sri Lanka",
    region: "Asia",
    landmarks: [
      "Sigiriya rock fortress",
      "the Nine Arch Bridge",
      "hill-country tea plantations",
    ],
    scenery:
      "misty green tea hills, blue trains on stone bridges, golden beaches and wild elephants",
    experiences: [
      "the scenic train ride to Ella",
      "a leopard safari in Yala",
      "climbing Sigiriya at sunrise",
    ],
    cuisine: ["rice and curry", "hoppers", "Ceylon tea"],
    bestMonths: "Dec–Apr on the south and west coasts",
  },
  {
    slug: "rajasthan",
    name: "Rajasthan",
    country: "India",
    region: "Asia",
    landmarks: [
      "Jaipur's Hawa Mahal",
      "Udaipur's Lake Palace",
      "the Jaisalmer dunes",
    ],
    scenery:
      "pink and golden sandstone palaces, lakeside forts, colourful bazaars, camels and desert sunsets",
    experiences: [
      "a heritage palace stay",
      "a camel safari in the Thar desert",
      "a boat ride on Lake Pichola",
    ],
    cuisine: ["dal baati churma", "laal maas", "masala chai"],
    bestMonths: "Oct–Mar",
  },
  {
    slug: "kerala",
    name: "Kerala",
    country: "India",
    region: "Asia",
    landmarks: ["Alleppey backwaters", "Munnar tea gardens", "Kovalam beach"],
    scenery:
      "palm-lined backwaters, traditional houseboats, misty tea-covered hills and lush tropical green",
    experiences: [
      "an overnight houseboat cruise",
      "an Ayurvedic spa treatment",
      "a Kathakali dance performance",
    ],
    cuisine: ["a banana-leaf sadya", "appam with stew", "Kerala fish curry"],
    bestMonths: "Sep–Mar",
  },
  {
    slug: "goa",
    name: "Goa",
    country: "India",
    region: "Asia",
    landmarks: [
      "Palolem beach",
      "Portuguese-era churches",
      "Fontainhas Latin quarter",
    ],
    scenery:
      "palm-fringed golden beaches, beach shacks, colourful Portuguese-era houses and sunset sky",
    experiences: [
      "a beach shack sunset",
      "a river cruise",
      "exploring old Goa's heritage",
    ],
    cuisine: ["Goan fish curry", "prawn balchão", "bebinca"],
    bestMonths: "Nov–Feb",
  },
  {
    slug: "ladakh",
    name: "Ladakh",
    country: "India",
    region: "Asia",
    landmarks: ["Pangong Lake", "Thiksey Monastery", "Khardung La pass"],
    scenery:
      "high-altitude desert, stark brown mountains, prayer flags and a shimmering blue lake under clear sky",
    experiences: [
      "a motorbike ride over mountain passes",
      "camping by Pangong Lake",
      "a monastery visit",
    ],
    cuisine: ["momos", "thukpa", "butter tea"],
    bestMonths: "Jun–Sep",
  },
  {
    slug: "nepal",
    name: "Nepal",
    country: "Nepal",
    region: "Asia",
    landmarks: [
      "the Himalayan range",
      "Boudhanath Stupa",
      "Phewa Lake in Pokhara",
    ],
    scenery:
      "snow-capped Himalayan peaks, prayer flags, terraced hills, stupas and tranquil lakes",
    experiences: [
      "trekking to Everest or Annapurna base camp",
      "paragliding over Pokhara",
      "a mountain flight",
    ],
    cuisine: ["momos", "dal bhat", "masala tea"],
    bestMonths: "Mar–May, Oct–Nov",
  },
  {
    slug: "bhutan",
    name: "Bhutan",
    country: "Bhutan",
    region: "Asia",
    landmarks: [
      "Paro Taktsang (Tiger's Nest) monastery",
      "Punakha Dzong",
      "Himalayan valleys",
    ],
    scenery:
      "cliffside monasteries, white dzong fortresses, prayer flags and pine-forested Himalayan valleys",
    experiences: [
      "the hike to Tiger's Nest",
      "a hot stone bath",
      "a local festival",
    ],
    cuisine: ["ema datshi", "red rice", "butter tea"],
    bestMonths: "Mar–May, Sep–Nov",
  },

  /* ── Africa ─────────────────────────────────────────────────────────── */
  {
    slug: "cape-town",
    name: "Cape Town",
    country: "South Africa",
    region: "Africa",
    landmarks: [
      "Table Mountain",
      "the Bo-Kaap's colourful houses",
      "Camps Bay",
    ],
    scenery:
      "flat-topped mountain over the ocean, colourful houses, granite beaches and vineyards in golden light",
    experiences: [
      "the Table Mountain cableway",
      "a winelands tour",
      "visiting the Boulders Beach penguins",
    ],
    cuisine: ["bobotie", "braai barbecue", "Cape wines"],
    bestMonths: "Nov–Mar",
  },
  {
    slug: "serengeti",
    name: "Serengeti",
    country: "Tanzania",
    region: "Africa",
    landmarks: [
      "endless golden savannah",
      "acacia trees",
      "the Great Migration herds",
    ],
    scenery:
      "golden grassland, flat-topped acacias, lions and wildebeest herds under vast dramatic skies",
    experiences: [
      "a game drive in an open safari vehicle",
      "a hot air balloon safari",
      "a luxury tented camp",
    ],
    cuisine: ["a bush breakfast", "nyama choma", "sundowner drinks"],
    bestMonths: "Jun–Oct",
  },
  {
    slug: "zanzibar",
    name: "Zanzibar",
    country: "Tanzania",
    region: "Africa",
    landmarks: [
      "Stone Town's carved doors",
      "Nungwi beach",
      "traditional dhow boats",
    ],
    scenery:
      "white sand beaches, turquoise Indian Ocean, dhow sails and Stone Town's weathered coral-stone lanes",
    experiences: [
      "a sunset dhow cruise",
      "a spice farm tour",
      "snorkelling at Mnemba atoll",
    ],
    cuisine: ["Zanzibar pizza", "grilled seafood", "spiced coffee"],
    bestMonths: "Jun–Oct, Dec–Feb",
  },
  {
    slug: "marrakech",
    name: "Marrakech",
    country: "Morocco",
    region: "Africa",
    landmarks: [
      "Jemaa el-Fna square",
      "the Majorelle Garden",
      "the Koutoubia minaret",
    ],
    scenery:
      "terracotta walls, riad courtyards with tiled fountains, souk lanterns and the Atlas mountains beyond",
    experiences: [
      "a stay in a traditional riad",
      "shopping the souks",
      "a night in an Agafay desert camp",
    ],
    cuisine: ["tagine", "couscous", "mint tea"],
    bestMonths: "Mar–May, Sep–Nov",
  },
  {
    slug: "egypt",
    name: "Cairo & the Nile",
    country: "Egypt",
    region: "Africa",
    landmarks: [
      "the Pyramids of Giza",
      "the Great Sphinx",
      "Nile felucca boats",
    ],
    scenery:
      "monumental pyramids in golden desert, palm-lined Nile banks, ancient temple columns and warm sunsets",
    experiences: [
      "a sunrise at the Pyramids",
      "a Nile cruise from Luxor to Aswan",
      "a felucca sail at sunset",
    ],
    cuisine: ["koshari", "falafel (ta'ameya)", "hibiscus tea"],
    bestMonths: "Oct–Apr",
  },
  {
    slug: "mauritius",
    name: "Mauritius",
    country: "Mauritius",
    region: "Africa",
    landmarks: [
      "Le Morne Brabant",
      "the underwater waterfall illusion",
      "Chamarel seven-coloured earth",
    ],
    scenery:
      "turquoise lagoons ringed by coral reef, volcanic green peaks and white sand resort beaches",
    experiences: [
      "a catamaran day trip",
      "swimming with dolphins",
      "a seaplane flight over the lagoon",
    ],
    cuisine: ["dholl puri", "seafood rougaille", "fresh tropical fruit"],
    bestMonths: "May–Dec",
  },
  {
    slug: "seychelles",
    name: "Seychelles",
    country: "Seychelles",
    region: "Africa",
    landmarks: [
      "Anse Source d'Argent's granite boulders",
      "Vallée de Mai palm forest",
      "giant tortoises",
    ],
    scenery:
      "sculpted pink-grey granite boulders on powder-white beaches, clear shallow water and lush palms",
    experiences: [
      "island hopping by boat",
      "meeting giant tortoises",
      "snorkelling in a marine park",
    ],
    cuisine: ["Creole fish curry", "grilled octopus", "coconut desserts"],
    bestMonths: "Apr–May, Oct–Nov",
  },

  /* ── Americas ───────────────────────────────────────────────────────── */
  {
    slug: "new-york",
    name: "New York City",
    country: "United States",
    region: "Americas",
    landmarks: ["the Manhattan skyline", "Times Square", "the Brooklyn Bridge"],
    scenery:
      "towering skyscrapers, yellow cabs, steam rising from streets, Central Park greenery and golden-hour avenues",
    experiences: [
      "a rooftop view at sunset",
      "a Broadway show",
      "a walk across the Brooklyn Bridge",
    ],
    cuisine: ["New York pizza by the slice", "bagels", "cheesecake"],
    bestMonths: "Apr–Jun, Sep–Nov",
  },
  {
    slug: "machu-picchu",
    name: "Machu Picchu",
    country: "Peru",
    region: "Americas",
    landmarks: ["the Inca citadel", "Huayna Picchu peak", "Andean terraces"],
    scenery:
      "ancient stone ruins on a mountain ridge, emerald peaks, drifting clouds and llamas on terraces",
    experiences: [
      "trekking the Inca Trail",
      "sunrise at the Sun Gate",
      "the scenic train through the Sacred Valley",
    ],
    cuisine: ["ceviche", "lomo saltado", "a pisco sour"],
    bestMonths: "May–Sep",
  },
  {
    slug: "cancun-tulum",
    name: "Cancún & Tulum",
    country: "Mexico",
    region: "Americas",
    landmarks: [
      "the Tulum clifftop ruins",
      "cenotes",
      "Caribbean white sand beaches",
    ],
    scenery:
      "turquoise Caribbean sea, white sand, jungle cenotes with clear blue water and Mayan stone ruins",
    experiences: [
      "swimming in a cenote",
      "visiting Chichén Itzá",
      "a beach club day",
    ],
    cuisine: ["street tacos", "fresh guacamole", "a margarita"],
    bestMonths: "Dec–Apr",
  },
  {
    slug: "rio-de-janeiro",
    name: "Rio de Janeiro",
    country: "Brazil",
    region: "Americas",
    landmarks: [
      "Christ the Redeemer",
      "Sugarloaf Mountain",
      "Copacabana beach",
    ],
    scenery:
      "dramatic green peaks over a curving bay, golden beaches, mosaic promenades and tropical light",
    experiences: [
      "the cable car up Sugarloaf",
      "Carnival celebrations",
      "a sunset at Ipanema",
    ],
    cuisine: ["feijoada", "pão de queijo", "a caipirinha"],
    bestMonths: "Dec–Mar, May–Sep",
  },
  {
    slug: "banff",
    name: "Banff",
    country: "Canada",
    region: "Americas",
    landmarks: ["Lake Louise", "Moraine Lake", "the Canadian Rockies"],
    scenery:
      "glacier-fed turquoise lakes, jagged Rocky Mountain peaks, pine forests and log lodges",
    experiences: [
      "canoeing on Lake Louise",
      "driving the Icefields Parkway",
      "a gondola ride",
    ],
    cuisine: ["Alberta beef", "maple treats", "poutine"],
    bestMonths: "Jun–Sep, Dec–Mar for skiing",
  },
  {
    slug: "patagonia",
    name: "Patagonia",
    country: "Chile & Argentina",
    region: "Americas",
    landmarks: [
      "the granite towers of Torres del Paine",
      "Perito Moreno glacier",
      "Mount Fitz Roy",
    ],
    scenery:
      "jagged granite spires, blue glaciers, windswept steppe and glacial lakes under dramatic skies",
    experiences: [
      "trekking the W Trek",
      "walking on a glacier",
      "a remote eco-lodge stay",
    ],
    cuisine: ["Patagonian lamb asado", "empanadas", "Malbec wine"],
    bestMonths: "Nov–Mar",
  },
  {
    slug: "hawaii",
    name: "Hawaii",
    country: "United States",
    region: "Americas",
    landmarks: [
      "the Na Pali coast",
      "Waikiki beach and Diamond Head",
      "volcanic landscapes",
    ],
    scenery:
      "emerald sea cliffs, palm-lined beaches, rolling surf, volcanic rock and rainbow-lit valleys",
    experiences: ["a helicopter tour", "a surf lesson", "a traditional luau"],
    cuisine: ["poke bowls", "shave ice", "kalua pork"],
    bestMonths: "Apr–Jun, Sep–Oct",
  },

  /* ── Oceania ────────────────────────────────────────────────────────── */
  {
    slug: "sydney",
    name: "Sydney",
    country: "Australia",
    region: "Oceania",
    landmarks: ["the Sydney Opera House", "the Harbour Bridge", "Bondi Beach"],
    scenery:
      "sparkling harbour, white sail-shaped opera house, sandstone cliffs and surf beaches in bright sunshine",
    experiences: [
      "a harbour cruise",
      "the Bondi to Coogee coastal walk",
      "climbing the Harbour Bridge",
    ],
    cuisine: ["fresh seafood platter", "flat white coffee", "Tim Tams"],
    bestMonths: "Sep–Nov, Mar–May",
  },
  {
    slug: "queenstown",
    name: "Queenstown",
    country: "New Zealand",
    region: "Oceania",
    landmarks: [
      "Lake Wakatipu",
      "the Remarkables range",
      "Milford Sound fjord",
    ],
    scenery:
      "deep blue alpine lake ringed by snow-dusted peaks, fjords with waterfalls and autumn gold trees",
    experiences: ["a bungee jump", "a Milford Sound cruise", "a jet boat ride"],
    cuisine: ["lamb", "a Fergburger", "Central Otago pinot noir"],
    bestMonths: "Dec–Feb, Jun–Aug for skiing",
  },
  {
    slug: "bora-bora",
    name: "Bora Bora",
    country: "French Polynesia",
    region: "Oceania",
    landmarks: ["Mount Otemanu", "overwater bungalows", "the turquoise lagoon"],
    scenery:
      "overwater bungalows in an impossibly turquoise lagoon beneath a lush volcanic peak",
    experiences: [
      "snorkelling with rays and sharks",
      "a canoe breakfast delivery",
      "a lagoon sunset cruise",
    ],
    cuisine: ["poisson cru", "tropical fruit", "fresh coconut"],
    bestMonths: "May–Oct",
  },
  {
    slug: "great-barrier-reef",
    name: "Great Barrier Reef",
    country: "Australia",
    region: "Oceania",
    landmarks: ["Heart Reef", "Whitehaven Beach", "the Whitsunday Islands"],
    scenery:
      "swirling white silica sand, turquoise shallows, vivid coral gardens and tropical islands from above",
    experiences: [
      "snorkelling the coral reef",
      "a scenic flight over Heart Reef",
      "sailing the Whitsundays",
    ],
    cuisine: ["fresh barramundi", "Moreton Bay bugs", "tropical cocktails"],
    bestMonths: "Jun–Oct",
  },
]

const BY_SLUG = new Map(DESTINATIONS.map((item) => [item.slug, item]))

export function findDestination(slug: string): Destination | undefined {
  return BY_SLUG.get(slug)
}

export function destinationsByRegion(): Record<Region, Destination[]> {
  const grouped = Object.fromEntries(
    REGIONS.map((region) => [region, [] as Destination[]])
  ) as Record<Region, Destination[]>
  for (const item of DESTINATIONS) grouped[item.region].push(item)
  return grouped
}
