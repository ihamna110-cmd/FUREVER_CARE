// ==========================================================================
// FurEver Care - Master React Application
// Built for TechWiz 6 - NextGen Single Page Pet Care Application
// ==========================================================================

const { useState, useEffect, useMemo, useRef } = React;

function App() {
  // ------------------------------------------------------------------------
  // 1. GLOBAL STATE & USER PROFILE
  // ------------------------------------------------------------------------
  const [showIntro, setShowIntro] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('furever_theme') || 'light');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('furever_user');
    return saved ? JSON.parse(saved) : { firstName: '', category: 'pet-owner', registered: false };
  });

  const [activeTab, setActiveTab] = useState('home');
  const [petOwnerSubTab, setPetOwnerSubTab] = useState('profile');
  const [visitorCount, setVisitorCount] = useState(14890);
  const [currentTime, setCurrentTime] = useState('');
  const [userLocation, setUserLocation] = useState('Detecting location...');
  const [scrollY, setScrollY] = useState(0);

  // Custom Paw Cursor & Ripple State
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHovered, setCursorHovered] = useState(false);
  const [cursorClicked, setCursorClicked] = useState(false);
  const [ripples, setRipples] = useState([]);

  // Datasets (Pre-loaded with window.FurEverDB for instant double-click offline execution)
  const db = window.FurEverDB || {};
  const [products, setProducts] = useState(() => db.products || []);
  const [adoptablePets, setAdoptablePets] = useState(() => db['adoptable-pets'] || []);
  const [caseStudies, setCaseStudies] = useState(() => db['case-studies'] || []);
  const [events, setEvents] = useState(() => db.events || []);
  const [content, setContent] = useState(() => db.content || null);
  const [veterinarians, setVeterinarians] = useState(() => db.veterinarians || []);
  const [communityPosts, setCommunityPosts] = useState(() => db['community-posts'] || []);
  const [communityMembers, setCommunityMembers] = useState(() => db['community-members'] || []);
  const [faqs, setFaqs] = useState(() => db.faq || []);
  const [reviews, setReviews] = useState(() => db.reviews || []);
  const [toasts, setToasts] = useState([]);

  // Feedback Page State
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState('All');
  const [feedbackFormData, setFeedbackFormData] = useState({
    fullName: '',
    email: '',
    category: 'Pet Adoption',
    rating: 5,
    feedback: '',
    petName: '',
    petImage: ''
  });
  const [feedbackHoverRating, setFeedbackHoverRating] = useState(0);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState({});

  // Community State
  const [communityCategory, setCommunityCategory] = useState('All');
  const [likedPosts, setLikedPosts] = useState({});
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);
  const [newPostForm, setNewPostForm] = useState({
    name: '',
    title: '',
    category: 'Pet Stories',
    content: '',
    petImage: ''
  });
  const [postSuccessBanner, setPostSuccessBanner] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Veterinarians 45 Doctors Filter State
  const [selectedVetDoctor, setSelectedVetDoctor] = useState(null);
  const [vetSearch, setVetSearch] = useState('');
  const [vetSpecialtyFilter, setVetSpecialtyFilter] = useState('All');
  const [vetViewMode, setVetViewMode] = useState('directory'); // 'directory' | 'schedule' | 'edit' | 'cases'


  // Modals state
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [activeAdoptModal, setActiveAdoptModal] = useState(null);
  const [activeRsvpModal, setActiveRsvpModal] = useState(null);
  const [rsvpConfirmedData, setRsvpConfirmedData] = useState(null);
  const [rsvpFormData, setRsvpFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: 1,
    bringingPet: 'Yes',
    petDetails: ''
  });
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [orderSuccessData, setOrderSuccessData] = useState(null);
  const [checkoutQty, setCheckoutQty] = useState(1);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState('card');
  const [checkoutFormData, setCheckoutFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    cardNumber: '',
    cardExp: '',
    cardCvc: ''
  });
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [medModalOpen, setMedModalOpen] = useState(false);
  const [vacModalOpen, setVacModalOpen] = useState(false);
  const [groomingModalOpen, setGroomingModalOpen] = useState(false);
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [reminderModalData, setReminderModalData] = useState(null);
  const [reminderSuccess, setReminderSuccess] = useState(false);
  const [groomingSuccess, setGroomingSuccess] = useState(false);
  const [groomingFormErrors, setGroomingFormErrors] = useState({});
  const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
  const [prescriptionSuccess, setPrescriptionSuccess] = useState(null);
  const [rxForm, setRxForm] = useState({ petName: '', petSpecies: 'Dog', petAge: '', weight: '', symptoms: '', medication: '', dosage: '', duration: '', notes: '' });
  const [addPetModalOpen, setAddPetModalOpen] = useState(false);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', inquiryType: 'Veterinary Doctor Consultation', priority: 'Standard', message: '' });
  const [contactSuccessModal, setContactSuccessModal] = useState(false);
  const [contactSuccessData, setContactSuccessData] = useState(null);
  const [contactErrors, setContactErrors] = useState({});
  const [contactMapLocation, setContactMapLocation] = useState('hq');
  const [heroScene, setHeroScene] = useState(0);
  const [heroMousePos, setHeroMousePos] = useState({ x: 0, y: 0 });
  const [contactFaqOpen, setContactFaqOpen] = useState(1);

  // Adoption Success Confirmation Modal
  const [adoptSuccessData, setAdoptSuccessData] = useState(null);

  // Live Order Tracking Modal State
  const [activeTrackOrder, setActiveTrackOrder] = useState(null);
  const [trackOrderSearchQuery, setTrackOrderSearchQuery] = useState('');

  // Reschedule Appointment Modal State
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedAptToReschedule, setSelectedAptToReschedule] = useState(null);
  const [rescheduleForm, setRescheduleForm] = useState({
    date: '2026-09-25',
    time: '10:00 AM - 10:45 AM',
    reason: 'Schedule Conflict',
    notes: ''
  });
  const [rescheduleSuccessModal, setRescheduleSuccessModal] = useState(false);

  // Directions & Navigation Modal State
  const [directionsModalOpen, setDirectionsModalOpen] = useState(false);
  const [selectedAptForDirections, setSelectedAptForDirections] = useState(null);
  const [transitMode, setTransitMode] = useState('driving');
  const [directionsSuccessModal, setDirectionsSuccessModal] = useState(false);

  // Vaccine Tracker Species Filter & Certificate Preview
  const [vacSpeciesFilter, setVacSpeciesFilter] = useState('all');
  const [vacCertModalOpen, setVacCertModalOpen] = useState(false);

  // Hero Interactive Species Switcher & Search
  const [heroSpecies, setHeroSpecies] = useState('dogs');
  const [heroSearchQuery, setHeroSearchQuery] = useState('');

  // Home Interactive Care & Breed Matcher State
  const [homeSymptomFocus, setHomeSymptomFocus] = useState('itchy');
  const [homeQuizSpace, setHomeQuizSpace] = useState('apartment');
  const [homeQuizActivity, setHomeQuizActivity] = useState('moderate');

  // Emergency Interactive State
  const [emergencySymptom, setEmergencySymptom] = useState('choking');
  const [emergencyToxinSearch, setEmergencyToxinSearch] = useState('');
  const [cprMetronomeActive, setCprMetronomeActive] = useState(false);
  const [cprBeat, setCprBeat] = useState(0);

  // Dedicated Pet Profile State (Single Active Pet Profile)
  const [petForm, setPetFormState] = useState(() => {
    const savedSingle = localStorage.getItem('furever_pet_profile');
    if (savedSingle) {
      try { return JSON.parse(savedSingle); } catch(e){}
    }
    const savedList = localStorage.getItem('furever_pets');
    if (savedList) {
      try {
        const arr = JSON.parse(savedList);
        if (Array.isArray(arr) && arr.length > 0) {
          const foundBella = arr.find(p => p.name.toLowerCase() === 'bella') || arr[arr.length - 1];
          return foundBella;
        }
      } catch(e){}
    }
    return {
      id: 'PET-101',
      name: 'bella',
      species: 'Cat',
      breed: 'Domestic Shorthair',
      age: '1.5 Years',
      weight: '4.2 kg',
      vaccinationInfo: 'FVRCP & Rabies Up-to-Date',
      photo: 'images/cat-brushing-thumbnail.jpg',
      allergies: 'None recorded',
      microchip: '985-2341-8890-112',
      dob: 'Jan 2024',
      gender: 'Female'
    };
  });

  const [petsList, setPetsList] = useState([petForm]);
  const [activePetId, setActivePetId] = useState(petForm.id || 'PET-101');

  const setPetForm = (updatedPet) => {
    setPetFormState(updatedPet);
    setPetsList([updatedPet]);
    localStorage.setItem('furever_pet_profile', JSON.stringify(updatedPet));
    localStorage.setItem('furever_pets', JSON.stringify([updatedPet]));
  };

  const [newPetFormData, setNewPetFormData] = useState({
    name: '',
    species: 'Dog',
    breed: '',
    age: '',
    weight: '',
    gender: 'Male',
    microchip: '',
    allergies: '',
    photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'
  });

  // 1. Pet Owner: Medical History State
  const [medicalRecords, setMedicalRecords] = useState([
    {
      id: 'MED-101',
      date: 'Aug 10, 2026',
      clinic: 'FurEver Central Advanced Surgical Hospital',
      vetName: 'Dr. Sarah Jenkins, DVM',
      diagnosis: 'Routine Annual Wellness & Dental Prophylaxis Screening',
      medications: 'Omega-3 Fatty Acid Supplement (1 pump daily)',
      temperature: '38.4°C (Normal)',
      notes: 'Heart sounds crisp, clear lung fields. Mild tartar removed on upper molars.',
      status: 'Resolved'
    },
    {
      id: 'MED-102',
      date: 'May 14, 2026',
      clinic: 'Skin & Coat Specialty Veterinary Institute',
      vetName: 'Dr. Elena Rostova, DVM',
      diagnosis: 'Seasonal Grass Contact Dermatitis (Paw Itching)',
      medications: 'Chlorhexidine 4% Antiseptic Foam & Apoquel (5.4mg)',
      temperature: '38.6°C',
      notes: 'Interdigital erythema fully resolved within 7 days of topical foam wash.',
      status: 'Resolved'
    },
    {
      id: 'MED-103',
      date: 'Jan 22, 2026',
      clinic: 'St. Jude 24/7 Pet Emergency Trauma Hospital',
      vetName: 'Dr. Alexander Ross, BVSc',
      diagnosis: 'Minor Right Paw Pad Abrasion (Trail Running)',
      medications: 'Silver Sulfadiazine Cream & Protective Bootie',
      temperature: '38.5°C',
      notes: 'No foreign body in tissue. Healed completely without suture requirement.',
      status: 'Resolved'
    }
  ]);

  const [newMedForm, setNewMedForm] = useState({
    date: '',
    vetName: '',
    diagnosis: '',
    medications: '',
    notes: ''
  });

  // 2. Pet Owner: Vaccination Tracking State
  const [vaccineRecords, setVaccineRecords] = useState([
    { id: 'VAC-1', name: 'Rabies (3-Year PureVax Vaccine)', administeredDate: 'Nov 18, 2025', dueDate: 'Nov 18, 2028', clinic: 'FurEver Central', vet: 'Dr. Sarah Jenkins', status: 'Valid / Up-to-Date' },
    { id: 'VAC-2', name: 'DHPP (Distemper, Hepatitis, Parvo, Parainfluenza)', administeredDate: 'Mar 10, 2026', dueDate: 'Mar 10, 2027', clinic: 'FurEver Central', vet: 'Dr. Sarah Jenkins', status: 'Valid / Up-to-Date' },
    { id: 'VAC-3', name: 'Bordetella Bronchiseptica (Kennel Cough)', administeredDate: 'May 02, 2026', dueDate: 'Nov 02, 2026', clinic: 'FirstSteps Pet Hospital', vet: 'Dr. Jessica Hayes', status: 'Booster Due Soon' },
    { id: 'VAC-4', name: 'Leptospirosis 4-Strain Vaccine', administeredDate: 'Aug 04, 2026', dueDate: 'Aug 04, 2027', clinic: 'FurEver Central', vet: 'Dr. Sarah Jenkins', status: 'Valid / Up-to-Date' }
  ]);

  const [newVacForm, setNewVacForm] = useState({
    name: '',
    administeredDate: '',
    dueDate: '',
    vet: ''
  });

  // 3. Pet Owner: Vet Appointments State
  const [ownerVetAppointments, setOwnerVetAppointments] = useState([
    {
      id: 'APT-901',
      doctorName: 'Dr. Sarah Jenkins, DVM (Orthopedic Surgeon)',
      clinic: 'FurEver Central Advanced Surgical Hospital',
      date: 'Sept 02, 2026',
      time: '10:00 AM - 10:45 AM',
      reason: 'Semi-Annual Joint Mobility & Preventive Review',
      status: 'Confirmed'
    },
    {
      id: 'APT-902',
      doctorName: 'Dr. Rachel Kim, DVM (Veterinary Dentist)',
      clinic: 'FurEver Dental & Maxillofacial Care',
      date: 'Sept 18, 2026',
      time: '01:30 PM - 02:15 PM',
      reason: 'Routine Ultrasonic Dental Polish & Gum Check',
      status: 'Confirmed'
    }
  ]);

  // 4. Pet Owner: Grooming Appointments State
  const [groomingBookings, setGroomingBookings] = useState([
    {
      id: 'GRM-501',
      service: 'Full Luxury Spa, Deshedding & Hydro-Bath',
      groomer: 'Paws & Bubbles Master Spa Salon',
      date: 'Aug 29, 2026',
      time: '11:00 AM',
      price: '$65.00',
      status: 'Upcoming'
    },
    {
      id: 'GRM-502',
      service: 'Nail Grinding, Ear Cleanse & Paw Pad Balm',
      groomer: 'Bella Pet Styling Studio',
      date: 'July 15, 2026',
      time: '02:30 PM',
      price: '$28.00',
      status: 'Completed'
    }
  ]);

  const [groomingForm, setGroomingForm] = useState({
    service: 'Full Luxury Spa, Deshedding & Hydro-Bath',
    groomer: 'Paws & Bubbles Master Spa Salon',
    date: '2026-09-05',
    time: '10:00 AM'
  });


  const [vetForm, setVetForm] = useState({
    name: 'Dr. Sarah Jenkins, DVM',
    specialization: 'Orthopedic Surgery & Critical Care',
    contact: 's.jenkins@furevervets.org | (555) 912-3849',
    clinic: 'FurEver Central Advanced Surgical Hospital',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    experience: '12+ Years Clinical Practice',
    registered: true
  });

  // Filters & Search
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductCategory, setSelectedProductCategory] = useState('All');
  const [productSort, setProductSort] = useState('featured');
  const [petFilter, setPetFilter] = useState('all');

  // Appointment Slots state
  const [timeSlots, setTimeSlots] = useState([
    { id: 1, time: '09:00 AM - 09:45 AM', patient: 'Archie (Checkup)', status: 'booked' },
    { id: 2, time: '10:00 AM - 10:45 AM', patient: 'Available', status: 'available' },
    { id: 3, time: '11:15 AM - 12:00 PM', patient: 'Bella (Vaccine Booster)', status: 'booked' },
    { id: 4, time: '01:30 PM - 02:15 PM', patient: 'Available', status: 'available' },
    { id: 5, time: '02:30 PM - 03:15 PM', patient: 'Available', status: 'available' },
    { id: 6, time: '03:45 PM - 04:30 PM', patient: 'Milo (Orthopedic Review)', status: 'booked' },
    { id: 7, time: '04:45 PM - 05:30 PM', patient: 'Available', status: 'available' },
    { id: 8, time: '05:45 PM - 06:30 PM', patient: 'Emergency Hold', status: 'booked' }
  ]);

  // Feeding Calculator State
  const [calcPetType, setCalcPetType] = useState('dog');
  const [calcAgeGroup, setCalcAgeGroup] = useState('adult');
  const [calcWeight, setCalcWeight] = useState(25);
  const [calcActivity, setCalcActivity] = useState('moderate');

  // Human Age Calculator State
  const [ageCalcSpecies, setAgeCalcSpecies] = useState('dog');
  const [ageCalcPetYears, setAgeCalcPetYears] = useState(3);

  // AI Chat Messages
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Assalam-o-Alaikum! 🐾 Hello! Main FurEver Care ka 24/7 AI Pet Assistant hoon.\n\nAap mujhse Roman Urdu ya English mein pets ki diet, ulti/dast/bukhar ke ilaj, vaccine schedule, grooming, ya doctor booking ke bare mein kuch bhi pooch sakte hain!' }
  ]);

  // ------------------------------------------------------------------------
  // 2. LIFECYCLE, REALTIME CLOCK & DATA LOADING
  // ------------------------------------------------------------------------
  useEffect(() => {
    /* 15s Cinematic Hero Loop */
    const heroTimer = setInterval(() => {
      setHeroScene(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(heroTimer);
  }, []);

  useEffect(() => {
    /* GSAP Hero Animation Trigger */
    if (typeof window !== 'undefined' && window.gsap) {
      try {
        window.gsap.from('.petcare-hero-left', { opacity: 0, y: 25, duration: 0.8, ease: 'power2.out' });
        window.gsap.from('.petcare-composition-container', { opacity: 0, scale: 0.94, duration: 1, ease: 'power2.out', delay: 0.15 });
      } catch (e) {}
    }
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('furever_theme', theme);
  }, [theme]);

  // CPR Metronome Effect (110 BPM rhythm)
  useEffect(() => {
    if (!cprMetronomeActive) {
      setCprBeat(0);
      return;
    }
    const interval = setInterval(() => {
      setCprBeat(prev => (prev % 30) + 1);
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }, 545);
    return () => clearInterval(interval);
  }, [cprMetronomeActive]);

  const addToast = (msg, icon = 'fa-circle-check', type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, icon, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Global Universal JavaScript Form Validation Helper (Highlights empty fields red with shake animation)
  const markInvalidField = (el, errorMsg) => {
    if (el) {
      el.classList.add('input-error');
      el.focus();
      const clearErr = () => {
        el.classList.remove('input-error');
        el.removeEventListener('input', clearErr);
        el.removeEventListener('change', clearErr);
      };
      el.addEventListener('input', clearErr);
      el.addEventListener('change', clearErr);
    }
    if (errorMsg) {
      addToast(errorMsg, 'fa-triangle-exclamation', 'warning');
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  };

  // Hero Species Data & Search Handler
  const heroSpeciesData = {
    dogs: {
      name: 'Milo & Bella (Golden Mix)',
      species: 'Canine Companion',
      vitals: 'Heart Rate: 84 bpm • Rested & Optimal',
      vaccine: 'DHPP Booster Up to Date',
      vet: 'Dr. Sarah Jenkins, DVM',
      badge: 'Bonded Pair Ready',
      badgeIcon: 'fa-dog',
      img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=850&q=80'
    },
    cats: {
      name: 'Luna Frost (Persian Mix)',
      species: 'Feline Companion',
      vitals: 'Heart Rate: 112 bpm • Calm & Purring',
      vaccine: 'FVRCP & Rabies Certified',
      vet: 'Dr. Elena Rostova, DVM',
      badge: 'Sweet Purrer',
      badgeIcon: 'fa-cat',
      img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=850&q=80'
    },
    rabbits: {
      name: 'Barnaby Hopps (Holland Lop)',
      species: 'Lagomorph / Bunny',
      vitals: 'Heart Rate: 140 bpm • Happy Binkies',
      vaccine: 'RHDV2 Vaccine Cleared',
      vet: 'Dr. Marcus Vance, DVM',
      badge: 'Litter Trained',
      badgeIcon: 'fa-carrot',
      img: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=850&q=80'
    },
    birds: {
      name: 'Pip & Peanut (Sun Conure)',
      species: 'Avian Companion',
      vitals: 'Wing Health: 100% • Singing',
      vaccine: 'Avian Panel Certified',
      vet: 'Dr. Chloe Bennett, DVM',
      badge: 'Melodic Whistlers',
      badgeIcon: 'fa-dove',
      img: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=850&q=80'
    }
  };
  const currentHeroPet = heroSpeciesData[heroSpecies] || heroSpeciesData.dogs;

  const handleHeroSearchSubmit = (e) => {
    e.preventDefault();
    if (!heroSearchQuery.trim()) return;
    const q = heroSearchQuery.toLowerCase().trim();
    if (q.includes('vet') || q.includes('doctor') || q.includes('clinic')) {
      setActiveTab('vet');
    } else if (q.includes('adopt') || q.includes('dog') || q.includes('cat') || q.includes('rabbit') || q.includes('bird')) {
      setActiveTab('shelter');
    } else if (q.includes('emerg') || q.includes('help') || q.includes('poison') || q.includes('toxic') || q.includes('call')) {
      setActiveTab('emergency');
    } else if (q.includes('feed') || q.includes('review') || q.includes('rate')) {
      setActiveTab('feedback');
    } else if (q.includes('communit') || q.includes('post') || q.includes('story')) {
      setActiveTab('community');
    } else {
      setActiveTab('products');
    }
    if (window.SoundEngine) window.SoundEngine.playClicker();
    addToast('Navigating to results for: ' + heroSearchQuery, 'fa-magnifying-glass');
  };

  useEffect(() => {
    // Clock Timer
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' ' + now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);

    // Visitor Counter Simulation
    const visitorInterval = setInterval(() => {
      setVisitorCount(prev => prev + (Math.random() > 0.4 ? 1 : 0));
    }, 5000);

    // HTML5 Geolocation per SRS 1.6
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(2);
          const lon = pos.coords.longitude.toFixed(2);
          setUserLocation(`Local Hub (${lat}°N, ${lon}°E) • Clear Sky 24°C`);
        },
        () => {
          setUserLocation(`Global Metro Station • 22°C (Optimal Pet Walking Weather)`);
        }
      );
    } else {
      setUserLocation(`Global Pet Care Network • 24°C`);
    }

    // Load JSON Datasets
    fetch('data/products.json').then(res => res.json()).then(data => setProducts(data)).catch(() => {});
    fetch('data/adoptable-pets.json').then(res => res.json()).then(data => setAdoptablePets(data)).catch(() => {});
    fetch('data/case-studies.json').then(res => res.json()).then(data => setCaseStudies(data)).catch(() => {});
    fetch('data/events.json').then(res => res.json()).then(data => setEvents(data)).catch(() => {});
    fetch('data/content.json').then(res => res.json()).then(data => setContent(data)).catch(() => {});
    fetch('data/veterinarians.json').then(res => res.json()).then(data => {
      setVeterinarians(data);
      if (data && data.length > 0) setSelectedVetDoctor(data[0]);
    }).catch(() => {});
    fetch('data/community-posts.json').then(res => res.json()).then(data => setCommunityPosts(data)).catch(() => {});
    fetch('data/community-members.json').then(res => res.json()).then(data => setCommunityMembers(data)).catch(() => {});
    fetch('data/faq.json').then(res => res.json()).then(data => setFaqs(data)).catch(() => {});
    fetch('data/reviews.json').then(res => res.json()).then(data => setReviews(data)).catch(() => {});


    // Auto-transition intro after 3.8 seconds
    const introTimeout = setTimeout(() => {
      setShowIntro(false);
    }, 3800);

    // Scroll listener for kitty follower
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Custom Paw Cursor Tracking & Click Ripple Listeners
    const onMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      const target = e.target;
      const isClickable = target && target.closest && target.closest('button, a, input, select, textarea, .role-card-option, .product-card, .pet-pill-btn, .payment-option-card, .glass-card-hover, .user-status-pill, .btn-icon, .filter-chip');
      setCursorHovered(!!isClickable);
    };

    const onMouseDown = (e) => {
      setCursorClicked(true);
      const newRipple = { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY };
      setRipples(prev => [...prev.slice(-8), newRipple]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 650);
    };

    const onMouseUp = () => setCursorClicked(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });

    return () => {
      clearInterval(timer);
      clearInterval(visitorInterval);
      clearTimeout(introTimeout);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);


  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
    if (window.SoundEngine) window.SoundEngine.playClicker();
  };

  const enterWebsite = () => {
    setShowIntro(false);
    if (window.SoundEngine) window.SoundEngine.playChime();
  };

  // ------------------------------------------------------------------------
  // 3. USER ONBOARDING & ROLE ROUTING HANDLER (SRS 1.6)
  // ------------------------------------------------------------------------
  const handleOnboardSubmit = (e) => {
    e.preventDefault();
    if (!user.firstName.trim()) {
      addToast('Please enter your first name to continue', 'fa-triangle-exclamation', 'warning');
      return;
    }
    const updated = { ...user, registered: true };
    setUser(updated);
    localStorage.setItem('furever_user', JSON.stringify(updated));
    if (window.SoundEngine) window.SoundEngine.playChime();
    addToast(`Welcome to FurEver Care, ${user.firstName}!`, 'fa-heart');

    // Route directly to selected role portal per SRS
    if (user.category === 'pet-owner') setActiveTab('pet-owner');
    else if (user.category === 'veterinarian') setActiveTab('vet');
    else if (user.category === 'shelter') setActiveTab('shelter');
  };

  // Switch role anytime (Pet Owner / Veterinarian / Animal Shelter)
  const handleRoleSwitch = (newRole) => {
    const updated = { ...user, category: newRole };
    setUser(updated);
    localStorage.setItem('furever_user', JSON.stringify(updated));
    if (window.SoundEngine) window.SoundEngine.playClicker();
    if (newRole === 'pet-owner') setActiveTab('pet-owner');
    else if (newRole === 'veterinarian') setActiveTab('vet');
    else if (newRole === 'shelter') setActiveTab('shelter');
    addToast(`Switched view to ${newRole.replace('-', ' ').toUpperCase()}`, 'fa-user-gear');
  };

  // ------------------------------------------------------------------------
  // 4. FILTERED & SORTED PRODUCTS
  // ------------------------------------------------------------------------
  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (selectedProductCategory !== 'All') {
      list = list.filter(p => p.category === selectedProductCategory);
    }
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.tags && p.tags.some(t => t.toLowerCase().includes(q))));
    }
    if (productSort === 'price-low') list.sort((a, b) => a.price - b.price);
    else if (productSort === 'price-high') list.sort((a, b) => b.price - a.price);
    else if (productSort === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, selectedProductCategory, productSearch, productSort]);

  // ------------------------------------------------------------------------
  // 5. FILTERED ADOPTABLE PETS
  // ------------------------------------------------------------------------
  const filteredShelterPets = useMemo(() => {
    if (petFilter === 'all') return adoptablePets;
    return adoptablePets.filter(p => p.type === petFilter);
  }, [adoptablePets, petFilter]);

  // ------------------------------------------------------------------------
  // 5.1 FILTERED 45 VETERINARIANS DIRECTORY
  // ------------------------------------------------------------------------
  const filteredVeterinarians = useMemo(() => {
    let list = [...veterinarians];
    if (vetSpecialtyFilter !== 'All') {
      list = list.filter(v => v.specialization.toLowerCase().includes(vetSpecialtyFilter.toLowerCase()));
    }
    if (vetSearch.trim()) {
      const q = vetSearch.toLowerCase();
      list = list.filter(v => 
        v.name.toLowerCase().includes(q) || 
        v.specialization.toLowerCase().includes(q) || 
        v.clinic.toLowerCase().includes(q) || 
        v.city.toLowerCase().includes(q) ||
        (v.bio && v.bio.toLowerCase().includes(q))
      );
    }
    return list;
  }, [veterinarians, vetSpecialtyFilter, vetSearch]);


  // ------------------------------------------------------------------------
  // 6. CALCULATORS
  // ------------------------------------------------------------------------
  const calculateFoodGrams = () => {
    let baseCalories = calcWeight * 30 + 70;
    if (calcPetType === 'cat') baseCalories = calcWeight * 28 + 50;
    if (calcAgeGroup === 'puppy') baseCalories *= 1.7;
    if (calcAgeGroup === 'senior') baseCalories *= 0.85;
    if (calcActivity === 'high') baseCalories *= 1.35;
    if (calcActivity === 'low') baseCalories *= 0.85;

    const gramsPerDay = Math.round(baseCalories / 3.8);
    const cupsPerDay = (gramsPerDay / 120).toFixed(1);
    return { calories: Math.round(baseCalories), grams: gramsPerDay, cups: cupsPerDay };
  };

  const calculateHumanAge = () => {
    const y = Number(ageCalcPetYears) || 1;
    if (ageCalcSpecies === 'dog') {
      if (y === 1) return 15;
      if (y === 2) return 24;
      return 24 + (y - 2) * 5;
    } else if (ageCalcSpecies === 'cat') {
      if (y === 1) return 15;
      if (y === 2) return 24;
      return 24 + (y - 2) * 4;
    } else if (ageCalcSpecies === 'rabbit') {
      if (y === 1) return 18;
      if (y === 2) return 27;
      return 27 + (y - 2) * 6;
    }
    return y * 6;
  };

  // ------------------------------------------------------------------------
  // 7. AI CHATBOT HANDLER
  // ------------------------------------------------------------------------
  // 7. AI CHATBOT INTELLIGENT BILINGUAL ENGINE (ROMAN URDU + ENGLISH)
  // ------------------------------------------------------------------------
  const generateBotReply = (query) => {
    const raw = query.trim();
    const q = raw.toLowerCase();

    // Language Detection Check (Urdu / Roman Urdu signals)
    const urduKeywords = [
      'kya', 'hai', 'hain', 'kese', 'kaise', 'karna', 'karein', 'chahiye', 'batao', 'bataen', 'bataiye',
      'meri', 'mera', 'mere', 'billi', 'kutta', 'kutte', 'khana', 'ulti', 'qay', 'dast', 'tatti', 'bukhar',
      'khujli', 'kharish', 'dard', 'salam', 'assalam', 'shukriya', 'theek', 'thik', 'doctor', 'paisa',
      'kitna', 'konsa', 'konsi', 'mariz', 'dawa', 'dawam', 'goli', 'nehlana', 'nahlana', 'nahana',
      'bal', 'jhar', 'pishab', 'doodh', 'gosht', 'paani', 'bhook', 'kamzor', 'bacha', 'pilla', 'teeka',
      'vaccine', 'zeher', 'pyaz', 'lehsan', 'angoor', 'madad', 'bohat', 'sirf', 'shampoo', 'safai',
      'bhejo', 'dikhaye', 'chahiye', 'apka', 'naam', 'sun', 'bolo', 'kaun', 'kon', 'kahan', 'kyun', 'kabi'
    ];

    const isUrdu = urduKeywords.some(w => new RegExp(`\\b${w}\\b`, 'i').test(q)) || /[\u0600-\u06FF]/.test(q);

    // 1. Greetings & Persona Inquiries
    if (/\b(salam|assalam|aoa|kese ho|kaise ho|kya haal|kya hal|hal chal|haal chal)\b/i.test(q)) {
      return "Walaikum Assalam! 🐾 Main FurEver Care ka AI Veterinary & Pet Care Assistant hoon. Main bilkul theek hoon! Aap batayein, aapke pyare pet (dog/cat) ka kya haal hai? Main unki diet, bimari ke ilaj, grooming ya doctor appointment mein aapki kya madad kar sakta hoon?";
    }
    if (/\b(hi|hello|hey|greetings|how are you|who are you|what is your name|aap kon ho|ap kon ho|naam kya hai)\b/i.test(q)) {
      if (isUrdu) {
        return "Hello! Main FurEver Care ka 24/7 AI PetBot Assistant hoon. 🐶🐱 Aap mujhse pet diet, bimari ke ilaj, vaccines, grooming aur doctor booking ke bare mein kuch bhi pooch sakte hain!";
      }
      return "Hello! I am FurEver Care's 24/7 AI PetBot Assistant 🐾. I'm here to provide clinical guidance on veterinary health, pet nutrition, vaccination schedules, grooming routines, and clinic bookings. How may I assist you and your pet today?";
    }

    // 2. Vomiting / Nausea (Ulti / Qay)
    if (/(ulti|vomit|vomiting|qay|throw up|puking|throwup)/i.test(q)) {
      if (isUrdu) {
        return "⚠️ Pet ki Ulti (Vomiting) ke liye Zaroori Hidayat:\n\n1. Agle 6 se 8 ghantay tak solid khana rok dein taake stomach settle ho sake.\n2. Thoda thoda taza paani dein taake dehydration na ho.\n3. Ulti rukne ke baad halka ubla hua chicken aur chawal (bland diet) dein.\n4. 🚨 Agar ulti mein khoon, foam, ya pet bohot sust lag raha ho, to website ke 'Veterinarians' tab se foran doctor visit book karein!";
      }
      return "⚠️ Clinical Advice for Pet Vomiting:\n\n1. Withhold solid food for 6-8 hours to allow the gastrointestinal tract to rest.\n2. Provide fresh, clean water in small, frequent amounts to prevent dehydration.\n3. After resting, introduce a bland diet: boiled shredded chicken with plain white rice.\n4. Seek immediate veterinary care if vomiting is persistent, contains blood, or if your pet is lethargic.";
    }

    // 3. Diarrhea / Loose Motion / Dast / Stomach Upset
    if (/(dast|loose motion|diarrhea|tatti|pet kharab|pet dard|loose stool|watery stool|upset stomach)/i.test(q)) {
      if (isUrdu) {
        return "🩺 Pet ke Dast (Loose Motion) ka Behtareen Ilaj:\n\n1. Pet ko dehydrated hone se bachayein, fresh paani aur ORS dein.\n2. Inhe ubla hua chicken aur boiled rice dein, oily ya masaledar khana hargiz na dein.\n3. Doodh (Cow milk) foran band karein kyunke pets lactose digest nahi kar sakte.\n4. Hamari store se 'Digestive Probiotic Capsules' use karein jo pet ke pait ko tezi se theek karti hain.";
      }
      return "🩺 Guidelines for Pet Diarrhea & Loose Stool:\n\n1. Prevent dehydration with clean fresh water or vet-approved electrolyte hydration.\n2. Feed a bland diet of boiled boneless chicken breast mixed with white rice.\n3. Completely avoid milk and dairy products as dogs/cats are lactose intolerant.\n4. Administer pet-safe probiotics available in our Store section to restore healthy digestion!";
    }

    // 4. Not Eating / Loss of Appetite / Bhook Na Lagna
    if (/(khana nahi|bhook nahi|refusing food|not eating|won't eat|wont eat|loss of appetite|kuch nahi kha raha|feed nahi le)/i.test(q)) {
      if (isUrdu) {
        return "🍽️ Agar Pet Khana Nahi Kha Raha:\n\n1. Khane ko halka sa garm (lukewarm) karein taake uski khushboo se bhook barhe.\n2. Dry kibble mein halka sa chicken broth / soup mix karke dein.\n3. Check karein ke daanton mein koi takleef, zakham ya bukhar to nahi hai.\n4. Agar pet 24 ghante se zyada kuch na khaye, to website ke 'Veterinarians' tab se consultation book karein.";
      }
      return "🍽️ Tips if Your Pet is Refusing Food:\n\n1. Slightly warm their wet food or kibble to enhance aroma and stimulate appetite.\n2. Mix a few spoons of warm low-sodium bone broth into their dry food.\n3. Check their mouth/teeth for tartar, ulcers, or dental sensitivity.\n4. If anorexia continues for over 24 hours, book an appointment with our specialist vets!";
    }

    // 5. Ticks / Fleas / Skin Itching / Khujli / Pissu / Hair Fall
    if (/(khujli|kharish|pissu|ticks|fleas|itching|keere|keede|bal jhar|hair fall|shedding|skin allergy|flea)/i.test(q)) {
      if (isUrdu) {
        return "🐕 Pissu (Ticks/Fleas) aur Khujli ka Fori Hal:\n\n1. Anti-tick & Flea Botanical Shampoo se pet ko nehlayein.\n2. Fipronil Spot-On drops pet ki gardan ke peeche lagayein jo 1 maheene tak protection deti hain.\n3. Rozana Deshedding Brush se bal comb karein taake dead fur nikal jaye.\n4. Bedding ko garm paani mein dho kar Store se Omega-3 Softgels dein jo skin aur coat ko chamakdar banati hain.";
      }
      return "🐕 Solution for Ticks, Fleas & Skin Itching:\n\n1. Bathe your pet using an Anti-Parasitic Botanical Shampoo.\n2. Apply a vet-approved topical Spot-On treatment (like Fipronil) between their shoulder blades.\n3. Groom daily with a stainless steel Deshedding Undercoat Rake.\n4. Supplement their diet with Omega-3 Fish Oil Softgels from our Health Store for healthy skin barrier!";
    }

    // 6. Fever / Lethargy / Bukhar / Sust
    if (/(bukhar|fever|temperature|sust|lethargic|lethargy|garm|tired|weak|kamzor)/i.test(q)) {
      if (isUrdu) {
        return "🌡️ Pet ke Bukhar (Fever) ki Jankari:\n\n1. Dogs aur Cats ka normal body temperature 101.0°F se 102.5°F (38.3°C - 39.2°C) hota hai.\n2. Agar body bohot garm hai aur pet sust hai to kaano aur panjo par thande geelay kapray se sponge karein.\n3. ⚠️ Insano wali Panadol / Paracetamol hargiz na dein, yeh pets ke liye poisonous hai!\n4. Website par 'Veterinarians' tab se foran clinic visit schedule karein.";
      }
      return "🌡️ Pet Fever & Lethargy Guidance:\n\n1. Normal pet body temperature ranges between 101.0°F - 102.5°F (38.3°C - 39.2°C).\n2. Apply cool, damp cloths to their paws and ear flaps to gently cool them down.\n3. ⚠️ NEVER give human medications like Panadol, Paracetamol, or Ibuprofen as they are lethal to pets!\n4. Schedule an in-person consultation through our Veterinarians directory for clinical evaluation.";
    }

    // 7. Toxic Foods / Zeher / Chocolate / Poison Alert
    if (/(chocolate|toxic|poison|zeher|pyaz|onion|garlic|lehsan|grape|angoor|raisin|xylitol)/i.test(q)) {
      if (isUrdu) {
        return "🚨 KHATRA: Toxic Foods Alert!\n\nChocolate, Pyaz (Onion), Lehsan (Garlic), Angoor (Grapes), Raisins, aur Xylitol pets ke liye shaded zehreelay hain!\n\nAgar aapke pet ne inme se kuch kha liya hai, to waqt zaya kiye baghair hamari 24/7 SOS Helpline (0800-4357-PET) par call karein ya foran Emergency Hospital le jayein!";
      }
      return "🚨 EMERGENCY TOXIC FOOD WARNING:\n\nChocolate, onions, garlic, grapes, raisins, and xylitol artificial sweetener are extremely toxic and cause rapid organ failure in dogs and cats!\n\nIf ingested, do not induce vomiting without vet guidance. Contact our 24/7 Emergency SOS Line or visit an emergency veterinary center immediately!";
    }

    // 8. Diet & Feeding Guide / Khana Kya Dein / Doodh
    if (/(khana|food|diet|kibble|feed|doodh|milk|gosht|chicken|meal|nutrition|raw meat)/i.test(q)) {
      if (isUrdu) {
        return "🥣 Pet Nutrition & Feeding Guide:\n\n1. Adult Dogs & Cats ko din mein 2 waqt measured meals dein.\n2. Puppies & Kittens (chhotay bachay) ko din mein 3 se 4 waqt high-protein food dein.\n3. Cow Milk (Gaye ka doodh) avoid karein kyunke is se dast lagte hain. Pet-safe lactose-free formula use karein.\n4. Balanced diet ke liye chicken, ublay chawal, gajar, pumpkin aur premium kibble behtareen hain.";
      }
      return "🥣 Pet Nutrition & Feeding Guide:\n\n1. Adult dogs and cats should be fed 2 portion-controlled meals daily based on body weight.\n2. Growing puppies and kittens need 3-4 nutrient-dense meals with DHA for brain development.\n3. Avoid cow milk; use specialized lactose-free kitten/puppy replacement milk.\n4. Explore our Store tab for AAFCO-certified Premium Kibble and Bone Broths!";
    }

    // 9. Vaccination / Teeka / Schedule
    if (/(vaccin|teeka|teekay|injection|rabies|dhpp|fvrcp|shot|shots|booster)/i.test(q)) {
      if (isUrdu) {
        return "💉 Pet Vaccination Schedule:\n\n• Dogs (Kutte): 6-8 hafte par DHPP (Parvovirus/Distemper), 12 hafte par Booster, 16 hafte par Rabies Vaccine.\n• Cats (Billian): 8 hafte par FVRCP (Cat Flu/Enteritis), 12 hafte par FVRCP Booster, 16 hafte par Rabies.\n• Iske baad har saal ek booster teeka zaroori hota hai.\n\nAap website par 'Pet Dashboard -> Vaccination' se record maintain kar sakte hain!";
      }
      return "💉 Essential Pet Vaccination Protocol:\n\n• Dogs: 6-8 Weeks (DHPP Core), 12 Weeks (DHPP Booster + Leptospirosis), 16 Weeks (Rabies 1-Year Shot).\n• Cats: 8 Weeks (FVRCP Triple Protection), 12 Weeks (FVRCP Booster), 16 Weeks (Rabies Shot).\n• Annual booster immunizations are mandatory to keep pet passports active. Check our Dashboard to log vaccines!";
    }

    // 10. Grooming / Bathing / Haircut / Nehlana
    if (/(nehlana|nahlana|nahana|shampoo|grooming|brush|brushing|bal|haircut|spa|nakhun|nail)/i.test(q)) {
      if (isUrdu) {
        return "✂️ Grooming & Nehlane ki Tips:\n\n1. Dogs ko maheenay mein 1 ya 2 dafa gungune paani aur Pet Shampoo se nehlayein. Rozana nehlane se skin dry ho jati hai.\n2. Cats khud ko clean karti hain, unhe sirf zaroorat parne par nehlayein.\n3. Balon ko rozana Deshedding brush karein taake ghar mein bal na phailen.\n4. Website par 'Pet Dashboard -> Grooming' se aap Luxury Spa booking bhi kar sakte hain!";
      }
      return "✂️ Grooming & Bathing Best Practices:\n\n1. Bathe dogs every 3-4 weeks using pH-balanced pet shampoo. Bathing too often strips natural protective skin oils.\n2. Cats are self-groomers and usually only require deshedding brushing or spot cleansing.\n3. Brush long-haired pets daily to prevent painful matting and hairballs.\n4. Book a professional grooming appointment anytime through our Grooming Spa tab!";
    }

    // 11. Training / Biting / Potty / Barking / Katna
    if (/(training|train|potty|litter|bark|bhokna|katna|bite|biting|teething|chew)/i.test(q)) {
      if (isUrdu) {
        return "🎾 Training & Behaviour Tips:\n\n1. Potty Training: Pet ko khana khane ke 15 minute baad hamesha bahar ya litter box par le jayein aur jab wo wahan kare to treat dein.\n2. Katna (Biting/Teething): Agar pilla haath par kaate to 'Ouch' bol kar haath hata lein aur usay chew toy pakra dein.\n3. Positive Reward (Treats) se pet 4 guna jaldi seekhte hain, daantne ya maarnay se ghabra jate hain.";
      }
      return "🎾 Pet Behavior & Positive Training:\n\n1. Potty Training: Take your puppy/kitten to the designated spot 15 minutes after each meal and immediately reward successful potty with a treat.\n2. Teething & Biting: Redirect playful hand biting by offering a durable rubber chew toy from our Store.\n3. Reward-based clicker training reinforces good habits without fear or anxiety!";
    }

    // 12. Adoption / Shelter / Pet Adopt Karna
    if (/(adopt|adoption|shelter|rescue|billi chahiye|kutta chahiye|purchase pet|buy pet)/i.test(q)) {
      if (isUrdu) {
        return "❤️ Pet Adopt Kaise Karein:\n\n1. Website ke 'Adoption & Rescue' section mein jayein.\n2. Wahan maujood dogs aur cats ki verified photos aur health details dekhein.\n3. Apni pasand ke pet par 'Adopt Me' button dabayein aur free form fill karein.\n4. Hamari team 24-48 hours mein aap se contact karke pet handover schedule karegi!";
      }
      return "❤️ How to Adopt a Companion:\n\n1. Head over to our 'Adoption & Rescue' page.\n2. Browse through dozens of loving, health-certified, and vaccinated rescue pets.\n3. Click 'Adopt Me' on your chosen pet and submit your application.\n4. Our shelter adoption team will reach out within 24-48 hours!";
    }

    // 13. Doctor Booking / Appointment / Clinic / Fee
    if (/(doctor|vet|appointment|consultation|fees|fee|clinic|hospital|book appointment|reschedule)/i.test(q)) {
      if (isUrdu) {
        return "👨‍⚕️ Veterinarian Doctor Booking:\n\n1. 'Veterinarians' tab par click karein jahan verified specialists maujood hain.\n2. Filter se Surgeon, Dermatologist, ya General Physician choose karein.\n3. 'Book Consultation' click karke apni pasand ki date aur time slot choose karein.\n4. Agar pehle se booking reschedule karni ho to 'Pet Dashboard -> Appointments' se Reschedule kar sakte hain!";
      }
      return "👨‍⚕️ Booking Top Veterinary Doctors:\n\n1. Navigate to the 'Veterinarians' tab to view our network of licensed veterinary specialists.\n2. Filter by specialty (Cardiology, Dermatology, Dental, General Surgery).\n3. Click 'Book Consultation' to choose your preferred clinic and date slot.\n4. Existing bookings can also be easily rescheduled from the Pet Owner Dashboard!";
    }

    // 14. Store / Delivery / Payment / Khareedna
    if (/(store|order|buy|product|price|delivery|payment|cod|card|tracking|kareed|kharid)/i.test(q)) {
      if (isUrdu) {
        return "🛍️ FurEver Care Pet Store & Delivery:\n\n• Hum Food, Toys, Grooming Shampoos, Bedding aur Supplements deliver karte hain.\n• Delivery: 24 se 48 ghantay express dispatch.\n• Payment Options: Cash on Delivery (COD), Credit/Debit Card, aur Digital Pay.\n• Order place karne ke baad 'Track Order' modal se live shipment trace kar sakte hain!";
      }
      return "🛍️ FurEver Care Store & Express Delivery:\n\n• Browse our curated catalog of Nutrition, Toys, Grooming Essentials, Bedding, and Health Supplements.\n• Delivery timeline: 24-48 hours express doorstep dispatch.\n• Payment Methods: Cash on Delivery (COD), Debit/Credit Card, Digital Pay.\n• Easily track your packages in real-time via the Track Order modal!";
    }

    // 15. Emergency SOS Helpline / Madad
    if (/(emergency|sos|helpline|phone|contact|madad|rabta|number)/i.test(q)) {
      if (isUrdu) {
        return "🚨 24/7 Emergency Helpline & SOS Support:\n\n• Toll-Free Emergency Hotline: 0800-4357-PET (0800-HELP-PET)\n• WhatsApp AI Bot: +92 300 1234567\n• Central Hospital Address: FurEver Trauma & Surgical Center, Main Boulevard.\n• Website par top par 'Emergency SOS' button dabanay se live CPR guide aur first-aid open ho jayega!";
      }
      return "🚨 24/7 Emergency Helpline & SOS Support:\n\n• Toll-Free Emergency Hotline: 0800-4357-PET (0800-HELP-PET)\n• WhatsApp Support: +92 300 1234567\n• Main Trauma Clinic: FurEver Central 24/7 Animal Hospital.\n• Click the top 'Emergency SOS' button for immediate CPR metronome and life-saving first-aid instructions!";
    }

    // 16. Gratitude / Shukriya
    if (/(shukriya|thanks|thank you|thx|jazakallah|bohat shukriya|great|acha laga)/i.test(q)) {
      if (isUrdu) {
        return "Bohat bohat shukriya! ❤️ Aapka aur aapke pet ka hamesha khayal rakhna hamara farz hai. Agar koi aur sawal ho to bejhijhak poochiye!";
      }
      return "You're very welcome! ❤️ Wishing you and your beloved pet the absolute best health and happiness. Feel free to ask anytime!";
    }

    // 17. Smart Dynamic Fallback
    if (isUrdu) {
      return `Aapka sawal "${raw}" note kar liya gaya hai! 🐾\n\nBehtareen pet care ke liye hamesha fresh paani, clean balanced diet, aur routine checkup ensure karein. Agar aapko is bare mein specialist doctor se baat karni hai, to 'Veterinarians' tab se online booking karein ya 'Emergency SOS' check karein.`;
    }
    return `Thank you for asking about "${raw}"! 🐾\n\nFor optimal pet wellness, ensure clean freshwater, age-appropriate nutrition, and regular preventive checkups. You can explore our 'Veterinarians' directory for specialist advice or browse our 'Pet Care Resources' tab for step-by-step guides!`;
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    const newMsgs = [...chatMessages, { sender: 'user', text: userText }];
    setChatMessages(newMsgs);
    setChatInput('');

    setTimeout(() => {
      const reply = generateBotReply(userText);
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      if (window.SoundEngine) window.SoundEngine.playChime();
    }, 450);
  };

  const triggerBotQuery = (text) => {
    const newMsgs = [...chatMessages, { sender: 'user', text: text }];
    setChatMessages(newMsgs);
    setTimeout(() => {
      const reply = generateBotReply(text);
      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      if (window.SoundEngine) window.SoundEngine.playChime();
    }, 450);
  };

  // ------------------------------------------------------------------------
  // 8. RENDER VIEW ENGINE
  // ------------------------------------------------------------------------
  return (
    <div className="main-wrapper">
      {/* 0. LUXURY CINEMATIC INTRO SPLASH OVERLAY */}
      {showIntro && (
        <div className="luxury-intro-overlay">
          <div className="intro-ambient-ring"></div>
          <img src="assets/logo.png?v=13" alt="FurEver Care Logo" style={{ width: '130px', height: '130px', objectFit: 'contain', filter: 'drop-shadow(0 0 35px rgba(56, 189, 248, 0.9))', marginBottom: '20px' }} />
          <h1 className="intro-title">FurEver Care</h1>
          <p className="intro-tagline">"They Deserve Forever Love & World-Class Care"</p>
          <button className="intro-enter-btn" onClick={enterWebsite}>
            <span>Enter FurEver Care Portal</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
          <div className="intro-progress-bar">
            <div className="intro-progress-fill"></div>
          </div>
        </div>
      )}

      {/* 🐾 CUSTOM PAW CURSOR & CLICK RIPPLES */}
      <div 
        className={`custom-paw-cursor ${cursorHovered ? 'hovered' : ''} ${cursorClicked ? 'clicked' : ''}`}
        style={{
          transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`
        }}
      >
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="paw-cursor-svg">
          <path d="M16 23C13.5 23 11 20.8 11.5 17.5C12 14.5 14.5 14 16 14C17.5 14 20 14.5 20.5 17.5C21 20.8 18.5 23 16 23Z" fill="url(#pawGlow)" stroke="#0284c7" strokeWidth="1.2"/>
          <ellipse cx="8.5" cy="12" rx="2.5" ry="3.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1"/>
          <ellipse cx="13" cy="8.5" rx="2.5" ry="3.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1"/>
          <ellipse cx="19" cy="8.5" rx="2.5" ry="3.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1"/>
          <ellipse cx="23.5" cy="12" rx="2.5" ry="3.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1"/>
          <defs>
            <linearGradient id="pawGlow" x1="11" y1="14" x2="21" y2="23" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8"/>
              <stop offset="1" stopColor="#0ea5e9"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Click Paw Ripples */}
      {ripples.map(r => (
        <div 
          key={r.id} 
          className="paw-click-ripple"
          style={{ left: `${r.x}px`, top: `${r.y}px` }}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M12 17C10.5 17 9 15.5 9.3 13C9.7 10.8 11.2 10.5 12 10.5C12.8 10.5 14.3 10.8 14.7 13C15 15.5 13.5 17 12 17Z"/>
            <circle cx="6.5" cy="9.5" r="1.8"/>
            <circle cx="10" cy="6.5" r="1.8"/>
            <circle cx="14" cy="6.5" r="1.8"/>
            <circle cx="17.5" cy="9.5" r="1.8"/>
          </svg>
        </div>
      ))}

      {/* Exact Watermarked Pet Paws Seamless Background */}
      <div className="paw-background-pattern"></div>

      {/* Floating Ambient Soft Paws in Background */}
      <div className="floating-ambient-paw" style={{ top: '15%', left: '2.5%', fontSize: '2.4rem', animationDuration: '22s' }}>
        <i className="fa-solid fa-paw"></i>
      </div>
      <div className="floating-ambient-paw" style={{ top: '35%', right: '3.5%', fontSize: '3rem', animationDuration: '26s', animationDelay: '-4s' }}>
        <i className="fa-solid fa-paw"></i>
      </div>
      <div className="floating-ambient-paw" style={{ top: '65%', left: '2%', fontSize: '2.2rem', animationDuration: '20s', animationDelay: '-8s' }}>
        <i className="fa-solid fa-paw"></i>
      </div>
      <div className="floating-ambient-paw" style={{ top: '82%', right: '3%', fontSize: '2.7rem', animationDuration: '24s', animationDelay: '-12s' }}>
        <i className="fa-solid fa-paw"></i>
      </div>

      {/* Dynamic Background Glow Orbs */}
      <div className="ambient-glow-wrapper">
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>

      {/* SCROLL-TRIGGERED KITTY — follows scroll position down the page */}
      {!showIntro && (
        <div
          className="scroll-kitty"
          style={{
            top: Math.min(120 + scrollY * 0.28, window.innerHeight - 100) + 'px'
          }}
          title="Meow! 🐱"
        >
          <svg viewBox="0 0 120 130" xmlns="http://www.w3.org/2000/svg">
            {/* Body */}
            <ellipse cx="60" cy="90" rx="36" ry="32" fill="#5bc8f5"/>
            {/* Head */}
            <ellipse cx="60" cy="55" rx="30" ry="26" fill="#5bc8f5"/>
            {/* Left ear */}
            <polygon points="32,36 22,12 46,30" fill="#5bc8f5"/>
            <polygon points="34,34 27,17 44,30" fill="#ffaabb"/>
            {/* Right ear */}
            <polygon points="88,36 98,12 74,30" fill="#5bc8f5"/>
            <polygon points="86,34 93,17 76,30" fill="#ffaabb"/>
            {/* Eyes */}
            <ellipse className="kitty-eye" cx="48" cy="52" rx="6" ry="7" fill="#ffffff"/>
            <ellipse cx="48" cy="53" rx="3.5" ry="5" fill="#1a5276"/>
            <ellipse cx="47" cy="51" rx="1.5" ry="1.5" fill="#ffffff"/>
            <ellipse className="kitty-eye" cx="72" cy="52" rx="6" ry="7" fill="#ffffff"/>
            <ellipse cx="72" cy="53" rx="3.5" ry="5" fill="#1a5276"/>
            <ellipse cx="71" cy="51" rx="1.5" ry="1.5" fill="#ffffff"/>
            {/* Nose */}
            <polygon points="60,61 57,64 63,64" fill="#ff8fab"/>
            {/* Mouth */}
            <path d="M57,64 Q55,69 52,67" stroke="#0284c7" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
            <path d="M63,64 Q65,69 68,67" stroke="#0284c7" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
            {/* Whiskers */}
            <line x1="30" y1="62" x2="52" y2="63" stroke="#0369a1" strokeWidth="1.2" opacity="0.7"/>
            <line x1="30" y1="66" x2="52" y2="65" stroke="#0369a1" strokeWidth="1.2" opacity="0.7"/>
            <line x1="90" y1="62" x2="68" y2="63" stroke="#0369a1" strokeWidth="1.2" opacity="0.7"/>
            <line x1="90" y1="66" x2="68" y2="65" stroke="#0369a1" strokeWidth="1.2" opacity="0.7"/>
            {/* Belly patch */}
            <ellipse cx="60" cy="95" rx="20" ry="18" fill="#bae6fd" opacity="0.7"/>
            {/* Paws */}
            <ellipse cx="38" cy="120" rx="12" ry="8" fill="#38bdf8"/>
            <ellipse cx="82" cy="120" rx="12" ry="8" fill="#38bdf8"/>
            {/* Tail */}
            <path className="kitty-tail" d="M96,100 Q120,80 108,60 Q100,45 110,35" stroke="#38bdf8" strokeWidth="9" fill="none" strokeLinecap="round"/>
            {/* Heart on chest */}
            <path d="M55,92 C55,89 52,87 50,89 C48,87 45,89 45,92 C45,97 50,102 55,102 Z" fill="#ff6b9d" opacity="0.85"/>
            <path d="M65,92 C65,89 62,87 60,89 C58,87 55,89 55,92 C55,97 60,102 65,102 Z" fill="#ff6b9d" opacity="0.85"/>
          </svg>
        </div>
      )}

      {/* If user is NOT registered yet: Show ONLY the Dedicated Landing Gateway Access Screen */}
      {!user.registered ? (
        <div className="landing-gate-fullscreen">
          <div className="onboarding-container glass-panel">
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <span className="badge-sky" style={{ marginBottom: '12px' }}>PERSONALIZED PORTAL ACCESS</span>
              <h2 style={{ fontSize: '2.5rem', margin: '8px 0 10px' }}>
                Welcome to <span className="gradient-text">FurEver Care</span>
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
                Enter your name and select your category to customize your interactive dashboard.
              </p>
            </div>

            <form onSubmit={handleOnboardSubmit}>
              <div className="form-group-custom">
                <label className="form-label-custom">
                  <i className="fa-solid fa-signature" style={{ color: 'var(--primary-500)', marginRight: '8px' }}></i>
                  Enter Your First Name:
                </label>
                <input 
                  type="text" 
                  className="input-sky" 
                  placeholder="e.g. hamna or Alex"
                  value={user.firstName}
                  onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">
                  <i className="fa-solid fa-id-badge" style={{ color: 'var(--primary-500)', marginRight: '8px' }}></i>
                  Select the User Category You Belong To:
                </label>
                <div className="role-selector-grid">
                  <div 
                    className={`role-card-option ${user.category === 'pet-owner' ? 'selected' : ''}`}
                    onClick={() => setUser({ ...user, category: 'pet-owner' })}
                  >
                    <input 
                      type="radio" 
                      name="userCategory" 
                      value="pet-owner" 
                      checked={user.category === 'pet-owner'} 
                      onChange={() => {}}
                    />
                    <div className="role-icon-box">
                      <i className="fa-solid fa-dog"></i>
                    </div>
                    <div className="role-title">1. Pet Owner</div>
                    <div className="role-desc">Track pet health, feeding charts, grooming guides & buy curated supplies.</div>
                  </div>

                  <div 
                    className={`role-card-option ${user.category === 'veterinarian' ? 'selected' : ''}`}
                    onClick={() => setUser({ ...user, category: 'veterinarian' })}
                  >
                    <input 
                      type="radio" 
                      name="userCategory" 
                      value="veterinarian" 
                      checked={user.category === 'veterinarian'} 
                      onChange={() => {}}
                    />
                    <div className="role-icon-box">
                      <i className="fa-solid fa-stethoscope"></i>
                    </div>
                    <div className="role-title">2. Veterinarian</div>
                    <div className="role-desc">Manage clinical appointments, review case studies & generate prescriptions.</div>
                  </div>

                  <div 
                    className={`role-card-option ${user.category === 'shelter' ? 'selected' : ''}`}
                    onClick={() => setUser({ ...user, category: 'shelter' })}
                  >
                    <input 
                      type="radio" 
                      name="userCategory" 
                      value="shelter" 
                      checked={user.category === 'shelter'} 
                      onChange={() => {}}
                    />
                    <div className="role-icon-box">
                      <i className="fa-solid fa-house-chimney-medical"></i>
                    </div>
                    <div className="role-title">3. Animal Shelter / Volunteer</div>
                    <div className="role-desc">Showcase adoptable pets, manage rescue drives & publish success stories.</div>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-sky-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
                <span>Launch {user.category === 'shelter' ? 'SHELTER' : user.category.replace('-', ' ').toUpperCase()} Dashboard</span>
                <i className="fa-solid fa-arrow-right" style={{ marginLeft: '10px' }}></i>
              </button>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* 1. INFINITE SMOOTH HORIZONTAL SLIDER TICKER (Top Bar 1) */}
          <div className="ticker-bar-wrapper">
            <div className="ticker-marquee-track">
              {/* Item Loop A */}
              <div className="ticker-item-slide">
                <span className="ticker-pulse-dot"></span>
                <span><strong>LIVE NETWORK:</strong> 24/7 Veterinary ICU & Critical Trauma Dispatch Active</span>
              </div>
              <div className="ticker-item-slide">
                <i className="fa-solid fa-location-dot" style={{ color: '#7dd3fc' }}></i>
                <span>{userLocation}</span>
              </div>
              <div className="ticker-item-slide">
                <i className="fa-solid fa-clock" style={{ color: '#bae6fd' }}></i>
                <span>{currentTime}</span>
              </div>
              <div className="ticker-item-slide">
                <i className="fa-solid fa-paw" style={{ color: '#7dd3fc' }}></i>
                <span>Next Mega Adoption Drive: <strong>Sept 5 @ Central Park Pavilions</strong></span>
              </div>
              <div className="ticker-item-slide">
                <i className="fa-solid fa-users" style={{ color: '#38bdf8' }}></i>
                <span>Active Live Visitors: <strong>{visitorCount.toLocaleString()}</strong></span>
              </div>
              <div className="ticker-item-slide">
                <i className="fa-solid fa-shield-heart" style={{ color: '#34d399' }}></i>
                <span>Free Rabies & DHPP Vaccination Camp: <strong>Sept 12 • RSVP Open</strong></span>
              </div>

              {/* Duplicated Seamless Track (Loop B) */}
              <div className="ticker-item-slide">
                <span className="ticker-pulse-dot"></span>
                <span><strong>LIVE NETWORK:</strong> 24/7 Veterinary ICU & Critical Trauma Dispatch Active</span>
              </div>
              <div className="ticker-item-slide">
                <i className="fa-solid fa-location-dot" style={{ color: '#7dd3fc' }}></i>
                <span>{userLocation}</span>
              </div>
              <div className="ticker-item-slide">
                <i className="fa-solid fa-clock" style={{ color: '#bae6fd' }}></i>
                <span>{currentTime}</span>
              </div>
              <div className="ticker-item-slide">
                <i className="fa-solid fa-paw" style={{ color: '#7dd3fc' }}></i>
                <span>Next Mega Adoption Drive: <strong>Sept 5 @ Central Park Pavilions</strong></span>
              </div>
              <div className="ticker-item-slide">
                <i className="fa-solid fa-users" style={{ color: '#38bdf8' }}></i>
                <span>Active Live Visitors: <strong>{visitorCount.toLocaleString()}</strong></span>
              </div>
              <div className="ticker-item-slide">
                <i className="fa-solid fa-shield-heart" style={{ color: '#34d399' }}></i>
                <span>Free Rabies & DHPP Vaccination Camp: <strong>Sept 12 • RSVP Open</strong></span>
              </div>
            </div>
          </div>

          {/* 2. MAIN HEADER NAVBAR */}
          <header className="main-header">
            <div className="header-container">
              <div className="brand-logo-custom" onClick={() => setActiveTab('home')}>
                <img src="assets/logo.png?v=13" alt="FurEver Care Logo" className="brand-logo-img" />
                <div className="brand-name">
                  <span>FurEver Care</span>
                  <span className="brand-tagline">They Deserve Forever Love</span>
                </div>
              </div>

              {/* Nav Menu Links: Home, Pet Products, Emergency, Feedback, About Us */}
              <nav className="nav-links">
                <button className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
                  <i className="fa-solid fa-house"></i> Home
                </button>
                <button className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`} onClick={() => { setActiveTab('products'); if (window.SoundEngine) window.SoundEngine.playClicker(); }}>
                  <i className="fa-solid fa-bag-shopping"></i> Pet Products
                </button>
                <button className={`nav-btn ${activeTab === 'community' ? 'active' : ''}`} onClick={() => { setActiveTab('community'); if (window.SoundEngine) window.SoundEngine.playClicker(); }}>
                  <i className="fa-solid fa-users"></i> Community
                </button>
                <button className={`nav-btn ${activeTab === 'emergency' ? 'active' : ''}`} onClick={() => setActiveTab('emergency')}>
                  <i className="fa-solid fa-truck-medical"></i> Emergency
                </button>
                <button className={`nav-btn ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')}>
                  <i className="fa-solid fa-comments"></i> Feedback
                </button>
                <button className={`nav-btn ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>
                  <i className="fa-solid fa-circle-info"></i> About Us
                </button>
                <button className={`nav-btn ${activeTab === 'contact' ? 'active' : ''}`} onClick={() => { setActiveTab('contact'); if (window.SoundEngine) window.SoundEngine.playClicker(); }}>
                  <i className="fa-solid fa-address-book"></i> Contact Us
                </button>
              </nav>

              {/* User Status, Switch Role & Theme Switcher */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div 
                  className="user-status-pill" 
                  onClick={() => {
                    const updated = { ...user, registered: false };
                    setUser(updated);
                    localStorage.setItem('furever_user', JSON.stringify(updated));
                    addToast('Opened Portal Access Gateway', 'fa-door-open');
                  }} 
                  title="Click to Switch User Role / Open Gateway"
                >
                  <div className="user-avatar-badge">{user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', lineHeight: 1 }}>{user.firstName || 'Guest'}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--primary-600)', textTransform: 'capitalize' }}>
                      {user.category.replace('-', ' ')} <i className="fa-solid fa-repeat" style={{ marginLeft: '2px', fontSize: '0.65rem' }}></i>
                    </div>
                  </div>
                </div>

                <button className="btn-icon" onClick={toggleTheme} title="Toggle Sky Blue Theme">
                  <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
                </button>
              </div>
            </div>
          </header>

      {/* Main Dynamic View Content */}
      <main className="app-container">
        
        {/* ==================================================================
            TAB 1: HOME & HERO & ONBOARDING GATE
            ================================================================== */}
        {/* ==================================================================
            TAB 1: HOME & HERO & ONBOARDING GATE
            ================================================================== */}
        {activeTab === 'home' && (
          <div>
            {/* ══════════════════════════════════════════════════════════════════
                APEX CINEMATIC HERO SECTION (15s SEAMLESS LOOP: CAT ➔ DOG ➔ BIRD)
                ══════════════════════════════════════════════════════════════════ */}
            <section 
              className="hero-section apex-hero-wrapper"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
                const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
                setHeroMousePos({ x, y });
              }}
              onMouseLeave={() => setHeroMousePos({ x: 0, y: 0 })}
            >
              {/* Cinematic Ambient Light & Glow Orbs */}
              <div className="cinematic-light-shafts" style={{ '--mouse-x': `${50 + heroMousePos.x * 1.5}%`, '--mouse-y': `${40 + heroMousePos.y * 1.5}%` }}></div>
              <div className="cinematic-glow-backdrop"></div>

              {/* Floating Paw Particles & Bokeh */}
              <div className="cinematic-particle cinematic-p1"><i className="fa-solid fa-paw"></i></div>
              <div className="cinematic-particle cinematic-p2"><i className="fa-solid fa-sparkles"></i></div>
              <div className="cinematic-particle cinematic-p3"><i className="fa-solid fa-paw"></i></div>
              <div className="cinematic-particle cinematic-p4"><i className="fa-solid fa-heart"></i></div>

              {/* ── TWO-COLUMN HERO GRID ── */}
              <div className="cinematic-hero-grid">
                
                {/* ── LEFT COLUMN: DYNAMIC CINEMATIC HEADLINES & CTAS ── */}
                <div 
                  className="cinematic-left-content"
                  style={{ transform: `translate3d(${-heroMousePos.x * 0.4}px, ${-heroMousePos.y * 0.4}px, 0)` }}
                >
                  
                  {/* Top Badge */}
                  <div className="cinematic-top-badge">
                    <span className="cinematic-pulse-dot"></span>
                    <i className="fa-solid fa-shield-cat"></i>
                    <span>
                      {heroScene === 0 && 'Chapter I • Serene Feline Care'}
                      {heroScene === 1 && 'Chapter II • Dedicated Canine Wellness'}
                      {heroScene === 2 && 'Chapter III • Aviary & Companion Rescue'}
                    </span>
                  </div>

                  <div className="cinematic-brand-sub">FurEver Care Platform</div>

                  {/* Dynamic Headline */}
                  <h1 className="cinematic-headline">
                    {heroScene === 0 && (
                      <span>Because Every Paw <br /><span className="cinematic-highlight">Deserves Forever.</span></span>
                    )}
                    {heroScene === 1 && (
                      <span>Unconditional Love, <br /><span className="cinematic-highlight">World-Class Health.</span></span>
                    )}
                    {heroScene === 2 && (
                      <span>Soaring Freedom, <br /><span className="cinematic-highlight">Compassionate Care.</span></span>
                    )}
                  </h1>

                  {/* Dynamic Subheading */}
                  <p className="cinematic-subtext">
                    {heroScene === 0 && 'Thoughtful care, accredited veterinarians, and endless love for every feline companion.'}
                    {heroScene === 1 && 'Certified emergency hospital triage, preventative nutrition, and loving clinical expertise.'}
                    {heroScene === 2 && 'Ethical companion sanctuaries, exotic avian wellness, and worldwide adoption networks.'}
                  </p>

                  {/* Action Buttons */}
                  <div className="cinematic-cta-group">
                    <button 
                      className="btn-cinematic-primary"
                      onClick={() => {
                        setActiveTab('shelter');
                        if (window.SoundEngine) window.SoundEngine.playClicker();
                        addToast('Entering Adoption Gallery & Rescue Hub', 'fa-paw');
                      }}
                    >
                      <span>Explore Care</span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>

                    <button 
                      className="btn-cinematic-secondary"
                      onClick={() => {
                        setActiveTab('vet');
                        setVetViewMode('directory');
                        if (window.SoundEngine) window.SoundEngine.playClicker();
                        addToast('Connecting with Verified Veterinarians', 'fa-user-doctor');
                      }}
                    >
                      <i className="fa-solid fa-stethoscope" style={{ color: '#0ea5e9' }}></i>
                      <span>Meet Our Pets</span>
                    </button>
                  </div>

                  {/* 15s Scene Timeline Chapter Selector */}
                  <div className="cinematic-timeline-nav">
                    {[
                      { id: 0, label: '01 🐱 Cat', duration: '0–5s' },
                      { id: 1, label: '02 🐶 Dog', duration: '5–10s' },
                      { id: 2, label: '03 🐦 Bird', duration: '10–15s' }
                    ].map(scene => (
                      <button
                        key={scene.id}
                        className={`cinematic-timeline-dot ${heroScene === scene.id ? 'active' : ''}`}
                        onClick={() => {
                          setHeroScene(scene.id);
                          if (window.SoundEngine) window.SoundEngine.playClicker();
                        }}
                        title={`Switch to Scene ${scene.id + 1}`}
                      >
                        {scene.label}
                      </button>
                    ))}
                  </div>

                </div>

                {/* ── RIGHT COLUMN: CINEMATIC ANIMAL STAGE (CAT -> DOG -> BIRD) ── */}
                <div 
                  className="cinematic-stage"
                  style={{ transform: `translate3d(${heroMousePos.x * 0.8}px, ${heroMousePos.y * 0.8}px, 0)` }}
                >
                  <div className="cinematic-animal-viewport">
                    
                    {/* 🐱 SCENE 01: CAT (Luna) */}
                    <div className={`cinematic-animal-layer ${heroScene === 0 ? 'scene-active' : heroScene === 1 ? 'scene-exiting' : 'scene-entering'}`}>
                      <div className="cinematic-visual-card motion-cat">
                        <img 
                          src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=700&q=80" 
                          alt="Luna - British Shorthair Cat"
                          className="cinematic-visual-img" 
                        />
                        <div className="cinematic-animal-pill">
                          <div>
                            <div className="cinematic-pill-name">Luna</div>
                            <div className="cinematic-pill-breed">British Shorthair</div>
                          </div>
                          <span className="cinematic-pill-status">🐱 Feline Care</span>
                        </div>
                      </div>
                    </div>

                    {/* 🐶 SCENE 02: DOG (Buddy) */}
                    <div className={`cinematic-animal-layer ${heroScene === 1 ? 'scene-active' : heroScene === 2 ? 'scene-exiting' : 'scene-entering'}`}>
                      <div className="cinematic-visual-card motion-dog">
                        <img 
                          src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=700&q=80" 
                          alt="Buddy - Golden Retriever"
                          className="cinematic-visual-img" 
                        />
                        <div className="cinematic-animal-pill">
                          <div>
                            <div className="cinematic-pill-name">Buddy</div>
                            <div className="cinematic-pill-breed">Golden Retriever</div>
                          </div>
                          <span className="cinematic-pill-status">🐶 Canine Care</span>
                        </div>
                      </div>
                    </div>

                    {/* 🐦 SCENE 03: BIRD (Rio) */}
                    <div className={`cinematic-animal-layer ${heroScene === 2 ? 'scene-active' : heroScene === 0 ? 'scene-exiting' : 'scene-entering'}`}>
                      <div className="cinematic-visual-card motion-bird">
                        <img 
                          src="https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=700&q=80" 
                          alt="Rio - Blue Crown Conure"
                          className="cinematic-visual-img" 
                        />
                        <div className="cinematic-animal-pill">
                          <div>
                            <div className="cinematic-pill-name">Rio</div>
                            <div className="cinematic-pill-breed">Exotic Avian</div>
                          </div>
                          <span className="cinematic-pill-status">🐦 Free Flight</span>
                        </div>
                      </div>
                    </div>

                    {/* Floating Glass Corner Cards */}
                    <div 
                      className="cinematic-floating-widget widget-top-right"
                      onClick={() => { setActiveTab('emergency'); if (window.SoundEngine) window.SoundEngine.playClicker(); }}
                    >
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(16,185,129,0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-heart-pulse"></i>
                      </div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '0.85rem', color: '#0B2A52' }}>24/7 Clinical SOS</div>
                        <div style={{ fontSize: '0.72rem', color: '#10b981' }}>Live Triage Active</div>
                      </div>
                    </div>

                    <div 
                      className="cinematic-floating-widget widget-bottom-left"
                      onClick={() => { setActiveTab('shelter'); if (window.SoundEngine) window.SoundEngine.playClicker(); }}
                    >
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(14,165,233,0.15)', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <i className="fa-solid fa-shield-heart"></i>
                      </div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '0.85rem', color: '#0B2A52' }}>4,850+ Adoptions</div>
                        <div style={{ fontSize: '0.72rem', color: '#0ea5e9' }}>Verified Shelters</div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* ── BOTTOM STATS STRIP ── */}
              <div className="cinematic-bottom-strip">
                <div className="cinematic-stat-box">
                  <div className="cinematic-stat-icon"><i className="fa-solid fa-heart"></i></div>
                  <div>
                    <div className="cinematic-stat-val">50K+</div>
                    <div className="cinematic-stat-lbl">Happy Pet Parents</div>
                  </div>
                </div>

                <div className="cinematic-stat-box">
                  <div className="cinematic-stat-icon"><i className="fa-solid fa-user-doctor"></i></div>
                  <div>
                    <div className="cinematic-stat-val">10K+</div>
                    <div className="cinematic-stat-lbl">Verified Vets</div>
                  </div>
                </div>

                <div className="cinematic-stat-box">
                  <div className="cinematic-stat-icon"><i className="fa-solid fa-bag-shopping"></i></div>
                  <div>
                    <div className="cinematic-stat-val">120K+</div>
                    <div className="cinematic-stat-lbl">Care Products</div>
                  </div>
                </div>

                <div className="cinematic-stat-box">
                  <div className="cinematic-stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}><i className="fa-solid fa-clock"></i></div>
                  <div>
                    <div className="cinematic-stat-val" style={{ color: '#0ea5e9' }}>24/7</div>
                    <div className="cinematic-stat-lbl">Care &amp; Support</div>
                  </div>
                </div>
              </div>

            </section>

            {/* ── NEW FEATURE: INTERACTIVE PET WELLNESS & LIFESTYLE MATCH HUB ── */}
            <section id="pet-wellness-hub" style={{ marginTop: '50px' }}>
              <div className="section-header-wrap" style={{ textAlign: 'center', justifyContent: 'center', marginBottom: '36px' }}>
                <div>
                  <span className="badge-sky"><i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight: '6px' }}></i> Smart Companion Hub</span>
                  <h2 style={{ marginTop: '10px', fontSize: '2.2rem' }}>Interactive <span className="gradient-text">Care & Lifestyle</span> Matcher</h2>
                  <p style={{ color: 'var(--text-muted)', maxWidth: '620px', margin: '8px auto 0' }}>
                    Personalized symptom guidance, breed lifestyle compatibility quiz, and instant clinical pathways for your furry and feathered companions.
                  </p>
                </div>
              </div>

              {/* 2-Column Grid: Symptom Matrix on Left, Compatibility Quiz on Right */}
              <div className="home-interactive-feature-grid">
                
                {/* Feature Card 1: Instant Pet Care & Symptom Pathway */}
                <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-xl)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div className="widget-icon-circle widget-icon-emerald" style={{ width: '42px', height: '42px', fontSize: '1.1rem' }}>
                      <i className="fa-solid fa-stethoscope"></i>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Instant Symptom & Care Pathway</h3>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: '2px 0 0' }}>Select a symptom to see veterinarian-approved protocol</p>
                    </div>
                  </div>

                  {/* Symptom Filter Chips */}
                  <div className="home-symptom-chips">
                    {[
                      { id: 'itchy', label: 'Itchy Skin / Scratching', icon: 'fa-paw' },
                      { id: 'diet', label: 'Sensitive Stomach / Picky', icon: 'fa-bowl-food' },
                      { id: 'joints', label: 'Joint Stiffness / Limping', icon: 'fa-bone' },
                      { id: 'energy', label: 'High Energy / Anxiety', icon: 'fa-bolt' }
                    ].map(sym => (
                      <button
                        key={sym.id}
                        className={`home-sym-chip ${homeSymptomFocus === sym.id ? 'active' : ''}`}
                        onClick={() => {
                          setHomeSymptomFocus(sym.id);
                          if (window.SoundEngine) window.SoundEngine.playClicker();
                        }}
                      >
                        <i className={`fa-solid ${sym.icon}`}></i>
                        <span>{sym.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Dynamic Symptom Solution Panel */}
                  <div className="home-sym-solution-box">
                    {homeSymptomFocus === 'itchy' && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontWeight: '800', color: '#10b981', fontSize: '0.9rem' }}>
                            <i className="fa-solid fa-circle-check" style={{ marginRight: '6px' }}></i> Recommended Protocol
                          </span>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontWeight: '700' }}>Mild to Moderate</span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.6', margin: '0 0 12px' }}>
                          Interdigital itching and red skin folds are often triggered by seasonal grass pollens or chicken protein sensitivities.
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                          <span className="hero-trust-chip"><i className="fa-solid fa-pump-medical" style={{ color: '#0ea5e9' }}></i> Chlorhexidine Foam Wash</span>
                          <span className="hero-trust-chip"><i className="fa-solid fa-droplet" style={{ color: '#f59e0b' }}></i> Pure Wild Alaskan Salmon Oil</span>
                        </div>
                        <button className="btn-sky-outline" style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }} onClick={() => setActiveTab('vet')}>
                          <i className="fa-solid fa-calendar-check" style={{ marginRight: '6px' }}></i> Book Dermatology Telehealth Visit
                        </button>
                      </div>
                    )}

                    {homeSymptomFocus === 'diet' && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontWeight: '800', color: '#0ea5e9', fontSize: '0.9rem' }}>
                            <i className="fa-solid fa-circle-check" style={{ marginRight: '6px' }}></i> Nutrition & Digestion Guide
                          </span>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(14,165,233,0.15)', color: '#0ea5e9', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontWeight: '700' }}>Dietary Adjustment</span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.6', margin: '0 0 12px' }}>
                          Switch to single-source novel proteins with prebiotic pumpkin purée to soothe the mucosal barrier.
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                          <span className="hero-trust-chip"><i className="fa-solid fa-fish" style={{ color: '#10b981' }}></i> Single Protein Hydrolyzed Kibble</span>
                          <span className="hero-trust-chip"><i className="fa-solid fa-seedling" style={{ color: '#8b5cf6' }}></i> Organic Probiotic Chews</span>
                        </div>
                        <button className="btn-sky-outline" style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }} onClick={() => setActiveTab('products')}>
                          <i className="fa-solid fa-bag-shopping" style={{ marginRight: '6px' }}></i> Browse Sensitive Digestion Food
                        </button>
                      </div>
                    )}

                    {homeSymptomFocus === 'joints' && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontWeight: '800', color: '#f59e0b', fontSize: '0.9rem' }}>
                            <i className="fa-solid fa-circle-check" style={{ marginRight: '6px' }}></i> Orthopedic Care Protocol
                          </span>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontWeight: '700' }}>Preventive / Senior</span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.6', margin: '0 0 12px' }}>
                          Relieve stiffness after sleeping and support synovial fluid regeneration with pharmaceutical Glucosamine + Chondroitin.
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                          <span className="hero-trust-chip"><i className="fa-solid fa-capsules" style={{ color: '#f59e0b' }}></i> Joint Max Plus Chews</span>
                          <span className="hero-trust-chip"><i className="fa-solid fa-bed" style={{ color: '#0ea5e9' }}></i> Orthopedic Memory Foam Bed</span>
                        </div>
                        <button className="btn-sky-outline" style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }} onClick={() => setActiveTab('vet')}>
                          <i className="fa-solid fa-user-doctor" style={{ marginRight: '6px' }}></i> Consult Orthopedic Vet (Dr. Jenkins)
                        </button>
                      </div>
                    )}

                    {homeSymptomFocus === 'energy' && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontWeight: '800', color: '#8b5cf6', fontSize: '0.9rem' }}>
                            <i className="fa-solid fa-circle-check" style={{ marginRight: '6px' }}></i> Mental Enrichment & Training
                          </span>
                          <span style={{ fontSize: '0.75rem', background: 'rgba(139,92,246,0.15)', color: '#8b5cf6', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontWeight: '700' }}>Behavioral</span>
                        </div>
                        <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.6', margin: '0 0 12px' }}>
                          20 minutes of scent puzzle work burns more mental energy than a 60-minute walk. Try licki-mats and soothing chamomile calmers.
                        </p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                          <span className="hero-trust-chip"><i className="fa-solid fa-puzzle-piece" style={{ color: '#8b5cf6' }}></i> Level 2 Interactive Scent Mat</span>
                          <span className="hero-trust-chip"><i className="fa-solid fa-cannabis" style={{ color: '#10b981' }}></i> Hemp Calming Soft Chews</span>
                        </div>
                        <button className="btn-sky-outline" style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }} onClick={() => setActiveTab('community')}>
                          <i className="fa-solid fa-comments" style={{ marginRight: '6px' }}></i> Read Training Stories in Community
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Feature Card 2: Interactive Lifestyle & Breed Matcher */}
                <div className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-xl)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div className="widget-icon-circle widget-icon-sky" style={{ width: '42px', height: '42px', fontSize: '1.1rem' }}>
                      <i className="fa-solid fa-heart-circle-check"></i>
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Companion Compatibility Matcher</h3>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', margin: '2px 0 0' }}>Find the ideal pet match for your home and lifestyle</p>
                    </div>
                  </div>

                  {/* Quiz Option 1: Living Space */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                      1. Your Living Environment:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      {[
                        { id: 'apartment', label: 'Apartment', icon: 'fa-building' },
                        { id: 'house', label: 'House / Yard', icon: 'fa-house' },
                        { id: 'farm', label: 'Spacious / Farm', icon: 'fa-tree' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          className={`quiz-selector-btn ${homeQuizSpace === opt.id ? 'active' : ''}`}
                          onClick={() => {
                            setHomeQuizSpace(opt.id);
                            if (window.SoundEngine) window.SoundEngine.playClicker();
                          }}
                        >
                          <i className={`fa-solid ${opt.icon}`}></i> {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quiz Option 2: Activity Level */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                      2. Your Daily Routine & Activity Level:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      {[
                        { id: 'relaxed', label: 'Relaxed / Cozy', icon: 'fa-mug-hot' },
                        { id: 'moderate', label: 'Moderate Play', icon: 'fa-person-walking' },
                        { id: 'active', label: 'High Energy Run', icon: 'fa-person-running' }
                      ].map(opt => (
                        <button
                          key={opt.id}
                          className={`quiz-selector-btn ${homeQuizActivity === opt.id ? 'active' : ''}`}
                          onClick={() => {
                            setHomeQuizActivity(opt.id);
                            if (window.SoundEngine) window.SoundEngine.playClicker();
                          }}
                        >
                          <i className={`fa-solid ${opt.icon}`}></i> {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Match Outcome Box */}
                  <div className="home-quiz-match-box">
                    {(() => {
                      let match = {
                        name: 'Barnaby Hopps (Holland Lop)',
                        species: 'Rabbit',
                        fit: '99% Perfect Match',
                        reason: 'Ideal for quiet apartment living, litter-box trainable, gentle and affectionate.',
                        img: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=300&q=80'
                      };

                      if (homeQuizSpace === 'house' && homeQuizActivity === 'active') {
                        match = {
                          name: 'Maximus (Golden Retriever)',
                          species: 'Dog',
                          fit: '98% Perfect Match',
                          reason: 'Thrives with an active yard, hiking partner, friendly with entire family.',
                          img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80'
                        };
                      } else if (homeQuizSpace === 'apartment' && homeQuizActivity === 'relaxed') {
                        match = {
                          name: 'Luna Frost (Persian Mix)',
                          species: 'Cat',
                          fit: '97% Perfect Match',
                          reason: 'Loves sunbeams, peaceful nap routines, and low vocalization.',
                          img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80'
                        };
                      } else if (homeQuizActivity === 'active') {
                        match = {
                          name: 'Bella & Milo (Husky / Shepherd Mix)',
                          species: 'Dog',
                          fit: '96% Perfect Match',
                          reason: 'High endurance, agile, loves trail runs and agility courses.',
                          img: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=300&q=80'
                        };
                      } else if (homeQuizSpace === 'farm') {
                        match = {
                          name: 'Rio & Sky (Parrot Pair)',
                          species: 'Bird',
                          fit: '95% Perfect Match',
                          reason: 'Loves open room flight space, cheerful whistlers, highly social.',
                          img: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=300&q=80'
                        };
                      }

                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <img src={match.img} alt={match.name} style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '2px solid var(--primary-400)' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontWeight: '800', fontSize: '0.96rem' }}>{match.name}</span>
                              <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: '800' }}>{match.fit}</span>
                            </div>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '3px 0 8px', lineHeight: '1.4' }}>{match.reason}</p>
                            <button className="btn-sky-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }} onClick={() => { setActiveTab('shelter'); if (window.SoundEngine) window.SoundEngine.playClicker(); }}>
                              <i className="fa-solid fa-paw" style={{ marginRight: '6px' }}></i> Meet Rescue Animals
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

              </div>
            </section>

            {/* Quick Feature Highlights */}
            <section style={{ marginTop: '60px' }}>
              <div className="section-header-wrap" style={{ textAlign: 'center', justifyContent: 'center' }}>
                <div>
                  <span className="badge-sky">Comprehensive Ecosystem</span>
                  <h2 style={{ marginTop: '8px' }}>Designed for Every Stage of Pet Care</h2>
                </div>
              </div>

              <div className="pet-hub-grid">
                <div className="glass-panel glass-card-hover" style={{ padding: '26px', cursor: 'pointer' }} onClick={() => handleRoleSwitch('pet-owner')}>
                  <div className="role-icon-box"><i className="fa-solid fa-utensils"></i></div>
                  <h3>Smart Feeding Calculator</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
                    Calibrate daily caloric and gram intake tailored to puppies, adults, seniors, and active breeds.
                  </p>
                </div>

                <div className="glass-panel glass-card-hover" style={{ padding: '26px', cursor: 'pointer' }} onClick={() => setActiveTab('products')}>
                  <div className="role-icon-box"><i className="fa-solid fa-tags"></i></div>
                  <h3>Curated Product Showcase</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
                    Explore top-rated organic food, indestructible chew toys, orthopedic bedding, and health vitamins.
                  </p>
                </div>

                <div className="glass-panel glass-card-hover" style={{ padding: '26px', cursor: 'pointer' }} onClick={() => handleRoleSwitch('shelter')}>
                  <div className="role-icon-box"><i className="fa-solid fa-hand-holding-heart"></i></div>
                  <h3>Rescue & Adoption Match</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>
                    Browse adorable rescue pets with client-side filters for dogs, cats, rabbits, and birds.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ==================================================================
            TAB 2: PET OWNER PORTAL (SRS 1.6: Pet Profile, Feeding, Grooming, Health & Training)
            ================================================================== */}
        {activeTab === 'pet-owner' && (
          <div>
            <div className="section-header-wrap" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div className="section-title-box">
                  <span className="badge-sky">Pet Owner Dashboard</span>
                  <h2>Welcome, <span className="gradient-text">{user.firstName || 'Pet Parent'}</span> & <span style={{ color: 'var(--primary-500)' }}>{petForm.name}</span></h2>
                  <p>Manage your furry companion's health profiles, nutritional guides, video care, and training.</p>
                </div>

                {/* Dedicated Active Pet Profile Badge & Add Pet Profile Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-surface)', padding: '8px 18px', borderRadius: 'var(--radius-full)', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    <img 
                      src={petForm.photo} 
                      alt={petForm.name} 
                      style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-400)' }} 
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&q=80'; }} 
                    />
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.98rem', color: 'var(--text-main)' }}>{petForm.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--primary-500)', fontWeight: '600' }}>{petForm.species} • {petForm.breed}</div>
                    </div>
                  </div>

                  <button 
                    className="btn-sky-primary" 
                    style={{ padding: '10px 20px', fontSize: '0.88rem', fontWeight: '700', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(14,165,233,0.35)' }}
                    onClick={() => {
                      setAddPetModalOpen(true);
                      if (window.SoundEngine) window.SoundEngine.playClicker();
                    }}
                  >
                    <i className="fa-solid fa-plus-circle"></i> Add Pet Profile
                  </button>
                </div>
              </div>

              {/* Clean Dedicated Subnavigation Tabs (No numbers or counts per user request) */}
              <div className="portal-subnav glass-panel" style={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
                <button className={`portal-subnav-btn ${petOwnerSubTab === 'profile' ? 'active' : ''}`} onClick={() => { setPetOwnerSubTab('profile'); if (window.SoundEngine) window.SoundEngine.playClicker(); }}>
                  <i className="fa-solid fa-id-card"></i> Pet Profile
                </button>
                <button className={`portal-subnav-btn ${petOwnerSubTab === 'medical' ? 'active' : ''}`} onClick={() => { setPetOwnerSubTab('medical'); if (window.SoundEngine) window.SoundEngine.playClicker(); }}>
                  <i className="fa-solid fa-file-waveform"></i> Medical History
                </button>
                <button className={`portal-subnav-btn ${petOwnerSubTab === 'vaccines' ? 'active' : ''}`} onClick={() => { setPetOwnerSubTab('vaccines'); if (window.SoundEngine) window.SoundEngine.playClicker(); }}>
                  <i className="fa-solid fa-syringe"></i> Vaccination Info
                </button>
                <button className={`portal-subnav-btn ${petOwnerSubTab === 'vet-appts' ? 'active' : ''}`} onClick={() => { setPetOwnerSubTab('vet-appts'); if (window.SoundEngine) window.SoundEngine.playClicker(); }}>
                  <i className="fa-solid fa-user-doctor"></i> Vet Appointments
                </button>
                <button className={`portal-subnav-btn ${petOwnerSubTab === 'grooming-appts' ? 'active' : ''}`} onClick={() => { setPetOwnerSubTab('grooming-appts'); if (window.SoundEngine) window.SoundEngine.playClicker(); }}>
                  <i className="fa-solid fa-scissors"></i> Grooming Appointments
                </button>
                <button className={`portal-subnav-btn ${petOwnerSubTab === 'tips' ? 'active' : ''}`} onClick={() => { setPetOwnerSubTab('tips'); if (window.SoundEngine) window.SoundEngine.playClicker(); }}>
                  <i className="fa-solid fa-lightbulb"></i> Care Tips & Training
                </button>
              </div>
            </div>

            {/* ==================================================================
                SUB-VIEW 1: PET PROFILE & EDIT FORM
                ================================================================== */}
            {petOwnerSubTab === 'profile' && (
              <div className="hero-grid" style={{ alignItems: 'start' }}>
                {/* Dynamic Display Card */}
                <div className="glass-panel" style={{ padding: '30px' }}>
                  <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '24px' }}>
                    <img 
                      src={petForm.photo} 
                      alt={petForm.name} 
                      style={{ width: '95px', height: '95px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-400)', boxShadow: '0 4px 15px rgba(14,165,233,0.3)' }} 
                    />
                    <div>
                      <span className="badge-sky">{petForm.species}</span>
                      <h3 style={{ fontSize: '1.75rem', marginTop: '4px' }}>{petForm.name}</h3>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>{petForm.breed} • {petForm.age}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '2px' }}>
                        <i className="fa-solid fa-microchip" style={{ marginRight: '4px' }}></i> Chip ID: {petForm.microchip}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Weight</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary-600)' }}>{petForm.weight}</div>
                    </div>
                    <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Vaccines</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#10b981' }}><i className="fa-solid fa-shield-check"></i> Current</div>
                    </div>
                    <div style={{ padding: '12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Allergies</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-muted)' }}>{petForm.allergies || 'None'}</div>
                    </div>
                  </div>

                  <div style={{ padding: '16px', background: 'rgba(14, 165, 233, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(14, 165, 233, 0.2)', marginBottom: '20px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '4px' }}>
                      <i className="fa-solid fa-shield-virus" style={{ color: 'var(--primary-500)', marginRight: '6px' }}></i>
                      Active Immunity Status:
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{petForm.vaccinationInfo}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary-600)', marginTop: '8px', fontWeight: '600' }}>
                      Next Booster Review: Nov 18, 2026
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-sky-primary" style={{ flex: 1 }} onClick={() => {
                      if (window.PDFEngine) window.PDFEngine.generateHealthCardPDF(petForm, vaccineRecords, medicalRecords);
                      else addToast(`Exported ${petForm.name}'s Health Passport!`, 'fa-file-pdf');
                    }}>
                      <i className="fa-solid fa-file-pdf"></i> Export Health Passport (PDF)
                    </button>
                  </div>
                </div>

                {/* Edit Pet Info Form (SRS 1.6 Form Requirement) */}
                <div className="glass-panel" style={{ padding: '30px' }}>
                  <h3><i className="fa-solid fa-pen-to-square" style={{ color: 'var(--primary-500)', marginRight: '8px' }}></i> Edit Pet Profile Records</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>Update pet details, photo, allergies, and microchip number.</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group-custom">
                      <label className="form-label-custom">Pet Name</label>
                      <input 
                        type="text" 
                        id="edit-pet-name"
                        className="input-sky" 
                        value={petForm.name} 
                        onChange={(e) => setPetForm({ ...petForm, name: e.target.value })} 
                      />
                    </div>
                    <div className="form-group-custom">
                      <label className="form-label-custom">Species</label>
                      <select 
                        className="input-sky" 
                        value={petForm.species} 
                        onChange={(e) => setPetForm({ ...petForm, species: e.target.value })}
                      >
                        <option>Dog</option>
                        <option>Cat</option>
                        <option>Rabbit</option>
                        <option>Bird</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group-custom">
                      <label className="form-label-custom">Breed</label>
                      <input 
                        type="text" 
                        id="edit-pet-breed"
                        className="input-sky" 
                        value={petForm.breed} 
                        onChange={(e) => setPetForm({ ...petForm, breed: e.target.value })} 
                      />
                    </div>
                    <div className="form-group-custom">
                      <label className="form-label-custom">Age</label>
                      <input 
                        type="text" 
                        id="edit-pet-age"
                        className="input-sky" 
                        value={petForm.age} 
                        onChange={(e) => setPetForm({ ...petForm, age: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group-custom">
                      <label className="form-label-custom">Weight (kg / lbs)</label>
                      <input 
                        type="text" 
                        className="input-sky" 
                        value={petForm.weight} 
                        onChange={(e) => setPetForm({ ...petForm, weight: e.target.value })} 
                      />
                    </div>
                    <div className="form-group-custom">
                      <label className="form-label-custom">Microchip Number</label>
                      <input 
                        type="text" 
                        className="input-sky" 
                        value={petForm.microchip} 
                        onChange={(e) => setPetForm({ ...petForm, microchip: e.target.value })} 
                      />
                    </div>
                  </div>

                  <div className="form-group-custom">
                    <label className="form-label-custom">Known Allergies / Diet Restrictions</label>
                    <input 
                      type="text" 
                      className="input-sky" 
                      value={petForm.allergies} 
                      onChange={(e) => setPetForm({ ...petForm, allergies: e.target.value })} 
                    />
                  </div>

                  <div className="form-group-custom">
                    <label className="form-label-custom"><i className="fa-solid fa-image" style={{ marginRight: '6px', color: 'var(--primary-500)' }}></i> Pet Photo (Choose File)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      {petForm.photo && <img src={petForm.photo} alt="preview" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-400)' }} onError={(e) => { e.target.style.display='none'; }} />}
                      <input 
                        type="file" 
                        accept="image/*"
                        className="input-sky"
                        style={{ flex: 1, padding: '8px' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          if (file.size > 5 * 1024 * 1024) {
                            markInvalidField(e.target, 'Image size must be under 5 MB');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (ev) => setPetForm({ ...petForm, photo: ev.target.result });
                          reader.readAsDataURL(file);
                        }}
                      />
                    </div>
                    <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '5px' }}>Accepted: JPG, PNG, WEBP — Max 5 MB</p>
                  </div>

                  <button className="btn-sky-primary" style={{ width: '100%' }} onClick={() => {
                    if (!petForm.name.trim()) {
                      markInvalidField(document.getElementById('edit-pet-name'), 'Pet name cannot be empty!');
                      return;
                    }
                    if (!petForm.breed.trim()) {
                      markInvalidField(document.getElementById('edit-pet-breed'), 'Please enter pet breed!');
                      return;
                    }
                    if (!petForm.age.trim()) {
                      markInvalidField(document.getElementById('edit-pet-age'), 'Please enter pet age!');
                      return;
                    }
                    if (window.SoundEngine) window.SoundEngine.playChime();
                    setProfileUpdateSuccess(true);
                    setTimeout(() => setProfileUpdateSuccess(false), 3000);
                  }}>
                    <i className="fa-solid fa-floppy-disk" style={{ marginRight: '7px' }}></i>Save Profile Changes
                  </button>
                </div>
              </div>
            )}

            {/* ==================================================================
                SUB-VIEW 2: MEDICAL HISTORY (View Consultations & Log New Record)
                ================================================================== */}
            {petOwnerSubTab === 'medical' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3><i className="fa-solid fa-file-waveform" style={{ color: 'var(--primary-500)', marginRight: '8px' }}></i> Medical History for {petForm.name}</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Complete chronological clinical consultations, diagnoses, prescriptions, and discharge summaries.</p>
                  </div>
                  <button className="btn-sky-primary" onClick={() => setMedModalOpen(true)}>
                    <i className="fa-solid fa-plus"></i> Add New Medical Entry (Modal)
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '32px' }}>
                  {medicalRecords.map(rec => (
                    <div key={rec.id} className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid var(--primary-500)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span className="badge-sky">{rec.id}</span>
                          <strong style={{ fontSize: '1.1rem' }}>{rec.diagnosis}</strong>
                        </div>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}><i className="fa-solid fa-calendar-day"></i> {rec.date}</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        <div><i className="fa-solid fa-user-doctor" style={{ color: 'var(--primary-500)', marginRight: '6px' }}></i> <strong>Attending Vet:</strong> {rec.vetName}</div>
                        <div><i className="fa-solid fa-hospital" style={{ color: 'var(--primary-500)', marginRight: '6px' }}></i> <strong>Clinic:</strong> {rec.clinic}</div>
                        <div><i className="fa-solid fa-temperature-half" style={{ color: 'var(--primary-500)', marginRight: '6px' }}></i> <strong>Temperature:</strong> {rec.temperature}</div>
                      </div>

                      <div style={{ padding: '12px 16px', background: 'rgba(14, 165, 233, 0.06)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', fontSize: '0.85rem', marginBottom: '10px' }}>
                        <strong>Prescriptions & Therapy:</strong> {rec.medications}
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <strong>Clinical Observations:</strong> {rec.notes}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Medical records list shown, form only via modal */}
              </div>
            )}

            {/* ==================================================================
                SUB-VIEW 3: VACCINATION INFORMATION & TRACKER
                ================================================================== */}
            {petOwnerSubTab === 'vaccines' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3><i className="fa-solid fa-syringe" style={{ color: 'var(--primary-500)', marginRight: '8px' }}></i> Vaccination Tracker for {petForm.name}</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Keep track of core vaccines, dates administered, and upcoming booster renewal deadlines.</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-sky-primary" onClick={() => {
                      if (window.PDFEngine) window.PDFEngine.generateVaccineCertPDF(petForm, vaccineRecords);
                      else addToast('Vaccine Certificate generated!', 'fa-file-shield');
                    }}>
                      <i className="fa-solid fa-file-pdf"></i> Download Certificate (PDF)
                    </button>
                    <button className="btn-sky-outline" onClick={() => setVacModalOpen(true)}>
                      <i className="fa-solid fa-plus"></i> Record Vaccine (Modal)
                    </button>
                  </div>
                </div>

                {/* Vaccines Table */}
                <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto', marginBottom: '30px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <th style={{ padding: '12px' }}>Vaccine Name</th>
                        <th style={{ padding: '12px' }}>Administered Date</th>
                        <th style={{ padding: '12px' }}>Next Booster Due</th>
                        <th style={{ padding: '12px' }}>Administering Clinic</th>
                        <th style={{ padding: '12px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vaccineRecords.map(vac => (
                        <tr key={vac.id} style={{ borderBottom: '1px solid var(--border-glass)', fontSize: '0.9rem' }}>
                          <td style={{ padding: '14px 12px', fontWeight: '700' }}>
                            <i className="fa-solid fa-shield-virus" style={{ color: 'var(--primary-500)', marginRight: '8px' }}></i>
                            {vac.name}
                          </td>
                          <td style={{ padding: '14px 12px', color: 'var(--text-muted)' }}>{vac.administeredDate}</td>
                          <td style={{ padding: '14px 12px', fontWeight: '600', color: 'var(--primary-700)' }}>{vac.dueDate}</td>
                          <td style={{ padding: '14px 12px', color: 'var(--text-muted)' }}>{vac.clinic} ({vac.vet})</td>
                          <td style={{ padding: '14px 12px' }}>
                            <span style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '6px', 
                              padding: '4px 12px', 
                              borderRadius: 'var(--radius-full)', 
                              fontSize: '0.78rem', 
                              fontWeight: '700',
                              background: vac.status.includes('Due') ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              color: vac.status.includes('Due') ? '#d97706' : '#059669'
                            }}>
                              <i className={`fa-solid ${vac.status.includes('Due') ? 'fa-clock' : 'fa-check-circle'}`}></i>
                              {vac.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add New Vaccine Form */}
                <div className="glass-panel" style={{ padding: '28px', maxWidth: '750px' }}>
                  <h4><i className="fa-solid fa-plus-circle" style={{ color: 'var(--primary-500)', marginRight: '8px' }}></i> Record New Vaccination</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '18px' }}>Log new immunization booster received by {petForm.name}.</p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group-custom">
                      <label className="form-label-custom">Vaccine Name</label>
                      <input type="text" className="input-sky" placeholder="e.g. Canine Influenza H3N2" value={newVacForm.name} onChange={(e) => setNewVacForm({ ...newVacForm, name: e.target.value })} />
                    </div>
                    <div className="form-group-custom">
                      <label className="form-label-custom">Administering Vet</label>
                      <input type="text" className="input-sky" placeholder="e.g. Dr. Sarah Jenkins" value={newVacForm.vet} onChange={(e) => setNewVacForm({ ...newVacForm, vet: e.target.value })} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div className="form-group-custom">
                      <label className="form-label-custom">Date Administered</label>
                      <input type="date" className="input-sky" value={newVacForm.administeredDate} onChange={(e) => setNewVacForm({ ...newVacForm, administeredDate: e.target.value })} />
                    </div>
                    <div className="form-group-custom">
                      <label className="form-label-custom">Next Booster Due Date</label>
                      <input type="date" className="input-sky" value={newVacForm.dueDate} onChange={(e) => setNewVacForm({ ...newVacForm, dueDate: e.target.value })} />
                    </div>
                  </div>

                  <button className="btn-sky-primary" style={{ width: '100%' }} onClick={() => {
                    if (!newVacForm.name.trim()) {
                      addToast('Please enter the vaccine name', 'fa-triangle-exclamation', 'warning');
                      return;
                    }
                    const newVac = {
                      id: `VAC-${vaccineRecords.length + 1}`,
                      name: newVacForm.name,
                      administeredDate: newVacForm.administeredDate || 'Aug 25, 2026',
                      dueDate: newVacForm.dueDate || 'Aug 25, 2027',
                      clinic: 'FurEver Central Clinic',
                      vet: newVacForm.vet || 'Dr. Sarah Jenkins',
                      status: 'Valid / Up-to-Date'
                    };
                    setVaccineRecords([...vaccineRecords, newVac]);
                    setNewVacForm({ name: '', administeredDate: '', dueDate: '', vet: '' });
                    if (window.SoundEngine) window.SoundEngine.playChime();
                    addToast(`Added ${newVac.name} to immunization records!`, 'fa-circle-check');
                  }}>
                    Save Vaccine Record
                  </button>
                </div>
              </div>
            )}

            {/* ==================================================================
                SUB-VIEW 4: VET APPOINTMENTS (PREMIUM UPGRADE)
                ================================================================== */}
            {petOwnerSubTab === 'vet-appts' && (
              <div>

                {/* ── Top Header Row ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3><i className="fa-solid fa-calendar-check" style={{ color: 'var(--primary-500)', marginRight: '8px' }}></i> Vet Appointments for <span style={{ color: '#38bdf8' }}>{petForm.name}</span></h3>
                    <p style={{ color: 'var(--text-muted)' }}>Track upcoming visits, pre-visit checklists, doctor details & clinic directions.</p>
                  </div>
                  <button className="btn-sky-primary" onClick={() => {
                    setActiveTab('vet');
                    setVetViewMode('directory');
                    window._cameFromPetOwner = true;
                    addToast('Select a doctor and book your appointment!', 'fa-user-doctor');
                    if (window.SoundEngine) window.SoundEngine.playClicker();
                  }}>
                    <i className="fa-solid fa-plus"></i> Book New Appointment
                  </button>
                </div>

                {/* ── Stats Summary Banner ── */}
                <div className="apt-stats-banner">
                  <div className="apt-stat-pill">
                    <div className="apt-stat-icon apt-stat-blue"><i className="fa-solid fa-calendar-check"></i></div>
                    <div>
                      <div className="apt-stat-num">{ownerVetAppointments.length}</div>
                      <div className="apt-stat-label">Total Appointments</div>
                    </div>
                  </div>
                  <div className="apt-stat-pill">
                    <div className="apt-stat-icon apt-stat-green"><i className="fa-solid fa-circle-check"></i></div>
                    <div>
                      <div className="apt-stat-num">{ownerVetAppointments.filter(a => a.status === 'Confirmed').length}</div>
                      <div className="apt-stat-label">Confirmed</div>
                    </div>
                  </div>
                  <div className="apt-stat-pill">
                    <div className="apt-stat-icon apt-stat-amber"><i className="fa-solid fa-rotate"></i></div>
                    <div>
                      <div className="apt-stat-num">{ownerVetAppointments.filter(a => a.status === 'Rescheduled').length}</div>
                      <div className="apt-stat-label">Rescheduled</div>
                    </div>
                  </div>
                  <div className="apt-stat-pill">
                    <div className="apt-stat-icon apt-stat-purple"><i className="fa-solid fa-user-doctor"></i></div>
                    <div>
                      <div className="apt-stat-num">15</div>
                      <div className="apt-stat-label">Available Doctors</div>
                    </div>
                  </div>
                </div>

                {/* ── Appointment Cards Grid ── */}
                <div className="apt-cards-grid">
                  {ownerVetAppointments.map((apt, idx) => {
                    const isRescheduled = apt.status === 'Rescheduled';
                    const checklistItems = [
                      { label: 'Bring pet health records', done: true },
                      { label: 'Fast pet 4 hrs if surgery', done: idx % 2 === 0 },
                      { label: 'Confirm clinic location', done: true },
                      { label: 'Prepare questions for vet', done: false }
                    ];
                    const doneCount = checklistItems.filter(c => c.done).length;
                    const progress = Math.round((doneCount / checklistItems.length) * 100);

                    return (
                      <div key={apt.id} className={`apt-premium-card ${isRescheduled ? 'apt-rescheduled' : ''}`}>

                        {/* Card Top: ID + Status */}
                        <div className="apt-card-top-row">
                          <div className="apt-id-badge">{apt.id}</div>
                          <span className={`apt-status-pill ${isRescheduled ? 'status-rescheduled' : 'status-confirmed'}`}>
                            <i className={`fa-solid ${isRescheduled ? 'fa-rotate' : 'fa-circle-check'}`}></i>
                            {apt.status}
                          </span>
                        </div>

                        {/* Doctor Avatar + Name Row */}
                        <div className="apt-doctor-row">
                          <div className="apt-doctor-avatar">
                            <i className="fa-solid fa-user-doctor"></i>
                          </div>
                          <div>
                            <div className="apt-doctor-name">{apt.doctorName}</div>
                            <div className="apt-doctor-clinic"><i className="fa-solid fa-hospital"></i> {apt.clinic}</div>
                          </div>
                        </div>

                        {/* Date, Time, Countdown */}
                        <div className="apt-datetime-grid">
                          <div className="apt-dt-item">
                            <div className="apt-dt-icon"><i className="fa-solid fa-calendar"></i></div>
                            <div>
                              <div className="apt-dt-label">Date</div>
                              <div className="apt-dt-value">{apt.date}</div>
                            </div>
                          </div>
                          <div className="apt-dt-item">
                            <div className="apt-dt-icon"><i className="fa-solid fa-clock"></i></div>
                            <div>
                              <div className="apt-dt-label">Time Slot</div>
                              <div className="apt-dt-value">{apt.time}</div>
                            </div>
                          </div>
                          <div className="apt-dt-item apt-countdown-item">
                            <div className="apt-dt-icon apt-countdown-icon"><i className="fa-solid fa-hourglass-half"></i></div>
                            <div>
                              <div className="apt-dt-label">Countdown</div>
                              <div className="apt-countdown-badge">{idx === 0 ? '8 Days' : '24 Days'}</div>
                            </div>
                          </div>
                        </div>

                        {/* Reason for Visit */}
                        <div className="apt-reason-box">
                          <i className="fa-solid fa-notes-medical apt-reason-icon"></i>
                          <div>
                            <div className="apt-reason-label">Reason for Visit</div>
                            <div className="apt-reason-text">{apt.reason}</div>
                          </div>
                        </div>

                        {/* Pre-Visit Checklist with Progress */}
                        <div className="apt-checklist-wrap">
                          <div className="apt-checklist-header">
                            <span><i className="fa-solid fa-list-check"></i> Pre-Visit Checklist</span>
                            <span className="apt-checklist-progress-label">{doneCount}/{checklistItems.length} done</span>
                          </div>
                          <div className="apt-progress-bar-track">
                            <div className="apt-progress-bar-fill" style={{ width: progress + '%' }}></div>
                          </div>
                          <div className="apt-checklist-items">
                            {checklistItems.map((c, i) => (
                              <div key={i} className={`apt-check-item ${c.done ? 'checked' : ''}`}>
                                <i className={`fa-solid ${c.done ? 'fa-square-check' : 'fa-square'}`}></i>
                                <span>{c.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons Row */}
                        <div className="apt-actions-row">
                          <button className="apt-action-btn apt-btn-map" onClick={() => {
                            setSelectedAptForDirections(apt);
                            setTransitMode('driving');
                            setDirectionsModalOpen(true);
                            if (window.SoundEngine) window.SoundEngine.playClicker();
                          }}>
                            <i className="fa-solid fa-map-location-dot"></i> Directions
                          </button>
                          <a 
                            href="tel:+15559123849" 
                            className="apt-action-btn apt-btn-call" 
                            onClick={() => {
                              addToast(`Dialing ${apt.clinic}: (555) 912-3849`, 'fa-phone');
                              if (window.SoundEngine) window.SoundEngine.playClicker();
                            }}
                            title="Direct Call to Clinic"
                            style={{ textDecoration: 'none' }}
                          >
                            <i className="fa-solid fa-phone"></i> Call Clinic
                          </a>
                          <button className="apt-action-btn apt-btn-reschedule" onClick={() => {
                            setSelectedAptToReschedule(apt);
                            setRescheduleForm({ date: '2026-09-25', time: '10:00 AM - 10:45 AM', reason: 'Schedule Conflict', notes: '' });
                            setRescheduleModalOpen(true);
                            if (window.SoundEngine) window.SoundEngine.playClicker();
                          }}>
                            <i className="fa-solid fa-calendar-days"></i> Reschedule
                          </button>
                          <button className="apt-action-btn apt-btn-cancel" onClick={() => {
                            setOwnerVetAppointments(ownerVetAppointments.filter(a => a.id !== apt.id));
                            addToast('Appointment cancelled.', 'fa-ban');
                          }}>
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* ── Empty State ── */}
                {ownerVetAppointments.length === 0 && (
                  <div className="apt-empty-state">
                    <div className="apt-empty-icon"><i className="fa-solid fa-calendar-xmark"></i></div>
                    <h4>No Appointments Scheduled</h4>
                    <p>Book a vet appointment from our network of certified specialists.</p>
                    <button className="btn-sky-primary" onClick={() => { setActiveTab('vet'); setVetViewMode('directory'); }}>
                      <i className="fa-solid fa-plus"></i> Book Your First Appointment
                    </button>
                  </div>
                )}

              </div>
            )}


            {/* ==================================================================
                SUB-VIEW 5: GROOMING APPOINTMENTS (Manage & Book Spa Sessions)
                ================================================================== */}
            {petOwnerSubTab === 'grooming-appts' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3><i className="fa-solid fa-scissors" style={{ color: 'var(--primary-500)', marginRight: '8px' }}></i> Grooming Appointments & Spa Care for {petForm.name}</h3>
                    <p style={{ color: 'var(--text-muted)' }}>Manage professional bath, deshedding, haircut styling, and dental polishing appointments.</p>
                  </div>
                  <button className="btn-sky-primary" onClick={() => setGroomingModalOpen(true)}>
                    <i className="fa-solid fa-scissors"></i> Book Grooming Session
                  </button>
                </div>

                <div className="hero-grid" style={{ alignItems: 'start', marginBottom: '32px' }}>
                  {/* Active Grooming Bookings */}
                  <div className="glass-panel" style={{ padding: '28px' }}>
                    <h4 style={{ marginBottom: '16px' }}><i className="fa-solid fa-sparkles" style={{ color: 'var(--primary-500)', marginRight: '8px' }}></i> Scheduled Grooming Sessions</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {groomingBookings.map(grm => (
                        <div key={grm.id} style={{ padding: '18px', background: 'var(--bg-surface)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <strong style={{ fontSize: '1.05rem', color: 'var(--primary-700)' }}>{grm.service}</strong>
                            <span style={{ 
                              padding: '3px 10px', 
                              borderRadius: 'var(--radius-full)', 
                              fontSize: '0.75rem', 
                              fontWeight: '700',
                              background: grm.status === 'Upcoming' ? 'rgba(14, 165, 233, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              color: grm.status === 'Upcoming' ? '#0284c7' : '#059669'
                            }}>
                              {grm.status}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                            <i className="fa-solid fa-store" style={{ color: 'var(--primary-500)', marginRight: '6px' }}></i> {grm.groomer}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                            <i className="fa-solid fa-clock" style={{ color: 'var(--primary-500)', marginRight: '6px' }}></i> {grm.date} at {grm.time} • <strong>{grm.price}</strong>
                          </div>

                          {grm.status === 'Upcoming' && (
                            <button className="btn-sky-outline" style={{ padding: '6px 14px', fontSize: '0.8rem', marginTop: '6px' }} onClick={() => { setReminderModalData(grm); setReminderModalOpen(true); if (window.SoundEngine) window.SoundEngine.playClicker(); }}>
                              <i className="fa-solid fa-bell"></i> Send Reminder
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Grooming Spa Promo Panel */}
                  <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', borderRadius: 'var(--radius-lg)', position: 'relative', minHeight: '380px' }}>
                    <img
                      src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80"
                      alt="Premium Pet Grooming Spa"
                      style={{ width: '100%', height: '100%', minHeight: '380px', objectFit: 'cover', display: 'block' }}
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80'; }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)',
                      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                      padding: '28px'
                    }}>
                      <span style={{ display: 'inline-block', background: 'var(--primary-500)', color: '#fff', padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '700', marginBottom: '10px', width: 'fit-content' }}>
                        Premium Spa Services
                      </span>
                      <h3 style={{ color: '#fff', margin: '0 0 6px', fontSize: '1.35rem', fontWeight: '800', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
                        Luxury Pet Grooming &amp; Spa
                      </h3>
                      <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.85rem', margin: '0 0 18px', lineHeight: '1.5' }}>
                        Professional bath, breed styling, deshedding, nail care, ear cleanse &amp; more — booked with one click.
                      </p>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '18px' }}>
                        {['Luxury Bath', 'Breed Styling', 'Nail Grinding', 'Teeth Polish', 'Oatmeal Spa'].map(tag => (
                          <span key={tag} style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(6px)', color: '#fff', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '600', border: '1px solid rgba(255,255,255,0.25)' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <button
                        className="btn-sky-primary"
                        style={{ alignSelf: 'flex-start', padding: '10px 24px', fontWeight: '700', fontSize: '0.92rem', boxShadow: '0 4px 16px rgba(14,165,233,0.45)' }}
                        onClick={() => { setGroomingModalOpen(true); if (window.SoundEngine) window.SoundEngine.playClicker(); }}
                      >
                        <i className="fa-solid fa-scissors"></i> Book Grooming Session
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================================
                SUB-VIEW 6: CARE TIPS, FEEDING MATRIX, VIDEOS & SOUNDBOARD
                ================================================================== */}
            {petOwnerSubTab === 'tips' && (
              <div>
                {/* 1. Nutrition Portion Calculator & Matrix */}
                <div className="hero-grid" style={{ alignItems: 'start', marginBottom: '36px' }}>
                  <div className="feeding-calc-panel glass-panel">
                    <span className="badge-sky">Interactive Nutrition Tool</span>
                    <h3 style={{ margin: '10px 0 16px' }}>Daily Portion Calculator</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                      <div>
                        <label className="form-label-custom">Pet Species</label>
                        <select className="input-sky" value={calcPetType} onChange={(e) => setCalcPetType(e.target.value)}>
                          <option value="dog">Canine (Dog)</option>
                          <option value="cat">Feline (Cat)</option>
                        </select>
                      </div>
                      <div>
                        <label className="form-label-custom">Life Stage</label>
                        <select className="input-sky" value={calcAgeGroup} onChange={(e) => setCalcAgeGroup(e.target.value)}>
                          <option value="puppy">Puppy / Kitten (0-12 Mo)</option>
                          <option value="adult">Adult (1-7 Years)</option>
                          <option value="senior">Senior (7+ Years)</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group-custom">
                      <label className="form-label-custom">Pet Weight: <strong>{calcWeight} kg ({Math.round(calcWeight * 2.204)} lbs)</strong></label>
                      <input 
                        type="range" 
                        min="2" 
                        max="60" 
                        value={calcWeight} 
                        onChange={(e) => setCalcWeight(Number(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--primary-500)' }}
                      />
                    </div>

                    <div className="form-group-custom">
                      <label className="form-label-custom">Daily Activity Level</label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {['low', 'moderate', 'high'].map(act => (
                          <button 
                            key={act} 
                            type="button" 
                            className={`filter-chip ${calcActivity === act ? 'active' : ''}`}
                            style={{ textTransform: 'capitalize' }}
                            onClick={() => setCalcActivity(act)}
                          >
                            {act}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Calculated Output Box */}
                    {(() => {
                      const res = calculateFoodGrams();
                      return (
                        <div className="calculator-result-box">
                          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary-700)', textTransform: 'uppercase' }}>
                            Recommended Daily Portion
                          </div>
                          <div className="calc-output-value">{res.grams} Grams / Day</div>
                          <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                            ≈ {res.cups} Measuring Cups ({res.calories} kcal/day)
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Feeding Guide Charts */}
                  <div className="glass-panel" style={{ padding: '28px' }}>
                    <h3><i className="fa-solid fa-chart-pie" style={{ color: 'var(--primary-500)', marginRight: '8px' }}></i> Clinical Feeding Guidelines</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
                      Caloric density standards formulated by veterinary nutritional specialists.
                    </p>

                    {content && content.feedingGuideMatrix && Object.entries(content.feedingGuideMatrix).map(([key, item]) => (
                      <div key={key} style={{ padding: '14px', background: 'var(--bg-surface)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <strong style={{ color: 'var(--primary-600)' }}>{item.title}</strong>
                          <span className="badge-sky">{item.mealsPerDay}</span>
                        </div>
                        <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{item.notes}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                          <strong>Target Protein:</strong> {item.proteinTarget} • <strong>Hydration:</strong> {item.waterGuideline}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Web Audio API Acoustic Soundboard */}
                <div className="glass-panel" style={{ padding: '26px', marginBottom: '32px', border: '1.5px solid var(--border-glow)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <span className="badge-sky">Web Audio API Tool</span>
                      <h4 style={{ fontSize: '1.25rem', marginTop: '4px' }}>Live Acoustic Pet Training Soundboard</h4>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Real-Time Frequency Audio Synthesizer</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    <div style={{ padding: '18px', background: 'var(--bg-surface)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.6rem', color: 'var(--primary-500)', marginBottom: '8px' }}><i className="fa-solid fa-hand-pointer"></i></div>
                      <div style={{ fontWeight: '700', marginBottom: '4px' }}>Training Clicker</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '12px' }}>Instant reward marker (1800Hz)</div>
                      <button className="btn-sky-primary" style={{ width: '100%', padding: '8px' }} onClick={() => window.SoundEngine && window.SoundEngine.playClicker()}>
                        Trigger Clicker
                      </button>
                    </div>

                    <div style={{ padding: '18px', background: 'var(--bg-surface)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.6rem', color: '#06b6d4', marginBottom: '8px' }}><i className="fa-solid fa-wind"></i></div>
                      <div style={{ fontWeight: '700', marginBottom: '4px' }}>Ultrasonic Whistle</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '12px' }}>High-pitch long distance recall</div>
                      <button className="btn-sky-primary" style={{ width: '100%', padding: '8px', background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }} onClick={() => window.SoundEngine && window.SoundEngine.playWhistle()}>
                        Blow Whistle
                      </button>
                    </div>

                    <div style={{ padding: '18px', background: 'var(--bg-surface)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.6rem', color: '#10b981', marginBottom: '8px' }}><i className="fa-solid fa-bell"></i></div>
                      <div style={{ fontWeight: '700', marginBottom: '4px' }}>Success Chime</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '12px' }}>Harmonic positive cue</div>
                      <button className="btn-sky-primary" style={{ width: '100%', padding: '8px', background: 'linear-gradient(135deg, #10b981, #059669)' }} onClick={() => window.SoundEngine && window.SoundEngine.playChime()}>
                        Play Chime
                      </button>
                    </div>

                    <div style={{ padding: '18px', background: 'var(--bg-surface)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                      <div style={{ fontSize: '1.6rem', color: '#6366f1', marginBottom: '8px' }}><i className="fa-solid fa-music"></i></div>
                      <div style={{ fontWeight: '700', marginBottom: '4px' }}>Calming Harmony</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '12px' }}>Acoustic relaxation chord</div>
                      <button className="btn-sky-primary" style={{ width: '100%', padding: '8px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }} onClick={() => window.SoundEngine && window.SoundEngine.playCalmingTone()}>
                        Soothe Pet
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Grooming Masterclass Videos */}
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '1.3rem', marginBottom: '16px' }}><i className="fa-solid fa-video" style={{ color: 'var(--primary-500)', marginRight: '8px' }}></i> Grooming Masterclass Video Tutorials</h4>
                  <div className="products-grid">
                    {content && content.groomingVideos && content.groomingVideos.map(video => (
                      <div key={video.id} className="video-card">
                        <div className="video-thumb-container" onClick={() => setActiveVideo(video)}>
                          <img src={video.thumbnail} alt={video.title} />
                          <div className="video-play-overlay">
                            <div className="play-circle-btn">
                              <i className="fa-solid fa-play"></i>
                            </div>
                          </div>
                          <span className="badge-sky" style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.8)', color: '#fff' }}>
                            {video.duration}
                          </span>
                        </div>

                        <div style={{ padding: '20px' }}>
                          <div className="product-category-lbl">{video.category}</div>
                          <h4 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>{video.title}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>{video.description}</p>
                          
                          <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '12px' }}>
                            <button className="btn-sky-outline" style={{ width: '100%', padding: '8px' }} onClick={() => setActiveVideo(video)}>
                              <i className="fa-solid fa-circle-play"></i> Watch Masterclass
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================
            TAB 3: PET PRODUCT SHOWCASE (SRS 1.6: 5 Categories, JSON, Sort, Filter, Search, Buy Now)
            ================================================================== */}
        {activeTab === 'products' && (
          <div>
            <div className="section-header-wrap">
              <div className="section-title-box">
                <span className="badge-sky">Curated Pet Marketplace</span>
                <h2>Pet Product <span className="gradient-text">Showcase</span></h2>
                <p>Explore vet-approved dog/cat foods, interactive toys, grooming kits, bedding, and nutritional supplements.</p>
              </div>

              {/* Sorting Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>Sort By:</span>
                <select 
                  className="input-sky" 
                  style={{ width: 'auto', padding: '8px 16px' }}
                  value={productSort}
                  onChange={(e) => setProductSort(e.target.value)}
                >
                  <option value="featured">Featured Picks</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* Catalog Toolbar: Live Search & Category Filter Chips */}
            <div className="catalog-toolbar glass-panel" style={{ padding: '18px 22px' }}>
              <div className="search-input-wrap">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input 
                  type="text" 
                  className="input-sky" 
                  placeholder="Search products by title, keyword, or animal type..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>

              <div className="category-filter-chips">
                {[
                  { label: 'All', icon: 'fa-layer-group' },
                  { label: 'Dog/Cat Food', icon: 'fa-bowl-food' },
                  { label: 'Toys', icon: 'fa-baseball-bat-ball' },
                  { label: 'Grooming Essentials', icon: 'fa-pump-soap' },
                  { label: 'Bedding and Apparel', icon: 'fa-shirt' },
                  { label: 'Health Supplements', icon: 'fa-prescription-bottle-medical' }
                ].map(cat => (
                  <button 
                    key={cat.label} 
                    className={`filter-chip ${selectedProductCategory === cat.label ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedProductCategory(cat.label);
                      if (window.SoundEngine) window.SoundEngine.playClicker();
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <i className={`fa-solid ${cat.icon}`}></i>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Marketplace Trust & Assurance Banner */}
            <div className="store-trust-strip glass-panel" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', padding: '14px 20px', margin: '18px 0 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(14,165,233,0.14)', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                  <i className="fa-solid fa-truck-fast"></i>
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--text-main)' }}>Express 2-Day Shipping</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Free delivery on orders $49+</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16,185,129,0.14)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--text-main)' }}>100% Vet Approved</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Certified medical grade quality</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(245,158,11,0.14)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                  <i className="fa-solid fa-rotate-left"></i>
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--text-main)' }}>30-Day Easy Returns</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>100% money back guarantee</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(99,102,241,0.14)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                  <i className="fa-solid fa-lock"></i>
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: '800', color: 'var(--text-main)' }}>256-Bit SSL Checkout</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Encrypted & secure payments</div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="products-grid">
              {filteredProducts.map(item => (
                <div key={item.id} className="product-card">
                  <div className="product-img-box">
                    <img src={item.image} alt={item.name} className="product-img" />
                    <span className="product-badge-tag"><i className="fa-solid fa-bolt" style={{ marginRight: '4px' }}></i>{item.badge}</span>
                  </div>

                  <div className="product-body">
                    <div className="product-category-lbl">
                      <i className="fa-solid fa-tag" style={{ marginRight: '5px', fontSize: '0.72rem', color: 'var(--primary-500)' }}></i>
                      {item.category}
                    </div>
                    <h3 className="product-title">{item.name}</h3>
                    <p className="product-desc">{item.description}</p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '14px', fontSize: '0.85rem' }}>
                      <div style={{ color: '#f59e0b', fontWeight: '700' }}>
                        <i className="fa-solid fa-star"></i> {item.rating}
                      </div>
                      <span style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>({item.reviews} verified reviews)</span>
                      <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#10b981', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <i className="fa-solid fa-circle-check"></i> In Stock
                      </span>
                    </div>

                    <div className="product-footer">
                      <div className="product-price">
                        <span style={{ fontSize: '0.82rem', verticalAlign: 'top', color: 'var(--primary-600)', marginRight: '1px' }}>$</span>
                        {item.price.toFixed(2)}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn-icon" 
                          style={{ width: '38px', height: '38px', borderRadius: '10px' }}
                          title="Quick View Details"
                          onClick={() => setActiveProductModal(item)}
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                        <button 
                          className="btn-sky-primary" 
                          style={{ padding: '9px 18px', fontSize: '0.85rem', fontWeight: '700', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          onClick={() => setCheckoutItem(item)}
                        >
                          <i className="fa-solid fa-bag-shopping"></i> Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', marginTop: '20px' }}>
                <i className="fa-solid fa-box-open" style={{ fontSize: '3rem', color: 'var(--primary-400)', marginBottom: '16px' }}></i>
                <h3>No Products Found</h3>
                <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search keyword or selected category filter.</p>
                <button className="btn-sky-outline" style={{ marginTop: '16px' }} onClick={() => { setProductSearch(''); setSelectedProductCategory('All'); }}>
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================
            TAB 4: VETERINARIAN PORTAL (SRS 1.6: Specialists Directory, Schedule Slots, Case Studies)
            ================================================================== */}
        {activeTab === 'vet' && (
          <div>
            {/* Smart Back Button: only shown when navigated from Pet Owner appointment booking */}
            {(typeof window !== 'undefined' && window._cameFromPetOwner) && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <button
                  className="btn-sky-outline"
                  style={{ padding: '9px 22px', fontSize: '0.88rem', fontWeight: '700', borderRadius: 'var(--radius-full)', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(14,165,233,0.09)' }}
                  onClick={() => {
                    window._cameFromPetOwner = false;
                    setActiveTab('pet-owner');
                    setPetOwnerSubTab('vet-appts');
                    if (window.SoundEngine) window.SoundEngine.playClicker();
                    addToast('Back to Pet Owner Dashboard', 'fa-arrow-left');
                  }}
                >
                  <i className="fa-solid fa-arrow-left"></i> Back to Pet Owner Profile
                </button>
                <span className="badge-sky" style={{ fontSize: '0.8rem' }}>
                  <i className="fa-solid fa-paw"></i> Active Pet: <strong>{petForm.name}</strong>
                </span>
              </div>
            )}
            <div className="section-header-wrap">
              <div className="section-title-box">
                <span className="badge-sky">Certified Clinical Network (15 Specialists)</span>
                <h2>Veterinarian <span className="gradient-text">Portal & Specialist Directory</span></h2>
                <p>Browse our global network of certified veterinary surgeons, dentists, cardiologists, and exotic specialists, or manage clinical appointments and medical histories.</p>
              </div>

              {/* Sub-Navigation for Veterinarian Portal */}
              <div className="portal-subnav glass-panel">
                <button 
                  className={`portal-subnav-btn ${vetViewMode === 'directory' ? 'active' : ''}`}
                  onClick={() => {
                    setVetViewMode('directory');
                    if (window.SoundEngine) window.SoundEngine.playClicker();
                  }}
                >
                  <i className="fa-solid fa-user-doctor"></i> 15 Specialists Directory (15)
                </button>
                <button 
                  className={`portal-subnav-btn ${vetViewMode === 'schedule' ? 'active' : ''}`}
                  onClick={() => {
                    setVetViewMode('schedule');
                    if (window.SoundEngine) window.SoundEngine.playClicker();
                  }}
                >
                  <i className="fa-solid fa-calendar-days"></i> Appointment Slots {selectedVetDoctor ? `(${selectedVetDoctor.name.split(',')[0]})` : ''}
                </button>
                <button 
                  className={`portal-subnav-btn ${vetViewMode === 'cases' ? 'active' : ''}`}
                  onClick={() => {
                    setVetViewMode('cases');
                    if (window.SoundEngine) window.SoundEngine.playClicker();
                  }}
                >
                  <i className="fa-solid fa-file-medical"></i> Case Studies ({caseStudies.length})
                </button>
                <button 
                  className={`portal-subnav-btn ${vetViewMode === 'edit' ? 'active' : ''}`}
                  onClick={() => {
                    setVetViewMode('edit');
                    if (window.SoundEngine) window.SoundEngine.playClicker();
                  }}
                >
                  <i className="fa-solid fa-id-card-clip"></i> Edit Profile
                </button>
              </div>
            </div>

            {/* SUB-VIEW 1: 45 VETERINARY SPECIALISTS DIRECTORY */}
            {vetViewMode === 'directory' && (
              <div>
                {/* Search & Specialization Filters */}
                <div className="catalog-toolbar glass-panel" style={{ padding: '18px 22px' }}>
                  <div className="search-input-wrap">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input 
                      type="text" 
                      className="input-sky" 
                      placeholder="Search doctors by name, specialty, clinic or city..."
                      value={vetSearch}
                      onChange={(e) => setVetSearch(e.target.value)}
                    />
                  </div>

                  <div className="category-filter-chips">
                    {[
                      'All',
                      'Surgery',
                      'Emergency',
                      'Cardiology',
                      'Dentistry',
                      'Feline & Internal'
                    ].map(spec => (
                      <button 
                        key={spec} 
                        className={`filter-chip ${vetSpecialtyFilter === spec ? 'active' : ''}`}
                        onClick={() => {
                          setVetSpecialtyFilter(spec);
                          if (window.SoundEngine) window.SoundEngine.playClicker();
                        }}
                      >
                        {spec === 'All' ? '🌟 All Specialists' : spec}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── VET DIRECTORY: 3 cards per category ── */}
                {(() => {
                  const VET_CATEGORIES = [
                    { key: 'Surgery',        label: 'Surgery Specialists',         icon: 'fa-scalpel',       keywords: ['surgery', 'surgical', 'orthopedic', 'reconstruct', 'arthroscop', 'vascular', 'neurosurg', 'corneal'] },
                    { key: 'Emergency',      label: 'Emergency & Critical Care',   icon: 'fa-truck-medical', keywords: ['emergency', 'trauma', 'critical', 'resuscitat', 'ventilat'] },
                    { key: 'Cardiology',     label: 'Cardiology & Heart',          icon: 'fa-heart-pulse',   keywords: ['cardio', 'heart', 'pulmonol', 'respiratory'] },
                    { key: 'Dentistry',      label: 'Dentistry & Oral Surgery',    icon: 'fa-tooth',         keywords: ['dent', 'oral'] },
                    { key: 'Feline & Internal', label: 'Feline, Internal & General',  icon: 'fa-stethoscope',   keywords: ['feline', 'internal', 'nephro', 'gastro', 'endocrin', 'oncol', 'hemato', 'immuno', 'pathol', 'geriatric', 'general', 'family', 'preventat', 'vaccine', 'nutrition', 'behav', 'neurol', 'ophthal', 'dermato', 'exotic', 'avian', 'reptile', 'rabbit', 'wildlife', 'shelter', 'acupunct', 'rehab', 'hydrotherapy', 'integrat', 'sport', 'imaging', 'anesthes', 'senior', 'palliative', 'zoonot', 'microb', 'radiat', 'pediatric'] }
                  ];

                  const getVetsForCat = (catObj) => {
                    const q = vetSearch.trim().toLowerCase();
                    let pool = veterinarians.filter(v => 
                      v.category === catObj.key || 
                      catObj.keywords.some(kw => v.specialization.toLowerCase().includes(kw))
                    );
                    if (q) pool = pool.filter(v => v.name.toLowerCase().includes(q) || v.specialization.toLowerCase().includes(q) || v.clinic.toLowerCase().includes(q) || v.city.toLowerCase().includes(q));
                    return pool.slice(0, 3);
                  };

                  const renderCard = (doc) => {
                    const isSel = selectedVetDoctor && selectedVetDoctor.id === doc.id;
                    return (
                      <div key={doc.id} className={`doctor-card ${isSel ? 'selected' : ''}`}>
                        <div className="doc-header-row">
                          <img
                            src={doc.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80'}
                            alt={doc.name}
                            className="doc-avatar"
                            onError={(e) => { e.target.src='https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80'; }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="doc-name">{doc.name}</div>
                            <span className="doc-specialty-badge">{doc.specialization}</span>
                          </div>
                        </div>
                        <div className="doc-info-line"><i className="fa-solid fa-hospital"></i><span>{doc.clinic}</span></div>
                        <div className="doc-info-line"><i className="fa-solid fa-location-dot"></i><span>{doc.city}</span></div>
                        <div className="doc-info-line" style={{ justifyContent: 'space-between' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}><i className="fa-solid fa-user-clock"></i><span>{doc.experience}</span></div>
                          <span style={{ fontWeight:'800', color:'var(--primary-600)', fontSize:'0.95rem' }}>${doc.consultationFee} <span style={{ fontSize:'0.72rem', fontWeight:'500', color:'var(--text-muted)' }}>/ consult</span></span>
                        </div>
                        <div className="doc-card-footer">
                          <button className="btn-sky-primary" style={{ flex:1, padding:'9px 14px', fontSize:'0.84rem' }}
                            onClick={() => { setSelectedVetDoctor(doc); if (doc.timeSlots && doc.timeSlots.length > 0) setTimeSlots(doc.timeSlots); setVetViewMode('schedule'); if (window.SoundEngine) window.SoundEngine.playChime(); addToast(`Selected ${doc.name.split(',')[0]}'s Schedule!`, 'fa-calendar-check'); }}>
                            <i className="fa-solid fa-calendar-check"></i> View Schedule & Book
                          </button>
                          <button className="btn-icon" style={{ width:'38px', height:'38px' }} title={`Call ${doc.name}`}
                            onClick={() => addToast(`Connecting to ${doc.clinic} emergency line...`, 'fa-phone-volume')}>
                            <i className="fa-solid fa-phone"></i>
                          </button>
                        </div>
                      </div>
                    );
                  };

                  if (vetSpecialtyFilter !== 'All') {
                    const cat = VET_CATEGORIES.find(c => c.key === vetSpecialtyFilter) || { label: vetSpecialtyFilter, keywords: [vetSpecialtyFilter.toLowerCase()] };
                    const docs = getVetsForCat(cat);
                    if (docs.length === 0) return (
                      <div className="glass-panel" style={{ padding:'60px 20px', textAlign:'center', marginTop:'20px' }}>
                        <i className="fa-solid fa-user-doctor" style={{ fontSize:'3rem', color:'var(--primary-400)', marginBottom:'16px' }}></i>
                        <h3>No Doctors Found</h3>
                        <p style={{ color:'var(--text-muted)' }}>No specialist found for "{vetSpecialtyFilter}".</p>
                        <button className="btn-sky-outline" style={{ marginTop:'16px' }} onClick={() => { setVetSearch(''); setVetSpecialtyFilter('All'); }}>Reset Filters</button>
                      </div>
                    );
                    return (<div className="doc-directory-grid">{docs.map(doc => renderCard(doc))}</div>);
                  }

                  return (
                    <div>
                      {VET_CATEGORIES.map(cat => {
                        const docs = getVetsForCat(cat);
                        if (docs.length === 0) return null;
                        return (
                          <div key={cat.key} style={{ marginBottom:'36px' }}>
                            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px', paddingBottom:'10px', borderBottom:'2px solid var(--border-glass)' }}>
                              <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'linear-gradient(135deg, var(--primary-500), var(--primary-700))', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'1rem' }}>
                                <i className={`fa-solid ${cat.icon}`}></i>
                              </div>
                              <div>
                                <h3 style={{ margin:0, fontSize:'1.05rem', fontWeight:'800', color:'var(--text-primary)' }}>{cat.label}</h3>
                                <span style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>Top {docs.length} Specialists</span>
                              </div>
                              <button
                                style={{ marginLeft:'auto', cursor:'pointer', border:'1px solid rgba(14,165,233,0.3)', background:'rgba(14,165,233,0.08)', padding:'4px 14px', borderRadius:'20px', fontSize:'0.78rem', fontWeight:'700', color:'var(--primary-600)' }}
                                onClick={() => { setVetSpecialtyFilter(cat.key); if (window.SoundEngine) window.SoundEngine.playClicker(); }}
                              >View All →</button>
                            </div>
                            <div className="doc-directory-grid">{docs.map(doc => renderCard(doc))}</div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* SUB-VIEW 2: SELECTED DOCTOR PROFILE & INTERACTIVE TIME SLOTS */}
            {vetViewMode === 'schedule' && (
              <div>
                {/* Active Selected Doctor Banner */}
                {(() => {
                  const currentDoc = selectedVetDoctor || {
                    name: vetForm.name,
                    specialization: vetForm.specialization,
                    clinic: vetForm.clinic,
                    city: 'Central Clinic',
                    contact: vetForm.contact,
                    image: vetForm.image,
                    rating: 4.9,
                    reviews: 218,
                    experience: vetForm.experience,
                    consultationFee: 85
                  };

                  return (
                    <div>
                      <div className="vet-profile-banner">
                        <img src={currentDoc.image} alt={currentDoc.name} className="vet-avatar-lg" />
                        <div style={{ flex: 1 }}>
                          <span className="badge-sky"><i className="fa-solid fa-certificate"></i> Verified Licensed Specialist</span>
                          <h2 style={{ fontSize: '1.8rem', marginTop: '4px' }}>{currentDoc.name}</h2>
                          <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '6px' }}>
                            <strong>Specialization:</strong> {currentDoc.specialization} • <strong>Hospital:</strong> {currentDoc.clinic} ({currentDoc.city || 'Central'})
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                            <span><i className="fa-solid fa-envelope" style={{ marginRight: '6px' }}></i> {currentDoc.contact || 'contact@furevervets.org'}</span>
                            <span><i className="fa-solid fa-star" style={{ color: '#f59e0b', marginRight: '4px' }}></i> {currentDoc.rating || 4.9} ({currentDoc.reviews || 150}+ patient reviews)</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button className="btn-sky-outline" onClick={() => setVetViewMode('directory')}>
                            <i className="fa-solid fa-users"></i> Change Doctor
                          </button>
                        </div>
                      </div>

                      {/* Time Slots Grid */}
                      <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                          <div>
                            <span className="badge-sky">Live Schedule Management</span>
                            <h3 style={{ fontSize: '1.4rem', marginTop: '4px' }}>
                              <i className="fa-solid fa-calendar-check" style={{ color: 'var(--primary-500)', marginRight: '8px' }}></i> 
                              Available Appointment Slots for {currentDoc.name.split(',')[0]}
                            </h3>
                          </div>
                          <span className="badge-sky">{timeSlots.length} Active Slots</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                          Click any available green time slot to instantly reserve your pet's appointment.
                        </p>

                        <div className="time-slots-grid">
                          {timeSlots.map(slot => (
                            <div 
                              key={slot.id} 
                              className={`slot-pill ${slot.status}`}
                              onClick={() => {
                                if (slot.status === 'available') {
                                  setTimeSlots(timeSlots.map(s => s.id === slot.id ? { ...s, status: 'booked', patient: `${user.firstName || 'Patient'} (Confirmed)` } : s));
                                  
                                  // Automatically sync appointment into Pet Owner Appointments
                                  const newAptRecord = {
                                    id: 'APT-' + Math.floor(1000 + Math.random() * 9000),
                                    doctor: currentDoc.name,
                                    specialty: currentDoc.specialization,
                                    clinic: currentDoc.clinic,
                                    city: currentDoc.city || 'Central Clinic',
                                    date: '2026-09-28',
                                    time: slot.time,
                                    status: 'Confirmed',
                                    fee: currentDoc.consultationFee || 85,
                                    doctorImg: currentDoc.image
                                  };
                                  setOwnerVetAppointments(prev => [newAptRecord, ...prev]);

                                  if (window.SoundEngine) window.SoundEngine.playChime();
                                  addToast(`🎉 Appointment Booked with ${currentDoc.name.split(',')[0]} for ${slot.time}!`, 'fa-calendar-check', 'success');
                                } else {
                                  addToast(`This slot is already booked for: ${slot.patient}`, 'fa-info-circle', 'warning');
                                }
                              }}
                            >
                              <div style={{ fontSize: '0.88rem', fontWeight: '700' }}>{slot.time}</div>
                              <div style={{ fontSize: '0.78rem', marginTop: '4px' }}>
                                {slot.status === 'booked' ? <><i className="fa-solid fa-lock"></i> {slot.patient}</> : <><i className="fa-solid fa-calendar-plus"></i> Click to Book</>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* SUB-VIEW 3: EDIT PRACTITIONER PROFILE FORM (SRS 1.6) */}
            {vetViewMode === 'edit' && (
              <div className="glass-panel" style={{ padding: '32px', maxWidth: '800px', margin: '0 auto 30px' }}>
                <span className="badge-sky">Doctor Profile Registration</span>
                <h3 style={{ margin: '8px 0 16px', fontSize: '1.4rem' }}>
                  <i className="fa-solid fa-user-pen" style={{ color: 'var(--primary-500)', marginRight: '8px' }}></i> 
                  Edit Practitioner Credentials & Clinic Information
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '20px' }}>
                  Update your veterinary practice information, specializations, and hospital affiliation.
                </p>

                <div className="form-group-custom">
                  <label className="form-label-custom">Doctor Full Name & Academic Credentials</label>
                  <input type="text" className="input-sky" value={vetForm.name} onChange={(e) => setVetForm({ ...vetForm, name: e.target.value })} />
                </div>

                <div className="form-group-custom">
                  <label className="form-label-custom">Specialization Area</label>
                  <input type="text" className="input-sky" value={vetForm.specialization} onChange={(e) => setVetForm({ ...vetForm, specialization: e.target.value })} />
                </div>

                <div className="form-group-custom">
                  <label className="form-label-custom">Hospital / Clinic Facility Name</label>
                  <input type="text" className="input-sky" value={vetForm.clinic} onChange={(e) => setVetForm({ ...vetForm, clinic: e.target.value })} />
                </div>

                <div className="form-group-custom">
                  <label className="form-label-custom">Direct Contact Email & Emergency Phone</label>
                  <input type="text" className="input-sky" value={vetForm.contact} onChange={(e) => setVetForm({ ...vetForm, contact: e.target.value })} />
                </div>

                <button className="btn-sky-primary" style={{ width: '100%' }} onClick={() => {
                  if (window.SoundEngine) window.SoundEngine.playChime();
                  addToast('Doctor credentials saved successfully!', 'fa-check');
                }}>
                  Save Credentials
                </button>
              </div>
            )}

            {/* SUB-VIEW 4: MEDICAL HISTORIES & CLINICAL CASE STUDIES (SRS 1.6) */}
            {vetViewMode === 'cases' && (
              <div className="glass-panel" style={{ padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span className="badge-sky">Clinical Case Records</span>
                    <h3 style={{ fontSize: '1.5rem', marginTop: '4px' }}>Sample Pet Medical Histories & Treatment Case Studies</h3>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Verified Surgical & Internal Medicine Records</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
                  {caseStudies.map(cs => (
                    <div key={cs.id} className="case-study-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span className="badge-sky" style={{ fontSize: '0.7rem' }}>{cs.id}</span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{cs.date}</span>
                      </div>

                      <h4 style={{ fontSize: '1.15rem', color: 'var(--primary-700)', marginBottom: '8px' }}>{cs.caseTitle}</h4>
                      <div style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '6px' }}>
                        Patient: <span style={{ color: 'var(--text-main)' }}>{cs.patientName}</span>
                      </div>

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                        <strong>Diagnosis:</strong> {cs.diagnosis}
                      </div>

                      <div style={{ padding: '12px', background: 'rgba(14, 165, 233, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', fontSize: '0.82rem', marginBottom: '12px' }}>
                        <strong>Treatment Protocol:</strong> {cs.treatment}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-light)', borderTop: '1px solid var(--border-glass)', paddingTop: '10px' }}>
                        <span><strong>Mobility / Metrics:</strong> {cs.metrics.mobilityScore || cs.metrics.urinaryPH || cs.metrics.airflowEfficiency}</span>
                        <span style={{ color: '#10b981', fontWeight: '600' }}><i className="fa-solid fa-circle-check"></i> {cs.metrics.followUp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================
            TAB 5: ANIMAL SHELTER & RESCUE PORTAL (SRS 1.6: Gallery, Filters, Stories, Events)
            ================================================================== */}
        {activeTab === 'shelter' && (
          <div>
            <div className="section-header-wrap">
              <div className="section-title-box">
                <span className="badge-sky">Shelter & Rescue Network</span>
                <h2>Adoptable Pets & <span className="gradient-text">Rescue Drives</span></h2>
                <p>Meet wonderful animals searching for a forever family, explore success stories, and attend community vaccination camps.</p>
              </div>

              {/* Client-Side JavaScript Filter Buttons (SRS 1.6) */}
              <div className="category-filter-chips">
                {[
                  { key: 'all', label: 'All Animals', icon: 'fa-paw' },
                  { key: 'dog', label: 'Dogs', icon: 'fa-dog' },
                  { key: 'cat', label: 'Cats', icon: 'fa-cat' },
                  { key: 'rabbit', label: 'Rabbits', icon: 'fa-carrot' },
                  { key: 'bird', label: 'Birds', icon: 'fa-dove' }
                ].map(flt => (
                  <button 
                    key={flt.key} 
                    className={`filter-chip ${petFilter === flt.key ? 'active' : ''}`}
                    onClick={() => {
                      setPetFilter(flt.key);
                      if (window.SoundEngine) window.SoundEngine.playClicker();
                    }}
                  >
                    <i className={`fa-solid ${flt.icon}`} style={{ marginRight: '6px' }}></i>
                    {flt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Adoptable Pets Gallery: 3 cards per category */}
            {(() => {
              const SHELTER_CATEGORIES = [
                { key: 'dog',    label: 'Rescued Dogs & Puppies',   icon: 'fa-dog' },
                { key: 'cat',    label: 'Adoptable Cats & Kittens', icon: 'fa-cat' },
                { key: 'rabbit', label: 'Fluffy Rabbits & Bunnies', icon: 'fa-carrot' },
                { key: 'bird',   label: 'Colorful Birds & Parrots', icon: 'fa-dove' }
              ];

              const renderPetCard = (pet) => (
                <div key={pet.id} className="adopt-card">
                  <div className="adopt-img-wrap">
                    <img 
                      src={pet.image} 
                      alt={pet.name} 
                      onError={(e) => { e.target.src='https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'; }}
                    />
                    <span className="adopt-badge-pill">{pet.badge}</span>
                  </div>

                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span className="product-category-lbl" style={{ margin: 0 }}>{pet.breed}</span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}><i className="fa-solid fa-clock"></i> {pet.age}</span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{pet.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px', flex: 1 }}>{pet.description}</p>

                    <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '600', marginBottom: '14px' }}>
                      <i className="fa-solid fa-shield-heart"></i> {pet.healthStatus}
                    </div>

                    <button className="btn-sky-primary" style={{ width: '100%' }} onClick={() => setActiveAdoptModal(pet)}>
                      <i className="fa-solid fa-heart"></i> Apply to Adopt {pet.name.split(' ')[0]}
                    </button>
                  </div>
                </div>
              );

              // Single category selected -> 3 cards
              if (petFilter !== 'all') {
                const pets = adoptablePets.filter(p => p.type === petFilter).slice(0, 3);
                return (
                  <div className="shelter-pets-grid" style={{ marginBottom: '48px' }}>
                    {pets.map(pet => renderPetCard(pet))}
                  </div>
                );
              }

              // All selected -> Grouped sections, 3 cards each
              return (
                <div style={{ marginBottom: '48px' }}>
                  {SHELTER_CATEGORIES.map(cat => {
                    const pets = adoptablePets.filter(p => p.type === cat.key).slice(0, 3);
                    if (pets.length === 0) return null;
                    return (
                      <div key={cat.key} style={{ marginBottom: '40px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '10px', borderBottom: '2px solid var(--border-glass)' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1rem' }}>
                            <i className={`fa-solid ${cat.icon}`}></i>
                          </div>
                          <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)' }}>{cat.label}</h3>
                            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Top 3 Available for Adoption</span>
                          </div>
                          <button
                            style={{ marginLeft: 'auto', cursor: 'pointer', border: '1px solid rgba(14,165,233,0.3)', background: 'rgba(14,165,233,0.08)', padding: '4px 14px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: '700', color: 'var(--primary-600)' }}
                            onClick={() => { setPetFilter(cat.key); if (window.SoundEngine) window.SoundEngine.playClicker(); }}
                          >
                            View All {cat.label.split(' ')[1]} →
                          </button>
                        </div>

                        <div className="shelter-pets-grid">
                          {pets.map(pet => renderPetCard(pet))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* Adoption Success Stories & Before/After Showcase */}
            <div className="glass-panel" style={{ padding: '32px', marginBottom: '40px' }}>
              <div className="section-header-wrap" style={{ marginBottom: '20px' }}>
                <div>
                  <span className="badge-sky">Heartwarming Journeys</span>
                  <h3 style={{ fontSize: '1.6rem', marginTop: '4px' }}>Adoption Success Stories</h3>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>4,850+ Happy Tails & Forever Homes</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
                {content && content.adoptionSuccessStories && content.adoptionSuccessStories.map(story => (
                  <div key={story.id} style={{ padding: '24px', background: 'var(--bg-surface)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                      <div style={{ position: 'relative', height: '140px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                        <img src={story.photoBefore} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px' }}>Rescue Day</span>
                      </div>
                      <div style={{ position: 'relative', height: '140px', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                        <img src={story.photoAfter} alt="After" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(16,185,129,0.85)', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px' }}>Happy Today</span>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{story.petName}</h4>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary-600)', fontWeight: '600', marginBottom: '8px' }}>Adopted by {story.adopter}</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{story.story}</p>
                    <blockquote style={{ fontSize: '0.82rem', fontStyle: 'italic', color: 'var(--text-light)', borderLeft: '3px solid var(--primary-400)', paddingLeft: '10px' }}>
                      "{story.quote}"
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>

            {/* Static Event Announcements & Drives (SRS 1.6) */}
            <div className="glass-panel" style={{ padding: '32px' }}>
              <div className="section-header-wrap" style={{ marginBottom: '20px' }}>
                <div>
                  <span className="badge-sky">Community Action</span>
                  <h3 style={{ fontSize: '1.6rem', marginTop: '4px' }}>Upcoming Adoption Drives & Vaccination Camps</h3>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                {events.map(evt => (
                  <div key={evt.id} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    <img src={evt.image} alt={evt.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                    <div style={{ padding: '20px' }}>
                      <span className="badge-sky" style={{ marginBottom: '8px' }}>{evt.tag}</span>
                      <h4 style={{ fontSize: '1.1rem', margin: '6px 0 8px' }}>{evt.title}</h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '6px' }}>
                        <i className="fa-solid fa-calendar-day" style={{ marginRight: '6px', color: 'var(--primary-500)' }}></i> {evt.date} • {evt.time}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '12px' }}>
                        <i className="fa-solid fa-location-dot" style={{ marginRight: '6px', color: '#f43f5e' }}></i> {evt.location}
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>{evt.description}</p>
                      
                      <button 
                        className="btn-sky-primary" 
                        style={{ width: '100%' }} 
                        onClick={() => {
                          setActiveRsvpModal(evt);
                          setRsvpConfirmedData(null);
                          setRsvpFormData({
                            name: user.firstName ? `${user.firstName} (Pet Parent)` : '',
                            email: '',
                            phone: '',
                            guests: 1,
                            bringingPet: 'Yes',
                            petDetails: ''
                          });
                          if (window.SoundEngine) window.SoundEngine.playClicker();
                        }}
                      >
                        <i className="fa-solid fa-ticket" style={{ marginRight: '6px' }}></i> RSVP / Free Seat ({evt.rsvpCount} Attending)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            TAB 6: EMERGENCY & 24/7 VET HELP (Comprehensive Critical Care Portal)
            ================================================================== */}
        {activeTab === 'emergency' && (() => {
          const triageProtocols = {
            choking: {
              title: 'Choking & Airway Obstruction',
              icon: 'fa-lungs',
              badge: 'Critical Emergency (Act < 3 Mins)',
              badgeColor: '#e11d48',
              symptoms: 'Violent gagging, pawing at mouth, blue/grey tongue, silent wheezing, collapse',
              actions: [
                'Open mouth gently and look inside. If a solid foreign object is clearly visible, do a gentle sweep with tweezers or fingers without pushing it deeper.',
                'For Small Dogs & Cats: Hold pet upside down by thighs with head hanging downward, give 4-5 firm back slaps between shoulder blades.',
                'For Medium/Large Dogs: Stand behind dog, place hands just under ribcage, and deliver 4-5 quick inward & upward abdominal thrusts (Heimlich Maneuver).',
                'If breathing does not immediately resume, start CPR chest compressions and rush to the nearest emergency trauma center.'
              ],
              donts: 'Never perform a blind sweep if you cannot see the item. Never use sharp metal tools deep inside throat.',
              hotline: '(888) 426-4435'
            },
            bleeding: {
              title: 'Severe Bleeding & Hemorrhage',
              icon: 'fa-droplet',
              badge: 'Urgent Care Required',
              badgeColor: '#e11d48',
              symptoms: 'Pulsing or pooling bright red blood, deep puncture wounds, arterial spray, weakness',
              actions: [
                'Apply immediate direct pressure to the wound with a clean sterile gauze, towel, or cotton roll for at least 5 minutes uninterrupted.',
                'If blood soaks through, DO NOT remove the bottom layer (it disrupts clotting); add more absorbent layers directly on top.',
                'Elevate the bleeding limb above heart level if no bone fractures are suspected.',
                'Wrap firmly with an elastic bandage roll or Vetrap. Keep pet calm, warm, and immobile during transport.'
              ],
              donts: 'Never apply a tight limb tourniquet unless instructed by a certified veterinarian (can cause tissue necrosis).',
              hotline: '+1 (800) 555-7297'
            },
            seizures: {
              title: 'Seizures, Tremors & Neurological',
              icon: 'fa-bolt',
              badge: 'High Severity Emergency',
              badgeColor: '#f59e0b',
              symptoms: 'Uncontrolled paddling, twitching, jaw champing, excessive foaming, loss of consciousness',
              actions: [
                'Clear all hard or sharp objects, stairs, and furniture away from the pet to prevent physical trauma.',
                'Dim room lighting, turn off TV/loud noises, and speak in a soft, soothing whisper.',
                'Carefully time the exact duration of the seizure with a stopwatch or phone timer.',
                'Place a soft rolled towel behind the head for cushion support once the seizure subsides.'
              ],
              donts: 'NEVER put your fingers or spoons into the pet\'s mouth (animals do NOT swallow their tongues and can bite involuntarily).',
              hotline: '+1 (800) 555-7297'
            },
            heatstroke: {
              title: 'Heatstroke & Hyperthermia (> 104°F / 40°C)',
              icon: 'fa-temperature-high',
              badge: 'Immediate Action Required',
              badgeColor: '#e11d48',
              symptoms: 'Excessive heavy panting, brick-red gums, thick sticky saliva, lethargy, vomiting, staggering',
              actions: [
                'Immediately move pet into air-conditioned room or deep shaded area with active airflow.',
                'Apply cool (tap water) wet towels to groin, armpits, paw pads, and neck. Spray paws with cool water.',
                'Position an electric fan directly toward the pet to promote cooling evaporation.',
                'Offer small amounts of cool (not ice) drinking water if pet is conscious and able to swallow.'
              ],
              donts: 'NEVER use freezing ice water or ice baths (causes peripheral blood vessel constriction, trapping core heat).',
              hotline: '(888) 426-4435'
            },
            poison: {
              title: 'Toxic & Chemical Ingestion',
              icon: 'fa-skull-crossbones',
              badge: 'Critical Poison Emergency',
              badgeColor: '#e11d48',
              symptoms: 'Sudden vomiting, diarrhea, dilated pupils, drooling, staggering, tremors, chemical odor',
              actions: [
                'Take a photo of the product container, packaging, plant leaves, or medication label immediately.',
                'Note exact estimated time of ingestion and approximate quantity consumed.',
                'Call the 24/7 National Poison Helpline immediately at (888) 426-4435 for customized triage advice.',
                'Keep pet calm and transport immediately with the packaging to the emergency clinic.'
              ],
              donts: 'Do NOT induce vomiting with hydrogen peroxide or salt unless specifically instructed by ASPCA Poison Control.',
              hotline: '(888) 426-4435'
            },
            trauma: {
              title: 'Fractures & Hit-by-Car Trauma',
              icon: 'fa-bone',
              badge: 'Surgical Trauma Priority',
              badgeColor: '#e11d48',
              symptoms: 'Non-weight bearing limb, visible deformity, shallow rapid breathing, shock, pale gums',
              actions: [
                'Approach very gently; injured pets may bite reflexively due to extreme pain. Consider a temporary soft muzzle.',
                'Carefully slide a rigid board, firm cardboard, or taut blanket under the pet to serve as a supportive stretcher.',
                'Keep head, neck, and spine straight in a neutral horizontal position without twisting.',
                'Cover with a light fleece blanket to combat hypothermia and shock during emergency transit.'
              ],
              donts: 'Do not attempt to push exposed bones back or wash deep puncture wounds with hydrogen peroxide.',
              hotline: '+1 (800) 555-7297'
            }
          };

          const activeProtocol = triageProtocols[emergencySymptom] || triageProtocols.choking;

          const detailedToxins = [
            { name: 'Xylitol (Birch Sweetener)', category: 'Food', severity: 'Fatal', onset: '15-30 Mins', danger: 'Severe hypoglycemia & acute liver necrosis', items: 'Sugar-free gum, peanut butter, chewable vitamins, baked keto treats', antidote: 'Immediate IV Dextrose & hepatoprotectants' },
            { name: 'Dark & Baking Chocolate', category: 'Food', severity: 'High', onset: '1-4 Hours', danger: 'Theobromine & caffeine cardiac arrhythmia', items: 'Cocoa powder, 70%+ dark chocolate, gourmet brownies', antidote: 'Emesis (if < 2h) & Activated Charcoal' },
            { name: 'Grapes, Raisins & Currants', category: 'Food', severity: 'Fatal', onset: '6-24 Hours', danger: 'Tartaric acid acute renal/kidney failure', items: 'Fresh grapes, trail mix, fruit cereals, raisin bread', antidote: 'Aggressive 48hr IV Fluid diuresis' },
            { name: 'Lilies (True Lilies for Cats)', category: 'Plants', severity: 'Fatal', onset: '2-12 Hours', danger: 'Severe acute renal failure from pollen/water', items: 'Easter, Tiger, Day, Stargazer and Asiatic lilies', antidote: 'Decontamination & 72hr IV fluids' },
            { name: 'Human NSAIDs (Ibuprofen / Tylenol)', category: 'Meds', severity: 'Fatal', onset: '1-2 Hours', danger: 'Gastric ulcer perforation & acute organ failure', items: 'Advil, Motrin, Tylenol (Acetaminophen), Aleve', antidote: 'N-acetylcysteine, GI protectants' },
            { name: 'Onions, Garlic & Chives', category: 'Food', severity: 'High', onset: '2-5 Days', danger: 'Thiosulfate hemolytic anemia (RBC destruction)', items: 'Raw/cooked onions, garlic powder, soup broths', antidote: 'Blood transfusion & oxygen therapy' },
            { name: 'Antifreeze (Ethylene Glycol)', category: 'Chemicals', severity: 'Fatal', onset: '30 Mins', danger: 'Sweet-tasting lethal kidney crystal buildup', items: 'Automotive coolant, brake fluids, de-icers', antidote: '4-MP (Fomepizole) or ethanol IV' },
            { name: 'Rodenticides (Rat Poison)', category: 'Chemicals', severity: 'Fatal', onset: '1-3 Days', danger: 'Internal hemorrhaging & neurotoxicity', items: 'Bait pellets, green poison blocks, tracking powders', antidote: 'Vitamin K1 therapy for 30 days' }
          ];

          const filteredToxins = detailedToxins.filter(t => {
            const matchesSearch = t.name.toLowerCase().includes(emergencyToxinSearch.toLowerCase()) ||
                                  t.items.toLowerCase().includes(emergencyToxinSearch.toLowerCase()) ||
                                  t.danger.toLowerCase().includes(emergencyToxinSearch.toLowerCase());
            return matchesSearch;
          });

          return (
            <div className="emergency-page-wrapper">
              
              {/* ── 1. PULSING EMERGENCY CRITICAL ALERT BANNER ── */}
              <div className="emergency-hero-siren-card">
                <div className="emergency-siren-badge">
                  <span className="emergency-siren-dot"></span>
                  <i className="fa-solid fa-truck-medical" style={{ marginRight: '6px' }}></i> 24/7 CRITICAL CARE NETWORK ACTIVE
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'center' }}>
                  <div>
                    <h1 className="emergency-hero-heading">
                      Is Your Pet Experiencing a <span style={{ color: '#f43f5e' }}>Medical Emergency?</span>
                    </h1>
                    <p className="emergency-hero-sub">
                      Do not wait. Connect directly with licensed emergency veterinary triage, dispatch an ambulance, or follow step-by-step first-aid protocols.
                    </p>

                    {/* Action Hotlines Row with Real Telephone & WhatsApp API links */}
                    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '20px' }}>
                      <a 
                        href="tel:18884264435" 
                        className="btn-emergency-call"
                        onClick={() => {
                          if (window.SoundEngine) window.SoundEngine.playAlarm();
                          addToast('Connecting direct telephone call to (888) 426-4435...', 'fa-phone', 'warning');
                        }}
                      >
                        <i className="fa-solid fa-phone-volume" style={{ fontSize: '1.3rem' }}></i>
                        <div>
                          <div style={{ fontSize: '0.72rem', opacity: 0.9, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tap to Call 24/7 Poison ER</div>
                          <div style={{ fontSize: '1.05rem', fontWeight: '800' }}>(888) 426-4435</div>
                        </div>
                      </a>

                      <a 
                        href="https://wa.me/923001234567?text=🚨%20EMERGENCY%20SOS:%20My%20pet%20needs%20urgent%20critical%20care.%20Please%20dispatch%20triage%20assistance."
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-emergency-wa"
                        onClick={() => {
                          if (window.SoundEngine) window.SoundEngine.playChime();
                          addToast('Opening 24/7 WhatsApp Emergency Ambulance Desk (+92 300 1234567)...', 'fa-brands fa-whatsapp');
                        }}
                      >
                        <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.4rem' }}></i>
                        <div>
                          <div style={{ fontSize: '0.72rem', opacity: 0.9, textTransform: 'uppercase' }}>WhatsApp Ambulance</div>
                          <div style={{ fontSize: '1.05rem', fontWeight: '800' }}>+92 300 1234567</div>
                        </div>
                      </a>

                      <button 
                        className="btn-emergency-firstaid" 
                        onClick={() => setSosModalOpen(true)}
                      >
                        <i className="fa-solid fa-kit-medical" style={{ color: '#fb7185', fontSize: '1.1rem' }}></i>
                        <span>First Aid Guide & Protocols</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Triage Status Monitor */}
                  <div className="emergency-status-panel">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(244,63,94,0.3)', paddingBottom: '10px' }}>
                      <span style={{ fontWeight: '800', fontSize: '0.92rem', color: '#fb7185', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fa-solid fa-satellite-dish"></i> Live Triage Hospital Status
                      </span>
                      <span className="badge-sky" style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', borderColor: '#10b981', fontSize: '0.74rem', fontWeight: '800' }}>
                        ● OPEN NOW
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.84rem' }}>
                      <div className="triage-status-mini-card">
                        <span style={{ color: '#cbd5e1', fontSize: '0.74rem', fontWeight: '600', display: 'block', marginBottom: '3px' }}>Avg Wait Time</span>
                        <strong style={{ color: '#34d399', display: 'block', fontSize: '1.1rem' }}>&lt; 4 Minutes</strong>
                      </div>
                      <div className="triage-status-mini-card">
                        <span style={{ color: '#cbd5e1', fontSize: '0.74rem', fontWeight: '600', display: 'block', marginBottom: '3px' }}>Surgeons On Duty</span>
                        <strong style={{ color: '#ffffff', display: 'block', fontSize: '1.1rem' }}>6 Specialists</strong>
                      </div>
                      <div className="triage-status-mini-card">
                        <span style={{ color: '#cbd5e1', fontSize: '0.74rem', fontWeight: '600', display: 'block', marginBottom: '3px' }}>Oxygen Cages</span>
                        <strong style={{ color: '#34d399', display: 'block', fontSize: '1.1rem' }}>Available (12)</strong>
                      </div>
                      <div className="triage-status-mini-card">
                        <span style={{ color: '#cbd5e1', fontSize: '0.74rem', fontWeight: '600', display: 'block', marginBottom: '3px' }}>Blood Bank</span>
                        <strong style={{ color: '#fb7185', display: 'block', fontSize: '1.1rem' }}>Canine & Feline</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {/* ── 2. INTERACTIVE PET EMERGENCY SYMPTOM TRIAGE MATRIX ── */}
              <section className="glass-panel" style={{ padding: '34px', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border-glow)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '22px' }}>
                  <div>
                    <span className="badge-sky" style={{ background: 'rgba(244,63,94,0.12)', color: '#f43f5e', borderColor: 'rgba(244,63,94,0.3)', marginBottom: '6px' }}>
                      <i className="fa-solid fa-stethoscope" style={{ marginRight: '6px' }}></i> Real-Time Emergency Protocol
                    </span>
                    <h2 style={{ fontSize: '1.65rem', margin: 0, fontFamily: 'var(--font-heading)' }}>
                      Interactive Symptom <span className="gradient-text">Triage Guide</span>
                    </h2>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
                    Select your pet's current distress symptom for immediate guidance
                  </span>
                </div>

                {/* Symptom Selector Chips */}
                <div className="emergency-symptom-nav">
                  {[
                    { id: 'choking', label: 'Choking / Airway', icon: 'fa-lungs' },
                    { id: 'bleeding', label: 'Severe Bleeding', icon: 'fa-droplet' },
                    { id: 'seizures', label: 'Seizures & Tremors', icon: 'fa-bolt' },
                    { id: 'heatstroke', label: 'Heatstroke (>104°F)', icon: 'fa-temperature-high' },
                    { id: 'poison', label: 'Toxins & Chemicals', icon: 'fa-skull-crossbones' },
                    { id: 'trauma', label: 'Fractures / Car Hit', icon: 'fa-bone' }
                  ].map(sym => (
                    <button
                      key={sym.id}
                      className={`emergency-sym-btn ${emergencySymptom === sym.id ? 'active' : ''}`}
                      onClick={() => {
                        setEmergencySymptom(sym.id);
                        if (window.SoundEngine) window.SoundEngine.playClicker();
                      }}
                    >
                      <i className={`fa-solid ${sym.icon}`}></i>
                      <span>{sym.label}</span>
                    </button>
                  ))}
                </div>

                {/* Active Symptom Card Detail */}
                <div className="emergency-protocol-card" style={{ animation: 'introFadeIn 0.3s ease' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="protocol-icon-wrap">
                        <i className={`fa-solid ${activeProtocol.icon}`}></i>
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--text-main)' }}>{activeProtocol.title}</h3>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}><strong>Warning Signs:</strong> {activeProtocol.symptoms}</span>
                      </div>
                    </div>
                    <span className="badge-sky" style={{ background: 'rgba(244,63,94,0.15)', color: '#f43f5e', borderColor: '#f43f5e', fontWeight: '700' }}>
                      <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '6px' }}></i>
                      {activeProtocol.badge}
                    </span>
                  </div>

                  {/* Immediate Action Steps */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
                    <div>
                      <h4 style={{ color: '#10b981', fontSize: '1.05rem', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fa-solid fa-circle-check"></i> Immediate Step-by-Step Actions:
                      </h4>
                      <ol className="emergency-action-steps">
                        {activeProtocol.actions.map((act, i) => (
                          <li key={i}>{act}</li>
                        ))}
                      </ol>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {/* Critical Don't */}
                      <div className="emergency-dont-box">
                        <h5 style={{ color: '#f43f5e', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <i className="fa-solid fa-circle-xmark"></i> WHAT NOT TO DO:
                        </h5>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{activeProtocol.donts}</p>
                      </div>

                      {/* Direct Dial Hotline Link */}
                      <div style={{ padding: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', display: 'block', marginBottom: '6px' }}>Direct Triage Line for this condition:</span>
                        <a 
                          href={`tel:${activeProtocol.hotline.replace(/[^0-9+]/g, '')}`} 
                          className="btn-sky-primary"
                          style={{ width: '100%', padding: '10px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', textDecoration: 'none' }}
                          onClick={() => {
                            if (window.SoundEngine) window.SoundEngine.playAlarm();
                            addToast(`Dialing ${activeProtocol.hotline}...`, 'fa-phone', 'warning');
                          }}
                        >
                          <i className="fa-solid fa-phone"></i> Call {activeProtocol.hotline}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ── 3. INTERACTIVE CPR METRONOME & LIFE SUPPORT GUIDE ── */}
              <div className="cpr-tool-grid">
                <div className="cpr-metronome-card glass-panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div>
                      <span className="badge-sky" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Life Support</span>
                      <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Pet CPR Rhythm Metronome</h3>
                    </div>
                    <button 
                      className={`cpr-toggle-btn ${cprMetronomeActive ? 'active' : ''}`}
                      onClick={() => {
                        setCprMetronomeActive(!cprMetronomeActive);
                        if (!cprMetronomeActive && window.SoundEngine) window.SoundEngine.playChime();
                      }}
                    >
                      <i className={`fa-solid ${cprMetronomeActive ? 'fa-pause' : 'fa-play'}`}></i>
                      <span>{cprMetronomeActive ? 'Stop Metronome' : 'Start 110 BPM Metronome'}</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '18px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', marginBottom: '16px' }}>
                    <div className={`cpr-heart-pulse-wrap ${cprMetronomeActive ? 'pulsing' : ''}`}>
                      <i className="fa-solid fa-heart-pulse"></i>
                      {cprMetronomeActive && <span className="cpr-beat-counter">{cprBeat}</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                        {cprMetronomeActive ? `Compression Count: ${cprBeat} / 30` : 'Target: 100 - 120 Compressions / Minute'}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '4px' }}>
                        Give <strong>30 fast chest compressions</strong> followed by <strong>2 rescue breaths</strong> into pet's nostrils.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem' }}>
                    <div style={{ padding: '10px 12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                      <strong style={{ color: 'var(--primary-600)', display: 'block' }}>Small Dogs & Cats (&lt; 15 kg)</strong>
                      <span>Compress side of chest with one hand or wrap two hands around ribcage. Compress 1/3 to 1/2 chest depth.</span>
                    </div>
                    <div style={{ padding: '10px 12px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                      <strong style={{ color: '#8b5cf6', display: 'block' }}>Medium & Large Dogs (&gt; 15 kg)</strong>
                      <span>Lay dog on right side. Place hands locked over widest part of ribcage. Press with straight locked elbows.</span>
                    </div>
                  </div>
                </div>

                {/* Emergency Kit Checklist */}
                <div className="emergency-kit-card glass-panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                      <i className="fa-solid fa-briefcase-medical" style={{ color: '#10b981', marginRight: '8px' }}></i> Pet First-Aid Kit Checklist
                    </h3>
                    <button 
                      className="btn-sky-outline" 
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                      onClick={() => window.print()}
                    >
                      <i className="fa-solid fa-print"></i> Print
                    </button>
                  </div>
                  <div className="kit-checklist-grid">
                    {[
                      { item: 'Sterile Gauze Pads & Vetrap Bandage', checked: true },
                      { item: 'Digital Rectal Thermometer & Lube', checked: true },
                      { item: 'Styptic Powder (Nail Bleeding)', checked: true },
                      { item: 'Sterile Saline Solution (Eye Wash)', checked: true },
                      { item: 'Tick Twister & Blunt Tweezers', checked: true },
                      { item: 'Soft Muzzle & Foil Thermal Blanket', checked: true }
                    ].map((it, idx) => (
                      <div key={idx} className="kit-check-row">
                        <i className="fa-solid fa-circle-check" style={{ color: '#10b981', marginRight: '8px' }}></i>
                        <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>{it.item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── 4. 24/7 VERIFIED EMERGENCY HOTLINES DIRECTORY (WITH REAL CALL & WHATSAPP API) ── */}
              <section className="glass-panel" style={{ padding: '30px', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border-glow)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', margin: 0, fontFamily: 'var(--font-heading)' }}>
                      <i className="fa-solid fa-address-book" style={{ color: 'var(--primary-500)', marginRight: '8px' }}></i>
                      24/7 Verified Emergency Hotline Directory
                    </h3>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-light)' }}>
                      Direct telephone lines connect instantly to on-call toxicologists & surgical trauma units
                    </span>
                  </div>
                  <span className="badge-sky" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', borderColor: '#10b981' }}>
                    <i className="fa-solid fa-shield-check" style={{ marginRight: '6px' }}></i> Verified Active Lines
                  </span>
                </div>

                <div className="emergency-table-container">
                  <table className="emergency-table">
                    <thead>
                      <tr>
                        <th>Emergency Center / Facility</th>
                        <th>Direct Telephone Line</th>
                        <th>Coverage</th>
                        <th>Emergency Specialty</th>
                        <th style={{ textAlign: 'right' }}>Real Direct Call & Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content && content.emergencyHelplines && content.emergencyHelplines.map((item, idx) => {
                        const cleanTel = item.phone.replace(/[^0-9+]/g, '');
                        return (
                          <tr key={idx}>
                            <td>
                              <strong>{item.name}</strong>
                              <div style={{ fontSize: '0.74rem', color: 'var(--text-light)' }}>National Animal Safety Registry</div>
                            </td>
                            <td>
                              <a 
                                href={`tel:${cleanTel}`} 
                                className="emergency-table-phone-link"
                                onClick={() => {
                                  if (window.SoundEngine) window.SoundEngine.playAlarm();
                                  addToast(`Connecting real phone call to ${item.phone}...`, 'fa-phone', 'warning');
                                }}
                              >
                                <i className="fa-solid fa-phone" style={{ marginRight: '6px' }}></i>
                                {item.phone}
                              </a>
                            </td>
                            <td><span className="badge-sky" style={{ fontSize: '0.74rem' }}>{item.availability}</span></td>
                            <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.type}</td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <a 
                                  href={`tel:${cleanTel}`} 
                                  className="btn-sky-primary" 
                                  style={{ padding: '8px 16px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                                  onClick={() => {
                                    if (window.SoundEngine) window.SoundEngine.playAlarm();
                                    addToast(`Connecting phone call to ${item.phone}...`, 'fa-phone', 'warning');
                                  }}
                                  title="Tap to Call Immediately"
                                >
                                  <i className="fa-solid fa-phone"></i> Call Now
                                </a>

                                <a 
                                  href={`https://wa.me/923001234567?text=EMERGENCY:%20I%20am%20calling%20about%20${encodeURIComponent(item.name)}%20for%20my%20pet.`}
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="btn-icon" 
                                  style={{ background: 'rgba(37, 211, 102, 0.15)', color: '#25d366', border: '1px solid rgba(37, 211, 102, 0.3)', width: '34px', height: '34px' }}
                                  title="WhatsApp Triage (+92 300 1234567)"
                                >
                                  <i className="fa-brands fa-whatsapp"></i>
                                </a>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* ── 5. INTERACTIVE TOXIC FOODS & HOUSEHOLD POISON SEARCHABLE DATABASE ── */}
              <section className="glass-panel" style={{ padding: '32px', borderRadius: 'var(--radius-xl)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', margin: 0, fontFamily: 'var(--font-heading)' }}>
                      <i className="fa-solid fa-skull-crossbones" style={{ color: '#f43f5e', marginRight: '8px' }}></i>
                      Household Toxins & Poison Reference Database
                    </h3>
                    <span style={{ fontSize: '0.84rem', color: 'var(--text-light)' }}>
                      Search dangerous human foods, poisonous plants, and hazardous medications
                    </span>
                  </div>

                  {/* Live Search Input */}
                  <div style={{ position: 'relative', width: '280px' }}>
                    <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}></i>
                    <input 
                      type="text" 
                      className="input-sky" 
                      placeholder="Search chocolate, lilies, xylitol..." 
                      value={emergencyToxinSearch}
                      onChange={(e) => setEmergencyToxinSearch(e.target.value)}
                      style={{ paddingLeft: '34px', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                <div className="emergency-toxins-grid">
                  {filteredToxins.map((tox, i) => (
                    <div key={i} className="toxin-card glass-card-hover">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <span className="product-category-lbl" style={{ margin: 0 }}>{tox.category}</span>
                        <span className="badge-sky" style={{ 
                          background: tox.severity === 'Fatal' ? 'rgba(225,29,72,0.15)' : 'rgba(245,158,11,0.15)',
                          color: tox.severity === 'Fatal' ? '#e11d48' : '#f59e0b',
                          borderColor: tox.severity === 'Fatal' ? '#e11d48' : '#f59e0b',
                          fontSize: '0.72rem',
                          fontWeight: '700'
                        }}>
                          {tox.severity} Severity
                        </span>
                      </div>

                      <h4 style={{ fontSize: '1.05rem', margin: '4px 0 6px', color: 'var(--text-main)' }}>{tox.name}</h4>
                      
                      <div style={{ fontSize: '0.82rem', color: '#f59e0b', fontWeight: '600', marginBottom: '6px' }}>
                        <i className="fa-solid fa-triangle-exclamation" style={{ marginRight: '5px' }}></i> Risk: {tox.danger}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginBottom: '8px' }}>
                        <strong>Common In:</strong> {tox.items}
                      </div>

                      <div style={{ fontSize: '0.78rem', color: '#10b981', background: 'var(--bg-surface)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', marginTop: 'auto' }}>
                        <i className="fa-solid fa-syringe" style={{ marginRight: '5px' }}></i> <strong>Antidote Action:</strong> {tox.antidote}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          );
        })()}

        {/* ==================================================================
            TAB 7: FEEDBACK & PET PARENT REVIEWS (Full 8 Sections per Spec)
            ================================================================== */}
        {activeTab === 'feedback' && (() => {
          const feedbackCategories = [
            'All',
            'Pet Adoption',
            'Veterinary Care',
            'Pet Products',
            'Pet Care',
            'Community',
            'Website'
          ];

          const formCategoryOptions = [
            'Pet Adoption',
            'Veterinary Care',
            'Pet Products',
            'Pet Care Resources',
            'Community',
            'Events',
            'Website Experience',
            'Other'
          ];

          const filteredReviews = feedbackCategoryFilter === 'All'
            ? reviews
            : reviews.filter(r => r.category.toLowerCase().includes(feedbackCategoryFilter.toLowerCase()));

          const handleFeedbackSubmit = (e) => {
            e.preventDefault();
            if (!feedbackFormData.fullName.trim()) {
              markInvalidField(document.getElementById('feedback-name-input'), 'Please enter your full name');
              return;
            }
            if (!feedbackFormData.email.trim() || !/^\S+@\S+\.\S+$/.test(feedbackFormData.email)) {
              markInvalidField(document.getElementById('feedback-email-input'), 'Please enter a valid email address');
              return;
            }
            if (!feedbackFormData.feedback.trim()) {
              markInvalidField(document.getElementById('feedback-msg-input'), 'Please write your feedback message');
              return;
            }

            const newReview = {
              id: `rev-${Date.now()}`,
              userName: feedbackFormData.fullName.trim(),
              userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
              rating: feedbackFormData.rating || 5,
              date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              category: feedbackFormData.category || 'Pet Adoption',
              petName: feedbackFormData.petName.trim() || 'Companion Pet',
              petImage: feedbackFormData.petImage.trim() || '',
              review: feedbackFormData.feedback.trim(),
              helpfulCount: 1
            };

            setReviews(prev => [newReview, ...prev]);
            setFeedbackSubmitted(true);
            setFeedbackFormData({
              fullName: '',
              email: '',
              category: 'Pet Adoption',
              rating: 5,
              feedback: '',
              petName: '',
              petImage: ''
            });

            if (window.SoundEngine) window.SoundEngine.playChime();
            addToast('Thank you for your feedback! Submitted successfully.', 'fa-circle-check');
          };

          const handleToggleHelpful = (revId) => {
            setHelpfulReviews(prev => {
              const current = !!prev[revId];
              const updated = { ...prev, [revId]: !current };
              if (!current && window.SoundEngine) window.SoundEngine.playClicker();
              return updated;
            });
          };

          return (
            <div className="feedback-page-wrapper">
              
              {/* ── SECTION 1: FEEDBACK INTRODUCTION ── */}
              <section className="feedback-intro-section glass-panel">
                <div className="feedback-intro-content">
                  <span className="badge-sky" style={{ marginBottom: '12px', display: 'inline-block' }}>
                    <i className="fa-solid fa-comment-dots" style={{ marginRight: '6px' }}></i> Voice of Pet Parents
                  </span>
                  <h1 className="feedback-main-heading">
                    Your Feedback <span className="gradient-text">Matters to Us</span>
                  </h1>
                  <p className="feedback-intro-text">
                    Your experience helps us improve Forever Care Pets and create a better experience for pets and their families. Every suggestion directly shapes our veterinary, adoption, and product services.
                  </p>
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '22px' }}>
                    <button 
                      className="btn-sky-primary"
                      onClick={() => {
                        const el = document.getElementById('feedback-form-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <i className="fa-solid fa-pen-to-square" style={{ marginRight: '8px' }}></i> Share Your Feedback
                    </button>
                    <button 
                      className="btn-sky-outline"
                      onClick={() => {
                        const el = document.getElementById('reviews-stream-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <i className="fa-solid fa-star" style={{ marginRight: '8px' }}></i> View Pet Parent Reviews
                    </button>
                  </div>
                </div>

                <div className="feedback-intro-img-wrap">
                  <img 
                    src="https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=700&q=80" 
                    alt="Pet parent with loving cat" 
                    className="feedback-intro-img"
                  />
                  <div className="feedback-badge-floating">
                    <i className="fa-solid fa-medal" style={{ color: '#f59e0b' }}></i>
                    <span>Top Rated Pet Platform • 4.8 / 5</span>
                  </div>
                </div>
              </section>

              {/* ── SECTION 2: OVERALL RATING & BREAKDOWN + SECTION 6: FEEDBACK STATISTICS ── */}
              <div className="feedback-stats-rating-row">
                
                {/* 2. OVERALL RATING CARD */}
                <div className="rating-summary-card glass-panel">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div>
                      <span className="badge-sky" style={{ fontSize: '0.75rem', marginBottom: '6px' }}>Verified Rating</span>
                      <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Overall Experience</h3>
                    </div>
                    <div className="rating-badge-lg">4.8</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ color: '#f59e0b', fontSize: '1.4rem', display: 'flex', gap: '4px' }}>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star-half-stroke"></i>
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-main)' }}>4.8 out of 5</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginBottom: '20px' }}>
                    <i className="fa-solid fa-circle-check" style={{ color: '#10b981', marginRight: '5px' }}></i> Based on 250+ verified community reviews
                  </div>

                  {/* Rating Breakdown Progress Bars */}
                  <div className="rating-bars-list">
                    {[
                      { stars: '5 Stars', pct: 85, count: '215' },
                      { stars: '4 Stars', pct: 10, count: '26' },
                      { stars: '3 Stars', pct: 3, count: '7' },
                      { stars: '2 Stars', pct: 1, count: '2' },
                      { stars: '1 Star', pct: 1, count: '2' }
                    ].map((item, idx) => (
                      <div key={idx} className="rating-bar-row">
                        <span className="rating-bar-label">{item.stars}</span>
                        <div className="rating-bar-track">
                          <div className="rating-bar-fill" style={{ width: `${item.pct}%` }}></div>
                        </div>
                        <span className="rating-bar-pct">{item.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 6. FEEDBACK STATISTICS (4 Cards) */}
                <div className="feedback-stats-quad">
                  <div className="feedback-stat-card glass-panel glass-card-hover">
                    <div className="feedback-stat-icon-wrap" style={{ background: 'rgba(14, 165, 233, 0.12)', color: 'var(--primary-600)' }}>
                      <i className="fa-solid fa-users"></i>
                    </div>
                    <div className="feedback-stat-num">250+</div>
                    <div className="feedback-stat-lbl">Happy Pet Parents</div>
                  </div>

                  <div className="feedback-stat-card glass-panel glass-card-hover">
                    <div className="feedback-stat-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' }}>
                      <i className="fa-solid fa-star"></i>
                    </div>
                    <div className="feedback-stat-num">4.8/5</div>
                    <div className="feedback-stat-lbl">Average Rating</div>
                  </div>

                  <div className="feedback-stat-card glass-panel glass-card-hover">
                    <div className="feedback-stat-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
                      <i className="fa-solid fa-thumbs-up"></i>
                    </div>
                    <div className="feedback-stat-num">95%</div>
                    <div className="feedback-stat-lbl">Would Recommend Us</div>
                  </div>

                  <div className="feedback-stat-card glass-panel glass-card-hover">
                    <div className="feedback-stat-icon-wrap" style={{ background: 'rgba(139, 92, 246, 0.12)', color: '#8b5cf6' }}>
                      <i className="fa-solid fa-paw"></i>
                    </div>
                    <div className="feedback-stat-num">500+</div>
                    <div className="feedback-stat-lbl">Pets Helped</div>
                  </div>
                </div>

              </div>

              {/* ── SECTION 3: SHARE YOUR FEEDBACK (Modern Form) ── */}
              <section id="feedback-form-section" className="feedback-form-container glass-panel">
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                  <div className="btn-icon" style={{ background: 'rgba(14, 165, 233, 0.15)', color: 'var(--primary-600)', width: '48px', height: '48px', fontSize: '1.3rem' }}>
                    <i className="fa-solid fa-pen-nib"></i>
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.6rem', margin: 0, fontFamily: 'var(--font-heading)' }}>
                      Share Your <span className="gradient-text">Feedback</span>
                    </h2>
                    <span style={{ fontSize: '0.88rem', color: 'var(--text-light)' }}>
                      Tell us about your experience with our adoption, clinical care, or platform features
                    </span>
                  </div>
                </div>

                {feedbackSubmitted ? (
                  <div className="feedback-thankyou-box" style={{ animation: 'introFadeIn 0.4s ease' }}>
                    <div className="feedback-thankyou-icon">
                      <i className="fa-solid fa-circle-check"></i>
                    </div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#047857' }}>Thank you for your feedback!</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', maxWidth: '500px', margin: '0 auto 20px' }}>
                      Your feedback has been submitted successfully and added to our verified community stream.
                    </p>
                    <button 
                      className="btn-sky-primary" 
                      onClick={() => setFeedbackSubmitted(false)}
                      style={{ padding: '10px 24px', fontSize: '0.9rem' }}
                    >
                      <i className="fa-solid fa-plus" style={{ marginRight: '8px' }}></i> Submit Another Review
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleFeedbackSubmit} noValidate>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                      <div className="form-group-custom">
                        <label className="form-label-custom">Full Name *</label>
                        <div style={{ position: 'relative' }}>
                          <input 
                            type="text" 
                            id="feedback-name-input"
                            className="input-sky" 
                            placeholder="e.g. Sarah Connor"
                            value={feedbackFormData.fullName}
                            onChange={(e) => setFeedbackFormData({ ...feedbackFormData, fullName: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="form-group-custom">
                        <label className="form-label-custom">Email Address *</label>
                        <div style={{ position: 'relative' }}>
                          <input 
                            type="email" 
                            id="feedback-email-input"
                            className="input-sky" 
                            placeholder="name@example.com"
                            value={feedbackFormData.email}
                            onChange={(e) => setFeedbackFormData({ ...feedbackFormData, email: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                      <div className="form-group-custom">
                        <label className="form-label-custom">Feedback Category *</label>
                        <select 
                          className="input-sky"
                          value={feedbackFormData.category}
                          onChange={(e) => setFeedbackFormData({ ...feedbackFormData, category: e.target.value })}
                        >
                          {formCategoryOptions.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      {/* Interactive Professional Star Rating Picker */}
                      <div className="form-group-custom">
                        <label className="form-label-custom">Star Rating *</label>
                        <div className="interactive-star-picker">
                          {[1, 2, 3, 4, 5].map(star => {
                            const isFilled = (feedbackHoverRating || feedbackFormData.rating) >= star;
                            return (
                              <button
                                key={star}
                                type="button"
                                className="star-picker-btn"
                                onMouseEnter={() => setFeedbackHoverRating(star)}
                                onMouseLeave={() => setFeedbackHoverRating(0)}
                                onClick={() => {
                                  setFeedbackFormData({ ...feedbackFormData, rating: star });
                                  if (window.SoundEngine) window.SoundEngine.playClicker();
                                }}
                                title={`Rate ${star} Stars`}
                              >
                                <i className={`fa-${isFilled ? 'solid' : 'regular'} fa-star`} style={{ color: isFilled ? '#f59e0b' : 'var(--text-light)' }}></i>
                              </button>
                            );
                          })}
                          <span style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-main)', marginLeft: '8px' }}>
                            {feedbackHoverRating || feedbackFormData.rating} / 5 Stars
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group-custom">
                      <label className="form-label-custom">Your Feedback & Experience *</label>
                      <textarea 
                        id="feedback-msg-input"
                        className="input-sky" 
                        rows="4" 
                        placeholder="Tell us what you loved about Forever Care Pets, or how we can make our services even better for your pet..."
                        value={feedbackFormData.feedback}
                        onChange={(e) => setFeedbackFormData({ ...feedbackFormData, feedback: e.target.value })}
                      ></textarea>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                      <div className="form-group-custom">
                        <label className="form-label-custom">Pet Name (Optional)</label>
                        <input 
                          type="text" 
                          className="input-sky" 
                          placeholder="e.g. Milo (Golden Retriever)"
                          value={feedbackFormData.petName}
                          onChange={(e) => setFeedbackFormData({ ...feedbackFormData, petName: e.target.value })}
                        />
                      </div>

                      <div className="form-group-custom">
                        <label className="form-label-custom">Pet Image URL (Optional)</label>
                        <input 
                          type="url" 
                          className="input-sky" 
                          placeholder="Paste pet photo link"
                          value={feedbackFormData.petImage}
                          onChange={(e) => setFeedbackFormData({ ...feedbackFormData, petImage: e.target.value })}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      className="btn-sky-primary" 
                      style={{ width: '100%', padding: '14px', fontSize: '1.02rem', marginTop: '6px' }}
                    >
                      <i className="fa-solid fa-paper-plane" style={{ marginRight: '8px' }}></i> Submit Feedback
                    </button>
                  </form>
                )}
              </section>

              {/* ── SECTION 5: FEEDBACK FILTER & SECTION 4: CUSTOMER FEEDBACK / REVIEWS ── */}
              <section id="reviews-stream-section" className="feedback-reviews-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <span className="badge-sky" style={{ marginBottom: '6px' }}>
                      <i className="fa-solid fa-comments" style={{ marginRight: '6px' }}></i> Verified Stories
                    </span>
                    <h2 style={{ fontSize: '1.65rem', margin: 0, fontFamily: 'var(--font-heading)' }}>
                      What Our Pet <span className="gradient-text">Parents Say</span>
                    </h2>
                  </div>

                  {/* 5. FEEDBACK FILTER CHIPS */}
                  <div className="category-filter-chips">
                    {feedbackCategories.map(cat => (
                      <button
                        key={cat}
                        className={`filter-chip ${feedbackCategoryFilter === cat ? 'active' : ''}`}
                        onClick={() => {
                          setFeedbackCategoryFilter(cat);
                          if (window.SoundEngine) window.SoundEngine.playClicker();
                        }}
                      >
                        {cat === 'All' ? '🌟 All Reviews' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. REVIEWS GRID */}
                <div className="feedback-reviews-grid">
                  {filteredReviews.map(rev => {
                    const isHelpful = !!helpfulReviews[rev.id];
                    const totalHelpful = isHelpful ? rev.helpfulCount + 1 : rev.helpfulCount;

                    return (
                      <div key={rev.id} className="review-card glass-panel glass-card-hover">
                        {/* Review Header */}
                        <div className="review-card-header">
                          <img src={rev.userAvatar} alt={rev.userName} className="review-user-avatar" />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div className="review-user-name">{rev.userName}</div>
                            <div className="review-date-line">
                              <i className="fa-solid fa-calendar-day" style={{ color: 'var(--text-light)', marginRight: '4px' }}></i>
                              {rev.date}
                            </div>
                          </div>
                          <span className="badge-sky" style={{ fontSize: '0.74rem' }}>
                            <i className="fa-solid fa-tag" style={{ marginRight: '4px' }}></i> {rev.category}
                          </span>
                        </div>

                        {/* Star Rating Display */}
                        <div className="review-stars-row">
                          {[1, 2, 3, 4, 5].map(st => (
                            <i 
                              key={st} 
                              className={`fa-${st <= rev.rating ? 'solid' : 'regular'} fa-star`}
                              style={{ color: st <= rev.rating ? '#f59e0b' : 'var(--text-light)', fontSize: '0.95rem' }}
                            ></i>
                          ))}
                          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', marginLeft: '6px' }}>
                            {rev.rating}.0 / 5.0
                          </span>
                        </div>

                        {/* Review Text */}
                        <p className="review-text-body">"{rev.review}"</p>

                        {/* Optional Pet Badge & Photo */}
                        {rev.petName && (
                          <div className="review-pet-pill">
                            {rev.petImage && (
                              <img src={rev.petImage} alt={rev.petName} className="review-pet-thumb" />
                            )}
                            <i className="fa-solid fa-paw" style={{ color: 'var(--primary-500)', marginRight: '6px' }}></i>
                            <span>Pet: <strong>{rev.petName}</strong></span>
                          </div>
                        )}

                        {/* Review Footer / Helpful Action */}
                        <div className="review-card-footer">
                          <button 
                            className={`review-helpful-btn ${isHelpful ? 'active' : ''}`}
                            onClick={() => handleToggleHelpful(rev.id)}
                          >
                            <i className={`fa-${isHelpful ? 'solid' : 'regular'} fa-thumbs-up`}></i>
                            <span>Helpful ({totalHelpful})</span>
                          </button>

                          <div style={{ fontSize: '0.75rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <i className="fa-solid fa-shield-check"></i> Verified Pet Parent
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* ── SECTION 7: WE'RE ALWAYS IMPROVING ── */}
              <section className="improving-section glass-panel">
                <div className="improving-content">
                  <span className="badge-sky" style={{ marginBottom: '12px', display: 'inline-block' }}>
                    <i className="fa-solid fa-arrow-trend-up" style={{ marginRight: '6px' }}></i> Continuous Excellence
                  </span>
                  <h2 className="improving-heading">
                    We’re Always <span className="gradient-text">Improving</span>
                  </h2>
                  <p className="improving-text">
                    Every piece of feedback helps us make Forever Care Pets better. We listen to your suggestions and continuously work to improve our services and your experience. From mobile UI enhancements to wider shelter integrations, your voice drives every release.
                  </p>
                  
                  <div className="improving-features-list">
                    <div className="improving-feature-item">
                      <div className="improving-icon"><i className="fa-solid fa-bolt"></i></div>
                      <div>
                        <strong>Rapid Veterinary Booking</strong>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Reduced scheduling time by 60% based on user requests</div>
                      </div>
                    </div>
                    <div className="improving-feature-item">
                      <div className="improving-icon"><i className="fa-solid fa-shield-heart"></i></div>
                      <div>
                        <strong>Pet-Safe Packaging</strong>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>100% recyclable, tamper-evident product deliveries</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="improving-img-wrap">
                  <img 
                    src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=700&q=80" 
                    alt="Happy healthy dog" 
                    className="improving-img"
                  />
                </div>
              </section>

              {/* ── SECTION 8: FINAL CTA ── */}
              <section className="feedback-cta-section">
                <div className="about-cta-paw-bg">
                  <i className="fa-solid fa-paw about-cta-paw-1"></i>
                  <i className="fa-solid fa-paw about-cta-paw-2"></i>
                  <i className="fa-solid fa-paw about-cta-paw-3"></i>
                </div>
                <div className="about-cta-content">
                  <div className="about-cta-badge">
                    <i className="fa-solid fa-heart" style={{ color: '#f43f5e', marginRight: '8px' }}></i>
                    Your Voice Matters
                  </div>
                  <h2 className="about-cta-heading">
                    Have Something to <span className="gradient-text">Share?</span>
                  </h2>
                  <p className="about-cta-sub">
                    Your experience can help another pet parent make the right choice. Share your thoughts today!
                  </p>
                  <button 
                    className="btn-sky-primary"
                    style={{ padding: '14px 34px', fontSize: '1.05rem', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
                    onClick={() => {
                      const el = document.getElementById('feedback-form-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                      if (window.SoundEngine) window.SoundEngine.playClicker();
                    }}
                  >
                    <i className="fa-solid fa-arrow-up"></i> Give Your Feedback
                  </button>
                </div>
              </section>

            </div>
          );
        })()}

        {/* ==================================================================
            TAB 7.5: COMMUNITY HUB (6 Full Sections per Requirements)
            ================================================================== */}
        {activeTab === 'community' && (() => {
          const categories = ['All', 'Pet Care', 'Adoption', 'Pet Stories', 'Health', 'Tips & Advice', 'Events'];
          
          const filteredPosts = communityCategory === 'All' 
            ? communityPosts 
            : communityPosts.filter(p => p.category.toLowerCase() === communityCategory.toLowerCase());

          const handlePublishPost = (e) => {
            e.preventDefault();
            if (!newPostForm.name.trim()) {
              markInvalidField(document.getElementById('post-name-input'), 'Please enter your name');
              return;
            }
            if (!newPostForm.title.trim()) {
              markInvalidField(document.getElementById('post-title-input'), 'Please enter a post title');
              return;
            }
            if (!newPostForm.content.trim()) {
              markInvalidField(document.getElementById('post-content-input'), 'Please write your story / thoughts before publishing');
              return;
            }
            const created = {
              id: `post-${Date.now()}`,
              userName: newPostForm.name.trim() || user.firstName || 'Community Member',
              userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
              date: 'Just now',
              category: newPostForm.category || 'Pet Stories',
              title: newPostForm.title.trim(),
              content: newPostForm.content.trim(),
              petImage: (newPostForm.petImage && newPostForm.petImage.trim()) || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
              likes: 1,
              commentsCount: 0,
              comments: []
            };

            setCommunityPosts(prev => [created, ...prev]);
            setNewPostForm({ name: '', title: '', category: 'Pet Stories', content: '', petImage: '' });
            setPostSuccessBanner(true);
            setTimeout(() => setPostSuccessBanner(false), 5000);
            if (window.SoundEngine) window.SoundEngine.playChime();
            addToast('Your story has been shared with the community! 🐾', 'fa-circle-check');
          };

          const handleToggleLike = (postId) => {
            setLikedPosts(prev => {
              const current = !!prev[postId];
              const updated = { ...prev, [postId]: !current };
              if (!current && window.SoundEngine) window.SoundEngine.playHeart();
              return updated;
            });
          };

          const handleAddComment = (postId) => {
            if (!newCommentText.trim()) return;
            setCommunityPosts(prev => prev.map(p => {
              if (p.id === postId) {
                const updatedComments = [...(p.comments || []), {
                  id: `c-${Date.now()}`,
                  user: user.firstName || 'Pet Parent',
                  text: newCommentText.trim()
                }];
                return { ...p, comments: updatedComments, commentsCount: updatedComments.length };
              }
              return p;
            }));
            setNewCommentText('');
            if (window.SoundEngine) window.SoundEngine.playClicker();
            addToast('Comment posted! 💬', 'fa-comment');
          };

          return (
            <div className="community-page-wrapper">
              
              {/* ── SECTION 1: COMMUNITY INTRODUCTION ── */}
              <section className="community-intro-section glass-panel">
                <div className="community-intro-content">
                  <span className="badge-sky" style={{ marginBottom: '12px', display: 'inline-block' }}>
                    <i className="fa-solid fa-users" style={{ marginRight: '6px' }}></i> Pet Lovers Network
                  </span>
                  <h1 className="community-main-heading">
                    Forever Care <span className="gradient-text">Community 🐾</span>
                  </h1>
                  <p className="community-intro-text">
                    Connect with fellow pet lovers, share your experiences, discover helpful tips, and make a difference in the lives of pets.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
                    <button 
                      className="btn-sky-primary"
                      onClick={() => {
                        const el = document.getElementById('share-story-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <i className="fa-solid fa-pen-nib" style={{ marginRight: '8px' }}></i> Join Our Community & Share
                    </button>
                    <button 
                      className="btn-sky-outline"
                      onClick={() => {
                        const el = document.getElementById('faq-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <i className="fa-solid fa-circle-question" style={{ marginRight: '8px' }}></i> Platform FAQs
                    </button>
                  </div>
                </div>

                <div className="community-intro-img-wrap">
                  <img 
                    src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=700&q=80" 
                    alt="Happy pets and owners"
                    className="community-intro-img" 
                  />
                  <div className="community-stat-float-pill">
                    <i className="fa-solid fa-heart" style={{ color: '#f43f5e' }}></i>
                    <span>2.4k+ Community Members</span>
                  </div>
                </div>
              </section>

              {/* ── SECTION 2 & 4: CATEGORY FILTERS ── */}
              <div className="community-categories-bar glass-panel">
                <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fa-solid fa-filter" style={{ color: 'var(--primary-500)' }}></i> Explore Topics:
                </div>
                <div className="category-filter-chips">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      className={`filter-chip ${communityCategory === cat ? 'active' : ''}`}
                      onClick={() => {
                        setCommunityCategory(cat);
                        if (window.SoundEngine) window.SoundEngine.playClicker();
                      }}
                    >
                      {cat === 'All' ? '🌟 All Posts' : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Success Banner when a post is shared */}
              {postSuccessBanner && (
                <div className="post-success-banner" style={{ animation: 'slideInRight 0.4s ease' }}>
                  <i className="fa-solid fa-circle-check" style={{ fontSize: '1.4rem' }}></i>
                  <div>
                    <strong>Your post has been shared with the community! 🐾</strong>
                    <div style={{ fontSize: '0.84rem', opacity: 0.9 }}>Thank you for inspiring pet parents worldwide.</div>
                  </div>
                </div>
              )}

              {/* ── MAIN COMMUNITY LAYOUT: POSTS (LEFT) & SIDEBAR (RIGHT) ── */}
              <div className="community-grid-layout">
                
                {/* LEFT: POSTS STREAM */}
                <div className="community-posts-stream">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)', margin: 0 }}>
                      Latest Community <span className="gradient-text">Posts</span>
                    </h2>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Showing {filteredPosts.length} discussions
                    </span>
                  </div>

                  {filteredPosts.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
                      <i className="fa-solid fa-comments" style={{ fontSize: '3rem', color: 'var(--primary-300)', marginBottom: '14px' }}></i>
                      <h3>No posts found in "{communityCategory}"</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Be the first pet parent to share a story in this category!</p>
                    </div>
                  ) : (
                    filteredPosts.map(post => {
                      const isLiked = !!likedPosts[post.id];
                      const totalLikes = isLiked ? post.likes + 1 : post.likes;
                      const isCommentsOpen = activeCommentPostId === post.id;

                      return (
                        <article key={post.id} className="community-post-card glass-card-hover">
                          {/* Post Author Header */}
                          <div className="post-author-row">
                            <img src={post.userAvatar} alt={post.userName} className="post-author-avatar" />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: '700', fontSize: '0.98rem', color: 'var(--text-main)' }}>{post.userName}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>{post.date}</div>
                            </div>
                            <span className="badge-sky" style={{ fontSize: '0.78rem' }}>{post.category}</span>
                          </div>

                          {/* Post Content */}
                          <h3 className="post-title">{post.title}</h3>
                          <p className="post-body">{post.content}</p>

                          {/* Optional Pet Image */}
                          {post.petImage && (
                            <div className="post-image-wrap">
                              <img src={post.petImage} alt={post.title} className="post-pet-img" />
                            </div>
                          )}

                          {/* Post Action Buttons */}
                          <div className="post-actions-bar">
                            <button 
                              className={`post-action-btn ${isLiked ? 'liked' : ''}`}
                              onClick={() => handleToggleLike(post.id)}
                            >
                              <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart`} style={{ color: isLiked ? '#f43f5e' : 'inherit' }}></i>
                              <span>{totalLikes} Likes</span>
                            </button>

                            <button 
                              className={`post-action-btn ${isCommentsOpen ? 'active' : ''}`}
                              onClick={() => setActiveCommentPostId(isCommentsOpen ? null : post.id)}
                            >
                              <i className="fa-regular fa-comment-dots"></i>
                              <span>{post.commentsCount || (post.comments ? post.comments.length : 0)} Comments</span>
                            </button>

                            <button 
                              className="post-action-btn"
                              onClick={() => {
                                if (navigator.clipboard) {
                                  navigator.clipboard.writeText(`${window.location.origin}#${post.id}`);
                                }
                                addToast(`Post link copied to clipboard! 📋`, 'fa-share-nodes');
                              }}
                            >
                              <i className="fa-solid fa-share-nodes"></i>
                              <span>Share</span>
                            </button>
                          </div>

                          {/* Interactive Comment Drawer */}
                          {isCommentsOpen && (
                            <div className="post-comments-drawer">
                              <div className="comments-list">
                                {post.comments && post.comments.length > 0 ? (
                                  post.comments.map(c => (
                                    <div key={c.id} className="comment-bubble">
                                      <div style={{ fontWeight: '700', fontSize: '0.82rem', color: 'var(--primary-700)' }}>{c.user}</div>
                                      <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginTop: '2px' }}>{c.text}</div>
                                    </div>
                                  ))
                                ) : (
                                  <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', fontStyle: 'italic', marginBottom: '8px' }}>
                                    No comments yet. Start the conversation!
                                  </div>
                                )}
                              </div>

                              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                <input 
                                  type="text" 
                                  className="input-sky" 
                                  placeholder="Write a supportive comment..." 
                                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                                  value={newCommentText}
                                  onChange={(e) => setNewCommentText(e.target.value)}
                                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                                />
                                <button 
                                  className="btn-sky-primary" 
                                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                                  onClick={() => handleAddComment(post.id)}
                                >
                                  Post
                                </button>
                              </div>
                            </div>
                          )}
                        </article>
                      );
                    })
                  )}
                </div>

                {/* RIGHT SIDEBAR: SHARE A POST FORM & POPULAR MEMBERS */}
                <div className="community-sidebar">
                  
                  {/* ── SECTION 3: CREATE / SHARE A POST ── */}
                  <div id="share-story-section" className="glass-panel" style={{ padding: '26px', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                      <div className="btn-icon" style={{ background: 'rgba(14, 165, 233, 0.15)', color: 'var(--primary-600)' }}>
                        <i className="fa-solid fa-pen-to-square"></i>
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Share Your Story</h3>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>Inspire thousands of pet parents</span>
                      </div>
                    </div>

                    <form onSubmit={handlePublishPost} noValidate>
                      <div className="form-group-custom">
                        <label className="form-label-custom">Your Name</label>
                        <input 
                          type="text" 
                          id="post-name-input"
                          className="input-sky" 
                          placeholder="e.g. Ayesha / Pet Parent"
                          value={newPostForm.name}
                          onChange={(e) => setNewPostForm({ ...newPostForm, name: e.target.value })}
                        />
                      </div>

                      <div className="form-group-custom">
                        <label className="form-label-custom">Post Title</label>
                        <input 
                          type="text" 
                          id="post-title-input"
                          className="input-sky" 
                          placeholder="e.g. My First Day With My Adopted Puppy 🐶"
                          value={newPostForm.title}
                          onChange={(e) => setNewPostForm({ ...newPostForm, title: e.target.value })}
                        />
                      </div>

                      <div className="form-group-custom">
                        <label className="form-label-custom">Topic Category</label>
                        <select 
                          className="input-sky"
                          value={newPostForm.category}
                          onChange={(e) => setNewPostForm({ ...newPostForm, category: e.target.value })}
                        >
                          <option>Pet Stories</option>
                          <option>Adoption</option>
                          <option>Pet Care</option>
                          <option>Health</option>
                          <option>Tips & Advice</option>
                          <option>Events</option>
                        </select>
                      </div>

                      <div className="form-group-custom">
                        <label className="form-label-custom">Story / Thoughts</label>
                        <textarea 
                          id="post-content-input"
                          className="input-sky" 
                          rows="4" 
                          placeholder="Share your pet experience, tips or happy moments..."
                          value={newPostForm.content}
                          onChange={(e) => setNewPostForm({ ...newPostForm, content: e.target.value })}
                        ></textarea>
                      </div>

                      <div className="form-group-custom">
                        <label className="form-label-custom"><i className="fa-solid fa-image" style={{ marginRight: '6px', color: 'var(--primary-500)' }}></i> Pet Photo (Choose File)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          {newPostForm.petImage && (
                            <img 
                              src={newPostForm.petImage} 
                              alt="Preview" 
                              style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', objectFit: 'cover', border: '2px solid var(--primary-400)' }} 
                              onError={(e) => { e.target.style.display='none'; }} 
                            />
                          )}
                          <input 
                            type="file" 
                            accept="image/*"
                            className="input-sky"
                            style={{ flex: 1, padding: '8px' }}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              if (file.size > 5 * 1024 * 1024) {
                                addToast('Image size must be under 5 MB', 'fa-triangle-exclamation', 'warning');
                                return;
                              }
                              const reader = new FileReader();
                              reader.onload = (ev) => setNewPostForm({ ...newPostForm, petImage: ev.target.result });
                              reader.readAsDataURL(file);
                            }}
                          />
                        </div>
                        <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '5px' }}>Accepted: JPG, PNG, WEBP — Max 5 MB</p>
                      </div>

                      <button type="submit" className="btn-sky-primary" style={{ width: '100%', padding: '12px' }}>
                        <i className="fa-solid fa-paper-plane" style={{ marginRight: '8px' }}></i> Publish Post 🐾
                      </button>
                    </form>
                  </div>

                  {/* ── SECTION 5: POPULAR COMMUNITY MEMBERS ── */}
                  <div className="glass-panel" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                      <div className="btn-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
                        <i className="fa-solid fa-award"></i>
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Community Members</h3>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>Active voices & advocates</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {communityMembers.map(m => (
                        <div key={m.id} className="member-item-row">
                          <img src={m.avatar} alt={m.name} className="member-avatar" />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: '700', fontSize: '0.92rem', color: 'var(--text-main)' }}>{m.name}</div>
                            <span className="badge-sky" style={{ fontSize: '0.68rem', padding: '2px 8px', margin: '2px 0 4px' }}>{m.badge}</span>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>{m.bio}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '4px' }}>
                              <i className="fa-solid fa-pen-nib" style={{ marginRight: '4px' }}></i> {m.postsCount} posts
                            </div>
                          </div>
                          <button 
                            className="btn-sky-outline" 
                            style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                            onClick={() => {
                              addToast(`Viewing ${m.name}'s public profile`, 'fa-user');
                            }}
                          >
                            Profile
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

              {/* ── SECTION 6: GENERAL WEBSITE FAQ ACCORDION ── */}
              <section id="faq-section" className="community-faq-section">
                <div className="about-section-label">
                  <span className="badge-sky"><i className="fa-solid fa-circle-question" style={{ marginRight: '6px' }}></i> Platform Knowledge Base</span>
                  <h2 className="about-section-heading" style={{ textAlign: 'center', marginTop: '10px' }}>
                    Frequently Asked <span className="gradient-text">Questions</span>
                  </h2>
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', maxWidth: '600px', margin: '10px auto 0', fontSize: '0.97rem' }}>
                    Everything you need to know about adoption, veterinary care, pet store delivery, and community support.
                  </p>
                </div>

                <div className="faq-accordion-wrap">
                  {faqs.map((faq, index) => {
                    const isOpen = activeFaqIndex === index;
                    return (
                      <div key={index} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
                        <button 
                          className="faq-question-btn"
                          onClick={() => {
                            setActiveFaqIndex(isOpen ? null : index);
                            if (window.SoundEngine) window.SoundEngine.playClicker();
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div className="faq-icon-pill">
                              <i className={faq.icon}></i>
                            </div>
                            <div style={{ textAlign: 'left' }}>
                              <span className="faq-category-tag">{faq.category}</span>
                              <div className="faq-question-text">{faq.question}</div>
                            </div>
                          </div>
                          <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'} faq-chevron`}></i>
                        </button>

                        {isOpen && (
                          <div className="faq-answer-pane">
                            <p>{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

            </div>
          );
        })()}

        {/* ==================================================================
            TAB 8: ABOUT US — Full Premium Page (All 6 Sections)
            ================================================================== */}
        {activeTab === 'about' && (() => {

          /* ── JSON data powering the page (Clean Professional Icons, No AI Emojis) ── */
          const offerCards = [
            {
              icon: 'fa-solid fa-paw',
              title: 'Pet Adoption',
              desc: 'Browse hundreds of loving pets waiting for their forever home. Our shelter network makes adoption easy, joyful and fully supported.',
              color: '#0ea5e9',
              actionTab: 'shelter',
              actionText: 'Explore Adoption'
            },
            {
              icon: 'fa-solid fa-user-doctor',
              title: 'Veterinary Care',
              desc: 'Connect with certified veterinarians for consultations, health check-ups, vaccinations and emergency medical guidance anytime.',
              color: '#8b5cf6',
              actionTab: 'vet',
              actionText: 'Book Vet Doctor'
            },
            {
              icon: 'fa-solid fa-bag-shopping',
              title: 'Pet Products',
              desc: 'Shop premium, vet-recommended food, grooming supplies, toys and accessories delivered safely right to your door.',
              color: '#f59e0b',
              actionTab: 'products',
              actionText: 'Shop Marketplace'
            },
            {
              icon: 'fa-solid fa-book-open',
              title: 'Pet Care Resources',
              desc: 'Access expert-curated guides, nutrition tips, training techniques and health articles to become the best pet parent.',
              color: '#10b981',
              actionTab: 'home',
              actionText: 'Care Guides'
            }
          ];

          const whyCards = [
            { icon: 'fa-solid fa-heart', title: 'Loving & Caring Community', desc: 'A warm network of pet lovers, owners and professionals who genuinely care about every animal.', color: '#f43f5e' },
            { icon: 'fa-solid fa-shield-halved', title: 'Trusted Pet Care', desc: 'All veterinary partners are certified professionals. Every resource is reviewed by pet care experts.', color: '#0ea5e9' },
            { icon: 'fa-solid fa-handshake', title: 'Easy Pet Adoption', desc: 'Streamlined adoption process connecting shelters with loving families — transparent, fast and joyful.', color: '#8b5cf6' },
            { icon: 'fa-solid fa-lightbulb', title: 'Helpful Resources', desc: '50+ guides, tips and care articles to empower you with the knowledge every great pet parent needs.', color: '#f59e0b' }
          ];

          const impactStats = [
            { number: '500+', label: 'Pets Helped', icon: 'fa-solid fa-paw', color: '#0ea5e9' },
            { number: '100+', label: 'Happy Families', icon: 'fa-solid fa-house', color: '#10b981' },
            { number: '50+', label: 'Pet Care Resources', icon: 'fa-solid fa-book-open', color: '#8b5cf6' },
            { number: '25+', label: 'Veterinary Partners', icon: 'fa-solid fa-user-doctor', color: '#f59e0b' }
          ];

          const impactPillars = [
            { icon: 'fa-solid fa-house', text: 'Helping pets find loving forever homes' },
            { icon: 'fa-solid fa-handshake', text: 'Connecting pet parents with trusted care' },
            { icon: 'fa-solid fa-shield-heart', text: 'Promoting responsible pet ownership' },
            { icon: 'fa-solid fa-users', text: 'Building a caring pet community' }
          ];

          return (
            <div className="about-page-wrapper">

              {/* ── SECTION 1: WHO WE ARE ── */}
              <section className="about-who-section">
                <div className="about-who-img-col">
                  <div className="about-img-frame">
                    <img
                      src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80"
                      alt="Happy dog with owner — FurEver Care"
                      className="about-hero-img"
                    />
                    <div className="about-img-badge">
                      <i className="fa-solid fa-paw"></i>
                      <span>Est. 2024</span>
                    </div>
                    <div className="about-img-floating-pill">
                      <i className="fa-solid fa-heart" style={{color:'#f43f5e',marginRight:'6px'}}></i>
                      Pets First, Always
                    </div>
                  </div>
                </div>

                <div className="about-who-text-col">
                  <span className="badge-sky" style={{marginBottom:'14px',display:'inline-block'}}>
                    <i className="fa-solid fa-paw" style={{marginRight:'6px'}}></i> Who We Are
                  </span>
                  <h2 className="about-section-heading">
                    We Are <span className="gradient-text">FurEver Care</span> —<br />
                    Where Every Pet Matters
                  </h2>
                  <p style={{color:'var(--text-muted)',lineHeight:'1.8',marginBottom:'16px',fontSize:'1.02rem'}}>
                    FurEver Care is a comprehensive digital platform built with a single purpose: to make every pet's life healthier, happier and more loved. We bring together dedicated pet owners, certified veterinarians and compassionate animal shelters under one unified community.
                  </p>
                  <p style={{color:'var(--text-muted)',lineHeight:'1.8',marginBottom:'28px',fontSize:'1.02rem'}}>
                    From seamless pet adoption journeys to expert veterinary consultations, curated pet products and a rich library of pet-care resources — we are your complete companion for responsible, joyful pet ownership.
                  </p>
                  <div style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
                    <button
                      className="btn-sky-primary"
                      style={{display:'flex',alignItems:'center',gap:'8px'}}
                      onClick={() => {
                        const el = document.getElementById('about-mission-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <i className="fa-solid fa-bullseye"></i> Our Mission
                    </button>
                    <button
                      className="btn-sky-outline"
                      style={{display:'flex',alignItems:'center',gap:'8px'}}
                      onClick={() => setActiveTab('shelter')}
                    >
                      <i className="fa-solid fa-heart"></i> Explore Adoptions
                    </button>
                  </div>
                </div>
              </section>

              {/* ── SECTION 2: MISSION & VISION ── */}
              <section id="about-mission-section" className="about-mv-section">
                <div className="about-mv-card" style={{borderTop:'3px solid var(--primary-500)'}}>
                  <div className="about-mv-icon" style={{background:'rgba(14,165,233,0.12)',color:'var(--primary-600)'}}>
                    <i className="fa-solid fa-bullseye"></i>
                  </div>
                  <span className="badge-sky" style={{marginBottom:'12px',display:'inline-block'}}>Our Mission</span>
                  <h3 style={{fontSize:'1.35rem',marginBottom:'14px',fontFamily:'var(--font-heading)'}}>Caring for Every Pet, Every Day</h3>
                  <p style={{color:'var(--text-muted)',lineHeight:'1.8',fontSize:'1.05rem',fontStyle:'italic'}}>
                    "To create a caring community where every pet can live a healthy, happy and loved life."
                  </p>
                  <div className="about-mv-divider"></div>
                  <p style={{color:'var(--text-light)',fontSize:'0.9rem'}}>
                    We achieve this by connecting people, pets and professionals through technology, compassion and community.
                  </p>
                </div>

                <div className="about-mv-card" style={{borderTop:'3px solid #8b5cf6'}}>
                  <div className="about-mv-icon" style={{background:'rgba(139,92,246,0.12)',color:'#8b5cf6'}}>
                    <i className="fa-solid fa-eye"></i>
                  </div>
                  <span className="badge-sky" style={{marginBottom:'12px',display:'inline-block',background:'rgba(139,92,246,0.1)',color:'#7c3aed',borderColor:'rgba(139,92,246,0.3)'}}>Our Vision</span>
                  <h3 style={{fontSize:'1.35rem',marginBottom:'14px',fontFamily:'var(--font-heading)'}}>A World Where No Pet Is Left Behind</h3>
                  <p style={{color:'var(--text-muted)',lineHeight:'1.8',fontSize:'1.05rem',fontStyle:'italic'}}>
                    "A world where no pet is left without love, care or a forever home."
                  </p>
                  <div className="about-mv-divider"></div>
                  <p style={{color:'var(--text-light)',fontSize:'0.9rem'}}>
                    We envision communities where shelters are empty, pets thrive, and every animal is treasured as a family member.
                  </p>
                </div>
              </section>

              {/* ── SECTION 3: WHAT WE OFFER ── */}
              <section className="about-section-block">
                <div className="about-section-label">
                  <span className="badge-sky"><i className="fa-solid fa-star" style={{marginRight:'6px'}}></i> What We Offer</span>
                  <h2 className="about-section-heading" style={{textAlign:'center',marginTop:'10px'}}>
                    Everything Your Pet <span className="gradient-text">Deserves</span>
                  </h2>
                  <p style={{color:'var(--text-muted)',textAlign:'center',maxWidth:'560px',margin:'10px auto 0',fontSize:'0.97rem'}}>
                    Four pillars of comprehensive pet care — all in one place, designed with love.
                  </p>
                </div>

                <div className="about-offer-grid">
                  {offerCards.map((card, i) => (
                    <div key={i} className="about-offer-card glass-card-hover">
                      <div className="about-offer-icon-wrap" style={{background:`linear-gradient(135deg, ${card.color}22, ${card.color}0a)`,color:card.color,border:`1.5px solid ${card.color}35`,boxShadow:`0 8px 20px ${card.color}20`}}>
                        <i className={card.icon} style={{fontSize:'1.65rem'}}></i>
                      </div>
                      <h3 style={{fontSize:'1.18rem',fontWeight:'800',marginBottom:'10px',fontFamily:'var(--font-heading)',color:'var(--text-main)'}}>{card.title}</h3>
                      <p style={{color:'var(--text-muted)',fontSize:'0.88rem',lineHeight:'1.7',marginBottom:'18px'}}>{card.desc}</p>
                      <button 
                        onClick={() => { setActiveTab(card.actionTab); if (window.SoundEngine) window.SoundEngine.playClicker(); }}
                        style={{ marginTop: 'auto', background: 'transparent', border: 'none', color: card.color, fontWeight: '800', fontSize: '0.86rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: 0 }}
                      >
                        <span>{card.actionText}</span>
                        <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.75rem', transition: 'transform 0.2s' }}></i>
                      </button>
                      <div className="about-offer-line" style={{background:card.color}}></div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── SECTION 4: WHY CHOOSE FUREVER CARE ── */}
              <section className="about-why-section">
                <div className="about-why-text">
                  <span className="badge-sky" style={{marginBottom:'14px',display:'inline-block'}}>
                    <i className="fa-solid fa-trophy" style={{marginRight:'6px'}}></i> Why Choose Us
                  </span>
                  <h2 className="about-section-heading">
                    Why Choose <span className="gradient-text">FurEver Care?</span>
                  </h2>
                  <p style={{color:'var(--text-muted)',marginTop:'12px',lineHeight:'1.8',maxWidth:'420px',fontSize:'0.97rem'}}>
                    We are more than a platform. We are a movement — built on love, trust and a shared commitment to every animal's wellbeing.
                  </p>

                  <div className="about-why-features">
                    {whyCards.map((w, i) => (
                      <div key={i} className="about-why-feature-row">
                        <div className="about-why-icon" style={{background:`${w.color}18`,color:w.color}}>
                          <i className={w.icon}></i>
                        </div>
                        <div>
                          <div style={{fontWeight:'700',fontSize:'0.98rem',color:'var(--text-main)',marginBottom:'3px'}}>{w.title}</div>
                          <div style={{color:'var(--text-muted)',fontSize:'0.85rem',lineHeight:'1.6'}}>{w.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="about-why-img-col">
                  <div className="about-img-frame" style={{borderRadius:'var(--radius-xl)'}}>
                    <img
                      src="https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=700&q=80"
                      alt="Veterinarian caring for a cat — FurEver Care"
                      className="about-hero-img"
                      style={{borderRadius:'var(--radius-xl)'}}
                    />
                  </div>
                </div>
              </section>

              {/* ── SECTION 5: IMPACT / COMMUNITY ── */}
              <section className="about-impact-section">
                <div className="about-impact-header">
                  <span className="badge-sky" style={{marginBottom:'14px',display:'inline-block'}}>
                    <i className="fa-solid fa-chart-line" style={{marginRight:'6px'}}></i> Our Impact
                  </span>
                  <h2 className="about-section-heading" style={{textAlign:'center'}}>
                    Real Lives, <span className="gradient-text">Real Change</span>
                  </h2>
                  <p style={{color:'var(--text-muted)',textAlign:'center',maxWidth:'520px',margin:'10px auto 0',fontSize:'0.97rem'}}>
                    Every number represents a life touched, a family completed and a pet given the love they always deserved.
                  </p>
                </div>

                {/* Stats Row */}
                <div className="about-stats-grid">
                  {impactStats.map((stat, i) => (
                    <div key={i} className="about-stat-card glass-card-hover">
                      <div className="about-stat-icon" style={{background:`${stat.color}18`,color:stat.color}}>
                        <i className={stat.icon} style={{fontSize:'1.5rem'}}></i>
                      </div>
                      <div className="about-stat-number" style={{color:stat.color}}>{stat.number}</div>
                      <div className="about-stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Impact Pillars */}
                <div className="about-pillars-grid">
                  {impactPillars.map((p, i) => (
                    <div key={i} className="about-pillar-item glass-panel">
                      <i className={p.icon} style={{color:'var(--primary-500)',fontSize:'1.25rem',marginRight:'12px',flexShrink:0}}></i>
                      <span style={{color:'var(--text-main)',fontWeight:'600',fontSize:'0.95rem'}}>{p.text}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* ── SECTION 6: FINAL CTA ── */}
              <section className="about-cta-section">
                <div className="about-cta-paw-bg">
                  <i className="fa-solid fa-paw about-cta-paw-1"></i>
                  <i className="fa-solid fa-paw about-cta-paw-2"></i>
                  <i className="fa-solid fa-paw about-cta-paw-3"></i>
                </div>
                <div className="about-cta-content">
                  <div className="about-cta-badge">
                    <i className="fa-solid fa-heart" style={{color:'#f43f5e',marginRight:'8px'}}></i>
                    Make a Difference Today
                  </div>
                  <h2 className="about-cta-heading">
                    Ready to Give a Pet a<br />
                    <span className="gradient-text">Forever Home?</span>
                  </h2>
                  <p className="about-cta-sub">
                    Find your new best friend and make a difference today. Every adoption is a life saved, a family made whole.
                  </p>
                  <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
                    <button
                      className="btn-sky-primary"
                      style={{padding:'14px 32px',fontSize:'1.05rem',display:'flex',alignItems:'center',gap:'10px'}}
                      onClick={() => { setActiveTab('shelter'); if (window.SoundEngine) window.SoundEngine.playChime(); }}
                    >
                      Explore Pets ❤️
                    </button>
                    <button
                      className="btn-sky-outline"
                      style={{padding:'14px 28px',fontSize:'1.05rem',display:'flex',alignItems:'center',gap:'10px'}}
                      onClick={() => setActiveTab('vet')}
                    >
                      <i className="fa-solid fa-stethoscope"></i> Meet Our Vets
                    </button>
                  </div>
                </div>
              </section>

            </div>
          );
        })()}


        {/* ==================================================================
            TAB: VIP LUXURY CONTACT US PAGE
            ================================================================== */}
        {/* ==================================================================
            TAB: COMPETITION-LEVEL PREMIUM CONTACT US PAGE
            ================================================================== */}
        {activeTab === 'contact' && (() => {
          return (
            <div className="fc-contact-container" style={{ animation: 'fadeIn 0.35s ease' }}>
              
              {/* ── TOP CONTACT INTRO ── */}
              <div className="fc-contact-intro">
                <div className="fc-intro-badge">
                  <i className="fa-solid fa-paw"></i> WE'D LOVE TO HEAR FROM YOU
                </div>
                <h1 className="fc-intro-heading">
                  Contact <span className="fc-text-blue">Us</span>
                </h1>
                <p className="fc-intro-subtext">
                  Have a question, need support, or want to book an appointment? We're here for you and your furry friend.
                </p>
              </div>

              {/* ── MAIN CONTACT TWO-COLUMN LAYOUT ── */}
              <div className="fc-contact-grid">
                
                {/* ── LEFT SIDE: 4 FLOATING CARDS + PROMO + SOCIAL ── */}
                <div className="fc-contact-left">
                  
                  {/* CARD 1: Call Us */}
                  <a 
                    href="tel:+923001234567" 
                    className="fc-contact-card"
                    onClick={() => addToast('Dialing Furever Care: +92 300 1234567', 'fa-phone', 'info')}
                  >
                    <div className="fc-card-main">
                      <div className="fc-card-icon-circle">
                        <i className="fa-solid fa-phone"></i>
                      </div>
                      <div>
                        <div className="fc-card-title">Call Us</div>
                        <div className="fc-card-desc">Speak with our care team.</div>
                        <div className="fc-card-highlight">+92 300 1234567</div>
                      </div>
                    </div>
                    <div className="fc-card-arrow">
                      <i className="fa-solid fa-arrow-right"></i>
                    </div>
                  </a>

                  {/* CARD 2: Email Us */}
                  <a 
                    href="mailto:hello@furevercare.com" 
                    className="fc-contact-card"
                  >
                    <div className="fc-card-main">
                      <div className="fc-card-icon-circle">
                        <i className="fa-solid fa-envelope"></i>
                      </div>
                      <div>
                        <div className="fc-card-title">Email Us</div>
                        <div className="fc-card-desc">We'll reply to your email.</div>
                        <div className="fc-card-highlight">hello@furevercare.com</div>
                      </div>
                    </div>
                    <div className="fc-card-arrow">
                      <i className="fa-solid fa-arrow-right"></i>
                    </div>
                  </a>

                  {/* CARD 3: Visit Us */}
                  <div className="fc-contact-card" style={{ cursor: 'default' }}>
                    <div className="fc-card-main">
                      <div className="fc-card-icon-circle">
                        <i className="fa-solid fa-location-dot"></i>
                      </div>
                      <div>
                        <div className="fc-card-title">Visit Us</div>
                        <div className="fc-card-desc">Come say hello at our center.</div>
                        <div className="fc-card-highlight" style={{ fontSize: '0.88rem' }}>
                          Furever Care Center, 123 Paw Street, Karachi, Pakistan
                        </div>
                      </div>
                    </div>
                    <div className="fc-card-arrow">
                      <i className="fa-solid fa-compass"></i>
                    </div>
                  </div>

                  {/* CARD 4: Opening Hours */}
                  <div className="fc-contact-card" style={{ cursor: 'default' }}>
                    <div className="fc-card-main">
                      <div className="fc-card-icon-circle">
                        <i className="fa-solid fa-clock"></i>
                      </div>
                      <div>
                        <div className="fc-card-title">Opening Hours</div>
                        <div className="fc-card-desc">We're here to care for pets.</div>
                        <div className="fc-card-highlight" style={{ fontSize: '0.85rem' }}>
                          Mon – Sat: 9:00 AM – 8:00 PM<br />
                          Sunday: 10:00 AM – 6:00 PM
                        </div>
                      </div>
                    </div>
                    <div className="fc-card-arrow">
                      <i className="fa-solid fa-heart-pulse"></i>
                    </div>
                  </div>

                  {/* ── PET CARE MESSAGE CARD ── */}
                  <div className="fc-pet-message-card">
                    <div>
                      <div className="fc-pet-msg-title">"Because every paw matters." 🐾</div>
                      <div className="fc-pet-msg-sub">
                        Your pet's happiness is our mission. We treat them like family.
                      </div>
                    </div>
                    <img 
                      src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=300&q=80" 
                      alt="Cute realistic puppy and kitten" 
                      className="fc-pet-msg-img"
                    />
                  </div>

                  {/* ── SOCIAL MEDIA SECTION ── */}
                  <div className="fc-social-box">
                    <div className="fc-social-title">Follow Us 🐾</div>
                    <div className="fc-social-row">
                      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="fc-social-btn" title="Facebook">
                        <i className="fa-brands fa-facebook-f"></i>
                      </a>
                      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="fc-social-btn" title="Instagram">
                        <i className="fa-brands fa-instagram"></i>
                      </a>
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="fc-social-btn" title="Twitter / X">
                        <i className="fa-brands fa-x-twitter"></i>
                      </a>
                      <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="fc-social-btn" title="YouTube">
                        <i className="fa-brands fa-youtube"></i>
                      </a>
                      <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="fc-social-btn" title="TikTok">
                        <i className="fa-brands fa-tiktok"></i>
                      </a>
                    </div>
                  </div>

                </div>

                {/* ── RIGHT SIDE: CONTACT FORM CARD ── */}
                <div className="fc-form-card">
                  
                  <div className="fc-form-header">
                    <h2 className="fc-form-title">Send Us a Message 🐾</h2>
                    <p className="fc-form-subtitle">Fill out the form below and we'll get back to you soon.</p>
                    <div className="fc-form-decor-paw">
                      <i className="fa-solid fa-heart" style={{ color: '#f43f5e', fontSize: '1.2rem', marginRight: '6px' }}></i>
                      <i className="fa-solid fa-paw"></i>
                    </div>
                  </div>

                  <form noValidate onSubmit={(e) => {
                    e.preventDefault();
                    const errs = {};
                    if (!contactForm.name || !contactForm.name.trim()) errs.name = 'Please enter your full name';
                    if (!contactForm.email || !contactForm.email.trim() || !contactForm.email.includes('@')) errs.email = 'Please enter a valid email address';
                    if (!contactForm.phone || !contactForm.phone.trim()) errs.phone = 'Please enter your phone number';
                    if (!contactForm.message || !contactForm.message.trim()) errs.message = 'Please type your message';
                    if (!contactForm.agreed) errs.agreed = 'Please agree to the privacy policy and terms';

                    setContactErrors(errs);
                    if (Object.keys(errs).length > 0) {
                      if (window.SoundEngine) window.SoundEngine.playBeep();
                      addToast('Please complete required fields', 'fa-triangle-exclamation', 'warning');
                      return;
                    }

                    const ticketRef = 'FC-' + Math.floor(100000 + Math.random() * 900000);
                    setContactSuccessData({
                      ticket: ticketRef,
                      name: contactForm.name,
                      email: contactForm.email,
                      phone: contactForm.phone,
                      petName: contactForm.petName || 'Companion',
                      subject: contactForm.inquiryType || 'General Inquiry',
                      message: contactForm.message
                    });

                    setContactSuccessModal(true);
                    setContactForm({ name: '', email: '', phone: '', petName: '', inquiryType: 'General Inquiry', priority: 'Standard', message: '', agreed: false });
                    setContactErrors({});
                    if (window.SoundEngine) window.SoundEngine.playChime();
                  }}>

                    {/* Row 1: Full Name + Email Address */}
                    <div className="fc-form-row">
                      <div className="fc-form-group" style={{ marginBottom: 0 }}>
                        <label className="fc-label">Full Name *</label>
                        <input 
                          type="text" 
                          className="fc-input" 
                          placeholder="e.g. Hamna Khan"
                          value={contactForm.name || ''}
                          onChange={(e) => { setContactForm({ ...contactForm, name: e.target.value }); setContactErrors({ ...contactErrors, name: '' }); }}
                          style={{ borderColor: contactErrors.name ? '#ef4444' : '' }}
                        />
                        {contactErrors.name && <span style={{ color: '#ef4444', fontSize: '0.74rem', marginTop: '4px' }}>{contactErrors.name}</span>}
                      </div>

                      <div className="fc-form-group" style={{ marginBottom: 0 }}>
                        <label className="fc-label">Email Address *</label>
                        <input 
                          type="email" 
                          className="fc-input" 
                          placeholder="hamna@example.com"
                          value={contactForm.email || ''}
                          onChange={(e) => { setContactForm({ ...contactForm, email: e.target.value }); setContactErrors({ ...contactErrors, email: '' }); }}
                          style={{ borderColor: contactErrors.email ? '#ef4444' : '' }}
                        />
                        {contactErrors.email && <span style={{ color: '#ef4444', fontSize: '0.74rem', marginTop: '4px' }}>{contactErrors.email}</span>}
                      </div>
                    </div>

                    {/* Row 2: Phone Number + Pet Name */}
                    <div className="fc-form-row" style={{ marginTop: '16px' }}>
                      <div className="fc-form-group" style={{ marginBottom: 0 }}>
                        <label className="fc-label">Phone Number *</label>
                        <input 
                          type="text" 
                          className="fc-input" 
                          placeholder="+92 300 1234567"
                          value={contactForm.phone || ''}
                          onChange={(e) => { setContactForm({ ...contactForm, phone: e.target.value }); setContactErrors({ ...contactErrors, phone: '' }); }}
                          style={{ borderColor: contactErrors.phone ? '#ef4444' : '' }}
                        />
                        {contactErrors.phone && <span style={{ color: '#ef4444', fontSize: '0.74rem', marginTop: '4px' }}>{contactErrors.phone}</span>}
                      </div>

                      <div className="fc-form-group" style={{ marginBottom: 0 }}>
                        <label className="fc-label">Pet Name (if any)</label>
                        <input 
                          type="text" 
                          className="fc-input" 
                          placeholder="e.g. Bella / Milo"
                          value={contactForm.petName || ''}
                          onChange={(e) => setContactForm({ ...contactForm, petName: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Full Width: Select Subject */}
                    <div className="fc-form-group" style={{ marginTop: '16px' }}>
                      <label className="fc-label">Select Subject</label>
                      <select 
                        className="fc-input"
                        value={contactForm.inquiryType || 'General Inquiry'}
                        onChange={(e) => setContactForm({ ...contactForm, inquiryType: e.target.value })}
                      >
                        <option>General Inquiry</option>
                        <option>Appointment</option>
                        <option>Pet Care</option>
                        <option>Technical Support</option>
                        <option>Emergency</option>
                        <option>Other</option>
                      </select>
                    </div>

                    {/* Large Textarea: Your Message */}
                    <div className="fc-form-group">
                      <label className="fc-label">Your Message... *</label>
                      <textarea 
                        className="fc-input fc-textarea"
                        placeholder="Write your message or question here..."
                        value={contactForm.message || ''}
                        onChange={(e) => { setContactForm({ ...contactForm, message: e.target.value }); setContactErrors({ ...contactErrors, message: '' }); }}
                        style={{ borderColor: contactErrors.message ? '#ef4444' : '' }}
                      ></textarea>
                      {contactErrors.message && <span style={{ color: '#ef4444', fontSize: '0.74rem', marginTop: '4px' }}>{contactErrors.message}</span>}
                    </div>

                    {/* Privacy Agreement Checkbox */}
                    <div className="fc-checkbox-row">
                      <input 
                        type="checkbox" 
                        id="fc-agree-terms"
                        checked={contactForm.agreed || false}
                        onChange={(e) => { setContactForm({ ...contactForm, agreed: e.target.checked }); setContactErrors({ ...contactErrors, agreed: '' }); }}
                      />
                      <label htmlFor="fc-agree-terms" style={{ cursor: 'pointer' }}>
                        I agree to the privacy policy and terms.
                      </label>
                    </div>
                    {contactErrors.agreed && <div style={{ color: '#ef4444', fontSize: '0.74rem', margin: '-14px 0 16px' }}>{contactErrors.agreed}</div>}

                    {/* Primary Button */}
                    <button type="submit" className="fc-btn-submit">
                      <i className="fa-solid fa-paper-plane"></i>
                      <span>Send Message</span>
                      <i className="fa-solid fa-paw" style={{ fontSize: '0.9rem' }}></i>
                    </button>

                    <div className="fc-form-footer-safe">
                      <i className="fa-solid fa-shield-halved" style={{ color: '#2196F3' }}></i>
                      <span>Your information is safe with us.</span>
                    </div>

                    {/* Overlapping Realistic Puppy & Kitten Visual */}
                    <div className="fc-form-pet-badge">
                      <img 
                        src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=150&q=80" 
                        alt="Puppy and Kitten" 
                        className="fc-form-pet-thumb"
                      />
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '0.82rem', color: 'var(--fc-dark-navy)' }}>FurEver Care Team</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Ready to assist you &amp; your companions</div>
                      </div>
                    </div>

                  </form>
                </div>

              </div>

              {/* ── LOCATION SECTION ── */}
              <div className="fc-location-card">
                <div>
                  <div className="fc-loc-badge">
                    <i className="fa-solid fa-location-dot"></i> OUR LOCATION
                  </div>
                  <h2 className="fc-loc-heading">Find Furever Care Near You</h2>
                  <p className="fc-loc-text">
                    Visit our care center for the best services and treatment your pet deserves.
                  </p>
                  <a 
                    href="https://maps.google.com/?q=123+Paw+Street+Karachi+Pakistan" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="fc-btn-directions"
                  >
                    <i className="fa-solid fa-diamond-turn-right"></i>
                    <span>Get Directions</span>
                  </a>
                </div>

                <div className="fc-map-box">
                  <iframe 
                    title="Furever Care Center Map"
                    className="fc-map-frame"
                    src="https://maps.google.com/maps?q=Karachi%20Pakistan&t=&z=13&ie=UTF8&iwloc=&output=embed"
                    loading="lazy"
                    allowFullScreen
                  ></iframe>
                  <div className="fc-map-label-bar">
                    <i className="fa-solid fa-location-dot" style={{ color: '#2196F3', fontSize: '1.1rem' }}></i>
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--fc-dark-navy)' }}>Furever Care Center</strong>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>123 Paw Street, Karachi, Pakistan</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── FAQ SECTION ── */}
              <div className="fc-faq-section">
                <h2 className="fc-faq-heading">Frequently Asked Questions</h2>
                
                <div className="fc-faq-grid">
                  
                  {/* FAQ 1 */}
                  <div 
                    className={`fc-faq-card ${(contactFaqOpen === 1) ? 'open' : ''}`}
                    onClick={() => setContactFaqOpen(contactFaqOpen === 1 ? null : 1)}
                  >
                    <div className="fc-faq-question-row">
                      <div className="fc-faq-q-left">
                        <div className="fc-faq-icon-circle"><i className="fa-solid fa-bolt"></i></div>
                        <div className="fc-faq-question">How quickly will you respond?</div>
                      </div>
                      <div className="fc-faq-toggle-btn">
                        <i className={`fa-solid ${contactFaqOpen === 1 ? 'fa-xmark' : 'fa-plus'}`}></i>
                      </div>
                    </div>
                    {contactFaqOpen === 1 && (
                      <div className="fc-faq-answer">
                        We usually respond within a few hours during our working hours.
                      </div>
                    )}
                  </div>

                  {/* FAQ 2 */}
                  <div 
                    className={`fc-faq-card ${(contactFaqOpen === 2) ? 'open' : ''}`}
                    onClick={() => setContactFaqOpen(contactFaqOpen === 2 ? null : 2)}
                  >
                    <div className="fc-faq-question-row">
                      <div className="fc-faq-q-left">
                        <div className="fc-faq-icon-circle"><i className="fa-solid fa-calendar-check"></i></div>
                        <div className="fc-faq-question">Can I book an appointment here?</div>
                      </div>
                      <div className="fc-faq-toggle-btn">
                        <i className={`fa-solid ${contactFaqOpen === 2 ? 'fa-xmark' : 'fa-plus'}`}></i>
                      </div>
                    </div>
                    {contactFaqOpen === 2 && (
                      <div className="fc-faq-answer">
                        Yes! Our team will assist you in booking the best time for your pet.
                      </div>
                    )}
                  </div>

                  {/* FAQ 3 */}
                  <div 
                    className={`fc-faq-card ${(contactFaqOpen === 3) ? 'open' : ''}`}
                    onClick={() => setContactFaqOpen(contactFaqOpen === 3 ? null : 3)}
                  >
                    <div className="fc-faq-question-row">
                      <div className="fc-faq-q-left">
                        <div className="fc-faq-icon-circle"><i className="fa-solid fa-truck-medical"></i></div>
                        <div className="fc-faq-question">Do you provide emergency support?</div>
                      </div>
                      <div className="fc-faq-toggle-btn">
                        <i className={`fa-solid ${contactFaqOpen === 3 ? 'fa-xmark' : 'fa-plus'}`}></i>
                      </div>
                    </div>
                    {contactFaqOpen === 3 && (
                      <div className="fc-faq-answer">
                        Yes, we have 24/7 emergency support for your furry friends.
                      </div>
                    )}
                  </div>

                  {/* FAQ 4 */}
                  <div 
                    className={`fc-faq-card ${(contactFaqOpen === 4) ? 'open' : ''}`}
                    onClick={() => setContactFaqOpen(contactFaqOpen === 4 ? null : 4)}
                  >
                    <div className="fc-faq-question-row">
                      <div className="fc-faq-q-left">
                        <div className="fc-faq-icon-circle"><i className="fa-solid fa-id-card"></i></div>
                        <div className="fc-faq-question">How can I update my pet profile?</div>
                      </div>
                      <div className="fc-faq-toggle-btn">
                        <i className={`fa-solid ${contactFaqOpen === 4 ? 'fa-xmark' : 'fa-plus'}`}></i>
                      </div>
                    </div>
                    {contactFaqOpen === 4 && (
                      <div className="fc-faq-answer">
                        You can update your pet's profile from your account dashboard.
                      </div>
                    )}
                  </div>

                </div>
              </div>

            </div>
          );
        })()}



      </main>

      {/* ==================================================================
          FUTURISTIC FLOATING WIDGETS (AI PET CONCIERGE & EMERGENCY SOS)
          ================================================================== */}
      {/* Professional Pet Care Live AI Concierge Toggle */}
      <button className="ai-bot-toggle-btn" onClick={() => setAiChatOpen(!aiChatOpen)} title="24/7 Pet Care Live Assistant & Support">
        <i className={`fa-solid ${aiChatOpen ? 'fa-xmark' : 'fa-headset'}`}></i>
        <span style={{ position: 'absolute', top: '2px', right: '2px', width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', border: '2px solid #fff', boxShadow: '0 0 8px #10b981' }}></span>
      </button>

      {/* Emergency SOS Floating Button */}
      <button className="sos-floating-btn" onClick={() => setSosModalOpen(true)}>
        <i className="fa-solid fa-truck-medical"></i>
        <span>EMERGENCY SOS</span>
      </button>

      {/* AI Chat Window */}
      {aiChatOpen && (
        <div className="chat-modal-window glass-panel-strong">
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="widget-icon-circle widget-icon-sky" style={{ width: '34px', height: '34px', borderRadius: '10px' }}>
                <i className="fa-solid fa-headset"></i>
              </div>
              <div>
                <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>FurEver Care AI Assistant</div>
                <div style={{ fontSize: '0.72rem', color: '#bae6fd', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '7px', height: '7px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
                  24/7 Roman Urdu & English Pet Care
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button 
                className="btn-icon" 
                title="Reset Chat"
                style={{ width: '28px', height: '28px', background: 'rgba(255,255,255,0.12)', color: '#fff', border: 'none' }} 
                onClick={() => setChatMessages([
                  { sender: 'bot', text: 'Assalam-o-Alaikum! 🐾 Hello! Main FurEver Care ka 24/7 AI Pet Assistant hoon.\n\nAap mujhse Roman Urdu ya English mein pets ki diet, ulti/dast/bukhar ke ilaj, vaccine schedule, grooming, ya doctor booking ke bare mein kuch bhi pooch sakte hain!' }
                ])}
              >
                <i className="fa-solid fa-rotate-right" style={{ fontSize: '0.75rem' }}></i>
              </button>
              <button className="btn-icon" style={{ width: '28px', height: '28px', background: 'transparent', color: '#fff', border: 'none' }} onClick={() => setAiChatOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>

          <div className="chat-messages-body">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Quick Topic Suggestion Chips */}
          <div style={{ display: 'flex', gap: '6px', padding: '8px 12px', overflowX: 'auto', background: 'var(--bg-glass)', borderTop: '1px solid var(--border-glass)' }}>
            {[
              { label: '🐶 Khana & Diet', query: 'Mera dog khana nahi kha raha kya karun?' },
              { label: '🐱 Ulti / Vomit', query: 'Billi ko ulti aa rahi hai ilaj batao' },
              { label: '💩 Dast / Diarrhea', query: 'Pet ko loose motion dast lag gaye hain kya dein?' },
              { label: '💉 Vaccine Schedule', query: 'Pet ki core vaccine ka schedule batao' },
              { label: '✂️ Bath & Grooming', query: 'Dog ko kab nehlana chahiye aur shampoo konsa use karein?' },
              { label: '🚨 SOS Emergency', query: 'Emergency poison aur helpline number kya hai?' },
              { label: '👨‍⚕️ Book Vet Doctor', query: 'Veterinarian doctor consultation kaise book karein?' }
            ].map((pill, idx) => (
              <button 
                key={idx}
                type="button"
                className="badge-sky"
                style={{ cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.72rem', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(56,189,248,0.3)', background: 'rgba(14,165,233,0.08)' }}
                onClick={() => triggerBotQuery(pill.query)}
              >
                {pill.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-bar">
            <input 
              type="text" 
              className="input-sky" 
              style={{ padding: '8px 14px', fontSize: '0.88rem' }}
              placeholder="Sawal poochein (Ask in Roman Urdu or English)..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" className="btn-icon" style={{ background: 'var(--primary-500)', color: '#fff' }}>
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </form>
        </div>
      )}

      {/* ==================================================================
          MODALS: VIDEO PLAYER, PRODUCT DETAIL, ADOPT APPLICATION, CHECKOUT
          ================================================================== */}
      {/* 1. Ultra-Luxury Video Masterclass Player Modal */}
      {activeVideo && (
        <div className="modal-overlay" onClick={() => setActiveVideo(null)}>
          <div className="modal-dialog-content video-masterclass-dialog" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge-sky"><i className="fa-solid fa-play" style={{ marginRight: '6px' }}></i> {activeVideo.category}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <i className="fa-regular fa-clock"></i> {activeVideo.duration}
                </span>
                <span style={{ fontSize: '0.78rem', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontWeight: '700' }}>
                  <i className="fa-solid fa-circle-check"></i> Vet Certified
                </span>
              </div>
              <button className="btn-icon" onClick={() => setActiveVideo(null)} title="Close Video">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Video Title */}
            <h3 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '14px', color: 'var(--text-main)' }}>
              {activeVideo.title}
            </h3>

            {/* 16:9 Cinema Player Frame */}
            <div className="video-cinema-frame" style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0, borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: '#000', marginBottom: '18px', border: '2px solid rgba(56, 189, 248, 0.35)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <iframe 
                src={`${activeVideo.videoUrl}?autoplay=1&rel=0&modestbranding=1`} 
                title={activeVideo.title}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>

            {/* Video Quick Controls & Direct Watch Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', background: 'rgba(14, 165, 233, 0.08)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(56, 189, 248, 0.2)', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                <i className="fa-solid fa-circle-info" style={{ color: '#38bdf8' }}></i>
                <span>HD 1080p Professional Companion Care Lesson</span>
              </div>
              <a 
                href={activeVideo.videoUrl.replace('/embed/', '/watch?v=')} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-sky-outline" 
                style={{ padding: '6px 14px', fontSize: '0.78rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <i className="fa-brands fa-youtube" style={{ color: '#f43f5e' }}></i> Open on YouTube
              </a>
            </div>

            {/* Video Description */}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '16px' }}>
              {activeVideo.description}
            </p>

            {/* Key Execution Steps Protocol */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-glass)', padding: '18px 20px', borderRadius: 'var(--radius-lg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-main)' }}>
                <i className="fa-solid fa-list-ol" style={{ color: 'var(--primary-500)' }}></i>
                <span>Key Execution Checklist & Technique Stages:</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {activeVideo.steps.map((st, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                    <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.15)', color: '#38bdf8', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: '800', flexShrink: 0, marginTop: '2px' }}>
                      {i + 1}
                    </span>
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. Product Quick View Modal */}
      {activeProductModal && (
        <div className="modal-overlay" onClick={() => setActiveProductModal(null)}>
          <div className="modal-dialog-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="badge-sky">{activeProductModal.category}</span>
              <button className="btn-icon" onClick={() => setActiveProductModal(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <img src={activeProductModal.image} alt={activeProductModal.name} style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{activeProductModal.name}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '16px' }}>{activeProductModal.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="product-price" style={{ fontSize: '1.8rem' }}>${activeProductModal.price.toFixed(2)}</div>
              <button className="btn-sky-primary" onClick={() => { setActiveProductModal(null); setCheckoutItem(activeProductModal); }}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Adopt Me Application Sheet */}
      {activeAdoptModal && (
        <div className="modal-overlay" onClick={() => setActiveAdoptModal(null)}>
          <div className="modal-dialog-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge-sky"><i className="fa-solid fa-paw"></i> Adoption Request</span>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Adopt {activeAdoptModal.name}</h3>
              </div>
              <button className="btn-icon" onClick={() => setActiveAdoptModal(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            
            {/* Selected Pet Mini Profile */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px 14px', background: 'rgba(14, 165, 233, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(56, 189, 248, 0.25)', marginBottom: '18px' }}>
              <img src={activeAdoptModal.image || activeAdoptModal.photo} alt={activeAdoptModal.name} style={{ width: '54px', height: '54px', borderRadius: '10px', objectFit: 'cover' }} />
              <div>
                <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.98rem' }}>{activeAdoptModal.name} ({activeAdoptModal.breed || activeAdoptModal.species})</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{activeAdoptModal.age} • {activeAdoptModal.gender} • {activeAdoptModal.shelter || 'FurEver Rescue Shelter'}</div>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '16px' }}>
              Submit your adoption application. Our shelter coordinator will contact you within 24-48 hours.
            </p>
            
            <form noValidate onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const nameInput = form.elements['adoptFullName'];
              const phoneInput = form.elements['adoptPhone'];
              const envInput = form.elements['adoptEnv'];

              if (!nameInput || !nameInput.value.trim()) {
                markInvalidField(nameInput, 'Please enter your full name');
                return;
              }
              if (!phoneInput || !phoneInput.value.trim()) {
                markInvalidField(phoneInput, 'Please enter contact phone number');
                return;
              }
              if (!envInput || !envInput.value.trim()) {
                markInvalidField(envInput, 'Please specify your home environment');
                return;
              }
              
              const successPayload = {
                petName: activeAdoptModal.name,
                petSpecies: activeAdoptModal.species || 'Companion',
                petBreed: activeAdoptModal.breed || 'Rescue Pet',
                petImage: activeAdoptModal.image || activeAdoptModal.photo,
                petAge: activeAdoptModal.age || 'Young',
                shelter: activeAdoptModal.shelter || 'FurEver Central Rescue Hub',
                applicantName: nameInput.value.trim(),
                phone: phoneInput.value.trim(),
                environment: envInput.value.trim(),
                refId: `ADOPT-${Math.floor(1000 + Math.random() * 9000)}`,
                submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              };

              setActiveAdoptModal(null);
              setAdoptSuccessData(successPayload);
              if (window.SoundEngine) window.SoundEngine.playChime();
            }}>
              <div className="form-group-custom">
                <label className="form-label-custom">Your Full Name</label>
                <input type="text" name="adoptFullName" className="input-sky" defaultValue={user.firstName || 'Alex Johnson'} />
              </div>
              <div className="form-group-custom">
                <label className="form-label-custom">Phone Number</label>
                <input type="tel" name="adoptPhone" className="input-sky" placeholder="+1 (555) 000-0000" defaultValue="+1 (555) 912-3849" />
              </div>
              <div className="form-group-custom">
                <label className="form-label-custom">Home Environment (House with yard / Apartment)</label>
                <input type="text" name="adoptEnv" className="input-sky" placeholder="e.g. 2-Bedroom Apartment, Fenced Garden" defaultValue="2-Bedroom Apartment with Balcony" />
              </div>
              <button type="submit" className="btn-sky-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem' }}>
                <i className="fa-solid fa-heart" style={{ marginRight: '8px' }}></i> Submit Adoption Application
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── ADOPTION APPLICATION SUCCESS CONFIRMATION MODAL ── */}
      {adoptSuccessData && (
        <div className="modal-overlay" onClick={() => setAdoptSuccessData(null)}>
          <div className="modal-dialog-content adopt-success-dialog" style={{ maxWidth: '580px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            
            {/* Header Animated Icon */}
            <div className="reschedule-success-icon" style={{ background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.2), rgba(225, 29, 72, 0.12))', borderColor: '#f43f5e', color: '#f43f5e' }}>
              <i className="fa-solid fa-heart-circle-check"></i>
            </div>

            <span className="badge-sky" style={{ marginBottom: '10px', background: 'rgba(16, 185, 129, 0.12)', color: '#059669', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              <i className="fa-solid fa-shield-heart" style={{ marginRight: '6px' }}></i> APPLICATION RECEIVED & IN REVIEW
            </span>

            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', margin: '8px 0 10px', color: 'var(--text-main)' }}>
              Adoption Request Submitted!
            </h2>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '20px', lineHeight: '1.6' }}>
              Thank you, <strong>{adoptSuccessData.applicantName}</strong>! Your adoption application for <strong style={{ color: 'var(--primary-600)' }}>{adoptSuccessData.petName}</strong> has been logged under Ref: <strong>{adoptSuccessData.refId}</strong>.
            </p>

            {/* Pet & Applicant Summary Card */}
            <div style={{ background: 'var(--bg-surface)', padding: '16px 18px', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--border-glow)', textAlign: 'left', marginBottom: '20px', boxShadow: 'var(--card-shadow)' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '14px', marginBottom: '14px' }}>
                <img src={adoptSuccessData.petImage} alt={adoptSuccessData.petName} style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--text-main)' }}>{adoptSuccessData.petName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{adoptSuccessData.petBreed} • {adoptSuccessData.petAge}</div>
                  <div style={{ fontSize: '0.76rem', color: '#10b981', marginTop: '2px' }}><i className="fa-solid fa-hotel"></i> {adoptSuccessData.shelter}</div>
                </div>
                <div className="badge-sky" style={{ fontSize: '0.78rem' }}>{adoptSuccessData.refId}</div>
              </div>

              {/* Application Milestone Steps */}
              <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#38bdf8', fontWeight: '800', marginBottom: '10px' }}>
                Adoption Journey Milestones:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: '700' }}>
                  <i className="fa-solid fa-circle-check"></i> 1. Form Submitted
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: '700' }}>
                  <i className="fa-solid fa-clock"></i> 2. Shelter Review (24h)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                  <i className="fa-regular fa-circle"></i> 3. Meet & Greet Visit
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                  <i className="fa-regular fa-circle"></i> 4. Welcome Home ❤️
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn-sky-primary" 
                style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }} 
                onClick={() => {
                  setAdoptSuccessData(null);
                  addToast(`Shelter coordinator will call you at ${adoptSuccessData.phone}!`, 'fa-phone');
                }}
              >
                <i className="fa-solid fa-circle-check" style={{ marginRight: '6px' }}></i> Done & Explore Shelter Pets
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. Luxury Express Checkout Sheet */}
      {checkoutItem && (
        <div className="modal-overlay" onClick={() => setCheckoutItem(null)}>
          <div className="modal-dialog-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-600)' }}>
                  <i className="fa-solid fa-lock"></i>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Express Secure Checkout</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>256-Bit SSL Encrypted Pet Store Payment</span>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setCheckoutItem(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>

            {/* Product Summary Card with Live Quantity */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding: '16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-glow)', marginBottom: '20px', boxShadow: 'var(--card-shadow)' }}>
              <img src={checkoutItem.image} alt={checkoutItem.name} style={{ width: '75px', height: '75px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border-glass)' }} />
              <div style={{ flex: 1 }}>
                <span className="badge-sky" style={{ fontSize: '0.72rem', marginBottom: '4px' }}>{checkoutItem.category}</span>
                <div style={{ fontWeight: '700', fontSize: '1.05rem', color: 'var(--text-main)' }}>{checkoutItem.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                  <div style={{ color: 'var(--primary-600)', fontWeight: '800', fontSize: '1.15rem' }}>
                    ${(checkoutItem.price * checkoutQty).toFixed(2)}
                    {checkoutQty > 1 && <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', fontWeight: '400', marginLeft: '6px' }}>(${checkoutItem.price.toFixed(2)} ea)</span>}
                  </div>

                  {/* Quantity Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-glass)', padding: '4px 10px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-glass)' }}>
                    <button 
                      type="button"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', fontSize: '0.9rem', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => setCheckoutQty(Math.max(1, checkoutQty - 1))}
                    >
                      <i className="fa-solid fa-minus"></i>
                    </button>
                    <span style={{ fontWeight: '700', fontSize: '0.95rem', minWidth: '18px', textAlign: 'center' }}>{checkoutQty}</span>
                    <button 
                      type="button"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', fontSize: '0.9rem', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={() => setCheckoutQty(checkoutQty + 1)}
                    >
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <form noValidate onSubmit={(e) => {
              e.preventDefault();
              if (!checkoutFormData.fullName.trim()) {
                markInvalidField(document.getElementById('checkout-name'), 'Please enter recipient full name');
                return;
              }
              if (!checkoutFormData.phone.trim()) {
                markInvalidField(document.getElementById('checkout-phone'), 'Please enter phone number for courier tracking');
                return;
              }
              if (!checkoutFormData.address.trim()) {
                markInvalidField(document.getElementById('checkout-address'), 'Please enter delivery street address');
                return;
              }
              if (!checkoutFormData.city.trim()) {
                markInvalidField(document.getElementById('checkout-city'), 'Please enter city name');
                return;
              }

              const orderInfo = {
                orderId: `FC-${Math.floor(10000 + Math.random() * 90000)}`,
                productName: checkoutItem.name,
                productImage: checkoutItem.image,
                productCategory: checkoutItem.category,
                qty: checkoutQty,
                unitPrice: checkoutItem.price,
                total: (checkoutItem.price * checkoutQty).toFixed(2),
                recipient: checkoutFormData.fullName.trim(),
                phone: checkoutFormData.phone.trim(),
                address: `${checkoutFormData.address.trim()}, ${checkoutFormData.city.trim()}`,
                paymentMethod: checkoutPaymentMethod === 'card' ? 'Credit / Debit Card' : checkoutPaymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Apple / Google Digital Pay',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                estDelivery: '24 - 48 Hours (Guaranteed Pet-Safe Express Dispatch)'
              };
              setOrderSuccessData(orderInfo);
              setCheckoutItem(null);
              setCheckoutQty(1);
              if (window.SoundEngine) window.SoundEngine.playChime();
              addToast(`Order #${orderInfo.orderId} Confirmed!`, 'fa-circle-check');
            }}>
              {/* Customer Contact & Delivery Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group-custom">
                  <label className="form-label-custom">Full Recipient Name *</label>
                  <input 
                    type="text" 
                    id="checkout-name"
                    className="input-sky" 
                    placeholder="e.g. Hamna Ali" 
                    value={checkoutFormData.fullName}
                    onChange={(e) => setCheckoutFormData({ ...checkoutFormData, fullName: e.target.value })}
                  />
                </div>
                <div className="form-group-custom">
                  <label className="form-label-custom">Phone (for Courier Tracking) *</label>
                  <input 
                    type="tel" 
                    id="checkout-phone"
                    className="input-sky" 
                    placeholder="+92 300 1234567" 
                    value={checkoutFormData.phone}
                    onChange={(e) => setCheckoutFormData({ ...checkoutFormData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div className="form-group-custom">
                  <label className="form-label-custom">Delivery Street Address *</label>
                  <input 
                    type="text" 
                    id="checkout-address"
                    className="input-sky" 
                    placeholder="House / Flat No, Street, Landmark" 
                    value={checkoutFormData.address}
                    onChange={(e) => setCheckoutFormData({ ...checkoutFormData, address: e.target.value })}
                  />
                </div>
                <div className="form-group-custom">
                  <label className="form-label-custom">City *</label>
                  <input 
                    type="text" 
                    id="checkout-city"
                    className="input-sky" 
                    placeholder="City Name" 
                    value={checkoutFormData.city}
                    onChange={(e) => setCheckoutFormData({ ...checkoutFormData, city: e.target.value })}
                  />
                </div>
              </div>

              {/* Payment Methods Selector Tabs */}
              <div className="form-group-custom">
                <label className="form-label-custom">Select Payment Method</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '6px' }}>
                  <div 
                    className={`payment-option-card ${checkoutPaymentMethod === 'card' ? 'active' : ''}`}
                    onClick={() => setCheckoutPaymentMethod('card')}
                  >
                    <i className="fa-solid fa-credit-card" style={{ fontSize: '1.2rem', marginBottom: '4px', color: 'var(--primary-600)' }}></i>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>Credit / Debit</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Visa, Mastercard</div>
                  </div>

                  <div 
                    className={`payment-option-card ${checkoutPaymentMethod === 'cod' ? 'active' : ''}`}
                    onClick={() => setCheckoutPaymentMethod('cod')}
                  >
                    <i className="fa-solid fa-hand-holding-dollar" style={{ fontSize: '1.2rem', marginBottom: '4px', color: '#10b981' }}></i>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>Cash on Delivery</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Pay at Doorstep</div>
                  </div>

                  <div 
                    className={`payment-option-card ${checkoutPaymentMethod === 'digital' ? 'active' : ''}`}
                    onClick={() => setCheckoutPaymentMethod('digital')}
                  >
                    <i className="fa-brands fa-apple-pay" style={{ fontSize: '1.4rem', marginBottom: '2px', color: 'var(--primary-700)' }}></i>
                    <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>Digital Pay</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>Apple / Google</div>
                  </div>
                </div>
              </div>

              {/* Credit Card Details if Card Selected */}
              {checkoutPaymentMethod === 'card' && (
                <div style={{ background: 'var(--bg-glass)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', marginBottom: '16px' }}>
                  <div className="form-group-custom" style={{ marginBottom: '10px' }}>
                    <label className="form-label-custom" style={{ fontSize: '0.82rem' }}>Card Number</label>
                    <input 
                      type="text" 
                      className="input-sky" 
                      placeholder="4532 •••• •••• 8892" 
                      maxLength="19"
                      value={checkoutFormData.cardNumber}
                      onChange={(e) => setCheckoutFormData({ ...checkoutFormData, cardNumber: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label className="form-label-custom" style={{ fontSize: '0.82rem' }}>Expiry Date</label>
                      <input 
                        type="text" 
                        className="input-sky" 
                        placeholder="MM/YY (e.g. 08/28)" 
                        maxLength="5"
                        value={checkoutFormData.cardExp}
                        onChange={(e) => setCheckoutFormData({ ...checkoutFormData, cardExp: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="form-label-custom" style={{ fontSize: '0.82rem' }}>CVV / CVC</label>
                      <input 
                        type="password" 
                        className="input-sky" 
                        placeholder="•••" 
                        maxLength="4"
                        value={checkoutFormData.cardCvc}
                        onChange={(e) => setCheckoutFormData({ ...checkoutFormData, cardCvc: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Price Breakdown Summary */}
              <div style={{ padding: '12px 16px', background: 'var(--bg-glass-strong)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>Subtotal ({checkoutQty} item{checkoutQty > 1 ? 's' : ''}):</span>
                  <span>${(checkoutItem.price * checkoutQty).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', color: '#10b981', marginBottom: '6px' }}>
                  <span><i className="fa-solid fa-truck-fast"></i> Express Pet-Safe Delivery:</span>
                  <span>FREE</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary-700)', borderTop: '1px dashed var(--border-glass)', paddingTop: '8px', marginTop: '4px' }}>
                  <span>Total Amount:</span>
                  <span>${(checkoutItem.price * checkoutQty).toFixed(2)}</span>
                </div>
              </div>

              <button type="submit" className="btn-sky-primary" style={{ width: '100%', padding: '15px', fontSize: '1.05rem' }}>
                <i className="fa-solid fa-shield-check" style={{ marginRight: '8px' }}></i>
                Confirm & Place Order (${(checkoutItem.price * checkoutQty).toFixed(2)})
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4b. Order Placed Success Confirmation Modal */}
      {orderSuccessData && (
        <div className="modal-overlay" onClick={() => setOrderSuccessData(null)}>
          <div className="modal-dialog-content" style={{ maxWidth: '580px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ margin: '0 auto 16px', width: '70px', height: '70px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(14, 165, 233, 0.15))', border: '2px solid #10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-circle-check" style={{ fontSize: '2.4rem', color: '#10b981' }}></i>
            </div>

            <span className="badge-sky" style={{ marginBottom: '10px', background: 'rgba(16, 185, 129, 0.12)', color: '#059669', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
              <i className="fa-solid fa-shield-check" style={{ marginRight: '6px' }}></i> ORDER CONFIRMED & DISPATCHED
            </span>
            <h2 style={{ fontSize: '1.8rem', margin: '6px 0 10px' }}>Thank You For Your Order!</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '22px' }}>
              Your order <strong style={{ color: 'var(--primary-600)' }}>#{orderSuccessData.orderId}</strong> has been successfully placed and forwarded to our rapid fulfillment hub.
            </p>

            {/* Receipt Summary Card */}
            <div style={{ background: 'var(--bg-surface)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-glow)', textAlign: 'left', marginBottom: '20px', boxShadow: 'var(--card-shadow)' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '14px', marginBottom: '14px' }}>
                <img src={orderSuccessData.productImage} alt={orderSuccessData.productName} style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>{orderSuccessData.productName}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-light)', marginTop: '2px' }}>Quantity: <strong>{orderSuccessData.qty}x</strong> • ${orderSuccessData.unitPrice.toFixed(2)} each</div>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-600)' }}>${orderSuccessData.total}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                <div>
                  <div style={{ color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>Recipient</div>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)', marginTop: '2px' }}>{orderSuccessData.recipient}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>Payment Mode</div>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)', marginTop: '2px' }}>{orderSuccessData.paymentMethod}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>Delivery Location</div>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)', marginTop: '2px' }}>{orderSuccessData.address}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-light)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>Estimated Arrival</div>
                  <div style={{ fontWeight: '700', color: '#10b981', marginTop: '2px' }}>{orderSuccessData.estDelivery}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                className="btn-sky-primary" 
                style={{ flex: 1, padding: '12px 20px', fontSize: '0.95rem' }}
                onClick={() => {
                  const trackingData = {
                    ...orderSuccessData,
                    status: 'In Transit',
                    courier: 'FurEver Express Courier (Driver: Mark S.)',
                    courierPhone: '+1 (555) 789-2341',
                    currentStep: 3,
                    trackingNum: 'FE-' + Math.floor(100000 + Math.random() * 900000)
                  };
                  setOrderSuccessData(null);
                  setActiveTrackOrder(trackingData);
                  if (window.SoundEngine) window.SoundEngine.playClicker();
                }}
              >
                <i className="fa-solid fa-truck-fast" style={{ marginRight: '8px' }}></i> Track Order Live
              </button>
              <button 
                className="btn-sky-outline" 
                style={{ padding: '12px 20px', fontSize: '0.95rem' }}
                onClick={() => setOrderSuccessData(null)}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LIVE ORDER TRACKING MODAL ── */}
      {activeTrackOrder && (
        <div className="modal-overlay" onClick={() => setActiveTrackOrder(null)}>
          <div className="modal-dialog-content order-track-dialog" style={{ maxWidth: '640px', padding: '0', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            
            {/* Header Sticky */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 24px 18px', borderBottom: '1px solid var(--border-glass)', background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(56, 189, 248, 0.04))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #0284c7, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.2rem', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)' }}>
                  <i className="fa-solid fa-truck-fast"></i>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-main)' }}>Live Order Tracking</h3>
                  <span style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: '700' }}>Tracking #{activeTrackOrder.trackingNum || 'FE-782941'} • Order #{activeTrackOrder.orderId || 'ORD-8942'}</span>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setActiveTrackOrder(null)}><i className="fa-solid fa-xmark"></i></button>
            </div>

            <div style={{ padding: '22px 24px' }}>

              {/* Status Header Pill */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-lg)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 10px #10b981' }}></span>
                  <strong style={{ color: '#10b981', fontSize: '0.92rem' }}>Status: On The Way (In Transit)</strong>
                </div>
                <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  ETA: <strong>{activeTrackOrder.estDelivery || 'Today by 04:30 PM'}</strong>
                </span>
              </div>

              {/* 4-Step Visual Tracking Timeline */}
              <div className="order-timeline-track" style={{ marginBottom: '24px', padding: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#38bdf8', fontWeight: '800', marginBottom: '16px' }}>
                  Fulfillment & Delivery Progress:
                </div>

                <div className="tracking-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', position: 'relative' }}>
                  
                  {/* Step 1 */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', fontSize: '0.88rem', boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)' }}>
                      <i className="fa-solid fa-check"></i>
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>Order Placed</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Payment Verified</div>
                  </div>

                  {/* Step 2 */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', fontSize: '0.88rem', boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)' }}>
                      <i className="fa-solid fa-box"></i>
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-main)' }}>Packed</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Warehouse Ready</div>
                  </div>

                  {/* Step 3 (Active) */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #38bdf8)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', fontSize: '0.88rem', boxShadow: '0 0 0 4px rgba(56, 189, 248, 0.35)', animation: 'pulse 1.8s infinite' }}>
                      <i className="fa-solid fa-truck"></i>
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '800', color: '#38bdf8' }}>In Transit</div>
                    <div style={{ fontSize: '0.68rem', color: '#38bdf8' }}>On Courier Van</div>
                  </div>

                  {/* Step 4 */}
                  <div style={{ textAlign: 'center', opacity: 0.55 }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', fontSize: '0.88rem' }}>
                      <i className="fa-solid fa-house"></i>
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)' }}>Delivered</div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Doorstep Handover</div>
                  </div>

                </div>
              </div>

              {/* Delivery Courier & Driver Contact Card */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: 'rgba(14, 165, 233, 0.06)', border: '1px solid rgba(56, 189, 248, 0.22)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', fontSize: '1.1rem' }}>
                    <i className="fa-solid fa-id-badge"></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '0.92rem', color: 'var(--text-main)' }}>{activeTrackOrder.courier || 'FurEver Express Logistics #FE-8921'}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Assigned Courier Driver: <strong>Mark Stevens</strong></div>
                  </div>
                </div>
                <a 
                  href="tel:+15557892341" 
                  className="btn-sky-outline" 
                  style={{ padding: '6px 14px', fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => addToast('Connecting to Courier Dispatcher...', 'fa-phone')}
                >
                  <i className="fa-solid fa-phone"></i> Call Driver
                </a>
              </div>

              {/* Package & Destination Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem', background: 'var(--bg-surface)', padding: '14px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', marginBottom: '20px' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: '700' }}>Item In Shipment</div>
                  <div style={{ fontWeight: '700', color: 'var(--text-main)', marginTop: '3px' }}>{activeTrackOrder.productName || 'Royal Canin Adult Food'}</div>
                  <div style={{ fontSize: '0.76rem', color: '#38bdf8' }}>Qty: {activeTrackOrder.qty || 1} • ${(parseFloat(activeTrackOrder.total) || 64.99).toFixed(2)}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: '700' }}>Delivery Address</div>
                  <div style={{ fontWeight: '600', color: 'var(--text-main)', marginTop: '3px' }}>{activeTrackOrder.address || 'Central Park West, Apt 4B, New York'}</div>
                  <div style={{ fontSize: '0.76rem', color: '#10b981' }}>Recipient: {activeTrackOrder.recipient || user.firstName || 'Alex Johnson'}</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="btn-sky-outline" 
                  style={{ flex: 1, padding: '10px' }} 
                  onClick={() => {
                    navigator.clipboard && navigator.clipboard.writeText(activeTrackOrder.trackingNum || 'FE-782941');
                    addToast('Tracking number copied!', 'fa-copy');
                  }}
                >
                  <i className="fa-solid fa-copy"></i> Copy Tracking #
                </button>
                <button 
                  className="btn-sky-primary" 
                  style={{ flex: 2, padding: '10px' }} 
                  onClick={() => setActiveTrackOrder(null)}
                >
                  <i className="fa-solid fa-check"></i> Close Tracker
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 4.5 EVENT RSVP / FREE PASS REGISTRATION & DIGITAL TICKET MODAL */}
      {activeRsvpModal && (
        <div className="modal-overlay" onClick={() => { setActiveRsvpModal(null); setRsvpConfirmedData(null); }}>
          <div 
            className="modal-dialog-content custom-modal-scroll" 
            style={{ maxWidth: '640px', padding: '0', maxHeight: '88vh', overflowY: 'auto', overflowX: 'hidden' }} 
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Event Header Banner */}
            <div style={{ position: 'relative', height: '180px' }}>
              <img src={activeRsvpModal.image} alt={activeRsvpModal.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6, 14, 29, 0.95) 0%, rgba(6, 14, 29, 0.3) 100%)' }}></div>
              <button 
                className="btn-icon" 
                style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none' }}
                onClick={() => { setActiveRsvpModal(null); setRsvpConfirmedData(null); }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div style={{ position: 'absolute', bottom: '16px', left: '20px', right: '20px' }}>
                <span className="badge-sky" style={{ marginBottom: '6px', display: 'inline-block' }}>{activeRsvpModal.tag}</span>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>{activeRsvpModal.title}</h3>
              </div>
            </div>

            <div style={{ padding: '24px' }}>
              {rsvpConfirmedData ? (
                /* Confirmed Digital Ticket Pass & Success Screen */
                <div style={{ textAlign: 'center', animation: 'introFadeIn 0.4s ease' }}>
                  <div className="feedback-thankyou-icon" style={{ background: '#10b981', color: '#fff', width: '70px', height: '70px', fontSize: '2.2rem', margin: '0 auto 16px' }}>
                    <i className="fa-solid fa-circle-check"></i>
                  </div>
                  <span className="badge-sky" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#059669', borderColor: '#10b981', marginBottom: '8px', padding: '6px 14px', fontSize: '0.82rem' }}>
                    <i className="fa-solid fa-sparkles" style={{ marginRight: '6px' }}></i> RSVP SUCCESSFUL • SEAT RESERVED!
                  </span>
                  <h2 style={{ fontSize: '1.65rem', margin: '10px 0 6px', fontFamily: 'var(--font-heading)' }}>
                    Congratulations, Your Seat is Confirmed!
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 20px', lineHeight: '1.6' }}>
                    Your free event reservation for <strong>{activeRsvpModal.title}</strong> has been processed successfully. We have saved your spot on the guest list!
                  </p>

                  {/* Digital Ticket Pass Card */}
                  <div className="rsvp-ticket-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--border-glow)', paddingBottom: '12px', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src="assets/logo.png?v=13" alt="Logo" style={{ width: '28px', height: '28px' }} />
                        <span style={{ fontWeight: '800', fontSize: '0.92rem', fontFamily: 'var(--font-heading)' }}>FurEver Care Pass</span>
                      </div>
                      <div className="rsvp-ticket-code">{rsvpConfirmedData.passId}</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px', textAlign: 'left', fontSize: '0.84rem' }}>
                      <div>
                        <div style={{ color: 'var(--text-light)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Attendee Name</div>
                        <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{rsvpConfirmedData.name}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-light)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Reserved Seats</div>
                        <div style={{ fontWeight: '700', color: 'var(--primary-600)' }}>{rsvpConfirmedData.guests}x Free Seat(s)</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-light)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Date & Schedule</div>
                        <div style={{ fontWeight: '600' }}>{activeRsvpModal.date} • {activeRsvpModal.time}</div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--text-light)', fontSize: '0.72rem', textTransform: 'uppercase' }}>Venue Location</div>
                        <div style={{ fontWeight: '600' }}>{activeRsvpModal.location}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', marginTop: '22px' }}>
                    <button 
                      className="btn-sky-primary" 
                      style={{ flex: 1, padding: '12px 18px', fontSize: '0.95rem' }}
                      onClick={() => {
                        window.print();
                      }}
                    >
                      <i className="fa-solid fa-print" style={{ marginRight: '8px' }}></i> Print / Save Pass
                    </button>
                    <button 
                      className="btn-sky-outline" 
                      style={{ padding: '12px 22px', fontSize: '0.95rem' }}
                      onClick={() => {
                        setActiveRsvpModal(null);
                        setRsvpConfirmedData(null);
                        addToast(`Welcome to ${activeRsvpModal.title}! See you there.`, 'fa-circle-check');
                      }}
                    >
                      Continue <i className="fa-solid fa-arrow-right" style={{ marginLeft: '6px' }}></i>
                    </button>
                  </div>
                </div>
              ) : (
                /* RSVP Form with Continue Button */
                <div>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '18px', padding: '12px 16px', background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                    <i className="fa-solid fa-location-dot" style={{ color: '#f43f5e', fontSize: '1.2rem' }}></i>
                    <div style={{ flex: 1, fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{activeRsvpModal.date} • {activeRsvpModal.time}</div>
                      <div style={{ color: 'var(--text-muted)' }}>{activeRsvpModal.location}</div>
                    </div>
                    <span className="badge-sky" style={{ fontSize: '0.75rem' }}>
                      <i className="fa-solid fa-users" style={{ marginRight: '4px' }}></i> {activeRsvpModal.rsvpCount} Attending
                    </span>
                  </div>

                  <form noValidate onSubmit={(e) => {
                    e.preventDefault();
                    if (!rsvpFormData.name.trim()) {
                      markInvalidField(document.getElementById('rsvp-name'), 'Please provide attendee full name');
                      return;
                    }
                    if (!rsvpFormData.email.trim() || !/^\S+@\S+\.\S+$/.test(rsvpFormData.email)) {
                      markInvalidField(document.getElementById('rsvp-email'), 'Please provide a valid email address');
                      return;
                    }
                    const confirmed = {
                      passId: `#FE-${Math.floor(1000 + Math.random() * 9000)}`,
                      name: rsvpFormData.name.trim(),
                      email: rsvpFormData.email.trim(),
                      phone: rsvpFormData.phone.trim() || '(555) 019-2834',
                      guests: rsvpFormData.guests,
                      bringingPet: rsvpFormData.bringingPet
                    };
                    setRsvpConfirmedData(confirmed);
                    if (window.SoundEngine) window.SoundEngine.playChime();
                    addToast(`RSVP Successful! Free Pass created for ${confirmed.name}`, 'fa-circle-check');
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div className="form-group-custom">
                        <label className="form-label-custom">Attendee Full Name *</label>
                        <input 
                          type="text" 
                          id="rsvp-name"
                          className="input-sky" 
                          placeholder="e.g. Alex Johnson"
                          value={rsvpFormData.name}
                          onChange={(e) => setRsvpFormData({ ...rsvpFormData, name: e.target.value })}
                        />
                      </div>
                      <div className="form-group-custom">
                        <label className="form-label-custom">Email Address *</label>
                        <input 
                          type="email" 
                          id="rsvp-email"
                          className="input-sky" 
                          placeholder="alex@example.com"
                          value={rsvpFormData.email}
                          onChange={(e) => setRsvpFormData({ ...rsvpFormData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div className="form-group-custom">
                        <label className="form-label-custom">Seats to Reserve</label>
                        <select 
                          className="input-sky"
                          value={rsvpFormData.guests}
                          onChange={(e) => setRsvpFormData({ ...rsvpFormData, guests: Number(e.target.value) })}
                        >
                          <option value={1}>1 Free Seat (Self)</option>
                          <option value={2}>2 Free Seats (Pair)</option>
                          <option value={3}>3 Free Seats (Family)</option>
                          <option value={4}>4 Free Seats (Group)</option>
                        </select>
                      </div>
                      <div className="form-group-custom">
                        <label className="form-label-custom">Bringing a Pet Companion?</label>
                        <select 
                          className="input-sky"
                          value={rsvpFormData.bringingPet}
                          onChange={(e) => setRsvpFormData({ ...rsvpFormData, bringingPet: e.target.value })}
                        >
                          <option value="Yes">Yes, bringing my pet 🐾</option>
                          <option value="No">No, attending to adopt / volunteer</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group-custom">
                      <label className="form-label-custom">Mobile Number (For Pass SMS Alert)</label>
                      <input 
                        type="tel" 
                        className="input-sky" 
                        placeholder="(555) 000-0000"
                        value={rsvpFormData.phone}
                        onChange={(e) => setRsvpFormData({ ...rsvpFormData, phone: e.target.value })}
                      />
                    </div>

                    <button type="submit" className="btn-sky-primary" style={{ width: '100%', padding: '14px', fontSize: '1.02rem', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <span>Continue & Confirm RSVP</span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </form>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* 5. Add New Pet Profile Modal */}
      {addPetModalOpen && (
        <div className="modal-overlay" onClick={() => setAddPetModalOpen(false)}>
          <div className="modal-dialog-content" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-600)' }}>
                  <i className="fa-solid fa-paw"></i>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Register New Pet Companion</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>Add a pet profile to manage health records, vaccines & grooming</span>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setAddPetModalOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const newPet = {
                id: `PET-${100 + petsList.length + 1}`,
                name: newPetFormData.name || 'New Pet',
                species: newPetFormData.species || 'Dog',
                breed: newPetFormData.breed || 'Mixed Breed',
                age: newPetFormData.age || '1 Year',
                weight: newPetFormData.weight || '10 kg',
                gender: newPetFormData.gender || 'Male',
                microchip: newPetFormData.microchip || `985-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
                allergies: newPetFormData.allergies || 'None recorded',
                vaccinationInfo: 'Standard Vaccines Active',
                photo: newPetFormData.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
                dob: 'Jan 2025'
              };
              const updated = [...petsList, newPet];
              setPetsList(updated);
              localStorage.setItem('furever_pets', JSON.stringify(updated));
              setActivePetId(newPet.id);
              setAddPetModalOpen(false);
              setNewPetFormData({
                name: '',
                species: 'Dog',
                breed: '',
                age: '',
                weight: '',
                gender: 'Male',
                microchip: '',
                allergies: '',
                photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80'
              });
              if (window.SoundEngine) window.SoundEngine.playChime();
              addToast(`Added ${newPet.name} (${newPet.breed}) to your pet family!`, 'fa-heart');
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group-custom">
                  <label className="form-label-custom">Pet Name *</label>
                  <input 
                    type="text" 
                    id="newpet-name-input"
                    className="input-sky" 
                    placeholder="e.g. Bella or Simba" 
                    value={newPetFormData.name} 
                    onChange={(e) => setNewPetFormData({ ...newPetFormData, name: e.target.value })} 
                  />
                </div>
                <div className="form-group-custom">
                  <label className="form-label-custom">Pet Species</label>
                  <select 
                    className="input-sky" 
                    value={newPetFormData.species} 
                    onChange={(e) => setNewPetFormData({ ...newPetFormData, species: e.target.value })}
                  >
                    <option value="Dog">Canine (Dog)</option>
                    <option value="Cat">Feline (Cat)</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Bird">Bird / Parrot</option>
                    <option value="Hamster">Hamster / Small Pet</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group-custom">
                  <label className="form-label-custom">Breed *</label>
                  <input 
                    type="text" 
                    id="newpet-breed-input"
                    className="input-sky" 
                    placeholder="e.g. Siberian Husky or Persian Cat" 
                    value={newPetFormData.breed} 
                    onChange={(e) => setNewPetFormData({ ...newPetFormData, breed: e.target.value })} 
                  />
                </div>
                <div className="form-group-custom">
                  <label className="form-label-custom">Gender</label>
                  <select 
                    className="input-sky" 
                    value={newPetFormData.gender} 
                    onChange={(e) => setNewPetFormData({ ...newPetFormData, gender: e.target.value })}
                  >
                    <option value="Male">Male ♂</option>
                    <option value="Female">Female ♀</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group-custom">
                  <label className="form-label-custom">Age *</label>
                  <input 
                    type="text" 
                    id="newpet-age-input"
                    className="input-sky" 
                    placeholder="e.g. 2 Years 3 Months" 
                    value={newPetFormData.age} 
                    onChange={(e) => setNewPetFormData({ ...newPetFormData, age: e.target.value })} 
                  />
                </div>
                <div className="form-group-custom">
                  <label className="form-label-custom">Weight</label>
                  <input 
                    type="text" 
                    className="input-sky" 
                    placeholder="e.g. 14.5 kg" 
                    value={newPetFormData.weight} 
                    onChange={(e) => setNewPetFormData({ ...newPetFormData, weight: e.target.value })} 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group-custom">
                  <label className="form-label-custom">Microchip ID (Optional)</label>
                  <input 
                    type="text" 
                    className="input-sky" 
                    placeholder="e.g. 985-2341-9012" 
                    value={newPetFormData.microchip} 
                    onChange={(e) => setNewPetFormData({ ...newPetFormData, microchip: e.target.value })} 
                  />
                </div>
                <div className="form-group-custom">
                  <label className="form-label-custom">Known Allergies / Diet Notes</label>
                  <input 
                    type="text" 
                    className="input-sky" 
                    placeholder="e.g. Chicken protein allergy" 
                    value={newPetFormData.allergies} 
                    onChange={(e) => setNewPetFormData({ ...newPetFormData, allergies: e.target.value })} 
                  />
                </div>
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom"><i className="fa-solid fa-image" style={{ marginRight: '6px', color: 'var(--primary-500)' }}></i> Pet Photo (Choose File)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  {newPetFormData.photo && <img src={newPetFormData.photo} alt="preview" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-400)' }} onError={(e) => { e.target.style.display='none'; }} />}
                  <input 
                    type="file" 
                    accept="image/*"
                    className="input-sky"
                    style={{ flex: 1, padding: '8px' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) {
                        markInvalidField(e.target, 'Image size must be under 5 MB');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (ev) => setNewPetFormData({ ...newPetFormData, photo: ev.target.result });
                      reader.readAsDataURL(file);
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '5px' }}>Accepted: JPG, PNG, WEBP — Max 5 MB</p>
              </div>

              <button
                type="button"
                className="btn-sky-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
                onClick={(e) => {
                  if (!newPetFormData.name.trim()) {
                    markInvalidField(document.getElementById('newpet-name-input'), 'Pet name is required!');
                    return;
                  }
                  if (!newPetFormData.breed.trim()) {
                    markInvalidField(document.getElementById('newpet-breed-input'), 'Please enter pet breed!');
                    return;
                  }
                  if (!newPetFormData.age.trim()) {
                    markInvalidField(document.getElementById('newpet-age-input'), 'Please enter pet age!');
                    return;
                  }
                  const newPet = {
                    id: `PET-${100 + petsList.length + 1}`,
                    name: newPetFormData.name,
                    species: newPetFormData.species || 'Dog',
                    breed: newPetFormData.breed,
                    age: newPetFormData.age,
                    weight: newPetFormData.weight || '10 kg',
                    gender: newPetFormData.gender || 'Male',
                    microchip: newPetFormData.microchip || `985-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
                    allergies: newPetFormData.allergies || 'None recorded',
                    vaccinationInfo: 'Standard Vaccines Active',
                    photo: newPetFormData.photo || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
                    dob: 'Jan 2025'
                  };
                  const updated = [...petsList, newPet];
                  setPetsList(updated);
                  localStorage.setItem('furever_pets', JSON.stringify(updated));
                  setActivePetId(newPet.id);
                  setAddPetModalOpen(false);
                  setNewPetFormData({ name: '', species: 'Dog', breed: '', age: '', weight: '', gender: 'Male', microchip: '', allergies: '', photo: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80' });
                  if (window.SoundEngine) window.SoundEngine.playChime();
                  addToast(`${newPet.name} (${newPet.breed}) aapki pet family mein add ho gaya!`, 'fa-heart');
                }}
              >
                <i className="fa-solid fa-circle-check" style={{ marginRight: '8px' }}></i>
                Register Pet & Create Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── RESCHEDULE APPOINTMENT MODAL ── */}
      {rescheduleModalOpen && selectedAptToReschedule && (
        <div className="modal-overlay" onClick={() => setRescheduleModalOpen(false)}>
          <div className="modal-dialog-content reschedule-modal-dialog" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="reschedule-modal-header">
              <div className="reschedule-modal-icon-wrap">
                <i className="fa-solid fa-calendar-days"></i>
              </div>
              <div>
                <h3 className="reschedule-modal-title">Reschedule Appointment</h3>
                <p className="reschedule-modal-subtitle">Update your scheduled visit with <strong>{selectedAptToReschedule.doctorName}</strong></p>
              </div>
              <button className="btn-icon reschedule-close-btn" onClick={() => setRescheduleModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* ── SCROLLABLE BODY ── */}
            <div className="reschedule-scrollable-body">

              {/* Original Appointment Info Box */}
              <div className="reschedule-original-box">
                <div className="reschedule-original-label">
                  <i className="fa-solid fa-circle-info"></i> Current Appointment
                </div>
                <div className="reschedule-original-row">
                  <span><i className="fa-solid fa-calendar"></i> <strong>Date:</strong> {selectedAptToReschedule.date}</span>
                  <span><i className="fa-solid fa-clock"></i> <strong>Time:</strong> {selectedAptToReschedule.time}</span>
                  <span><i className="fa-solid fa-hospital"></i> {selectedAptToReschedule.clinic}</span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="reschedule-form-body">

                {/* New Date */}
                <div className="form-group-custom">
                  <label className="form-label-custom">
                    <i className="fa-solid fa-calendar-check" style={{ color: '#38bdf8', marginRight: '6px' }}></i> Preferred New Date
                  </label>
                  <input
                    type="date"
                    id="reschedule-date-input"
                    className="input-sky"
                    value={rescheduleForm.date}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, date: e.target.value })}
                    min="2026-09-01"
                  />
                </div>

                {/* Time Slot Picker */}
                <div className="form-group-custom">
                  <label className="form-label-custom">
                    <i className="fa-solid fa-clock" style={{ color: '#38bdf8', marginRight: '6px' }}></i> Preferred Time Slot
                  </label>
                  <div className="reschedule-timeslot-grid">
                    {['09:00 AM - 09:45 AM', '10:00 AM - 10:45 AM', '11:00 AM - 11:45 AM', '01:00 PM - 01:45 PM', '02:30 PM - 03:15 PM', '04:00 PM - 04:45 PM'].map(slot => (
                      <button
                        key={slot}
                        type="button"
                        className={`reschedule-slot-btn ${rescheduleForm.time === slot ? 'active' : ''}`}
                        onClick={() => setRescheduleForm({ ...rescheduleForm, time: slot })}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reason for Reschedule */}
                <div className="form-group-custom">
                  <label className="form-label-custom">
                    <i className="fa-solid fa-comment-medical" style={{ color: '#38bdf8', marginRight: '6px' }}></i> Reason for Rescheduling
                  </label>
                  <select
                    className="input-sky"
                    value={rescheduleForm.reason}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, reason: e.target.value })}
                  >
                    <option value="Schedule Conflict">Schedule Conflict</option>
                    <option value="Personal Emergency">Personal Emergency</option>
                    <option value="Pet Not Feeling Well Enough to Travel">Pet Not Feeling Well Enough to Travel</option>
                    <option value="Work Commitment">Work Commitment</option>
                    <option value="Travel">Travel</option>
                    <option value="Prefer a Different Doctor">Prefer a Different Doctor</option>
                    <option value="Financial Reasons">Financial Reasons</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Optional Notes */}
                <div className="form-group-custom">
                  <label className="form-label-custom">
                    <i className="fa-solid fa-note-sticky" style={{ color: '#38bdf8', marginRight: '6px' }}></i> Additional Notes <span style={{ color: '#64748b', fontWeight: '500' }}>(optional)</span>
                  </label>
                  <textarea
                    className="input-sky"
                    rows="3"
                    placeholder="Any special message for the clinic coordinator..."
                    value={rescheduleForm.notes}
                    onChange={(e) => setRescheduleForm({ ...rescheduleForm, notes: e.target.value })}
                    style={{ resize: 'none' }}
                  ></textarea>
                </div>

              </div>

            </div>{/* end reschedule-scrollable-body */}

            {/* Action Buttons */}
            <div className="reschedule-modal-footer">
              <button className="btn-sky-outline" style={{ flex: 1 }} onClick={() => setRescheduleModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i> Cancel
              </button>
              <button className="btn-sky-primary" style={{ flex: 2 }} onClick={() => {
                if (!rescheduleForm.date) {
                  markInvalidField(document.getElementById('reschedule-date-input'), 'Please select a new appointment date');
                  return;
                }
                // Update appointment in state
                setOwnerVetAppointments(prev => prev.map(a =>
                  a.id === selectedAptToReschedule.id
                    ? { ...a, date: rescheduleForm.date, time: rescheduleForm.time, status: 'Rescheduled' }
                    : a
                ));
                setRescheduleModalOpen(false);
                setRescheduleSuccessModal(true);
                if (window.SoundEngine) window.SoundEngine.playChime();
              }}>
                <i className="fa-solid fa-calendar-check"></i> Confirm Reschedule
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── RESCHEDULE SUCCESS CONFIRMATION MODAL ── */}
      {rescheduleSuccessModal && (
        <div className="modal-overlay" onClick={() => setRescheduleSuccessModal(false)}>
          <div className="reschedule-success-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="reschedule-success-icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h3 className="reschedule-success-title">Appointment Rescheduled!</h3>
            <p className="reschedule-success-sub">
              Your appointment with <strong>{selectedAptToReschedule && selectedAptToReschedule.doctorName}</strong> has been updated. A confirmation notification has been sent to your registered email.
            </p>
            <div className="reschedule-success-info-box">
              <div><i className="fa-solid fa-calendar-check" style={{ color: '#38bdf8' }}></i> <strong>New Date:</strong> {rescheduleForm.date}</div>
              <div><i className="fa-solid fa-clock" style={{ color: '#38bdf8' }}></i> <strong>Time Slot:</strong> {rescheduleForm.time}</div>
            </div>
            <button className="btn-sky-primary" style={{ width: '100%' }} onClick={() => setRescheduleSuccessModal(false)}>
              <i className="fa-solid fa-check"></i> Done
            </button>
          </div>
        </div>
      )}

      {/* ── CLINIC DIRECTIONS & NAVIGATION MODAL ── */}
      {directionsModalOpen && selectedAptForDirections && (
        <div className="modal-overlay" onClick={() => setDirectionsModalOpen(false)}>
          <div className="modal-dialog-content directions-modal-dialog" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Sticky Header */}
            <div className="directions-modal-header">
              <div className="directions-modal-icon-wrap">
                <i className="fa-solid fa-map-location-dot"></i>
              </div>
              <div>
                <h3 className="directions-modal-title">Clinic Directions & GPS Route</h3>
                <p className="directions-modal-subtitle">Turn-by-turn route to <strong>{selectedAptForDirections.clinic}</strong></p>
              </div>
              <button className="btn-icon directions-close-btn" onClick={() => setDirectionsModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="directions-scrollable-body">

              {/* Simulated Interactive Map Display */}
              <div className="directions-map-container">
                <div className="directions-map-grid-pattern"></div>
                
                {/* SVG Route Line */}
                <svg className="directions-route-svg" viewBox="0 0 400 160">
                  <path d="M 40,120 Q 120,40 200,90 T 360,50" fill="none" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="8" strokeLinecap="round" />
                  <path d="M 40,120 Q 120,40 200,90 T 360,50" fill="none" stroke="#38bdf8" strokeWidth="4" strokeDasharray="8,6" className="animated-route-dash" strokeLinecap="round" />
                </svg>

                {/* Start Pin */}
                <div className="map-pin map-pin-start">
                  <div className="pin-circle pin-blue"><i className="fa-solid fa-location-arrow"></i></div>
                  <div className="pin-label">Your Location</div>
                </div>

                {/* Destination Pin */}
                <div className="map-pin map-pin-dest">
                  <div className="pin-circle pin-rose"><i className="fa-solid fa-hospital"></i></div>
                  <div className="pin-label">{selectedAptForDirections.clinic.split(' ')[0]} Hospital</div>
                </div>

                {/* Floating Map Stats Bar */}
                <div className="map-stats-pill">
                  <span style={{ color: '#10b981', fontWeight: '800' }}><i className="fa-solid fa-circle" style={{ fontSize: '0.6rem' }}></i> Live Traffic: Fast</span>
                  <span className="map-stats-divider">|</span>
                  <span><strong>{transitMode === 'driving' ? '14 Mins' : transitMode === 'transit' ? '24 Mins' : '42 Mins'}</strong> ({transitMode === 'driving' ? '4.8 mi' : transitMode === 'transit' ? '5.2 mi' : '3.6 mi'})</span>
                </div>
              </div>

              {/* Transit Mode Switcher */}
              <div className="transit-mode-selector">
                <button 
                  className={`transit-mode-btn ${transitMode === 'driving' ? 'active' : ''}`}
                  onClick={() => { setTransitMode('driving'); if (window.SoundEngine) window.SoundEngine.playClicker(); }}
                >
                  <i className="fa-solid fa-car"></i>
                  <span>Driving (14 min)</span>
                </button>
                <button 
                  className={`transit-mode-btn ${transitMode === 'transit' ? 'active' : ''}`}
                  onClick={() => { setTransitMode('transit'); if (window.SoundEngine) window.SoundEngine.playClicker(); }}
                >
                  <i className="fa-solid fa-bus"></i>
                  <span>Transit (24 min)</span>
                </button>
                <button 
                  className={`transit-mode-btn ${transitMode === 'walking' ? 'active' : ''}`}
                  onClick={() => { setTransitMode('walking'); if (window.SoundEngine) window.SoundEngine.playClicker(); }}
                >
                  <i className="fa-solid fa-person-walking"></i>
                  <span>Walking (42 min)</span>
                </button>
              </div>

              {/* Address & Pet Parking Details Box */}
              <div className="directions-info-card">
                <div className="directions-info-row">
                  <div className="info-icon-circle"><i className="fa-solid fa-location-dot"></i></div>
                  <div>
                    <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: '700' }}>Destination Address</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-main)' }}>{selectedAptForDirections.clinic}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Central Park Pavilions, Suite 400, New York, NY 10024</div>
                  </div>
                </div>
                
                <div className="directions-pet-perk-badge">
                  <i className="fa-solid fa-paw" style={{ color: '#10b981' }}></i>
                  <span><strong>Pet Facility Perks:</strong> Dedicated Pet Entrance Gate 4 • Complimentary Valet & Pet Stroller Loaners Available</span>
                </div>
              </div>

              {/* Turn-by-Turn Navigation Steps */}
              <div className="directions-steps-container">
                <div className="directions-steps-header">
                  <i className="fa-solid fa-route" style={{ color: '#38bdf8' }}></i>
                  <span>Turn-by-Turn Step Guidance ({transitMode === 'driving' ? 'via FDR & Central Park W' : transitMode === 'transit' ? 'via Subway Line A' : 'via Park Promenade'})</span>
                </div>

                <div className="directions-steps-list">
                  {transitMode === 'driving' ? [
                    { icon: 'fa-arrow-up', text: 'Head South on 5th Avenue toward E 72nd Street', dist: '0.8 miles' },
                    { icon: 'fa-arrow-right', text: 'Turn right onto Central Park South & merge into companion transit lane', dist: '1.6 miles' },
                    { icon: 'fa-arrow-left', text: 'Turn left into FurEver Medical Pavilion Campus Ramp', dist: '0.4 miles' },
                    { icon: 'fa-flag-checkered', text: 'Arrive at Outpatient Pet Triage & Reserved Visitor Parking Bay #B12', dist: 'Destination' }
                  ].map((step, idx) => (
                    <div key={idx} className="directions-step-item">
                      <div className="step-icon-wrap"><i className={`fa-solid ${step.icon}`}></i></div>
                      <div className="step-content">
                        <div className="step-text">{step.text}</div>
                        <div className="step-dist">{step.dist}</div>
                      </div>
                    </div>
                  )) : transitMode === 'transit' ? [
                    { icon: 'fa-person-walking', text: 'Walk 3 mins to 72nd St Subway Station', dist: '0.2 miles' },
                    { icon: 'fa-train-subway', text: 'Take Downtown Line A/C toward Central Campus (4 stops)', dist: '4.2 miles' },
                    { icon: 'fa-arrow-up', text: 'Take Elevator Exit to Park Pavilions Companion Gate', dist: '0.1 miles' },
                    { icon: 'fa-flag-checkered', text: 'Arrive at FurEver Central Clinic Main Lobby', dist: 'Destination' }
                  ].map((step, idx) => (
                    <div key={idx} className="directions-step-item">
                      <div className="step-icon-wrap"><i className={`fa-solid ${step.icon}`}></i></div>
                      <div className="step-content">
                        <div className="step-text">{step.text}</div>
                        <div className="step-dist">{step.dist}</div>
                      </div>
                    </div>
                  )) : [
                    { icon: 'fa-person-walking', text: 'Enter Central Park via 72nd St Green Corridor', dist: '0.5 miles' },
                    { icon: 'fa-arrow-right', text: 'Follow pet-friendly paved trail along Bethesda Promenade', dist: '2.1 miles' },
                    { icon: 'fa-arrow-left', text: 'Take West Gate exit toward Medical Pavilion Lawn', dist: '1.0 miles' },
                    { icon: 'fa-flag-checkered', text: 'Arrive at Clinic Pet Garden & Welcome Desk', dist: 'Destination' }
                  ].map((step, idx) => (
                    <div key={idx} className="directions-step-item">
                      <div className="step-icon-wrap"><i className={`fa-solid ${step.icon}`}></i></div>
                      <div className="step-content">
                        <div className="step-text">{step.text}</div>
                        <div className="step-dist">{step.dist}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* External Maps & Copy Bar */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedAptForDirections.clinic + ' Central Park New York')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-sky-outline"
                  style={{ flex: 1, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px' }}
                >
                  <i className="fa-solid fa-arrow-up-right-from-square"></i> Open in Google Maps
                </a>
                <button 
                  type="button"
                  className="btn-sky-outline"
                  style={{ flex: 1, padding: '10px' }}
                  onClick={() => {
                    navigator.clipboard && navigator.clipboard.writeText('40.7128° N, 74.0060° W - Central Park Pavilions, Suite 400, New York, NY 10024');
                    addToast('GPS Coordinates copied to clipboard!', 'fa-copy');
                  }}
                >
                  <i className="fa-solid fa-copy"></i> Copy Coordinates
                </button>
              </div>

            </div>

            {/* Modal Sticky Footer */}
            <div className="directions-modal-footer">
              <button className="btn-sky-outline" style={{ flex: 1 }} onClick={() => setDirectionsModalOpen(false)}>
                <i className="fa-solid fa-xmark"></i> Close
              </button>
              <button 
                className="btn-sky-primary" 
                style={{ flex: 2 }}
                onClick={() => {
                  setDirectionsModalOpen(false);
                  setDirectionsSuccessModal(true);
                  if (window.SoundEngine) window.SoundEngine.playChime();
                }}
              >
                <i className="fa-solid fa-location-arrow"></i> Start Live Navigation
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── DIRECTIONS LIVE NAVIGATION SUCCESS MODAL ── */}
      {directionsSuccessModal && (
        <div className="modal-overlay" onClick={() => setDirectionsSuccessModal(false)}>
          <div className="reschedule-success-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="reschedule-success-icon" style={{ background: 'rgba(14, 165, 233, 0.2)', borderColor: '#38bdf8', color: '#38bdf8' }}>
              <i className="fa-solid fa-compass"></i>
            </div>
            <h3 className="reschedule-success-title">Navigation Dispatched!</h3>
            <p className="reschedule-success-sub">
              Live GPS route to <strong>{selectedAptForDirections && selectedAptForDirections.clinic}</strong> is ready. Drive safely with your furry companion!
            </p>
            <div className="reschedule-success-info-box">
              <div><i className="fa-solid fa-clock" style={{ color: '#38bdf8' }}></i> <strong>Estimated Arrival:</strong> 14 Minutes (4.8 Miles)</div>
              <div><i className="fa-solid fa-square-parking" style={{ color: '#10b981' }}></i> <strong>Parking:</strong> Free Valet at Gate 4</div>
            </div>
            <button className="btn-sky-primary" style={{ width: '100%' }} onClick={() => setDirectionsSuccessModal(false)}>
              <i className="fa-solid fa-check"></i> Done & Return
            </button>
          </div>
        </div>
      )}

      {/* 5. Emergency SOS Guide Modal */}
      {sosModalOpen && (
        <div className="modal-overlay" onClick={() => setSosModalOpen(false)}>
          <div className="modal-dialog-content" style={{ borderColor: '#f43f5e', maxWidth: '680px', maxHeight: '88vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(244,63,94,0.2)', paddingBottom: '12px' }}>
              <div>
                <span className="badge-sky" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)', marginBottom: '4px' }}>
                  <i className="fa-solid fa-truck-medical"></i> 24/7 Rapid Triage
                </span>
                <h3 style={{ color: '#e11d48', fontSize: '1.4rem', margin: 0, fontFamily: 'var(--font-heading)' }}>
                  Pet Emergency & First-Aid Handbook
                </h3>
              </div>
              <button className="btn-icon" onClick={() => setSosModalOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>

            {/* Direct Call Pills */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
              <a 
                href="tel:18884264435" 
                style={{ padding: '10px 14px', background: 'linear-gradient(135deg, #e11d48, #be123c)', color: '#fff', borderRadius: 'var(--radius-md)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', fontWeight: '700' }}
                onClick={() => { if (window.SoundEngine) window.SoundEngine.playAlarm(); }}
              >
                <i className="fa-solid fa-phone-volume" style={{ fontSize: '1.2rem' }}></i>
                <div>
                  <div style={{ fontSize: '0.68rem', opacity: 0.85 }}>24/7 ASPCA POISON</div>
                  <div>(888) 426-4435</div>
                </div>
              </a>
              <a 
                href="https://wa.me/923001234567?text=🚨%20EMERGENCY%20SOS:%20My%20pet%20needs%20urgent%20critical%20care." 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ padding: '10px 14px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', borderRadius: 'var(--radius-md)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.86rem', fontWeight: '700' }}
              >
                <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.3rem' }}></i>
                <div>
                  <div style={{ fontSize: '0.68rem', opacity: 0.85 }}>WHATSAPP ER (PK)</div>
                  <div>+92 300 1234567</div>
                </div>
              </a>
            </div>

            {/* 6 Step Protocols Accordion */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                {
                  title: '1. Pet CPR (Cardiac & Breathing Arrest)',
                  color: '#ef4444',
                  steps: 'Place pet on right side. Deliver 30 rapid chest compressions (100-120 BPM) followed by 2 breaths into pet nostrils. Repeat cycle.',
                  dont: 'Do not perform compressions if pet is breathing or conscious.'
                },
                {
                  title: '2. Choking & Foreign Object Airway Obstruction',
                  color: '#f43f5e',
                  steps: 'Open mouth carefully; if visible object, sweep gently with finger. For medium/large dogs, perform modified Heimlich by applying upward abdominal thrusts behind ribcage.',
                  dont: 'Do NOT poke fingers blindly into throat.'
                },
                {
                  title: '3. Toxic Chemical / Plant Ingestion',
                  color: '#8b5cf6',
                  steps: 'Identify substance and keep container. Rinse mouth and paws if topical. Call ASPCA Poison Control (888) 426-4435 immediately.',
                  dont: 'Do NOT induce vomiting unless explicitly ordered by a toxicologist.'
                },
                {
                  title: '4. Severe Bleeding & Hemorrhage',
                  color: '#e11d48',
                  steps: 'Apply firm continuous direct pressure using sterile gauze. Elevate bleeding limb. Wrap with elastic bandage without restricting blood flow.',
                  dont: 'Do not remove blood-soaked pads — add new gauze on top.'
                },
                {
                  title: '5. Heatstroke & Overheating (>104°F)',
                  color: '#f59e0b',
                  steps: 'Move to AC immediately. Apply room-temperature cool water to groin, neck and paws. Turn on electric fans. Give small sips of cool water.',
                  dont: 'NEVER submerge in ice water — causes vascular shock.'
                },
                {
                  title: '6. Bone Fractures & Car Hit Trauma',
                  color: '#0284c7',
                  steps: 'Minimize movement. Slide pet onto a rigid board or taut blanket stretcher. Wrap in warm foil blanket to prevent shock and transport immediately.',
                  dont: 'Do not attempt to push or realign broken bones.'
                }
              ].map((proto, pidx) => (
                <div key={pidx} style={{ padding: '14px 16px', background: `${proto.color}0a`, borderRadius: 'var(--radius-md)', border: `1.5px solid ${proto.color}35` }}>
                  <div style={{ fontWeight: '800', color: proto.color, fontSize: '0.92rem', marginBottom: '4px' }}>
                    {proto.title}
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', margin: '0 0 6px', lineHeight: '1.5' }}>
                    {proto.steps}
                  </p>
                  <div style={{ fontSize: '0.76rem', color: '#e11d48', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <i className="fa-solid fa-circle-xmark"></i> Warning: {proto.dont}
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="btn-sky-primary" 
              style={{ width: '100%', marginTop: '18px', padding: '12px', fontWeight: '800' }} 
              onClick={() => {
                setSosModalOpen(false);
                setActiveTab('emergency');
                if (window.SoundEngine) window.SoundEngine.playClicker();
              }}
            >
              <i className="fa-solid fa-satellite-dish"></i> Open Full Emergency Station Tab
            </button>
          </div>
        </div>
      )}

      {/* ── PROFILE UPDATE SUCCESS POPUP ── */}
      {profileUpdateSuccess && (
        <div className="modal-overlay" style={{ zIndex: 9999 }} onClick={() => setProfileUpdateSuccess(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-xl)', maxWidth: '380px', width: '92%', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.3)', border: '2px solid rgba(16,185,129,0.4)', animation: 'scaleUp 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}>
            <div style={{ background: 'linear-gradient(135deg,#10b981 0%,#059669 100%)', padding: '28px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', border: '3px solid rgba(255,255,255,0.5)' }}>
                <i className="fa-solid fa-circle-check" style={{ fontSize: '2rem', color: '#fff' }}></i>
              </div>
              <h2 style={{ color: '#fff', fontWeight: '900', fontSize: '1.25rem', margin: '0 0 4px' }}>Profile Updated!</h2>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.84rem', margin: 0 }}>{petForm.name}'s profile has been saved successfully</p>
            </div>
            <div style={{ padding: '20px 24px', textAlign: 'center' }}>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-md)', padding: '6px 12px', fontSize: '0.78rem', fontWeight: '700', color: '#059669' }}>
                  <i className="fa-solid fa-paw" style={{ marginRight: '5px' }}></i>{petForm.name}
                </span>
                <span style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.3)', borderRadius: 'var(--radius-md)', padding: '6px 12px', fontSize: '0.78rem', fontWeight: '700', color: '#0ea5e9' }}>
                  <i className="fa-solid fa-dog" style={{ marginRight: '5px' }}></i>{petForm.species}
                </span>
              </div>
              <button onClick={() => setProfileUpdateSuccess(false)} className="btn-sky-primary" style={{ width: '100%', padding: '11px' }}>
                <i className="fa-solid fa-check" style={{ marginRight: '6px' }}></i>Great, Done!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Log New Medical Record Modal */}
      {medModalOpen && (
        <div className="modal-overlay" onClick={() => setMedModalOpen(false)}>
          <div className="modal-dialog-content" onClick={(e) => e.stopPropagation()} style={{ padding: '0', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg,#0ea5e9 0%,#0369a1 100%)', padding: '20px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-notes-medical" style={{ color: '#fff', fontSize: '1rem' }}></i>
                </div>
                <div>
                  <h3 style={{ color: '#fff', fontWeight: '800', fontSize: '1.1rem', margin: 0 }}>Log New Clinical Checkup</h3>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.76rem', margin: 0 }}>{petForm.name} • FurEver Care Medical Record</p>
                </div>
              </div>
              <button onClick={() => setMedModalOpen(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Form Body */}
            <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '65vh', overflowY: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group-custom">
                  <label className="form-label-custom"><i className="fa-solid fa-calendar" style={{ color: 'var(--primary-500)', marginRight: '5px' }}></i> Consultation Date *</label>
                  <input type="date" id="med-date-input" className="input-sky" value={newMedForm.date} onChange={(e) => setNewMedForm({ ...newMedForm, date: e.target.value })} />
                </div>
                <div className="form-group-custom">
                  <label className="form-label-custom"><i className="fa-solid fa-user-doctor" style={{ color: 'var(--primary-500)', marginRight: '5px' }}></i> Attending Veterinarian *</label>
                  <input type="text" id="med-vet-input" className="input-sky" placeholder="e.g. Dr. Sarah Jenkins, DVM" value={newMedForm.vetName} onChange={(e) => setNewMedForm({ ...newMedForm, vetName: e.target.value })} />
                </div>
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom"><i className="fa-solid fa-stethoscope" style={{ color: 'var(--primary-500)', marginRight: '5px' }}></i> Diagnosis / Reason for Visit *</label>
                <input type="text" id="med-diag-input" className="input-sky" placeholder="e.g. Ear Infection Cytology & Cleanse" value={newMedForm.diagnosis} onChange={(e) => setNewMedForm({ ...newMedForm, diagnosis: e.target.value })} />
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom"><i className="fa-solid fa-pills" style={{ color: 'var(--primary-500)', marginRight: '5px' }}></i> Prescriptions & Therapy</label>
                <input type="text" className="input-sky" placeholder="e.g. Posatex Otic Drops (4 drops twice daily)" value={newMedForm.medications} onChange={(e) => setNewMedForm({ ...newMedForm, medications: e.target.value })} />
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom"><i className="fa-solid fa-notes-medical" style={{ color: 'var(--primary-500)', marginRight: '5px' }}></i> Doctor Observation Notes</label>
                <textarea className="input-sky" rows="2" placeholder="Clinical notes, follow-up instructions..." value={newMedForm.notes} onChange={(e) => setNewMedForm({ ...newMedForm, notes: e.target.value })}></textarea>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setMedModalOpen(false)} className="btn-sky-outline" style={{ flex: 1, padding: '11px' }}>Cancel</button>
                <button
                  type="button"
                  className="btn-sky-primary"
                  style={{ flex: 2, padding: '11px', fontSize: '0.95rem', fontWeight: '800' }}
                  onClick={() => {
                    if (!newMedForm.date) {
                      markInvalidField(document.getElementById('med-date-input'), 'Please select consultation date!');
                      return;
                    }
                    if (!newMedForm.vetName.trim()) {
                      markInvalidField(document.getElementById('med-vet-input'), 'Please enter attending veterinarian name!');
                      return;
                    }
                    if (!newMedForm.diagnosis.trim()) {
                      markInvalidField(document.getElementById('med-diag-input'), 'Diagnosis / reason for visit is required!');
                      return;
                    }
                    const newEntry = {
                      id: `MED-${100 + medicalRecords.length + 1}`,
                      date: newMedForm.date,
                      clinic: 'FurEver Central Partner Clinic',
                      vetName: newMedForm.vetName,
                      diagnosis: newMedForm.diagnosis,
                      medications: newMedForm.medications || 'None prescribed',
                      temperature: '38.5°C',
                      notes: newMedForm.notes || 'Normal clinical recovery observed.',
                      status: 'Resolved'
                    };
                    setMedicalRecords([newEntry, ...medicalRecords]);
                    setNewMedForm({ date: '', vetName: '', diagnosis: '', medications: '', notes: '' });
                    setMedModalOpen(false);
                    if (window.SoundEngine) window.SoundEngine.playChime();
                    addToast(`Medical record added to ${petForm.name}'s passport!`, 'fa-circle-check');
                  }}
                >
                  <i className="fa-solid fa-file-circle-check" style={{ marginRight: '7px' }}></i>Save Medical Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Record New Vaccination Modal */}
      {vacModalOpen && (
        <div className="modal-overlay" onClick={() => setVacModalOpen(false)}>
          <div className="modal-dialog-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.3rem' }}><i className="fa-solid fa-syringe" style={{ color: 'var(--primary-500)', marginRight: '8px' }}></i> Record New Vaccination</h3>
              <button className="btn-icon" onClick={() => setVacModalOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '18px' }}>Log immunization booster received by {petForm.name}.</p>

            <form noValidate onSubmit={(e) => {
              e.preventDefault();
              if (!newVacForm.name.trim()) {
                markInvalidField(document.getElementById('vac-name-input'), 'Please enter vaccine name');
                return;
              }
              if (!newVacForm.administeredDate) {
                markInvalidField(document.getElementById('vac-date-input'), 'Please select date administered');
                return;
              }
              const newVac = {
                id: `VAC-${vaccineRecords.length + 1}`,
                name: newVacForm.name,
                administeredDate: newVacForm.administeredDate || 'Aug 25, 2026',
                dueDate: newVacForm.dueDate || 'Aug 25, 2027',
                clinic: 'FurEver Central Clinic',
                vet: newVacForm.vet || 'Dr. Sarah Jenkins',
                status: 'Valid / Up-to-Date'
              };
              setVaccineRecords([...vaccineRecords, newVac]);
              setNewVacForm({ name: '', administeredDate: '', dueDate: '', vet: '' });
              setVacModalOpen(false);
              if (window.SoundEngine) window.SoundEngine.playChime();
              addToast(`Added ${newVac.name} to immunization records!`, 'fa-circle-check');
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group-custom">
                  <label className="form-label-custom">Vaccine Name *</label>
                  <input type="text" id="vac-name-input" className="input-sky" placeholder="e.g. Canine Influenza H3N2" value={newVacForm.name} onChange={(e) => setNewVacForm({ ...newVacForm, name: e.target.value })} />
                </div>
                <div className="form-group-custom">
                  <label className="form-label-custom">Administering Vet</label>
                  <input type="text" className="input-sky" placeholder="e.g. Dr. Sarah Jenkins" value={newVacForm.vet} onChange={(e) => setNewVacForm({ ...newVacForm, vet: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group-custom">
                  <label className="form-label-custom">Date Administered *</label>
                  <input type="date" id="vac-date-input" className="input-sky" value={newVacForm.administeredDate} onChange={(e) => setNewVacForm({ ...newVacForm, administeredDate: e.target.value })} />
                </div>
                <div className="form-group-custom">
                  <label className="form-label-custom">Next Booster Due Date</label>
                  <input type="date" className="input-sky" value={newVacForm.dueDate} onChange={(e) => setNewVacForm({ ...newVacForm, dueDate: e.target.value })} />
                </div>
              </div>

              <button type="submit" className="btn-sky-primary" style={{ width: '100%' }}>
                Save Vaccination Record
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 8. Book New Grooming Session Modal */}
      {/* ======== ENHANCED GROOMING MODAL (Scrollable + Validation + Success) ======== */}
      {groomingModalOpen && (
        <div className="modal-overlay" onClick={() => { setGroomingModalOpen(false); setGroomingFormErrors({}); }}>
          <div className="modal-dialog-content" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '92vh', overflowY: 'auto', padding: '0', borderRadius: '20px', maxWidth: '520px', width: '95%' }}>
            <div style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)', padding: '24px 28px 20px', borderRadius: '20px 20px 0 0', position: 'sticky', top: 0, zIndex: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fa-solid fa-scissors" style={{ color: '#fff', fontSize: '1rem' }}></i>
                    </span>
                    <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: 0, fontWeight: '800' }}>Book Grooming Spa Session</h3>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', margin: '6px 0 0 48px' }}>Schedule professional spa for <strong>{petForm.name}</strong></p>
                </div>
                <button onClick={() => { setGroomingModalOpen(false); setGroomingFormErrors({}); }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', color: '#fff', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
            <div style={{ padding: '24px 28px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)', marginBottom: '20px' }}>
                <img src={petForm.photo} alt={petForm.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-400)' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200'; }} />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{petForm.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{petForm.species} - {petForm.breed}</div>
                </div>
                <span style={{ marginLeft: 'auto', background: 'rgba(14,165,233,0.12)', color: 'var(--primary-600)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: '700' }}>Spa Booking</span>
              </div>
              <form noValidate onSubmit={(e) => {
                e.preventDefault();
                const errors = {};
                if (!groomingForm.date) errors.date = 'Please select a preferred date';
                const today = new Date(); today.setHours(0,0,0,0);
                if (groomingForm.date && new Date(groomingForm.date) < today) errors.date = 'Date cannot be in the past';
                setGroomingFormErrors(errors);
                if (Object.keys(errors).length > 0) return;
                const newBooking = {
                  id: 'GRM-' + (500 + groomingBookings.length + 1),
                  service: groomingForm.service.split('(')[0].trim(),
                  groomer: groomingForm.groomer,
                  date: groomingForm.date,
                  time: groomingForm.time,
                  price: groomingForm.service.includes('$') ? '$' + groomingForm.service.split('$')[1].replace(')', '') : '$50.00',
                  status: 'Upcoming'
                };
                setGroomingBookings([newBooking, ...groomingBookings]);
                setGroomingModalOpen(false);
                setGroomingFormErrors({});
                setGroomingSuccess(true);
                setTimeout(() => setGroomingSuccess(false), 4500);
                if (window.SoundEngine) window.SoundEngine.playChime();
              }}>
                <div className="form-group-custom" style={{ marginBottom: '16px' }}>
                  <label className="form-label-custom" style={{ fontWeight: '700', marginBottom: '6px', display: 'block' }}>
                    <i className="fa-solid fa-spa" style={{ color: 'var(--primary-500)', marginRight: '6px' }}></i>Select Grooming Treatment *
                  </label>
                  <select className="input-sky" value={groomingForm.service} onChange={(e) => setGroomingForm({ ...groomingForm, service: e.target.value })} style={{ borderRadius: '10px' }}>
                    <option>Full Luxury Spa, Deshedding &amp; Hydro-Bath ($65)</option>
                    <option>Breed Styling Haircut &amp; Fluff Dry ($55)</option>
                    <option>Gentle Oatmeal Bath &amp; Blowdry ($40)</option>
                    <option>Nail Grinding, Ear Cleanse &amp; Paw Pad Balm ($28)</option>
                    <option>Ultrasonic Teeth Cleaning &amp; Breath Polish ($30)</option>
                  </select>
                </div>
                <div className="form-group-custom" style={{ marginBottom: '16px' }}>
                  <label className="form-label-custom" style={{ fontWeight: '700', marginBottom: '6px', display: 'block' }}>
                    <i className="fa-solid fa-store" style={{ color: 'var(--primary-500)', marginRight: '6px' }}></i>Preferred Grooming Salon *
                  </label>
                  <select className="input-sky" value={groomingForm.groomer} onChange={(e) => setGroomingForm({ ...groomingForm, groomer: e.target.value })} style={{ borderRadius: '10px' }}>
                    <option>Paws &amp; Bubbles Master Spa Salon</option>
                    <option>Bella Pet Styling Studio</option>
                    <option>FurEver Mobile Grooming Van (At-Home Service)</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div className="form-group-custom">
                    <label className="form-label-custom" style={{ fontWeight: '700', marginBottom: '6px', display: 'block' }}>
                      <i className="fa-solid fa-calendar" style={{ color: 'var(--primary-500)', marginRight: '6px' }}></i>Preferred Date *
                    </label>
                    <input type="date" id="grooming-date-input" className="input-sky" value={groomingForm.date}
                      onChange={(e) => { setGroomingForm({ ...groomingForm, date: e.target.value }); setGroomingFormErrors({ ...groomingFormErrors, date: '' }); }}
                      style={{ borderRadius: '10px', border: groomingFormErrors.date ? '2px solid #ef4444' : '' }} />
                    {groomingFormErrors.date && (
                      <div style={{ color: '#ef4444', fontSize: '0.74rem', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="fa-solid fa-circle-exclamation"></i> {groomingFormErrors.date}
                      </div>
                    )}
                  </div>
                  <div className="form-group-custom">
                    <label className="form-label-custom" style={{ fontWeight: '700', marginBottom: '6px', display: 'block' }}>
                      <i className="fa-solid fa-clock" style={{ color: 'var(--primary-500)', marginRight: '6px' }}></i>Preferred Time *
                    </label>
                    <select className="input-sky" value={groomingForm.time} onChange={(e) => setGroomingForm({ ...groomingForm, time: e.target.value })} style={{ borderRadius: '10px' }}>
                      <option>09:30 AM</option>
                      <option>11:00 AM</option>
                      <option>01:30 PM</option>
                      <option>03:00 PM</option>
                      <option>04:30 PM</option>
                    </select>
                  </div>
                </div>
                <div style={{ padding: '14px 16px', background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(99,102,241,0.08))', borderRadius: '12px', border: '1px solid var(--border-glass)', marginBottom: '20px' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>Booking Summary</div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: '600' }}>{groomingForm.service.split('(')[0].trim()}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}><i className="fa-solid fa-store" style={{ marginRight: '5px' }}></i>{groomingForm.groomer}</div>
                  {groomingForm.date && (
                    <div style={{ fontSize: '0.82rem', color: 'var(--primary-600)', marginTop: '4px', fontWeight: '600' }}>
                      <i className="fa-solid fa-calendar-check" style={{ marginRight: '5px' }}></i>{groomingForm.date} at {groomingForm.time}
                    </div>
                  )}
                </div>
                <button type="submit" className="btn-sky-primary" style={{ width: '100%', padding: '14px', fontWeight: '800', fontSize: '1rem', borderRadius: '12px', boxShadow: '0 4px 16px rgba(14,165,233,0.35)' }}>
                  <i className="fa-solid fa-calendar-check" style={{ marginRight: '8px' }}></i>Confirm Grooming Booking
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ======== BRAND THEME GROOMING SUCCESS POPUP ======== */}
      {groomingSuccess && (
        <div 
          className="modal-overlay" 
          style={{ background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(10px)', zIndex: 99999 }}
          onClick={() => setGroomingSuccess(false)}
        >
          <div 
            className="modal-dialog-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              background: 'var(--bg-card, #ffffff)', 
              borderRadius: '26px', 
              padding: '36px 30px', 
              textAlign: 'center', 
              maxWidth: '420px', 
              width: '92%', 
              boxShadow: '0 25px 70px rgba(14, 165, 233, 0.4)', 
              border: '2px solid rgba(14, 165, 233, 0.3)',
              animation: 'scaleUp 0.3s ease'
            }}
          >
            {/* Theme Glowing Icon */}
            <div style={{ 
              width: '84px', 
              height: '84px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #6366f1 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 20px',
              boxShadow: '0 8px 30px rgba(14, 165, 233, 0.5)'
            }}>
              <i className="fa-solid fa-circle-check" style={{ color: '#ffffff', fontSize: '2.6rem' }}></i>
            </div>

            <span className="badge-sky" style={{ fontSize: '0.8rem', padding: '5px 16px', marginBottom: '10px', display: 'inline-block' }}>
              <i className="fa-solid fa-sparkles"></i> Appointment Confirmed
            </span>

            <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main, #0f172a)', margin: '8px 0 10px' }}>
              Grooming Spa Booked!
            </h2>

            <p style={{ color: 'var(--text-muted, #475569)', fontSize: '0.92rem', lineHeight: '1.6', margin: '0 0 16px' }}>
              Your session for <strong style={{ color: 'var(--primary-500, #0ea5e9)' }}>{petForm.name}</strong> has been successfully confirmed.
            </p>

            {/* Appointment Highlights Pill */}
            <div style={{ 
              padding: '14px 18px', 
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)', 
              borderRadius: '16px', 
              border: '1.5px solid rgba(14, 165, 233, 0.2)',
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <i className="fa-solid fa-spa" style={{ color: 'var(--primary-500, #0ea5e9)' }}></i>
                <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main, #0f172a)' }}>
                  {groomingForm.service ? groomingForm.service.split('(')[0].trim() : 'Luxury Grooming & Spa'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.82rem', color: 'var(--text-muted, #64748b)' }}>
                <i className="fa-solid fa-clock" style={{ color: 'var(--primary-500, #0ea5e9)' }}></i>
                <span>{groomingForm.date || 'Scheduled'} at {groomingForm.time}</span>
              </div>
            </div>

            {/* Badges Row */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '22px' }}>
              {['🛁 Luxury Bath', '✂️ Styling', '🔔 SMS Reminder Active'].map(tag => (
                <span key={tag} style={{ background: 'rgba(14,165,233,0.12)', color: 'var(--primary-600, #0284c7)', padding: '5px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.75rem', fontWeight: '700' }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Button */}
            <button 
              className="btn-sky-primary" 
              style={{ 
                width: '100%', 
                padding: '14px', 
                fontWeight: '800', 
                fontSize: '1rem',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                boxShadow: '0 6px 20px rgba(14, 165, 233, 0.4)'
              }} 
              onClick={() => {
                setGroomingSuccess(false);
                if (window.SoundEngine) window.SoundEngine.playClicker();
              }}
            >
              <i className="fa-solid fa-check" style={{ marginRight: '8px' }}></i> Got It, Thanks!
            </button>
          </div>
        </div>
      )}

      {/* ======== SEND REMINDER MODAL ======== */}
      {reminderModalOpen && reminderModalData && (
        <div className="modal-overlay" onClick={() => { setReminderModalOpen(false); setReminderSuccess(false); }}>
          <div className="modal-dialog-content" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '92vh', overflowY: 'auto', padding: '0', borderRadius: '20px', maxWidth: '480px', width: '95%' }}>
            <div style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)', padding: '22px 26px 18px', borderRadius: '20px 20px 0 0', position: 'sticky', top: 0, zIndex: 2 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-bell" style={{ color: '#fff', fontSize: '1rem' }}></i>
                  </span>
                  <div>
                    <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: 0, fontWeight: '800' }}>Send Grooming Reminder</h3>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.76rem', margin: 0 }}>Notify yourself before the appointment</p>
                  </div>
                </div>
                <button onClick={() => { setReminderModalOpen(false); setReminderSuccess(false); }} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', color: '#fff', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
            <div style={{ padding: '22px 26px', overflowY: 'auto' }}>
              <div style={{ padding: '16px', background: 'var(--bg-surface)', borderRadius: '14px', border: '1px solid var(--border-glass)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <strong style={{ color: 'var(--primary-700)', fontSize: '1rem' }}>{reminderModalData.service}</strong>
                  <span style={{ background: 'rgba(14,165,233,0.12)', color: 'var(--primary-600)', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontSize: '0.72rem', fontWeight: '700' }}>{reminderModalData.status}</span>
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  <i className="fa-solid fa-store" style={{ color: 'var(--primary-500)', marginRight: '6px' }}></i>{reminderModalData.groomer}
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '5px' }}>
                  <i className="fa-solid fa-clock" style={{ color: 'var(--primary-500)', marginRight: '6px' }}></i>{reminderModalData.date} at {reminderModalData.time} - <strong>{reminderModalData.price}</strong>
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  <i className="fa-solid fa-paw" style={{ color: 'var(--primary-500)', marginRight: '6px' }}></i>For: <strong>{petForm.name}</strong>
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: '700', fontSize: '0.85rem', marginBottom: '12px', color: 'var(--text-main)' }}>
                  <i className="fa-solid fa-sliders" style={{ color: 'var(--primary-500)', marginRight: '6px' }}></i>Choose Reminder Options
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '230px', overflowY: 'auto', paddingRight: '4px' }}>
                  {[
                    { icon: 'fa-message-sms', label: 'SMS Reminder', desc: 'Text message 2 hours before', color: '#10b981' },
                    { icon: 'fa-envelope', label: 'Email Reminder', desc: 'Email notification 1 day before', color: '#6366f1' },
                    { icon: 'fa-comment', label: 'WhatsApp Reminder', desc: 'WhatsApp message morning of appointment', color: '#25D366' },
                    { icon: 'fa-bell', label: 'Push Notification', desc: 'App notification 30 minutes before', color: '#f59e0b' },
                    { icon: 'fa-phone', label: 'Phone Call Reminder', desc: 'Automated call 1 hour before', color: '#0ea5e9' }
                  ].map((opt, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', background: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border-glass)', cursor: 'pointer' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: opt.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className={'fa-solid ' + opt.icon} style={{ color: opt.color, fontSize: '0.9rem' }}></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--text-main)' }}>{opt.label}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{opt.desc}</div>
                      </div>
                      <i className="fa-solid fa-circle-check" style={{ color: opt.color, fontSize: '1.1rem' }}></i>
                    </div>
                  ))}
                </div>
              </div>
              <button
                className="btn-sky-primary"
                style={{ width: '100%', padding: '13px', fontWeight: '800', fontSize: '0.98rem', borderRadius: '12px', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', boxShadow: '0 4px 14px rgba(14,165,233,0.35)' }}
                onClick={() => {
                  setReminderModalOpen(false);
                  setReminderSuccess(true);
                  setTimeout(() => setReminderSuccess(false), 4500);
                  if (window.SoundEngine) window.SoundEngine.playChime();
                }}
              >
                <i className="fa-solid fa-paper-plane" style={{ marginRight: '8px' }}></i>Continue - Send All Reminders
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======== BRAND THEME REMINDER SUCCESS POPUP ======== */}
      {reminderSuccess && (
        <div 
          className="modal-overlay" 
          style={{ background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(10px)', zIndex: 99999 }}
          onClick={() => setReminderSuccess(false)}
        >
          <div 
            className="modal-dialog-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              background: 'var(--bg-card, #ffffff)', 
              borderRadius: '26px', 
              padding: '36px 30px', 
              textAlign: 'center', 
              maxWidth: '420px', 
              width: '92%', 
              boxShadow: '0 25px 70px rgba(14, 165, 233, 0.4)', 
              border: '2px solid rgba(14, 165, 233, 0.3)',
              animation: 'scaleUp 0.3s ease'
            }}
          >
            {/* Theme Glowing Icon */}
            <div style={{ 
              width: '84px', 
              height: '84px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #6366f1 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 20px',
              boxShadow: '0 8px 30px rgba(14, 165, 233, 0.5)'
            }}>
              <i className="fa-solid fa-bell" style={{ color: '#ffffff', fontSize: '2.4rem' }}></i>
            </div>

            <span className="badge-sky" style={{ fontSize: '0.8rem', padding: '5px 16px', marginBottom: '10px', display: 'inline-block' }}>
              <i className="fa-solid fa-clock-rotate-left"></i> Notifications Scheduled
            </span>

            <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--text-main, #0f172a)', margin: '8px 0 10px' }}>
              Reminders Scheduled!
            </h2>

            <p style={{ color: 'var(--text-muted, #475569)', fontSize: '0.92rem', lineHeight: '1.6', margin: '0 0 16px' }}>
              All reminders for <strong style={{ color: 'var(--primary-500, #0ea5e9)' }}>{reminderModalData ? reminderModalData.service : 'your appointment'}</strong> have been successfully set.
            </p>

            {/* Info Pill */}
            <div style={{ 
              padding: '14px 18px', 
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)', 
              borderRadius: '16px', 
              border: '1.5px solid rgba(14, 165, 233, 0.2)',
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontSize: '0.85rem', color: 'var(--text-main, #0f172a)', fontWeight: '600' }}>
                <i className="fa-solid fa-circle-check" style={{ color: '#0ea5e9' }}></i>
                <span>SMS Notification 2 hours prior</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-main, #0f172a)', fontWeight: '600' }}>
                <i className="fa-solid fa-circle-check" style={{ color: '#0ea5e9' }}></i>
                <span>WhatsApp & Email Alert on appointment morning</span>
              </div>
            </div>

            {/* Action Button */}
            <button 
              className="btn-sky-primary" 
              style={{ 
                width: '100%', 
                padding: '14px', 
                fontWeight: '800', 
                fontSize: '1rem',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
                boxShadow: '0 6px 20px rgba(14, 165, 233, 0.4)'
              }} 
              onClick={() => {
                setReminderSuccess(false);
                if (window.SoundEngine) window.SoundEngine.playClicker();
              }}
            >
              <i className="fa-solid fa-check" style={{ marginRight: '8px' }}></i> Done
            </button>
          </div>
        </div>
      )}

      {/* ======== COMPETITION-LEVEL ANIMATED SUCCESS MODAL ======== */}
      {contactSuccessModal && contactSuccessData && (
        <div 
          className="modal-overlay" 
          style={{ background: 'rgba(11, 42, 82, 0.75)', backdropFilter: 'blur(10px)', zIndex: 99999 }}
          onClick={() => setContactSuccessModal(false)}
        >
          <div 
            className="modal-dialog-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              background: '#FFFFFF', 
              borderRadius: '28px', 
              padding: '40px 34px', 
              textAlign: 'center', 
              maxWidth: '430px', 
              width: '92%', 
              boxShadow: '0 25px 70px rgba(33, 150, 243, 0.35)', 
              border: '2px solid rgba(91, 184, 255, 0.4)',
              animation: 'scaleUp 0.3s ease'
            }}
          >
            {/* Animated Paw / Checkmark Header */}
            <div style={{ 
              width: '88px', 
              height: '88px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #2196F3 0%, #5BB8FF 100%)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 20px',
              boxShadow: '0 10px 30px rgba(33, 150, 243, 0.45)'
            }}>
              <i className="fa-solid fa-paw" style={{ color: '#FFFFFF', fontSize: '2.5rem' }}></i>
            </div>

            <h2 style={{ fontSize: '1.65rem', fontWeight: '900', color: '#0B2A52', margin: '0 0 10px' }}>
              Message Received! 🐾
            </h2>

            <p style={{ color: '#475569', fontSize: '0.94rem', lineHeight: '1.6', margin: '0 0 20px' }}>
              Thank you for reaching out, <strong>{contactSuccessData.name}</strong>. Our care team will get back to you shortly.
            </p>

            {/* Ticket Info Box */}
            <div style={{ 
              padding: '14px 18px', 
              background: '#F5FBFF', 
              borderRadius: '16px', 
              border: '1.5px solid rgba(91, 184, 255, 0.3)',
              marginBottom: '22px',
              textAlign: 'left',
              fontSize: '0.85rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748B' }}>Ticket ID:</span>
                <strong style={{ color: '#2196F3' }}>{contactSuccessData.ticket}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: '#64748B' }}>Subject:</span>
                <strong style={{ color: '#0B2A52' }}>{contactSuccessData.subject}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Pet:</span>
                <strong style={{ color: '#2196F3' }}>{contactSuccessData.petName}</strong>
              </div>
            </div>

            <button 
              className="fc-btn-submit"
              onClick={() => {
                setContactSuccessModal(false);
                if (window.SoundEngine) window.SoundEngine.playClicker();
              }}
            >
              <i className="fa-solid fa-check"></i>
              <span>Done</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Toast Notifications */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast-item">
            <i className={`fa-solid ${t.icon}`} style={{ color: 'var(--primary-500)', fontSize: '1.1rem' }}></i>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>

      {/* ==================================================================
          LUXURY MULTI-COLUMN COMPREHENSIVE FOOTER
          ================================================================== */}
      <footer className="luxury-main-footer">
        <div className="footer-top-grid">
          
          {/* Column 1: Brand & Mission */}
          <div className="footer-col-brand">
            <div className="footer-brand-header" onClick={() => setActiveTab('home')}>
              <img src="assets/logo.png?v=13" alt="FurEver Care Logo" className="footer-logo-img" />
              <div>
                <span className="footer-brand-title">FurEver Care</span>
                <span className="footer-brand-sub">They Deserve Forever Love</span>
              </div>
            </div>
            <p className="footer-brand-desc">
              A unified digital ecosystem empowering pet parents, visionary veterinarians, and animal shelters with advanced clinical tools, transparent adoptions, and loving community care.
            </p>
            <div className="footer-social-row">
              <a 
                href="https://wa.me/923001234567?text=Assalam-o-Alaikum%20FurEver%20Care%20AI%20Support" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-btn whatsapp" 
                title="WhatsApp AI Support (+92 300 1234567)"
              >
                <i className="fa-brands fa-whatsapp"></i>
              </a>
              <a 
                href="https://www.instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-btn" 
                title="Instagram"
              >
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-btn" 
                title="Facebook"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-btn" 
                title="X (Twitter)"
              >
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a 
                href="https://www.youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="footer-social-btn" 
                title="YouTube"
              >
                <i className="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Platform Navigation */}
          <div className="footer-col">
            <h4 className="footer-heading">
              <i className="fa-solid fa-compass" style={{ color: 'var(--primary-500)', marginRight: '8px' }}></i>
              Platform Navigation
            </h4>
            <ul className="footer-links-list">
              <li><button onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><i className="fa-solid fa-chevron-right"></i> Home Overview</button></li>
              <li><button onClick={() => { setActiveTab('products'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><i className="fa-solid fa-chevron-right"></i> Pet Store & Supplies</button></li>
              <li><button onClick={() => { setActiveTab('shelter'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><i className="fa-solid fa-chevron-right"></i> Adoptable Pets Gallery</button></li>
              <li><button onClick={() => { setActiveTab('vet'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><i className="fa-solid fa-chevron-right"></i> 45 Specialist Doctors</button></li>
              <li><button onClick={() => { setActiveTab('community'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><i className="fa-solid fa-chevron-right"></i> Pet Lovers Community</button></li>
              <li><button onClick={() => { setActiveTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><i className="fa-solid fa-chevron-right"></i> About FurEver Care</button></li>
              <li><button onClick={() => { setActiveTab('feedback'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><i className="fa-solid fa-chevron-right"></i> Pet Parent Feedback</button></li>
            </ul>
          </div>

          {/* Column 3: Clinical Care & Services */}
          <div className="footer-col">
            <h4 className="footer-heading">
              <i className="fa-solid fa-stethoscope" style={{ color: '#8b5cf6', marginRight: '8px' }}></i>
              Services & Tools
            </h4>
            <ul className="footer-links-list">
              <li><button onClick={() => setSosModalOpen(true)} style={{ color: '#f43f5e', fontWeight: '700' }}><i className="fa-solid fa-truck-medical"></i> 24/7 Emergency SOS</button></li>
              <li><button onClick={() => setAiChatOpen(true)}><i className="fa-solid fa-robot"></i> AI PetBot Diagnostic</button></li>
              <li><button onClick={() => { setActiveTab('home'); setPetOwnerSubTab('vaccines'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><i className="fa-solid fa-syringe"></i> Vaccination Booster Log</button></li>
              <li><button onClick={() => { setActiveTab('home'); setPetOwnerSubTab('tips'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><i className="fa-solid fa-calculator"></i> Nutrition Daily Calculator</button></li>
              <li><button onClick={() => { setActiveTab('home'); setPetOwnerSubTab('grooming'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><i className="fa-solid fa-scissors"></i> Spa & Grooming Booking</button></li>
              <li><button onClick={() => { setActiveTab('vet'); setVetViewMode('cases'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}><i className="fa-solid fa-file-medical"></i> Clinical Case Studies</button></li>
            </ul>
          </div>

          {/* Column 4: Hotline, Address & Newsletter */}
          <div className="footer-col">
            <h4 className="footer-heading">
              <i className="fa-solid fa-headset" style={{ color: '#10b981', marginRight: '8px' }}></i>
              Care Desk & Updates
            </h4>
            <div className="footer-contact-items">
              <div className="footer-contact-row">
                <i className="fa-solid fa-phone" style={{ color: 'var(--primary-500)' }}></i>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>24/7 Clinical Hotline</span>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>(555) 912-3849</div>
                </div>
              </div>
              <div className="footer-contact-row">
                <i className="fa-solid fa-location-dot" style={{ color: '#f43f5e' }}></i>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-light)', textTransform: 'uppercase' }}>Main Campus</span>
                  <div style={{ fontWeight: '600', fontSize: '0.85rem' }}>Central Park Pavilions, New York</div>
                </div>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="footer-newsletter-box">
              <div style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>
                <i className="fa-regular fa-envelope" style={{ marginRight: '6px', color: 'var(--primary-500)' }}></i> Weekly Pet Tips & Adoption Drives
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const inp = e.target.elements.newsletterEmail;
                if (inp && inp.value.trim()) {
                  if (window.SoundEngine) window.SoundEngine.playChime();
                  addToast(`Subscribed ${inp.value} to weekly pet newsletter!`, 'fa-circle-check');
                  inp.value = '';
                }
              }} style={{ display: 'flex', gap: '6px' }}>
                <input 
                  type="email" 
                  name="newsletterEmail" 
                  className="input-sky" 
                  placeholder="Enter email..." 
                  style={{ padding: '8px 12px', fontSize: '0.82rem' }}
                  required 
                />
                <button type="submit" className="btn-sky-primary" style={{ padding: '8px 14px', fontSize: '0.85rem' }}>
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-light)' }}>
              © 2026 FurEver Care • TechWiz 6 Luxury Responsive Platform • All Rights Reserved.
            </span>
          </div>

          <div className="footer-badges-row">
            <span className="footer-pill-badge"><i className="fa-solid fa-shield-check" style={{ color: '#10b981' }}></i> Verified Vet Network</span>
            <span className="footer-pill-badge"><i className="fa-solid fa-lock" style={{ color: 'var(--primary-500)' }}></i> 256-Bit SSL Encrypted</span>
            <span className="footer-pill-badge"><i className="fa-solid fa-heart" style={{ color: '#f43f5e' }}></i> Ethical Pet Sanctuary</span>
          </div>
        </div>
      </footer>

        </>
      )}
    </div>
  );
}

// Render React Root
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
