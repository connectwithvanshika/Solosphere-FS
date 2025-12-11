// import React, { useMemo, useState } from "react";
// import "../styles/travel-tips.css";

// /**
//  * TravelTips - Travel Tips & Safety Guide
//  * - 6 cards per page
//  * - Search, category, city filters
//  * - Card detail modal
//  *
//  * Use this as a page or a section in your app.
//  */

// const DEMO_TIPS = [
//   /* -----------------------------------------------------
//      GOA — SAFETY (3 CARDS)
//   ----------------------------------------------------- */
//   {
//     id: 1,
//     city: "Goa",
//     category: "Safety",
//     title: "Staying Safe at Goa Beaches",
//     excerpt: "Essential rules for safe solo beach travel.",
//     content:
//       "• Avoid isolated beaches after 7 PM.\n• Keep valuables in waterproof pouch.\n• Use verified beach shacks only.\n• Avoid accepting drinks from strangers.",
//     verified: true,
//     image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/b0/c2/4f/private-beach-hotels.jpg?w=1200&h=-1&s=1"
//   },
//   {
//     id: 2,
//     city: "Goa",
//     category: "Safety",
//     title: "Nightlife Safety Tips in Goa",
//     excerpt: "How to enjoy nightlife safely as a solo traveler.",
//     content:
//       "• Prefer clubs with security.\n• Keep your drink in sight.\n• Use official cabs.\n• Stay in women-friendly hostels.",
//     verified: false,
//     image: "https://www.indianholiday.uk/blog/wp-content/uploads/2012/05/Leela-Kempinski-Goa-beach-dining-night.jpg"
//   },
//   {
//     id: 3,
//     city: "Goa",
//     category: "Safety",
//     title: "Safe Beach Sports in Goa",
//     excerpt: "Water-sport safety do’s & don’ts.",
//     content:
//       "• Avoid unregistered operators.\n• Check equipment quality.\n• Wear proper safety jackets.\n• Confirm pricing beforehand.",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&w=1200"
//   },

//   /* -----------------------------------------------------
//      GOA — TRANSPORT (3 CARDS)
//   ----------------------------------------------------- */
//   {
//     id: 4,
//     city: "Goa",
//     category: "Transport",
//     title: "Safe Scooter Rentals in Goa",
//     excerpt: "How to rent scooters without scams.",
//     content:
//       "• Check vehicle documents.\n• Avoid deposits without receipts.\n• Take photos of scratches.\n• Wear helmet at all times.",
//     verified: true,
//     image: "https://nomadgao.com/wp-content/uploads/2023/11/Renting-a-bike-Goa-1.jpg"
//   },
//   {
//     id: 5,
//     city: "Goa",
//     category: "Transport",
//     title: "Late-Night Transport Options",
//     excerpt: "Best late-night transport for women.",
//     content:
//       "• Use GoaMiles.\n• Avoid strangers offering rides.\n• Share location with friend.\n• Stay near lit roads.",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&w=1200"
//   },
//   {
//     id: 6,
//     city: "Goa",
//     category: "Transport",
//     title: "Public Transport Tips in Goa",
//     excerpt: "How to safely use buses & ferries.",
//     content:
//       "• Prefer day-time travel.\n• Keep your bag in front.\n• Confirm ferry timings.\n• Avoid overcrowded buses.",
//     verified: false,
//     image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&w=1200"
//   },

//   /* -----------------------------------------------------
//      GOA — WELLNESS (3 CARDS)
//   ----------------------------------------------------- */
//   {
//     id: 7,
//     city: "Goa",
//     category: "Wellness",
//     title: "Beach Yoga Tips",
//     excerpt: "Relaxation routines while staying safe.",
//     content:
//       "• Morning yoga is safest.\n• Avoid secluded areas.\n• Hydrate well.\n• Use SPF.",
//     verified: false,
//     image: "https://images.unsplash.com/photo-1646166624936-d93c08117e02?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJlYWNoJTIweW9nYXxlbnwwfHwwfHx8MA%3D%3D"
//   },
//   {
//     id: 8,
//     city: "Goa",
//     category: "Wellness",
//     title: "Mental Refresh Guide for Solo Travelers",
//     excerpt: "How to balance fun and mental calm.",
//     content:
//       "• Take digital detox breaks.\n• Journal your experiences.\n• Avoid over-scheduling.\n• Spend time in nature.",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&w=1200"
//   },
//   {
//     id: 9,
//     city: "Goa",
//     category: "Wellness",
//     title: "Healthy Eating in Coastal Areas",
//     excerpt: "How to eat well while traveling alone.",
//     content:
//       "• Prefer fresh-cooked food.\n• Avoid cut fruits.\n• Hydrate enough.\n• Carry ORS packets.",
//     verified: false,
//     image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&w=1200"
//   },

//   /* -----------------------------------------------------
//      GOA — HELPLINES (3 CARDS)
//   ----------------------------------------------------- */
//   {
//     id: 10,
//     city: "Goa",
//     category: "Helplines",
//     title: "Goa Emergency Contacts",
//     excerpt: "Save these numbers before your trip.",
//     content:
//       "• Police: 100\n• Women helpline: 1091\n• Ambulance: 108\n• Tourist helpline: 1364",
//     verified: true,
//     image: "https://media.istockphoto.com/id/177268589/photo/emergency-contact-information.jpg?s=612x612&w=0&k=20&c=JDWcQcmRGeGPtWh0G6LeNDCjmMVA_UAP-OJZH3joftU="
//   },
//   {
//     id: 11,
//     city: "Goa",
//     category: "Helplines",
//     title: "Important Hospital Contacts",
//     excerpt: "Nearest hospitals & emergency care units.",
//     content:
//       "• GMC Hospital\n• Manipal Hospital\n• Apollo Clinic\n• Lifeline Ambulance",
//     verified: false,
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIrPMLvgVjTX8FJQDGk2PvDsK1q7l7Xq_FBQ&s"
//   },
//   {
//     id: 12,
//     city: "Goa",
//     category: "Helplines",
//     title: "Women Safety Resources in Goa",
//     excerpt: "Emergency support for solo women.",
//     content:
//       "• Women’s safety app: HawkEye\n• 24×7 help desk at police station\n• Pink Patrol Units",
//     verified: true,
//     image: "https://expressinnindia.com/wp-content/uploads/2024/07/Freesia-God-23.jpg"
//   },

//   /* -----------------------------------------------------
//      REPEAT EXACT SAME PATTERN FOR:
//      JAIPUR (13–24)
//      DELHI (25–36)
//      MUMBAI (37–48)
//      MANALI (49–60)
//   ----------------------------------------------------- */

//   /* -----------------------------------------------------
//      JAIPUR — SAFETY (3)
//   ----------------------------------------------------- */
//   {
//     id: 13,
//     city: "Jaipur",
//     category: "Safety",
//     title: "Staying Safe in Jaipur’s Pink City",
//     excerpt: "Best safety practices for solo women.",
//     content:
//       "• Avoid dark alleys.\n• Stay in trusted hostels.\n• Use prepaid autos.\n• Beware of fake guides.",
//     verified: true,
//     image: "https://chokhidhani.com/ethnic-resort-jaipur/wp-content/uploads/2025/04/Cottage-1024x683-1.jpg"
//   },
//   {
//     id: 14,
//     city: "Jaipur",
//     category: "Safety",
//     title: "Market Safety Tips",
//     excerpt: "Crowded bazaars need extra awareness.",
//     content:
//       "• Keep bag in front.\n• Avoid showing cash.\n• Don’t accept food samples.",
//     verified: false,
//     image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/UNESCO_WORLD_HERITAGE_CENTRE-JAIPUR_CITY-RAJASTHAN-01-.jpg/1200px-UNESCO_WORLD_HERITAGE_CENTRE-JAIPUR_CITY-RAJASTHAN-01-.jpg"
//   },
//   {
//     id: 15,
//     city: "Jaipur",
//     category: "Safety",
//     title: "Fort Safety for Solo Travelers",
//     excerpt: "How to explore forts safely.",
//     content:
//       "• Visit before 5 PM.\n• Carry water.\n• Stay near crowds.\n• Avoid isolated towers.",
//     verified: true,
//     image: "https://media.istockphoto.com/id/2185570022/photo/aerial-view-from-jaigarh-fort-at-sunset-india-rajasthan-jaipur.jpg?s=612x612&w=0&k=20&c=JkYydaB4JpXzHOsOOe8z0ANGHY10HqIPMpxwsnG-jAo="
//   },

//   /* -----------------------------------------------------
//      JAIPUR — TRANSPORT (3)
//   ----------------------------------------------------- */
//   {
//     id: 16,
//     city: "Jaipur",
//     category: "Transport",
//     title: "Safe Auto Travel in Jaipur",
//     excerpt: "Avoid scams & ride safely.",
//     content:
//       "• Prefer Ola/Uber autos.\n• Avoid ‘broken meter’ taxis.\n• Don’t share rides with strangers.",
//     verified: true,
//     image: "https://images.stockcake.com/public/3/5/f/35fadf1b-32c5-4976-acec-5ee98b702a78_large/colorful-auto-rickshaw-stockcake.jpg"
//   },
//   {
//     id: 17,
//     city: "Jaipur",
//     category: "Transport",
//     title: "Public Bus Safety",
//     excerpt: "Best routes & safest timings.",
//     content:
//       "• Prefer day buses.\n• Avoid overcrowded rides.\n• Sit near women passengers.",
//     verified: false,
//     image: "https://www.greenpeace.org/static/planet4-india-stateless/2022/10/19c9fe3f-7-1024x678.jpg"
//   },
//   {
//     id: 18,
//     city: "Jaipur",
//     category: "Transport",
//     title: "Night Travel Precautions",
//     excerpt: "Extra caution for late-night commute.",
//     content:
//       "• Avoid unlit areas.\n• Share live location.\n• Book cabs only through apps.",
//     verified: true,
//     image: "https://images.pexels.com/photos/20654900/pexels-photo-20654900.jpeg?cs=srgb&dl=pexels-taylor-hunt-605291-20654900.jpg&fm=jpg"
//   },

//   /* -----------------------------------------------------
//      JAIPUR — WELLNESS (3)
//   ----------------------------------------------------- */
//   {
//     id: 19,
//     city: "Jaipur",
//     category: "Wellness",
//     title: "Heat Wellness Tips",
//     excerpt: "Stay healthy in Rajasthan heat.",
//     content:
//       "• Drink ORS.\n• Wear cotton.\n• Avoid noon outdoor time.\n• Carry hat.",
//     verified: true,
//     image: "https://media.istockphoto.com/id/1496615469/photo/serene-latin-woman-enjoy-sunset-with-gratitude.jpg?s=612x612&w=0&k=20&c=LXeGeLgKznGamU25tLajijCVuV5lxWIZH0RW5qN3k5g="
//   },
//   {
//     id: 20,
//     city: "Jaipur",
//     category: "Wellness",
//     title: "Mental Refresh in Historic Places",
//     excerpt: "Calm activities for long sightseeing days.",
//     content:
//       "• Take breaks.\n• Journal thoughts.\n• Sit near gardens.",
//     verified: false,
//     image: "https://img1.wsimg.com/isteam/stock/QpqKmw3/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=h:1000,cg:true"
//   },
//   {
//     id: 21,
//     city: "Jaipur",
//     category: "Wellness",
//     title: "Healthy Eating in Jaipur",
//     excerpt: "Avoid stomach issues on spicy food trips.",
//     content:
//       "• Avoid uncooked salads.\n• Prefer fresh meals.\n• Drink bottled water.",
//     verified: true,
//     image: "https://www.fabhotels.com/blog/wp-content/uploads/2018/08/600x400-17.jpg"
//   },

//   /* -----------------------------------------------------
//      JAIPUR — HELPLINES (3)
//   ----------------------------------------------------- */
//   {
//     id: 22,
//     city: "Jaipur",
//     category: "Helplines",
//     title: "Important Jaipur Helplines",
//     excerpt: "Save these before your trip.",
//     content: "Police 100, Women 1091, Ambulance 108",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1557234192-5b8b2cd1f55b?auto=format&w=1200"
//   },
//   {
//     id: 23,
//     city: "Jaipur",
//     category: "Helplines",
//     title: "Tourist Helpdesk Numbers",
//     excerpt: "Assistance for lost items, directions & safety.",
//     content:
//       "• Tourism helpline 1364\n• Pink Patrol\n• Local police desks",
//     verified: false,
//     image: "https://images.unsplash.com/photo-1580281657527-47d6b0c5a36d?auto=format&w=1200"
//   },
//   {
//     id: 24,
//     city: "Jaipur",
//     category: "Helplines",
//     title: "Nearest Hospitals in Jaipur",
//     excerpt: "Emergency medical locations.",
//     content:
//       "• Fortis\n• SMS Hospital\n• Manipal Hospital",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1560976812-2c36dc1b8f86?auto=format&w=1200"
//   },

//   /* -----------------------------------------------------
//      DELHI — SAFETY (3)
//   ----------------------------------------------------- */
//   {
//     id: 25,
//     city: "Delhi",
//     category: "Safety",
//     title: "Safety Tips for Delhi Markets",
//     excerpt: "Stay alert in busy areas.",
//     content:
//       "• Avoid sling bags.\n• Don’t show cash.\n• Keep zips closed.",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1495344517868-8ebaf0a2044a?auto=format&w=1200"
//   },
//   {
//     id: 26,
//     city: "Delhi",
//     category: "Safety",
//     title: "Metro Station Safety",
//     excerpt: "Metro is safe—but follow precautions.",
//     content:
//       "• Stay in women coaches.\n• Avoid last train.\n• Keep backpack in front.",
//     verified: false,
//     image: "https://images.unsplash.com/photo-1496237167324-504c0b3ac1b5?auto=format&w=1200"
//   },
//   {
//     id: 27,
//     city: "Delhi",
//     category: "Safety",
//     title: "Night Travel Safety in Delhi",
//     excerpt: "Travel safely after 9 PM.",
//     content:
//       "• Use ShareTrip.\n• Verify driver name.\n• Avoid dark lanes.",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&w=1200"
//   },

//   /* -----------------------------------------------------
//      DELHI — TRANSPORT (3)
//   ----------------------------------------------------- */
//   {
//     id: 28,
//     city: "Delhi",
//     category: "Transport",
//     title: "Best Solo Transport Options",
//     excerpt: "Safe ways to commute in Delhi.",
//     content:
//       "• Ola/Uber.\n• Metro.\n• E-Rickshaw in crowds.\n• Avoid unauthorized autos.",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1465447142348-e9952c393450?auto=format&w=1200"
//   },
//   {
//     id: 29,
//     city: "Delhi",
//     category: "Transport",
//     title: "Airport to City Transport Guide",
//     excerpt: "Safest options after landing.",
//     content:
//       "• Airport metro.\n• Meru cabs.\n• Avoid unofficial taxis.",
//     verified: false,
//     image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&w=1200"
//   },
//   {
//     id: 30,
//     city: "Delhi",
//     category: "Transport",
//     title: "Metro Etiquette & Safety",
//     excerpt: "For smooth & safe travel.",
//     content:
//       "• Avoid rush hour.\n• Stay aware.\n• Keep phone secure.",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&w=1200"
//   },

//   /* -----------------------------------------------------
//      DELHI — WELLNESS (3)
//   ----------------------------------------------------- */
//   {
//     id: 31,
//     city: "Delhi",
//     category: "Wellness",
//     title: "Staying Calm in Busy Delhi",
//     excerpt: "Mindfulness for chaotic days.",
//     content:
//       "• Deep breathing.\n• Drink water.\n• Take small breaks.",
//     verified: false,
//     image: "https://images.unsplash.com/photo-1533075372224-6b88e88ca6e6?auto=format&w=1200"
//   },
//   {
//     id: 32,
//     city: "Delhi",
//     category: "Wellness",
//     title: "Healthy Eating for Travelers",
//     excerpt: "Avoid stomach issues.",
//     content:
//       "• Avoid street cut fruits.\n• Drink bottled water.\n• Prefer cooked meals.",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1525059337994-6f2d8b4b1f89?auto=format&w=1200"
//   },
//   {
//     id: 33,
//     city: "Delhi",
//     category: "Wellness",
//     title: "Green Spots for Mental Refresh",
//     excerpt: "Relaxing places in Delhi.",
//     content:
//       "• Lodhi Garden.\n• Deer Park.\n• Garden of Five Senses.",
//     verified: false,
//     image: "https://images.unsplash.com/photo-1487700160041-babef9c3cb55?auto=format&w=1200"
//   },

//   /* -----------------------------------------------------
//      DELHI — HELPLINES (3)
//   ----------------------------------------------------- */
//   {
//     id: 34,
//     city: "Delhi",
//     category: "Helplines",
//     title: "Delhi Emergency Numbers",
//     excerpt: "Save these before visiting.",
//     content:
//       "Police 100\nWomen 1091\nAmbulance 108",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1557234192-5b8b2cd1f55b?auto=format&w=1200"
//   },
//   {
//     id: 35,
//     city: "Delhi",
//     category: "Helplines",
//     title: "Tourist Helplines",
//     excerpt: "Support for travelers.",
//     content:
//       "• 1364 tourism helpline\n• Metro security helpline",
//     verified: false,
//     image: "https://images.unsplash.com/photo-1580281657527-47d6b0c5a36d?auto=format&w=1200"
//   },
//   {
//     id: 36,
//     city: "Delhi",
//     category: "Helplines",
//     title: "Nearest Hospitals",
//     excerpt: "Important medical centers.",
//     content:
//       "• AIIMS\n• Apollo\n• Max Hospital",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1560976812-2c36dc1b8f86?auto=format&w=1200"
//   },

//   /* -----------------------------------------------------
//      MUMBAI — SAFETY (3)
//   ----------------------------------------------------- */
//   {
//     id: 37,
//     city: "Mumbai",
//     category: "Safety",
//     title: "Is Mumbai Safe for Solo Women?",
//     excerpt: "A safety overview.",
//     content:
//       "• Very safe in tourist zones.\n• Nightlife areas crowded.\n• Avoid isolated beaches.",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&w=1200"
//   },
//   {
//     id: 38,
//     city: "Mumbai",
//     category: "Safety",
//     title: "Crowded Train Safety Tips",
//     excerpt: "Travel stress-free in peak hours.",
//     content:
//       "• Use women’s coach.\n• Avoid rush hour.\n• Keep phone secure.",
//     verified: false,
//     image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&w=1200"
//   },
//   {
//     id: 39,
//     city: "Mumbai",
//     category: "Safety",
//     title: "Beach Safety in Mumbai",
//     excerpt: "Monsoon precautions.",
//     content:
//       "• Avoid high tides.\n• Don’t enter rough water.\n• Stay near guards.",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&w=1200"
//   },

//   /* -----------------------------------------------------
//      MUMBAI — TRANSPORT (3)
//   ----------------------------------------------------- */
//   {
//     id: 40,
//     city: "Mumbai",
//     category: "Transport",
//     title: "Best Solo Transport Options",
//     excerpt: "Safe ways to get around.",
//     content:
//       "• Local trains.\n• BEST buses.\n• Verified Uber drivers.",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1534532071526-d40c7e36a574?auto=format&w=1200"
//   },
//   {
//     id: 41,
//     city: "Mumbai",
//     category: "Transport",
//     title: "Auto Safety Guide",
//     excerpt: "Avoid bargaining issues.",
//     content:
//       "• Insist on meter.\n• Avoid auto at night.\n• Use app-based rides.",
//     verified: false,
//     image: "https://images.unsplash.com/photo-1488646953014-85e8f98ac3b2?auto=format&w=1200"
//   },
//   {
//     id: 42,
//     city: "Mumbai",
//     category: "Transport",
//     title: "Night Transport Guide",
//     excerpt: "Safest options for late hours.",
//     content:
//       "• Meru cabs.\n• Share-ride.\n• Stay in lit areas.",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&w=1200"
//   },

//   /* -----------------------------------------------------
//      MUMBAI — WELLNESS (3)
//   ----------------------------------------------------- */
//   {
//     id: 43,
//     city: "Mumbai",
//     category: "Wellness",
//     title: "Stress-Free Travel in Mumbai",
//     excerpt: "Relax in chaotic environments.",
//     content:
//       "• Visit Marine Drive.\n• Practice breathing.\n• Stay hydrated.",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&w=1200"
//   },
//   {
//     id: 44,
//     city: "Mumbai",
//     category: "Wellness",
//     title: "Healthy Eating for Long Trips",
//     excerpt: "Stay energized while exploring.",
//     content:
//       "• Avoid oily food.\n• Prefer coconut water.\n• Carry fruits.",
//     verified: false,
//     image: "https://images.unsplash.com/photo-1525059337994-6f2d8b4b1f89?auto=format&w=1200"
//   },
//   {
//     id: 45,
//     city: "Mumbai",
//     category: "Wellness",
//     title: "Mental Calm Spots in Mumbai",
//     excerpt: "Quiet places to relax.",
//     content:
//       "• Bandstand mornings.\n• Powai Lake.\n• City parks.",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1496386263053-95bfa4d103c7?auto=format&w=1200"
//   },

//   /* -----------------------------------------------------
//      MUMBAI — HELPLINES (3)
//   ----------------------------------------------------- */
//   {
//     id: 46,
//     city: "Mumbai",
//     category: "Helplines",
//     title: "Emergency Contacts for Travelers",
//     excerpt: "Important helplines in Mumbai.",
//     content: "100, 1091, 108",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1557234192-5b8b2cd1f55b?auto=format&w=1200"
//   },
//   {
//     id: 47,
//     city: "Mumbai",
//     category: "Helplines",
//     title: "Tourist Helpdesk",
//     excerpt: "Useful contacts for assistance.",
//     content:
//       "• Mumbai tourism helpline\n• Women’s safety desk",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1580281657527-47d6b0c5a36d?auto=format&w=1200"
//   },
//   {
//     id: 48,
//     city: "Mumbai",
//     category: "Helplines",
//     title: "Hospitals & Clinics Nearby",
//     excerpt: "Emergency healthcare information.",
//     content:
//       "• Hinduja\n• Breach Candy\n• Fortis",
//     verified: false,
//     image: "https://images.unsplash.com/photo-1560976812-2c36dc1b8f86?auto=format&w=1200"
//   },

//   /* -----------------------------------------------------
//      MANALI — SAFETY (3)
//   ----------------------------------------------------- */
//   {
//     id: 49,
//     city: "Manali",
//     category: "Safety",
//     title: "Mountain Trek Safety Tips",
//     excerpt: "Stay safe while trekking solo.",
//     content:
//       "• Inform your host.\n• Avoid snow paths alone.\n• Carry headlamp.",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1533105074-7d2f8d1e36b8?auto=format&w=1200"
//   },
//   {
//     id: 50,
//     city: "Manali",
//     category: "Safety",
//     title: "Safe Local Commute in Manali",
//     excerpt: "Avoid risky transport options.",
//     content:
//       "• Avoid shared jeeps at night.\n• Prefer official cabs.",
//     verified: false,
//     image: "https://images.unsplash.com/photo-1465447142348-e9952c393450?auto=format&w=1200"
//   },
//   {
//     id: 51,
//     city: "Manali",
//     category: "Safety",
//     title: "Snow Safety Tips",
//     excerpt: "Traveling during snow season.",
//     content:
//       "• Wear boots.\n• Carry warmers.\n• Avoid slippery slopes.",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1519821172141-b5d8e6e1d8aa?auto=format&w=1200"
//   },

//   /* -----------------------------------------------------
//      MANALI — TRANSPORT (3)
//   ----------------------------------------------------- */
//   {
//     id: 52,
//     city: "Manali",
//     category: "Transport",
//     title: "Best Transport Options in Manali",
//     excerpt: "Safest ways to explore the mountains.",
//     content:
//       "• HRTC buses.\n• Verified cab drivers.\n• Avoid hitchhiking.",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&w=1200"
//   },
//   {
//     id: 53,
//     city: "Manali",
//     category: "Transport",
//     title: "Trekking Route Transport Guide",
//     excerpt: "How to reach major trekking points safely.",
//     content:
//       "• Pre-book jeeps.\n• Avoid late-night travel.\n• Carry backup power.",
//     verified: false,
//     image: "https://images.unsplash.com/photo-1488646953014-85e8f98ac3b2?auto=format&w=1200"
//   },
//   {
//     id: 54,
//     city: "Manali",
//     category: "Transport",
//     title: "Transport Safety in Snow",
//     excerpt: "Winter transit tips.",
//     content:
//       "• Use snow chains.\n• Avoid bikes.\n• Use official taxis.",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&w=1200"
//   },

//   /* -----------------------------------------------------
//      MANALI — WELLNESS (3)
//   ----------------------------------------------------- */
//   {
//     id: 55,
//     city: "Manali",
//     category: "Wellness",
//     title: "Altitude Wellness Tips",
//     excerpt: "Avoid altitude sickness.",
//     content:
//       "• Hydrate more.\n• Avoid alcohol.\n• Take breaks.",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1526256444513-0c9a9c687d5b?auto=format&w=1200"
//   },
//   {
//     id: 56,
//     city: "Manali",
//     category: "Wellness",
//     title: "Relaxing Activities in Manali",
//     excerpt: "Calm your mind naturally.",
//     content:
//       "• River walks.\n• Yoga.\n• Hot springs.\n• Journaling.",
//     verified: false,
//     image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&w=1200"
//   },
//   {
//     id: 57,
//     city: "Manali",
//     category: "Wellness",
//     title: "Healthy Eating in Cold Weather",
//     excerpt: "Foods to keep you warm & energized.",
//     content:
//       "• Soups.\n• Herbal tea.\n• Hot meals.\n• Avoid cold drinks.",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1525059337994-6f2d8b4b1f89?auto=format&w=1200"
//   },

//   /* -----------------------------------------------------
//      MANALI — HELPLINES (3)
//   ----------------------------------------------------- */
//   {
//     id: 58,
//     city: "Manali",
//     category: "Helplines",
//     title: "Emergency Contacts in Manali",
//     excerpt: "Save these before trekking.",
//     content:
//       "100, 1091, 108",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1557234192-5b8b2cd1f55b?auto=format&w=1200"
//   },
//   {
//     id: 59,
//     city: "Manali",
//     category: "Helplines",
//     title: "Mountain Rescue Contacts",
//     excerpt: "Essential numbers in case of emergencies.",
//     content:
//       "• Himachal rescue line\n• Local police helpline\n• Trekking support teams",
//     verified: false,
//     image: "https://images.unsplash.com/photo-1580281657527-47d6b0c5a36d?auto=format&w=1200"
//   },
//   {
//     id: 60,
//     city: "Manali",
//     category: "Helplines",
//     title: "Nearest Medical Centers",
//     excerpt: "Hospitals & clinics near you.",
//     content:
//       "• Mission Hospital\n• Lady Willingdon Hospital\n• Civil Hospital Manali",
//     verified: true,
//     image: "https://images.unsplash.com/photo-1560976812-2c36dc1b8f86?auto=format&w=1200"
//   },
// ];


// export default function TravelTips() {
//   // ===== your 60-card DEMO_TIPS stays the SAME (paste above as is) =====

//   // filters & pagination
//   const [query, setQuery] = useState("");
//   const [cityFilter, setCityFilter] = useState("All");
//   const [categoryFilter, setCategoryFilter] = useState("All");
//   const [page, setPage] = useState(1);
//   const perPage = 6;

//   // modal
//   const [activeTip, setActiveTip] = useState(null);

//   // derive unique cities & categories from DEMO_TIPS
//   const cities = useMemo(() => {
//     const set = new Set(DEMO_TIPS.map((t) => t.city));
//     return ["All", ...Array.from(set)];
//   }, []);

//   const categories = useMemo(() => {
//     const set = new Set(DEMO_TIPS.map((t) => t.category));
//     return ["All", ...Array.from(set)];
//   }, []);

//   // FILTERED DATA
//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     return DEMO_TIPS.filter((t) => {
//       if (cityFilter !== "All" && t.city !== cityFilter) return false;
//       if (categoryFilter !== "All" && t.category !== categoryFilter)
//         return false;
//       if (!q) return true;
//       return (
//         t.title.toLowerCase().includes(q) ||
//         t.excerpt.toLowerCase().includes(q) ||
//         t.content.toLowerCase().includes(q)
//       );
//     });
//   }, [query, cityFilter, categoryFilter]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

//   if (page > totalPages) setPage(totalPages);

//   const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

//   const openModal = (tip) => {
//     setActiveTip(tip);
//     document.body.style.overflow = "hidden";
//   };

//   const closeModal = () => {
//     setActiveTip(null);
//     document.body.style.overflow = "";
//   };

//   return (
//     <section className="travel-tips-section">
//       <div className="tips-header">
//         <div>
//           <h2>Travel Tips & Safety Guide</h2>
//           <p className="subtitle">
//             Practical safety tips, city guides, and verified advice for solo travelers.
//           </p>
//         </div>

//         <div className="search-row">
//           <input
//             placeholder="Search tips, keywords, or city..."
//             value={query}
//             onChange={(e) => {
//               setQuery(e.target.value);
//               setPage(1);
//             }}
//             className="search-input"
//           />

//           <select
//             value={cityFilter}
//             onChange={(e) => {
//               setCityFilter(e.target.value);
//               setPage(1);
//             }}
//             className="select-filter"
//           >
//             {cities.map((c) => (
//               <option key={c} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>

//           <select
//             value={categoryFilter}
//             onChange={(e) => {
//               setCategoryFilter(e.target.value);
//               setPage(1);
//             }}
//             className="select-filter"
//           >
//             {categories.map((c) => (
//               <option key={c} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* GRID */}
//       <div className="tips-grid">
//         {pageItems.length === 0 ? (
//           <div className="no-results">No tips found — try different filters.</div>
//         ) : (
//           pageItems.map((t) => (
//             <article key={t.id} className="tip-card">
//               <div
//                 className="thumb"
//                 style={{ backgroundImage: `url(${t.image})` }}
//               >
//                 {t.verified && <span className="badge">✔ Verified</span>}
//               </div>

//               <div className="tip-body">
//                 <h3 className="tip-title">{t.title}</h3>

//                 <div className="meta">
//                   <span className="chip">{t.category}</span>
//                   <span className="chip muted">{t.city}</span>
//                 </div>

//                 <p className="excerpt">{t.excerpt}</p>

//                 <div className="card-actions">
//                   <button className="primary" onClick={() => openModal(t)}>
//                     Read More
//                   </button>
//                 </div>
//               </div>
//             </article>
//           ))
//         )}
//       </div>

//       {/* PAGINATION */}
//       <div className="tips-pagination">
//         <button
//           onClick={() => setPage((p) => Math.max(1, p - 1))}
//           disabled={page === 1}
//         >
//           ◀ Prev
//         </button>

//         <div className="pages">
//           {(() => {
//             const pages = [];
//             const maxShow = 5;
//             let start = Math.max(1, page - Math.floor(maxShow / 2));
//             let end = Math.min(totalPages, start + maxShow - 1);

//             if (end - start < maxShow - 1) {
//               start = Math.max(1, end - maxShow + 1);
//             }

//             for (let i = start; i <= end; i++) {
//               pages.push(
//                 <button
//                   key={i}
//                   className={i === page ? "page active" : "page"}
//                   onClick={() => setPage(i)}
//                 >
//                   {i}
//                 </button>
//               );
//             }
//             return pages;
//           })()}
//         </div>

//         <button
//           onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//           disabled={page === totalPages}
//         >
//           Next ▶
//         </button>
//       </div>

//       {/* MODAL */}
//       {activeTip && (
//         <div className="modal-backdrop" onClick={closeModal}>
//           <div
//             className="modal"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button className="modal-close" onClick={closeModal}>
//               ✕
//             </button>

//             <div
//               className="modal-thumb"
//               style={{ backgroundImage: `url(${activeTip.image})` }}
//             >
//               {activeTip.verified && <span className="badge">✔ Verified</span>}
//             </div>

//             <div className="modal-body">
//               <h3>{activeTip.title}</h3>

//               <div className="meta">
//                 <span className="chip">{activeTip.category}</span>
//                 <span className="chip muted">{activeTip.city}</span>
//               </div>

//               <pre className="modal-content">{activeTip.content}</pre>

//               {/* ❌ Removed Save + Download buttons */}
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }




// frontend/src/pages/TravelTips.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../styles/travel-tips.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function TravelTips() {
  const [query, setQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [page, setPage] = useState(1);
  const perPage = 6;

  const [tips, setTips] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // modal
  const [activeTip, setActiveTip] = useState(null);

  // fetch city and category lists from backend or derive from frontend static set
  // quick static list (since backend doesn't provide distinct lists endpoint)
  const cities = useMemo(() => ["All", "Goa", "Jaipur", "Delhi", "Mumbai", "Manali"], []);
  const categories = useMemo(() => ["All", "Helplines", "Wellness", "Transport", "Safety"], []);

  const fetchTips = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${API_BASE}/api/tips`, {
        params: {
          city: cityFilter,
          category: categoryFilter,
          search: query,
          page,
          limit: perPage
        }
      });

      setTips(res.data.tips || []);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Error fetching tips:", err);
      setError("Failed to load tips");
    } finally {
      setLoading(false);
    }
  };

  // fetch when filters/query/page change (debounce search for better UX)
  useEffect(() => {
    // simple debounce
    const id = setTimeout(() => {
      setPage(1); // when filters or query change we typically reset to page 1
      fetchTips();
    }, 300);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityFilter, categoryFilter, query]);

  // fetch when page changes
  useEffect(() => {
    fetchTips();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const openModal = (tip) => {
    setActiveTip(tip);
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setActiveTip(null);
    document.body.style.overflow = "";
  };

  return (
    <section className="travel-tips-section">
      <div className="tips-header">
        <div>
          <h2>Travel Tips & Safety Guide</h2>
          <p className="subtitle">
            Practical safety tips, city guides, and verified advice for solo travelers.
          </p>
        </div>

        <div className="search-row">
          <input
            placeholder="Search tips, keywords, or city..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            className="search-input"
          />

          <select
            value={cityFilter}
            onChange={(e) => {
              setCityFilter(e.target.value);
            }}
            className="select-filter"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
            }}
            className="select-filter"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* GRID */}
      <div className="tips-grid">
        {loading ? (
          <div className="no-results">Loading tips…</div>
        ) : error ? (
          <div className="no-results">{error}</div>
        ) : tips.length === 0 ? (
          <div className="no-results">No tips found — try different filters.</div>
        ) : (
          tips.map((t) => (
            <article key={t._id || t.id} className="tip-card">
              <div
                className="thumb"
                style={{ backgroundImage: `url(${t.image})` }}
              >
                {t.verified && <span className="badge">✔ Verified</span>}
              </div>

              <div className="tip-body">
                <h3 className="tip-title">{t.title}</h3>

                <div className="meta">
                  <span className="chip">{t.category}</span>
                  <span className="chip muted">{t.city}</span>
                </div>

                <p className="excerpt">{t.excerpt}</p>

                <div className="card-actions">
                  <button className="primary" onClick={() => openModal(t)}>
                    Read More
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {/* PAGINATION */}
      <div className="tips-pagination">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        >
          ◀ Prev
        </button>

        <div className="pages">
          {(() => {
            const pages = [];
            const maxShow = 5;
            let start = Math.max(1, page - Math.floor(maxShow / 2));
            let end = Math.min(totalPages, start + maxShow - 1);
            if (end - start < maxShow - 1) {
              start = Math.max(1, end - maxShow + 1);
            }
            for (let i = start; i <= end; i++) {
              pages.push(
                <button
                  key={i}
                  className={i === page ? "page active" : "page"}
                  onClick={() => setPage(i)}
                >
                  {i}
                </button>
              );
            }
            return pages;
          })()}
        </div>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || loading}
        >
          Next ▶
        </button>

        <div style={{ marginLeft: 12, alignSelf: "center", color: "#666" }}>
          {total} result{total !== 1 ? "s" : ""} • Page {page} / {totalPages}
        </div>
      </div>

      {/* MODAL */}
      {activeTip && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              ✕
            </button>

            <div className="modal-thumb" style={{ backgroundImage: `url(${activeTip.image})` }}>
              {activeTip.verified && <span className="badge">✔ Verified</span>}
            </div>

            <div className="modal-body">
              <h3>{activeTip.title}</h3>
              <div className="meta">
                <span className="chip">{activeTip.category}</span>
                <span className="chip muted">{activeTip.city}</span>
              </div>

              <pre className="modal-content">{activeTip.content}</pre>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
