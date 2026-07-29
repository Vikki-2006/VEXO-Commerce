import json
from datetime import datetime, timezone, timedelta
from app.database import engine, SessionLocal, Base
from app.models import User, Address, Category, Product, Review, Coupon
from app.middleware.auth import hash_password

def seed_db():
    print("[SEED] Starting database seed for VEXO Systems (FastAPI + SQLAlchemy)...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 1. Create Users
        admin = User(
            email="admin@vexo.systems",
            name="Julian Vance",
            password=hash_password("admin123"),
            role="ADMIN",
            avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
        )

        customer = User(
            email="user@vexo.systems",
            name="Astrid Lindqvist",
            password=hash_password("user123"),
            role="USER",
            avatar="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400"
        )
        db.add(admin)
        db.add(customer)
        db.commit()
        db.refresh(customer)

        # Shipping Address for Customer
        addr = Address(
            userId=customer.id,
            type="SHIPPING",
            street="Strandvägen 45",
            city="Stockholm",
            state="ST",
            zipCode="114 56",
            country="Sweden",
            isDefault=True
        )
        db.add(addr)

        # 2. Categories
        cat_audio = Category(
            name="Acoustic Architecture",
            slug="acoustic-architecture",
            description="Studio-grade planar magnetic audio transducers and precision noise isolation.",
            image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000"
        )
        cat_display = Category(
            name="Visual Displays",
            slug="visual-displays",
            description="Master calibration QD-OLED displays with 99% DCI-P3 color accuracy.",
            image="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1000"
        )
        cat_keyboard = Category(
            name="Tactile Inputs",
            slug="tactile-inputs",
            description="CNC 6063 aluminum gasket-mount mechanical keydecks and magnetic actuation.",
            image="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=1000"
        )
        cat_apparel = Category(
            name="Carry & Apparel",
            slug="carry-apparel",
            description="Minimalist techwear carry, ballistic waterproof nylon, and anodized hardware.",
            image="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1000"
        )
        cat_power = Category(
            name="Power & Infrastructure",
            slug="power-infrastructure",
            description="Gallium Nitride III power stations and precision desk architectural pads.",
            image="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1000"
        )

        db.add_all([cat_audio, cat_display, cat_keyboard, cat_apparel, cat_power])
        db.commit()
        db.refresh(cat_audio)
        db.refresh(cat_display)
        db.refresh(cat_keyboard)
        db.refresh(cat_apparel)
        db.refresh(cat_power)

        # 3. Flagship Products
        products = [
            Product(
                title="VEXO Soundstage One Headphones",
                slug="vexo-soundstage-one",
                subtitle="Planar magnetic acoustic drivers with hybrid active noise isolation.",
                description="Hand-assembled in Stockholm. Features custom 50mm beryllium composite planar transducers, 50-hour continuous battery playback, zero-loss wireless streaming, and lambskin ear cushions.",
                price=41999.0,
                compareAtPrice=45999.0,
                stock=30,
                categoryId=cat_audio.id,
                images=json.dumps([
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200",
                    "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=1200",
                    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=1200",
                ]),
                specs=json.dumps({
                    "Acoustic Driver": "50mm Beryllium Planar Magnetic",
                    "Frequency Response": "5Hz – 45,000Hz",
                    "Total Harmonic Distortion": "< 0.05% @ 1kHz",
                    "Battery Endurance": "50 Hours (ANC Enabled)",
                    "Frame Construction": "Anodized 6063 Aluminum",
                }),
                isFeatured=True,
                isNew=True,
                rating=4.95,
                reviewsCount=142
            ),
            Product(
                title="VEXO Vision 32 Master Monitor",
                slug="vexo-vision-32-master",
                subtitle="32-inch 4K QD-OLED, 240Hz, 0.03ms GTG, 1000-nit peak HDR.",
                description="Engineered for colorists and designers demanding absolute visual fidelity. Boasts a passive graphite thermal dissipation plate, 90W USB-C power delivery, and factory Delta E < 1 calibration.",
                price=124999.0,
                compareAtPrice=139999.0,
                stock=12,
                categoryId=cat_display.id,
                images=json.dumps([
                    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=1200",
                    "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&q=80&w=1200",
                ]),
                specs=json.dumps({
                    "Panel Technology": "32-inch Quantum Dot OLED",
                    "Native Resolution": "3840 x 2160 pixels (4K UHD)",
                    "Refresh Frequency": "240Hz Variable",
                    "Color Spectrum": "99% DCI-P3, 10-bit Native",
                    "Enclosure": "Solid CNC Aluminum Unibody",
                }),
                isFeatured=True,
                isNew=True,
                rating=4.98,
                reviewsCount=88
            ),
            Product(
                title="VEXO Haptic Gasket Keydeck",
                slug="vexo-haptic-gasket-keydeck",
                subtitle="Leaf-spring gasket mount, Hall Effect magnetic switches, 8000Hz polling.",
                description="Precision milled from a single 3.2kg block of aerospace aluminum. Features magnetic rapid-trigger switches with 0.1mm actuation customizability.",
                price=24999.0,
                compareAtPrice=28999.0,
                stock=45,
                categoryId=cat_keyboard.id,
                images=json.dumps([
                    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=1200",
                    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=1200",
                ]),
                specs=json.dumps({
                    "Chassis": "CNC Anodized 6063 Aluminum",
                    "Switches": "VEXO Magnetic Hall Effect",
                    "Polling Rate": "8000Hz Ultra-Low Latency",
                    "Weight": "2.4 kg (Solid)",
                }),
                isFeatured=True,
                isNew=False,
                rating=4.90,
                reviewsCount=175
            ),
            Product(
                title="VEXO Field Pack 25L",
                slug="vexo-field-pack-25l",
                subtitle="X-Pac VX21 waterproof fabric with Fidlock V-buckle magnetic locks.",
                description="Minimalist tactical carry for modern technologists. Houses up to a 16-inch laptop in a suspended shock-absorbing vault.",
                price=18999.0,
                compareAtPrice=21999.0,
                stock=25,
                categoryId=cat_apparel.id,
                images=json.dumps([
                    "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1200",
                    "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=1200",
                ]),
                specs=json.dumps({
                    "Volume": "25 Liters",
                    "Shell Material": "Waterproof X-Pac VX21",
                    "Hardware": "German Fidlock Magnetic Buckles",
                }),
                isFeatured=False,
                isNew=True,
                rating=4.85,
                reviewsCount=64
            ),
            Product(
                title="VEXO Modular GaN 140W Station",
                slug="vexo-modular-gan-140w",
                subtitle="4-Port USB-C/A charging hub with OLED real-time power telemetry.",
                description="Next-generation Gallium Nitride III power architecture. Delivers simultaneous 140W Power Delivery 3.1 to laptops and mobile devices.",
                price=9999.0,
                compareAtPrice=11999.0,
                stock=90,
                categoryId=cat_power.id,
                images=json.dumps([
                    "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1200",
                ]),
                specs=json.dumps({
                    "Max Power": "140W USB-C PD 3.1",
                    "Ports": "3x USB-C, 1x USB-A Fast Charge",
                    "Display": "Monochrome OLED Telemetry",
                }),
                isFeatured=True,
                isNew=False,
                rating=4.92,
                reviewsCount=110
            ),
        ]
        db.add_all(products)
        db.commit()

        for p in products:
            db.refresh(p)
            review = Review(
                userId=customer.id,
                productId=p.id,
                rating=5,
                title="Industrial design masterpiece",
                comment="VEXO has redefined what luxury hardware feels like. The acoustic response and physical tactile weight are unmatched.",
                isVerified=True
            )
            db.add(review)

        # 4. Coupons
        coupon1 = Coupon(
            code="VEXO20",
            discountType="PERCENTAGE",
            discountValue=20.0,
            minOrderValue=10000.0,
            maxUses=500,
            expiresAt=datetime.now(timezone.utc) + timedelta(days=30),
            isActive=True
        )

        coupon2 = Coupon(
            code="LAUNCH50",
            discountType="FIXED",
            discountValue=2500.0,
            minOrderValue=20000.0,
            maxUses=100,
            expiresAt=datetime.now(timezone.utc) + timedelta(days=60),
            isActive=True
        )

        db.add_all([coupon1, coupon2])
        db.commit()

        print("[SEED] Seed completed successfully! Users, products, categories, reviews, and coupons initialized.")

    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
