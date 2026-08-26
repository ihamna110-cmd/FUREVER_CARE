// ==========================================================================
// FurEver Care - Master React Application
// Built for TechWiz 6 - NextGen Single Page Pet Care Application
// ==========================================================================

const {
  useState,
  useEffect,
  useMemo,
  useRef
} = React;
function App() {
  // ------------------------------------------------------------------------
  // 1. GLOBAL STATE & USER PROFILE
  // ------------------------------------------------------------------------
  const [showIntro, setShowIntro] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem('furever_theme') || 'light');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('furever_user');
    return saved ? JSON.parse(saved) : {
      firstName: '',
      category: 'pet-owner',
      registered: false
    };
  });
  const [activeTab, setActiveTab] = useState('home');
  const [petOwnerSubTab, setPetOwnerSubTab] = useState('profile');
  const [visitorCount, setVisitorCount] = useState(14890);
  const [currentTime, setCurrentTime] = useState('');
  const [userLocation, setUserLocation] = useState('Detecting location...');
  const [scrollY, setScrollY] = useState(0);

  // Custom Paw Cursor & Ripple State
  const [cursorPos, setCursorPos] = useState({
    x: -100,
    y: -100
  });
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
  const [rxForm, setRxForm] = useState({
    petName: '',
    petSpecies: 'Dog',
    petAge: '',
    weight: '',
    symptoms: '',
    medication: '',
    dosage: '',
    duration: '',
    notes: ''
  });
  const [addPetModalOpen, setAddPetModalOpen] = useState(false);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);

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
      try {
        return JSON.parse(savedSingle);
      } catch (e) {}
    }
    const savedList = localStorage.getItem('furever_pets');
    if (savedList) {
      try {
        const arr = JSON.parse(savedList);
        if (Array.isArray(arr) && arr.length > 0) {
          const foundBella = arr.find(p => p.name.toLowerCase() === 'bella') || arr[arr.length - 1];
          return foundBella;
        }
      } catch (e) {}
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
  const setPetForm = updatedPet => {
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
  const [medicalRecords, setMedicalRecords] = useState([{
    id: 'MED-101',
    date: 'Aug 10, 2026',
    clinic: 'FurEver Central Advanced Surgical Hospital',
    vetName: 'Dr. Sarah Jenkins, DVM',
    diagnosis: 'Routine Annual Wellness & Dental Prophylaxis Screening',
    medications: 'Omega-3 Fatty Acid Supplement (1 pump daily)',
    temperature: '38.4°C (Normal)',
    notes: 'Heart sounds crisp, clear lung fields. Mild tartar removed on upper molars.',
    status: 'Resolved'
  }, {
    id: 'MED-102',
    date: 'May 14, 2026',
    clinic: 'Skin & Coat Specialty Veterinary Institute',
    vetName: 'Dr. Elena Rostova, DVM',
    diagnosis: 'Seasonal Grass Contact Dermatitis (Paw Itching)',
    medications: 'Chlorhexidine 4% Antiseptic Foam & Apoquel (5.4mg)',
    temperature: '38.6°C',
    notes: 'Interdigital erythema fully resolved within 7 days of topical foam wash.',
    status: 'Resolved'
  }, {
    id: 'MED-103',
    date: 'Jan 22, 2026',
    clinic: 'St. Jude 24/7 Pet Emergency Trauma Hospital',
    vetName: 'Dr. Alexander Ross, BVSc',
    diagnosis: 'Minor Right Paw Pad Abrasion (Trail Running)',
    medications: 'Silver Sulfadiazine Cream & Protective Bootie',
    temperature: '38.5°C',
    notes: 'No foreign body in tissue. Healed completely without suture requirement.',
    status: 'Resolved'
  }]);
  const [newMedForm, setNewMedForm] = useState({
    date: '',
    vetName: '',
    diagnosis: '',
    medications: '',
    notes: ''
  });

  // 2. Pet Owner: Vaccination Tracking State
  const [vaccineRecords, setVaccineRecords] = useState([{
    id: 'VAC-1',
    name: 'Rabies (3-Year PureVax Vaccine)',
    administeredDate: 'Nov 18, 2025',
    dueDate: 'Nov 18, 2028',
    clinic: 'FurEver Central',
    vet: 'Dr. Sarah Jenkins',
    status: 'Valid / Up-to-Date'
  }, {
    id: 'VAC-2',
    name: 'DHPP (Distemper, Hepatitis, Parvo, Parainfluenza)',
    administeredDate: 'Mar 10, 2026',
    dueDate: 'Mar 10, 2027',
    clinic: 'FurEver Central',
    vet: 'Dr. Sarah Jenkins',
    status: 'Valid / Up-to-Date'
  }, {
    id: 'VAC-3',
    name: 'Bordetella Bronchiseptica (Kennel Cough)',
    administeredDate: 'May 02, 2026',
    dueDate: 'Nov 02, 2026',
    clinic: 'FirstSteps Pet Hospital',
    vet: 'Dr. Jessica Hayes',
    status: 'Booster Due Soon'
  }, {
    id: 'VAC-4',
    name: 'Leptospirosis 4-Strain Vaccine',
    administeredDate: 'Aug 04, 2026',
    dueDate: 'Aug 04, 2027',
    clinic: 'FurEver Central',
    vet: 'Dr. Sarah Jenkins',
    status: 'Valid / Up-to-Date'
  }]);
  const [newVacForm, setNewVacForm] = useState({
    name: '',
    administeredDate: '',
    dueDate: '',
    vet: ''
  });

  // 3. Pet Owner: Vet Appointments State
  const [ownerVetAppointments, setOwnerVetAppointments] = useState([{
    id: 'APT-901',
    doctorName: 'Dr. Sarah Jenkins, DVM (Orthopedic Surgeon)',
    clinic: 'FurEver Central Advanced Surgical Hospital',
    date: 'Sept 02, 2026',
    time: '10:00 AM - 10:45 AM',
    reason: 'Semi-Annual Joint Mobility & Preventive Review',
    status: 'Confirmed'
  }, {
    id: 'APT-902',
    doctorName: 'Dr. Rachel Kim, DVM (Veterinary Dentist)',
    clinic: 'FurEver Dental & Maxillofacial Care',
    date: 'Sept 18, 2026',
    time: '01:30 PM - 02:15 PM',
    reason: 'Routine Ultrasonic Dental Polish & Gum Check',
    status: 'Confirmed'
  }]);

  // 4. Pet Owner: Grooming Appointments State
  const [groomingBookings, setGroomingBookings] = useState([{
    id: 'GRM-501',
    service: 'Full Luxury Spa, Deshedding & Hydro-Bath',
    groomer: 'Paws & Bubbles Master Spa Salon',
    date: 'Aug 29, 2026',
    time: '11:00 AM',
    price: '$65.00',
    status: 'Upcoming'
  }, {
    id: 'GRM-502',
    service: 'Nail Grinding, Ear Cleanse & Paw Pad Balm',
    groomer: 'Bella Pet Styling Studio',
    date: 'July 15, 2026',
    time: '02:30 PM',
    price: '$28.00',
    status: 'Completed'
  }]);
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
  const [timeSlots, setTimeSlots] = useState([{
    id: 1,
    time: '09:00 AM - 09:45 AM',
    patient: 'Archie (Checkup)',
    status: 'booked'
  }, {
    id: 2,
    time: '10:00 AM - 10:45 AM',
    patient: 'Available',
    status: 'available'
  }, {
    id: 3,
    time: '11:15 AM - 12:00 PM',
    patient: 'Bella (Vaccine Booster)',
    status: 'booked'
  }, {
    id: 4,
    time: '01:30 PM - 02:15 PM',
    patient: 'Available',
    status: 'available'
  }, {
    id: 5,
    time: '02:30 PM - 03:15 PM',
    patient: 'Available',
    status: 'available'
  }, {
    id: 6,
    time: '03:45 PM - 04:30 PM',
    patient: 'Milo (Orthopedic Review)',
    status: 'booked'
  }, {
    id: 7,
    time: '04:45 PM - 05:30 PM',
    patient: 'Available',
    status: 'available'
  }, {
    id: 8,
    time: '05:45 PM - 06:30 PM',
    patient: 'Emergency Hold',
    status: 'booked'
  }]);

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
  const [chatMessages, setChatMessages] = useState([{
    sender: 'bot',
    text: 'Assalam-o-Alaikum! 🐾 Hello! Main FurEver Care ka 24/7 AI Pet Assistant hoon.\n\nAap mujhse Roman Urdu ya English mein pets ki diet, ulti/dast/bukhar ke ilaj, vaccine schedule, grooming, ya doctor booking ke bare mein kuch bhi pooch sakte hain!'
  }]);

  // ------------------------------------------------------------------------
  // 2. LIFECYCLE, REALTIME CLOCK & DATA LOADING
  // ------------------------------------------------------------------------
  useEffect(() => {
    /* GSAP Hero Animation Trigger */
    if (typeof window !== 'undefined' && window.gsap) {
      try {
        window.gsap.from('.petcare-hero-left', {
          opacity: 0,
          y: 25,
          duration: 0.8,
          ease: 'power2.out'
        });
        window.gsap.from('.petcare-composition-container', {
          opacity: 0,
          scale: 0.94,
          duration: 1,
          ease: 'power2.out',
          delay: 0.15
        });
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
      setCprBeat(prev => prev % 30 + 1);
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }, 545);
    return () => clearInterval(interval);
  }, [cprMetronomeActive]);
  const addToast = (msg, icon = 'fa-circle-check', type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, {
      id,
      msg,
      icon,
      type
    }]);
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
  const handleHeroSearchSubmit = e => {
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
      setCurrentTime(now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) + ' ' + now.toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);

    // Visitor Counter Simulation
    const visitorInterval = setInterval(() => {
      setVisitorCount(prev => prev + (Math.random() > 0.4 ? 1 : 0));
    }, 5000);

    // HTML5 Geolocation per SRS 1.6
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude.toFixed(2);
        const lon = pos.coords.longitude.toFixed(2);
        setUserLocation(`Local Hub (${lat}°N, ${lon}°E) • Clear Sky 24°C`);
      }, () => {
        setUserLocation(`Global Metro Station • 22°C (Optimal Pet Walking Weather)`);
      });
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
    window.addEventListener('scroll', handleScroll, {
      passive: true
    });

    // Custom Paw Cursor Tracking & Click Ripple Listeners
    const onMouseMove = e => {
      setCursorPos({
        x: e.clientX,
        y: e.clientY
      });
      const target = e.target;
      const isClickable = target && target.closest && target.closest('button, a, input, select, textarea, .role-card-option, .product-card, .pet-pill-btn, .payment-option-card, .glass-card-hover, .user-status-pill, .btn-icon, .filter-chip');
      setCursorHovered(!!isClickable);
    };
    const onMouseDown = e => {
      setCursorClicked(true);
      const newRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY
      };
      setRipples(prev => [...prev.slice(-8), newRipple]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 650);
    };
    const onMouseUp = () => setCursorClicked(false);
    window.addEventListener('mousemove', onMouseMove, {
      passive: true
    });
    window.addEventListener('mousedown', onMouseDown, {
      passive: true
    });
    window.addEventListener('mouseup', onMouseUp, {
      passive: true
    });
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
  const handleOnboardSubmit = e => {
    e.preventDefault();
    if (!user.firstName.trim()) {
      addToast('Please enter your first name to continue', 'fa-triangle-exclamation', 'warning');
      return;
    }
    const updated = {
      ...user,
      registered: true
    };
    setUser(updated);
    localStorage.setItem('furever_user', JSON.stringify(updated));
    if (window.SoundEngine) window.SoundEngine.playChime();
    addToast(`Welcome to FurEver Care, ${user.firstName}!`, 'fa-heart');

    // Route directly to selected role portal per SRS
    if (user.category === 'pet-owner') setActiveTab('pet-owner');else if (user.category === 'veterinarian') setActiveTab('vet');else if (user.category === 'shelter') setActiveTab('shelter');
  };

  // Switch role anytime (Pet Owner / Veterinarian / Animal Shelter)
  const handleRoleSwitch = newRole => {
    const updated = {
      ...user,
      category: newRole
    };
    setUser(updated);
    localStorage.setItem('furever_user', JSON.stringify(updated));
    if (window.SoundEngine) window.SoundEngine.playClicker();
    if (newRole === 'pet-owner') setActiveTab('pet-owner');else if (newRole === 'veterinarian') setActiveTab('vet');else if (newRole === 'shelter') setActiveTab('shelter');
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
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.tags && p.tags.some(t => t.toLowerCase().includes(q)));
    }
    if (productSort === 'price-low') list.sort((a, b) => a.price - b.price);else if (productSort === 'price-high') list.sort((a, b) => b.price - a.price);else if (productSort === 'rating') list.sort((a, b) => b.rating - a.rating);
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
      list = list.filter(v => v.name.toLowerCase().includes(q) || v.specialization.toLowerCase().includes(q) || v.clinic.toLowerCase().includes(q) || v.city.toLowerCase().includes(q) || v.bio && v.bio.toLowerCase().includes(q));
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
    return {
      calories: Math.round(baseCalories),
      grams: gramsPerDay,
      cups: cupsPerDay
    };
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
  const generateBotReply = query => {
    const raw = query.trim();
    const q = raw.toLowerCase();

    // Language Detection Check (Urdu / Roman Urdu signals)
    const urduKeywords = ['kya', 'hai', 'hain', 'kese', 'kaise', 'karna', 'karein', 'chahiye', 'batao', 'bataen', 'bataiye', 'meri', 'mera', 'mere', 'billi', 'kutta', 'kutte', 'khana', 'ulti', 'qay', 'dast', 'tatti', 'bukhar', 'khujli', 'kharish', 'dard', 'salam', 'assalam', 'shukriya', 'theek', 'thik', 'doctor', 'paisa', 'kitna', 'konsa', 'konsi', 'mariz', 'dawa', 'dawam', 'goli', 'nehlana', 'nahlana', 'nahana', 'bal', 'jhar', 'pishab', 'doodh', 'gosht', 'paani', 'bhook', 'kamzor', 'bacha', 'pilla', 'teeka', 'vaccine', 'zeher', 'pyaz', 'lehsan', 'angoor', 'madad', 'bohat', 'sirf', 'shampoo', 'safai', 'bhejo', 'dikhaye', 'chahiye', 'apka', 'naam', 'sun', 'bolo', 'kaun', 'kon', 'kahan', 'kyun', 'kabi'];
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
  const handleSendMessage = e => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    const newMsgs = [...chatMessages, {
      sender: 'user',
      text: userText
    }];
    setChatMessages(newMsgs);
    setChatInput('');
    setTimeout(() => {
      const reply = generateBotReply(userText);
      setChatMessages(prev => [...prev, {
        sender: 'bot',
        text: reply
      }]);
      if (window.SoundEngine) window.SoundEngine.playChime();
    }, 450);
  };
  const triggerBotQuery = text => {
    const newMsgs = [...chatMessages, {
      sender: 'user',
      text: text
    }];
    setChatMessages(newMsgs);
    setTimeout(() => {
      const reply = generateBotReply(text);
      setChatMessages(prev => [...prev, {
        sender: 'bot',
        text: reply
      }]);
      if (window.SoundEngine) window.SoundEngine.playChime();
    }, 450);
  };

  // ------------------------------------------------------------------------
  // 8. RENDER VIEW ENGINE
  // ------------------------------------------------------------------------
  return /*#__PURE__*/React.createElement("div", {
    className: "main-wrapper"
  }, showIntro && /*#__PURE__*/React.createElement("div", {
    className: "luxury-intro-overlay"
  }, /*#__PURE__*/React.createElement("div", {
    className: "intro-ambient-ring"
  }), /*#__PURE__*/React.createElement("img", {
    src: "assets/logo.png?v=13",
    alt: "FurEver Care Logo",
    style: {
      width: '130px',
      height: '130px',
      objectFit: 'contain',
      filter: 'drop-shadow(0 0 35px rgba(56, 189, 248, 0.9))',
      marginBottom: '20px'
    }
  }), /*#__PURE__*/React.createElement("h1", {
    className: "intro-title"
  }, "FurEver Care"), /*#__PURE__*/React.createElement("p", {
    className: "intro-tagline"
  }, "\"They Deserve Forever Love & World-Class Care\""), /*#__PURE__*/React.createElement("button", {
    className: "intro-enter-btn",
    onClick: enterWebsite
  }, /*#__PURE__*/React.createElement("span", null, "Enter FurEver Care Portal"), /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-arrow-right"
  })), /*#__PURE__*/React.createElement("div", {
    className: "intro-progress-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "intro-progress-fill"
  }))), /*#__PURE__*/React.createElement("div", {
    className: `custom-paw-cursor ${cursorHovered ? 'hovered' : ''} ${cursorClicked ? 'clicked' : ''}`,
    style: {
      transform: `translate3d(${cursorPos.x}px, ${cursorPos.y}px, 0)`
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 32 32",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className: "paw-cursor-svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M16 23C13.5 23 11 20.8 11.5 17.5C12 14.5 14.5 14 16 14C17.5 14 20 14.5 20.5 17.5C21 20.8 18.5 23 16 23Z",
    fill: "url(#pawGlow)",
    stroke: "#0284c7",
    strokeWidth: "1.2"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "8.5",
    cy: "12",
    rx: "2.5",
    ry: "3.5",
    fill: "#38bdf8",
    stroke: "#0284c7",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "13",
    cy: "8.5",
    rx: "2.5",
    ry: "3.5",
    fill: "#38bdf8",
    stroke: "#0284c7",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "19",
    cy: "8.5",
    rx: "2.5",
    ry: "3.5",
    fill: "#38bdf8",
    stroke: "#0284c7",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "23.5",
    cy: "12",
    rx: "2.5",
    ry: "3.5",
    fill: "#38bdf8",
    stroke: "#0284c7",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "pawGlow",
    x1: "11",
    y1: "14",
    x2: "21",
    y2: "23",
    gradientUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#38bdf8"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#0ea5e9"
  }))))), ripples.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    className: "paw-click-ripple",
    style: {
      left: `${r.x}px`,
      top: `${r.y}px`
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "24",
    height: "24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 17C10.5 17 9 15.5 9.3 13C9.7 10.8 11.2 10.5 12 10.5C12.8 10.5 14.3 10.8 14.7 13C15 15.5 13.5 17 12 17Z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6.5",
    cy: "9.5",
    r: "1.8"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "10",
    cy: "6.5",
    r: "1.8"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "14",
    cy: "6.5",
    r: "1.8"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17.5",
    cy: "9.5",
    r: "1.8"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "paw-background-pattern"
  }), /*#__PURE__*/React.createElement("div", {
    className: "floating-ambient-paw",
    style: {
      top: '15%',
      left: '2.5%',
      fontSize: '2.4rem',
      animationDuration: '22s'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-paw"
  })), /*#__PURE__*/React.createElement("div", {
    className: "floating-ambient-paw",
    style: {
      top: '35%',
      right: '3.5%',
      fontSize: '3rem',
      animationDuration: '26s',
      animationDelay: '-4s'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-paw"
  })), /*#__PURE__*/React.createElement("div", {
    className: "floating-ambient-paw",
    style: {
      top: '65%',
      left: '2%',
      fontSize: '2.2rem',
      animationDuration: '20s',
      animationDelay: '-8s'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-paw"
  })), /*#__PURE__*/React.createElement("div", {
    className: "floating-ambient-paw",
    style: {
      top: '82%',
      right: '3%',
      fontSize: '2.7rem',
      animationDuration: '24s',
      animationDelay: '-12s'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-paw"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ambient-glow-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glow-orb glow-orb-1"
  }), /*#__PURE__*/React.createElement("div", {
    className: "glow-orb glow-orb-2"
  }), /*#__PURE__*/React.createElement("div", {
    className: "glow-orb glow-orb-3"
  })), !showIntro && /*#__PURE__*/React.createElement("div", {
    className: "scroll-kitty",
    style: {
      top: Math.min(120 + scrollY * 0.28, window.innerHeight - 100) + 'px'
    },
    title: "Meow! \uD83D\uDC31"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 120 130",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("ellipse", {
    cx: "60",
    cy: "90",
    rx: "36",
    ry: "32",
    fill: "#5bc8f5"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "60",
    cy: "55",
    rx: "30",
    ry: "26",
    fill: "#5bc8f5"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "32,36 22,12 46,30",
    fill: "#5bc8f5"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "34,34 27,17 44,30",
    fill: "#ffaabb"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "88,36 98,12 74,30",
    fill: "#5bc8f5"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "86,34 93,17 76,30",
    fill: "#ffaabb"
  }), /*#__PURE__*/React.createElement("ellipse", {
    className: "kitty-eye",
    cx: "48",
    cy: "52",
    rx: "6",
    ry: "7",
    fill: "#ffffff"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "48",
    cy: "53",
    rx: "3.5",
    ry: "5",
    fill: "#1a5276"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "47",
    cy: "51",
    rx: "1.5",
    ry: "1.5",
    fill: "#ffffff"
  }), /*#__PURE__*/React.createElement("ellipse", {
    className: "kitty-eye",
    cx: "72",
    cy: "52",
    rx: "6",
    ry: "7",
    fill: "#ffffff"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "72",
    cy: "53",
    rx: "3.5",
    ry: "5",
    fill: "#1a5276"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "71",
    cy: "51",
    rx: "1.5",
    ry: "1.5",
    fill: "#ffffff"
  }), /*#__PURE__*/React.createElement("polygon", {
    points: "60,61 57,64 63,64",
    fill: "#ff8fab"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M57,64 Q55,69 52,67",
    stroke: "#0284c7",
    strokeWidth: "1.3",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M63,64 Q65,69 68,67",
    stroke: "#0284c7",
    strokeWidth: "1.3",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "30",
    y1: "62",
    x2: "52",
    y2: "63",
    stroke: "#0369a1",
    strokeWidth: "1.2",
    opacity: "0.7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "30",
    y1: "66",
    x2: "52",
    y2: "65",
    stroke: "#0369a1",
    strokeWidth: "1.2",
    opacity: "0.7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "90",
    y1: "62",
    x2: "68",
    y2: "63",
    stroke: "#0369a1",
    strokeWidth: "1.2",
    opacity: "0.7"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "90",
    y1: "66",
    x2: "68",
    y2: "65",
    stroke: "#0369a1",
    strokeWidth: "1.2",
    opacity: "0.7"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "60",
    cy: "95",
    rx: "20",
    ry: "18",
    fill: "#bae6fd",
    opacity: "0.7"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "38",
    cy: "120",
    rx: "12",
    ry: "8",
    fill: "#38bdf8"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "82",
    cy: "120",
    rx: "12",
    ry: "8",
    fill: "#38bdf8"
  }), /*#__PURE__*/React.createElement("path", {
    className: "kitty-tail",
    d: "M96,100 Q120,80 108,60 Q100,45 110,35",
    stroke: "#38bdf8",
    strokeWidth: "9",
    fill: "none",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M55,92 C55,89 52,87 50,89 C48,87 45,89 45,92 C45,97 50,102 55,102 Z",
    fill: "#ff6b9d",
    opacity: "0.85"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M65,92 C65,89 62,87 60,89 C58,87 55,89 55,92 C55,97 60,102 65,102 Z",
    fill: "#ff6b9d",
    opacity: "0.85"
  }))), !user.registered ? /*#__PURE__*/React.createElement("div", {
    className: "landing-gate-fullscreen"
  }, /*#__PURE__*/React.createElement("div", {
    className: "onboarding-container glass-panel"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      marginBottom: '28px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky",
    style: {
      marginBottom: '12px'
    }
  }, "PERSONALIZED PORTAL ACCESS"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '2.5rem',
      margin: '8px 0 10px'
    }
  }, "Welcome to ", /*#__PURE__*/React.createElement("span", {
    className: "gradient-text"
  }, "FurEver Care")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      fontSize: '1.05rem'
    }
  }, "Enter your name and select your category to customize your interactive dashboard.")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleOnboardSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-signature",
    style: {
      color: 'var(--primary-500)',
      marginRight: '8px'
    }
  }), "Enter Your First Name:"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-sky",
    placeholder: "e.g. hamna or Alex",
    value: user.firstName,
    onChange: e => setUser({
      ...user,
      firstName: e.target.value
    }),
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-id-badge",
    style: {
      color: 'var(--primary-500)',
      marginRight: '8px'
    }
  }), "Select the User Category You Belong To:"), /*#__PURE__*/React.createElement("div", {
    className: "role-selector-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: `role-card-option ${user.category === 'pet-owner' ? 'selected' : ''}`,
    onClick: () => setUser({
      ...user,
      category: 'pet-owner'
    })
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "userCategory",
    value: "pet-owner",
    checked: user.category === 'pet-owner',
    onChange: () => {}
  }), /*#__PURE__*/React.createElement("div", {
    className: "role-icon-box"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-dog"
  })), /*#__PURE__*/React.createElement("div", {
    className: "role-title"
  }, "1. Pet Owner"), /*#__PURE__*/React.createElement("div", {
    className: "role-desc"
  }, "Track pet health, feeding charts, grooming guides & buy curated supplies.")), /*#__PURE__*/React.createElement("div", {
    className: `role-card-option ${user.category === 'veterinarian' ? 'selected' : ''}`,
    onClick: () => setUser({
      ...user,
      category: 'veterinarian'
    })
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "userCategory",
    value: "veterinarian",
    checked: user.category === 'veterinarian',
    onChange: () => {}
  }), /*#__PURE__*/React.createElement("div", {
    className: "role-icon-box"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-stethoscope"
  })), /*#__PURE__*/React.createElement("div", {
    className: "role-title"
  }, "2. Veterinarian"), /*#__PURE__*/React.createElement("div", {
    className: "role-desc"
  }, "Manage clinical appointments, review case studies & generate prescriptions.")), /*#__PURE__*/React.createElement("div", {
    className: `role-card-option ${user.category === 'shelter' ? 'selected' : ''}`,
    onClick: () => setUser({
      ...user,
      category: 'shelter'
    })
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "userCategory",
    value: "shelter",
    checked: user.category === 'shelter',
    onChange: () => {}
  }), /*#__PURE__*/React.createElement("div", {
    className: "role-icon-box"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-house-chimney-medical"
  })), /*#__PURE__*/React.createElement("div", {
    className: "role-title"
  }, "3. Animal Shelter / Volunteer"), /*#__PURE__*/React.createElement("div", {
    className: "role-desc"
  }, "Showcase adoptable pets, manage rescue drives & publish success stories.")))), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn-sky-primary",
    style: {
      width: '100%',
      padding: '16px',
      fontSize: '1.1rem'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Launch ", user.category === 'shelter' ? 'SHELTER' : user.category.replace('-', ' ').toUpperCase(), " Dashboard"), /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-arrow-right",
    style: {
      marginLeft: '10px'
    }
  }))))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ticker-bar-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ticker-marquee-track"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ticker-item-slide"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ticker-pulse-dot"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "LIVE NETWORK:"), " 24/7 Veterinary ICU & Critical Trauma Dispatch Active")), /*#__PURE__*/React.createElement("div", {
    className: "ticker-item-slide"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-location-dot",
    style: {
      color: '#7dd3fc'
    }
  }), /*#__PURE__*/React.createElement("span", null, userLocation)), /*#__PURE__*/React.createElement("div", {
    className: "ticker-item-slide"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-clock",
    style: {
      color: '#bae6fd'
    }
  }), /*#__PURE__*/React.createElement("span", null, currentTime)), /*#__PURE__*/React.createElement("div", {
    className: "ticker-item-slide"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-paw",
    style: {
      color: '#7dd3fc'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Next Mega Adoption Drive: ", /*#__PURE__*/React.createElement("strong", null, "Sept 5 @ Central Park Pavilions"))), /*#__PURE__*/React.createElement("div", {
    className: "ticker-item-slide"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-users",
    style: {
      color: '#38bdf8'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Active Live Visitors: ", /*#__PURE__*/React.createElement("strong", null, visitorCount.toLocaleString()))), /*#__PURE__*/React.createElement("div", {
    className: "ticker-item-slide"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-shield-heart",
    style: {
      color: '#34d399'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Free Rabies & DHPP Vaccination Camp: ", /*#__PURE__*/React.createElement("strong", null, "Sept 12 \u2022 RSVP Open"))), /*#__PURE__*/React.createElement("div", {
    className: "ticker-item-slide"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ticker-pulse-dot"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "LIVE NETWORK:"), " 24/7 Veterinary ICU & Critical Trauma Dispatch Active")), /*#__PURE__*/React.createElement("div", {
    className: "ticker-item-slide"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-location-dot",
    style: {
      color: '#7dd3fc'
    }
  }), /*#__PURE__*/React.createElement("span", null, userLocation)), /*#__PURE__*/React.createElement("div", {
    className: "ticker-item-slide"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-clock",
    style: {
      color: '#bae6fd'
    }
  }), /*#__PURE__*/React.createElement("span", null, currentTime)), /*#__PURE__*/React.createElement("div", {
    className: "ticker-item-slide"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-paw",
    style: {
      color: '#7dd3fc'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Next Mega Adoption Drive: ", /*#__PURE__*/React.createElement("strong", null, "Sept 5 @ Central Park Pavilions"))), /*#__PURE__*/React.createElement("div", {
    className: "ticker-item-slide"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-users",
    style: {
      color: '#38bdf8'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Active Live Visitors: ", /*#__PURE__*/React.createElement("strong", null, visitorCount.toLocaleString()))), /*#__PURE__*/React.createElement("div", {
    className: "ticker-item-slide"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-shield-heart",
    style: {
      color: '#34d399'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Free Rabies & DHPP Vaccination Camp: ", /*#__PURE__*/React.createElement("strong", null, "Sept 12 \u2022 RSVP Open"))))), /*#__PURE__*/React.createElement("header", {
    className: "main-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "header-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand-logo-custom",
    onClick: () => setActiveTab('home')
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo.png?v=13",
    alt: "FurEver Care Logo",
    className: "brand-logo-img"
  }), /*#__PURE__*/React.createElement("div", {
    className: "brand-name"
  }, /*#__PURE__*/React.createElement("span", null, "FurEver Care"), /*#__PURE__*/React.createElement("span", {
    className: "brand-tagline"
  }, "They Deserve Forever Love"))), /*#__PURE__*/React.createElement("nav", {
    className: "nav-links"
  }, /*#__PURE__*/React.createElement("button", {
    className: `nav-btn ${activeTab === 'home' ? 'active' : ''}`,
    onClick: () => setActiveTab('home')
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-house"
  }), " Home"), /*#__PURE__*/React.createElement("button", {
    className: `nav-btn ${activeTab === 'products' ? 'active' : ''}`,
    onClick: () => {
      setActiveTab('products');
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-bag-shopping"
  }), " Pet Products"), /*#__PURE__*/React.createElement("button", {
    className: `nav-btn ${activeTab === 'community' ? 'active' : ''}`,
    onClick: () => {
      setActiveTab('community');
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-users"
  }), " Community"), /*#__PURE__*/React.createElement("button", {
    className: `nav-btn ${activeTab === 'emergency' ? 'active' : ''}`,
    onClick: () => setActiveTab('emergency')
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-truck-medical"
  }), " Emergency"), /*#__PURE__*/React.createElement("button", {
    className: `nav-btn ${activeTab === 'feedback' ? 'active' : ''}`,
    onClick: () => setActiveTab('feedback')
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-comments"
  }), " Feedback"), /*#__PURE__*/React.createElement("button", {
    className: `nav-btn ${activeTab === 'about' ? 'active' : ''}`,
    onClick: () => setActiveTab('about')
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-info"
  }), " About Us")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "user-status-pill",
    onClick: () => {
      const updated = {
        ...user,
        registered: false
      };
      setUser(updated);
      localStorage.setItem('furever_user', JSON.stringify(updated));
      addToast('Opened Portal Access Gateway', 'fa-door-open');
    },
    title: "Click to Switch User Role / Open Gateway"
  }, /*#__PURE__*/React.createElement("div", {
    className: "user-avatar-badge"
  }, user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.85rem',
      lineHeight: 1
    }
  }, user.firstName || 'Guest'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.7rem',
      color: 'var(--primary-600)',
      textTransform: 'capitalize'
    }
  }, user.category.replace('-', ' '), " ", /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-repeat",
    style: {
      marginLeft: '2px',
      fontSize: '0.65rem'
    }
  })))), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    onClick: toggleTheme,
    title: "Toggle Sky Blue Theme"
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`
  }))))), /*#__PURE__*/React.createElement("main", {
    className: "app-container"
  }, activeTab === 'home' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    className: "hero-section petcare-hero-wrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "petcare-hero-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "petcare-hero-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "petcare-trust-badge"
  }, /*#__PURE__*/React.createElement("span", {
    className: "petcare-trust-badge-dot"
  }), /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-shield-halved"
  }), /*#__PURE__*/React.createElement("span", null, window.FurEverDB?.heroPetcare?.badge || 'Trusted PetCare Platform')), /*#__PURE__*/React.createElement("h1", {
    className: "petcare-hero-title"
  }, "Better Care for ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    className: "petcare-highlight-text"
  }, "Happier Pets")), /*#__PURE__*/React.createElement("p", {
    className: "petcare-hero-desc"
  }, window.FurEverDB?.heroPetcare?.subheading || 'Your all-in-one veterinary and companion wellness ecosystem. From accredited specialist clinics and gentle grooming salons to transparent adoptions and emergency rescue dispatch.'), /*#__PURE__*/React.createElement("div", {
    className: "petcare-cta-row"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-petcare-primary",
    onClick: () => {
      setActiveTab('shelter');
      if (window.SoundEngine) window.SoundEngine.playClicker();
      addToast('Exploring adoptable pets & companion gallery', 'fa-paw');
    }
  }, /*#__PURE__*/React.createElement("span", null, "Explore PetCare"), /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-arrow-right"
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn-petcare-secondary",
    onClick: () => {
      setActiveTab('vet');
      setVetViewMode('directory');
      if (window.SoundEngine) window.SoundEngine.playClicker();
      addToast('Browsing verified veterinary specialists', 'fa-user-doctor');
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-stethoscope",
    style: {
      color: '#0ea5e9'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Find a Veterinarian"))), /*#__PURE__*/React.createElement("div", {
    className: "petcare-stats-strip"
  }, (window.FurEverDB?.heroPetcare?.trustStats || [{
    value: '15+',
    label: 'Verified Specialists',
    icon: 'fa-user-doctor',
    color: '#0ea5e9'
  }, {
    value: '4.9★',
    label: 'Client Trust Rating',
    icon: 'fa-shield-heart',
    color: '#10b981'
  }, {
    value: '24/7',
    label: 'Emergency SOS Desk',
    icon: 'fa-truck-medical',
    color: '#ef4444'
  }]).map((stat, sIdx) => /*#__PURE__*/React.createElement("div", {
    key: sIdx,
    className: "petcare-stat-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "petcare-stat-icon-wrap",
    style: {
      color: stat.color
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: 'fa-solid ' + stat.icon
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "petcare-stat-val"
  }, stat.value), /*#__PURE__*/React.createElement("div", {
    className: "petcare-stat-lbl"
  }, stat.label)))))), /*#__PURE__*/React.createElement("div", {
    className: "petcare-hero-right"
  }, /*#__PURE__*/React.createElement("div", {
    className: "petcare-composition-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "petcare-glow-orb-main"
  }), /*#__PURE__*/React.createElement("div", {
    className: "petcare-glow-ring"
  }), /*#__PURE__*/React.createElement("div", {
    className: "petcare-paw-float petcare-paw-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-paw"
  })), /*#__PURE__*/React.createElement("div", {
    className: "petcare-paw-float petcare-paw-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-paw"
  })), /*#__PURE__*/React.createElement("div", {
    className: "petcare-paw-float petcare-paw-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-paw"
  })), /*#__PURE__*/React.createElement("div", {
    className: "petcare-paw-float petcare-paw-4"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-paw"
  })), /*#__PURE__*/React.createElement("div", {
    className: "petcare-pet-card petcare-pet-dog"
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=500&q=80",
    alt: "Buddy - Golden Retriever",
    className: "petcare-pet-img"
  }), /*#__PURE__*/React.createElement("div", {
    className: "petcare-pet-tag"
  }, /*#__PURE__*/React.createElement("span", {
    className: "petcare-pet-name"
  }, "Buddy"), /*#__PURE__*/React.createElement("span", {
    className: "petcare-pet-badge"
  }, "\uD83D\uDC36 Dog"))), /*#__PURE__*/React.createElement("div", {
    className: "petcare-pet-card petcare-pet-cat"
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=500&q=80",
    alt: "Luna - British Shorthair Cat",
    className: "petcare-pet-img"
  }), /*#__PURE__*/React.createElement("div", {
    className: "petcare-pet-tag"
  }, /*#__PURE__*/React.createElement("span", {
    className: "petcare-pet-name"
  }, "Luna"), /*#__PURE__*/React.createElement("span", {
    className: "petcare-pet-badge"
  }, "\uD83D\uDC31 Cat"))), /*#__PURE__*/React.createElement("div", {
    className: "petcare-pet-card petcare-pet-rabbit"
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=500&q=80",
    alt: "Coco - Holland Lop Bunny",
    className: "petcare-pet-img"
  }), /*#__PURE__*/React.createElement("div", {
    className: "petcare-pet-tag"
  }, /*#__PURE__*/React.createElement("span", {
    className: "petcare-pet-name"
  }, "Coco"), /*#__PURE__*/React.createElement("span", {
    className: "petcare-pet-badge"
  }, "\uD83D\uDC30 Bunny"))), /*#__PURE__*/React.createElement("div", {
    className: "petcare-feature-card card-top-left",
    onClick: () => {
      setActiveTab('vet');
      setVetViewMode('directory');
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "petcare-feature-icon-box",
    style: {
      background: 'linear-gradient(135deg, #0ea5e9, #0284c7)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-stethoscope"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "petcare-feature-title"
  }, "Veterinary Care"), /*#__PURE__*/React.createElement("div", {
    className: "petcare-feature-desc"
  }, "Professional health support"))), /*#__PURE__*/React.createElement("div", {
    className: "petcare-feature-card card-top-right",
    onClick: () => {
      setActiveTab('shelter');
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "petcare-feature-icon-box",
    style: {
      background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-heart"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "petcare-feature-title"
  }, "Pet Adoption"), /*#__PURE__*/React.createElement("div", {
    className: "petcare-feature-desc"
  }, "Find a loving companion"))), /*#__PURE__*/React.createElement("div", {
    className: "petcare-feature-card card-bottom-right",
    onClick: () => {
      setActiveTab('pet-owner');
      setPetOwnerSubTab('grooming-appts');
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "petcare-feature-icon-box",
    style: {
      background: 'linear-gradient(135deg, #6366f1, #0ea5e9)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-scissors"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "petcare-feature-title"
  }, "Grooming"), /*#__PURE__*/React.createElement("div", {
    className: "petcare-feature-desc"
  }, "Healthy & happy pets"))))))), /*#__PURE__*/React.createElement("section", {
    id: "pet-wellness-hub",
    style: {
      marginTop: '50px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-header-wrap",
    style: {
      textAlign: 'center',
      justifyContent: 'center',
      marginBottom: '36px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-wand-magic-sparkles",
    style: {
      marginRight: '6px'
    }
  }), " Smart Companion Hub"), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: '10px',
      fontSize: '2.2rem'
    }
  }, "Interactive ", /*#__PURE__*/React.createElement("span", {
    className: "gradient-text"
  }, "Care & Lifestyle"), " Matcher"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      maxWidth: '620px',
      margin: '8px auto 0'
    }
  }, "Personalized symptom guidance, breed lifestyle compatibility quiz, and instant clinical pathways for your furry and feathered companions."))), /*#__PURE__*/React.createElement("div", {
    className: "home-interactive-feature-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-panel",
    style: {
      padding: '32px',
      borderRadius: 'var(--radius-xl)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "widget-icon-circle widget-icon-emerald",
    style: {
      width: '42px',
      height: '42px',
      fontSize: '1.1rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-stethoscope"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.25rem',
      margin: 0
    }
  }, "Instant Symptom & Care Pathway"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.78rem',
      color: 'var(--text-light)',
      margin: '2px 0 0'
    }
  }, "Select a symptom to see veterinarian-approved protocol"))), /*#__PURE__*/React.createElement("div", {
    className: "home-symptom-chips"
  }, [{
    id: 'itchy',
    label: 'Itchy Skin / Scratching',
    icon: 'fa-paw'
  }, {
    id: 'diet',
    label: 'Sensitive Stomach / Picky',
    icon: 'fa-bowl-food'
  }, {
    id: 'joints',
    label: 'Joint Stiffness / Limping',
    icon: 'fa-bone'
  }, {
    id: 'energy',
    label: 'High Energy / Anxiety',
    icon: 'fa-bolt'
  }].map(sym => /*#__PURE__*/React.createElement("button", {
    key: sym.id,
    className: `home-sym-chip ${homeSymptomFocus === sym.id ? 'active' : ''}`,
    onClick: () => {
      setHomeSymptomFocus(sym.id);
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa-solid ${sym.icon}`
  }), /*#__PURE__*/React.createElement("span", null, sym.label)))), /*#__PURE__*/React.createElement("div", {
    className: "home-sym-solution-box"
  }, homeSymptomFocus === 'itchy' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: '800',
      color: '#10b981',
      fontSize: '0.9rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check",
    style: {
      marginRight: '6px'
    }
  }), " Recommended Protocol"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      background: 'rgba(16,185,129,0.15)',
      color: '#10b981',
      padding: '3px 8px',
      borderRadius: 'var(--radius-sm)',
      fontWeight: '700'
    }
  }, "Mild to Moderate")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.88rem',
      color: 'var(--text-main)',
      lineHeight: '1.6',
      margin: '0 0 12px'
    }
  }, "Interdigital itching and red skin folds are often triggered by seasonal grass pollens or chicken protein sensitivities."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "hero-trust-chip"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-pump-medical",
    style: {
      color: '#0ea5e9'
    }
  }), " Chlorhexidine Foam Wash"), /*#__PURE__*/React.createElement("span", {
    className: "hero-trust-chip"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-droplet",
    style: {
      color: '#f59e0b'
    }
  }), " Pure Wild Alaskan Salmon Oil")), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-outline",
    style: {
      width: '100%',
      padding: '10px',
      fontSize: '0.88rem'
    },
    onClick: () => setActiveTab('vet')
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-calendar-check",
    style: {
      marginRight: '6px'
    }
  }), " Book Dermatology Telehealth Visit")), homeSymptomFocus === 'diet' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: '800',
      color: '#0ea5e9',
      fontSize: '0.9rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check",
    style: {
      marginRight: '6px'
    }
  }), " Nutrition & Digestion Guide"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      background: 'rgba(14,165,233,0.15)',
      color: '#0ea5e9',
      padding: '3px 8px',
      borderRadius: 'var(--radius-sm)',
      fontWeight: '700'
    }
  }, "Dietary Adjustment")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.88rem',
      color: 'var(--text-main)',
      lineHeight: '1.6',
      margin: '0 0 12px'
    }
  }, "Switch to single-source novel proteins with prebiotic pumpkin pur\xE9e to soothe the mucosal barrier."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "hero-trust-chip"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-fish",
    style: {
      color: '#10b981'
    }
  }), " Single Protein Hydrolyzed Kibble"), /*#__PURE__*/React.createElement("span", {
    className: "hero-trust-chip"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-seedling",
    style: {
      color: '#8b5cf6'
    }
  }), " Organic Probiotic Chews")), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-outline",
    style: {
      width: '100%',
      padding: '10px',
      fontSize: '0.88rem'
    },
    onClick: () => setActiveTab('products')
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-bag-shopping",
    style: {
      marginRight: '6px'
    }
  }), " Browse Sensitive Digestion Food")), homeSymptomFocus === 'joints' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: '800',
      color: '#f59e0b',
      fontSize: '0.9rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check",
    style: {
      marginRight: '6px'
    }
  }), " Orthopedic Care Protocol"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      background: 'rgba(245,158,11,0.15)',
      color: '#f59e0b',
      padding: '3px 8px',
      borderRadius: 'var(--radius-sm)',
      fontWeight: '700'
    }
  }, "Preventive / Senior")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.88rem',
      color: 'var(--text-main)',
      lineHeight: '1.6',
      margin: '0 0 12px'
    }
  }, "Relieve stiffness after sleeping and support synovial fluid regeneration with pharmaceutical Glucosamine + Chondroitin."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "hero-trust-chip"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-capsules",
    style: {
      color: '#f59e0b'
    }
  }), " Joint Max Plus Chews"), /*#__PURE__*/React.createElement("span", {
    className: "hero-trust-chip"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-bed",
    style: {
      color: '#0ea5e9'
    }
  }), " Orthopedic Memory Foam Bed")), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-outline",
    style: {
      width: '100%',
      padding: '10px',
      fontSize: '0.88rem'
    },
    onClick: () => setActiveTab('vet')
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-user-doctor",
    style: {
      marginRight: '6px'
    }
  }), " Consult Orthopedic Vet (Dr. Jenkins)")), homeSymptomFocus === 'energy' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: '800',
      color: '#8b5cf6',
      fontSize: '0.9rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check",
    style: {
      marginRight: '6px'
    }
  }), " Mental Enrichment & Training"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.75rem',
      background: 'rgba(139,92,246,0.15)',
      color: '#8b5cf6',
      padding: '3px 8px',
      borderRadius: 'var(--radius-sm)',
      fontWeight: '700'
    }
  }, "Behavioral")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.88rem',
      color: 'var(--text-main)',
      lineHeight: '1.6',
      margin: '0 0 12px'
    }
  }, "20 minutes of scent puzzle work burns more mental energy than a 60-minute walk. Try licki-mats and soothing chamomile calmers."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "hero-trust-chip"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-puzzle-piece",
    style: {
      color: '#8b5cf6'
    }
  }), " Level 2 Interactive Scent Mat"), /*#__PURE__*/React.createElement("span", {
    className: "hero-trust-chip"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-cannabis",
    style: {
      color: '#10b981'
    }
  }), " Hemp Calming Soft Chews")), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-outline",
    style: {
      width: '100%',
      padding: '10px',
      fontSize: '0.88rem'
    },
    onClick: () => setActiveTab('community')
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-comments",
    style: {
      marginRight: '6px'
    }
  }), " Read Training Stories in Community")))), /*#__PURE__*/React.createElement("div", {
    className: "glass-panel",
    style: {
      padding: '32px',
      borderRadius: 'var(--radius-xl)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "widget-icon-circle widget-icon-sky",
    style: {
      width: '42px',
      height: '42px',
      fontSize: '1.1rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-heart-circle-check"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.25rem',
      margin: 0
    }
  }, "Companion Compatibility Matcher"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.78rem',
      color: 'var(--text-light)',
      margin: '2px 0 0'
    }
  }, "Find the ideal pet match for your home and lifestyle"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: '0.82rem',
      fontWeight: '700',
      color: 'var(--text-main)',
      display: 'block',
      marginBottom: '6px'
    }
  }, "1. Your Living Environment:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px'
    }
  }, [{
    id: 'apartment',
    label: 'Apartment',
    icon: 'fa-building'
  }, {
    id: 'house',
    label: 'House / Yard',
    icon: 'fa-house'
  }, {
    id: 'farm',
    label: 'Spacious / Farm',
    icon: 'fa-tree'
  }].map(opt => /*#__PURE__*/React.createElement("button", {
    key: opt.id,
    className: `quiz-selector-btn ${homeQuizSpace === opt.id ? 'active' : ''}`,
    onClick: () => {
      setHomeQuizSpace(opt.id);
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa-solid ${opt.icon}`
  }), " ", opt.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: '0.82rem',
      fontWeight: '700',
      color: 'var(--text-main)',
      display: 'block',
      marginBottom: '6px'
    }
  }, "2. Your Daily Routine & Activity Level:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px'
    }
  }, [{
    id: 'relaxed',
    label: 'Relaxed / Cozy',
    icon: 'fa-mug-hot'
  }, {
    id: 'moderate',
    label: 'Moderate Play',
    icon: 'fa-person-walking'
  }, {
    id: 'active',
    label: 'High Energy Run',
    icon: 'fa-person-running'
  }].map(opt => /*#__PURE__*/React.createElement("button", {
    key: opt.id,
    className: `quiz-selector-btn ${homeQuizActivity === opt.id ? 'active' : ''}`,
    onClick: () => {
      setHomeQuizActivity(opt.id);
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa-solid ${opt.icon}`
  }), " ", opt.label)))), /*#__PURE__*/React.createElement("div", {
    className: "home-quiz-match-box"
  }, (() => {
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
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: match.img,
      alt: match.name,
      style: {
        width: '64px',
        height: '64px',
        borderRadius: 'var(--radius-md)',
        objectFit: 'cover',
        border: '2px solid var(--primary-400)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: '800',
        fontSize: '0.96rem'
      }
    }, match.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.74rem',
        color: '#10b981',
        fontWeight: '800'
      }
    }, match.fit)), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        margin: '3px 0 8px',
        lineHeight: '1.4'
      }
    }, match.reason), /*#__PURE__*/React.createElement("button", {
      className: "btn-sky-primary",
      style: {
        padding: '6px 14px',
        fontSize: '0.8rem'
      },
      onClick: () => {
        setActiveTab('shelter');
        if (window.SoundEngine) window.SoundEngine.playClicker();
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-paw",
      style: {
        marginRight: '6px'
      }
    }), " Meet Rescue Animals")));
  })())))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: '60px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-header-wrap",
    style: {
      textAlign: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky"
  }, "Comprehensive Ecosystem"), /*#__PURE__*/React.createElement("h2", {
    style: {
      marginTop: '8px'
    }
  }, "Designed for Every Stage of Pet Care"))), /*#__PURE__*/React.createElement("div", {
    className: "pet-hub-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-panel glass-card-hover",
    style: {
      padding: '26px',
      cursor: 'pointer'
    },
    onClick: () => handleRoleSwitch('pet-owner')
  }, /*#__PURE__*/React.createElement("div", {
    className: "role-icon-box"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-utensils"
  })), /*#__PURE__*/React.createElement("h3", null, "Smart Feeding Calculator"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      fontSize: '0.9rem',
      marginTop: '6px'
    }
  }, "Calibrate daily caloric and gram intake tailored to puppies, adults, seniors, and active breeds.")), /*#__PURE__*/React.createElement("div", {
    className: "glass-panel glass-card-hover",
    style: {
      padding: '26px',
      cursor: 'pointer'
    },
    onClick: () => setActiveTab('products')
  }, /*#__PURE__*/React.createElement("div", {
    className: "role-icon-box"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-tags"
  })), /*#__PURE__*/React.createElement("h3", null, "Curated Product Showcase"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      fontSize: '0.9rem',
      marginTop: '6px'
    }
  }, "Explore top-rated organic food, indestructible chew toys, orthopedic bedding, and health vitamins.")), /*#__PURE__*/React.createElement("div", {
    className: "glass-panel glass-card-hover",
    style: {
      padding: '26px',
      cursor: 'pointer'
    },
    onClick: () => handleRoleSwitch('shelter')
  }, /*#__PURE__*/React.createElement("div", {
    className: "role-icon-box"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-hand-holding-heart"
  })), /*#__PURE__*/React.createElement("h3", null, "Rescue & Adoption Match"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      fontSize: '0.9rem',
      marginTop: '6px'
    }
  }, "Browse adorable rescue pets with client-side filters for dogs, cats, rabbits, and birds."))))), activeTab === 'pet-owner' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-header-wrap",
    style: {
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title-box"
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky"
  }, "Pet Owner Dashboard"), /*#__PURE__*/React.createElement("h2", null, "Welcome, ", /*#__PURE__*/React.createElement("span", {
    className: "gradient-text"
  }, user.firstName || 'Pet Parent'), " & ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--primary-500)'
    }
  }, petForm.name)), /*#__PURE__*/React.createElement("p", null, "Manage your furry companion's health profiles, nutritional guides, video care, and training.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      background: 'var(--bg-surface)',
      padding: '8px 18px',
      borderRadius: 'var(--radius-full)',
      border: '1.5px solid var(--border-color)',
      boxShadow: 'var(--shadow-sm)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: petForm.photo,
    alt: petForm.name,
    style: {
      width: '42px',
      height: '42px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid var(--primary-400)'
    },
    onError: e => {
      e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&q=80';
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '800',
      fontSize: '0.98rem',
      color: 'var(--text-main)'
    }
  }, petForm.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: 'var(--primary-500)',
      fontWeight: '600'
    }
  }, petForm.species, " \u2022 ", petForm.breed))), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      padding: '10px 20px',
      fontSize: '0.88rem',
      fontWeight: '700',
      borderRadius: 'var(--radius-full)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 4px 14px rgba(14,165,233,0.35)'
    },
    onClick: () => {
      setAddPetModalOpen(true);
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus-circle"
  }), " Add Pet Profile"))), /*#__PURE__*/React.createElement("div", {
    className: "portal-subnav glass-panel",
    style: {
      overflowX: 'auto',
      flexWrap: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: `portal-subnav-btn ${petOwnerSubTab === 'profile' ? 'active' : ''}`,
    onClick: () => {
      setPetOwnerSubTab('profile');
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-id-card"
  }), " Pet Profile"), /*#__PURE__*/React.createElement("button", {
    className: `portal-subnav-btn ${petOwnerSubTab === 'medical' ? 'active' : ''}`,
    onClick: () => {
      setPetOwnerSubTab('medical');
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-waveform"
  }), " Medical History"), /*#__PURE__*/React.createElement("button", {
    className: `portal-subnav-btn ${petOwnerSubTab === 'vaccines' ? 'active' : ''}`,
    onClick: () => {
      setPetOwnerSubTab('vaccines');
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-syringe"
  }), " Vaccination Info"), /*#__PURE__*/React.createElement("button", {
    className: `portal-subnav-btn ${petOwnerSubTab === 'vet-appts' ? 'active' : ''}`,
    onClick: () => {
      setPetOwnerSubTab('vet-appts');
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-user-doctor"
  }), " Vet Appointments"), /*#__PURE__*/React.createElement("button", {
    className: `portal-subnav-btn ${petOwnerSubTab === 'grooming-appts' ? 'active' : ''}`,
    onClick: () => {
      setPetOwnerSubTab('grooming-appts');
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-scissors"
  }), " Grooming Appointments"), /*#__PURE__*/React.createElement("button", {
    className: `portal-subnav-btn ${petOwnerSubTab === 'tips' ? 'active' : ''}`,
    onClick: () => {
      setPetOwnerSubTab('tips');
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-lightbulb"
  }), " Care Tips & Training"))), petOwnerSubTab === 'profile' && /*#__PURE__*/React.createElement("div", {
    className: "hero-grid",
    style: {
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-panel",
    style: {
      padding: '30px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '20px',
      alignItems: 'center',
      marginBottom: '24px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: petForm.photo,
    alt: petForm.name,
    style: {
      width: '95px',
      height: '95px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '3px solid var(--primary-400)',
      boxShadow: '0 4px 15px rgba(14,165,233,0.3)'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky"
  }, petForm.species), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.75rem',
      marginTop: '4px'
    }
  }, petForm.name), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-muted)',
      fontSize: '0.92rem'
    }
  }, petForm.breed, " \u2022 ", petForm.age), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: 'var(--text-light)',
      marginTop: '2px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-microchip",
    style: {
      marginRight: '4px'
    }
  }), " Chip ID: ", petForm.microchip))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px',
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-glass)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: 'var(--text-light)',
      textTransform: 'uppercase'
    }
  }, "Weight"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.1rem',
      fontWeight: '700',
      color: 'var(--primary-600)'
    }
  }, petForm.weight)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px',
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-glass)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: 'var(--text-light)',
      textTransform: 'uppercase'
    }
  }, "Vaccines"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.95rem',
      fontWeight: '700',
      color: '#10b981'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-shield-check"
  }), " Current")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px',
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-glass)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: 'var(--text-light)',
      textTransform: 'uppercase'
    }
  }, "Allergies"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.95rem',
      fontWeight: '600',
      color: 'var(--text-muted)'
    }
  }, petForm.allergies || 'None'))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px',
      background: 'rgba(14, 165, 233, 0.08)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid rgba(14, 165, 233, 0.2)',
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.85rem',
      fontWeight: '700',
      marginBottom: '4px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-shield-virus",
    style: {
      color: 'var(--primary-500)',
      marginRight: '6px'
    }
  }), "Active Immunity Status:"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.85rem',
      color: 'var(--text-muted)'
    }
  }, petForm.vaccinationInfo), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.8rem',
      color: 'var(--primary-600)',
      marginTop: '8px',
      fontWeight: '600'
    }
  }, "Next Booster Review: Nov 18, 2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      flex: 1
    },
    onClick: () => {
      if (window.PDFEngine) window.PDFEngine.generateHealthCardPDF(petForm, vaccineRecords, medicalRecords);else addToast(`Exported ${petForm.name}'s Health Passport!`, 'fa-file-pdf');
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-pdf"
  }), " Export Health Passport (PDF)"))), /*#__PURE__*/React.createElement("div", {
    className: "glass-panel",
    style: {
      padding: '30px'
    }
  }, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-pen-to-square",
    style: {
      color: 'var(--primary-500)',
      marginRight: '8px'
    }
  }), " Edit Pet Profile Records"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      fontSize: '0.88rem',
      marginBottom: '20px'
    }
  }, "Update pet details, photo, allergies, and microchip number."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Pet Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "edit-pet-name",
    className: "input-sky",
    value: petForm.name,
    onChange: e => setPetForm({
      ...petForm,
      name: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Species"), /*#__PURE__*/React.createElement("select", {
    className: "input-sky",
    value: petForm.species,
    onChange: e => setPetForm({
      ...petForm,
      species: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", null, "Dog"), /*#__PURE__*/React.createElement("option", null, "Cat"), /*#__PURE__*/React.createElement("option", null, "Rabbit"), /*#__PURE__*/React.createElement("option", null, "Bird"), /*#__PURE__*/React.createElement("option", null, "Other")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Breed"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "edit-pet-breed",
    className: "input-sky",
    value: petForm.breed,
    onChange: e => setPetForm({
      ...petForm,
      breed: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Age"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "edit-pet-age",
    className: "input-sky",
    value: petForm.age,
    onChange: e => setPetForm({
      ...petForm,
      age: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Weight (kg / lbs)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-sky",
    value: petForm.weight,
    onChange: e => setPetForm({
      ...petForm,
      weight: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Microchip Number"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-sky",
    value: petForm.microchip,
    onChange: e => setPetForm({
      ...petForm,
      microchip: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Known Allergies / Diet Restrictions"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-sky",
    value: petForm.allergies,
    onChange: e => setPetForm({
      ...petForm,
      allergies: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-image",
    style: {
      marginRight: '6px',
      color: 'var(--primary-500)'
    }
  }), " Pet Photo (Choose File)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap'
    }
  }, petForm.photo && /*#__PURE__*/React.createElement("img", {
    src: petForm.photo,
    alt: "preview",
    style: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid var(--primary-400)'
    },
    onError: e => {
      e.target.style.display = 'none';
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    className: "input-sky",
    style: {
      flex: 1,
      padding: '8px'
    },
    onChange: e => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        markInvalidField(e.target, 'Image size must be under 5 MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => setPetForm({
        ...petForm,
        photo: ev.target.result
      });
      reader.readAsDataURL(file);
    }
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.73rem',
      color: 'var(--text-muted)',
      marginTop: '5px'
    }
  }, "Accepted: JPG, PNG, WEBP \u2014 Max 5 MB")), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      width: '100%'
    },
    onClick: () => {
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
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-floppy-disk",
    style: {
      marginRight: '7px'
    }
  }), "Save Profile Changes"))), petOwnerSubTab === 'medical' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '22px',
      flexWrap: 'wrap',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-waveform",
    style: {
      color: 'var(--primary-500)',
      marginRight: '8px'
    }
  }), " Medical History for ", petForm.name), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Complete chronological clinical consultations, diagnoses, prescriptions, and discharge summaries.")), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    onClick: () => setMedModalOpen(true)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus"
  }), " Add New Medical Entry (Modal)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '18px',
      marginBottom: '32px'
    }
  }, medicalRecords.map(rec => /*#__PURE__*/React.createElement("div", {
    key: rec.id,
    className: "glass-panel",
    style: {
      padding: '24px',
      borderLeft: '4px solid var(--primary-500)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
      flexWrap: 'wrap',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky"
  }, rec.id), /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: '1.1rem'
    }
  }, rec.diagnosis)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.85rem',
      color: 'var(--text-light)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-calendar-day"
  }), " ", rec.date)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '12px',
      fontSize: '0.86rem',
      color: 'var(--text-muted)',
      marginBottom: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-user-doctor",
    style: {
      color: 'var(--primary-500)',
      marginRight: '6px'
    }
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Attending Vet:"), " ", rec.vetName), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-hospital",
    style: {
      color: 'var(--primary-500)',
      marginRight: '6px'
    }
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Clinic:"), " ", rec.clinic), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-temperature-half",
    style: {
      color: 'var(--primary-500)',
      marginRight: '6px'
    }
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Temperature:"), " ", rec.temperature)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      background: 'rgba(14, 165, 233, 0.06)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-glass)',
      fontSize: '0.85rem',
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Prescriptions & Therapy:"), " ", rec.medications), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.85rem',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Clinical Observations:"), " ", rec.notes))))), petOwnerSubTab === 'vaccines' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '22px',
      flexWrap: 'wrap',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-syringe",
    style: {
      color: 'var(--primary-500)',
      marginRight: '8px'
    }
  }), " Vaccination Tracker for ", petForm.name), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Keep track of core vaccines, dates administered, and upcoming booster renewal deadlines.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    onClick: () => {
      if (window.PDFEngine) window.PDFEngine.generateVaccineCertPDF(petForm, vaccineRecords);else addToast('Vaccine Certificate generated!', 'fa-file-shield');
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-pdf"
  }), " Download Certificate (PDF)"), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-outline",
    onClick: () => setVacModalOpen(true)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus"
  }), " Record Vaccine (Modal)"))), /*#__PURE__*/React.createElement("div", {
    className: "glass-panel",
    style: {
      padding: '24px',
      overflowX: 'auto',
      marginBottom: '30px'
    }
  }, /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      textAlign: 'left',
      minWidth: '600px'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    style: {
      borderBottom: '2px solid var(--border-glass)',
      color: 'var(--text-muted)',
      fontSize: '0.85rem'
    }
  }, /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '12px'
    }
  }, "Vaccine Name"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '12px'
    }
  }, "Administered Date"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '12px'
    }
  }, "Next Booster Due"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '12px'
    }
  }, "Administering Clinic"), /*#__PURE__*/React.createElement("th", {
    style: {
      padding: '12px'
    }
  }, "Status"))), /*#__PURE__*/React.createElement("tbody", null, vaccineRecords.map(vac => /*#__PURE__*/React.createElement("tr", {
    key: vac.id,
    style: {
      borderBottom: '1px solid var(--border-glass)',
      fontSize: '0.9rem'
    }
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 12px',
      fontWeight: '700'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-shield-virus",
    style: {
      color: 'var(--primary-500)',
      marginRight: '8px'
    }
  }), vac.name), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 12px',
      color: 'var(--text-muted)'
    }
  }, vac.administeredDate), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 12px',
      fontWeight: '600',
      color: 'var(--primary-700)'
    }
  }, vac.dueDate), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 12px',
      color: 'var(--text-muted)'
    }
  }, vac.clinic, " (", vac.vet, ")"), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '14px 12px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 12px',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.78rem',
      fontWeight: '700',
      background: vac.status.includes('Due') ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
      color: vac.status.includes('Due') ? '#d97706' : '#059669'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa-solid ${vac.status.includes('Due') ? 'fa-clock' : 'fa-check-circle'}`
  }), vac.status))))))), /*#__PURE__*/React.createElement("div", {
    className: "glass-panel",
    style: {
      padding: '28px',
      maxWidth: '750px'
    }
  }, /*#__PURE__*/React.createElement("h4", null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus-circle",
    style: {
      color: 'var(--primary-500)',
      marginRight: '8px'
    }
  }), " Record New Vaccination"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      fontSize: '0.85rem',
      marginBottom: '18px'
    }
  }, "Log new immunization booster received by ", petForm.name, "."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Vaccine Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-sky",
    placeholder: "e.g. Canine Influenza H3N2",
    value: newVacForm.name,
    onChange: e => setNewVacForm({
      ...newVacForm,
      name: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Administering Vet"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-sky",
    placeholder: "e.g. Dr. Sarah Jenkins",
    value: newVacForm.vet,
    onChange: e => setNewVacForm({
      ...newVacForm,
      vet: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Date Administered"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    className: "input-sky",
    value: newVacForm.administeredDate,
    onChange: e => setNewVacForm({
      ...newVacForm,
      administeredDate: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Next Booster Due Date"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    className: "input-sky",
    value: newVacForm.dueDate,
    onChange: e => setNewVacForm({
      ...newVacForm,
      dueDate: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      width: '100%'
    },
    onClick: () => {
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
      setNewVacForm({
        name: '',
        administeredDate: '',
        dueDate: '',
        vet: ''
      });
      if (window.SoundEngine) window.SoundEngine.playChime();
      addToast(`Added ${newVac.name} to immunization records!`, 'fa-circle-check');
    }
  }, "Save Vaccine Record"))), petOwnerSubTab === 'vet-appts' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '22px',
      flexWrap: 'wrap',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-calendar-check",
    style: {
      color: 'var(--primary-500)',
      marginRight: '8px'
    }
  }), " Vet Appointments for ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#38bdf8'
    }
  }, petForm.name)), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Track upcoming visits, pre-visit checklists, doctor details & clinic directions.")), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    onClick: () => {
      setActiveTab('vet');
      setVetViewMode('directory');
      window._cameFromPetOwner = true;
      addToast('Select a doctor and book your appointment!', 'fa-user-doctor');
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus"
  }), " Book New Appointment")), /*#__PURE__*/React.createElement("div", {
    className: "apt-stats-banner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apt-stat-pill"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apt-stat-icon apt-stat-blue"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-calendar-check"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "apt-stat-num"
  }, ownerVetAppointments.length), /*#__PURE__*/React.createElement("div", {
    className: "apt-stat-label"
  }, "Total Appointments"))), /*#__PURE__*/React.createElement("div", {
    className: "apt-stat-pill"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apt-stat-icon apt-stat-green"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "apt-stat-num"
  }, ownerVetAppointments.filter(a => a.status === 'Confirmed').length), /*#__PURE__*/React.createElement("div", {
    className: "apt-stat-label"
  }, "Confirmed"))), /*#__PURE__*/React.createElement("div", {
    className: "apt-stat-pill"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apt-stat-icon apt-stat-amber"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-rotate"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "apt-stat-num"
  }, ownerVetAppointments.filter(a => a.status === 'Rescheduled').length), /*#__PURE__*/React.createElement("div", {
    className: "apt-stat-label"
  }, "Rescheduled"))), /*#__PURE__*/React.createElement("div", {
    className: "apt-stat-pill"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apt-stat-icon apt-stat-purple"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-user-doctor"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "apt-stat-num"
  }, "15"), /*#__PURE__*/React.createElement("div", {
    className: "apt-stat-label"
  }, "Available Doctors")))), /*#__PURE__*/React.createElement("div", {
    className: "apt-cards-grid"
  }, ownerVetAppointments.map((apt, idx) => {
    const isRescheduled = apt.status === 'Rescheduled';
    const checklistItems = [{
      label: 'Bring pet health records',
      done: true
    }, {
      label: 'Fast pet 4 hrs if surgery',
      done: idx % 2 === 0
    }, {
      label: 'Confirm clinic location',
      done: true
    }, {
      label: 'Prepare questions for vet',
      done: false
    }];
    const doneCount = checklistItems.filter(c => c.done).length;
    const progress = Math.round(doneCount / checklistItems.length * 100);
    return /*#__PURE__*/React.createElement("div", {
      key: apt.id,
      className: `apt-premium-card ${isRescheduled ? 'apt-rescheduled' : ''}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "apt-card-top-row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "apt-id-badge"
    }, apt.id), /*#__PURE__*/React.createElement("span", {
      className: `apt-status-pill ${isRescheduled ? 'status-rescheduled' : 'status-confirmed'}`
    }, /*#__PURE__*/React.createElement("i", {
      className: `fa-solid ${isRescheduled ? 'fa-rotate' : 'fa-circle-check'}`
    }), apt.status)), /*#__PURE__*/React.createElement("div", {
      className: "apt-doctor-row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "apt-doctor-avatar"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-user-doctor"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "apt-doctor-name"
    }, apt.doctorName), /*#__PURE__*/React.createElement("div", {
      className: "apt-doctor-clinic"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-hospital"
    }), " ", apt.clinic))), /*#__PURE__*/React.createElement("div", {
      className: "apt-datetime-grid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "apt-dt-item"
    }, /*#__PURE__*/React.createElement("div", {
      className: "apt-dt-icon"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-calendar"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "apt-dt-label"
    }, "Date"), /*#__PURE__*/React.createElement("div", {
      className: "apt-dt-value"
    }, apt.date))), /*#__PURE__*/React.createElement("div", {
      className: "apt-dt-item"
    }, /*#__PURE__*/React.createElement("div", {
      className: "apt-dt-icon"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-clock"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "apt-dt-label"
    }, "Time Slot"), /*#__PURE__*/React.createElement("div", {
      className: "apt-dt-value"
    }, apt.time))), /*#__PURE__*/React.createElement("div", {
      className: "apt-dt-item apt-countdown-item"
    }, /*#__PURE__*/React.createElement("div", {
      className: "apt-dt-icon apt-countdown-icon"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-hourglass-half"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "apt-dt-label"
    }, "Countdown"), /*#__PURE__*/React.createElement("div", {
      className: "apt-countdown-badge"
    }, idx === 0 ? '8 Days' : '24 Days')))), /*#__PURE__*/React.createElement("div", {
      className: "apt-reason-box"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-notes-medical apt-reason-icon"
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "apt-reason-label"
    }, "Reason for Visit"), /*#__PURE__*/React.createElement("div", {
      className: "apt-reason-text"
    }, apt.reason))), /*#__PURE__*/React.createElement("div", {
      className: "apt-checklist-wrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "apt-checklist-header"
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-list-check"
    }), " Pre-Visit Checklist"), /*#__PURE__*/React.createElement("span", {
      className: "apt-checklist-progress-label"
    }, doneCount, "/", checklistItems.length, " done")), /*#__PURE__*/React.createElement("div", {
      className: "apt-progress-bar-track"
    }, /*#__PURE__*/React.createElement("div", {
      className: "apt-progress-bar-fill",
      style: {
        width: progress + '%'
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "apt-checklist-items"
    }, checklistItems.map((c, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: `apt-check-item ${c.done ? 'checked' : ''}`
    }, /*#__PURE__*/React.createElement("i", {
      className: `fa-solid ${c.done ? 'fa-square-check' : 'fa-square'}`
    }), /*#__PURE__*/React.createElement("span", null, c.label))))), /*#__PURE__*/React.createElement("div", {
      className: "apt-actions-row"
    }, /*#__PURE__*/React.createElement("button", {
      className: "apt-action-btn apt-btn-map",
      onClick: () => {
        setSelectedAptForDirections(apt);
        setTransitMode('driving');
        setDirectionsModalOpen(true);
        if (window.SoundEngine) window.SoundEngine.playClicker();
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-map-location-dot"
    }), " Directions"), /*#__PURE__*/React.createElement("a", {
      href: "tel:+15559123849",
      className: "apt-action-btn apt-btn-call",
      onClick: () => {
        addToast(`Dialing ${apt.clinic}: (555) 912-3849`, 'fa-phone');
        if (window.SoundEngine) window.SoundEngine.playClicker();
      },
      title: "Direct Call to Clinic",
      style: {
        textDecoration: 'none'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-phone"
    }), " Call Clinic"), /*#__PURE__*/React.createElement("button", {
      className: "apt-action-btn apt-btn-reschedule",
      onClick: () => {
        setSelectedAptToReschedule(apt);
        setRescheduleForm({
          date: '2026-09-25',
          time: '10:00 AM - 10:45 AM',
          reason: 'Schedule Conflict',
          notes: ''
        });
        setRescheduleModalOpen(true);
        if (window.SoundEngine) window.SoundEngine.playClicker();
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-calendar-days"
    }), " Reschedule"), /*#__PURE__*/React.createElement("button", {
      className: "apt-action-btn apt-btn-cancel",
      onClick: () => {
        setOwnerVetAppointments(ownerVetAppointments.filter(a => a.id !== apt.id));
        addToast('Appointment cancelled.', 'fa-ban');
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-trash"
    }))));
  })), ownerVetAppointments.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "apt-empty-state"
  }, /*#__PURE__*/React.createElement("div", {
    className: "apt-empty-icon"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-calendar-xmark"
  })), /*#__PURE__*/React.createElement("h4", null, "No Appointments Scheduled"), /*#__PURE__*/React.createElement("p", null, "Book a vet appointment from our network of certified specialists."), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    onClick: () => {
      setActiveTab('vet');
      setVetViewMode('directory');
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus"
  }), " Book Your First Appointment"))), petOwnerSubTab === 'grooming-appts' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '22px',
      flexWrap: 'wrap',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-scissors",
    style: {
      color: 'var(--primary-500)',
      marginRight: '8px'
    }
  }), " Grooming Appointments & Spa Care for ", petForm.name), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Manage professional bath, deshedding, haircut styling, and dental polishing appointments.")), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    onClick: () => setGroomingModalOpen(true)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-scissors"
  }), " Book Grooming Session")), /*#__PURE__*/React.createElement("div", {
    className: "hero-grid",
    style: {
      alignItems: 'start',
      marginBottom: '32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass-panel",
    style: {
      padding: '28px'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-sparkles",
    style: {
      color: 'var(--primary-500)',
      marginRight: '8px'
    }
  }), " Scheduled Grooming Sessions"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }
  }, groomingBookings.map(grm => /*#__PURE__*/React.createElement("div", {
    key: grm.id,
    style: {
      padding: '18px',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-glass)',
      borderRadius: 'var(--radius-md)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: '1.05rem',
      color: 'var(--primary-700)'
    }
  }, grm.service), /*#__PURE__*/React.createElement("span", {
    style: {
      padding: '3px 10px',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.75rem',
      fontWeight: '700',
      background: grm.status === 'Upcoming' ? 'rgba(14, 165, 233, 0.15)' : 'rgba(16, 185, 129, 0.15)',
      color: grm.status === 'Upcoming' ? '#0284c7' : '#059669'
    }
  }, grm.status)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.85rem',
      color: 'var(--text-muted)',
      marginBottom: '4px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-store",
    style: {
      color: 'var(--primary-500)',
      marginRight: '6px'
    }
  }), " ", grm.groomer), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.85rem',
      color: 'var(--text-muted)',
      marginBottom: '8px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-clock",
    style: {
      color: 'var(--primary-500)',
      marginRight: '6px'
    }
  }), " ", grm.date, " at ", grm.time, " \u2022 ", /*#__PURE__*/React.createElement("strong", null, grm.price)), grm.status === 'Upcoming' && /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-outline",
    style: {
      padding: '6px 14px',
      fontSize: '0.8rem',
      marginTop: '6px'
    },
    onClick: () => {
      setReminderModalData(grm);
      setReminderModalOpen(true);
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-bell"
  }), " Send Reminder"))))), /*#__PURE__*/React.createElement("div", {
    className: "glass-panel",
    style: {
      padding: '0',
      overflow: 'hidden',
      borderRadius: 'var(--radius-lg)',
      position: 'relative',
      minHeight: '380px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
    alt: "Premium Pet Grooming Spa",
    style: {
      width: '100%',
      height: '100%',
      minHeight: '380px',
      objectFit: 'cover',
      display: 'block'
    },
    onError: e => {
      e.target.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80';
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '28px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      background: 'var(--primary-500)',
      color: '#fff',
      padding: '4px 14px',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.75rem',
      fontWeight: '700',
      marginBottom: '10px',
      width: 'fit-content'
    }
  }, "Premium Spa Services"), /*#__PURE__*/React.createElement("h3", {
    style: {
      color: '#fff',
      margin: '0 0 6px',
      fontSize: '1.35rem',
      fontWeight: '800',
      textShadow: '0 2px 8px rgba(0,0,0,0.4)'
    }
  }, "Luxury Pet Grooming & Spa"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,255,255,0.82)',
      fontSize: '0.85rem',
      margin: '0 0 18px',
      lineHeight: '1.5'
    }
  }, "Professional bath, breed styling, deshedding, nail care, ear cleanse & more \u2014 booked with one click."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      marginBottom: '18px'
    }
  }, ['Luxury Bath', 'Breed Styling', 'Nail Grinding', 'Teeth Polish', 'Oatmeal Spa'].map(tag => /*#__PURE__*/React.createElement("span", {
    key: tag,
    style: {
      background: 'rgba(255,255,255,0.18)',
      backdropFilter: 'blur(6px)',
      color: '#fff',
      padding: '4px 12px',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.75rem',
      fontWeight: '600',
      border: '1px solid rgba(255,255,255,0.25)'
    }
  }, tag))), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      alignSelf: 'flex-start',
      padding: '10px 24px',
      fontWeight: '700',
      fontSize: '0.92rem',
      boxShadow: '0 4px 16px rgba(14,165,233,0.45)'
    },
    onClick: () => {
      setGroomingModalOpen(true);
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-scissors"
  }), " Book Grooming Session"))))), petOwnerSubTab === 'tips' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hero-grid",
    style: {
      alignItems: 'start',
      marginBottom: '36px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "feeding-calc-panel glass-panel"
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky"
  }, "Interactive Nutrition Tool"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '10px 0 16px'
    }
  }, "Daily Portion Calculator"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Pet Species"), /*#__PURE__*/React.createElement("select", {
    className: "input-sky",
    value: calcPetType,
    onChange: e => setCalcPetType(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "dog"
  }, "Canine (Dog)"), /*#__PURE__*/React.createElement("option", {
    value: "cat"
  }, "Feline (Cat)"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Life Stage"), /*#__PURE__*/React.createElement("select", {
    className: "input-sky",
    value: calcAgeGroup,
    onChange: e => setCalcAgeGroup(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "puppy"
  }, "Puppy / Kitten (0-12 Mo)"), /*#__PURE__*/React.createElement("option", {
    value: "adult"
  }, "Adult (1-7 Years)"), /*#__PURE__*/React.createElement("option", {
    value: "senior"
  }, "Senior (7+ Years)")))), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Pet Weight: ", /*#__PURE__*/React.createElement("strong", null, calcWeight, " kg (", Math.round(calcWeight * 2.204), " lbs)")), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "2",
    max: "60",
    value: calcWeight,
    onChange: e => setCalcWeight(Number(e.target.value)),
    style: {
      width: '100%',
      accentColor: 'var(--primary-500)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Daily Activity Level"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px'
    }
  }, ['low', 'moderate', 'high'].map(act => /*#__PURE__*/React.createElement("button", {
    key: act,
    type: "button",
    className: `filter-chip ${calcActivity === act ? 'active' : ''}`,
    style: {
      textTransform: 'capitalize'
    },
    onClick: () => setCalcActivity(act)
  }, act)))), (() => {
    const res = calculateFoodGrams();
    return /*#__PURE__*/React.createElement("div", {
      className: "calculator-result-box"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.85rem',
        fontWeight: '700',
        color: 'var(--primary-700)',
        textTransform: 'uppercase'
      }
    }, "Recommended Daily Portion"), /*#__PURE__*/React.createElement("div", {
      className: "calc-output-value"
    }, res.grams, " Grams / Day"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.95rem',
        fontWeight: '600',
        color: 'var(--text-muted)'
      }
    }, "\u2248 ", res.cups, " Measuring Cups (", res.calories, " kcal/day)"));
  })()), /*#__PURE__*/React.createElement("div", {
    className: "glass-panel",
    style: {
      padding: '28px'
    }
  }, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-chart-pie",
    style: {
      color: 'var(--primary-500)',
      marginRight: '8px'
    }
  }), " Clinical Feeding Guidelines"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      fontSize: '0.88rem',
      marginBottom: '20px'
    }
  }, "Caloric density standards formulated by veterinary nutritional specialists."), content && content.feedingGuideMatrix && Object.entries(content.feedingGuideMatrix).map(([key, item]) => /*#__PURE__*/React.createElement("div", {
    key: key,
    style: {
      padding: '14px',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-glass)',
      borderRadius: 'var(--radius-md)',
      marginBottom: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '4px'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--primary-600)'
    }
  }, item.title), /*#__PURE__*/React.createElement("span", {
    className: "badge-sky"
  }, item.mealsPerDay)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.84rem',
      color: 'var(--text-muted)',
      marginBottom: '4px'
    }
  }, item.notes), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: 'var(--text-light)'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Target Protein:"), " ", item.proteinTarget, " \u2022 ", /*#__PURE__*/React.createElement("strong", null, "Hydration:"), " ", item.waterGuideline))))), /*#__PURE__*/React.createElement("div", {
    className: "glass-panel",
    style: {
      padding: '26px',
      marginBottom: '32px',
      border: '1.5px solid var(--border-glow)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '18px',
      flexWrap: 'wrap',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky"
  }, "Web Audio API Tool"), /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: '1.25rem',
      marginTop: '4px'
    }
  }, "Live Acoustic Pet Training Soundboard")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.82rem',
      color: 'var(--text-muted)'
    }
  }, "Real-Time Frequency Audio Synthesizer")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-glass)',
      borderRadius: 'var(--radius-md)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.6rem',
      color: 'var(--primary-500)',
      marginBottom: '8px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-hand-pointer"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '700',
      marginBottom: '4px'
    }
  }, "Training Clicker"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: 'var(--text-light)',
      marginBottom: '12px'
    }
  }, "Instant reward marker (1800Hz)"), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      width: '100%',
      padding: '8px'
    },
    onClick: () => window.SoundEngine && window.SoundEngine.playClicker()
  }, "Trigger Clicker")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-glass)',
      borderRadius: 'var(--radius-md)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.6rem',
      color: '#06b6d4',
      marginBottom: '8px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-wind"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '700',
      marginBottom: '4px'
    }
  }, "Ultrasonic Whistle"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: 'var(--text-light)',
      marginBottom: '12px'
    }
  }, "High-pitch long distance recall"), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      width: '100%',
      padding: '8px',
      background: 'linear-gradient(135deg, #06b6d4, #0891b2)'
    },
    onClick: () => window.SoundEngine && window.SoundEngine.playWhistle()
  }, "Blow Whistle")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-glass)',
      borderRadius: 'var(--radius-md)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.6rem',
      color: '#10b981',
      marginBottom: '8px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-bell"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '700',
      marginBottom: '4px'
    }
  }, "Success Chime"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: 'var(--text-light)',
      marginBottom: '12px'
    }
  }, "Harmonic positive cue"), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      width: '100%',
      padding: '8px',
      background: 'linear-gradient(135deg, #10b981, #059669)'
    },
    onClick: () => window.SoundEngine && window.SoundEngine.playChime()
  }, "Play Chime")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-glass)',
      borderRadius: 'var(--radius-md)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.6rem',
      color: '#6366f1',
      marginBottom: '8px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-music"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '700',
      marginBottom: '4px'
    }
  }, "Calming Harmony"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: 'var(--text-light)',
      marginBottom: '12px'
    }
  }, "Acoustic relaxation chord"), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      width: '100%',
      padding: '8px',
      background: 'linear-gradient(135deg, #6366f1, #4f46e5)'
    },
    onClick: () => window.SoundEngine && window.SoundEngine.playCalmingTone()
  }, "Soothe Pet")))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '32px'
    }
  }, /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: '1.3rem',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-video",
    style: {
      color: 'var(--primary-500)',
      marginRight: '8px'
    }
  }), " Grooming Masterclass Video Tutorials"), /*#__PURE__*/React.createElement("div", {
    className: "products-grid"
  }, content && content.groomingVideos && content.groomingVideos.map(video => /*#__PURE__*/React.createElement("div", {
    key: video.id,
    className: "video-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "video-thumb-container",
    onClick: () => setActiveVideo(video)
  }, /*#__PURE__*/React.createElement("img", {
    src: video.thumbnail,
    alt: video.title
  }), /*#__PURE__*/React.createElement("div", {
    className: "video-play-overlay"
  }, /*#__PURE__*/React.createElement("div", {
    className: "play-circle-btn"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-play"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "badge-sky",
    style: {
      position: 'absolute',
      bottom: '12px',
      right: '12px',
      background: 'rgba(0,0,0,0.8)',
      color: '#fff'
    }
  }, video.duration)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "product-category-lbl"
  }, video.category), /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: '1.05rem',
      marginBottom: '8px'
    }
  }, video.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.85rem',
      color: 'var(--text-muted)',
      marginBottom: '14px'
    }
  }, video.description), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--border-glass)',
      paddingTop: '12px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-outline",
    style: {
      width: '100%',
      padding: '8px'
    },
    onClick: () => setActiveVideo(video)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-play"
  }), " Watch Masterclass"))))))))), activeTab === 'products' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-header-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title-box"
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky"
  }, "Curated Pet Marketplace"), /*#__PURE__*/React.createElement("h2", null, "Pet Product ", /*#__PURE__*/React.createElement("span", {
    className: "gradient-text"
  }, "Showcase")), /*#__PURE__*/React.createElement("p", null, "Explore vet-approved dog/cat foods, interactive toys, grooming kits, bedding, and nutritional supplements.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.88rem',
      fontWeight: '600'
    }
  }, "Sort By:"), /*#__PURE__*/React.createElement("select", {
    className: "input-sky",
    style: {
      width: 'auto',
      padding: '8px 16px'
    },
    value: productSort,
    onChange: e => setProductSort(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "featured"
  }, "Featured Picks"), /*#__PURE__*/React.createElement("option", {
    value: "price-low"
  }, "Price: Low to High"), /*#__PURE__*/React.createElement("option", {
    value: "price-high"
  }, "Price: High to Low"), /*#__PURE__*/React.createElement("option", {
    value: "rating"
  }, "Highest Rated")))), /*#__PURE__*/React.createElement("div", {
    className: "catalog-toolbar glass-panel",
    style: {
      padding: '18px 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "search-input-wrap"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-magnifying-glass"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-sky",
    placeholder: "Search products by title, keyword, or animal type...",
    value: productSearch,
    onChange: e => setProductSearch(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "category-filter-chips"
  }, [{
    label: 'All',
    icon: 'fa-layer-group'
  }, {
    label: 'Dog/Cat Food',
    icon: 'fa-bowl-food'
  }, {
    label: 'Toys',
    icon: 'fa-baseball-bat-ball'
  }, {
    label: 'Grooming Essentials',
    icon: 'fa-pump-soap'
  }, {
    label: 'Bedding and Apparel',
    icon: 'fa-shirt'
  }, {
    label: 'Health Supplements',
    icon: 'fa-prescription-bottle-medical'
  }].map(cat => /*#__PURE__*/React.createElement("button", {
    key: cat.label,
    className: `filter-chip ${selectedProductCategory === cat.label ? 'active' : ''}`,
    onClick: () => {
      setSelectedProductCategory(cat.label);
      if (window.SoundEngine) window.SoundEngine.playClicker();
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa-solid ${cat.icon}`
  }), /*#__PURE__*/React.createElement("span", null, cat.label))))), /*#__PURE__*/React.createElement("div", {
    className: "store-trust-strip glass-panel",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '14px',
      padding: '14px 20px',
      margin: '18px 0 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '38px',
      height: '38px',
      borderRadius: '10px',
      background: 'rgba(14,165,233,0.14)',
      color: '#0284c7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.1rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-truck-fast"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.84rem',
      fontWeight: '800',
      color: 'var(--text-main)'
    }
  }, "Express 2-Day Shipping"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: 'var(--text-muted)'
    }
  }, "Free delivery on orders $49+"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '38px',
      height: '38px',
      borderRadius: '10px',
      background: 'rgba(16,185,129,0.14)',
      color: '#10b981',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.1rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-shield-halved"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.84rem',
      fontWeight: '800',
      color: 'var(--text-main)'
    }
  }, "100% Vet Approved"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: 'var(--text-muted)'
    }
  }, "Certified medical grade quality"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '38px',
      height: '38px',
      borderRadius: '10px',
      background: 'rgba(245,158,11,0.14)',
      color: '#f59e0b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.1rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-rotate-left"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.84rem',
      fontWeight: '800',
      color: 'var(--text-main)'
    }
  }, "30-Day Easy Returns"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: 'var(--text-muted)'
    }
  }, "100% money back guarantee"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '38px',
      height: '38px',
      borderRadius: '10px',
      background: 'rgba(99,102,241,0.14)',
      color: '#6366f1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.1rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-lock"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.84rem',
      fontWeight: '800',
      color: 'var(--text-main)'
    }
  }, "256-Bit SSL Checkout"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: 'var(--text-muted)'
    }
  }, "Encrypted & secure payments")))), /*#__PURE__*/React.createElement("div", {
    className: "products-grid"
  }, filteredProducts.map(item => /*#__PURE__*/React.createElement("div", {
    key: item.id,
    className: "product-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "product-img-box"
  }, /*#__PURE__*/React.createElement("img", {
    src: item.image,
    alt: item.name,
    className: "product-img"
  }), /*#__PURE__*/React.createElement("span", {
    className: "product-badge-tag"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-bolt",
    style: {
      marginRight: '4px'
    }
  }), item.badge)), /*#__PURE__*/React.createElement("div", {
    className: "product-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "product-category-lbl"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-tag",
    style: {
      marginRight: '5px',
      fontSize: '0.72rem',
      color: 'var(--primary-500)'
    }
  }), item.category), /*#__PURE__*/React.createElement("h3", {
    className: "product-title"
  }, item.name), /*#__PURE__*/React.createElement("p", {
    className: "product-desc"
  }, item.description), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginBottom: '14px',
      fontSize: '0.85rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#f59e0b',
      fontWeight: '700'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-star"
  }), " ", item.rating), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-light)',
      fontSize: '0.8rem'
    }
  }, "(", item.reviews, " verified reviews)"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontSize: '0.75rem',
      color: '#10b981',
      fontWeight: '700',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '3px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check"
  }), " In Stock")), /*#__PURE__*/React.createElement("div", {
    className: "product-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "product-price"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.82rem',
      verticalAlign: 'top',
      color: 'var(--primary-600)',
      marginRight: '1px'
    }
  }, "$"), item.price.toFixed(2)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    style: {
      width: '38px',
      height: '38px',
      borderRadius: '10px'
    },
    title: "Quick View Details",
    onClick: () => setActiveProductModal(item)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-eye"
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      padding: '9px 18px',
      fontSize: '0.85rem',
      fontWeight: '700',
      borderRadius: '10px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    },
    onClick: () => setCheckoutItem(item)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-bag-shopping"
  }), " Buy Now"))))))), filteredProducts.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "glass-panel",
    style: {
      padding: '60px 20px',
      textAlign: 'center',
      marginTop: '20px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-box-open",
    style: {
      fontSize: '3rem',
      color: 'var(--primary-400)',
      marginBottom: '16px'
    }
  }), /*#__PURE__*/React.createElement("h3", null, "No Products Found"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Try adjusting your search keyword or selected category filter."), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-outline",
    style: {
      marginTop: '16px'
    },
    onClick: () => {
      setProductSearch('');
      setSelectedProductCategory('All');
    }
  }, "Reset Filters"))), activeTab === 'vet' && /*#__PURE__*/React.createElement("div", null, typeof window !== 'undefined' && window._cameFromPetOwner && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      flexWrap: 'wrap',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-outline",
    style: {
      padding: '9px 22px',
      fontSize: '0.88rem',
      fontWeight: '700',
      borderRadius: 'var(--radius-full)',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      background: 'rgba(14,165,233,0.09)'
    },
    onClick: () => {
      window._cameFromPetOwner = false;
      setActiveTab('pet-owner');
      setPetOwnerSubTab('vet-appts');
      if (window.SoundEngine) window.SoundEngine.playClicker();
      addToast('Back to Pet Owner Dashboard', 'fa-arrow-left');
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-arrow-left"
  }), " Back to Pet Owner Profile"), /*#__PURE__*/React.createElement("span", {
    className: "badge-sky",
    style: {
      fontSize: '0.8rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-paw"
  }), " Active Pet: ", /*#__PURE__*/React.createElement("strong", null, petForm.name))), /*#__PURE__*/React.createElement("div", {
    className: "section-header-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title-box"
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky"
  }, "Certified Clinical Network (15 Specialists)"), /*#__PURE__*/React.createElement("h2", null, "Veterinarian ", /*#__PURE__*/React.createElement("span", {
    className: "gradient-text"
  }, "Portal & Specialist Directory")), /*#__PURE__*/React.createElement("p", null, "Browse our global network of certified veterinary surgeons, dentists, cardiologists, and exotic specialists, or manage clinical appointments and medical histories.")), /*#__PURE__*/React.createElement("div", {
    className: "portal-subnav glass-panel"
  }, /*#__PURE__*/React.createElement("button", {
    className: `portal-subnav-btn ${vetViewMode === 'directory' ? 'active' : ''}`,
    onClick: () => {
      setVetViewMode('directory');
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-user-doctor"
  }), " 15 Specialists Directory (15)"), /*#__PURE__*/React.createElement("button", {
    className: `portal-subnav-btn ${vetViewMode === 'schedule' ? 'active' : ''}`,
    onClick: () => {
      setVetViewMode('schedule');
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-calendar-days"
  }), " Appointment Slots ", selectedVetDoctor ? `(${selectedVetDoctor.name.split(',')[0]})` : ''), /*#__PURE__*/React.createElement("button", {
    className: `portal-subnav-btn ${vetViewMode === 'cases' ? 'active' : ''}`,
    onClick: () => {
      setVetViewMode('cases');
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-medical"
  }), " Case Studies (", caseStudies.length, ")"), /*#__PURE__*/React.createElement("button", {
    className: `portal-subnav-btn ${vetViewMode === 'edit' ? 'active' : ''}`,
    onClick: () => {
      setVetViewMode('edit');
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-id-card-clip"
  }), " Edit Profile"))), vetViewMode === 'directory' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "catalog-toolbar glass-panel",
    style: {
      padding: '18px 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "search-input-wrap"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-magnifying-glass"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-sky",
    placeholder: "Search doctors by name, specialty, clinic or city...",
    value: vetSearch,
    onChange: e => setVetSearch(e.target.value)
  })), /*#__PURE__*/React.createElement("div", {
    className: "category-filter-chips"
  }, ['All', 'Surgery', 'Emergency', 'Cardiology', 'Dentistry', 'Feline & Internal'].map(spec => /*#__PURE__*/React.createElement("button", {
    key: spec,
    className: `filter-chip ${vetSpecialtyFilter === spec ? 'active' : ''}`,
    onClick: () => {
      setVetSpecialtyFilter(spec);
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, spec === 'All' ? '🌟 All Specialists' : spec)))), (() => {
    const VET_CATEGORIES = [{
      key: 'Surgery',
      label: 'Surgery Specialists',
      icon: 'fa-scalpel',
      keywords: ['surgery', 'surgical', 'orthopedic', 'reconstruct', 'arthroscop', 'vascular', 'neurosurg', 'corneal']
    }, {
      key: 'Emergency',
      label: 'Emergency & Critical Care',
      icon: 'fa-truck-medical',
      keywords: ['emergency', 'trauma', 'critical', 'resuscitat', 'ventilat']
    }, {
      key: 'Cardiology',
      label: 'Cardiology & Heart',
      icon: 'fa-heart-pulse',
      keywords: ['cardio', 'heart', 'pulmonol', 'respiratory']
    }, {
      key: 'Dentistry',
      label: 'Dentistry & Oral Surgery',
      icon: 'fa-tooth',
      keywords: ['dent', 'oral']
    }, {
      key: 'Feline & Internal',
      label: 'Feline, Internal & General',
      icon: 'fa-stethoscope',
      keywords: ['feline', 'internal', 'nephro', 'gastro', 'endocrin', 'oncol', 'hemato', 'immuno', 'pathol', 'geriatric', 'general', 'family', 'preventat', 'vaccine', 'nutrition', 'behav', 'neurol', 'ophthal', 'dermato', 'exotic', 'avian', 'reptile', 'rabbit', 'wildlife', 'shelter', 'acupunct', 'rehab', 'hydrotherapy', 'integrat', 'sport', 'imaging', 'anesthes', 'senior', 'palliative', 'zoonot', 'microb', 'radiat', 'pediatric']
    }];
    const getVetsForCat = catObj => {
      const q = vetSearch.trim().toLowerCase();
      let pool = veterinarians.filter(v => v.category === catObj.key || catObj.keywords.some(kw => v.specialization.toLowerCase().includes(kw)));
      if (q) pool = pool.filter(v => v.name.toLowerCase().includes(q) || v.specialization.toLowerCase().includes(q) || v.clinic.toLowerCase().includes(q) || v.city.toLowerCase().includes(q));
      return pool.slice(0, 3);
    };
    const renderCard = doc => {
      const isSel = selectedVetDoctor && selectedVetDoctor.id === doc.id;
      return /*#__PURE__*/React.createElement("div", {
        key: doc.id,
        className: `doctor-card ${isSel ? 'selected' : ''}`
      }, /*#__PURE__*/React.createElement("div", {
        className: "doc-header-row"
      }, /*#__PURE__*/React.createElement("img", {
        src: doc.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
        alt: doc.name,
        className: "doc-avatar",
        onError: e => {
          e.target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80';
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "doc-name"
      }, doc.name), /*#__PURE__*/React.createElement("span", {
        className: "doc-specialty-badge"
      }, doc.specialization))), /*#__PURE__*/React.createElement("div", {
        className: "doc-info-line"
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-hospital"
      }), /*#__PURE__*/React.createElement("span", null, doc.clinic)), /*#__PURE__*/React.createElement("div", {
        className: "doc-info-line"
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-location-dot"
      }), /*#__PURE__*/React.createElement("span", null, doc.city)), /*#__PURE__*/React.createElement("div", {
        className: "doc-info-line",
        style: {
          justifyContent: 'space-between'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-user-clock"
      }), /*#__PURE__*/React.createElement("span", null, doc.experience)), /*#__PURE__*/React.createElement("span", {
        style: {
          fontWeight: '800',
          color: 'var(--primary-600)',
          fontSize: '0.95rem'
        }
      }, "$", doc.consultationFee, " ", /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: '0.72rem',
          fontWeight: '500',
          color: 'var(--text-muted)'
        }
      }, "/ consult"))), /*#__PURE__*/React.createElement("div", {
        className: "doc-card-footer"
      }, /*#__PURE__*/React.createElement("button", {
        className: "btn-sky-primary",
        style: {
          flex: 1,
          padding: '9px 14px',
          fontSize: '0.84rem'
        },
        onClick: () => {
          setSelectedVetDoctor(doc);
          if (doc.timeSlots && doc.timeSlots.length > 0) setTimeSlots(doc.timeSlots);
          setVetViewMode('schedule');
          if (window.SoundEngine) window.SoundEngine.playChime();
          addToast(`Selected ${doc.name.split(',')[0]}'s Schedule!`, 'fa-calendar-check');
        }
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-calendar-check"
      }), " View Schedule & Book"), /*#__PURE__*/React.createElement("button", {
        className: "btn-icon",
        style: {
          width: '38px',
          height: '38px'
        },
        title: `Call ${doc.name}`,
        onClick: () => addToast(`Connecting to ${doc.clinic} emergency line...`, 'fa-phone-volume')
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-phone"
      }))));
    };
    if (vetSpecialtyFilter !== 'All') {
      const cat = VET_CATEGORIES.find(c => c.key === vetSpecialtyFilter) || {
        label: vetSpecialtyFilter,
        keywords: [vetSpecialtyFilter.toLowerCase()]
      };
      const docs = getVetsForCat(cat);
      if (docs.length === 0) return /*#__PURE__*/React.createElement("div", {
        className: "glass-panel",
        style: {
          padding: '60px 20px',
          textAlign: 'center',
          marginTop: '20px'
        }
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-user-doctor",
        style: {
          fontSize: '3rem',
          color: 'var(--primary-400)',
          marginBottom: '16px'
        }
      }), /*#__PURE__*/React.createElement("h3", null, "No Doctors Found"), /*#__PURE__*/React.createElement("p", {
        style: {
          color: 'var(--text-muted)'
        }
      }, "No specialist found for \"", vetSpecialtyFilter, "\"."), /*#__PURE__*/React.createElement("button", {
        className: "btn-sky-outline",
        style: {
          marginTop: '16px'
        },
        onClick: () => {
          setVetSearch('');
          setVetSpecialtyFilter('All');
        }
      }, "Reset Filters"));
      return /*#__PURE__*/React.createElement("div", {
        className: "doc-directory-grid"
      }, docs.map(doc => renderCard(doc)));
    }
    return /*#__PURE__*/React.createElement("div", null, VET_CATEGORIES.map(cat => {
      const docs = getVetsForCat(cat);
      if (docs.length === 0) return null;
      return /*#__PURE__*/React.createElement("div", {
        key: cat.key,
        style: {
          marginBottom: '36px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
          paddingBottom: '10px',
          borderBottom: '2px solid var(--border-glass)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '1rem'
        }
      }, /*#__PURE__*/React.createElement("i", {
        className: `fa-solid ${cat.icon}`
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
        style: {
          margin: 0,
          fontSize: '1.05rem',
          fontWeight: '800',
          color: 'var(--text-primary)'
        }
      }, cat.label), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }
      }, "Top ", docs.length, " Specialists")), /*#__PURE__*/React.createElement("button", {
        style: {
          marginLeft: 'auto',
          cursor: 'pointer',
          border: '1px solid rgba(14,165,233,0.3)',
          background: 'rgba(14,165,233,0.08)',
          padding: '4px 14px',
          borderRadius: '20px',
          fontSize: '0.78rem',
          fontWeight: '700',
          color: 'var(--primary-600)'
        },
        onClick: () => {
          setVetSpecialtyFilter(cat.key);
          if (window.SoundEngine) window.SoundEngine.playClicker();
        }
      }, "View All \u2192")), /*#__PURE__*/React.createElement("div", {
        className: "doc-directory-grid"
      }, docs.map(doc => renderCard(doc))));
    }));
  })()), vetViewMode === 'schedule' && /*#__PURE__*/React.createElement("div", null, (() => {
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
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "vet-profile-banner"
    }, /*#__PURE__*/React.createElement("img", {
      src: currentDoc.image,
      alt: currentDoc.name,
      className: "vet-avatar-lg"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "badge-sky"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-certificate"
    }), " Verified Licensed Specialist"), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: '1.8rem',
        marginTop: '4px'
      }
    }, currentDoc.name), /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'var(--text-muted)',
        fontSize: '0.95rem',
        marginBottom: '6px'
      }
    }, /*#__PURE__*/React.createElement("strong", null, "Specialization:"), " ", currentDoc.specialization, " \u2022 ", /*#__PURE__*/React.createElement("strong", null, "Hospital:"), " ", currentDoc.clinic, " (", currentDoc.city || 'Central', ")"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.85rem',
        color: 'var(--text-light)',
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-envelope",
      style: {
        marginRight: '6px'
      }
    }), " ", currentDoc.contact || 'contact@furevervets.org'), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-star",
      style: {
        color: '#f59e0b',
        marginRight: '4px'
      }
    }), " ", currentDoc.rating || 4.9, " (", currentDoc.reviews || 150, "+ patient reviews)"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn-sky-outline",
      onClick: () => setVetViewMode('directory')
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-users"
    }), " Change Doctor"))), /*#__PURE__*/React.createElement("div", {
      className: "glass-panel",
      style: {
        padding: '30px',
        marginBottom: '30px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '14px',
        flexWrap: 'wrap',
        gap: '10px'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "badge-sky"
    }, "Live Schedule Management"), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: '1.4rem',
        marginTop: '4px'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-calendar-check",
      style: {
        color: 'var(--primary-500)',
        marginRight: '8px'
      }
    }), "Available Appointment Slots for ", currentDoc.name.split(',')[0])), /*#__PURE__*/React.createElement("span", {
      className: "badge-sky"
    }, timeSlots.length, " Active Slots")), /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
        marginBottom: '20px'
      }
    }, "Click any available green time slot to instantly reserve your pet's appointment."), /*#__PURE__*/React.createElement("div", {
      className: "time-slots-grid"
    }, timeSlots.map(slot => /*#__PURE__*/React.createElement("div", {
      key: slot.id,
      className: `slot-pill ${slot.status}`,
      onClick: () => {
        if (slot.status === 'available') {
          setTimeSlots(timeSlots.map(s => s.id === slot.id ? {
            ...s,
            status: 'booked',
            patient: `${user.firstName || 'Patient'} (Confirmed)`
          } : s));

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
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.88rem',
        fontWeight: '700'
      }
    }, slot.time), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.78rem',
        marginTop: '4px'
      }
    }, slot.status === 'booked' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-lock"
    }), " ", slot.patient) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-calendar-plus"
    }), " Click to Book")))))));
  })()), vetViewMode === 'edit' && /*#__PURE__*/React.createElement("div", {
    className: "glass-panel",
    style: {
      padding: '32px',
      maxWidth: '800px',
      margin: '0 auto 30px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky"
  }, "Doctor Profile Registration"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '8px 0 16px',
      fontSize: '1.4rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-user-pen",
    style: {
      color: 'var(--primary-500)',
      marginRight: '8px'
    }
  }), "Edit Practitioner Credentials & Clinic Information"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      fontSize: '0.88rem',
      marginBottom: '20px'
    }
  }, "Update your veterinary practice information, specializations, and hospital affiliation."), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Doctor Full Name & Academic Credentials"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-sky",
    value: vetForm.name,
    onChange: e => setVetForm({
      ...vetForm,
      name: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Specialization Area"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-sky",
    value: vetForm.specialization,
    onChange: e => setVetForm({
      ...vetForm,
      specialization: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Hospital / Clinic Facility Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-sky",
    value: vetForm.clinic,
    onChange: e => setVetForm({
      ...vetForm,
      clinic: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Direct Contact Email & Emergency Phone"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-sky",
    value: vetForm.contact,
    onChange: e => setVetForm({
      ...vetForm,
      contact: e.target.value
    })
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      width: '100%'
    },
    onClick: () => {
      if (window.SoundEngine) window.SoundEngine.playChime();
      addToast('Doctor credentials saved successfully!', 'fa-check');
    }
  }, "Save Credentials")), vetViewMode === 'cases' && /*#__PURE__*/React.createElement("div", {
    className: "glass-panel",
    style: {
      padding: '30px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky"
  }, "Clinical Case Records"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.5rem',
      marginTop: '4px'
    }
  }, "Sample Pet Medical Histories & Treatment Case Studies")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.85rem',
      color: 'var(--text-muted)'
    }
  }, "Verified Surgical & Internal Medicine Records")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
      gap: '20px'
    }
  }, caseStudies.map(cs => /*#__PURE__*/React.createElement("div", {
    key: cs.id,
    className: "case-study-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '8px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky",
    style: {
      fontSize: '0.7rem'
    }
  }, cs.id), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.78rem',
      color: 'var(--text-light)'
    }
  }, cs.date)), /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: '1.15rem',
      color: 'var(--primary-700)',
      marginBottom: '8px'
    }
  }, cs.caseTitle), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.88rem',
      fontWeight: '700',
      marginBottom: '6px'
    }
  }, "Patient: ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-main)'
    }
  }, cs.patientName)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.85rem',
      color: 'var(--text-muted)',
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Diagnosis:"), " ", cs.diagnosis), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px',
      background: 'rgba(14, 165, 233, 0.08)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-glass)',
      fontSize: '0.82rem',
      marginBottom: '12px'
    }
  }, /*#__PURE__*/React.createElement("strong", null, "Treatment Protocol:"), " ", cs.treatment), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.8rem',
      color: 'var(--text-light)',
      borderTop: '1px solid var(--border-glass)',
      paddingTop: '10px'
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Mobility / Metrics:"), " ", cs.metrics.mobilityScore || cs.metrics.urinaryPH || cs.metrics.airflowEfficiency), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#10b981',
      fontWeight: '600'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check"
  }), " ", cs.metrics.followUp))))))), activeTab === 'shelter' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-header-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-title-box"
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky"
  }, "Shelter & Rescue Network"), /*#__PURE__*/React.createElement("h2", null, "Adoptable Pets & ", /*#__PURE__*/React.createElement("span", {
    className: "gradient-text"
  }, "Rescue Drives")), /*#__PURE__*/React.createElement("p", null, "Meet wonderful animals searching for a forever family, explore success stories, and attend community vaccination camps.")), /*#__PURE__*/React.createElement("div", {
    className: "category-filter-chips"
  }, [{
    key: 'all',
    label: 'All Animals',
    icon: 'fa-paw'
  }, {
    key: 'dog',
    label: 'Dogs',
    icon: 'fa-dog'
  }, {
    key: 'cat',
    label: 'Cats',
    icon: 'fa-cat'
  }, {
    key: 'rabbit',
    label: 'Rabbits',
    icon: 'fa-carrot'
  }, {
    key: 'bird',
    label: 'Birds',
    icon: 'fa-dove'
  }].map(flt => /*#__PURE__*/React.createElement("button", {
    key: flt.key,
    className: `filter-chip ${petFilter === flt.key ? 'active' : ''}`,
    onClick: () => {
      setPetFilter(flt.key);
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa-solid ${flt.icon}`,
    style: {
      marginRight: '6px'
    }
  }), flt.label)))), (() => {
    const SHELTER_CATEGORIES = [{
      key: 'dog',
      label: 'Rescued Dogs & Puppies',
      icon: 'fa-dog'
    }, {
      key: 'cat',
      label: 'Adoptable Cats & Kittens',
      icon: 'fa-cat'
    }, {
      key: 'rabbit',
      label: 'Fluffy Rabbits & Bunnies',
      icon: 'fa-carrot'
    }, {
      key: 'bird',
      label: 'Colorful Birds & Parrots',
      icon: 'fa-dove'
    }];
    const renderPetCard = pet => /*#__PURE__*/React.createElement("div", {
      key: pet.id,
      className: "adopt-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "adopt-img-wrap"
    }, /*#__PURE__*/React.createElement("img", {
      src: pet.image,
      alt: pet.name,
      onError: e => {
        e.target.src = 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80';
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "adopt-badge-pill"
    }, pet.badge)), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '4px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "product-category-lbl",
      style: {
        margin: 0
      }
    }, pet.breed), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.78rem',
        color: 'var(--text-light)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-clock"
    }), " ", pet.age)), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: '1.25rem',
        marginBottom: '8px'
      }
    }, pet.name), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        marginBottom: '14px',
        flex: 1
      }
    }, pet.description), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.8rem',
        color: '#10b981',
        fontWeight: '600',
        marginBottom: '14px'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-shield-heart"
    }), " ", pet.healthStatus), /*#__PURE__*/React.createElement("button", {
      className: "btn-sky-primary",
      style: {
        width: '100%'
      },
      onClick: () => setActiveAdoptModal(pet)
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-heart"
    }), " Apply to Adopt ", pet.name.split(' ')[0])));

    // Single category selected -> 3 cards
    if (petFilter !== 'all') {
      const pets = adoptablePets.filter(p => p.type === petFilter).slice(0, 3);
      return /*#__PURE__*/React.createElement("div", {
        className: "shelter-pets-grid",
        style: {
          marginBottom: '48px'
        }
      }, pets.map(pet => renderPetCard(pet)));
    }

    // All selected -> Grouped sections, 3 cards each
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: '48px'
      }
    }, SHELTER_CATEGORIES.map(cat => {
      const pets = adoptablePets.filter(p => p.type === cat.key).slice(0, 3);
      if (pets.length === 0) return null;
      return /*#__PURE__*/React.createElement("div", {
        key: cat.key,
        style: {
          marginBottom: '40px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
          paddingBottom: '10px',
          borderBottom: '2px solid var(--border-glass)'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--primary-500), var(--primary-700))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '1rem'
        }
      }, /*#__PURE__*/React.createElement("i", {
        className: `fa-solid ${cat.icon}`
      })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
        style: {
          margin: 0,
          fontSize: '1.1rem',
          fontWeight: '800',
          color: 'var(--text-primary)'
        }
      }, cat.label), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: '0.78rem',
          color: 'var(--text-muted)'
        }
      }, "Top 3 Available for Adoption")), /*#__PURE__*/React.createElement("button", {
        style: {
          marginLeft: 'auto',
          cursor: 'pointer',
          border: '1px solid rgba(14,165,233,0.3)',
          background: 'rgba(14,165,233,0.08)',
          padding: '4px 14px',
          borderRadius: '20px',
          fontSize: '0.78rem',
          fontWeight: '700',
          color: 'var(--primary-600)'
        },
        onClick: () => {
          setPetFilter(cat.key);
          if (window.SoundEngine) window.SoundEngine.playClicker();
        }
      }, "View All ", cat.label.split(' ')[1], " \u2192")), /*#__PURE__*/React.createElement("div", {
        className: "shelter-pets-grid"
      }, pets.map(pet => renderPetCard(pet))));
    }));
  })(), /*#__PURE__*/React.createElement("div", {
    className: "glass-panel",
    style: {
      padding: '32px',
      marginBottom: '40px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-header-wrap",
    style: {
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky"
  }, "Heartwarming Journeys"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.6rem',
      marginTop: '4px'
    }
  }, "Adoption Success Stories")), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      fontSize: '0.9rem'
    }
  }, "4,850+ Happy Tails & Forever Homes")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
      gap: '24px'
    }
  }, content && content.adoptionSuccessStories && content.adoptionSuccessStories.map(story => /*#__PURE__*/React.createElement("div", {
    key: story.id,
    style: {
      padding: '24px',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-glass)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      marginBottom: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: '140px',
      borderRadius: 'var(--radius-sm)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: story.photoBefore,
    alt: "Before",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: '6px',
      left: '6px',
      background: 'rgba(0,0,0,0.75)',
      color: '#fff',
      fontSize: '0.7rem',
      padding: '2px 8px',
      borderRadius: '4px'
    }
  }, "Rescue Day")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: '140px',
      borderRadius: 'var(--radius-sm)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: story.photoAfter,
    alt: "After",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      bottom: '6px',
      left: '6px',
      background: 'rgba(16,185,129,0.85)',
      color: '#fff',
      fontSize: '0.7rem',
      padding: '2px 8px',
      borderRadius: '4px'
    }
  }, "Happy Today"))), /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: '1.1rem',
      marginBottom: '4px'
    }
  }, story.petName), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.8rem',
      color: 'var(--primary-600)',
      fontWeight: '600',
      marginBottom: '8px'
    }
  }, "Adopted by ", story.adopter), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.85rem',
      color: 'var(--text-muted)',
      marginBottom: '12px'
    }
  }, story.story), /*#__PURE__*/React.createElement("blockquote", {
    style: {
      fontSize: '0.82rem',
      fontStyle: 'italic',
      color: 'var(--text-light)',
      borderLeft: '3px solid var(--primary-400)',
      paddingLeft: '10px'
    }
  }, "\"", story.quote, "\""))))), /*#__PURE__*/React.createElement("div", {
    className: "glass-panel",
    style: {
      padding: '32px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-header-wrap",
    style: {
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky"
  }, "Community Action"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.6rem',
      marginTop: '4px'
    }
  }, "Upcoming Adoption Drives & Vaccination Camps"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '20px'
    }
  }, events.map(evt => /*#__PURE__*/React.createElement("div", {
    key: evt.id,
    style: {
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-glass)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: evt.image,
    alt: evt.title,
    style: {
      width: '100%',
      height: '160px',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky",
    style: {
      marginBottom: '8px'
    }
  }, evt.tag), /*#__PURE__*/React.createElement("h4", {
    style: {
      fontSize: '1.1rem',
      margin: '6px 0 8px'
    }
  }, evt.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.85rem',
      color: 'var(--text-light)',
      marginBottom: '6px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-calendar-day",
    style: {
      marginRight: '6px',
      color: 'var(--primary-500)'
    }
  }), " ", evt.date, " \u2022 ", evt.time), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.85rem',
      color: 'var(--text-light)',
      marginBottom: '12px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-location-dot",
    style: {
      marginRight: '6px',
      color: '#f43f5e'
    }
  }), " ", evt.location), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.85rem',
      color: 'var(--text-muted)',
      marginBottom: '16px'
    }
  }, evt.description), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      width: '100%'
    },
    onClick: () => {
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
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-ticket",
    style: {
      marginRight: '6px'
    }
  }), " RSVP / Free Seat (", evt.rsvpCount, " Attending)"))))))), activeTab === 'emergency' && (() => {
    const triageProtocols = {
      choking: {
        title: 'Choking & Airway Obstruction',
        icon: 'fa-lungs',
        badge: 'Critical Emergency (Act < 3 Mins)',
        badgeColor: '#e11d48',
        symptoms: 'Violent gagging, pawing at mouth, blue/grey tongue, silent wheezing, collapse',
        actions: ['Open mouth gently and look inside. If a solid foreign object is clearly visible, do a gentle sweep with tweezers or fingers without pushing it deeper.', 'For Small Dogs & Cats: Hold pet upside down by thighs with head hanging downward, give 4-5 firm back slaps between shoulder blades.', 'For Medium/Large Dogs: Stand behind dog, place hands just under ribcage, and deliver 4-5 quick inward & upward abdominal thrusts (Heimlich Maneuver).', 'If breathing does not immediately resume, start CPR chest compressions and rush to the nearest emergency trauma center.'],
        donts: 'Never perform a blind sweep if you cannot see the item. Never use sharp metal tools deep inside throat.',
        hotline: '(888) 426-4435'
      },
      bleeding: {
        title: 'Severe Bleeding & Hemorrhage',
        icon: 'fa-droplet',
        badge: 'Urgent Care Required',
        badgeColor: '#e11d48',
        symptoms: 'Pulsing or pooling bright red blood, deep puncture wounds, arterial spray, weakness',
        actions: ['Apply immediate direct pressure to the wound with a clean sterile gauze, towel, or cotton roll for at least 5 minutes uninterrupted.', 'If blood soaks through, DO NOT remove the bottom layer (it disrupts clotting); add more absorbent layers directly on top.', 'Elevate the bleeding limb above heart level if no bone fractures are suspected.', 'Wrap firmly with an elastic bandage roll or Vetrap. Keep pet calm, warm, and immobile during transport.'],
        donts: 'Never apply a tight limb tourniquet unless instructed by a certified veterinarian (can cause tissue necrosis).',
        hotline: '+1 (800) 555-7297'
      },
      seizures: {
        title: 'Seizures, Tremors & Neurological',
        icon: 'fa-bolt',
        badge: 'High Severity Emergency',
        badgeColor: '#f59e0b',
        symptoms: 'Uncontrolled paddling, twitching, jaw champing, excessive foaming, loss of consciousness',
        actions: ['Clear all hard or sharp objects, stairs, and furniture away from the pet to prevent physical trauma.', 'Dim room lighting, turn off TV/loud noises, and speak in a soft, soothing whisper.', 'Carefully time the exact duration of the seizure with a stopwatch or phone timer.', 'Place a soft rolled towel behind the head for cushion support once the seizure subsides.'],
        donts: 'NEVER put your fingers or spoons into the pet\'s mouth (animals do NOT swallow their tongues and can bite involuntarily).',
        hotline: '+1 (800) 555-7297'
      },
      heatstroke: {
        title: 'Heatstroke & Hyperthermia (> 104°F / 40°C)',
        icon: 'fa-temperature-high',
        badge: 'Immediate Action Required',
        badgeColor: '#e11d48',
        symptoms: 'Excessive heavy panting, brick-red gums, thick sticky saliva, lethargy, vomiting, staggering',
        actions: ['Immediately move pet into air-conditioned room or deep shaded area with active airflow.', 'Apply cool (tap water) wet towels to groin, armpits, paw pads, and neck. Spray paws with cool water.', 'Position an electric fan directly toward the pet to promote cooling evaporation.', 'Offer small amounts of cool (not ice) drinking water if pet is conscious and able to swallow.'],
        donts: 'NEVER use freezing ice water or ice baths (causes peripheral blood vessel constriction, trapping core heat).',
        hotline: '(888) 426-4435'
      },
      poison: {
        title: 'Toxic & Chemical Ingestion',
        icon: 'fa-skull-crossbones',
        badge: 'Critical Poison Emergency',
        badgeColor: '#e11d48',
        symptoms: 'Sudden vomiting, diarrhea, dilated pupils, drooling, staggering, tremors, chemical odor',
        actions: ['Take a photo of the product container, packaging, plant leaves, or medication label immediately.', 'Note exact estimated time of ingestion and approximate quantity consumed.', 'Call the 24/7 National Poison Helpline immediately at (888) 426-4435 for customized triage advice.', 'Keep pet calm and transport immediately with the packaging to the emergency clinic.'],
        donts: 'Do NOT induce vomiting with hydrogen peroxide or salt unless specifically instructed by ASPCA Poison Control.',
        hotline: '(888) 426-4435'
      },
      trauma: {
        title: 'Fractures & Hit-by-Car Trauma',
        icon: 'fa-bone',
        badge: 'Surgical Trauma Priority',
        badgeColor: '#e11d48',
        symptoms: 'Non-weight bearing limb, visible deformity, shallow rapid breathing, shock, pale gums',
        actions: ['Approach very gently; injured pets may bite reflexively due to extreme pain. Consider a temporary soft muzzle.', 'Carefully slide a rigid board, firm cardboard, or taut blanket under the pet to serve as a supportive stretcher.', 'Keep head, neck, and spine straight in a neutral horizontal position without twisting.', 'Cover with a light fleece blanket to combat hypothermia and shock during emergency transit.'],
        donts: 'Do not attempt to push exposed bones back or wash deep puncture wounds with hydrogen peroxide.',
        hotline: '+1 (800) 555-7297'
      }
    };
    const activeProtocol = triageProtocols[emergencySymptom] || triageProtocols.choking;
    const detailedToxins = [{
      name: 'Xylitol (Birch Sweetener)',
      category: 'Food',
      severity: 'Fatal',
      onset: '15-30 Mins',
      danger: 'Severe hypoglycemia & acute liver necrosis',
      items: 'Sugar-free gum, peanut butter, chewable vitamins, baked keto treats',
      antidote: 'Immediate IV Dextrose & hepatoprotectants'
    }, {
      name: 'Dark & Baking Chocolate',
      category: 'Food',
      severity: 'High',
      onset: '1-4 Hours',
      danger: 'Theobromine & caffeine cardiac arrhythmia',
      items: 'Cocoa powder, 70%+ dark chocolate, gourmet brownies',
      antidote: 'Emesis (if < 2h) & Activated Charcoal'
    }, {
      name: 'Grapes, Raisins & Currants',
      category: 'Food',
      severity: 'Fatal',
      onset: '6-24 Hours',
      danger: 'Tartaric acid acute renal/kidney failure',
      items: 'Fresh grapes, trail mix, fruit cereals, raisin bread',
      antidote: 'Aggressive 48hr IV Fluid diuresis'
    }, {
      name: 'Lilies (True Lilies for Cats)',
      category: 'Plants',
      severity: 'Fatal',
      onset: '2-12 Hours',
      danger: 'Severe acute renal failure from pollen/water',
      items: 'Easter, Tiger, Day, Stargazer and Asiatic lilies',
      antidote: 'Decontamination & 72hr IV fluids'
    }, {
      name: 'Human NSAIDs (Ibuprofen / Tylenol)',
      category: 'Meds',
      severity: 'Fatal',
      onset: '1-2 Hours',
      danger: 'Gastric ulcer perforation & acute organ failure',
      items: 'Advil, Motrin, Tylenol (Acetaminophen), Aleve',
      antidote: 'N-acetylcysteine, GI protectants'
    }, {
      name: 'Onions, Garlic & Chives',
      category: 'Food',
      severity: 'High',
      onset: '2-5 Days',
      danger: 'Thiosulfate hemolytic anemia (RBC destruction)',
      items: 'Raw/cooked onions, garlic powder, soup broths',
      antidote: 'Blood transfusion & oxygen therapy'
    }, {
      name: 'Antifreeze (Ethylene Glycol)',
      category: 'Chemicals',
      severity: 'Fatal',
      onset: '30 Mins',
      danger: 'Sweet-tasting lethal kidney crystal buildup',
      items: 'Automotive coolant, brake fluids, de-icers',
      antidote: '4-MP (Fomepizole) or ethanol IV'
    }, {
      name: 'Rodenticides (Rat Poison)',
      category: 'Chemicals',
      severity: 'Fatal',
      onset: '1-3 Days',
      danger: 'Internal hemorrhaging & neurotoxicity',
      items: 'Bait pellets, green poison blocks, tracking powders',
      antidote: 'Vitamin K1 therapy for 30 days'
    }];
    const filteredToxins = detailedToxins.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(emergencyToxinSearch.toLowerCase()) || t.items.toLowerCase().includes(emergencyToxinSearch.toLowerCase()) || t.danger.toLowerCase().includes(emergencyToxinSearch.toLowerCase());
      return matchesSearch;
    });
    return /*#__PURE__*/React.createElement("div", {
      className: "emergency-page-wrapper"
    }, /*#__PURE__*/React.createElement("div", {
      className: "emergency-hero-siren-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "emergency-siren-badge"
    }, /*#__PURE__*/React.createElement("span", {
      className: "emergency-siren-dot"
    }), /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-truck-medical",
      style: {
        marginRight: '6px'
      }
    }), " 24/7 CRITICAL CARE NETWORK ACTIVE"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '30px',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      className: "emergency-hero-heading"
    }, "Is Your Pet Experiencing a ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#f43f5e'
      }
    }, "Medical Emergency?")), /*#__PURE__*/React.createElement("p", {
      className: "emergency-hero-sub"
    }, "Do not wait. Connect directly with licensed emergency veterinary triage, dispatch an ambulance, or follow step-by-step first-aid protocols."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: '14px',
        flexWrap: 'wrap',
        marginTop: '20px'
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: "tel:18884264435",
      className: "btn-emergency-call",
      onClick: () => {
        if (window.SoundEngine) window.SoundEngine.playAlarm();
        addToast('Connecting direct telephone call to (888) 426-4435...', 'fa-phone', 'warning');
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-phone-volume",
      style: {
        fontSize: '1.3rem'
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.72rem',
        opacity: 0.9,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }
    }, "Tap to Call 24/7 Poison ER"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '1.05rem',
        fontWeight: '800'
      }
    }, "(888) 426-4435"))), /*#__PURE__*/React.createElement("a", {
      href: "https://wa.me/923001234567?text=\uD83D\uDEA8%20EMERGENCY%20SOS:%20My%20pet%20needs%20urgent%20critical%20care.%20Please%20dispatch%20triage%20assistance.",
      target: "_blank",
      rel: "noopener noreferrer",
      className: "btn-emergency-wa",
      onClick: () => {
        if (window.SoundEngine) window.SoundEngine.playChime();
        addToast('Opening 24/7 WhatsApp Emergency Ambulance Desk (+92 300 1234567)...', 'fa-brands fa-whatsapp');
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-brands fa-whatsapp",
      style: {
        fontSize: '1.4rem'
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.72rem',
        opacity: 0.9,
        textTransform: 'uppercase'
      }
    }, "WhatsApp Ambulance"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '1.05rem',
        fontWeight: '800'
      }
    }, "+92 300 1234567"))), /*#__PURE__*/React.createElement("button", {
      className: "btn-emergency-firstaid",
      onClick: () => setSosModalOpen(true)
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-kit-medical",
      style: {
        color: '#fb7185',
        fontSize: '1.1rem'
      }
    }), /*#__PURE__*/React.createElement("span", null, "First Aid Guide & Protocols")))), /*#__PURE__*/React.createElement("div", {
      className: "emergency-status-panel"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '14px',
        borderBottom: '1px solid rgba(244,63,94,0.3)',
        paddingBottom: '10px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: '800',
        fontSize: '0.92rem',
        color: '#fb7185',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-satellite-dish"
    }), " Live Triage Hospital Status"), /*#__PURE__*/React.createElement("span", {
      className: "badge-sky",
      style: {
        background: 'rgba(16,185,129,0.2)',
        color: '#34d399',
        borderColor: '#10b981',
        fontSize: '0.74rem',
        fontWeight: '800'
      }
    }, "\u25CF OPEN NOW")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        fontSize: '0.84rem'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "triage-status-mini-card"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#cbd5e1',
        fontSize: '0.74rem',
        fontWeight: '600',
        display: 'block',
        marginBottom: '3px'
      }
    }, "Avg Wait Time"), /*#__PURE__*/React.createElement("strong", {
      style: {
        color: '#34d399',
        display: 'block',
        fontSize: '1.1rem'
      }
    }, "< 4 Minutes")), /*#__PURE__*/React.createElement("div", {
      className: "triage-status-mini-card"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#cbd5e1',
        fontSize: '0.74rem',
        fontWeight: '600',
        display: 'block',
        marginBottom: '3px'
      }
    }, "Surgeons On Duty"), /*#__PURE__*/React.createElement("strong", {
      style: {
        color: '#ffffff',
        display: 'block',
        fontSize: '1.1rem'
      }
    }, "6 Specialists")), /*#__PURE__*/React.createElement("div", {
      className: "triage-status-mini-card"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#cbd5e1',
        fontSize: '0.74rem',
        fontWeight: '600',
        display: 'block',
        marginBottom: '3px'
      }
    }, "Oxygen Cages"), /*#__PURE__*/React.createElement("strong", {
      style: {
        color: '#34d399',
        display: 'block',
        fontSize: '1.1rem'
      }
    }, "Available (12)")), /*#__PURE__*/React.createElement("div", {
      className: "triage-status-mini-card"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#cbd5e1',
        fontSize: '0.74rem',
        fontWeight: '600',
        display: 'block',
        marginBottom: '3px'
      }
    }, "Blood Bank"), /*#__PURE__*/React.createElement("strong", {
      style: {
        color: '#fb7185',
        display: 'block',
        fontSize: '1.1rem'
      }
    }, "Canine & Feline")))))), /*#__PURE__*/React.createElement("section", {
      className: "glass-panel",
      style: {
        padding: '34px',
        borderRadius: 'var(--radius-xl)',
        border: '1.5px solid var(--border-glow)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '22px'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "badge-sky",
      style: {
        background: 'rgba(244,63,94,0.12)',
        color: '#f43f5e',
        borderColor: 'rgba(244,63,94,0.3)',
        marginBottom: '6px'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-stethoscope",
      style: {
        marginRight: '6px'
      }
    }), " Real-Time Emergency Protocol"), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: '1.65rem',
        margin: 0,
        fontFamily: 'var(--font-heading)'
      }
    }, "Interactive Symptom ", /*#__PURE__*/React.createElement("span", {
      className: "gradient-text"
    }, "Triage Guide"))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.82rem',
        color: 'var(--text-light)'
      }
    }, "Select your pet's current distress symptom for immediate guidance")), /*#__PURE__*/React.createElement("div", {
      className: "emergency-symptom-nav"
    }, [{
      id: 'choking',
      label: 'Choking / Airway',
      icon: 'fa-lungs'
    }, {
      id: 'bleeding',
      label: 'Severe Bleeding',
      icon: 'fa-droplet'
    }, {
      id: 'seizures',
      label: 'Seizures & Tremors',
      icon: 'fa-bolt'
    }, {
      id: 'heatstroke',
      label: 'Heatstroke (>104°F)',
      icon: 'fa-temperature-high'
    }, {
      id: 'poison',
      label: 'Toxins & Chemicals',
      icon: 'fa-skull-crossbones'
    }, {
      id: 'trauma',
      label: 'Fractures / Car Hit',
      icon: 'fa-bone'
    }].map(sym => /*#__PURE__*/React.createElement("button", {
      key: sym.id,
      className: `emergency-sym-btn ${emergencySymptom === sym.id ? 'active' : ''}`,
      onClick: () => {
        setEmergencySymptom(sym.id);
        if (window.SoundEngine) window.SoundEngine.playClicker();
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: `fa-solid ${sym.icon}`
    }), /*#__PURE__*/React.createElement("span", null, sym.label)))), /*#__PURE__*/React.createElement("div", {
      className: "emergency-protocol-card",
      style: {
        animation: 'introFadeIn 0.3s ease'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        borderBottom: '1px solid var(--border-glass)',
        paddingBottom: '16px',
        marginBottom: '18px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "protocol-icon-wrap"
    }, /*#__PURE__*/React.createElement("i", {
      className: `fa-solid ${activeProtocol.icon}`
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: '1.35rem',
        margin: 0,
        color: 'var(--text-main)'
      }
    }, activeProtocol.title), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.82rem',
        color: 'var(--text-light)'
      }
    }, /*#__PURE__*/React.createElement("strong", null, "Warning Signs:"), " ", activeProtocol.symptoms))), /*#__PURE__*/React.createElement("span", {
      className: "badge-sky",
      style: {
        background: 'rgba(244,63,94,0.15)',
        color: '#f43f5e',
        borderColor: '#f43f5e',
        fontWeight: '700'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-triangle-exclamation",
      style: {
        marginRight: '6px'
      }
    }), activeProtocol.badge)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: '24px'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
      style: {
        color: '#10b981',
        fontSize: '1.05rem',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-circle-check"
    }), " Immediate Step-by-Step Actions:"), /*#__PURE__*/React.createElement("ol", {
      className: "emergency-action-steps"
    }, activeProtocol.actions.map((act, i) => /*#__PURE__*/React.createElement("li", {
      key: i
    }, act)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "emergency-dont-box"
    }, /*#__PURE__*/React.createElement("h5", {
      style: {
        color: '#f43f5e',
        margin: '0 0 6px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-circle-xmark"
    }), " WHAT NOT TO DO:"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }
    }, activeProtocol.donts)), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-md)',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.78rem',
        color: 'var(--text-light)',
        display: 'block',
        marginBottom: '6px'
      }
    }, "Direct Triage Line for this condition:"), /*#__PURE__*/React.createElement("a", {
      href: `tel:${activeProtocol.hotline.replace(/[^0-9+]/g, '')}`,
      className: "btn-sky-primary",
      style: {
        width: '100%',
        padding: '10px',
        fontSize: '0.92rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        textDecoration: 'none'
      },
      onClick: () => {
        if (window.SoundEngine) window.SoundEngine.playAlarm();
        addToast(`Dialing ${activeProtocol.hotline}...`, 'fa-phone', 'warning');
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-phone"
    }), " Call ", activeProtocol.hotline)))))), /*#__PURE__*/React.createElement("div", {
      className: "cpr-tool-grid"
    }, /*#__PURE__*/React.createElement("div", {
      className: "cpr-metronome-card glass-panel"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "badge-sky",
      style: {
        fontSize: '0.75rem',
        marginBottom: '4px'
      }
    }, "Life Support"), /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: 0,
        fontSize: '1.25rem'
      }
    }, "Pet CPR Rhythm Metronome")), /*#__PURE__*/React.createElement("button", {
      className: `cpr-toggle-btn ${cprMetronomeActive ? 'active' : ''}`,
      onClick: () => {
        setCprMetronomeActive(!cprMetronomeActive);
        if (!cprMetronomeActive && window.SoundEngine) window.SoundEngine.playChime();
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: `fa-solid ${cprMetronomeActive ? 'fa-pause' : 'fa-play'}`
    }), /*#__PURE__*/React.createElement("span", null, cprMetronomeActive ? 'Stop Metronome' : 'Start 110 BPM Metronome'))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '18px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-glass)',
        marginBottom: '16px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: `cpr-heart-pulse-wrap ${cprMetronomeActive ? 'pulsing' : ''}`
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-heart-pulse"
    }), cprMetronomeActive && /*#__PURE__*/React.createElement("span", {
      className: "cpr-beat-counter"
    }, cprBeat)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: '700',
        color: 'var(--text-main)',
        fontSize: '0.95rem'
      }
    }, cprMetronomeActive ? `Compression Count: ${cprBeat} / 30` : 'Target: 100 - 120 Compressions / Minute'), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.82rem',
        color: 'var(--text-light)',
        marginTop: '4px'
      }
    }, "Give ", /*#__PURE__*/React.createElement("strong", null, "30 fast chest compressions"), " followed by ", /*#__PURE__*/React.createElement("strong", null, "2 rescue breaths"), " into pet's nostrils."))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        fontSize: '0.82rem'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 12px',
        background: 'var(--bg-glass)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-glass)'
      }
    }, /*#__PURE__*/React.createElement("strong", {
      style: {
        color: 'var(--primary-600)',
        display: 'block'
      }
    }, "Small Dogs & Cats (< 15 kg)"), /*#__PURE__*/React.createElement("span", null, "Compress side of chest with one hand or wrap two hands around ribcage. Compress 1/3 to 1/2 chest depth.")), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 12px',
        background: 'var(--bg-glass)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-glass)'
      }
    }, /*#__PURE__*/React.createElement("strong", {
      style: {
        color: '#8b5cf6',
        display: 'block'
      }
    }, "Medium & Large Dogs (> 15 kg)"), /*#__PURE__*/React.createElement("span", null, "Lay dog on right side. Place hands locked over widest part of ribcage. Press with straight locked elbows.")))), /*#__PURE__*/React.createElement("div", {
      className: "emergency-kit-card glass-panel"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '14px'
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: 0,
        fontSize: '1.2rem'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-briefcase-medical",
      style: {
        color: '#10b981',
        marginRight: '8px'
      }
    }), " Pet First-Aid Kit Checklist"), /*#__PURE__*/React.createElement("button", {
      className: "btn-sky-outline",
      style: {
        padding: '4px 10px',
        fontSize: '0.75rem'
      },
      onClick: () => window.print()
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-print"
    }), " Print")), /*#__PURE__*/React.createElement("div", {
      className: "kit-checklist-grid"
    }, [{
      item: 'Sterile Gauze Pads & Vetrap Bandage',
      checked: true
    }, {
      item: 'Digital Rectal Thermometer & Lube',
      checked: true
    }, {
      item: 'Styptic Powder (Nail Bleeding)',
      checked: true
    }, {
      item: 'Sterile Saline Solution (Eye Wash)',
      checked: true
    }, {
      item: 'Tick Twister & Blunt Tweezers',
      checked: true
    }, {
      item: 'Soft Muzzle & Foil Thermal Blanket',
      checked: true
    }].map((it, idx) => /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: "kit-check-row"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-circle-check",
      style: {
        color: '#10b981',
        marginRight: '8px'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.84rem',
        color: 'var(--text-muted)'
      }
    }, it.item)))))), /*#__PURE__*/React.createElement("section", {
      className: "glass-panel",
      style: {
        padding: '30px',
        borderRadius: 'var(--radius-xl)',
        border: '1.5px solid var(--border-glow)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '20px'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: '1.4rem',
        margin: 0,
        fontFamily: 'var(--font-heading)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-address-book",
      style: {
        color: 'var(--primary-500)',
        marginRight: '8px'
      }
    }), "24/7 Verified Emergency Hotline Directory"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.84rem',
        color: 'var(--text-light)'
      }
    }, "Direct telephone lines connect instantly to on-call toxicologists & surgical trauma units")), /*#__PURE__*/React.createElement("span", {
      className: "badge-sky",
      style: {
        background: 'rgba(16, 185, 129, 0.12)',
        color: '#10b981',
        borderColor: '#10b981'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-shield-check",
      style: {
        marginRight: '6px'
      }
    }), " Verified Active Lines")), /*#__PURE__*/React.createElement("div", {
      className: "emergency-table-container"
    }, /*#__PURE__*/React.createElement("table", {
      className: "emergency-table"
    }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Emergency Center / Facility"), /*#__PURE__*/React.createElement("th", null, "Direct Telephone Line"), /*#__PURE__*/React.createElement("th", null, "Coverage"), /*#__PURE__*/React.createElement("th", null, "Emergency Specialty"), /*#__PURE__*/React.createElement("th", {
      style: {
        textAlign: 'right'
      }
    }, "Real Direct Call & Action"))), /*#__PURE__*/React.createElement("tbody", null, content && content.emergencyHelplines && content.emergencyHelplines.map((item, idx) => {
      const cleanTel = item.phone.replace(/[^0-9+]/g, '');
      return /*#__PURE__*/React.createElement("tr", {
        key: idx
      }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("strong", null, item.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: '0.74rem',
          color: 'var(--text-light)'
        }
      }, "National Animal Safety Registry")), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("a", {
        href: `tel:${cleanTel}`,
        className: "emergency-table-phone-link",
        onClick: () => {
          if (window.SoundEngine) window.SoundEngine.playAlarm();
          addToast(`Connecting real phone call to ${item.phone}...`, 'fa-phone', 'warning');
        }
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-phone",
        style: {
          marginRight: '6px'
        }
      }), item.phone)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
        className: "badge-sky",
        style: {
          fontSize: '0.74rem'
        }
      }, item.availability)), /*#__PURE__*/React.createElement("td", {
        style: {
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }
      }, item.type), /*#__PURE__*/React.createElement("td", {
        style: {
          textAlign: 'right'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'inline-flex',
          gap: '8px',
          justifyContent: 'flex-end'
        }
      }, /*#__PURE__*/React.createElement("a", {
        href: `tel:${cleanTel}`,
        className: "btn-sky-primary",
        style: {
          padding: '8px 16px',
          fontSize: '0.82rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          textDecoration: 'none'
        },
        onClick: () => {
          if (window.SoundEngine) window.SoundEngine.playAlarm();
          addToast(`Connecting phone call to ${item.phone}...`, 'fa-phone', 'warning');
        },
        title: "Tap to Call Immediately"
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-phone"
      }), " Call Now"), /*#__PURE__*/React.createElement("a", {
        href: `https://wa.me/923001234567?text=EMERGENCY:%20I%20am%20calling%20about%20${encodeURIComponent(item.name)}%20for%20my%20pet.`,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "btn-icon",
        style: {
          background: 'rgba(37, 211, 102, 0.15)',
          color: '#25d366',
          border: '1px solid rgba(37, 211, 102, 0.3)',
          width: '34px',
          height: '34px'
        },
        title: "WhatsApp Triage (+92 300 1234567)"
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-brands fa-whatsapp"
      })))));
    }))))), /*#__PURE__*/React.createElement("section", {
      className: "glass-panel",
      style: {
        padding: '32px',
        borderRadius: 'var(--radius-xl)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: '1.4rem',
        margin: 0,
        fontFamily: 'var(--font-heading)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-skull-crossbones",
      style: {
        color: '#f43f5e',
        marginRight: '8px'
      }
    }), "Household Toxins & Poison Reference Database"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.84rem',
        color: 'var(--text-light)'
      }
    }, "Search dangerous human foods, poisonous plants, and hazardous medications")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: '280px'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-magnifying-glass",
      style: {
        position: 'absolute',
        left: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-light)'
      }
    }), /*#__PURE__*/React.createElement("input", {
      type: "text",
      className: "input-sky",
      placeholder: "Search chocolate, lilies, xylitol...",
      value: emergencyToxinSearch,
      onChange: e => setEmergencyToxinSearch(e.target.value),
      style: {
        paddingLeft: '34px',
        fontSize: '0.85rem'
      }
    }))), /*#__PURE__*/React.createElement("div", {
      className: "emergency-toxins-grid"
    }, filteredToxins.map((tox, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "toxin-card glass-card-hover"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '8px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: "product-category-lbl",
      style: {
        margin: 0
      }
    }, tox.category), /*#__PURE__*/React.createElement("span", {
      className: "badge-sky",
      style: {
        background: tox.severity === 'Fatal' ? 'rgba(225,29,72,0.15)' : 'rgba(245,158,11,0.15)',
        color: tox.severity === 'Fatal' ? '#e11d48' : '#f59e0b',
        borderColor: tox.severity === 'Fatal' ? '#e11d48' : '#f59e0b',
        fontSize: '0.72rem',
        fontWeight: '700'
      }
    }, tox.severity, " Severity")), /*#__PURE__*/React.createElement("h4", {
      style: {
        fontSize: '1.05rem',
        margin: '4px 0 6px',
        color: 'var(--text-main)'
      }
    }, tox.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.82rem',
        color: '#f59e0b',
        fontWeight: '600',
        marginBottom: '6px'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-triangle-exclamation",
      style: {
        marginRight: '5px'
      }
    }), " Risk: ", tox.danger), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.78rem',
        color: 'var(--text-light)',
        marginBottom: '8px'
      }
    }, /*#__PURE__*/React.createElement("strong", null, "Common In:"), " ", tox.items), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.78rem',
        color: '#10b981',
        background: 'var(--bg-surface)',
        padding: '6px 10px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-glass)',
        marginTop: 'auto'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-syringe",
      style: {
        marginRight: '5px'
      }
    }), " ", /*#__PURE__*/React.createElement("strong", null, "Antidote Action:"), " ", tox.antidote))))));
  })(), activeTab === 'feedback' && (() => {
    const feedbackCategories = ['All', 'Pet Adoption', 'Veterinary Care', 'Pet Products', 'Pet Care', 'Community', 'Website'];
    const formCategoryOptions = ['Pet Adoption', 'Veterinary Care', 'Pet Products', 'Pet Care Resources', 'Community', 'Events', 'Website Experience', 'Other'];
    const filteredReviews = feedbackCategoryFilter === 'All' ? reviews : reviews.filter(r => r.category.toLowerCase().includes(feedbackCategoryFilter.toLowerCase()));
    const handleFeedbackSubmit = e => {
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
        date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }),
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
    const handleToggleHelpful = revId => {
      setHelpfulReviews(prev => {
        const current = !!prev[revId];
        const updated = {
          ...prev,
          [revId]: !current
        };
        if (!current && window.SoundEngine) window.SoundEngine.playClicker();
        return updated;
      });
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "feedback-page-wrapper"
    }, /*#__PURE__*/React.createElement("section", {
      className: "feedback-intro-section glass-panel"
    }, /*#__PURE__*/React.createElement("div", {
      className: "feedback-intro-content"
    }, /*#__PURE__*/React.createElement("span", {
      className: "badge-sky",
      style: {
        marginBottom: '12px',
        display: 'inline-block'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-comment-dots",
      style: {
        marginRight: '6px'
      }
    }), " Voice of Pet Parents"), /*#__PURE__*/React.createElement("h1", {
      className: "feedback-main-heading"
    }, "Your Feedback ", /*#__PURE__*/React.createElement("span", {
      className: "gradient-text"
    }, "Matters to Us")), /*#__PURE__*/React.createElement("p", {
      className: "feedback-intro-text"
    }, "Your experience helps us improve Forever Care Pets and create a better experience for pets and their families. Every suggestion directly shapes our veterinary, adoption, and product services."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: '14px',
        flexWrap: 'wrap',
        marginTop: '22px'
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn-sky-primary",
      onClick: () => {
        const el = document.getElementById('feedback-form-section');
        if (el) el.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-pen-to-square",
      style: {
        marginRight: '8px'
      }
    }), " Share Your Feedback"), /*#__PURE__*/React.createElement("button", {
      className: "btn-sky-outline",
      onClick: () => {
        const el = document.getElementById('reviews-stream-section');
        if (el) el.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-star",
      style: {
        marginRight: '8px'
      }
    }), " View Pet Parent Reviews"))), /*#__PURE__*/React.createElement("div", {
      className: "feedback-intro-img-wrap"
    }, /*#__PURE__*/React.createElement("img", {
      src: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=700&q=80",
      alt: "Pet parent with loving cat",
      className: "feedback-intro-img"
    }), /*#__PURE__*/React.createElement("div", {
      className: "feedback-badge-floating"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-medal",
      style: {
        color: '#f59e0b'
      }
    }), /*#__PURE__*/React.createElement("span", null, "Top Rated Pet Platform \u2022 4.8 / 5")))), /*#__PURE__*/React.createElement("div", {
      className: "feedback-stats-rating-row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rating-summary-card glass-panel"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "badge-sky",
      style: {
        fontSize: '0.75rem',
        marginBottom: '6px'
      }
    }, "Verified Rating"), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: '1.25rem',
        margin: 0
      }
    }, "Overall Experience")), /*#__PURE__*/React.createElement("div", {
      className: "rating-badge-lg"
    }, "4.8")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        color: '#f59e0b',
        fontSize: '1.4rem',
        display: 'flex',
        gap: '4px'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-star"
    }), /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-star"
    }), /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-star"
    }), /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-star"
    }), /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-star-half-stroke"
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: '700',
        fontSize: '1.05rem',
        color: 'var(--text-main)'
      }
    }, "4.8 out of 5")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.82rem',
        color: 'var(--text-light)',
        marginBottom: '20px'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-circle-check",
      style: {
        color: '#10b981',
        marginRight: '5px'
      }
    }), " Based on 250+ verified community reviews"), /*#__PURE__*/React.createElement("div", {
      className: "rating-bars-list"
    }, [{
      stars: '5 Stars',
      pct: 85,
      count: '215'
    }, {
      stars: '4 Stars',
      pct: 10,
      count: '26'
    }, {
      stars: '3 Stars',
      pct: 3,
      count: '7'
    }, {
      stars: '2 Stars',
      pct: 1,
      count: '2'
    }, {
      stars: '1 Star',
      pct: 1,
      count: '2'
    }].map((item, idx) => /*#__PURE__*/React.createElement("div", {
      key: idx,
      className: "rating-bar-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "rating-bar-label"
    }, item.stars), /*#__PURE__*/React.createElement("div", {
      className: "rating-bar-track"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rating-bar-fill",
      style: {
        width: `${item.pct}%`
      }
    })), /*#__PURE__*/React.createElement("span", {
      className: "rating-bar-pct"
    }, item.pct, "%"))))), /*#__PURE__*/React.createElement("div", {
      className: "feedback-stats-quad"
    }, /*#__PURE__*/React.createElement("div", {
      className: "feedback-stat-card glass-panel glass-card-hover"
    }, /*#__PURE__*/React.createElement("div", {
      className: "feedback-stat-icon-wrap",
      style: {
        background: 'rgba(14, 165, 233, 0.12)',
        color: 'var(--primary-600)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-users"
    })), /*#__PURE__*/React.createElement("div", {
      className: "feedback-stat-num"
    }, "250+"), /*#__PURE__*/React.createElement("div", {
      className: "feedback-stat-lbl"
    }, "Happy Pet Parents")), /*#__PURE__*/React.createElement("div", {
      className: "feedback-stat-card glass-panel glass-card-hover"
    }, /*#__PURE__*/React.createElement("div", {
      className: "feedback-stat-icon-wrap",
      style: {
        background: 'rgba(245, 158, 11, 0.12)',
        color: '#f59e0b'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-star"
    })), /*#__PURE__*/React.createElement("div", {
      className: "feedback-stat-num"
    }, "4.8/5"), /*#__PURE__*/React.createElement("div", {
      className: "feedback-stat-lbl"
    }, "Average Rating")), /*#__PURE__*/React.createElement("div", {
      className: "feedback-stat-card glass-panel glass-card-hover"
    }, /*#__PURE__*/React.createElement("div", {
      className: "feedback-stat-icon-wrap",
      style: {
        background: 'rgba(16, 185, 129, 0.12)',
        color: '#10b981'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-thumbs-up"
    })), /*#__PURE__*/React.createElement("div", {
      className: "feedback-stat-num"
    }, "95%"), /*#__PURE__*/React.createElement("div", {
      className: "feedback-stat-lbl"
    }, "Would Recommend Us")), /*#__PURE__*/React.createElement("div", {
      className: "feedback-stat-card glass-panel glass-card-hover"
    }, /*#__PURE__*/React.createElement("div", {
      className: "feedback-stat-icon-wrap",
      style: {
        background: 'rgba(139, 92, 246, 0.12)',
        color: '#8b5cf6'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-paw"
    })), /*#__PURE__*/React.createElement("div", {
      className: "feedback-stat-num"
    }, "500+"), /*#__PURE__*/React.createElement("div", {
      className: "feedback-stat-lbl"
    }, "Pets Helped")))), /*#__PURE__*/React.createElement("section", {
      id: "feedback-form-section",
      className: "feedback-form-container glass-panel"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        marginBottom: '20px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "btn-icon",
      style: {
        background: 'rgba(14, 165, 233, 0.15)',
        color: 'var(--primary-600)',
        width: '48px',
        height: '48px',
        fontSize: '1.3rem'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-pen-nib"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: '1.6rem',
        margin: 0,
        fontFamily: 'var(--font-heading)'
      }
    }, "Share Your ", /*#__PURE__*/React.createElement("span", {
      className: "gradient-text"
    }, "Feedback")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.88rem',
        color: 'var(--text-light)'
      }
    }, "Tell us about your experience with our adoption, clinical care, or platform features"))), feedbackSubmitted ? /*#__PURE__*/React.createElement("div", {
      className: "feedback-thankyou-box",
      style: {
        animation: 'introFadeIn 0.4s ease'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "feedback-thankyou-icon"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-circle-check"
    })), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: '1.5rem',
        marginBottom: '8px',
        color: '#047857'
      }
    }, "Thank you for your feedback!"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'var(--text-muted)',
        fontSize: '0.96rem',
        maxWidth: '500px',
        margin: '0 auto 20px'
      }
    }, "Your feedback has been submitted successfully and added to our verified community stream."), /*#__PURE__*/React.createElement("button", {
      className: "btn-sky-primary",
      onClick: () => setFeedbackSubmitted(false),
      style: {
        padding: '10px 24px',
        fontSize: '0.9rem'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-plus",
      style: {
        marginRight: '8px'
      }
    }), " Submit Another Review")) : /*#__PURE__*/React.createElement("form", {
      onSubmit: handleFeedbackSubmit,
      noValidate: true
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '18px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "form-group-custom"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label-custom"
    }, "Full Name *"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "text",
      id: "feedback-name-input",
      className: "input-sky",
      placeholder: "e.g. Sarah Connor",
      value: feedbackFormData.fullName,
      onChange: e => setFeedbackFormData({
        ...feedbackFormData,
        fullName: e.target.value
      })
    }))), /*#__PURE__*/React.createElement("div", {
      className: "form-group-custom"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label-custom"
    }, "Email Address *"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("input", {
      type: "email",
      id: "feedback-email-input",
      className: "input-sky",
      placeholder: "name@example.com",
      value: feedbackFormData.email,
      onChange: e => setFeedbackFormData({
        ...feedbackFormData,
        email: e.target.value
      })
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '18px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "form-group-custom"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label-custom"
    }, "Feedback Category *"), /*#__PURE__*/React.createElement("select", {
      className: "input-sky",
      value: feedbackFormData.category,
      onChange: e => setFeedbackFormData({
        ...feedbackFormData,
        category: e.target.value
      })
    }, formCategoryOptions.map(cat => /*#__PURE__*/React.createElement("option", {
      key: cat,
      value: cat
    }, cat)))), /*#__PURE__*/React.createElement("div", {
      className: "form-group-custom"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label-custom"
    }, "Star Rating *"), /*#__PURE__*/React.createElement("div", {
      className: "interactive-star-picker"
    }, [1, 2, 3, 4, 5].map(star => {
      const isFilled = (feedbackHoverRating || feedbackFormData.rating) >= star;
      return /*#__PURE__*/React.createElement("button", {
        key: star,
        type: "button",
        className: "star-picker-btn",
        onMouseEnter: () => setFeedbackHoverRating(star),
        onMouseLeave: () => setFeedbackHoverRating(0),
        onClick: () => {
          setFeedbackFormData({
            ...feedbackFormData,
            rating: star
          });
          if (window.SoundEngine) window.SoundEngine.playClicker();
        },
        title: `Rate ${star} Stars`
      }, /*#__PURE__*/React.createElement("i", {
        className: `fa-${isFilled ? 'solid' : 'regular'} fa-star`,
        style: {
          color: isFilled ? '#f59e0b' : 'var(--text-light)'
        }
      }));
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.88rem',
        fontWeight: '700',
        color: 'var(--text-main)',
        marginLeft: '8px'
      }
    }, feedbackHoverRating || feedbackFormData.rating, " / 5 Stars")))), /*#__PURE__*/React.createElement("div", {
      className: "form-group-custom"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label-custom"
    }, "Your Feedback & Experience *"), /*#__PURE__*/React.createElement("textarea", {
      id: "feedback-msg-input",
      className: "input-sky",
      rows: "4",
      placeholder: "Tell us what you loved about Forever Care Pets, or how we can make our services even better for your pet...",
      value: feedbackFormData.feedback,
      onChange: e => setFeedbackFormData({
        ...feedbackFormData,
        feedback: e.target.value
      })
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '18px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "form-group-custom"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label-custom"
    }, "Pet Name (Optional)"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      className: "input-sky",
      placeholder: "e.g. Milo (Golden Retriever)",
      value: feedbackFormData.petName,
      onChange: e => setFeedbackFormData({
        ...feedbackFormData,
        petName: e.target.value
      })
    })), /*#__PURE__*/React.createElement("div", {
      className: "form-group-custom"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label-custom"
    }, "Pet Image URL (Optional)"), /*#__PURE__*/React.createElement("input", {
      type: "url",
      className: "input-sky",
      placeholder: "Paste pet photo link",
      value: feedbackFormData.petImage,
      onChange: e => setFeedbackFormData({
        ...feedbackFormData,
        petImage: e.target.value
      })
    }))), /*#__PURE__*/React.createElement("button", {
      type: "submit",
      className: "btn-sky-primary",
      style: {
        width: '100%',
        padding: '14px',
        fontSize: '1.02rem',
        marginTop: '6px'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-paper-plane",
      style: {
        marginRight: '8px'
      }
    }), " Submit Feedback"))), /*#__PURE__*/React.createElement("section", {
      id: "reviews-stream-section",
      className: "feedback-reviews-section"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      className: "badge-sky",
      style: {
        marginBottom: '6px'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-comments",
      style: {
        marginRight: '6px'
      }
    }), " Verified Stories"), /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: '1.65rem',
        margin: 0,
        fontFamily: 'var(--font-heading)'
      }
    }, "What Our Pet ", /*#__PURE__*/React.createElement("span", {
      className: "gradient-text"
    }, "Parents Say"))), /*#__PURE__*/React.createElement("div", {
      className: "category-filter-chips"
    }, feedbackCategories.map(cat => /*#__PURE__*/React.createElement("button", {
      key: cat,
      className: `filter-chip ${feedbackCategoryFilter === cat ? 'active' : ''}`,
      onClick: () => {
        setFeedbackCategoryFilter(cat);
        if (window.SoundEngine) window.SoundEngine.playClicker();
      }
    }, cat === 'All' ? '🌟 All Reviews' : cat)))), /*#__PURE__*/React.createElement("div", {
      className: "feedback-reviews-grid"
    }, filteredReviews.map(rev => {
      const isHelpful = !!helpfulReviews[rev.id];
      const totalHelpful = isHelpful ? rev.helpfulCount + 1 : rev.helpfulCount;
      return /*#__PURE__*/React.createElement("div", {
        key: rev.id,
        className: "review-card glass-panel glass-card-hover"
      }, /*#__PURE__*/React.createElement("div", {
        className: "review-card-header"
      }, /*#__PURE__*/React.createElement("img", {
        src: rev.userAvatar,
        alt: rev.userName,
        className: "review-user-avatar"
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "review-user-name"
      }, rev.userName), /*#__PURE__*/React.createElement("div", {
        className: "review-date-line"
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-calendar-day",
        style: {
          color: 'var(--text-light)',
          marginRight: '4px'
        }
      }), rev.date)), /*#__PURE__*/React.createElement("span", {
        className: "badge-sky",
        style: {
          fontSize: '0.74rem'
        }
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-tag",
        style: {
          marginRight: '4px'
        }
      }), " ", rev.category)), /*#__PURE__*/React.createElement("div", {
        className: "review-stars-row"
      }, [1, 2, 3, 4, 5].map(st => /*#__PURE__*/React.createElement("i", {
        key: st,
        className: `fa-${st <= rev.rating ? 'solid' : 'regular'} fa-star`,
        style: {
          color: st <= rev.rating ? '#f59e0b' : 'var(--text-light)',
          fontSize: '0.95rem'
        }
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: '0.82rem',
          fontWeight: '700',
          color: 'var(--text-main)',
          marginLeft: '6px'
        }
      }, rev.rating, ".0 / 5.0")), /*#__PURE__*/React.createElement("p", {
        className: "review-text-body"
      }, "\"", rev.review, "\""), rev.petName && /*#__PURE__*/React.createElement("div", {
        className: "review-pet-pill"
      }, rev.petImage && /*#__PURE__*/React.createElement("img", {
        src: rev.petImage,
        alt: rev.petName,
        className: "review-pet-thumb"
      }), /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-paw",
        style: {
          color: 'var(--primary-500)',
          marginRight: '6px'
        }
      }), /*#__PURE__*/React.createElement("span", null, "Pet: ", /*#__PURE__*/React.createElement("strong", null, rev.petName))), /*#__PURE__*/React.createElement("div", {
        className: "review-card-footer"
      }, /*#__PURE__*/React.createElement("button", {
        className: `review-helpful-btn ${isHelpful ? 'active' : ''}`,
        onClick: () => handleToggleHelpful(rev.id)
      }, /*#__PURE__*/React.createElement("i", {
        className: `fa-${isHelpful ? 'solid' : 'regular'} fa-thumbs-up`
      }), /*#__PURE__*/React.createElement("span", null, "Helpful (", totalHelpful, ")")), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: '0.75rem',
          color: '#10b981',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-shield-check"
      }), " Verified Pet Parent")));
    }))), /*#__PURE__*/React.createElement("section", {
      className: "improving-section glass-panel"
    }, /*#__PURE__*/React.createElement("div", {
      className: "improving-content"
    }, /*#__PURE__*/React.createElement("span", {
      className: "badge-sky",
      style: {
        marginBottom: '12px',
        display: 'inline-block'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-arrow-trend-up",
      style: {
        marginRight: '6px'
      }
    }), " Continuous Excellence"), /*#__PURE__*/React.createElement("h2", {
      className: "improving-heading"
    }, "We\u2019re Always ", /*#__PURE__*/React.createElement("span", {
      className: "gradient-text"
    }, "Improving")), /*#__PURE__*/React.createElement("p", {
      className: "improving-text"
    }, "Every piece of feedback helps us make Forever Care Pets better. We listen to your suggestions and continuously work to improve our services and your experience. From mobile UI enhancements to wider shelter integrations, your voice drives every release."), /*#__PURE__*/React.createElement("div", {
      className: "improving-features-list"
    }, /*#__PURE__*/React.createElement("div", {
      className: "improving-feature-item"
    }, /*#__PURE__*/React.createElement("div", {
      className: "improving-icon"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-bolt"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Rapid Veterinary Booking"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }
    }, "Reduced scheduling time by 60% based on user requests"))), /*#__PURE__*/React.createElement("div", {
      className: "improving-feature-item"
    }, /*#__PURE__*/React.createElement("div", {
      className: "improving-icon"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-shield-heart"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Pet-Safe Packaging"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }
    }, "100% recyclable, tamper-evident product deliveries"))))), /*#__PURE__*/React.createElement("div", {
      className: "improving-img-wrap"
    }, /*#__PURE__*/React.createElement("img", {
      src: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=700&q=80",
      alt: "Happy healthy dog",
      className: "improving-img"
    }))), /*#__PURE__*/React.createElement("section", {
      className: "feedback-cta-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "about-cta-paw-bg"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-paw about-cta-paw-1"
    }), /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-paw about-cta-paw-2"
    }), /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-paw about-cta-paw-3"
    })), /*#__PURE__*/React.createElement("div", {
      className: "about-cta-content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "about-cta-badge"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-heart",
      style: {
        color: '#f43f5e',
        marginRight: '8px'
      }
    }), "Your Voice Matters"), /*#__PURE__*/React.createElement("h2", {
      className: "about-cta-heading"
    }, "Have Something to ", /*#__PURE__*/React.createElement("span", {
      className: "gradient-text"
    }, "Share?")), /*#__PURE__*/React.createElement("p", {
      className: "about-cta-sub"
    }, "Your experience can help another pet parent make the right choice. Share your thoughts today!"), /*#__PURE__*/React.createElement("button", {
      className: "btn-sky-primary",
      style: {
        padding: '14px 34px',
        fontSize: '1.05rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px'
      },
      onClick: () => {
        const el = document.getElementById('feedback-form-section');
        if (el) el.scrollIntoView({
          behavior: 'smooth'
        });
        if (window.SoundEngine) window.SoundEngine.playClicker();
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-arrow-up"
    }), " Give Your Feedback"))));
  })(), activeTab === 'community' && (() => {
    const categories = ['All', 'Pet Care', 'Adoption', 'Pet Stories', 'Health', 'Tips & Advice', 'Events'];
    const filteredPosts = communityCategory === 'All' ? communityPosts : communityPosts.filter(p => p.category.toLowerCase() === communityCategory.toLowerCase());
    const handlePublishPost = e => {
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
        petImage: newPostForm.petImage && newPostForm.petImage.trim() || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
        likes: 1,
        commentsCount: 0,
        comments: []
      };
      setCommunityPosts(prev => [created, ...prev]);
      setNewPostForm({
        name: '',
        title: '',
        category: 'Pet Stories',
        content: '',
        petImage: ''
      });
      setPostSuccessBanner(true);
      setTimeout(() => setPostSuccessBanner(false), 5000);
      if (window.SoundEngine) window.SoundEngine.playChime();
      addToast('Your story has been shared with the community! 🐾', 'fa-circle-check');
    };
    const handleToggleLike = postId => {
      setLikedPosts(prev => {
        const current = !!prev[postId];
        const updated = {
          ...prev,
          [postId]: !current
        };
        if (!current && window.SoundEngine) window.SoundEngine.playHeart();
        return updated;
      });
    };
    const handleAddComment = postId => {
      if (!newCommentText.trim()) return;
      setCommunityPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const updatedComments = [...(p.comments || []), {
            id: `c-${Date.now()}`,
            user: user.firstName || 'Pet Parent',
            text: newCommentText.trim()
          }];
          return {
            ...p,
            comments: updatedComments,
            commentsCount: updatedComments.length
          };
        }
        return p;
      }));
      setNewCommentText('');
      if (window.SoundEngine) window.SoundEngine.playClicker();
      addToast('Comment posted! 💬', 'fa-comment');
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "community-page-wrapper"
    }, /*#__PURE__*/React.createElement("section", {
      className: "community-intro-section glass-panel"
    }, /*#__PURE__*/React.createElement("div", {
      className: "community-intro-content"
    }, /*#__PURE__*/React.createElement("span", {
      className: "badge-sky",
      style: {
        marginBottom: '12px',
        display: 'inline-block'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-users",
      style: {
        marginRight: '6px'
      }
    }), " Pet Lovers Network"), /*#__PURE__*/React.createElement("h1", {
      className: "community-main-heading"
    }, "Forever Care ", /*#__PURE__*/React.createElement("span", {
      className: "gradient-text"
    }, "Community \uD83D\uDC3E")), /*#__PURE__*/React.createElement("p", {
      className: "community-intro-text"
    }, "Connect with fellow pet lovers, share your experiences, discover helpful tips, and make a difference in the lives of pets."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap',
        marginTop: '20px'
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn-sky-primary",
      onClick: () => {
        const el = document.getElementById('share-story-section');
        if (el) el.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-pen-nib",
      style: {
        marginRight: '8px'
      }
    }), " Join Our Community & Share"), /*#__PURE__*/React.createElement("button", {
      className: "btn-sky-outline",
      onClick: () => {
        const el = document.getElementById('faq-section');
        if (el) el.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-circle-question",
      style: {
        marginRight: '8px'
      }
    }), " Platform FAQs"))), /*#__PURE__*/React.createElement("div", {
      className: "community-intro-img-wrap"
    }, /*#__PURE__*/React.createElement("img", {
      src: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=700&q=80",
      alt: "Happy pets and owners",
      className: "community-intro-img"
    }), /*#__PURE__*/React.createElement("div", {
      className: "community-stat-float-pill"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-heart",
      style: {
        color: '#f43f5e'
      }
    }), /*#__PURE__*/React.createElement("span", null, "2.4k+ Community Members")))), /*#__PURE__*/React.createElement("div", {
      className: "community-categories-bar glass-panel"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: '700',
        fontSize: '0.92rem',
        color: 'var(--text-main)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-filter",
      style: {
        color: 'var(--primary-500)'
      }
    }), " Explore Topics:"), /*#__PURE__*/React.createElement("div", {
      className: "category-filter-chips"
    }, categories.map(cat => /*#__PURE__*/React.createElement("button", {
      key: cat,
      className: `filter-chip ${communityCategory === cat ? 'active' : ''}`,
      onClick: () => {
        setCommunityCategory(cat);
        if (window.SoundEngine) window.SoundEngine.playClicker();
      }
    }, cat === 'All' ? '🌟 All Posts' : cat)))), postSuccessBanner && /*#__PURE__*/React.createElement("div", {
      className: "post-success-banner",
      style: {
        animation: 'slideInRight 0.4s ease'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-circle-check",
      style: {
        fontSize: '1.4rem'
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Your post has been shared with the community! \uD83D\uDC3E"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.84rem',
        opacity: 0.9
      }
    }, "Thank you for inspiring pet parents worldwide."))), /*#__PURE__*/React.createElement("div", {
      className: "community-grid-layout"
    }, /*#__PURE__*/React.createElement("div", {
      className: "community-posts-stream"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }
    }, /*#__PURE__*/React.createElement("h2", {
      style: {
        fontSize: '1.5rem',
        fontFamily: 'var(--font-heading)',
        margin: 0
      }
    }, "Latest Community ", /*#__PURE__*/React.createElement("span", {
      className: "gradient-text"
    }, "Posts")), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }
    }, "Showing ", filteredPosts.length, " discussions")), filteredPosts.length === 0 ? /*#__PURE__*/React.createElement("div", {
      className: "glass-panel",
      style: {
        padding: '40px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-comments",
      style: {
        fontSize: '3rem',
        color: 'var(--primary-300)',
        marginBottom: '14px'
      }
    }), /*#__PURE__*/React.createElement("h3", null, "No posts found in \"", communityCategory, "\""), /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'var(--text-muted)',
        fontSize: '0.9rem'
      }
    }, "Be the first pet parent to share a story in this category!")) : filteredPosts.map(post => {
      const isLiked = !!likedPosts[post.id];
      const totalLikes = isLiked ? post.likes + 1 : post.likes;
      const isCommentsOpen = activeCommentPostId === post.id;
      return /*#__PURE__*/React.createElement("article", {
        key: post.id,
        className: "community-post-card glass-card-hover"
      }, /*#__PURE__*/React.createElement("div", {
        className: "post-author-row"
      }, /*#__PURE__*/React.createElement("img", {
        src: post.userAvatar,
        alt: post.userName,
        className: "post-author-avatar"
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: '700',
          fontSize: '0.98rem',
          color: 'var(--text-main)'
        }
      }, post.userName), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: '0.78rem',
          color: 'var(--text-light)'
        }
      }, post.date)), /*#__PURE__*/React.createElement("span", {
        className: "badge-sky",
        style: {
          fontSize: '0.78rem'
        }
      }, post.category)), /*#__PURE__*/React.createElement("h3", {
        className: "post-title"
      }, post.title), /*#__PURE__*/React.createElement("p", {
        className: "post-body"
      }, post.content), post.petImage && /*#__PURE__*/React.createElement("div", {
        className: "post-image-wrap"
      }, /*#__PURE__*/React.createElement("img", {
        src: post.petImage,
        alt: post.title,
        className: "post-pet-img"
      })), /*#__PURE__*/React.createElement("div", {
        className: "post-actions-bar"
      }, /*#__PURE__*/React.createElement("button", {
        className: `post-action-btn ${isLiked ? 'liked' : ''}`,
        onClick: () => handleToggleLike(post.id)
      }, /*#__PURE__*/React.createElement("i", {
        className: `fa-${isLiked ? 'solid' : 'regular'} fa-heart`,
        style: {
          color: isLiked ? '#f43f5e' : 'inherit'
        }
      }), /*#__PURE__*/React.createElement("span", null, totalLikes, " Likes")), /*#__PURE__*/React.createElement("button", {
        className: `post-action-btn ${isCommentsOpen ? 'active' : ''}`,
        onClick: () => setActiveCommentPostId(isCommentsOpen ? null : post.id)
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-regular fa-comment-dots"
      }), /*#__PURE__*/React.createElement("span", null, post.commentsCount || (post.comments ? post.comments.length : 0), " Comments")), /*#__PURE__*/React.createElement("button", {
        className: "post-action-btn",
        onClick: () => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(`${window.location.origin}#${post.id}`);
          }
          addToast(`Post link copied to clipboard! 📋`, 'fa-share-nodes');
        }
      }, /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-share-nodes"
      }), /*#__PURE__*/React.createElement("span", null, "Share"))), isCommentsOpen && /*#__PURE__*/React.createElement("div", {
        className: "post-comments-drawer"
      }, /*#__PURE__*/React.createElement("div", {
        className: "comments-list"
      }, post.comments && post.comments.length > 0 ? post.comments.map(c => /*#__PURE__*/React.createElement("div", {
        key: c.id,
        className: "comment-bubble"
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontWeight: '700',
          fontSize: '0.82rem',
          color: 'var(--primary-700)'
        }
      }, c.user), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: '0.85rem',
          color: 'var(--text-main)',
          marginTop: '2px'
        }
      }, c.text))) : /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: '0.82rem',
          color: 'var(--text-light)',
          fontStyle: 'italic',
          marginBottom: '8px'
        }
      }, "No comments yet. Start the conversation!")), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: '8px',
          marginTop: '10px'
        }
      }, /*#__PURE__*/React.createElement("input", {
        type: "text",
        className: "input-sky",
        placeholder: "Write a supportive comment...",
        style: {
          padding: '8px 12px',
          fontSize: '0.85rem'
        },
        value: newCommentText,
        onChange: e => setNewCommentText(e.target.value),
        onKeyDown: e => {
          if (e.key === 'Enter') handleAddComment(post.id);
        }
      }), /*#__PURE__*/React.createElement("button", {
        className: "btn-sky-primary",
        style: {
          padding: '8px 16px',
          fontSize: '0.85rem'
        },
        onClick: () => handleAddComment(post.id)
      }, "Post"))));
    })), /*#__PURE__*/React.createElement("div", {
      className: "community-sidebar"
    }, /*#__PURE__*/React.createElement("div", {
      id: "share-story-section",
      className: "glass-panel",
      style: {
        padding: '26px',
        marginBottom: '30px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '14px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "btn-icon",
      style: {
        background: 'rgba(14, 165, 233, 0.15)',
        color: 'var(--primary-600)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-pen-to-square"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: '1.2rem',
        margin: 0
      }
    }, "Share Your Story"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.78rem',
        color: 'var(--text-light)'
      }
    }, "Inspire thousands of pet parents"))), /*#__PURE__*/React.createElement("form", {
      onSubmit: handlePublishPost,
      noValidate: true
    }, /*#__PURE__*/React.createElement("div", {
      className: "form-group-custom"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label-custom"
    }, "Your Name"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      id: "post-name-input",
      className: "input-sky",
      placeholder: "e.g. Ayesha / Pet Parent",
      value: newPostForm.name,
      onChange: e => setNewPostForm({
        ...newPostForm,
        name: e.target.value
      })
    })), /*#__PURE__*/React.createElement("div", {
      className: "form-group-custom"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label-custom"
    }, "Post Title"), /*#__PURE__*/React.createElement("input", {
      type: "text",
      id: "post-title-input",
      className: "input-sky",
      placeholder: "e.g. My First Day With My Adopted Puppy \uD83D\uDC36",
      value: newPostForm.title,
      onChange: e => setNewPostForm({
        ...newPostForm,
        title: e.target.value
      })
    })), /*#__PURE__*/React.createElement("div", {
      className: "form-group-custom"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label-custom"
    }, "Topic Category"), /*#__PURE__*/React.createElement("select", {
      className: "input-sky",
      value: newPostForm.category,
      onChange: e => setNewPostForm({
        ...newPostForm,
        category: e.target.value
      })
    }, /*#__PURE__*/React.createElement("option", null, "Pet Stories"), /*#__PURE__*/React.createElement("option", null, "Adoption"), /*#__PURE__*/React.createElement("option", null, "Pet Care"), /*#__PURE__*/React.createElement("option", null, "Health"), /*#__PURE__*/React.createElement("option", null, "Tips & Advice"), /*#__PURE__*/React.createElement("option", null, "Events"))), /*#__PURE__*/React.createElement("div", {
      className: "form-group-custom"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label-custom"
    }, "Story / Thoughts"), /*#__PURE__*/React.createElement("textarea", {
      id: "post-content-input",
      className: "input-sky",
      rows: "4",
      placeholder: "Share your pet experience, tips or happy moments...",
      value: newPostForm.content,
      onChange: e => setNewPostForm({
        ...newPostForm,
        content: e.target.value
      })
    })), /*#__PURE__*/React.createElement("div", {
      className: "form-group-custom"
    }, /*#__PURE__*/React.createElement("label", {
      className: "form-label-custom"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-image",
      style: {
        marginRight: '6px',
        color: 'var(--primary-500)'
      }
    }), " Pet Photo (Choose File)"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap'
      }
    }, newPostForm.petImage && /*#__PURE__*/React.createElement("img", {
      src: newPostForm.petImage,
      alt: "Preview",
      style: {
        width: '56px',
        height: '56px',
        borderRadius: 'var(--radius-md)',
        objectFit: 'cover',
        border: '2px solid var(--primary-400)'
      },
      onError: e => {
        e.target.style.display = 'none';
      }
    }), /*#__PURE__*/React.createElement("input", {
      type: "file",
      accept: "image/*",
      className: "input-sky",
      style: {
        flex: 1,
        padding: '8px'
      },
      onChange: e => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
          addToast('Image size must be under 5 MB', 'fa-triangle-exclamation', 'warning');
          return;
        }
        const reader = new FileReader();
        reader.onload = ev => setNewPostForm({
          ...newPostForm,
          petImage: ev.target.result
        });
        reader.readAsDataURL(file);
      }
    })), /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: '0.73rem',
        color: 'var(--text-muted)',
        marginTop: '5px'
      }
    }, "Accepted: JPG, PNG, WEBP \u2014 Max 5 MB")), /*#__PURE__*/React.createElement("button", {
      type: "submit",
      className: "btn-sky-primary",
      style: {
        width: '100%',
        padding: '12px'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-paper-plane",
      style: {
        marginRight: '8px'
      }
    }), " Publish Post \uD83D\uDC3E"))), /*#__PURE__*/React.createElement("div", {
      className: "glass-panel",
      style: {
        padding: '24px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '18px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "btn-icon",
      style: {
        background: 'rgba(245, 158, 11, 0.15)',
        color: '#f59e0b'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-award"
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: '1.15rem',
        margin: 0
      }
    }, "Community Members"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '0.78rem',
        color: 'var(--text-light)'
      }
    }, "Active voices & advocates"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }
    }, communityMembers.map(m => /*#__PURE__*/React.createElement("div", {
      key: m.id,
      className: "member-item-row"
    }, /*#__PURE__*/React.createElement("img", {
      src: m.avatar,
      alt: m.name,
      className: "member-avatar"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: '700',
        fontSize: '0.92rem',
        color: 'var(--text-main)'
      }
    }, m.name), /*#__PURE__*/React.createElement("span", {
      className: "badge-sky",
      style: {
        fontSize: '0.68rem',
        padding: '2px 8px',
        margin: '2px 0 4px'
      }
    }, m.badge), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        lineHeight: '1.3'
      }
    }, m.bio), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '0.75rem',
        color: 'var(--text-light)',
        marginTop: '4px'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-pen-nib",
      style: {
        marginRight: '4px'
      }
    }), " ", m.postsCount, " posts")), /*#__PURE__*/React.createElement("button", {
      className: "btn-sky-outline",
      style: {
        padding: '6px 10px',
        fontSize: '0.75rem'
      },
      onClick: () => {
        addToast(`Viewing ${m.name}'s public profile`, 'fa-user');
      }
    }, "Profile"))))))), /*#__PURE__*/React.createElement("section", {
      id: "faq-section",
      className: "community-faq-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "about-section-label"
    }, /*#__PURE__*/React.createElement("span", {
      className: "badge-sky"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-circle-question",
      style: {
        marginRight: '6px'
      }
    }), " Platform Knowledge Base"), /*#__PURE__*/React.createElement("h2", {
      className: "about-section-heading",
      style: {
        textAlign: 'center',
        marginTop: '10px'
      }
    }, "Frequently Asked ", /*#__PURE__*/React.createElement("span", {
      className: "gradient-text"
    }, "Questions")), /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'var(--text-muted)',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '10px auto 0',
        fontSize: '0.97rem'
      }
    }, "Everything you need to know about adoption, veterinary care, pet store delivery, and community support.")), /*#__PURE__*/React.createElement("div", {
      className: "faq-accordion-wrap"
    }, faqs.map((faq, index) => {
      const isOpen = activeFaqIndex === index;
      return /*#__PURE__*/React.createElement("div", {
        key: index,
        className: `faq-accordion-item ${isOpen ? 'open' : ''}`
      }, /*#__PURE__*/React.createElement("button", {
        className: "faq-question-btn",
        onClick: () => {
          setActiveFaqIndex(isOpen ? null : index);
          if (window.SoundEngine) window.SoundEngine.playClicker();
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "faq-icon-pill"
      }, /*#__PURE__*/React.createElement("i", {
        className: faq.icon
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          textAlign: 'left'
        }
      }, /*#__PURE__*/React.createElement("span", {
        className: "faq-category-tag"
      }, faq.category), /*#__PURE__*/React.createElement("div", {
        className: "faq-question-text"
      }, faq.question))), /*#__PURE__*/React.createElement("i", {
        className: `fa-solid fa-chevron-${isOpen ? 'up' : 'down'} faq-chevron`
      })), isOpen && /*#__PURE__*/React.createElement("div", {
        className: "faq-answer-pane"
      }, /*#__PURE__*/React.createElement("p", null, faq.answer)));
    }))));
  })(), activeTab === 'about' && (() => {
    /* ── JSON data powering the page (Clean Professional Icons, No AI Emojis) ── */
    const offerCards = [{
      icon: 'fa-solid fa-paw',
      title: 'Pet Adoption',
      desc: 'Browse hundreds of loving pets waiting for their forever home. Our shelter network makes adoption easy, joyful and fully supported.',
      color: '#0ea5e9',
      actionTab: 'shelter',
      actionText: 'Explore Adoption'
    }, {
      icon: 'fa-solid fa-user-doctor',
      title: 'Veterinary Care',
      desc: 'Connect with certified veterinarians for consultations, health check-ups, vaccinations and emergency medical guidance anytime.',
      color: '#8b5cf6',
      actionTab: 'vet',
      actionText: 'Book Vet Doctor'
    }, {
      icon: 'fa-solid fa-bag-shopping',
      title: 'Pet Products',
      desc: 'Shop premium, vet-recommended food, grooming supplies, toys and accessories delivered safely right to your door.',
      color: '#f59e0b',
      actionTab: 'products',
      actionText: 'Shop Marketplace'
    }, {
      icon: 'fa-solid fa-book-open',
      title: 'Pet Care Resources',
      desc: 'Access expert-curated guides, nutrition tips, training techniques and health articles to become the best pet parent.',
      color: '#10b981',
      actionTab: 'home',
      actionText: 'Care Guides'
    }];
    const whyCards = [{
      icon: 'fa-solid fa-heart',
      title: 'Loving & Caring Community',
      desc: 'A warm network of pet lovers, owners and professionals who genuinely care about every animal.',
      color: '#f43f5e'
    }, {
      icon: 'fa-solid fa-shield-halved',
      title: 'Trusted Pet Care',
      desc: 'All veterinary partners are certified professionals. Every resource is reviewed by pet care experts.',
      color: '#0ea5e9'
    }, {
      icon: 'fa-solid fa-handshake',
      title: 'Easy Pet Adoption',
      desc: 'Streamlined adoption process connecting shelters with loving families — transparent, fast and joyful.',
      color: '#8b5cf6'
    }, {
      icon: 'fa-solid fa-lightbulb',
      title: 'Helpful Resources',
      desc: '50+ guides, tips and care articles to empower you with the knowledge every great pet parent needs.',
      color: '#f59e0b'
    }];
    const impactStats = [{
      number: '500+',
      label: 'Pets Helped',
      icon: 'fa-solid fa-paw',
      color: '#0ea5e9'
    }, {
      number: '100+',
      label: 'Happy Families',
      icon: 'fa-solid fa-house',
      color: '#10b981'
    }, {
      number: '50+',
      label: 'Pet Care Resources',
      icon: 'fa-solid fa-book-open',
      color: '#8b5cf6'
    }, {
      number: '25+',
      label: 'Veterinary Partners',
      icon: 'fa-solid fa-user-doctor',
      color: '#f59e0b'
    }];
    const impactPillars = [{
      icon: 'fa-solid fa-house',
      text: 'Helping pets find loving forever homes'
    }, {
      icon: 'fa-solid fa-handshake',
      text: 'Connecting pet parents with trusted care'
    }, {
      icon: 'fa-solid fa-shield-heart',
      text: 'Promoting responsible pet ownership'
    }, {
      icon: 'fa-solid fa-users',
      text: 'Building a caring pet community'
    }];
    return /*#__PURE__*/React.createElement("div", {
      className: "about-page-wrapper"
    }, /*#__PURE__*/React.createElement("section", {
      className: "about-who-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "about-who-img-col"
    }, /*#__PURE__*/React.createElement("div", {
      className: "about-img-frame"
    }, /*#__PURE__*/React.createElement("img", {
      src: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",
      alt: "Happy dog with owner \u2014 FurEver Care",
      className: "about-hero-img"
    }), /*#__PURE__*/React.createElement("div", {
      className: "about-img-badge"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-paw"
    }), /*#__PURE__*/React.createElement("span", null, "Est. 2024")), /*#__PURE__*/React.createElement("div", {
      className: "about-img-floating-pill"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-heart",
      style: {
        color: '#f43f5e',
        marginRight: '6px'
      }
    }), "Pets First, Always"))), /*#__PURE__*/React.createElement("div", {
      className: "about-who-text-col"
    }, /*#__PURE__*/React.createElement("span", {
      className: "badge-sky",
      style: {
        marginBottom: '14px',
        display: 'inline-block'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-paw",
      style: {
        marginRight: '6px'
      }
    }), " Who We Are"), /*#__PURE__*/React.createElement("h2", {
      className: "about-section-heading"
    }, "We Are ", /*#__PURE__*/React.createElement("span", {
      className: "gradient-text"
    }, "FurEver Care"), " \u2014", /*#__PURE__*/React.createElement("br", null), "Where Every Pet Matters"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'var(--text-muted)',
        lineHeight: '1.8',
        marginBottom: '16px',
        fontSize: '1.02rem'
      }
    }, "FurEver Care is a comprehensive digital platform built with a single purpose: to make every pet's life healthier, happier and more loved. We bring together dedicated pet owners, certified veterinarians and compassionate animal shelters under one unified community."), /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'var(--text-muted)',
        lineHeight: '1.8',
        marginBottom: '28px',
        fontSize: '1.02rem'
      }
    }, "From seamless pet adoption journeys to expert veterinary consultations, curated pet products and a rich library of pet-care resources \u2014 we are your complete companion for responsible, joyful pet ownership."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: '12px',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn-sky-primary",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      },
      onClick: () => {
        const el = document.getElementById('about-mission-section');
        if (el) el.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-bullseye"
    }), " Our Mission"), /*#__PURE__*/React.createElement("button", {
      className: "btn-sky-outline",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      },
      onClick: () => setActiveTab('shelter')
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-heart"
    }), " Explore Adoptions")))), /*#__PURE__*/React.createElement("section", {
      id: "about-mission-section",
      className: "about-mv-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "about-mv-card",
      style: {
        borderTop: '3px solid var(--primary-500)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "about-mv-icon",
      style: {
        background: 'rgba(14,165,233,0.12)',
        color: 'var(--primary-600)'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-bullseye"
    })), /*#__PURE__*/React.createElement("span", {
      className: "badge-sky",
      style: {
        marginBottom: '12px',
        display: 'inline-block'
      }
    }, "Our Mission"), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: '1.35rem',
        marginBottom: '14px',
        fontFamily: 'var(--font-heading)'
      }
    }, "Caring for Every Pet, Every Day"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'var(--text-muted)',
        lineHeight: '1.8',
        fontSize: '1.05rem',
        fontStyle: 'italic'
      }
    }, "\"To create a caring community where every pet can live a healthy, happy and loved life.\""), /*#__PURE__*/React.createElement("div", {
      className: "about-mv-divider"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'var(--text-light)',
        fontSize: '0.9rem'
      }
    }, "We achieve this by connecting people, pets and professionals through technology, compassion and community.")), /*#__PURE__*/React.createElement("div", {
      className: "about-mv-card",
      style: {
        borderTop: '3px solid #8b5cf6'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "about-mv-icon",
      style: {
        background: 'rgba(139,92,246,0.12)',
        color: '#8b5cf6'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-eye"
    })), /*#__PURE__*/React.createElement("span", {
      className: "badge-sky",
      style: {
        marginBottom: '12px',
        display: 'inline-block',
        background: 'rgba(139,92,246,0.1)',
        color: '#7c3aed',
        borderColor: 'rgba(139,92,246,0.3)'
      }
    }, "Our Vision"), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: '1.35rem',
        marginBottom: '14px',
        fontFamily: 'var(--font-heading)'
      }
    }, "A World Where No Pet Is Left Behind"), /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'var(--text-muted)',
        lineHeight: '1.8',
        fontSize: '1.05rem',
        fontStyle: 'italic'
      }
    }, "\"A world where no pet is left without love, care or a forever home.\""), /*#__PURE__*/React.createElement("div", {
      className: "about-mv-divider"
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'var(--text-light)',
        fontSize: '0.9rem'
      }
    }, "We envision communities where shelters are empty, pets thrive, and every animal is treasured as a family member."))), /*#__PURE__*/React.createElement("section", {
      className: "about-section-block"
    }, /*#__PURE__*/React.createElement("div", {
      className: "about-section-label"
    }, /*#__PURE__*/React.createElement("span", {
      className: "badge-sky"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-star",
      style: {
        marginRight: '6px'
      }
    }), " What We Offer"), /*#__PURE__*/React.createElement("h2", {
      className: "about-section-heading",
      style: {
        textAlign: 'center',
        marginTop: '10px'
      }
    }, "Everything Your Pet ", /*#__PURE__*/React.createElement("span", {
      className: "gradient-text"
    }, "Deserves")), /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'var(--text-muted)',
        textAlign: 'center',
        maxWidth: '560px',
        margin: '10px auto 0',
        fontSize: '0.97rem'
      }
    }, "Four pillars of comprehensive pet care \u2014 all in one place, designed with love.")), /*#__PURE__*/React.createElement("div", {
      className: "about-offer-grid"
    }, offerCards.map((card, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "about-offer-card glass-card-hover"
    }, /*#__PURE__*/React.createElement("div", {
      className: "about-offer-icon-wrap",
      style: {
        background: `linear-gradient(135deg, ${card.color}22, ${card.color}0a)`,
        color: card.color,
        border: `1.5px solid ${card.color}35`,
        boxShadow: `0 8px 20px ${card.color}20`
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: card.icon,
      style: {
        fontSize: '1.65rem'
      }
    })), /*#__PURE__*/React.createElement("h3", {
      style: {
        fontSize: '1.18rem',
        fontWeight: '800',
        marginBottom: '10px',
        fontFamily: 'var(--font-heading)',
        color: 'var(--text-main)'
      }
    }, card.title), /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'var(--text-muted)',
        fontSize: '0.88rem',
        lineHeight: '1.7',
        marginBottom: '18px'
      }
    }, card.desc), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        setActiveTab(card.actionTab);
        if (window.SoundEngine) window.SoundEngine.playClicker();
      },
      style: {
        marginTop: 'auto',
        background: 'transparent',
        border: 'none',
        color: card.color,
        fontWeight: '800',
        fontSize: '0.86rem',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: 0
      }
    }, /*#__PURE__*/React.createElement("span", null, card.actionText), /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-arrow-right",
      style: {
        fontSize: '0.75rem',
        transition: 'transform 0.2s'
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "about-offer-line",
      style: {
        background: card.color
      }
    }))))), /*#__PURE__*/React.createElement("section", {
      className: "about-why-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "about-why-text"
    }, /*#__PURE__*/React.createElement("span", {
      className: "badge-sky",
      style: {
        marginBottom: '14px',
        display: 'inline-block'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-trophy",
      style: {
        marginRight: '6px'
      }
    }), " Why Choose Us"), /*#__PURE__*/React.createElement("h2", {
      className: "about-section-heading"
    }, "Why Choose ", /*#__PURE__*/React.createElement("span", {
      className: "gradient-text"
    }, "FurEver Care?")), /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'var(--text-muted)',
        marginTop: '12px',
        lineHeight: '1.8',
        maxWidth: '420px',
        fontSize: '0.97rem'
      }
    }, "We are more than a platform. We are a movement \u2014 built on love, trust and a shared commitment to every animal's wellbeing."), /*#__PURE__*/React.createElement("div", {
      className: "about-why-features"
    }, whyCards.map((w, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "about-why-feature-row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "about-why-icon",
      style: {
        background: `${w.color}18`,
        color: w.color
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: w.icon
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: '700',
        fontSize: '0.98rem',
        color: 'var(--text-main)',
        marginBottom: '3px'
      }
    }, w.title), /*#__PURE__*/React.createElement("div", {
      style: {
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        lineHeight: '1.6'
      }
    }, w.desc)))))), /*#__PURE__*/React.createElement("div", {
      className: "about-why-img-col"
    }, /*#__PURE__*/React.createElement("div", {
      className: "about-img-frame",
      style: {
        borderRadius: 'var(--radius-xl)'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=700&q=80",
      alt: "Veterinarian caring for a cat \u2014 FurEver Care",
      className: "about-hero-img",
      style: {
        borderRadius: 'var(--radius-xl)'
      }
    })))), /*#__PURE__*/React.createElement("section", {
      className: "about-impact-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "about-impact-header"
    }, /*#__PURE__*/React.createElement("span", {
      className: "badge-sky",
      style: {
        marginBottom: '14px',
        display: 'inline-block'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-chart-line",
      style: {
        marginRight: '6px'
      }
    }), " Our Impact"), /*#__PURE__*/React.createElement("h2", {
      className: "about-section-heading",
      style: {
        textAlign: 'center'
      }
    }, "Real Lives, ", /*#__PURE__*/React.createElement("span", {
      className: "gradient-text"
    }, "Real Change")), /*#__PURE__*/React.createElement("p", {
      style: {
        color: 'var(--text-muted)',
        textAlign: 'center',
        maxWidth: '520px',
        margin: '10px auto 0',
        fontSize: '0.97rem'
      }
    }, "Every number represents a life touched, a family completed and a pet given the love they always deserved.")), /*#__PURE__*/React.createElement("div", {
      className: "about-stats-grid"
    }, impactStats.map((stat, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "about-stat-card glass-card-hover"
    }, /*#__PURE__*/React.createElement("div", {
      className: "about-stat-icon",
      style: {
        background: `${stat.color}18`,
        color: stat.color
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: stat.icon,
      style: {
        fontSize: '1.5rem'
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "about-stat-number",
      style: {
        color: stat.color
      }
    }, stat.number), /*#__PURE__*/React.createElement("div", {
      className: "about-stat-label"
    }, stat.label)))), /*#__PURE__*/React.createElement("div", {
      className: "about-pillars-grid"
    }, impactPillars.map((p, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "about-pillar-item glass-panel"
    }, /*#__PURE__*/React.createElement("i", {
      className: p.icon,
      style: {
        color: 'var(--primary-500)',
        fontSize: '1.25rem',
        marginRight: '12px',
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-main)',
        fontWeight: '600',
        fontSize: '0.95rem'
      }
    }, p.text))))), /*#__PURE__*/React.createElement("section", {
      className: "about-cta-section"
    }, /*#__PURE__*/React.createElement("div", {
      className: "about-cta-paw-bg"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-paw about-cta-paw-1"
    }), /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-paw about-cta-paw-2"
    }), /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-paw about-cta-paw-3"
    })), /*#__PURE__*/React.createElement("div", {
      className: "about-cta-content"
    }, /*#__PURE__*/React.createElement("div", {
      className: "about-cta-badge"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-heart",
      style: {
        color: '#f43f5e',
        marginRight: '8px'
      }
    }), "Make a Difference Today"), /*#__PURE__*/React.createElement("h2", {
      className: "about-cta-heading"
    }, "Ready to Give a Pet a", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      className: "gradient-text"
    }, "Forever Home?")), /*#__PURE__*/React.createElement("p", {
      className: "about-cta-sub"
    }, "Find your new best friend and make a difference today. Every adoption is a life saved, a family made whole."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("button", {
      className: "btn-sky-primary",
      style: {
        padding: '14px 32px',
        fontSize: '1.05rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      },
      onClick: () => {
        setActiveTab('shelter');
        if (window.SoundEngine) window.SoundEngine.playChime();
      }
    }, "Explore Pets \u2764\uFE0F"), /*#__PURE__*/React.createElement("button", {
      className: "btn-sky-outline",
      style: {
        padding: '14px 28px',
        fontSize: '1.05rem',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      },
      onClick: () => setActiveTab('vet')
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-stethoscope"
    }), " Meet Our Vets")))));
  })()), /*#__PURE__*/React.createElement("button", {
    className: "ai-bot-toggle-btn",
    onClick: () => setAiChatOpen(!aiChatOpen),
    title: "24/7 Pet Care Live Assistant & Support"
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa-solid ${aiChatOpen ? 'fa-xmark' : 'fa-headset'}`
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '2px',
      right: '2px',
      width: '12px',
      height: '12px',
      background: '#10b981',
      borderRadius: '50%',
      border: '2px solid #fff',
      boxShadow: '0 0 8px #10b981'
    }
  })), /*#__PURE__*/React.createElement("button", {
    className: "sos-floating-btn",
    onClick: () => setSosModalOpen(true)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-truck-medical"
  }), /*#__PURE__*/React.createElement("span", null, "EMERGENCY SOS")), aiChatOpen && /*#__PURE__*/React.createElement("div", {
    className: "chat-modal-window glass-panel-strong"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-header"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "widget-icon-circle widget-icon-sky",
    style: {
      width: '34px',
      height: '34px',
      borderRadius: '10px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-headset"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '800',
      fontSize: '0.95rem'
    }
  }, "FurEver Care AI Assistant"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.72rem',
      color: '#bae6fd',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '7px',
      height: '7px',
      background: '#10b981',
      borderRadius: '50%',
      display: 'inline-block'
    }
  }), "24/7 Roman Urdu & English Pet Care"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    title: "Reset Chat",
    style: {
      width: '28px',
      height: '28px',
      background: 'rgba(255,255,255,0.12)',
      color: '#fff',
      border: 'none'
    },
    onClick: () => setChatMessages([{
      sender: 'bot',
      text: 'Assalam-o-Alaikum! 🐾 Hello! Main FurEver Care ka 24/7 AI Pet Assistant hoon.\n\nAap mujhse Roman Urdu ya English mein pets ki diet, ulti/dast/bukhar ke ilaj, vaccine schedule, grooming, ya doctor booking ke bare mein kuch bhi pooch sakte hain!'
    }])
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-rotate-right",
    style: {
      fontSize: '0.75rem'
    }
  })), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    style: {
      width: '28px',
      height: '28px',
      background: 'transparent',
      color: '#fff',
      border: 'none'
    },
    onClick: () => setAiChatOpen(false)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "chat-messages-body"
  }, chatMessages.map((msg, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `chat-msg ${msg.sender}`
  }, msg.text))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px',
      padding: '8px 12px',
      overflowX: 'auto',
      background: 'var(--bg-glass)',
      borderTop: '1px solid var(--border-glass)'
    }
  }, [{
    label: '🐶 Khana & Diet',
    query: 'Mera dog khana nahi kha raha kya karun?'
  }, {
    label: '🐱 Ulti / Vomit',
    query: 'Billi ko ulti aa rahi hai ilaj batao'
  }, {
    label: '💩 Dast / Diarrhea',
    query: 'Pet ko loose motion dast lag gaye hain kya dein?'
  }, {
    label: '💉 Vaccine Schedule',
    query: 'Pet ki core vaccine ka schedule batao'
  }, {
    label: '✂️ Bath & Grooming',
    query: 'Dog ko kab nehlana chahiye aur shampoo konsa use karein?'
  }, {
    label: '🚨 SOS Emergency',
    query: 'Emergency poison aur helpline number kya hai?'
  }, {
    label: '👨‍⚕️ Book Vet Doctor',
    query: 'Veterinarian doctor consultation kaise book karein?'
  }].map((pill, idx) => /*#__PURE__*/React.createElement("button", {
    key: idx,
    type: "button",
    className: "badge-sky",
    style: {
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      fontSize: '0.72rem',
      padding: '4px 10px',
      borderRadius: '12px',
      border: '1px solid rgba(56,189,248,0.3)',
      background: 'rgba(14,165,233,0.08)'
    },
    onClick: () => triggerBotQuery(pill.query)
  }, pill.label))), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSendMessage,
    className: "chat-input-bar"
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-sky",
    style: {
      padding: '8px 14px',
      fontSize: '0.88rem'
    },
    placeholder: "Sawal poochein (Ask in Roman Urdu or English)...",
    value: chatInput,
    onChange: e => setChatInput(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn-icon",
    style: {
      background: 'var(--primary-500)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-paper-plane"
  })))), activeVideo && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setActiveVideo(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog-content video-masterclass-dialog",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      flexWrap: 'wrap',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-play",
    style: {
      marginRight: '6px'
    }
  }), " ", activeVideo.category), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.8rem',
      color: 'var(--text-muted)',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-regular fa-clock"
  }), " ", activeVideo.duration), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.78rem',
      background: 'rgba(16, 185, 129, 0.15)',
      color: '#10b981',
      padding: '3px 10px',
      borderRadius: 'var(--radius-full)',
      fontWeight: '700'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check"
  }), " Vet Certified")), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    onClick: () => setActiveVideo(null),
    title: "Close Video"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark"
  }))), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.35rem',
      fontWeight: '800',
      marginBottom: '14px',
      color: 'var(--text-main)'
    }
  }, activeVideo.title), /*#__PURE__*/React.createElement("div", {
    className: "video-cinema-frame",
    style: {
      position: 'relative',
      width: '100%',
      paddingBottom: '56.25%',
      height: 0,
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      background: '#000',
      marginBottom: '18px',
      border: '2px solid rgba(56, 189, 248, 0.35)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
    }
  }, /*#__PURE__*/React.createElement("iframe", {
    src: `${activeVideo.videoUrl}?autoplay=1&rel=0&modestbranding=1`,
    title: activeVideo.title,
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: 0
    },
    allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
    allowFullScreen: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 16px',
      background: 'rgba(14, 165, 233, 0.08)',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid rgba(56, 189, 248, 0.2)',
      marginBottom: '16px',
      flexWrap: 'wrap',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.85rem',
      color: 'var(--text-main)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-info",
    style: {
      color: '#38bdf8'
    }
  }), /*#__PURE__*/React.createElement("span", null, "HD 1080p Professional Companion Care Lesson")), /*#__PURE__*/React.createElement("a", {
    href: activeVideo.videoUrl.replace('/embed/', '/watch?v='),
    target: "_blank",
    rel: "noopener noreferrer",
    className: "btn-sky-outline",
    style: {
      padding: '6px 14px',
      fontSize: '0.78rem',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-youtube",
    style: {
      color: '#f43f5e'
    }
  }), " Open on YouTube")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      fontSize: '0.92rem',
      lineHeight: '1.6',
      marginBottom: '16px'
    }
  }, activeVideo.description), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-glass)',
      padding: '18px 20px',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '10px',
      fontSize: '0.92rem',
      fontWeight: '800',
      color: 'var(--text-main)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-list-ol",
    style: {
      color: 'var(--primary-500)'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Key Execution Checklist & Technique Stages:")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px'
    }
  }, activeVideo.steps.map((st, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '8px',
      fontSize: '0.84rem',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      background: 'rgba(14, 165, 233, 0.15)',
      color: '#38bdf8',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.7rem',
      fontWeight: '800',
      flexShrink: 0,
      marginTop: '2px'
    }
  }, i + 1), /*#__PURE__*/React.createElement("span", null, st))))))), activeProductModal && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setActiveProductModal(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog-content",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky"
  }, activeProductModal.category), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    onClick: () => setActiveProductModal(null)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark"
  }))), /*#__PURE__*/React.createElement("img", {
    src: activeProductModal.image,
    alt: activeProductModal.name,
    style: {
      width: '100%',
      height: '260px',
      objectFit: 'cover',
      borderRadius: 'var(--radius-md)',
      marginBottom: '16px'
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.4rem',
      marginBottom: '8px'
    }
  }, activeProductModal.name), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      fontSize: '0.95rem',
      marginBottom: '16px'
    }
  }, activeProductModal.description), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "product-price",
    style: {
      fontSize: '1.8rem'
    }
  }, "$", activeProductModal.price.toFixed(2)), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    onClick: () => {
      setActiveProductModal(null);
      setCheckoutItem(activeProductModal);
    }
  }, "Proceed to Checkout")))), activeAdoptModal && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setActiveAdoptModal(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog-content",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-paw"
  }), " Adoption Request"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.25rem',
      margin: 0
    }
  }, "Adopt ", activeAdoptModal.name)), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    onClick: () => setActiveAdoptModal(null)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '12px',
      alignItems: 'center',
      padding: '12px 14px',
      background: 'rgba(14, 165, 233, 0.08)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid rgba(56, 189, 248, 0.25)',
      marginBottom: '18px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: activeAdoptModal.image || activeAdoptModal.photo,
    alt: activeAdoptModal.name,
    style: {
      width: '54px',
      height: '54px',
      borderRadius: '10px',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '800',
      color: 'var(--text-main)',
      fontSize: '0.98rem'
    }
  }, activeAdoptModal.name, " (", activeAdoptModal.breed || activeAdoptModal.species, ")"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: 'var(--text-muted)'
    }
  }, activeAdoptModal.age, " \u2022 ", activeAdoptModal.gender, " \u2022 ", activeAdoptModal.shelter || 'FurEver Rescue Shelter'))), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      fontSize: '0.86rem',
      marginBottom: '16px'
    }
  }, "Submit your adoption application. Our shelter coordinator will contact you within 24-48 hours."), /*#__PURE__*/React.createElement("form", {
    noValidate: true,
    onSubmit: e => {
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
        submittedDate: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      };
      setActiveAdoptModal(null);
      setAdoptSuccessData(successPayload);
      if (window.SoundEngine) window.SoundEngine.playChime();
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Your Full Name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "adoptFullName",
    className: "input-sky",
    defaultValue: user.firstName || 'Alex Johnson'
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Phone Number"), /*#__PURE__*/React.createElement("input", {
    type: "tel",
    name: "adoptPhone",
    className: "input-sky",
    placeholder: "+1 (555) 000-0000",
    defaultValue: "+1 (555) 912-3849"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Home Environment (House with yard / Apartment)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "adoptEnv",
    className: "input-sky",
    placeholder: "e.g. 2-Bedroom Apartment, Fenced Garden",
    defaultValue: "2-Bedroom Apartment with Balcony"
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn-sky-primary",
    style: {
      width: '100%',
      padding: '12px',
      fontSize: '1rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-heart",
    style: {
      marginRight: '8px'
    }
  }), " Submit Adoption Application")))), adoptSuccessData && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setAdoptSuccessData(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog-content adopt-success-dialog",
    style: {
      maxWidth: '580px',
      textAlign: 'center'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "reschedule-success-icon",
    style: {
      background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.2), rgba(225, 29, 72, 0.12))',
      borderColor: '#f43f5e',
      color: '#f43f5e'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-heart-circle-check"
  })), /*#__PURE__*/React.createElement("span", {
    className: "badge-sky",
    style: {
      marginBottom: '10px',
      background: 'rgba(16, 185, 129, 0.12)',
      color: '#059669',
      borderColor: 'rgba(16, 185, 129, 0.3)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-shield-heart",
    style: {
      marginRight: '6px'
    }
  }), " APPLICATION RECEIVED & IN REVIEW"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.75rem',
      fontWeight: '800',
      margin: '8px 0 10px',
      color: 'var(--text-main)'
    }
  }, "Adoption Request Submitted!"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      fontSize: '0.92rem',
      marginBottom: '20px',
      lineHeight: '1.6'
    }
  }, "Thank you, ", /*#__PURE__*/React.createElement("strong", null, adoptSuccessData.applicantName), "! Your adoption application for ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--primary-600)'
    }
  }, adoptSuccessData.petName), " has been logged under Ref: ", /*#__PURE__*/React.createElement("strong", null, adoptSuccessData.refId), "."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface)',
      padding: '16px 18px',
      borderRadius: 'var(--radius-lg)',
      border: '1.5px solid var(--border-glow)',
      textAlign: 'left',
      marginBottom: '20px',
      boxShadow: 'var(--card-shadow)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '14px',
      alignItems: 'center',
      borderBottom: '1px solid var(--border-glass)',
      paddingBottom: '14px',
      marginBottom: '14px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: adoptSuccessData.petImage,
    alt: adoptSuccessData.petName,
    style: {
      width: '64px',
      height: '64px',
      borderRadius: '12px',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '800',
      fontSize: '1.05rem',
      color: 'var(--text-main)'
    }
  }, adoptSuccessData.petName), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.8rem',
      color: 'var(--text-muted)'
    }
  }, adoptSuccessData.petBreed, " \u2022 ", adoptSuccessData.petAge), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.76rem',
      color: '#10b981',
      marginTop: '2px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-hotel"
  }), " ", adoptSuccessData.shelter)), /*#__PURE__*/React.createElement("div", {
    className: "badge-sky",
    style: {
      fontSize: '0.78rem'
    }
  }, adoptSuccessData.refId)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.76rem',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: '#38bdf8',
      fontWeight: '800',
      marginBottom: '10px'
    }
  }, "Adoption Journey Milestones:"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
      fontSize: '0.82rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#10b981',
      fontWeight: '700'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check"
  }), " 1. Form Submitted"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#f59e0b',
      fontWeight: '700'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-clock"
  }), " 2. Shelter Review (24h)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-regular fa-circle"
  }), " 3. Meet & Greet Visit"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-regular fa-circle"
  }), " 4. Welcome Home \u2764\uFE0F"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      width: '100%',
      padding: '12px',
      fontSize: '0.95rem'
    },
    onClick: () => {
      setAdoptSuccessData(null);
      addToast(`Shelter coordinator will call you at ${adoptSuccessData.phone}!`, 'fa-phone');
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check",
    style: {
      marginRight: '6px'
    }
  }), " Done & Explore Shelter Pets")))), checkoutItem && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setCheckoutItem(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog-content",
    style: {
      maxWidth: '640px'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      borderBottom: '1px solid var(--border-glass)',
      paddingBottom: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '38px',
      height: '38px',
      borderRadius: '50%',
      background: 'rgba(14, 165, 233, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--primary-600)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-lock"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.25rem',
      margin: 0
    }
  }, "Express Secure Checkout"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.78rem',
      color: 'var(--text-light)'
    }
  }, "256-Bit SSL Encrypted Pet Store Payment"))), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    onClick: () => setCheckoutItem(null)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      padding: '16px',
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1.5px solid var(--border-glow)',
      marginBottom: '20px',
      boxShadow: 'var(--card-shadow)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: checkoutItem.image,
    alt: checkoutItem.name,
    style: {
      width: '75px',
      height: '75px',
      borderRadius: '12px',
      objectFit: 'cover',
      border: '1px solid var(--border-glass)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky",
    style: {
      fontSize: '0.72rem',
      marginBottom: '4px'
    }
  }, checkoutItem.category), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '700',
      fontSize: '1.05rem',
      color: 'var(--text-main)'
    }
  }, checkoutItem.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '8px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--primary-600)',
      fontWeight: '800',
      fontSize: '1.15rem'
    }
  }, "$", (checkoutItem.price * checkoutQty).toFixed(2), checkoutQty > 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.78rem',
      color: 'var(--text-light)',
      fontWeight: '400',
      marginLeft: '6px'
    }
  }, "($", checkoutItem.price.toFixed(2), " ea)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      background: 'var(--bg-glass)',
      padding: '4px 10px',
      borderRadius: 'var(--radius-full)',
      border: '1px solid var(--border-glass)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--text-main)',
      fontSize: '0.9rem',
      width: '22px',
      height: '22px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    onClick: () => setCheckoutQty(Math.max(1, checkoutQty - 1))
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-minus"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: '700',
      fontSize: '0.95rem',
      minWidth: '18px',
      textAlign: 'center'
    }
  }, checkoutQty), /*#__PURE__*/React.createElement("button", {
    type: "button",
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--text-main)',
      fontSize: '0.9rem',
      width: '22px',
      height: '22px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    onClick: () => setCheckoutQty(checkoutQty + 1)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus"
  })))))), /*#__PURE__*/React.createElement("form", {
    noValidate: true,
    onSubmit: e => {
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
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        estDelivery: '24 - 48 Hours (Guaranteed Pet-Safe Express Dispatch)'
      };
      setOrderSuccessData(orderInfo);
      setCheckoutItem(null);
      setCheckoutQty(1);
      if (window.SoundEngine) window.SoundEngine.playChime();
      addToast(`Order #${orderInfo.orderId} Confirmed!`, 'fa-circle-check');
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Full Recipient Name *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "checkout-name",
    className: "input-sky",
    placeholder: "e.g. Hamna Ali",
    value: checkoutFormData.fullName,
    onChange: e => setCheckoutFormData({
      ...checkoutFormData,
      fullName: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Phone (for Courier Tracking) *"), /*#__PURE__*/React.createElement("input", {
    type: "tel",
    id: "checkout-phone",
    className: "input-sky",
    placeholder: "+92 300 1234567",
    value: checkoutFormData.phone,
    onChange: e => setCheckoutFormData({
      ...checkoutFormData,
      phone: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Delivery Street Address *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "checkout-address",
    className: "input-sky",
    placeholder: "House / Flat No, Street, Landmark",
    value: checkoutFormData.address,
    onChange: e => setCheckoutFormData({
      ...checkoutFormData,
      address: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "City *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "checkout-city",
    className: "input-sky",
    placeholder: "City Name",
    value: checkoutFormData.city,
    onChange: e => setCheckoutFormData({
      ...checkoutFormData,
      city: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Select Payment Method"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '10px',
      marginTop: '6px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: `payment-option-card ${checkoutPaymentMethod === 'card' ? 'active' : ''}`,
    onClick: () => setCheckoutPaymentMethod('card')
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-credit-card",
    style: {
      fontSize: '1.2rem',
      marginBottom: '4px',
      color: 'var(--primary-600)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '700',
      fontSize: '0.85rem'
    }
  }, "Credit / Debit"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.7rem',
      color: 'var(--text-light)'
    }
  }, "Visa, Mastercard")), /*#__PURE__*/React.createElement("div", {
    className: `payment-option-card ${checkoutPaymentMethod === 'cod' ? 'active' : ''}`,
    onClick: () => setCheckoutPaymentMethod('cod')
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-hand-holding-dollar",
    style: {
      fontSize: '1.2rem',
      marginBottom: '4px',
      color: '#10b981'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '700',
      fontSize: '0.85rem'
    }
  }, "Cash on Delivery"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.7rem',
      color: 'var(--text-light)'
    }
  }, "Pay at Doorstep")), /*#__PURE__*/React.createElement("div", {
    className: `payment-option-card ${checkoutPaymentMethod === 'digital' ? 'active' : ''}`,
    onClick: () => setCheckoutPaymentMethod('digital')
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-apple-pay",
    style: {
      fontSize: '1.4rem',
      marginBottom: '2px',
      color: 'var(--primary-700)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '700',
      fontSize: '0.85rem'
    }
  }, "Digital Pay"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.7rem',
      color: 'var(--text-light)'
    }
  }, "Apple / Google")))), checkoutPaymentMethod === 'card' && /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-glass)',
      padding: '14px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-glass)',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom",
    style: {
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom",
    style: {
      fontSize: '0.82rem'
    }
  }, "Card Number"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-sky",
    placeholder: "4532 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 8892",
    maxLength: "19",
    value: checkoutFormData.cardNumber,
    onChange: e => setCheckoutFormData({
      ...checkoutFormData,
      cardNumber: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom",
    style: {
      fontSize: '0.82rem'
    }
  }, "Expiry Date"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-sky",
    placeholder: "MM/YY (e.g. 08/28)",
    maxLength: "5",
    value: checkoutFormData.cardExp,
    onChange: e => setCheckoutFormData({
      ...checkoutFormData,
      cardExp: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom",
    style: {
      fontSize: '0.82rem'
    }
  }, "CVV / CVC"), /*#__PURE__*/React.createElement("input", {
    type: "password",
    className: "input-sky",
    placeholder: "\u2022\u2022\u2022",
    maxLength: "4",
    value: checkoutFormData.cardCvc,
    onChange: e => setCheckoutFormData({
      ...checkoutFormData,
      cardCvc: e.target.value
    })
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '12px 16px',
      background: 'var(--bg-glass-strong)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-glass)',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.88rem',
      color: 'var(--text-muted)',
      marginBottom: '6px'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Subtotal (", checkoutQty, " item", checkoutQty > 1 ? 's' : '', "):"), /*#__PURE__*/React.createElement("span", null, "$", (checkoutItem.price * checkoutQty).toFixed(2))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.88rem',
      color: '#10b981',
      marginBottom: '6px'
    }
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-truck-fast"
  }), " Express Pet-Safe Delivery:"), /*#__PURE__*/React.createElement("span", null, "FREE")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '1.15rem',
      fontWeight: '800',
      color: 'var(--primary-700)',
      borderTop: '1px dashed var(--border-glass)',
      paddingTop: '8px',
      marginTop: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Total Amount:"), /*#__PURE__*/React.createElement("span", null, "$", (checkoutItem.price * checkoutQty).toFixed(2)))), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn-sky-primary",
    style: {
      width: '100%',
      padding: '15px',
      fontSize: '1.05rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-shield-check",
    style: {
      marginRight: '8px'
    }
  }), "Confirm & Place Order ($", (checkoutItem.price * checkoutQty).toFixed(2), ")")))), orderSuccessData && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setOrderSuccessData(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog-content",
    style: {
      maxWidth: '580px',
      textAlign: 'center'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '0 auto 16px',
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(14, 165, 233, 0.15))',
      border: '2px solid #10b981',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check",
    style: {
      fontSize: '2.4rem',
      color: '#10b981'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "badge-sky",
    style: {
      marginBottom: '10px',
      background: 'rgba(16, 185, 129, 0.12)',
      color: '#059669',
      borderColor: 'rgba(16, 185, 129, 0.3)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-shield-check",
    style: {
      marginRight: '6px'
    }
  }), " ORDER CONFIRMED & DISPATCHED"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.8rem',
      margin: '6px 0 10px'
    }
  }, "Thank You For Your Order!"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      fontSize: '0.92rem',
      marginBottom: '22px'
    }
  }, "Your order ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--primary-600)'
    }
  }, "#", orderSuccessData.orderId), " has been successfully placed and forwarded to our rapid fulfillment hub."), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--bg-surface)',
      padding: '18px',
      borderRadius: 'var(--radius-md)',
      border: '1.5px solid var(--border-glow)',
      textAlign: 'left',
      marginBottom: '20px',
      boxShadow: 'var(--card-shadow)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '14px',
      alignItems: 'center',
      borderBottom: '1px solid var(--border-glass)',
      paddingBottom: '14px',
      marginBottom: '14px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: orderSuccessData.productImage,
    alt: orderSuccessData.productName,
    style: {
      width: '64px',
      height: '64px',
      borderRadius: '10px',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '700',
      fontSize: '1rem',
      color: 'var(--text-main)'
    }
  }, orderSuccessData.productName), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      color: 'var(--text-light)',
      marginTop: '2px'
    }
  }, "Quantity: ", /*#__PURE__*/React.createElement("strong", null, orderSuccessData.qty, "x"), " \u2022 $", orderSuccessData.unitPrice.toFixed(2), " each")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '1.2rem',
      fontWeight: '800',
      color: 'var(--primary-600)'
    }
  }, "$", orderSuccessData.total)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      fontSize: '0.85rem'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-light)',
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      fontWeight: '700'
    }
  }, "Recipient"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '600',
      color: 'var(--text-main)',
      marginTop: '2px'
    }
  }, orderSuccessData.recipient)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-light)',
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      fontWeight: '700'
    }
  }, "Payment Mode"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '600',
      color: 'var(--text-main)',
      marginTop: '2px'
    }
  }, orderSuccessData.paymentMethod)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-light)',
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      fontWeight: '700'
    }
  }, "Delivery Location"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '600',
      color: 'var(--text-main)',
      marginTop: '2px'
    }
  }, orderSuccessData.address)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-light)',
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      fontWeight: '700'
    }
  }, "Estimated Arrival"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '700',
      color: '#10b981',
      marginTop: '2px'
    }
  }, orderSuccessData.estDelivery)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      flex: 1,
      padding: '12px 20px',
      fontSize: '0.95rem'
    },
    onClick: () => {
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
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-truck-fast",
    style: {
      marginRight: '8px'
    }
  }), " Track Order Live"), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-outline",
    style: {
      padding: '12px 20px',
      fontSize: '0.95rem'
    },
    onClick: () => setOrderSuccessData(null)
  }, "Continue Shopping")))), activeTrackOrder && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setActiveTrackOrder(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog-content order-track-dialog",
    style: {
      maxWidth: '640px',
      padding: '0',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '22px 24px 18px',
      borderBottom: '1px solid var(--border-glass)',
      background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(56, 189, 248, 0.04))'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: '1.2rem',
      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-truck-fast"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.25rem',
      margin: 0,
      color: 'var(--text-main)'
    }
  }, "Live Order Tracking"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.78rem',
      color: '#38bdf8',
      fontWeight: '700'
    }
  }, "Tracking #", activeTrackOrder.trackingNum || 'FE-782941', " \u2022 Order #", activeTrackOrder.orderId || 'ORD-8942'))), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    onClick: () => setActiveTrackOrder(null)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      background: 'rgba(16, 185, 129, 0.1)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      borderRadius: 'var(--radius-lg)',
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      background: '#10b981',
      display: 'inline-block',
      boxShadow: '0 0 10px #10b981'
    }
  }), /*#__PURE__*/React.createElement("strong", {
    style: {
      color: '#10b981',
      fontSize: '0.92rem'
    }
  }, "Status: On The Way (In Transit)")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.82rem',
      fontWeight: '700',
      color: 'var(--text-main)'
    }
  }, "ETA: ", /*#__PURE__*/React.createElement("strong", null, activeTrackOrder.estDelivery || 'Today by 04:30 PM'))), /*#__PURE__*/React.createElement("div", {
    className: "order-timeline-track",
    style: {
      marginBottom: '24px',
      padding: '16px',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-glass)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.76rem',
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: '#38bdf8',
      fontWeight: '800',
      marginBottom: '16px'
    }
  }, "Fulfillment & Delivery Progress:"), /*#__PURE__*/React.createElement("div", {
    className: "tracking-steps-grid",
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '8px',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: '#10b981',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 6px',
      fontSize: '0.88rem',
      boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-check"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      fontWeight: '700',
      color: 'var(--text-main)'
    }
  }, "Order Placed"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.68rem',
      color: 'var(--text-muted)'
    }
  }, "Payment Verified")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: '#10b981',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 6px',
      fontSize: '0.88rem',
      boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-box"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      fontWeight: '700',
      color: 'var(--text-main)'
    }
  }, "Packed"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.68rem',
      color: 'var(--text-muted)'
    }
  }, "Warehouse Ready")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 6px',
      fontSize: '0.88rem',
      boxShadow: '0 0 0 4px rgba(56, 189, 248, 0.35)',
      animation: 'pulse 1.8s infinite'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-truck"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      fontWeight: '800',
      color: '#38bdf8'
    }
  }, "In Transit"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.68rem',
      color: '#38bdf8'
    }
  }, "On Courier Van")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      opacity: 0.55
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: 'var(--bg-glass)',
      border: '1px solid var(--border-glass)',
      color: 'var(--text-muted)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 6px',
      fontSize: '0.88rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-house"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      fontWeight: '700',
      color: 'var(--text-muted)'
    }
  }, "Delivered"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.68rem',
      color: 'var(--text-muted)'
    }
  }, "Doorstep Handover")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 18px',
      background: 'rgba(14, 165, 233, 0.06)',
      border: '1px solid rgba(56, 189, 248, 0.22)',
      borderRadius: 'var(--radius-md)',
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'rgba(56, 189, 248, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#38bdf8',
      fontSize: '1.1rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-id-badge"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '800',
      fontSize: '0.92rem',
      color: 'var(--text-main)'
    }
  }, activeTrackOrder.courier || 'FurEver Express Logistics #FE-8921'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: 'var(--text-muted)'
    }
  }, "Assigned Courier Driver: ", /*#__PURE__*/React.createElement("strong", null, "Mark Stevens")))), /*#__PURE__*/React.createElement("a", {
    href: "tel:+15557892341",
    className: "btn-sky-outline",
    style: {
      padding: '6px 14px',
      fontSize: '0.8rem',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    onClick: () => addToast('Connecting to Courier Dispatcher...', 'fa-phone')
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-phone"
  }), " Call Driver")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      fontSize: '0.85rem',
      background: 'var(--bg-surface)',
      padding: '14px 16px',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-glass)',
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-muted)',
      fontSize: '0.72rem',
      textTransform: 'uppercase',
      fontWeight: '700'
    }
  }, "Item In Shipment"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '700',
      color: 'var(--text-main)',
      marginTop: '3px'
    }
  }, activeTrackOrder.productName || 'Royal Canin Adult Food'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.76rem',
      color: '#38bdf8'
    }
  }, "Qty: ", activeTrackOrder.qty || 1, " \u2022 $", (parseFloat(activeTrackOrder.total) || 64.99).toFixed(2))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-muted)',
      fontSize: '0.72rem',
      textTransform: 'uppercase',
      fontWeight: '700'
    }
  }, "Delivery Address"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '600',
      color: 'var(--text-main)',
      marginTop: '3px'
    }
  }, activeTrackOrder.address || 'Central Park West, Apt 4B, New York'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.76rem',
      color: '#10b981'
    }
  }, "Recipient: ", activeTrackOrder.recipient || user.firstName || 'Alex Johnson'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-outline",
    style: {
      flex: 1,
      padding: '10px'
    },
    onClick: () => {
      navigator.clipboard && navigator.clipboard.writeText(activeTrackOrder.trackingNum || 'FE-782941');
      addToast('Tracking number copied!', 'fa-copy');
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-copy"
  }), " Copy Tracking #"), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      flex: 2,
      padding: '10px'
    },
    onClick: () => setActiveTrackOrder(null)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-check"
  }), " Close Tracker"))))), activeRsvpModal && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => {
      setActiveRsvpModal(null);
      setRsvpConfirmedData(null);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog-content custom-modal-scroll",
    style: {
      maxWidth: '640px',
      padding: '0',
      maxHeight: '88vh',
      overflowY: 'auto',
      overflowX: 'hidden'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: '180px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: activeRsvpModal.image,
    alt: activeRsvpModal.title,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(6, 14, 29, 0.95) 0%, rgba(6, 14, 29, 0.3) 100%)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    style: {
      position: 'absolute',
      top: '14px',
      right: '14px',
      background: 'rgba(0,0,0,0.6)',
      color: '#fff',
      border: 'none'
    },
    onClick: () => {
      setActiveRsvpModal(null);
      setRsvpConfirmedData(null);
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: '16px',
      left: '20px',
      right: '20px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky",
    style: {
      marginBottom: '6px',
      display: 'inline-block'
    }
  }, activeRsvpModal.tag), /*#__PURE__*/React.createElement("h3", {
    style: {
      color: '#fff',
      fontSize: '1.25rem',
      margin: 0,
      textShadow: '0 2px 8px rgba(0,0,0,0.8)'
    }
  }, activeRsvpModal.title))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px'
    }
  }, rsvpConfirmedData ?
  /*#__PURE__*/
  /* Confirmed Digital Ticket Pass & Success Screen */
  React.createElement("div", {
    style: {
      textAlign: 'center',
      animation: 'introFadeIn 0.4s ease'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "feedback-thankyou-icon",
    style: {
      background: '#10b981',
      color: '#fff',
      width: '70px',
      height: '70px',
      fontSize: '2.2rem',
      margin: '0 auto 16px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check"
  })), /*#__PURE__*/React.createElement("span", {
    className: "badge-sky",
    style: {
      background: 'rgba(16, 185, 129, 0.15)',
      color: '#059669',
      borderColor: '#10b981',
      marginBottom: '8px',
      padding: '6px 14px',
      fontSize: '0.82rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-sparkles",
    style: {
      marginRight: '6px'
    }
  }), " RSVP SUCCESSFUL \u2022 SEAT RESERVED!"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.65rem',
      margin: '10px 0 6px',
      fontFamily: 'var(--font-heading)'
    }
  }, "Congratulations, Your Seat is Confirmed!"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      fontSize: '0.9rem',
      maxWidth: '520px',
      margin: '0 auto 20px',
      lineHeight: '1.6'
    }
  }, "Your free event reservation for ", /*#__PURE__*/React.createElement("strong", null, activeRsvpModal.title), " has been processed successfully. We have saved your spot on the guest list!"), /*#__PURE__*/React.createElement("div", {
    className: "rsvp-ticket-card"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px dashed var(--border-glow)',
      paddingBottom: '12px',
      marginBottom: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo.png?v=13",
    alt: "Logo",
    style: {
      width: '28px',
      height: '28px'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: '800',
      fontSize: '0.92rem',
      fontFamily: 'var(--font-heading)'
    }
  }, "FurEver Care Pass")), /*#__PURE__*/React.createElement("div", {
    className: "rsvp-ticket-code"
  }, rsvpConfirmedData.passId)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr',
      gap: '12px',
      textAlign: 'left',
      fontSize: '0.84rem'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-light)',
      fontSize: '0.72rem',
      textTransform: 'uppercase'
    }
  }, "Attendee Name"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '700',
      color: 'var(--text-main)'
    }
  }, rsvpConfirmedData.name)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-light)',
      fontSize: '0.72rem',
      textTransform: 'uppercase'
    }
  }, "Reserved Seats"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '700',
      color: 'var(--primary-600)'
    }
  }, rsvpConfirmedData.guests, "x Free Seat(s)")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-light)',
      fontSize: '0.72rem',
      textTransform: 'uppercase'
    }
  }, "Date & Schedule"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '600'
    }
  }, activeRsvpModal.date, " \u2022 ", activeRsvpModal.time)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-light)',
      fontSize: '0.72rem',
      textTransform: 'uppercase'
    }
  }, "Venue Location"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '600'
    }
  }, activeRsvpModal.location)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '12px',
      marginTop: '22px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      flex: 1,
      padding: '12px 18px',
      fontSize: '0.95rem'
    },
    onClick: () => {
      window.print();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-print",
    style: {
      marginRight: '8px'
    }
  }), " Print / Save Pass"), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-outline",
    style: {
      padding: '12px 22px',
      fontSize: '0.95rem'
    },
    onClick: () => {
      setActiveRsvpModal(null);
      setRsvpConfirmedData(null);
      addToast(`Welcome to ${activeRsvpModal.title}! See you there.`, 'fa-circle-check');
    }
  }, "Continue ", /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-arrow-right",
    style: {
      marginLeft: '6px'
    }
  })))) :
  /*#__PURE__*/
  /* RSVP Form with Continue Button */
  React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '16px',
      alignItems: 'center',
      marginBottom: '18px',
      padding: '12px 16px',
      background: 'var(--bg-glass)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-glass)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-location-dot",
    style: {
      color: '#f43f5e',
      fontSize: '1.2rem'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: '0.85rem'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '700',
      color: 'var(--text-main)'
    }
  }, activeRsvpModal.date, " \u2022 ", activeRsvpModal.time), /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--text-muted)'
    }
  }, activeRsvpModal.location)), /*#__PURE__*/React.createElement("span", {
    className: "badge-sky",
    style: {
      fontSize: '0.75rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-users",
    style: {
      marginRight: '4px'
    }
  }), " ", activeRsvpModal.rsvpCount, " Attending")), /*#__PURE__*/React.createElement("form", {
    noValidate: true,
    onSubmit: e => {
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
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Attendee Full Name *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "rsvp-name",
    className: "input-sky",
    placeholder: "e.g. Alex Johnson",
    value: rsvpFormData.name,
    onChange: e => setRsvpFormData({
      ...rsvpFormData,
      name: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Email Address *"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    id: "rsvp-email",
    className: "input-sky",
    placeholder: "alex@example.com",
    value: rsvpFormData.email,
    onChange: e => setRsvpFormData({
      ...rsvpFormData,
      email: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Seats to Reserve"), /*#__PURE__*/React.createElement("select", {
    className: "input-sky",
    value: rsvpFormData.guests,
    onChange: e => setRsvpFormData({
      ...rsvpFormData,
      guests: Number(e.target.value)
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: 1
  }, "1 Free Seat (Self)"), /*#__PURE__*/React.createElement("option", {
    value: 2
  }, "2 Free Seats (Pair)"), /*#__PURE__*/React.createElement("option", {
    value: 3
  }, "3 Free Seats (Family)"), /*#__PURE__*/React.createElement("option", {
    value: 4
  }, "4 Free Seats (Group)"))), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Bringing a Pet Companion?"), /*#__PURE__*/React.createElement("select", {
    className: "input-sky",
    value: rsvpFormData.bringingPet,
    onChange: e => setRsvpFormData({
      ...rsvpFormData,
      bringingPet: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "Yes"
  }, "Yes, bringing my pet \uD83D\uDC3E"), /*#__PURE__*/React.createElement("option", {
    value: "No"
  }, "No, attending to adopt / volunteer")))), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Mobile Number (For Pass SMS Alert)"), /*#__PURE__*/React.createElement("input", {
    type: "tel",
    className: "input-sky",
    placeholder: "(555) 000-0000",
    value: rsvpFormData.phone,
    onChange: e => setRsvpFormData({
      ...rsvpFormData,
      phone: e.target.value
    })
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn-sky-primary",
    style: {
      width: '100%',
      padding: '14px',
      fontSize: '1.02rem',
      marginTop: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Continue & Confirm RSVP"), /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-arrow-right"
  }))))))), addPetModalOpen && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setAddPetModalOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog-content",
    style: {
      maxWidth: '600px'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
      borderBottom: '1px solid var(--border-glass)',
      paddingBottom: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '38px',
      height: '38px',
      borderRadius: '50%',
      background: 'rgba(14, 165, 233, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--primary-600)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-paw"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.25rem',
      margin: 0
    }
  }, "Register New Pet Companion"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.78rem',
      color: 'var(--text-light)'
    }
  }, "Add a pet profile to manage health records, vaccines & grooming"))), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    onClick: () => setAddPetModalOpen(false)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark"
  }))), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
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
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Pet Name *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "newpet-name-input",
    className: "input-sky",
    placeholder: "e.g. Bella or Simba",
    value: newPetFormData.name,
    onChange: e => setNewPetFormData({
      ...newPetFormData,
      name: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Pet Species"), /*#__PURE__*/React.createElement("select", {
    className: "input-sky",
    value: newPetFormData.species,
    onChange: e => setNewPetFormData({
      ...newPetFormData,
      species: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "Dog"
  }, "Canine (Dog)"), /*#__PURE__*/React.createElement("option", {
    value: "Cat"
  }, "Feline (Cat)"), /*#__PURE__*/React.createElement("option", {
    value: "Rabbit"
  }, "Rabbit"), /*#__PURE__*/React.createElement("option", {
    value: "Bird"
  }, "Bird / Parrot"), /*#__PURE__*/React.createElement("option", {
    value: "Hamster"
  }, "Hamster / Small Pet")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Breed *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "newpet-breed-input",
    className: "input-sky",
    placeholder: "e.g. Siberian Husky or Persian Cat",
    value: newPetFormData.breed,
    onChange: e => setNewPetFormData({
      ...newPetFormData,
      breed: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Gender"), /*#__PURE__*/React.createElement("select", {
    className: "input-sky",
    value: newPetFormData.gender,
    onChange: e => setNewPetFormData({
      ...newPetFormData,
      gender: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "Male"
  }, "Male \u2642"), /*#__PURE__*/React.createElement("option", {
    value: "Female"
  }, "Female \u2640")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Age *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "newpet-age-input",
    className: "input-sky",
    placeholder: "e.g. 2 Years 3 Months",
    value: newPetFormData.age,
    onChange: e => setNewPetFormData({
      ...newPetFormData,
      age: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Weight"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-sky",
    placeholder: "e.g. 14.5 kg",
    value: newPetFormData.weight,
    onChange: e => setNewPetFormData({
      ...newPetFormData,
      weight: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Microchip ID (Optional)"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-sky",
    placeholder: "e.g. 985-2341-9012",
    value: newPetFormData.microchip,
    onChange: e => setNewPetFormData({
      ...newPetFormData,
      microchip: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Known Allergies / Diet Notes"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-sky",
    placeholder: "e.g. Chicken protein allergy",
    value: newPetFormData.allergies,
    onChange: e => setNewPetFormData({
      ...newPetFormData,
      allergies: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-image",
    style: {
      marginRight: '6px',
      color: 'var(--primary-500)'
    }
  }), " Pet Photo (Choose File)"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flexWrap: 'wrap'
    }
  }, newPetFormData.photo && /*#__PURE__*/React.createElement("img", {
    src: newPetFormData.photo,
    alt: "preview",
    style: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid var(--primary-400)'
    },
    onError: e => {
      e.target.style.display = 'none';
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    className: "input-sky",
    style: {
      flex: 1,
      padding: '8px'
    },
    onChange: e => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        markInvalidField(e.target, 'Image size must be under 5 MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => setNewPetFormData({
        ...newPetFormData,
        photo: ev.target.result
      });
      reader.readAsDataURL(file);
    }
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.73rem',
      color: 'var(--text-muted)',
      marginTop: '5px'
    }
  }, "Accepted: JPG, PNG, WEBP \u2014 Max 5 MB")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-sky-primary",
    style: {
      width: '100%',
      padding: '14px',
      fontSize: '1.05rem'
    },
    onClick: e => {
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
      addToast(`${newPet.name} (${newPet.breed}) aapki pet family mein add ho gaya!`, 'fa-heart');
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check",
    style: {
      marginRight: '8px'
    }
  }), "Register Pet & Create Profile")))), rescheduleModalOpen && selectedAptToReschedule && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setRescheduleModalOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog-content reschedule-modal-dialog",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "reschedule-modal-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "reschedule-modal-icon-wrap"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-calendar-days"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "reschedule-modal-title"
  }, "Reschedule Appointment"), /*#__PURE__*/React.createElement("p", {
    className: "reschedule-modal-subtitle"
  }, "Update your scheduled visit with ", /*#__PURE__*/React.createElement("strong", null, selectedAptToReschedule.doctorName))), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon reschedule-close-btn",
    onClick: () => setRescheduleModalOpen(false)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "reschedule-scrollable-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "reschedule-original-box"
  }, /*#__PURE__*/React.createElement("div", {
    className: "reschedule-original-label"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-info"
  }), " Current Appointment"), /*#__PURE__*/React.createElement("div", {
    className: "reschedule-original-row"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-calendar"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Date:"), " ", selectedAptToReschedule.date), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-clock"
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Time:"), " ", selectedAptToReschedule.time), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-hospital"
  }), " ", selectedAptToReschedule.clinic))), /*#__PURE__*/React.createElement("div", {
    className: "reschedule-form-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-calendar-check",
    style: {
      color: '#38bdf8',
      marginRight: '6px'
    }
  }), " Preferred New Date"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    id: "reschedule-date-input",
    className: "input-sky",
    value: rescheduleForm.date,
    onChange: e => setRescheduleForm({
      ...rescheduleForm,
      date: e.target.value
    }),
    min: "2026-09-01"
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-clock",
    style: {
      color: '#38bdf8',
      marginRight: '6px'
    }
  }), " Preferred Time Slot"), /*#__PURE__*/React.createElement("div", {
    className: "reschedule-timeslot-grid"
  }, ['09:00 AM - 09:45 AM', '10:00 AM - 10:45 AM', '11:00 AM - 11:45 AM', '01:00 PM - 01:45 PM', '02:30 PM - 03:15 PM', '04:00 PM - 04:45 PM'].map(slot => /*#__PURE__*/React.createElement("button", {
    key: slot,
    type: "button",
    className: `reschedule-slot-btn ${rescheduleForm.time === slot ? 'active' : ''}`,
    onClick: () => setRescheduleForm({
      ...rescheduleForm,
      time: slot
    })
  }, slot)))), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-comment-medical",
    style: {
      color: '#38bdf8',
      marginRight: '6px'
    }
  }), " Reason for Rescheduling"), /*#__PURE__*/React.createElement("select", {
    className: "input-sky",
    value: rescheduleForm.reason,
    onChange: e => setRescheduleForm({
      ...rescheduleForm,
      reason: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "Schedule Conflict"
  }, "Schedule Conflict"), /*#__PURE__*/React.createElement("option", {
    value: "Personal Emergency"
  }, "Personal Emergency"), /*#__PURE__*/React.createElement("option", {
    value: "Pet Not Feeling Well Enough to Travel"
  }, "Pet Not Feeling Well Enough to Travel"), /*#__PURE__*/React.createElement("option", {
    value: "Work Commitment"
  }, "Work Commitment"), /*#__PURE__*/React.createElement("option", {
    value: "Travel"
  }, "Travel"), /*#__PURE__*/React.createElement("option", {
    value: "Prefer a Different Doctor"
  }, "Prefer a Different Doctor"), /*#__PURE__*/React.createElement("option", {
    value: "Financial Reasons"
  }, "Financial Reasons"), /*#__PURE__*/React.createElement("option", {
    value: "Other"
  }, "Other"))), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-note-sticky",
    style: {
      color: '#38bdf8',
      marginRight: '6px'
    }
  }), " Additional Notes ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#64748b',
      fontWeight: '500'
    }
  }, "(optional)")), /*#__PURE__*/React.createElement("textarea", {
    className: "input-sky",
    rows: "3",
    placeholder: "Any special message for the clinic coordinator...",
    value: rescheduleForm.notes,
    onChange: e => setRescheduleForm({
      ...rescheduleForm,
      notes: e.target.value
    }),
    style: {
      resize: 'none'
    }
  })))), /*#__PURE__*/React.createElement("div", {
    className: "reschedule-modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-outline",
    style: {
      flex: 1
    },
    onClick: () => setRescheduleModalOpen(false)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark"
  }), " Cancel"), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      flex: 2
    },
    onClick: () => {
      if (!rescheduleForm.date) {
        markInvalidField(document.getElementById('reschedule-date-input'), 'Please select a new appointment date');
        return;
      }
      // Update appointment in state
      setOwnerVetAppointments(prev => prev.map(a => a.id === selectedAptToReschedule.id ? {
        ...a,
        date: rescheduleForm.date,
        time: rescheduleForm.time,
        status: 'Rescheduled'
      } : a));
      setRescheduleModalOpen(false);
      setRescheduleSuccessModal(true);
      if (window.SoundEngine) window.SoundEngine.playChime();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-calendar-check"
  }), " Confirm Reschedule")))), rescheduleSuccessModal && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setRescheduleSuccessModal(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "reschedule-success-dialog",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "reschedule-success-icon"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "reschedule-success-title"
  }, "Appointment Rescheduled!"), /*#__PURE__*/React.createElement("p", {
    className: "reschedule-success-sub"
  }, "Your appointment with ", /*#__PURE__*/React.createElement("strong", null, selectedAptToReschedule && selectedAptToReschedule.doctorName), " has been updated. A confirmation notification has been sent to your registered email."), /*#__PURE__*/React.createElement("div", {
    className: "reschedule-success-info-box"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-calendar-check",
    style: {
      color: '#38bdf8'
    }
  }), " ", /*#__PURE__*/React.createElement("strong", null, "New Date:"), " ", rescheduleForm.date), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-clock",
    style: {
      color: '#38bdf8'
    }
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Time Slot:"), " ", rescheduleForm.time)), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      width: '100%'
    },
    onClick: () => setRescheduleSuccessModal(false)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-check"
  }), " Done"))), directionsModalOpen && selectedAptForDirections && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setDirectionsModalOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog-content directions-modal-dialog",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "directions-modal-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "directions-modal-icon-wrap"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-map-location-dot"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "directions-modal-title"
  }, "Clinic Directions & GPS Route"), /*#__PURE__*/React.createElement("p", {
    className: "directions-modal-subtitle"
  }, "Turn-by-turn route to ", /*#__PURE__*/React.createElement("strong", null, selectedAptForDirections.clinic))), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon directions-close-btn",
    onClick: () => setDirectionsModalOpen(false)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "directions-scrollable-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "directions-map-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "directions-map-grid-pattern"
  }), /*#__PURE__*/React.createElement("svg", {
    className: "directions-route-svg",
    viewBox: "0 0 400 160"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 40,120 Q 120,40 200,90 T 360,50",
    fill: "none",
    stroke: "rgba(56, 189, 248, 0.4)",
    strokeWidth: "8",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 40,120 Q 120,40 200,90 T 360,50",
    fill: "none",
    stroke: "#38bdf8",
    strokeWidth: "4",
    strokeDasharray: "8,6",
    className: "animated-route-dash",
    strokeLinecap: "round"
  })), /*#__PURE__*/React.createElement("div", {
    className: "map-pin map-pin-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pin-circle pin-blue"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-location-arrow"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pin-label"
  }, "Your Location")), /*#__PURE__*/React.createElement("div", {
    className: "map-pin map-pin-dest"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pin-circle pin-rose"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-hospital"
  })), /*#__PURE__*/React.createElement("div", {
    className: "pin-label"
  }, selectedAptForDirections.clinic.split(' ')[0], " Hospital")), /*#__PURE__*/React.createElement("div", {
    className: "map-stats-pill"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#10b981',
      fontWeight: '800'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle",
    style: {
      fontSize: '0.6rem'
    }
  }), " Live Traffic: Fast"), /*#__PURE__*/React.createElement("span", {
    className: "map-stats-divider"
  }, "|"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, transitMode === 'driving' ? '14 Mins' : transitMode === 'transit' ? '24 Mins' : '42 Mins'), " (", transitMode === 'driving' ? '4.8 mi' : transitMode === 'transit' ? '5.2 mi' : '3.6 mi', ")"))), /*#__PURE__*/React.createElement("div", {
    className: "transit-mode-selector"
  }, /*#__PURE__*/React.createElement("button", {
    className: `transit-mode-btn ${transitMode === 'driving' ? 'active' : ''}`,
    onClick: () => {
      setTransitMode('driving');
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-car"
  }), /*#__PURE__*/React.createElement("span", null, "Driving (14 min)")), /*#__PURE__*/React.createElement("button", {
    className: `transit-mode-btn ${transitMode === 'transit' ? 'active' : ''}`,
    onClick: () => {
      setTransitMode('transit');
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-bus"
  }), /*#__PURE__*/React.createElement("span", null, "Transit (24 min)")), /*#__PURE__*/React.createElement("button", {
    className: `transit-mode-btn ${transitMode === 'walking' ? 'active' : ''}`,
    onClick: () => {
      setTransitMode('walking');
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-person-walking"
  }), /*#__PURE__*/React.createElement("span", null, "Walking (42 min)"))), /*#__PURE__*/React.createElement("div", {
    className: "directions-info-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "directions-info-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-icon-circle"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-location-dot"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.74rem',
      textTransform: 'uppercase',
      color: '#38bdf8',
      fontWeight: '700'
    }
  }, "Destination Address"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.92rem',
      fontWeight: '700',
      color: 'var(--text-main)'
    }
  }, selectedAptForDirections.clinic), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      color: 'var(--text-muted)'
    }
  }, "Central Park Pavilions, Suite 400, New York, NY 10024"))), /*#__PURE__*/React.createElement("div", {
    className: "directions-pet-perk-badge"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-paw",
    style: {
      color: '#10b981'
    }
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Pet Facility Perks:"), " Dedicated Pet Entrance Gate 4 \u2022 Complimentary Valet & Pet Stroller Loaners Available"))), /*#__PURE__*/React.createElement("div", {
    className: "directions-steps-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "directions-steps-header"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-route",
    style: {
      color: '#38bdf8'
    }
  }), /*#__PURE__*/React.createElement("span", null, "Turn-by-Turn Step Guidance (", transitMode === 'driving' ? 'via FDR & Central Park W' : transitMode === 'transit' ? 'via Subway Line A' : 'via Park Promenade', ")")), /*#__PURE__*/React.createElement("div", {
    className: "directions-steps-list"
  }, transitMode === 'driving' ? [{
    icon: 'fa-arrow-up',
    text: 'Head South on 5th Avenue toward E 72nd Street',
    dist: '0.8 miles'
  }, {
    icon: 'fa-arrow-right',
    text: 'Turn right onto Central Park South & merge into companion transit lane',
    dist: '1.6 miles'
  }, {
    icon: 'fa-arrow-left',
    text: 'Turn left into FurEver Medical Pavilion Campus Ramp',
    dist: '0.4 miles'
  }, {
    icon: 'fa-flag-checkered',
    text: 'Arrive at Outpatient Pet Triage & Reserved Visitor Parking Bay #B12',
    dist: 'Destination'
  }].map((step, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: "directions-step-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "step-icon-wrap"
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa-solid ${step.icon}`
  })), /*#__PURE__*/React.createElement("div", {
    className: "step-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "step-text"
  }, step.text), /*#__PURE__*/React.createElement("div", {
    className: "step-dist"
  }, step.dist)))) : transitMode === 'transit' ? [{
    icon: 'fa-person-walking',
    text: 'Walk 3 mins to 72nd St Subway Station',
    dist: '0.2 miles'
  }, {
    icon: 'fa-train-subway',
    text: 'Take Downtown Line A/C toward Central Campus (4 stops)',
    dist: '4.2 miles'
  }, {
    icon: 'fa-arrow-up',
    text: 'Take Elevator Exit to Park Pavilions Companion Gate',
    dist: '0.1 miles'
  }, {
    icon: 'fa-flag-checkered',
    text: 'Arrive at FurEver Central Clinic Main Lobby',
    dist: 'Destination'
  }].map((step, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: "directions-step-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "step-icon-wrap"
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa-solid ${step.icon}`
  })), /*#__PURE__*/React.createElement("div", {
    className: "step-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "step-text"
  }, step.text), /*#__PURE__*/React.createElement("div", {
    className: "step-dist"
  }, step.dist)))) : [{
    icon: 'fa-person-walking',
    text: 'Enter Central Park via 72nd St Green Corridor',
    dist: '0.5 miles'
  }, {
    icon: 'fa-arrow-right',
    text: 'Follow pet-friendly paved trail along Bethesda Promenade',
    dist: '2.1 miles'
  }, {
    icon: 'fa-arrow-left',
    text: 'Take West Gate exit toward Medical Pavilion Lawn',
    dist: '1.0 miles'
  }, {
    icon: 'fa-flag-checkered',
    text: 'Arrive at Clinic Pet Garden & Welcome Desk',
    dist: 'Destination'
  }].map((step, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: "directions-step-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "step-icon-wrap"
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa-solid ${step.icon}`
  })), /*#__PURE__*/React.createElement("div", {
    className: "step-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "step-text"
  }, step.text), /*#__PURE__*/React.createElement("div", {
    className: "step-dist"
  }, step.dist)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedAptForDirections.clinic + ' Central Park New York')}`,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "btn-sky-outline",
    style: {
      flex: 1,
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '10px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-arrow-up-right-from-square"
  }), " Open in Google Maps"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-sky-outline",
    style: {
      flex: 1,
      padding: '10px'
    },
    onClick: () => {
      navigator.clipboard && navigator.clipboard.writeText('40.7128° N, 74.0060° W - Central Park Pavilions, Suite 400, New York, NY 10024');
      addToast('GPS Coordinates copied to clipboard!', 'fa-copy');
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-copy"
  }), " Copy Coordinates"))), /*#__PURE__*/React.createElement("div", {
    className: "directions-modal-footer"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-outline",
    style: {
      flex: 1
    },
    onClick: () => setDirectionsModalOpen(false)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark"
  }), " Close"), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      flex: 2
    },
    onClick: () => {
      setDirectionsModalOpen(false);
      setDirectionsSuccessModal(true);
      if (window.SoundEngine) window.SoundEngine.playChime();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-location-arrow"
  }), " Start Live Navigation")))), directionsSuccessModal && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setDirectionsSuccessModal(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "reschedule-success-dialog",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "reschedule-success-icon",
    style: {
      background: 'rgba(14, 165, 233, 0.2)',
      borderColor: '#38bdf8',
      color: '#38bdf8'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-compass"
  })), /*#__PURE__*/React.createElement("h3", {
    className: "reschedule-success-title"
  }, "Navigation Dispatched!"), /*#__PURE__*/React.createElement("p", {
    className: "reschedule-success-sub"
  }, "Live GPS route to ", /*#__PURE__*/React.createElement("strong", null, selectedAptForDirections && selectedAptForDirections.clinic), " is ready. Drive safely with your furry companion!"), /*#__PURE__*/React.createElement("div", {
    className: "reschedule-success-info-box"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-clock",
    style: {
      color: '#38bdf8'
    }
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Estimated Arrival:"), " 14 Minutes (4.8 Miles)"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-square-parking",
    style: {
      color: '#10b981'
    }
  }), " ", /*#__PURE__*/React.createElement("strong", null, "Parking:"), " Free Valet at Gate 4")), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      width: '100%'
    },
    onClick: () => setDirectionsSuccessModal(false)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-check"
  }), " Done & Return"))), sosModalOpen && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setSosModalOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog-content",
    style: {
      borderColor: '#f43f5e',
      maxWidth: '680px',
      maxHeight: '88vh',
      overflowY: 'auto'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '18px',
      borderBottom: '1px solid rgba(244,63,94,0.2)',
      paddingBottom: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "badge-sky",
    style: {
      background: 'rgba(239,68,68,0.12)',
      color: '#ef4444',
      borderColor: 'rgba(239,68,68,0.3)',
      marginBottom: '4px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-truck-medical"
  }), " 24/7 Rapid Triage"), /*#__PURE__*/React.createElement("h3", {
    style: {
      color: '#e11d48',
      fontSize: '1.4rem',
      margin: 0,
      fontFamily: 'var(--font-heading)'
    }
  }, "Pet Emergency & First-Aid Handbook")), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    onClick: () => setSosModalOpen(false)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      marginBottom: '18px'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "tel:18884264435",
    style: {
      padding: '10px 14px',
      background: 'linear-gradient(135deg, #e11d48, #be123c)',
      color: '#fff',
      borderRadius: 'var(--radius-md)',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '0.86rem',
      fontWeight: '700'
    },
    onClick: () => {
      if (window.SoundEngine) window.SoundEngine.playAlarm();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-phone-volume",
    style: {
      fontSize: '1.2rem'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.68rem',
      opacity: 0.85
    }
  }, "24/7 ASPCA POISON"), /*#__PURE__*/React.createElement("div", null, "(888) 426-4435"))), /*#__PURE__*/React.createElement("a", {
    href: "https://wa.me/923001234567?text=\uD83D\uDEA8%20EMERGENCY%20SOS:%20My%20pet%20needs%20urgent%20critical%20care.",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      padding: '10px 14px',
      background: 'linear-gradient(135deg, #10b981, #059669)',
      color: '#fff',
      borderRadius: 'var(--radius-md)',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '0.86rem',
      fontWeight: '700'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-whatsapp",
    style: {
      fontSize: '1.3rem'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.68rem',
      opacity: 0.85
    }
  }, "WHATSAPP ER (PK)"), /*#__PURE__*/React.createElement("div", null, "+92 300 1234567")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }
  }, [{
    title: '1. Pet CPR (Cardiac & Breathing Arrest)',
    color: '#ef4444',
    steps: 'Place pet on right side. Deliver 30 rapid chest compressions (100-120 BPM) followed by 2 breaths into pet nostrils. Repeat cycle.',
    dont: 'Do not perform compressions if pet is breathing or conscious.'
  }, {
    title: '2. Choking & Foreign Object Airway Obstruction',
    color: '#f43f5e',
    steps: 'Open mouth carefully; if visible object, sweep gently with finger. For medium/large dogs, perform modified Heimlich by applying upward abdominal thrusts behind ribcage.',
    dont: 'Do NOT poke fingers blindly into throat.'
  }, {
    title: '3. Toxic Chemical / Plant Ingestion',
    color: '#8b5cf6',
    steps: 'Identify substance and keep container. Rinse mouth and paws if topical. Call ASPCA Poison Control (888) 426-4435 immediately.',
    dont: 'Do NOT induce vomiting unless explicitly ordered by a toxicologist.'
  }, {
    title: '4. Severe Bleeding & Hemorrhage',
    color: '#e11d48',
    steps: 'Apply firm continuous direct pressure using sterile gauze. Elevate bleeding limb. Wrap with elastic bandage without restricting blood flow.',
    dont: 'Do not remove blood-soaked pads — add new gauze on top.'
  }, {
    title: '5. Heatstroke & Overheating (>104°F)',
    color: '#f59e0b',
    steps: 'Move to AC immediately. Apply room-temperature cool water to groin, neck and paws. Turn on electric fans. Give small sips of cool water.',
    dont: 'NEVER submerge in ice water — causes vascular shock.'
  }, {
    title: '6. Bone Fractures & Car Hit Trauma',
    color: '#0284c7',
    steps: 'Minimize movement. Slide pet onto a rigid board or taut blanket stretcher. Wrap in warm foil blanket to prevent shock and transport immediately.',
    dont: 'Do not attempt to push or realign broken bones.'
  }].map((proto, pidx) => /*#__PURE__*/React.createElement("div", {
    key: pidx,
    style: {
      padding: '14px 16px',
      background: `${proto.color}0a`,
      borderRadius: 'var(--radius-md)',
      border: `1.5px solid ${proto.color}35`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '800',
      color: proto.color,
      fontSize: '0.92rem',
      marginBottom: '4px'
    }
  }, proto.title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.84rem',
      color: 'var(--text-main)',
      margin: '0 0 6px',
      lineHeight: '1.5'
    }
  }, proto.steps), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.76rem',
      color: '#e11d48',
      fontWeight: '700',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-xmark"
  }), " Warning: ", proto.dont)))), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      width: '100%',
      marginTop: '18px',
      padding: '12px',
      fontWeight: '800'
    },
    onClick: () => {
      setSosModalOpen(false);
      setActiveTab('emergency');
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-satellite-dish"
  }), " Open Full Emergency Station Tab"))), profileUpdateSuccess && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    style: {
      zIndex: 9999
    },
    onClick: () => setProfileUpdateSuccess(false)
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-xl)',
      maxWidth: '380px',
      width: '92%',
      overflow: 'hidden',
      boxShadow: '0 40px 100px rgba(0,0,0,0.3)',
      border: '2px solid rgba(16,185,129,0.4)',
      animation: 'scaleUp 0.35s cubic-bezier(0.34,1.56,0.64,1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'linear-gradient(135deg,#10b981 0%,#059669 100%)',
      padding: '28px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '64px',
      height: '64px',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 12px',
      border: '3px solid rgba(255,255,255,0.5)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check",
    style: {
      fontSize: '2rem',
      color: '#fff'
    }
  })), /*#__PURE__*/React.createElement("h2", {
    style: {
      color: '#fff',
      fontWeight: '900',
      fontSize: '1.25rem',
      margin: '0 0 4px'
    }
  }, "Profile Updated!"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,255,255,0.85)',
      fontSize: '0.84rem',
      margin: 0
    }
  }, petForm.name, "'s profile has been saved successfully")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 24px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      justifyContent: 'center',
      marginBottom: '14px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'rgba(16,185,129,0.1)',
      border: '1px solid rgba(16,185,129,0.3)',
      borderRadius: 'var(--radius-md)',
      padding: '6px 12px',
      fontSize: '0.78rem',
      fontWeight: '700',
      color: '#059669'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-paw",
    style: {
      marginRight: '5px'
    }
  }), petForm.name), /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'rgba(14,165,233,0.1)',
      border: '1px solid rgba(14,165,233,0.3)',
      borderRadius: 'var(--radius-md)',
      padding: '6px 12px',
      fontSize: '0.78rem',
      fontWeight: '700',
      color: '#0ea5e9'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-dog",
    style: {
      marginRight: '5px'
    }
  }), petForm.species)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setProfileUpdateSuccess(false),
    className: "btn-sky-primary",
    style: {
      width: '100%',
      padding: '11px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-check",
    style: {
      marginRight: '6px'
    }
  }), "Great, Done!")))), medModalOpen && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setMedModalOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog-content",
    onClick: e => e.stopPropagation(),
    style: {
      padding: '0',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'linear-gradient(135deg,#0ea5e9 0%,#0369a1 100%)',
      padding: '20px 26px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '38px',
      height: '38px',
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-notes-medical",
    style: {
      color: '#fff',
      fontSize: '1rem'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      color: '#fff',
      fontWeight: '800',
      fontSize: '1.1rem',
      margin: 0
    }
  }, "Log New Clinical Checkup"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: '0.76rem',
      margin: 0
    }
  }, petForm.name, " \u2022 FurEver Care Medical Record"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMedModalOpen(false),
    style: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      color: '#fff',
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 28px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      maxHeight: '65vh',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-calendar",
    style: {
      color: 'var(--primary-500)',
      marginRight: '5px'
    }
  }), " Consultation Date *"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    id: "med-date-input",
    className: "input-sky",
    value: newMedForm.date,
    onChange: e => setNewMedForm({
      ...newMedForm,
      date: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-user-doctor",
    style: {
      color: 'var(--primary-500)',
      marginRight: '5px'
    }
  }), " Attending Veterinarian *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "med-vet-input",
    className: "input-sky",
    placeholder: "e.g. Dr. Sarah Jenkins, DVM",
    value: newMedForm.vetName,
    onChange: e => setNewMedForm({
      ...newMedForm,
      vetName: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-stethoscope",
    style: {
      color: 'var(--primary-500)',
      marginRight: '5px'
    }
  }), " Diagnosis / Reason for Visit *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "med-diag-input",
    className: "input-sky",
    placeholder: "e.g. Ear Infection Cytology & Cleanse",
    value: newMedForm.diagnosis,
    onChange: e => setNewMedForm({
      ...newMedForm,
      diagnosis: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-pills",
    style: {
      color: 'var(--primary-500)',
      marginRight: '5px'
    }
  }), " Prescriptions & Therapy"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-sky",
    placeholder: "e.g. Posatex Otic Drops (4 drops twice daily)",
    value: newMedForm.medications,
    onChange: e => setNewMedForm({
      ...newMedForm,
      medications: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-notes-medical",
    style: {
      color: 'var(--primary-500)',
      marginRight: '5px'
    }
  }), " Doctor Observation Notes"), /*#__PURE__*/React.createElement("textarea", {
    className: "input-sky",
    rows: "2",
    placeholder: "Clinical notes, follow-up instructions...",
    value: newMedForm.notes,
    onChange: e => setNewMedForm({
      ...newMedForm,
      notes: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setMedModalOpen(false),
    className: "btn-sky-outline",
    style: {
      flex: 1,
      padding: '11px'
    }
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-sky-primary",
    style: {
      flex: 2,
      padding: '11px',
      fontSize: '0.95rem',
      fontWeight: '800'
    },
    onClick: () => {
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
      setNewMedForm({
        date: '',
        vetName: '',
        diagnosis: '',
        medications: '',
        notes: ''
      });
      setMedModalOpen(false);
      if (window.SoundEngine) window.SoundEngine.playChime();
      addToast(`Medical record added to ${petForm.name}'s passport!`, 'fa-circle-check');
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-circle-check",
    style: {
      marginRight: '7px'
    }
  }), "Save Medical Record"))))), vacModalOpen && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => setVacModalOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog-content",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: '1.3rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-syringe",
    style: {
      color: 'var(--primary-500)',
      marginRight: '8px'
    }
  }), " Record New Vaccination"), /*#__PURE__*/React.createElement("button", {
    className: "btn-icon",
    onClick: () => setVacModalOpen(false)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark"
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted)',
      fontSize: '0.85rem',
      marginBottom: '18px'
    }
  }, "Log immunization booster received by ", petForm.name, "."), /*#__PURE__*/React.createElement("form", {
    noValidate: true,
    onSubmit: e => {
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
      setNewVacForm({
        name: '',
        administeredDate: '',
        dueDate: '',
        vet: ''
      });
      setVacModalOpen(false);
      if (window.SoundEngine) window.SoundEngine.playChime();
      addToast(`Added ${newVac.name} to immunization records!`, 'fa-circle-check');
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Vaccine Name *"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    id: "vac-name-input",
    className: "input-sky",
    placeholder: "e.g. Canine Influenza H3N2",
    value: newVacForm.name,
    onChange: e => setNewVacForm({
      ...newVacForm,
      name: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Administering Vet"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    className: "input-sky",
    placeholder: "e.g. Dr. Sarah Jenkins",
    value: newVacForm.vet,
    onChange: e => setNewVacForm({
      ...newVacForm,
      vet: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Date Administered *"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    id: "vac-date-input",
    className: "input-sky",
    value: newVacForm.administeredDate,
    onChange: e => setNewVacForm({
      ...newVacForm,
      administeredDate: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom"
  }, "Next Booster Due Date"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    className: "input-sky",
    value: newVacForm.dueDate,
    onChange: e => setNewVacForm({
      ...newVacForm,
      dueDate: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn-sky-primary",
    style: {
      width: '100%'
    }
  }, "Save Vaccination Record")))), groomingModalOpen && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => {
      setGroomingModalOpen(false);
      setGroomingFormErrors({});
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog-content",
    onClick: e => e.stopPropagation(),
    style: {
      maxHeight: '92vh',
      overflowY: 'auto',
      padding: '0',
      borderRadius: '20px',
      maxWidth: '520px',
      width: '95%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
      padding: '24px 28px 20px',
      borderRadius: '20px 20px 0 0',
      position: 'sticky',
      top: 0,
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '50%',
      width: '38px',
      height: '38px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-scissors",
    style: {
      color: '#fff',
      fontSize: '1rem'
    }
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      color: '#fff',
      fontSize: '1.2rem',
      margin: 0,
      fontWeight: '800'
    }
  }, "Book Grooming Spa Session")), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: '0.8rem',
      margin: '6px 0 0 48px'
    }
  }, "Schedule professional spa for ", /*#__PURE__*/React.createElement("strong", null, petForm.name))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setGroomingModalOpen(false);
      setGroomingFormErrors({});
    },
    style: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      borderRadius: '50%',
      width: '34px',
      height: '34px',
      cursor: 'pointer',
      color: '#fff',
      fontSize: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '24px 28px',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      background: 'var(--bg-surface)',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-glass)',
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: petForm.photo,
    alt: petForm.name,
    style: {
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid var(--primary-400)'
    },
    onError: e => {
      e.target.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200';
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '700',
      fontSize: '0.95rem'
    }
  }, petForm.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.78rem',
      color: 'var(--text-muted)'
    }
  }, petForm.species, " - ", petForm.breed)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      background: 'rgba(14,165,233,0.12)',
      color: 'var(--primary-600)',
      padding: '3px 10px',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.72rem',
      fontWeight: '700'
    }
  }, "Spa Booking")), /*#__PURE__*/React.createElement("form", {
    noValidate: true,
    onSubmit: e => {
      e.preventDefault();
      const errors = {};
      if (!groomingForm.date) errors.date = 'Please select a preferred date';
      const today = new Date();
      today.setHours(0, 0, 0, 0);
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
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom",
    style: {
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom",
    style: {
      fontWeight: '700',
      marginBottom: '6px',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-spa",
    style: {
      color: 'var(--primary-500)',
      marginRight: '6px'
    }
  }), "Select Grooming Treatment *"), /*#__PURE__*/React.createElement("select", {
    className: "input-sky",
    value: groomingForm.service,
    onChange: e => setGroomingForm({
      ...groomingForm,
      service: e.target.value
    }),
    style: {
      borderRadius: '10px'
    }
  }, /*#__PURE__*/React.createElement("option", null, "Full Luxury Spa, Deshedding & Hydro-Bath ($65)"), /*#__PURE__*/React.createElement("option", null, "Breed Styling Haircut & Fluff Dry ($55)"), /*#__PURE__*/React.createElement("option", null, "Gentle Oatmeal Bath & Blowdry ($40)"), /*#__PURE__*/React.createElement("option", null, "Nail Grinding, Ear Cleanse & Paw Pad Balm ($28)"), /*#__PURE__*/React.createElement("option", null, "Ultrasonic Teeth Cleaning & Breath Polish ($30)"))), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom",
    style: {
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom",
    style: {
      fontWeight: '700',
      marginBottom: '6px',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-store",
    style: {
      color: 'var(--primary-500)',
      marginRight: '6px'
    }
  }), "Preferred Grooming Salon *"), /*#__PURE__*/React.createElement("select", {
    className: "input-sky",
    value: groomingForm.groomer,
    onChange: e => setGroomingForm({
      ...groomingForm,
      groomer: e.target.value
    }),
    style: {
      borderRadius: '10px'
    }
  }, /*#__PURE__*/React.createElement("option", null, "Paws & Bubbles Master Spa Salon"), /*#__PURE__*/React.createElement("option", null, "Bella Pet Styling Studio"), /*#__PURE__*/React.createElement("option", null, "FurEver Mobile Grooming Van (At-Home Service)"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '14px',
      marginBottom: '16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom",
    style: {
      fontWeight: '700',
      marginBottom: '6px',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-calendar",
    style: {
      color: 'var(--primary-500)',
      marginRight: '6px'
    }
  }), "Preferred Date *"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    id: "grooming-date-input",
    className: "input-sky",
    value: groomingForm.date,
    onChange: e => {
      setGroomingForm({
        ...groomingForm,
        date: e.target.value
      });
      setGroomingFormErrors({
        ...groomingFormErrors,
        date: ''
      });
    },
    style: {
      borderRadius: '10px',
      border: groomingFormErrors.date ? '2px solid #ef4444' : ''
    }
  }), groomingFormErrors.date && /*#__PURE__*/React.createElement("div", {
    style: {
      color: '#ef4444',
      fontSize: '0.74rem',
      marginTop: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-exclamation"
  }), " ", groomingFormErrors.date)), /*#__PURE__*/React.createElement("div", {
    className: "form-group-custom"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label-custom",
    style: {
      fontWeight: '700',
      marginBottom: '6px',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-clock",
    style: {
      color: 'var(--primary-500)',
      marginRight: '6px'
    }
  }), "Preferred Time *"), /*#__PURE__*/React.createElement("select", {
    className: "input-sky",
    value: groomingForm.time,
    onChange: e => setGroomingForm({
      ...groomingForm,
      time: e.target.value
    }),
    style: {
      borderRadius: '10px'
    }
  }, /*#__PURE__*/React.createElement("option", null, "09:30 AM"), /*#__PURE__*/React.createElement("option", null, "11:00 AM"), /*#__PURE__*/React.createElement("option", null, "01:30 PM"), /*#__PURE__*/React.createElement("option", null, "03:00 PM"), /*#__PURE__*/React.createElement("option", null, "04:30 PM")))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px',
      background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(99,102,241,0.08))',
      borderRadius: '12px',
      border: '1px solid var(--border-glass)',
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.76rem',
      fontWeight: '700',
      color: 'var(--text-muted)',
      textTransform: 'uppercase',
      marginBottom: '8px'
    }
  }, "Booking Summary"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.88rem',
      color: 'var(--text-main)',
      fontWeight: '600'
    }
  }, groomingForm.service.split('(')[0].trim()), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      color: 'var(--text-muted)',
      marginTop: '4px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-store",
    style: {
      marginRight: '5px'
    }
  }), groomingForm.groomer), groomingForm.date && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      color: 'var(--primary-600)',
      marginTop: '4px',
      fontWeight: '600'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-calendar-check",
    style: {
      marginRight: '5px'
    }
  }), groomingForm.date, " at ", groomingForm.time)), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn-sky-primary",
    style: {
      width: '100%',
      padding: '14px',
      fontWeight: '800',
      fontSize: '1rem',
      borderRadius: '12px',
      boxShadow: '0 4px 16px rgba(14,165,233,0.35)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-calendar-check",
    style: {
      marginRight: '8px'
    }
  }), "Confirm Grooming Booking"))))), groomingSuccess && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    style: {
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(10px)',
      zIndex: 99999
    },
    onClick: () => setGroomingSuccess(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog-content",
    onClick: e => e.stopPropagation(),
    style: {
      background: 'var(--bg-card, #ffffff)',
      borderRadius: '26px',
      padding: '36px 30px',
      textAlign: 'center',
      maxWidth: '420px',
      width: '92%',
      boxShadow: '0 25px 70px rgba(14, 165, 233, 0.4)',
      border: '2px solid rgba(14, 165, 233, 0.3)',
      animation: 'scaleUp 0.3s ease'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '84px',
      height: '84px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #6366f1 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      boxShadow: '0 8px 30px rgba(14, 165, 233, 0.5)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check",
    style: {
      color: '#ffffff',
      fontSize: '2.6rem'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "badge-sky",
    style: {
      fontSize: '0.8rem',
      padding: '5px 16px',
      marginBottom: '10px',
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-sparkles"
  }), " Appointment Confirmed"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.6rem',
      fontWeight: '900',
      color: 'var(--text-main, #0f172a)',
      margin: '8px 0 10px'
    }
  }, "Grooming Spa Booked!"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted, #475569)',
      fontSize: '0.92rem',
      lineHeight: '1.6',
      margin: '0 0 16px'
    }
  }, "Your session for ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--primary-500, #0ea5e9)'
    }
  }, petForm.name), " has been successfully confirmed."), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 18px',
      background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
      borderRadius: '16px',
      border: '1.5px solid rgba(14, 165, 233, 0.2)',
      marginBottom: '20px',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '6px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-spa",
    style: {
      color: 'var(--primary-500, #0ea5e9)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: '700',
      fontSize: '0.9rem',
      color: 'var(--text-main, #0f172a)'
    }
  }, groomingForm.service ? groomingForm.service.split('(')[0].trim() : 'Luxury Grooming & Spa')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '0.82rem',
      color: 'var(--text-muted, #64748b)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-clock",
    style: {
      color: 'var(--primary-500, #0ea5e9)'
    }
  }), /*#__PURE__*/React.createElement("span", null, groomingForm.date || 'Scheduled', " at ", groomingForm.time))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginBottom: '22px'
    }
  }, ['🛁 Luxury Bath', '✂️ Styling', '🔔 SMS Reminder Active'].map(tag => /*#__PURE__*/React.createElement("span", {
    key: tag,
    style: {
      background: 'rgba(14,165,233,0.12)',
      color: 'var(--primary-600, #0284c7)',
      padding: '5px 12px',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.75rem',
      fontWeight: '700'
    }
  }, tag))), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      width: '100%',
      padding: '14px',
      fontWeight: '800',
      fontSize: '1rem',
      borderRadius: '14px',
      background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
      boxShadow: '0 6px 20px rgba(14, 165, 233, 0.4)'
    },
    onClick: () => {
      setGroomingSuccess(false);
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-check",
    style: {
      marginRight: '8px'
    }
  }), " Got It, Thanks!"))), reminderModalOpen && reminderModalData && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    onClick: () => {
      setReminderModalOpen(false);
      setReminderSuccess(false);
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog-content",
    onClick: e => e.stopPropagation(),
    style: {
      maxHeight: '92vh',
      overflowY: 'auto',
      padding: '0',
      borderRadius: '20px',
      maxWidth: '480px',
      width: '95%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)',
      padding: '22px 26px 18px',
      borderRadius: '20px 20px 0 0',
      position: 'sticky',
      top: 0,
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'rgba(255,255,255,0.2)',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-bell",
    style: {
      color: '#fff',
      fontSize: '1rem'
    }
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      color: '#fff',
      fontSize: '1.1rem',
      margin: 0,
      fontWeight: '800'
    }
  }, "Send Grooming Reminder"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: '0.76rem',
      margin: 0
    }
  }, "Notify yourself before the appointment"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setReminderModalOpen(false);
      setReminderSuccess(false);
    },
    style: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      borderRadius: '50%',
      width: '32px',
      height: '32px',
      cursor: 'pointer',
      color: '#fff',
      fontSize: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-xmark"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '22px 26px',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px',
      background: 'var(--bg-surface)',
      borderRadius: '14px',
      border: '1px solid var(--border-glass)',
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--primary-700)',
      fontSize: '1rem'
    }
  }, reminderModalData.service), /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'rgba(14,165,233,0.12)',
      color: 'var(--primary-600)',
      padding: '3px 10px',
      borderRadius: 'var(--radius-full)',
      fontSize: '0.72rem',
      fontWeight: '700'
    }
  }, reminderModalData.status)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.84rem',
      color: 'var(--text-muted)',
      marginBottom: '5px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-store",
    style: {
      color: 'var(--primary-500)',
      marginRight: '6px'
    }
  }), reminderModalData.groomer), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.84rem',
      color: 'var(--text-muted)',
      marginBottom: '5px'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-clock",
    style: {
      color: 'var(--primary-500)',
      marginRight: '6px'
    }
  }), reminderModalData.date, " at ", reminderModalData.time, " - ", /*#__PURE__*/React.createElement("strong", null, reminderModalData.price)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.84rem',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-paw",
    style: {
      color: 'var(--primary-500)',
      marginRight: '6px'
    }
  }), "For: ", /*#__PURE__*/React.createElement("strong", null, petForm.name))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: '20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '700',
      fontSize: '0.85rem',
      marginBottom: '12px',
      color: 'var(--text-main)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-sliders",
    style: {
      color: 'var(--primary-500)',
      marginRight: '6px'
    }
  }), "Choose Reminder Options"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      maxHeight: '230px',
      overflowY: 'auto',
      paddingRight: '4px'
    }
  }, [{
    icon: 'fa-message-sms',
    label: 'SMS Reminder',
    desc: 'Text message 2 hours before',
    color: '#10b981'
  }, {
    icon: 'fa-envelope',
    label: 'Email Reminder',
    desc: 'Email notification 1 day before',
    color: '#6366f1'
  }, {
    icon: 'fa-comment',
    label: 'WhatsApp Reminder',
    desc: 'WhatsApp message morning of appointment',
    color: '#25D366'
  }, {
    icon: 'fa-bell',
    label: 'Push Notification',
    desc: 'App notification 30 minutes before',
    color: '#f59e0b'
  }, {
    icon: 'fa-phone',
    label: 'Phone Call Reminder',
    desc: 'Automated call 1 hour before',
    color: '#0ea5e9'
  }].map((opt, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 14px',
      background: 'var(--bg-surface)',
      borderRadius: '10px',
      border: '1px solid var(--border-glass)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      background: opt.color + '20',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: 'fa-solid ' + opt.icon,
    style: {
      color: opt.color,
      fontSize: '0.9rem'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '700',
      fontSize: '0.88rem',
      color: 'var(--text-main)'
    }
  }, opt.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.75rem',
      color: 'var(--text-muted)'
    }
  }, opt.desc)), /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check",
    style: {
      color: opt.color,
      fontSize: '1.1rem'
    }
  }))))), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      width: '100%',
      padding: '13px',
      fontWeight: '800',
      fontSize: '0.98rem',
      borderRadius: '12px',
      background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
      boxShadow: '0 4px 14px rgba(14,165,233,0.35)'
    },
    onClick: () => {
      setReminderModalOpen(false);
      setReminderSuccess(true);
      setTimeout(() => setReminderSuccess(false), 4500);
      if (window.SoundEngine) window.SoundEngine.playChime();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-paper-plane",
    style: {
      marginRight: '8px'
    }
  }), "Continue - Send All Reminders")))), reminderSuccess && /*#__PURE__*/React.createElement("div", {
    className: "modal-overlay",
    style: {
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(10px)',
      zIndex: 99999
    },
    onClick: () => setReminderSuccess(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog-content",
    onClick: e => e.stopPropagation(),
    style: {
      background: 'var(--bg-card, #ffffff)',
      borderRadius: '26px',
      padding: '36px 30px',
      textAlign: 'center',
      maxWidth: '420px',
      width: '92%',
      boxShadow: '0 25px 70px rgba(14, 165, 233, 0.4)',
      border: '2px solid rgba(14, 165, 233, 0.3)',
      animation: 'scaleUp 0.3s ease'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '84px',
      height: '84px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #6366f1 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px',
      boxShadow: '0 8px 30px rgba(14, 165, 233, 0.5)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-bell",
    style: {
      color: '#ffffff',
      fontSize: '2.4rem'
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "badge-sky",
    style: {
      fontSize: '0.8rem',
      padding: '5px 16px',
      marginBottom: '10px',
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-clock-rotate-left"
  }), " Notifications Scheduled"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: '1.6rem',
      fontWeight: '900',
      color: 'var(--text-main, #0f172a)',
      margin: '8px 0 10px'
    }
  }, "Reminders Scheduled!"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-muted, #475569)',
      fontSize: '0.92rem',
      lineHeight: '1.6',
      margin: '0 0 16px'
    }
  }, "All reminders for ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--primary-500, #0ea5e9)'
    }
  }, reminderModalData ? reminderModalData.service : 'your appointment'), " have been successfully set."), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 18px',
      background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
      borderRadius: '16px',
      border: '1.5px solid rgba(14, 165, 233, 0.2)',
      marginBottom: '20px',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '6px',
      fontSize: '0.85rem',
      color: 'var(--text-main, #0f172a)',
      fontWeight: '600'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check",
    style: {
      color: '#0ea5e9'
    }
  }), /*#__PURE__*/React.createElement("span", null, "SMS Notification 2 hours prior")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '0.85rem',
      color: 'var(--text-main, #0f172a)',
      fontWeight: '600'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-check",
    style: {
      color: '#0ea5e9'
    }
  }), /*#__PURE__*/React.createElement("span", null, "WhatsApp & Email Alert on appointment morning"))), /*#__PURE__*/React.createElement("button", {
    className: "btn-sky-primary",
    style: {
      width: '100%',
      padding: '14px',
      fontWeight: '800',
      fontSize: '1rem',
      borderRadius: '14px',
      background: 'linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)',
      boxShadow: '0 6px 20px rgba(14, 165, 233, 0.4)'
    },
    onClick: () => {
      setReminderSuccess(false);
      if (window.SoundEngine) window.SoundEngine.playClicker();
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-check",
    style: {
      marginRight: '8px'
    }
  }), " Done"))), /*#__PURE__*/React.createElement("div", {
    className: "toast-container"
  }, toasts.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "toast-item"
  }, /*#__PURE__*/React.createElement("i", {
    className: `fa-solid ${t.icon}`,
    style: {
      color: 'var(--primary-500)',
      fontSize: '1.1rem'
    }
  }), /*#__PURE__*/React.createElement("span", null, t.msg)))), /*#__PURE__*/React.createElement("footer", {
    className: "luxury-main-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer-top-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer-col-brand"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer-brand-header",
    onClick: () => setActiveTab('home')
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo.png?v=13",
    alt: "FurEver Care Logo",
    className: "footer-logo-img"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "footer-brand-title"
  }, "FurEver Care"), /*#__PURE__*/React.createElement("span", {
    className: "footer-brand-sub"
  }, "They Deserve Forever Love"))), /*#__PURE__*/React.createElement("p", {
    className: "footer-brand-desc"
  }, "A unified digital ecosystem empowering pet parents, visionary veterinarians, and animal shelters with advanced clinical tools, transparent adoptions, and loving community care."), /*#__PURE__*/React.createElement("div", {
    className: "footer-social-row"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://wa.me/923001234567?text=Assalam-o-Alaikum%20FurEver%20Care%20AI%20Support",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "footer-social-btn whatsapp",
    title: "WhatsApp AI Support (+92 300 1234567)"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-whatsapp"
  })), /*#__PURE__*/React.createElement("a", {
    href: "https://www.instagram.com",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "footer-social-btn",
    title: "Instagram"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-instagram"
  })), /*#__PURE__*/React.createElement("a", {
    href: "https://www.facebook.com",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "footer-social-btn",
    title: "Facebook"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-facebook-f"
  })), /*#__PURE__*/React.createElement("a", {
    href: "https://twitter.com",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "footer-social-btn",
    title: "X (Twitter)"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-x-twitter"
  })), /*#__PURE__*/React.createElement("a", {
    href: "https://www.youtube.com",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "footer-social-btn",
    title: "YouTube"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-brands fa-youtube"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "footer-col"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "footer-heading"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-compass",
    style: {
      color: 'var(--primary-500)',
      marginRight: '8px'
    }
  }), "Platform Navigation"), /*#__PURE__*/React.createElement("ul", {
    className: "footer-links-list"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setActiveTab('home');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-chevron-right"
  }), " Home Overview")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setActiveTab('products');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-chevron-right"
  }), " Pet Store & Supplies")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setActiveTab('shelter');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-chevron-right"
  }), " Adoptable Pets Gallery")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setActiveTab('vet');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-chevron-right"
  }), " 45 Specialist Doctors")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setActiveTab('community');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-chevron-right"
  }), " Pet Lovers Community")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setActiveTab('about');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-chevron-right"
  }), " About FurEver Care")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setActiveTab('feedback');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-chevron-right"
  }), " Pet Parent Feedback")))), /*#__PURE__*/React.createElement("div", {
    className: "footer-col"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "footer-heading"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-stethoscope",
    style: {
      color: '#8b5cf6',
      marginRight: '8px'
    }
  }), "Services & Tools"), /*#__PURE__*/React.createElement("ul", {
    className: "footer-links-list"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setSosModalOpen(true),
    style: {
      color: '#f43f5e',
      fontWeight: '700'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-truck-medical"
  }), " 24/7 Emergency SOS")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setAiChatOpen(true)
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-robot"
  }), " AI PetBot Diagnostic")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setActiveTab('home');
      setPetOwnerSubTab('vaccines');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-syringe"
  }), " Vaccination Booster Log")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setActiveTab('home');
      setPetOwnerSubTab('tips');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-calculator"
  }), " Nutrition Daily Calculator")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setActiveTab('home');
      setPetOwnerSubTab('grooming');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-scissors"
  }), " Spa & Grooming Booking")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setActiveTab('vet');
      setVetViewMode('cases');
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-medical"
  }), " Clinical Case Studies")))), /*#__PURE__*/React.createElement("div", {
    className: "footer-col"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "footer-heading"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-headset",
    style: {
      color: '#10b981',
      marginRight: '8px'
    }
  }), "Care Desk & Updates"), /*#__PURE__*/React.createElement("div", {
    className: "footer-contact-items"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer-contact-row"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-phone",
    style: {
      color: 'var(--primary-500)'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.72rem',
      color: 'var(--text-light)',
      textTransform: 'uppercase'
    }
  }, "24/7 Clinical Hotline"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '700',
      fontSize: '0.92rem'
    }
  }, "(555) 912-3849"))), /*#__PURE__*/React.createElement("div", {
    className: "footer-contact-row"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-location-dot",
    style: {
      color: '#f43f5e'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.72rem',
      color: 'var(--text-light)',
      textTransform: 'uppercase'
    }
  }, "Main Campus"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: '600',
      fontSize: '0.85rem'
    }
  }, "Central Park Pavilions, New York")))), /*#__PURE__*/React.createElement("div", {
    className: "footer-newsletter-box"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '0.82rem',
      fontWeight: '700',
      marginBottom: '8px',
      color: 'var(--text-main)'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-regular fa-envelope",
    style: {
      marginRight: '6px',
      color: 'var(--primary-500)'
    }
  }), " Weekly Pet Tips & Adoption Drives"), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      const inp = e.target.elements.newsletterEmail;
      if (inp && inp.value.trim()) {
        if (window.SoundEngine) window.SoundEngine.playChime();
        addToast(`Subscribed ${inp.value} to weekly pet newsletter!`, 'fa-circle-check');
        inp.value = '';
      }
    },
    style: {
      display: 'flex',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "email",
    name: "newsletterEmail",
    className: "input-sky",
    placeholder: "Enter email...",
    style: {
      padding: '8px 12px',
      fontSize: '0.82rem'
    },
    required: true
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn-sky-primary",
    style: {
      padding: '8px 14px',
      fontSize: '0.85rem'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-paper-plane"
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "footer-bottom-bar"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.82rem',
      color: 'var(--text-light)'
    }
  }, "\xA9 2026 FurEver Care \u2022 TechWiz 6 Luxury Responsive Platform \u2022 All Rights Reserved.")), /*#__PURE__*/React.createElement("div", {
    className: "footer-badges-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "footer-pill-badge"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-shield-check",
    style: {
      color: '#10b981'
    }
  }), " Verified Vet Network"), /*#__PURE__*/React.createElement("span", {
    className: "footer-pill-badge"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-lock",
    style: {
      color: 'var(--primary-500)'
    }
  }), " 256-Bit SSL Encrypted"), /*#__PURE__*/React.createElement("span", {
    className: "footer-pill-badge"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-heart",
    style: {
      color: '#f43f5e'
    }
  }), " Ethical Pet Sanctuary"))))));
}

// Render React Root
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render( /*#__PURE__*/React.createElement(App, null));