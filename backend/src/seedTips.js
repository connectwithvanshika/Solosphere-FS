// backend/src/seedTips.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Tip from "./models/Tip.js";
dotenv.config();

const DEMO_TIPS = [
  /* -----------------------------------------------------
     GOA — SAFETY (3 CARDS)
  ----------------------------------------------------- */
  {
    id: 1,
    city: "Goa",
    category: "Safety",
    title: "Staying Safe at Goa Beaches",
    excerpt: "Essential rules for safe solo beach travel.",
    content:
      "• Avoid isolated beaches after 7 PM.\n• Keep valuables in waterproof pouch.\n• Use verified beach shacks only.\n• Avoid accepting drinks from strangers.",
    verified: true,
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2c/b0/c2/4f/private-beach-hotels.jpg?w=1200&h=-1&s=1"
  },
  {
    id: 2,
    city: "Goa",
    category: "Safety",
    title: "Nightlife Safety Tips in Goa",
    excerpt: "How to enjoy nightlife safely as a solo traveler.",
    content:
      "• Prefer clubs with security.\n• Keep your drink in sight.\n• Use official cabs.\n• Stay in women-friendly hostels.",
    verified: false,
    image: "https://www.indianholiday.uk/blog/wp-content/uploads/2012/05/Leela-Kempinski-Goa-beach-dining-night.jpg"
  },
  {
    id: 3,
    city: "Goa",
    category: "Safety",
    title: "Safe Beach Sports in Goa",
    excerpt: "Water-sport safety do’s & don’ts.",
    content:
      "• Avoid unregistered operators.\n• Check equipment quality.\n• Wear proper safety jackets.\n• Confirm pricing beforehand.",
    verified: true,
    image: "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&w=1200"
  },

  /* -----------------------------------------------------
     GOA — TRANSPORT (3 CARDS)
  ----------------------------------------------------- */
  {
    id: 4,
    city: "Goa",
    category: "Transport",
    title: "Safe Scooter Rentals in Goa",
    excerpt: "How to rent scooters without scams.",
    content:
      "• Check vehicle documents.\n• Avoid deposits without receipts.\n• Take photos of scratches.\n• Wear helmet at all times.",
    verified: true,
    image: "https://nomadgao.com/wp-content/uploads/2023/11/Renting-a-bike-Goa-1.jpg"
  },
  {
    id: 5,
    city: "Goa",
    category: "Transport",
    title: "Late-Night Transport Options",
    excerpt: "Best late-night transport for women.",
    content:
      "• Use GoaMiles.\n• Avoid strangers offering rides.\n• Share location with friend.\n• Stay near lit roads.",
    verified: true,
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&w=1200"
  },
  {
    id: 6,
    city: "Goa",
    category: "Transport",
    title: "Public Transport Tips in Goa",
    excerpt: "How to safely use buses & ferries.",
    content:
      "• Prefer day-time travel.\n• Keep your bag in front.\n• Confirm ferry timings.\n• Avoid overcrowded buses.",
    verified: false,
    image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&w=1200"
  },

  /* -----------------------------------------------------
     GOA — WELLNESS (3 CARDS)
  ----------------------------------------------------- */
  {
    id: 7,
    city: "Goa",
    category: "Wellness",
    title: "Beach Yoga Tips",
    excerpt: "Relaxation routines while staying safe.",
    content:
      "• Morning yoga is safest.\n• Avoid secluded areas.\n• Hydrate well.\n• Use SPF.",
    verified: false,
    image: "https://images.unsplash.com/photo-1646166624936-d93c08117e02?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGJlYWNoJTIweW9nYXxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 8,
    city: "Goa",
    category: "Wellness",
    title: "Mental Refresh Guide for Solo Travelers",
    excerpt: "How to balance fun and mental calm.",
    content:
      "• Take digital detox breaks.\n• Journal your experiences.\n• Avoid over-scheduling.\n• Spend time in nature.",
    verified: true,
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&w=1200"
  },
  {
    id: 9,
    city: "Goa",
    category: "Wellness",
    title: "Healthy Eating in Coastal Areas",
    excerpt: "How to eat well while traveling alone.",
    content:
      "• Prefer fresh-cooked food.\n• Avoid cut fruits.\n• Hydrate enough.\n• Carry ORS packets.",
    verified: false,
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&w=1200"
  },

  /* -----------------------------------------------------
     GOA — HELPLINES (3 CARDS)
  ----------------------------------------------------- */
  {
    id: 10,
    city: "Goa",
    category: "Helplines",
    title: "Goa Emergency Contacts",
    excerpt: "Save these numbers before your trip.",
    content:
      "• Police: 100\n• Women helpline: 1091\n• Ambulance: 108\n• Tourist helpline: 1364",
    verified: true,
    image: "https://media.istockphoto.com/id/177268589/photo/emergency-contact-information.jpg?s=612x612&w=0&k=20&c=JDWcQcmRGeGPtWh0G6LeNDCjmMVA_UAP-OJZH3joftU="
  },
  {
    id: 11,
    city: "Goa",
    category: "Helplines",
    title: "Important Hospital Contacts",
    excerpt: "Nearest hospitals & emergency care units.",
    content:
      "• GMC Hospital\n• Manipal Hospital\n• Apollo Clinic\n• Lifeline Ambulance",
    verified: false,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIrPMLvgVjTX8FJQDGk2PvDsK1q7l7Xq_FBQ&s"
  },
  {
    id: 12,
    city: "Goa",
    category: "Helplines",
    title: "Women Safety Resources in Goa",
    excerpt: "Emergency support for solo women.",
    content:
      "• Women’s safety app: HawkEye\n• 24×7 help desk at police station\n• Pink Patrol Units",
    verified: true,
    image: "https://expressinnindia.com/wp-content/uploads/2024/07/Freesia-God-23.jpg"
  },

  /* -----------------------------------------------------
     REPEAT EXACT SAME PATTERN FOR:
     JAIPUR (13–24)
     DELHI (25–36)
     MUMBAI (37–48)
     MANALI (49–60)
  ----------------------------------------------------- */

  /* -----------------------------------------------------
     JAIPUR — SAFETY (3)
  ----------------------------------------------------- */
  {
    id: 13,
    city: "Jaipur",
    category: "Safety",
    title: "Staying Safe in Jaipur’s Pink City",
    excerpt: "Best safety practices for solo women.",
    content:
      "• Avoid dark alleys.\n• Stay in trusted hostels.\n• Use prepaid autos.\n• Beware of fake guides.",
    verified: true,
    image: "https://chokhidhani.com/ethnic-resort-jaipur/wp-content/uploads/2025/04/Cottage-1024x683-1.jpg"
  },
  {
    id: 14,
    city: "Jaipur",
    category: "Safety",
    title: "Market Safety Tips",
    excerpt: "Crowded bazaars need extra awareness.",
    content:
      "• Keep bag in front.\n• Avoid showing cash.\n• Don’t accept food samples.",
    verified: false,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/UNESCO_WORLD_HERITAGE_CENTRE-JAIPUR_CITY-RAJASTHAN-01-.jpg/1200px-UNESCO_WORLD_HERITAGE_CENTRE-JAIPUR_CITY-RAJASTHAN-01-.jpg"
  },
  {
    id: 15,
    city: "Jaipur",
    category: "Safety",
    title: "Fort Safety for Solo Travelers",
    excerpt: "How to explore forts safely.",
    content:
      "• Visit before 5 PM.\n• Carry water.\n• Stay near crowds.\n• Avoid isolated towers.",
    verified: true,
    image: "https://media.istockphoto.com/id/2185570022/photo/aerial-view-from-jaigarh-fort-at-sunset-india-rajasthan-jaipur.jpg?s=612x612&w=0&k=20&c=JkYydaB4JpXzHOsOOe8z0ANGHY10HqIPMpxwsnG-jAo="
  },

  /* -----------------------------------------------------
     JAIPUR — TRANSPORT (3)
  ----------------------------------------------------- */
  {
    id: 16,
    city: "Jaipur",
    category: "Transport",
    title: "Safe Auto Travel in Jaipur",
    excerpt: "Avoid scams & ride safely.",
    content:
      "• Prefer Ola/Uber autos.\n• Avoid ‘broken meter’ taxis.\n• Don’t share rides with strangers.",
    verified: true,
    image: "https://images.stockcake.com/public/3/5/f/35fadf1b-32c5-4976-acec-5ee98b702a78_large/colorful-auto-rickshaw-stockcake.jpg"
  },
  {
    id: 17,
    city: "Jaipur",
    category: "Transport",
    title: "Public Bus Safety",
    excerpt: "Best routes & safest timings.",
    content:
      "• Prefer day buses.\n• Avoid overcrowded rides.\n• Sit near women passengers.",
    verified: false,
    image: "https://www.greenpeace.org/static/planet4-india-stateless/2022/10/19c9fe3f-7-1024x678.jpg"
  },
  {
    id: 18,
    city: "Jaipur",
    category: "Transport",
    title: "Night Travel Precautions",
    excerpt: "Extra caution for late-night commute.",
    content:
      "• Avoid unlit areas.\n• Share live location.\n• Book cabs only through apps.",
    verified: true,
    image: "https://images.pexels.com/photos/20654900/pexels-photo-20654900.jpeg?cs=srgb&dl=pexels-taylor-hunt-605291-20654900.jpg&fm=jpg"
  },

  /* -----------------------------------------------------
     JAIPUR — WELLNESS (3)
  ----------------------------------------------------- */
  {
    id: 19,
    city: "Jaipur",
    category: "Wellness",
    title: "Heat Wellness Tips",
    excerpt: "Stay healthy in Rajasthan heat.",
    content:
      "• Drink ORS.\n• Wear cotton.\n• Avoid noon outdoor time.\n• Carry hat.",
    verified: true,
    image: "https://media.istockphoto.com/id/1496615469/photo/serene-latin-woman-enjoy-sunset-with-gratitude.jpg?s=612x612&w=0&k=20&c=LXeGeLgKznGamU25tLajijCVuV5lxWIZH0RW5qN3k5g="
  },
  {
    id: 20,
    city: "Jaipur",
    category: "Wellness",
    title: "Mental Refresh in Historic Places",
    excerpt: "Calm activities for long sightseeing days.",
    content:
      "• Take breaks.\n• Journal thoughts.\n• Sit near gardens.",
    verified: false,
    image: "https://img1.wsimg.com/isteam/stock/QpqKmw3/:/cr=t:0%25,l:0%25,w:100%25,h:100%25/rs=h:1000,cg:true"
  },
  {
    id: 21,
    city: "Jaipur",
    category: "Wellness",
    title: "Healthy Eating in Jaipur",
    excerpt: "Avoid stomach issues on spicy food trips.",
    content:
      "• Avoid uncooked salads.\n• Prefer fresh meals.\n• Drink bottled water.",
    verified: true,
    image: "https://www.fabhotels.com/blog/wp-content/uploads/2018/08/600x400-17.jpg"
  },

  /* -----------------------------------------------------
     JAIPUR — HELPLINES (3)
  ----------------------------------------------------- */
  {
    id: 22,
    city: "Jaipur",
    category: "Helplines",
    title: "Important Jaipur Helplines",
    excerpt: "Save these before your trip.",
    content: "Police 100, Women 1091, Ambulance 108",
    verified: true,
    image: "https://images.unsplash.com/photo-1557234192-5b8b2cd1f55b?auto=format&w=1200"
  },
  {
    id: 23,
    city: "Jaipur",
    category: "Helplines",
    title: "Tourist Helpdesk Numbers",
    excerpt: "Assistance for lost items, directions & safety.",
    content:
      "• Tourism helpline 1364\n• Pink Patrol\n• Local police desks",
    verified: false,
    image: "https://images.unsplash.com/photo-1580281657527-47d6b0c5a36d?auto=format&w=1200"
  },
  {
    id: 24,
    city: "Jaipur",
    category: "Helplines",
    title: "Nearest Hospitals in Jaipur",
    excerpt: "Emergency medical locations.",
    content:
      "• Fortis\n• SMS Hospital\n• Manipal Hospital",
    verified: true,
    image: "https://images.unsplash.com/photo-1560976812-2c36dc1b8f86?auto=format&w=1200"
  },

  /* -----------------------------------------------------
     DELHI — SAFETY (3)
  ----------------------------------------------------- */
  {
    id: 25,
    city: "Delhi",
    category: "Safety",
    title: "Safety Tips for Delhi Markets",
    excerpt: "Stay alert in busy areas.",
    content:
      "• Avoid sling bags.\n• Don’t show cash.\n• Keep zips closed.",
    verified: true,
    image: "https://www.constructionweekonline.in/cloud/2021/11/25/SDvMlSy7-Delhi-Meerut-Expressway-5.jpg"
  },
  {
    id: 26,
    city: "Delhi",
    category: "Safety",
    title: "Metro Station Safety",
    excerpt: "Metro is safe—but follow precautions.",
    content:
      "• Stay in women coaches.\n• Avoid last train.\n• Keep backpack in front.",
    verified: false,
    image: "https://img.staticmb.com/mbcontent/images/crop/uploads/2024/7/Delhi-Metro_0_1200.jpg.webp"
  },
  {
    id: 27,
    city: "Delhi",
    category: "Safety",
    title: "Night Travel Safety in Delhi",
    excerpt: "Travel safely after 9 PM.",
    content:
      "• Use ShareTrip.\n• Verify driver name.\n• Avoid dark lanes.",
    verified: true,
    image: "https://media1.thrillophilia.com/filestore/nmkv2yriwascb0uszhk8uyskkzwx_Downpic.cc-image339280305.jpg"
  },

  /* -----------------------------------------------------
     DELHI — TRANSPORT (3)
  ----------------------------------------------------- */
  {
    id: 28,
    city: "Delhi",
    category: "Transport",
    title: "Best Solo Transport Options",
    excerpt: "Safe ways to commute in Delhi.",
    content:
      "• Ola/Uber.\n• Metro.\n• E-Rickshaw in crowds.\n• Avoid unauthorized autos.",
    verified: true,
    image: "https://questionofcities.org/wp-content/uploads/2024/02/Delhi-metro-is-unaffordable-for-49-percent-of-its-households.jpg"
  },
  {
    id: 29,
    city: "Delhi",
    category: "Transport",
    title: "Airport to City Transport Guide",
    excerpt: "Safest options after landing.",
    content:
      "• Airport metro.\n• Meru cabs.\n• Avoid unofficial taxis.",
    verified: false,
    image: "https://cdn.zeebiz.com/sites/default/files/2023/08/22/257263-dubai-airport.jpg"
  },
  {
    id: 30,
    city: "Delhi",
    category: "Transport",
    title: "Metro Etiquette & Safety",
    excerpt: "For smooth & safe travel.",
    content:
      "• Avoid rush hour.\n• Stay aware.\n• Keep phone secure.",
    verified: true,
    image: "https://img.etimg.com/thumb/msid-25824204,width-480,height-360,imgsize-82218,resizemode-75/each-rake-has-three-cars.jpg"
  },

  /* -----------------------------------------------------
     DELHI — WELLNESS (3)
  ----------------------------------------------------- */
  {
    id: 31,
    city: "Delhi",
    category: "Wellness",
    title: "Staying Calm in Busy Delhi",
    excerpt: "Mindfulness for chaotic days.",
    content:
      "• Deep breathing.\n• Drink water.\n• Take small breaks.",
    verified: false,
    image: "https://www.nextwavetherapy.com.au/wp-content/uploads/2020/09/relaxZoeblog.jpg"
  },
  {
    id: 32,
    city: "Delhi",
    category: "Wellness",
    title: "Healthy Eating for Travelers",
    excerpt: "Avoid stomach issues.",
    content:
      "• Avoid street cut fruits.\n• Drink bottled water.\n• Prefer cooked meals.",
    verified: true,
    image: "https://sofresh.com/wp-content/uploads/2021/10/healthy-food-and-a-healthy-mind-1024x683.jpg"
  },
  {
    id: 33,
    city: "Delhi",
    category: "Wellness",
    title: "Green Spots for Mental Refresh",
    excerpt: "Relaxing places in Delhi.",
    content:
      "• Lodhi Garden.\n• Deer Park.\n• Garden of Five Senses.",
    verified: false,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Halleyparknovember_b.jpg/1200px-Halleyparknovember_b.jpg"
  },

  /* -----------------------------------------------------
     DELHI — HELPLINES (3)
  ----------------------------------------------------- */
  {
    id: 34,
    city: "Delhi",
    category: "Helplines",
    title: "Delhi Emergency Numbers",
    excerpt: "Save these before visiting.",
    content:
      "Police 100\nWomen 1091\nAmbulance 108",
    verified: true,
    image: "https://i.pinimg.com/736x/a1/46/37/a146373b8ca11ad391d10804e573b468.jpg"
  },
  {
    id: 35,
    city: "Delhi",
    category: "Helplines",
    title: "Tourist Helplines",
    excerpt: "Support for travelers.",
    content:
      "• 1364 tourism helpline\n• Metro security helpline",
    verified: false,
    image: "https://thumbs.dreamstime.com/b/tourist-backpacker-paris-travel-europe-france-113677314.jpg"
  },
  {
    id: 36,
    city: "Delhi",
    category: "Helplines",
    title: "Nearest Hospitals",
    excerpt: "Important medical centers.",
    content:
      "• AIIMS\n• Apollo\n• Max Hospital",
    verified: true,
    image: "https://housing.com/news/wp-content/uploads/2023/08/Hospital.jpg"
  },

  /* -----------------------------------------------------
     MUMBAI — SAFETY (3)
  ----------------------------------------------------- */
  {
    id: 37,
    city: "Mumbai",
    category: "Safety",
    title: "Is Mumbai Safe for Solo Women?",
    excerpt: "A safety overview.",
    content:
      "• Very safe in tourist zones.\n• Nightlife areas crowded.\n• Avoid isolated beaches.",
    verified: true,
    image: "https://img.freepik.com/free-photo/mumbai-skyline-seen-from-marine-drive-south-mumbai_469504-11.jpg?semt=ais_hybrid&w=740&q=80"
  },
  {
    id: 38,
    city: "Mumbai",
    category: "Safety",
    title: "Crowded Train Safety Tips",
    excerpt: "Travel stress-free in peak hours.",
    content:
      "• Use women’s coach.\n• Avoid rush hour.\n• Keep phone secure.",
    verified: false,
    image: "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202510/vande-bharat-express--fast-train-on-slow-track-242112698-16x9_0.jpg?VersionId=rH.MAcbqEsbVK5WzT9wgweYlb_L3Bq7M?size=1280:720"
  },
  {
    id: 39,
    city: "Mumbai",
    category: "Safety",
    title: "Beach Safety in Mumbai",
    excerpt: "Monsoon precautions.",
    content:
      "• Avoid high tides.\n• Don’t enter rough water.\n• Stay near guards.",
    verified: true,
    image: "https://img.freepik.com/free-photo/people-surfing-brazil_23-2151079372.jpg?semt=ais_hybrid&w=740&q=80"
  },

  /* -----------------------------------------------------
     MUMBAI — TRANSPORT (3)
  ----------------------------------------------------- */
  {
    id: 40,
    city: "Mumbai",
    category: "Transport",
    title: "Best Solo Transport Options",
    excerpt: "Safe ways to get around.",
    content:
      "• Local trains.\n• BEST buses.\n• Verified Uber drivers.",
    verified: true,
    image: "https://cdn.britannica.com/72/239572-050-F878B4FD/Uber-driver-holds-smartphone-in-car.jpg"
  },
  {
    id: 41,
    city: "Mumbai",
    category: "Transport",
    title: "Auto Safety Guide",
    excerpt: "Avoid bargaining issues.",
    content:
      "• Insist on meter.\n• Avoid auto at night.\n• Use app-based rides.",
    verified: false,
    image: "https://assets.cntraveller.in/photos/67060b030871a221e9f6bd88/3:2/w_5004,h_3336,c_limit/GettyImages-520120864.jpg"
  },
  {
    id: 42,
    city: "Mumbai",
    category: "Transport",
    title: "Night Transport Guide",
    excerpt: "Safest options for late hours.",
    content:
      "• Meru cabs.\n• Share-ride.\n• Stay in lit areas.",
    verified: true,
    image: "https://i0.wp.com/www.tusktravel.com/blog/wp-content/uploads/2020/04/Mumbai-Marine-Drive.jpg?fit=1024%2C685&ssl=1"
  },

  /* -----------------------------------------------------
     MUMBAI — WELLNESS (3)
  ----------------------------------------------------- */
  {
    id: 43,
    city: "Mumbai",
    category: "Wellness",
    title: "Stress-Free Travel in Mumbai",
    excerpt: "Relax in chaotic environments.",
    content:
      "• Visit Marine Drive.\n• Practice breathing.\n• Stay hydrated.",
    verified: true,
    image: "https://cdn.britannica.com/26/84526-050-45452C37/Gateway-monument-India-entrance-Mumbai-Harbour-coast.jpg"
  },
  {
    id: 44,
    city: "Mumbai",
    category: "Wellness",
    title: "Healthy Eating for Long Trips",
    excerpt: "Stay energized while exploring.",
    content:
      "• Avoid oily food.\n• Prefer coconut water.\n• Carry fruits.",
    verified: false,
    image: "https://c.ndtvimg.com/k03tb2a_healthy-food_625x300_17_August_18.jpg?im=FaceCrop,algorithm=dnn,width=1200,height=886"
  },
  {
    id: 45,
    city: "Mumbai",
    category: "Wellness",
    title: "Mental Calm Spots in Mumbai",
    excerpt: "Quiet places to relax.",
    content:
      "• Bandstand mornings.\n• Powai Lake.\n• City parks.",
    verified: true,
    image: "https://fruitbasket.limepack.com/blog/wp-content/uploads/2024/03/modern-cafe-house.jpg"
  },

  /* -----------------------------------------------------
     MUMBAI — HELPLINES (3)
  ----------------------------------------------------- */
  {
    id: 46,
    city: "Mumbai",
    category: "Helplines",
    title: "Emergency Contacts for Travelers",
    excerpt: "Important helplines in Mumbai.",
    content: "100, 1091, 108",
    verified: true,
    image: "https://cdn.vectorstock.com/i/500p/35/76/emergency-call-hotline-icon-vector-43243576.jpg"
  },
  {
    id: 47,
    city: "Mumbai",
    category: "Helplines",
    title: "Tourist Helpdesk",
    excerpt: "Useful contacts for assistance.",
    content:
      "• Mumbai tourism helpline\n• Women's safety desk",
    verified: true,
    image: "https://www.torontosom.ca/wp-content/uploads/2022/04/the-difference-between-international-and-domestic-tourism.jpg"
  },
  {
    id: 48,
    city: "Mumbai",
    category: "Helplines",
    title: "Hospitals & Clinics Nearby",
    excerpt: "Emergency healthcare information.",
    content:
      "• Hinduja\n• Breach Candy\n• Fortis",
    verified: false,
    image: "https://i0.wp.com/post.healthline.com/wp-content/uploads/2020/09/Female_Doctor_Daughter_Mother_1296x728-header-1296x729.jpg?w=1155&h=2268"
  },

  /* -----------------------------------------------------
     MANALI — SAFETY (3)
  ----------------------------------------------------- */
  {
    id: 49,
    city: "Manali",
    category: "Safety",
    title: "Mountain Trek Safety Tips",
    excerpt: "Stay safe while trekking solo.",
    content:
      "• Inform your host.\n• Avoid snow paths alone.\n• Carry headlamp.",
    verified: true,
    image: "https://himalayanoutback.com/wp-content/uploads/2022/05/Top-10-Mountain-Trekking-in-India.png"
  },
  {
    id: 50,
    city: "Manali",
    category: "Safety",
    title: "Safe Local Commute in Manali",
    excerpt: "Avoid risky transport options.",
    content:
      "• Avoid shared jeeps at night.\n• Prefer official cabs.",
    verified: false,
    image: "https://chariot-electricbus.com/wp-content/uploads/2021/01/Electricbuses-in-Europe_2019.jpg"
  },
  {
    id: 51,
    city: "Manali",
    category: "Safety",
    title: "Snow Safety Tips",
    excerpt: "Traveling during snow season.",
    content:
      "• Wear boots.\n• Carry warmers.\n• Avoid slippery slopes.",
    verified: true,
    image: "https://s3.india.com/wp-content/uploads/2024/12/Manali-And-Shimla-Buried-In-Snow-4-Lives-Lost-And-Roads-Closed.jpg"
  },

  /* -----------------------------------------------------
     MANALI — TRANSPORT (3)
  ----------------------------------------------------- */
  {
    id: 52,
    city: "Manali",
    category: "Transport",
    title: "Best Transport Options in Manali",
    excerpt: "Safest ways to explore the mountains.",
    content:
      "• HRTC buses.\n• Verified cab drivers.\n• Avoid hitchhiking.",
    verified: true,
    image: "https://manalitourism.co.in/images/places-to-visit/headers/old-manali-snow-point-header-manali-tourism.jpg.jpg"
  },
  {
    id: 53,
    city: "Manali",
    category: "Transport",
    title: "Trekking Route Transport Guide",
    excerpt: "How to reach major trekking points safely.",
    content:
      "• Pre-book jeeps.\n• Avoid late-night travel.\n• Carry backup power.",
    verified: false,
    image: "https://3.imimg.com/data3/RN/KH/MY-11389437/treking-tours-500x500.jpg"
  },
  {
    id: 54,
    city: "Manali",
    category: "Transport",
    title: "Transport Safety in Snow",
    excerpt: "Winter transit tips.",
    content:
      "• Use snow chains.\n• Avoid bikes.\n• Use official taxis.",
    verified: true,
    image: "https://www.kullumanalitrips.com/images/manali-tour-package-by-volvo-bus-004.jpg"
  },

  /* -----------------------------------------------------
     MANALI — WELLNESS (3)
  ----------------------------------------------------- */
  {
    id: 55,
    city: "Manali",
    category: "Wellness",
    title: "Altitude Wellness Tips",
    excerpt: "Avoid altitude sickness.",
    content:
      "• Hydrate more.\n• Avoid alcohol.\n• Take breaks.",
    verified: true,
    image: "https://media.istockphoto.com/id/1496660180/photo/the-sissu-valley.jpg?s=612x612&w=0&k=20&c=eYg4cuYIQTZUuNa6x19ZBQI-xm-tV-t8h6MecSlYQRE="
  },
  {
    id: 56,
    city: "Manali",
    category: "Wellness",
    title: "Relaxing Activities in Manali",
    excerpt: "Calm your mind naturally.",
    content:
      "• River walks.\n• Yoga.\n• Hot springs.\n• Journaling.",
    verified: false,
    image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/b2/79/37/solang-valley-manali.jpg?w=900&h=500&s=1"
  },
  {
    id: 57,
    city: "Manali",
    category: "Wellness",
    title: "Healthy Eating in Cold Weather",
    excerpt: "Foods to keep you warm & energized.",
    content:
      "• Soups.\n• Herbal tea.\n• Hot meals.\n• Avoid cold drinks.",
    verified: true,
    image: "https://www.somansleisuretours.com/_next/image?url=https%3A%2F%2Fdashboard.somansleisuretours.com%2Fuploads%2Fwmremove_transformed_2_155577614f.webp&w=2048&q=100"
  },

  /* -----------------------------------------------------
     MANALI — HELPLINES (3)
  ----------------------------------------------------- */
  {
    id: 58,
    city: "Manali",
    category: "Helplines",
    title: "Emergency Contacts in Manali",
    excerpt: "Save these before trekking.",
    content:
      "100, 1091, 108",
    verified: true,
    image: "https://madtrek.com/wp-content/uploads/2024/08/Benefits-of-treking-img.webp"
  },
  {
    id: 59,
    city: "Manali",
    category: "Helplines",
    title: "Mountain Rescue Contacts",
    excerpt: "Essential numbers in case of emergencies.",
    content:
      "• Himachal rescue line\n• Local police helpline\n• Trekking support teams",
    verified: false,
    image: "https://d26dp53kz39178.cloudfront.net/media/uploads/products/1_2_6WREnEw.jpg"
  },
  {
    id: 60,
    city: "Manali",
    category: "Helplines",
    title: "Nearest Medical Centers",
    excerpt: "Hospitals & clinics near you.",
    content:
      "• Mission Hospital\n• Lady Willingdon Hospital\n• Civil Hospital Manali",
    verified: true,
    image: "https://palmmedicalcenters.com/wp-content/uploads/2022/12/iStock-493216309-1024x683.jpg"
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Connected to MongoDB. Seeding tips...");

    // Optional: remove only the seeded tips to avoid duplicates
    // await Tip.deleteMany({}); // CAREFUL: will wipe existing tips

    // Insert but avoid duplicates: insertMany with ordered:false
    const result = await Tip.insertMany(DEMO_TIPS, { ordered: false });
    console.log(`Inserted ${result.length} tips`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
