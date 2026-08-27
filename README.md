# FurEver Care — They Deserve Forever Love
## TechWiz 6 — Responsive NextGen Website Development (Theme: Pet Care)
### Software Requirements Specification (SRS) v1.0 — Comprehensive Project Report & Submission

---

## 1. Project Overview & Problem Definition (SRS 1.1 - 1.3)

### 1.1 Background & Necessity
In today's fast-paced environment, pet owners, veterinary surgeons, and animal welfare organizations face severe fragmentation across essential pet care routines:
- **Disorganized Care Routines**: Tracking medical records, vaccination dates, diet plans, and training schedules across multiple disconnected channels.
- **Inconvenient Product Discovery**: Switching between multiple disparate websites to locate safe, veterinarian-approved nutrition, toys, and grooming products.
- **Shelter Adoption Hurdles**: Animal shelters struggle to showcase rescued animals with rich media and coordinate vaccination drives effectively.
- **Veterinary Coordination**: Pet clinics require streamlined schedule visualization, case study archiving, and quick emergency triage response.

### 1.2 The Solution: FurEver Care
**FurEver Care** is a unified, state-of-the-art Single Page Application (SPA) built with **React 18** and modern glassmorphic styling that bridges the gap between Pet Owners, Veterinarians, and Animal Shelters.

---

## 2. System Architecture & Tech Stack (SRS 1.8)

| Layer | Technology |
| :--- | :--- |
| **Framework & Engine** | React 18 (SPA with Component Hierarchy, Dynamic State & Hooks) + Babel Standalone |
| **Styling & UI Design** | Vanilla Modern CSS3 (Sky Blue Design Tokens, Glassmorphism, Micro-Animations, Flexbox & Grid) |
| **Typography & Icons** | Google Fonts (Outfit, Plus Jakarta Sans, JetBrains Mono) + FontAwesome 6 Pro CDN |
| **Audio Synthesizer** | Native HTML5 Web Audio API (`js/soundEngine.js` for acoustic whistle, clicker & chime synthesis) |
| **Data Store** | JSON-based static schemas (`products.json`, `adoptable-pets.json`, `case-studies.json`, `events.json`, `content.json`) |
| **Runtime Environment** | In-browser native execution or Python/Node HTTP Server (`http://localhost:3000`) |

---

## 3. Key Functional Modules (SRS 1.6)

### 3.1 Landing Page & Dynamic Role Switcher
- **Personalized Onboarding Gate**: Captures the user's first name (`Enter Your Name:`) and displays it persistently across the top header pill.
- **Interactive Role Selector**: Radio-selection routing for 3 distinct user categories:
  1. 🐕 **Pet Owner**
  2. 🩺 **Veterinarian**
  3. 🏠 **Animal Shelter / Rescue Volunteer**
- **Cinematic VIP Splash Intro**: Luxury animated overlay with brand slogan and progress transition.

### 3.2 Continuous Marquee Slider Ticker (Top Bar 1)
- Infinite dual-loop horizontal ticker with smooth animation displaying:
  - 🟢 **Live Veterinary ICU & Trauma Network Status**
  - 📍 **HTML5 Geolocation Integration** (Lat/Long & Local Weather)
  - ⏰ **Real-Time Clock** (Live ticking digital time & calendar date)
  - 🐾 **Upcoming Adoption Drive & Free Vaccination Camp Announcements**
  - 👥 **Simulated Real-Time Active Visitor Counter** (~15,000+ live visitors)

### 3.3 Pet Owner Portal
- **Pet Profile Manager**: Interactive form capturing Pet Name, Species, Breed, Age, Weight, Vaccinations, and Allergies with persistent storage.
- **Smart Calorie & Gram Feeding Calculator**: Calculates exact daily calorie and gram recommendations based on species, life stage, weight, and activity level.
- **Embedded Grooming Video Suite**: Curated masterclasses for brushing, bathing, and trimming with step-by-step guidance modals.
- **Health Tips Audio/Video**: Comprehensive modules for oral dental hygiene, weight management, and symptom checks.
- **Acoustic Training Soundboard**: Web Audio API generated sounds (1800Hz Clicker, 4400Hz Silent Whistle, Harmony Chime, and Calming Chord).
- **Pet Product Showcase**:
  - Filterable by 5 categories: *Dog/Cat Food*, *Toys*, *Grooming Essentials*, *Bedding and Apparel*, *Health Supplements*.
  - Live search bar, price/rating sorting, and dynamic product modal checkout previews.

### 3.4 Veterinarian Portal
- **Doctor Credentials & Clinic Profile**: Edit name, specialization, clinic affiliation, contact info, and medical practice photo.
- **Interactive Appointment Time Slot Grid**: Clear display of booked vs available appointment slots with 1-click booking simulation.
- **Clinical Case Studies**: 4 documented surgical and diagnostic medical histories with before/after records and treatment protocols.

### 3.5 Animal Shelter & Rescue Portal
- **Adoptable Pet Registry**: Full gallery of rescued pets with health status, age, breed, gender, and badges.
- **Client-Side Category Filters**: Instant filtering by *All*, *Dogs*, *Cats*, *Rabbits*, and *Birds*.
- **Interactive Adoption Application Modal**: Multi-step application modal with confirmation toast.
- **Rescue Success Stories**: Before & after transformation stories with recovery logs.
- **Event Drives & RSVPs**: Mega adoption drives and free vaccination camps with RSVP confirmation counters.
- **Interactive Google Maps Embed**: Location map for visiting the shelter headquarters.

### 3.6 Emergency SOS & Universal Utilities
- **24/7 Emergency Helplines**: Static directory of ASPCA poison control, ICU trauma dispatch, and avian emergency centers.
- **AI PetBot Triage Chatbot**: Floating 24/7 intelligent symptom and nutrition guidance bot.
- **Interactive Feedback Form**: Feedback form layout (UI-only) with validation.
- **About Us & Team Profile**: Mission statement, core team profiles, and platform roadmap.
- **Cyber Ice Dark Mode**: 1-click toggle between Sky-Blue Light Frost and Cyber Ice Dark Mode.
- **Scroll-Triggered Kitty**: Smooth interactive mascot following scroll down the page with eye-blink, tail-wag, and wiggle animations.

---

## 4. Flowcharts & Data Flow Diagrams (SRS 1.9)

### 4.1 System Data Flow Diagram (DFD Level 0)

```
 +------------------+             +--------------------------+
 |                  |  User Name  |                          |
 |    Pet Owner     | ----------> |                          |
 |  Veterinarian    |  Role Mode  |                          |
 |  Shelter Admin   |             |   FurEver Care Core SPA  |
 |                  | <---------- |       (React 18)         |
 +------------------+   Filtered  |                          |
                        Data View +-------------+------------+
                                                |
                               +----------------+----------------+
                               |                                 |
                               v                                 v
                     +-------------------+             +-------------------+
                     |  Static Data JSON |             |  Web Audio Engine |
                     | (Products, Pets,  |             |  & Geolocation    |
                     |  Case Studies)    |             |  API Layer        |
                     +-------------------+             +-------------------+
```

### 4.2 User Role Routing Logic

```
   [User Opens Website]
            |
            v
   [Cinematic VIP Splash Intro]
            |
            v
   [Landing Page Onboarding Gate]
      /           |            \
     /            |             \
[Pet Owner]  [Veterinarian]  [Animal Shelter]
     |            |             |
     v            v             v
Pet Profile   Vet Profile    Pet Adoption Gallery
Feeding Calc  Time Slots     Success Stories
Soundboard    Case Studies   Events & Google Map
```

---

## 5. Test Data Used in the Project (SRS 1.9)

1. **Product Catalog (`data/products.json`)**: 12 diverse products spanning Royal Canin food, smart laser toys, heavy-duty chew rings, grooming slicker brushes, orthopaedic memory beds, and omega-3 supplements.
2. **Adoptable Pets (`data/adoptable-pets.json`)**: 8 rescue animal profiles (Golden Retriever, Persian Cat, Beagle, Holland Lop Rabbit, Macaw, etc.).
3. **Veterinary Case Studies (`data/case-studies.json`)**: 4 clinical records (Canine Cruciate Ligament Repair, Feline Stomatitis Full Recovery, Rabbit GI Stasis Recovery, Parvovirus ICU Intervention).
4. **Shelter Events (`data/events.json`)**: Mega Central Park Adoption Drive, Free Rabies & DHPP Vaccination Camp, Volunteer Orientation Day.

---

## 6. Installation & Execution Instructions (SRS 1.9)

### Method 1: Local HTTP Server (Recommended)
```bash
# Navigate to the project root directory
cd techwiz

# Run the local server using Python
python -m http.server 3000
```
Open your web browser and navigate to: **`http://localhost:3000`**

### Method 2: Direct File Execution
Simply double-click or open [index.html](file:///c:/Users/RB%20Tech/OneDrive/Desktop/techwiz/index.html) directly in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

---

## 7. Assumptions & Compliance List
- **Serverless JSON Architecture**: As specified in SRS Section 1.5, client-side React 18 manages state with `localStorage` persistence and static JSON data retrieval.
- **Cross-Browser Compatibility**: Validated on Google Chrome, Edge, Safari, and Firefox.
- **Responsive Layout**: Designed for mobile (<480px), tablet (768px - 1024px), laptop, and high-resolution SVGA/4K monitors.
- **Zero 3rd-Party Templates**: 100% custom-built CSS and React component structure adhering strictly to SRS Section 1.6 and 1.7 guidelines.

---
*Created for TechWiz 6 Global AI-Based Tech Competition — Unleash Your Potential.*
"# FUREVER_CARE_PET_WEBSITE" 
