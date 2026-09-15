/**
 * Seed Dataset for Campus Infrastructure & Local Amenities
 * Categorized map symbols:
 * 🎓 University: Main campus buildings & faculty departments
 * 🏋️ Gyms/Recreation: University sports centers, gym clubs, pools
 * 📚 Libraries: University central and subject libraries, 24/7 study spaces
 * 🛒 Groceries & Transit: Discount supermarkets, metro & train stations
 */

const campusAmenities = [
  // ==========================================
  // Technical University of Munich (TUM)
  // Campus: (48.1497, 11.5678)
  // ==========================================
  {
    id: "tum-amenity-main-building",
    University_ID: "tum-germany",
    Name: "TUM Main Campus (Hauptgebäude & Audimax)",
    Category: "University",
    Subcategory: "Faculty & Administration",
    Coordinates: { lat: 48.1497, lng: 11.5678 },
    Distance_Km: 0.0,
    Icon: "University",
    Details: "Department of Informatics, Mathematics, Electrical Engineering, and Rectorate"
  },
  {
    id: "tum-amenity-ub-arcis",
    University_ID: "tum-germany",
    Name: "TUM Universitätsbibliothek (Central Library)",
    Category: "Library",
    Subcategory: "Academic Library",
    Coordinates: { lat: 48.1495, lng: 11.5684 },
    Distance_Km: 0.05,
    Icon: "Library",
    Details: "Open until midnight, 800+ quiet study desks, high-speed WiFi, print stations"
  },
  {
    id: "tum-amenity-zhs-sports",
    University_ID: "tum-germany",
    Name: "Zentraler Hochschulsport München (ZHS Olympic Center)",
    Category: "Gym",
    Subcategory: "University Sports Center",
    Coordinates: { lat: 48.1755, lng: 11.5490 },
    Distance_Km: 3.4,
    Icon: "Gym",
    Details: "Largest student sports facility in Europe. Gym, swimming hall, athletics, bouldering for €15/semester"
  },
  {
    id: "tum-amenity-fitx-maxvorstadt",
    University_ID: "tum-germany",
    Name: "FitX / McFit Fitness Studio Munich-Center",
    Category: "Gym",
    Subcategory: "Fitness Club",
    Coordinates: { lat: 48.1460, lng: 11.5580 },
    Distance_Km: 0.8,
    Icon: "Gym",
    Details: "24/7 gym with free weights, cardio zones, and student membership discounts"
  },
  {
    id: "tum-amenity-edeka-arcis",
    University_ID: "tum-germany",
    Name: "EDEKA & BackWerk Bakery",
    Category: "Grocery",
    Subcategory: "Supermarket",
    Coordinates: { lat: 48.1505, lng: 11.5655 },
    Distance_Km: 0.2,
    Icon: "Grocery",
    Details: "Fresh produce, groceries, sandwiches, hot coffee, and student lunch specials"
  },
  {
    id: "tum-amenity-lidl-theresien",
    University_ID: "tum-germany",
    Name: "Lidl Discount Supermarket (Theresienstraße)",
    Category: "Grocery",
    Subcategory: "Discount Supermarket",
    Coordinates: { lat: 48.1512, lng: 11.5720 },
    Distance_Km: 0.4,
    Icon: "Grocery",
    Details: "Affordable student groceries, organic staples, fresh baked goods"
  },
  {
    id: "tum-amenity-ubahn-theresien",
    University_ID: "tum-germany",
    Name: "U-Bahn Station Theresienstraße (U2)",
    Category: "Transit",
    Subcategory: "Subway Station",
    Coordinates: { lat: 48.1509, lng: 11.5645 },
    Distance_Km: 0.25,
    Icon: "Transit",
    Details: "Direct 3-minute subway to Munich Central Station (Hauptbahnhof)"
  },
  {
    id: "tum-amenity-mensa-aricis",
    University_ID: "tum-germany",
    Name: "Mensa Arcisstraße (Studierendenwerk)",
    Category: "University",
    Subcategory: "Student Canteen",
    Coordinates: { lat: 48.1488, lng: 11.5670 },
    Distance_Km: 0.1,
    Icon: "University",
    Details: "Subsidized hot meals from €2.80 - €4.50 with student card (vegetarian/vegan daily options)"
  },

  // ==========================================
  // Technical University of Berlin (TU Berlin)
  // Campus: (52.5119, 13.3265)
  // ==========================================
  {
    id: "tub-amenity-main-building",
    University_ID: "tu-berlin-germany",
    Name: "TU Berlin Hauptgebäude (Main Building)",
    Category: "University",
    Subcategory: "Faculty & Administration",
    Coordinates: { lat: 52.5119, lng: 13.3265 },
    Distance_Km: 0.0,
    Icon: "University",
    Details: "Main university complex, Audimax, mathematics and computer science institutes"
  },
  {
    id: "tub-amenity-volkswagen-library",
    University_ID: "tu-berlin-germany",
    Name: "Volkswagen University Library (TUB & UdK)",
    Category: "Library",
    Subcategory: "Academic Library",
    Coordinates: { lat: 52.5132, lng: 13.3245 },
    Distance_Km: 0.2,
    Icon: "Library",
    Details: "State-of-the-art 5-story library, 1,500 workstations, open Monday - Saturday till 10 PM"
  },
  {
    id: "tub-amenity-tu-sport",
    University_ID: "tu-berlin-germany",
    Name: "TU Sportzentrum (Waldschulallee)",
    Category: "Gym",
    Subcategory: "University Sports Center",
    Coordinates: { lat: 52.5080, lng: 13.3210 },
    Distance_Km: 0.6,
    Icon: "Gym",
    Details: "University gym, fitness classes, martial arts, basketball, indoor climbing"
  },
  {
    id: "tub-amenity-aldi-ernst-reuter",
    University_ID: "tu-berlin-germany",
    Name: "ALDI Nord (Ernst-Reuter-Platz)",
    Category: "Grocery",
    Subcategory: "Discount Supermarket",
    Coordinates: { lat: 52.5128, lng: 13.3215 },
    Distance_Km: 0.35,
    Icon: "Grocery",
    Details: "Low-cost groceries, beverages, bakery, quick snacks"
  },
  {
    id: "tub-amenity-sbahn-tiergarten",
    University_ID: "tu-berlin-germany",
    Name: "S-Bahn Station Tiergarten",
    Category: "Transit",
    Subcategory: "City Train Station",
    Coordinates: { lat: 52.5140, lng: 13.3360 },
    Distance_Km: 0.7,
    Icon: "Transit",
    Details: "S3, S5, S7, S9 lines connecting across central Berlin to Alexanderplatz & Ostbahnhof"
  },

  // ==========================================
  // RWTH Aachen University
  // Campus: (50.7780, 6.0785)
  // ==========================================
  {
    id: "rwth-amenity-superc",
    University_ID: "rwth-aachen-germany",
    Name: "SuperC Student Service Center",
    Category: "University",
    Subcategory: "Student Center & Registrar",
    Coordinates: { lat: 50.7785, lng: 6.0780 },
    Distance_Km: 0.05,
    Icon: "University",
    Details: "Central international office, admissions desks, student advising, and IT center"
  },
  {
    id: "rwth-amenity-ub-central",
    University_ID: "rwth-aachen-germany",
    Name: "Universitätsbibliothek RWTH Aachen",
    Category: "Library",
    Subcategory: "Central Library",
    Coordinates: { lat: 50.7770, lng: 6.0795 },
    Distance_Km: 0.1,
    Icon: "Library",
    Details: "Open 24/7 during exam periods, electronic reserves, group study cubicles"
  },
  {
    id: "rwth-amenity-rewe-templergraben",
    University_ID: "rwth-aachen-germany",
    Name: "REWE City Supermarket",
    Category: "Grocery",
    Subcategory: "Supermarket",
    Coordinates: { lat: 50.7765, lng: 6.0810 },
    Distance_Km: 0.25,
    Icon: "Grocery",
    Details: "Open until 10 PM, fresh salad bar, groceries, student convenience items"
  },

  // ==========================================
  // Sorbonne University (Paris)
  // Campus: (48.8471, 2.3553)
  // ==========================================
  {
    id: "sorbonne-amenity-jussieu",
    University_ID: "sorbonne-france",
    Name: "Campus Pierre et Marie Curie (Jussieu)",
    Category: "University",
    Subcategory: "Science Campus",
    Coordinates: { lat: 48.8471, lng: 2.3553 },
    Distance_Km: 0.0,
    Icon: "University",
    Details: "Main faculty of sciences, robotics laboratories, computer science amphitheaters"
  },
  {
    id: "sorbonne-amenity-bupmc-library",
    University_ID: "sorbonne-france",
    Name: "Bibliothèque de Sorbonne Université (BSU)",
    Category: "Library",
    Subcategory: "University Library",
    Coordinates: { lat: 48.8465, lng: 2.3560 },
    Distance_Km: 0.08,
    Icon: "Library",
    Details: "Over 1.2 million volumes, international student work hubs, open Monday - Saturday"
  },
  {
    id: "sorbonne-amenity-metro-jussieu",
    University_ID: "sorbonne-france",
    Name: "Metro Station Jussieu (Lines 7 & 10)",
    Category: "Transit",
    Subcategory: "Metro Station",
    Coordinates: { lat: 48.8460, lng: 2.3540 },
    Distance_Km: 0.15,
    Icon: "Transit",
    Details: "Direct connection to Châtelet, Gare d'Austerlitz, and Paris city center"
  },
  {
    id: "sorbonne-amenity-monoprix",
    University_ID: "sorbonne-france",
    Name: "Monoprix & Franprix Supermarket",
    Category: "Grocery",
    Subcategory: "Supermarket",
    Coordinates: { lat: 48.8485, lng: 2.3530 },
    Distance_Km: 0.2,
    Icon: "Grocery",
    Details: "Gourmet and discount groceries, bakery, prepared meals"
  },

  // ==========================================
  // TU Delft (Netherlands)
  // Campus: (52.0026, 4.3705)
  // ==========================================
  {
    id: "tudelft-amenity-aula",
    University_ID: "tu-delft-netherlands",
    Name: "TU Delft Aula Congress Centre & EWI Faculty",
    Category: "University",
    Subcategory: "Main Academic Complex",
    Coordinates: { lat: 52.0026, lng: 4.3705 },
    Distance_Km: 0.0,
    Icon: "University",
    Details: "Heart of TU Delft campus, electrical engineering & computer science towers"
  },
  {
    id: "tudelft-amenity-library-cone",
    University_ID: "tu-delft-netherlands",
    Name: "TU Delft Iconic Library (Grass Roof & Cone)",
    Category: "Library",
    Subcategory: "Iconic Academic Library",
    Coordinates: { lat: 52.0015, lng: 4.3725 },
    Distance_Km: 0.18,
    Icon: "Library",
    Details: "World-famous architectural library with 4-story book wall, quiet study pods, VR lab"
  },
  {
    id: "tudelft-amenity-x-sports",
    University_ID: "tu-delft-netherlands",
    Name: "X TU Delft Sports & Culture Center",
    Category: "Gym",
    Subcategory: "Sports & Arts Complex",
    Coordinates: { lat: 51.9985, lng: 4.3745 },
    Distance_Km: 0.5,
    Icon: "Gym",
    Details: "Comprehensive student center: 3 gyms, climbing wall, dance studios, tennis, student cafe"
  },
  {
    id: "tudelft-amenity-albert-heijn",
    University_ID: "tu-delft-netherlands",
    Name: "Albert Heijn Supermarket (Campus Strip)",
    Category: "Grocery",
    Subcategory: "Supermarket",
    Coordinates: { lat: 52.0040, lng: 4.3680 },
    Distance_Km: 0.25,
    Icon: "Grocery",
    Details: "Fresh salads, broodjes, grocery essentials, bonus card discounts for students"
  },

  // ==========================================
  // KTH Stockholm (Sweden)
  // Campus: (59.3498, 18.0707)
  // ==========================================
  {
    id: "kth-amenity-main-courtyard",
    University_ID: "kth-sweden",
    Name: "KTH Main Courtyard (Borggården)",
    Category: "University",
    Subcategory: "Historic Campus",
    Coordinates: { lat: 59.3498, lng: 18.0707 },
    Distance_Km: 0.0,
    Icon: "University",
    Details: "Historic national engineering institute campus, EECS school, rectorate"
  },
  {
    id: "kth-amenity-kthb-library",
    University_ID: "kth-sweden",
    Name: "KTH Biblioteket (Main Library)",
    Category: "Library",
    Subcategory: "University Library",
    Coordinates: { lat: 59.3485, lng: 18.0725 },
    Distance_Km: 0.15,
    Icon: "Library",
    Details: "Light-filled modern library, group rooms with smartboards, textbook reserves"
  },
  {
    id: "kth-amenity-kth-hallen",
    University_ID: "kth-sweden",
    Name: "KTH-Hallen Student Gym & Sports Club",
    Category: "Gym",
    Subcategory: "Campus Sports Hall",
    Coordinates: { lat: 59.3510, lng: 18.0690 },
    Distance_Km: 0.18,
    Icon: "Gym",
    Details: "Squash courts, fitness center, group training, student union wellness center"
  },
  {
    id: "kth-amenity-t-bana-tekniska",
    University_ID: "kth-sweden",
    Name: "Tunnelbana Station Tekniska Högskolan (Red Line)",
    Category: "Transit",
    Subcategory: "Metro & Bus Terminal",
    Coordinates: { lat: 59.3458, lng: 18.0712 },
    Distance_Km: 0.45,
    Icon: "Transit",
    Details: "Direct 6-minute metro to T-Centralen (Stockholm Central Station)"
  }
];

module.exports = {
  campusAmenities
};
