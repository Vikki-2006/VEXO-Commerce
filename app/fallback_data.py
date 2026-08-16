import json
from datetime import datetime, timezone

# Showcase Fallback Categories
FALLBACK_CATEGORIES = [
    {
        "id": "fb-cat-planar-acoustics-uuid-001",
        "name": "Planar Acoustics",
        "slug": "planar-acoustics",
        "description": "Studio-grade planar magnetic audio transducers and precision noise isolation.",
        "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000",
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "_count": {"products": 2}
    },
    {
        "id": "fb-cat-master-displays-uuid-002",
        "name": "Master Displays",
        "slug": "master-displays",
        "description": "Master calibration QD-OLED displays with 99% DCI-P3 color accuracy.",
        "image": "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000",
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "_count": {"products": 2}
    },
    {
        "id": "fb-cat-haptic-keydecks-uuid-003",
        "name": "Haptic Keydecks",
        "slug": "haptic-keydecks",
        "description": "CNC 6063 aluminum gasket-mount mechanical keydecks and magnetic actuation.",
        "image": "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=1000",
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "_count": {"products": 2}
    },
    {
        "id": "fb-cat-accessories-uuid-004",
        "name": "Accessories",
        "slug": "accessories",
        "description": "Minimalist techwear carry, ballistic waterproof nylon, and anodized hardware.",
        "image": "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1000",
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "_count": {"products": 2}
    }
]

# Map categories by ID and Slug for easy lookup
CATEGORIES_BY_ID = {c["id"]: c for c in FALLBACK_CATEGORIES}
CATEGORIES_BY_SLUG = {c["slug"]: c for c in FALLBACK_CATEGORIES}

# Showcase Fallback Products
FALLBACK_PRODUCTS = [
    {
        "id": "fb-prod-soundstage-one-001",
        "title": "VEXO Soundstage One",
        "slug": "vexo-soundstage-one",
        "subtitle": "Planar magnetic acoustic drivers with hybrid active noise isolation.",
        "description": "Hand-assembled in Stockholm. Features custom 50mm beryllium composite planar transducers, 50-hour continuous battery playback, zero-loss wireless streaming, and lambskin ear cushions.",
        "price": 41999.0,
        "compareAtPrice": 45999.0,
        "stock": 30,
        "categoryId": "fb-cat-planar-acoustics-uuid-001",
        "category": CATEGORIES_BY_ID["fb-cat-planar-acoustics-uuid-001"],
        "images": [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=1200"
        ],
        "specs": {
            "Acoustic Driver": "50mm Beryllium Planar Magnetic",
            "Frequency Response": "5Hz – 45,000Hz",
            "Total Harmonic Distortion": "< 0.05% @ 1kHz",
            "Battery Endurance": "50 Hours (ANC Enabled)"
        },
        "isFeatured": True,
        "isNew": True,
        "rating": 4.95,
        "reviewsCount": 142,
        "reviews": [],
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "updatedAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "fb-prod-vision-q4-002",
        "title": "VEXO Vision Q4",
        "slug": "vexo-vision-q4",
        "subtitle": "32-inch 4K QD-OLED, 240Hz, 0.03ms GTG, 1000-nit peak HDR.",
        "description": "Engineered for colorists and designers demanding absolute visual fidelity. Boasts a passive graphite thermal dissipation plate, 90W USB-C power delivery, and factory Delta E < 1 calibration.",
        "price": 89999.0,
        "compareAtPrice": 99999.0,
        "stock": 12,
        "categoryId": "fb-cat-master-displays-uuid-002",
        "category": CATEGORIES_BY_ID["fb-cat-master-displays-uuid-002"],
        "images": [
            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&q=80&w=1200"
        ],
        "specs": {
            "Panel Technology": "32-inch Quantum Dot OLED",
            "Native Resolution": "3840 x 2160 pixels (4K UHD)",
            "Refresh Frequency": "240Hz Variable",
            "Color Spectrum": "99% DCI-P3"
        },
        "isFeatured": True,
        "isNew": True,
        "rating": 4.98,
        "reviewsCount": 88,
        "reviews": [],
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "updatedAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "fb-prod-keydeck-66-003",
        "title": "VEXO Keydeck 66",
        "slug": "vexo-keydeck-66",
        "subtitle": "Leaf-spring gasket mount, Hall Effect magnetic switches, 8000Hz polling.",
        "description": "Precision milled from a single 3.2kg block of aerospace aluminum. Features magnetic rapid-trigger switches with 0.1mm actuation customizability.",
        "price": 24999.0,
        "compareAtPrice": 28999.0,
        "stock": 45,
        "categoryId": "fb-cat-haptic-keydecks-uuid-003",
        "category": CATEGORIES_BY_ID["fb-cat-haptic-keydecks-uuid-003"],
        "images": [
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=1200"
        ],
        "specs": {
            "Chassis": "CNC Anodized 6063 Aluminum",
            "Switches": "VEXO Magnetic Hall Effect",
            "Polling Rate": "8000Hz Ultra-Low Latency",
            "Weight": "2.4 kg"
        },
        "isFeatured": True,
        "isNew": False,
        "rating": 4.90,
        "reviewsCount": 175,
        "reviews": [],
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "updatedAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "fb-prod-field-pack-004",
        "title": "VEXO Field Pack",
        "slug": "vexo-field-pack",
        "subtitle": "X-Pac VX21 waterproof fabric with Fidlock V-buckle magnetic locks.",
        "description": "Minimalist tactical carry for modern technologists. Houses up to a 16-inch laptop in a suspended shock-absorbing vault.",
        "price": 12999.0,
        "compareAtPrice": 15999.0,
        "stock": 25,
        "categoryId": "fb-cat-accessories-uuid-004",
        "category": CATEGORIES_BY_ID["fb-cat-accessories-uuid-004"],
        "images": [
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=1200"
        ],
        "specs": {
            "Volume": "25 Liters",
            "Shell Material": "Waterproof X-Pac VX21",
            "Hardware": "German Fidlock Magnetic Buckles"
        },
        "isFeatured": True,
        "isNew": True,
        "rating": 4.85,
        "reviewsCount": 64,
        "reviews": [],
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "updatedAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "fb-prod-studio-monitor-x1-005",
        "title": "VEXO Studio Monitor X1",
        "slug": "vexo-studio-monitor-x1",
        "subtitle": "Professional active ribbon planar reference audio monitors.",
        "description": "Professional grade active planar monitors with high frequency ribbon tweeters and bi-amplified class-D architecture for uncompromised acoustic response.",
        "price": 54999.0,
        "compareAtPrice": 59999.0,
        "stock": 16,
        "categoryId": "fb-cat-planar-acoustics-uuid-001",
        "category": CATEGORIES_BY_ID["fb-cat-planar-acoustics-uuid-001"],
        "images": [
            "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=1200"
        ],
        "specs": {
            "Driver Type": "Dual 6-inch Planar Transducers",
            "Amplification": "Class-D Bi-amplified 150W",
            "Frequency Range": "35Hz - 40kHz",
            "Input Ports": "Balanced XLR & TRS"
        },
        "isFeatured": True,
        "isNew": False,
        "rating": 4.97,
        "reviewsCount": 92,
        "reviews": [],
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "updatedAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "fb-prod-vision-master-32-006",
        "title": "VEXO Vision Master 32",
        "slug": "vexo-vision-master-32",
        "subtitle": "Ultimate reference grade monitor for professional video color-grading.",
        "description": "Ultimate reference grade monitor for professional video color-grading and studio mastering. Zero halo effect, extreme color consistency.",
        "price": 119999.0,
        "compareAtPrice": 129999.0,
        "stock": 8,
        "categoryId": "fb-cat-master-displays-uuid-002",
        "category": CATEGORIES_BY_ID["fb-cat-master-displays-uuid-002"],
        "images": [
            "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=1200"
        ],
        "specs": {
            "Panel": "32-inch 4K QD-OLED Reference",
            "Color Accuracy": "Delta E < 0.5",
            "Peak Brightness": "1200 nits HDR",
            "Calibration": "Hardware 3D LUT"
        },
        "isFeatured": True,
        "isNew": True,
        "rating": 4.99,
        "reviewsCount": 104,
        "reviews": [],
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "updatedAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "fb-prod-keydeck-pro-007",
        "title": "VEXO Keydeck Pro",
        "slug": "vexo-keydeck-pro",
        "subtitle": "Opto-mechanical haptic switches with active physical feedback.",
        "description": "Premium opto-mechanical switches with built-in active haptic feedback engine. Individually CNC'd brass weight and dynamic isolation mount.",
        "price": 34999.0,
        "compareAtPrice": 38999.0,
        "stock": 20,
        "categoryId": "fb-cat-haptic-keydecks-uuid-003",
        "category": CATEGORIES_BY_ID["fb-cat-haptic-keydecks-uuid-003"],
        "images": [
            "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=1200"
        ],
        "specs": {
            "Form Factor": "75% Layout",
            "Switch System": "Opto-Mechanical Haptic",
            "Housing": "Titanium-Coated Aluminum",
            "Connectivity": "Tri-Mode Wireless & Wired"
        },
        "isFeatured": True,
        "isNew": True,
        "rating": 4.93,
        "reviewsCount": 112,
        "reviews": [],
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "updatedAt": datetime.now(timezone.utc).isoformat()
    },
    {
        "id": "fb-prod-field-pack-pro-008",
        "title": "VEXO Field Pack Pro",
        "slug": "vexo-field-pack-pro",
        "subtitle": "Heavy duty expandable technical pack designed for elite travel.",
        "description": "Heavy duty expandable technical pack designed for elite travel. Equipped with internal modular packing cubes and anti-theft design.",
        "price": 18999.0,
        "compareAtPrice": 20999.0,
        "stock": 15,
        "categoryId": "fb-cat-accessories-uuid-004",
        "category": CATEGORIES_BY_ID["fb-cat-accessories-uuid-004"],
        "images": [
            "https://images.unsplash.com/photo-1575844894106-928ab7f8a9aa?auto=format&fit=crop&q=80&w=1200"
        ],
        "specs": {
            "Capacity": "30L Expandable",
            "Exterior": "1680D Ballistic Cordura",
            "Pockets": "Magnetic Quick-Access Pockets"
        },
        "isFeatured": True,
        "isNew": False,
        "rating": 4.88,
        "reviewsCount": 78,
        "reviews": [],
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "updatedAt": datetime.now(timezone.utc).isoformat()
    }
]

def get_fallback_products_filtered(
    search=None,
    category=None,
    minPrice=None,
    maxPrice=None,
    rating=None,
    sort="featured",
    page=1,
    limit=12
):
    prods = list(FALLBACK_PRODUCTS)
    
    if search:
        s = search.lower()
        prods = [p for p in prods if s in p["title"].lower() or s in p["description"].lower() or s in p.get("subtitle", "").lower()]
        
    if category:
        prods = [p for p in prods if p["category"]["slug"] == category]
        
    if minPrice is not None:
        prods = [p for p in prods if p["price"] >= minPrice]
        
    if maxPrice is not None:
        prods = [p for p in prods if p["price"] <= maxPrice]
        
    if rating is not None:
        prods = [p for p in prods if p["rating"] >= rating]
        
    if sort == "price-asc":
        prods.sort(key=lambda x: x["price"])
    elif sort == "price-desc":
        prods.sort(key=lambda x: x["price"], reverse=True)
    elif sort == "rating":
        prods.sort(key=lambda x: x["rating"], reverse=True)
    elif sort == "featured":
        # Featured products first, then newest
        prods.sort(key=lambda x: (not x.get("isFeatured", False), x.get("createdAt", "")), reverse=True)
    else:
        # Default sort by newest
        prods.sort(key=lambda x: x.get("createdAt", ""), reverse=True)
        
    total = len(prods)
    skip = (page - 1) * limit
    sliced = prods[skip:skip + limit]
    
    return sliced, total

