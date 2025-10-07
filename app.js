// Enhanced Uruk Health Application JavaScript with Emergency Ambulance Features - FIXED VERSION
class UrukHealthApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.userData = {
            name: "Dr. Rajesh Kumar", 
            age: 45,
            medicalId: "URK-2024-1001",
            phone: "+91 9876543210",
            email: "rajesh.kumar@email.com",
            emergencyContact: "Sunita Kumar - +91 9876543211",
            role: "patient",
            blockchainId: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
            healthScore: 85,
            aiInsights: ["Blood pressure trending upward", "Exercise routine needs improvement", "Medication adherence excellent"],
            loyaltyPoints: 1250,
            insuranceId: "LIC-HEALTH-7894561230",
            defaultAddress: "123, Health Colony, Mumbai, Maharashtra 400001",
            location: {lat: 19.0760, lng: 72.8777}
        };

        // Emergency Ambulance Data from provided JSON
        this.ambulances = [
            {
                id: "AMB-001",
                type: "Advanced Life Support",
                driverName: "Ramesh Patil",
                driverPhone: "+91 9876543400",
                location: {lat: 19.0720, lng: 72.8740},
                distance: "1.2 km",
                eta: "8 minutes",
                status: "Available",
                equipment: ["ECG Monitor", "Defibrillator", "Oxygen", "IV Fluids", "Emergency Drugs"],
                hospitalNetwork: "Apollo Hospitals",
                rating: 4.8,
                licensePlate: "MH-01-AB-1234",
                lastUpdated: "2024-10-07T13:30:00Z"
            },
            {
                id: "AMB-002", 
                type: "Basic Life Support",
                driverName: "Suresh Kumar",
                driverPhone: "+91 9876543401",
                location: {lat: 19.0800, lng: 72.8820},
                distance: "2.1 km",
                eta: "12 minutes",
                status: "Available",
                equipment: ["Basic First Aid", "Oxygen", "Stretcher", "Wheelchair"],
                hospitalNetwork: "Max Healthcare",
                rating: 4.6,
                licensePlate: "MH-01-CD-5678",
                lastUpdated: "2024-10-07T13:32:00Z"
            },
            {
                id: "AMB-003",
                type: "ICU Ambulance",
                driverName: "Mahesh Singh",
                driverPhone: "+91 9876543402", 
                location: {lat: 19.0850, lng: 72.8650},
                distance: "3.5 km",
                eta: "18 minutes",
                status: "En Route",
                equipment: ["Ventilator", "Cardiac Monitor", "Defibrillator", "Emergency Surgery Kit", "Blood Bank"],
                hospitalNetwork: "Fortis Healthcare",
                rating: 4.9,
                licensePlate: "MH-01-EF-9012",
                lastUpdated: "2024-10-07T13:28:00Z"
            },
            {
                id: "AMB-004",
                type: "Patient Transport",
                driverName: "Vikash Yadav",
                driverPhone: "+91 9876543403",
                location: {lat: 19.0690, lng: 72.8900},
                distance: "4.2 km", 
                eta: "22 minutes",
                status: "Available",
                equipment: ["Basic Life Support", "Patient Comfort", "Wheelchair Access"],
                hospitalNetwork: "Lilavati Hospital",
                rating: 4.4,
                licensePlate: "MH-01-GH-3456",
                lastUpdated: "2024-10-07T13:31:00Z"
            }
        ];

        this.hospitals = [
            {
                name: "Apollo Hospital",
                location: {lat: 19.0650, lng: 72.8680},
                distance: "2.8 km",
                emergency: true,
                phone: "+91 22 26527000",
                specialties: ["Cardiology", "Emergency", "Trauma", "ICU"],
                beds: {total: 500, available: 45, icu: 12}
            },
            {
                name: "Max Healthcare",
                location: {lat: 19.0890, lng: 72.8950},
                distance: "3.2 km", 
                emergency: true,
                phone: "+91 22 42208888",
                specialties: ["Emergency", "Orthopedics", "Neurology", "Critical Care"],
                beds: {total: 350, available: 28, icu: 8}
            },
            {
                name: "Fortis Hospital",
                location: {lat: 19.0520, lng: 72.8450},
                distance: "4.1 km",
                emergency: true,
                phone: "+91 22 66754444",
                specialties: ["Cardiac Surgery", "Emergency", "Trauma", "Pediatric ICU"],
                beds: {total: 400, available: 32, icu: 15}
            }
        ];

        this.emergencyTypes = [
            {type: "Cardiac Emergency", priority: "Critical", icon: "❤️"},
            {type: "Accident/Trauma", priority: "Critical", icon: "🚗"},
            {type: "Respiratory Emergency", priority: "High", icon: "🫁"},
            {type: "Stroke/Neurological", priority: "Critical", icon: "🧠"},
            {type: "Diabetic Emergency", priority: "High", icon: "💉"},
            {type: "General Emergency", priority: "Medium", icon: "🚨"},
            {type: "Patient Transport", priority: "Low", icon: "🏥"}
        ];

        // Live tracking data
        this.liveTracking = {
            activeBooking: null,
            trackingEnabled: false,
            lastKnownLocation: null,
            estimatedArrival: null,
            driverContact: null,
            emergencyContactsNotified: false,
            status: "standby" // standby, dispatched, en-route, arrived
        };

        // Ambulance booking history
        this.bookingHistory = [
            {
                id: "BOOK-001",
                date: "2024-09-15T14:30:00Z",
                ambulanceId: "AMB-001",
                emergencyType: "Cardiac Emergency",
                status: "Completed",
                hospital: "Apollo Hospital",
                duration: "45 minutes",
                cost: 2500
            },
            {
                id: "BOOK-002", 
                date: "2024-08-22T09:15:00Z",
                ambulanceId: "AMB-002",
                emergencyType: "General Emergency", 
                status: "Completed",
                hospital: "Max Healthcare",
                duration: "30 minutes",
                cost: 1800
            }
        ];

        // Medical buy data (existing)
        this.medicines = [
            {
                id: 1,
                name: "Paracetamol 500mg",
                brand: "Crocin",
                genericName: "Acetaminophen",
                price: 25,
                discountPrice: 22,
                prescription: false,
                category: "Pain Relief",
                composition: "Paracetamol 500mg",
                manufacturer: "GSK",
                inStock: true,
                stockCount: 150,
                rating: 4.5,
                reviews: 1250,
                image: "https://via.placeholder.com/100x100/22c55e/ffffff?text=CROCIN",
                uses: ["Fever", "Headache", "Body pain"],
                sideEffects: ["Nausea", "Stomach upset"],
                dosage: "1-2 tablets every 4-6 hours"
            },
            {
                id: 2,
                name: "Amoxicillin 250mg",
                brand: "Novamox",
                genericName: "Amoxicillin",
                price: 85,
                discountPrice: 78,
                prescription: true,
                category: "Antibiotics",
                composition: "Amoxicillin 250mg",
                manufacturer: "Cipla",
                inStock: true,
                stockCount: 75,
                rating: 4.7,
                reviews: 890,
                image: "https://via.placeholder.com/100x100/dc2626/ffffff?text=NOVAMOX",
                uses: ["Bacterial infections", "Respiratory infections"],
                sideEffects: ["Diarrhea", "Nausea", "Skin rash"],
                dosage: "As prescribed by doctor"
            },
            {
                id: 3,
                name: "Omeprazole 20mg",
                brand: "Omez",
                genericName: "Omeprazole",
                price: 68,
                discountPrice: 61,
                prescription: false,
                category: "Heart Care",
                composition: "Omeprazole 20mg",
                manufacturer: "Dr. Reddy's",
                inStock: true,
                stockCount: 200,
                rating: 4.6,
                reviews: 750,
                image: "https://via.placeholder.com/100x100/0ea5e9/ffffff?text=OMEZ",
                uses: ["Acidity", "GERD", "Stomach ulcers"],
                sideEffects: ["Headache", "Constipation"],
                dosage: "1 tablet daily before meals"
            }
        ];

        this.cart = {
            items: [
                {
                    medicineId: 1,
                    quantity: 2,
                    pharmacy: "Apollo Pharmacy",
                    price: 22,
                    total: 44
                }
            ],
            subtotal: 44,
            deliveryFee: 0,
            discount: 4,
            total: 40
        };

        this.categories = [
            {name: "Pain Relief", icon: "💊", count: 45},
            {name: "Antibiotics", icon: "🦠", count: 28},
            {name: "Vitamins", icon: "🌟", count: 67},
            {name: "Heart Care", icon: "❤️", count: 34},
            {name: "Diabetes", icon: "🩺", count: 29},
            {name: "Skin Care", icon: "🧴", count: 52}
        ];

        this.vitalsData = [
            {
                date: "2024-10-07",
                heartRate: 72,
                bloodPressure: "120/80",
                temperature: 98.6,
                oxygenSat: 98,
                aiAnalysis: "Vitals are within normal range. Consider monitoring blood pressure trend.",
                blockchainHash: "0xabc123def456",
                riskLevel: "low"
            }
        ];

        this.emergencyContacts = [
            {name: "Uruk Emergency", number: "1800-URUK-911", type: "primary"},
            {name: "Local Ambulance", number: "102", type: "emergency"},
            {name: "Family Contact", number: "+91 9876543211", type: "personal"}
        ];

        this.notifications = [
            {
                id: 1,
                type: "ambulance_available",
                message: "3 ambulances available within 5km radius",
                time: "Just now",
                priority: "info"
            },
            {
                id: 2,
                type: "emergency_contact_updated",
                message: "Emergency contacts synced successfully",
                time: "2 hours ago", 
                priority: "success"
            }
        ];

        this.charts = {};
        this.currentSort = 'popularity';
        this.searchQuery = '';
        this.selectedCategory = null;
        this.selectedAmbulance = null;
        this.mapUpdateInterval = null;
        
        this.init();
    }

    init() {
        this.showLoadingScreen();
        setTimeout(() => {
            this.hideLoadingScreen();
            this.setupEventListeners();
            this.initializeDashboard();
            this.setupCharts();
            this.renderVitalsHistory();
            this.renderEmergencyContacts();
            this.renderNotifications();
            this.updateActivityFeed();
            this.updateCartCount();
            this.renderMedicalBuyContent();
            this.startAmbulanceTracking();
        }, 2000);
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.classList.remove('hidden');
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const app = document.getElementById('app');
        
        loadingScreen.classList.add('hidden');
        app.classList.add('loaded');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });

        // Quick actions
        document.getElementById('emergencyAmbulanceBtn')?.addEventListener('click', () => {
            this.navigateToPage('emergency-ambulance');
        });

        document.getElementById('medicalBuyBtn')?.addEventListener('click', () => {
            this.navigateToPage('medical-buy');
        });

        document.getElementById('addVitalsBtn')?.addEventListener('click', () => {
            this.navigateToPage('vitals');
        });

        document.getElementById('aiChatBtn')?.addEventListener('click', () => {
            this.navigateToPage('ai-assistant');
        });

        // Floating buttons
        document.getElementById('floatingEmergencyAmbulance')?.addEventListener('click', () => {
            this.navigateToPage('emergency-ambulance');
        });

        document.getElementById('floatingMedicalBuy')?.addEventListener('click', () => {
            this.navigateToPage('medical-buy');
        });

        // Emergency ambulance specific controls
        document.getElementById('panicBtn')?.addEventListener('click', () => {
            this.triggerPanicMode();
        });

        document.getElementById('voiceBtn')?.addEventListener('click', () => {
            this.activateVoiceCommand();
        });

        document.getElementById('refreshMapBtn')?.addEventListener('click', () => {
            this.refreshAmbulanceMap();
        });

        document.getElementById('centerMapBtn')?.addEventListener('click', () => {
            this.centerMapOnUser();
        });

        // Ambulance filtering
        document.getElementById('ambulanceTypeFilter')?.addEventListener('change', (e) => {
            this.filterAmbulances(e.target.value);
        });

        document.getElementById('ambulanceSortFilter')?.addEventListener('change', (e) => {
            this.sortAmbulances(e.target.value);
        });

        // Cart functionality
        document.getElementById('cartIcon')?.addEventListener('click', () => {
            this.showModal('cartModal');
        });

        // Medical Buy Search
        document.getElementById('searchBtn')?.addEventListener('click', () => {
            this.searchMedicines();
        });

        document.getElementById('medicineSearch')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchMedicines();
            }
        });

        document.getElementById('scanBtn')?.addEventListener('click', () => {
            this.showModal('prescriptionModal');
        });

        // Sort and filter
        document.getElementById('sortFilter')?.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderMedicines();
        });

        // Vitals form
        document.getElementById('vitalsForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveVitals();
        });

        // Emergency buttons
        document.getElementById('callEmergencyBtn')?.addEventListener('click', () => {
            this.callEmergency();
        });

        document.getElementById('shareLocationBtn')?.addEventListener('click', () => {
            this.shareLocation();
        });

        // Chat functionality
        document.getElementById('sendChatBtn')?.addEventListener('click', () => {
            this.sendChatMessage();
        });

        document.getElementById('chatInput')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage();
            }
        });

        // Modal controls
        this.setupModalListeners();

        // Notifications
        document.getElementById('notificationBtn')?.addEventListener('click', () => {
            this.showModal('notificationModal');
        });

        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Sidebar toggle
        document.getElementById('sidebarToggle')?.addEventListener('click', () => {
            this.toggleSidebar();
        });

        // Cart actions
        document.getElementById('continueShopping')?.addEventListener('click', () => {
            this.hideModal('cartModal');
            this.navigateToPage('medical-buy');
        });

        document.getElementById('proceedCheckout')?.addEventListener('click', () => {
            this.proceedToCheckout();
        });

        // Ambulance booking form
        document.getElementById('ambulanceBookingForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.confirmAmbulanceBooking();
        });

        document.getElementById('cancelBooking')?.addEventListener('click', () => {
            this.hideModal('ambulanceBookingModal');
        });

        // Booking confirmation actions
        document.getElementById('trackAmbulanceBtn')?.addEventListener('click', () => {
            this.hideModal('bookingConfirmationModal');
            this.startLiveTracking();
        });

        document.getElementById('callDriverBtn')?.addEventListener('click', () => {
            this.callDriver();
        });
    }

    setupModalListeners() {
        const modals = ['vitalsModal', 'notificationModal', 'cartModal', 'medicineModal', 'prescriptionModal', 'ambulanceBookingModal', 'bookingConfirmationModal'];
        
        modals.forEach(modalId => {
            const modalElement = document.getElementById(modalId);
            if (modalElement) {
                const closeBtn = modalElement.querySelector('.modal-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        this.hideModal(modalId);
                    });
                }
            }
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target.id);
            }
        });
    }

    navigateToPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const selectedPage = document.getElementById(pageName);
        if (selectedPage) {
            selectedPage.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        const navItem = document.querySelector(`[data-page="${pageName}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }

        // Update page title and breadcrumb
        const titles = {
            'dashboard': 'Health Dashboard',
            'emergency-ambulance': 'Emergency Ambulance Service',
            'medical-buy': 'Medical Purchase Center',
            'vitals': 'Health Vitals',
            'ai-assistant': 'AI Assistant',
            'medical-records': 'Medical Records',
            'appointments': 'Appointments',
            'pharmacy': 'Pharmacy',
            'doctor-portal': 'Doctor Portal',
            'blockchain': 'Blockchain Security',
            'emergency': 'Emergency Services'
        };

        document.getElementById('pageTitle').textContent = titles[pageName] || 'Uruk Health';
        document.getElementById('currentPage').textContent = titles[pageName] || 'Dashboard';

        this.currentPage = pageName;

        // Initialize page-specific functionality
        if (pageName === 'emergency-ambulance') {
            this.initializeAmbulancePage();
        } else if (pageName === 'medical-buy') {
            this.renderMedicalBuyContent();
        }
    }

    // Emergency Ambulance Page Methods
    initializeAmbulancePage() {
        this.renderAmbulances();
        this.renderEmergencyTypes();
        this.renderHospitals();
        this.updateAmbulanceMap();
        this.refreshAmbulanceData();
    }

    renderAmbulances() {
        const ambulancesGrid = document.getElementById('ambulancesGrid');
        if (!ambulancesGrid) return;

        ambulancesGrid.innerHTML = '';
        
        this.ambulances.forEach((ambulance, index) => {
            const ambulanceCard = document.createElement('div');
            ambulanceCard.className = `ambulance-card ${ambulance.status.toLowerCase().replace(' ', '-')}`;
            ambulanceCard.style.animationDelay = `${index * 0.1}s`;
            ambulanceCard.style.animation = 'fadeInUp 0.5s ease forwards';
            ambulanceCard.style.opacity = '0';
            
            const equipmentTags = ambulance.equipment.map(equipment => 
                `<span class="equipment-tag">${equipment}</span>`
            ).join('');
            
            ambulanceCard.innerHTML = `
                <div class="ambulance-header">
                    <div class="ambulance-info">
                        <h4>${ambulance.id}</h4>
                        <div class="ambulance-type">${ambulance.type}</div>
                        <div class="ambulance-network">${ambulance.hospitalNetwork}</div>
                    </div>
                    <div class="ambulance-status-badge ${ambulance.status.toLowerCase().replace(' ', '-')}">
                        ${ambulance.status}
                    </div>
                </div>
                <div class="ambulance-details">
                    <div class="detail-row">
                        <span class="detail-label">Driver:</span>
                        <span class="detail-value">${ambulance.driverName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Distance:</span>
                        <span class="detail-value distance">${ambulance.distance}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">ETA:</span>
                        <span class="detail-value eta">${ambulance.eta}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Rating:</span>
                        <span class="detail-value">⭐ ${ambulance.rating}/5</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Vehicle:</span>
                        <span class="detail-value">${ambulance.licensePlate}</span>
                    </div>
                    <div class="equipment-list">
                        <h5>Available Equipment:</h5>
                        <div class="equipment-tags">
                            ${equipmentTags}
                        </div>
                    </div>
                </div>
                <div class="ambulance-actions">
                    <button class="book-ambulance-btn" onclick="app.bookAmbulance('${ambulance.id}')" 
                            ${ambulance.status !== 'Available' ? 'disabled' : ''}>
                        <i class="fas fa-ambulance"></i>
                        ${ambulance.status === 'Available' ? 'Book Now' : ambulance.status}
                    </button>
                    <button class="call-ambulance-btn" onclick="app.callAmbulance('${ambulance.driverPhone}')">
                        <i class="fas fa-phone"></i>
                    </button>
                </div>
            `;
            
            ambulancesGrid.appendChild(ambulanceCard);
        });
    }

    renderEmergencyTypes() {
        const emergencyTypesGrid = document.getElementById('emergencyTypesGrid');
        if (!emergencyTypesGrid) return;

        emergencyTypesGrid.innerHTML = '';
        
        this.emergencyTypes.forEach((emergencyType, index) => {
            const typeCard = document.createElement('div');
            typeCard.className = `emergency-type-card ${emergencyType.priority.toLowerCase()}`;
            typeCard.style.animationDelay = `${index * 0.1}s`;
            typeCard.style.animation = 'fadeInUp 0.5s ease forwards';
            typeCard.style.opacity = '0';
            
            typeCard.innerHTML = `
                <div class="emergency-icon">${emergencyType.icon}</div>
                <div class="emergency-name">${emergencyType.type}</div>
                <div class="emergency-priority ${emergencyType.priority.toLowerCase()}">${emergencyType.priority} Priority</div>
            `;
            
            typeCard.addEventListener('click', () => {
                this.selectEmergencyType(emergencyType);
            });
            
            emergencyTypesGrid.appendChild(typeCard);
        });
    }

    renderHospitals() {
        const hospitalsGrid = document.getElementById('hospitalsGrid');
        if (!hospitalsGrid) return;

        hospitalsGrid.innerHTML = '';
        
        this.hospitals.forEach((hospital, index) => {
            const hospitalCard = document.createElement('div');
            hospitalCard.className = 'hospital-card';
            hospitalCard.style.animationDelay = `${index * 0.1}s`;
            hospitalCard.style.animation = 'fadeInUp 0.5s ease forwards';
            hospitalCard.style.opacity = '0';
            
            const specialtyTags = hospital.specialties.map(specialty => 
                `<span class="specialty-tag">${specialty}</span>`
            ).join('');
            
            hospitalCard.innerHTML = `
                <div class="hospital-header">
                    <div class="hospital-info">
                        <h4>${hospital.name}</h4>
                        <div class="hospital-distance">${hospital.distance} away</div>
                    </div>
                    ${hospital.emergency ? '<div class="emergency-available">Emergency Available</div>' : ''}
                </div>
                <div class="hospital-details">
                    <div class="detail-row">
                        <span class="detail-label">Phone:</span>
                        <span class="detail-value">${hospital.phone}</span>
                    </div>
                    <div class="specialties-list">
                        <h5>Specialties:</h5>
                        <div class="specialties-tags">
                            ${specialtyTags}
                        </div>
                    </div>
                    <div class="beds-info">
                        <div>
                            <span class="beds-label">Total Beds</span>
                            <span class="beds-value">${hospital.beds.total}</span>
                        </div>
                        <div>
                            <span class="beds-label">Available</span>
                            <span class="beds-value">${hospital.beds.available}</span>
                        </div>
                        <div>
                            <span class="beds-label">ICU</span>
                            <span class="beds-value">${hospital.beds.icu}</span>
                        </div>
                    </div>
                </div>
            `;
            
            hospitalsGrid.appendChild(hospitalCard);
        });
    }

    updateAmbulanceMap() {
        // Update ambulance positions on the map
        this.ambulances.forEach(ambulance => {
            const marker = document.getElementById(`ambulance-${ambulance.id.split('-')[1]}`);
            if (marker) {
                // Update marker status
                marker.className = `ambulance-marker ${ambulance.status.toLowerCase().replace(' ', '-')}`;
                
                // Simulate movement for en-route ambulances
                if (ambulance.status === 'En Route') {
                    this.simulateAmbulanceMovement(marker);
                }
            }
        });
    }

    simulateAmbulanceMovement(marker) {
        // Simple animation to show ambulance movement
        const randomOffset = () => (Math.random() - 0.5) * 20;
        
        setInterval(() => {
            const currentTop = parseInt(marker.style.top) || parseInt(getComputedStyle(marker).top);
            const currentLeft = parseInt(marker.style.left) || parseInt(getComputedStyle(marker).left);
            
            marker.style.top = (currentTop + randomOffset()) + 'px';
            marker.style.left = (currentLeft + randomOffset()) + 'px';
        }, 3000);
    }

    refreshAmbulanceMap() {
        this.showToast('Refreshing ambulance locations...', 'info');
        
        // Simulate data refresh
        setTimeout(() => {
            this.updateAmbulanceMap();
            this.renderAmbulances();
            this.showToast('Map updated with latest ambulance positions', 'success');
        }, 1000);
    }

    centerMapOnUser() {
        const userMarker = document.getElementById('userMarker');
        if (userMarker) {
            userMarker.style.animation = 'userPulse 1s ease';
            setTimeout(() => {
                userMarker.style.animation = 'userPulse 2s infinite';
            }, 1000);
        }
        this.showToast('Map centered on your location', 'info');
    }

    startAmbulanceTracking() {
        // Simulate real-time ambulance updates
        this.mapUpdateInterval = setInterval(() => {
            this.refreshAmbulanceData();
        }, 30000); // Update every 30 seconds
    }

    refreshAmbulanceData() {
        // Simulate real-time data updates
        this.ambulances.forEach(ambulance => {
            // Randomly update some ambulance statuses
            if (Math.random() < 0.1) {
                const statuses = ['Available', 'En Route', 'Busy'];
                ambulance.status = statuses[Math.floor(Math.random() * statuses.length)];
                ambulance.lastUpdated = new Date().toISOString();
            }
        });
        
        if (this.currentPage === 'emergency-ambulance') {
            this.renderAmbulances();
            this.updateAmbulanceMap();
        }
    }

    bookAmbulance(ambulanceId) {
        const ambulance = this.ambulances.find(a => a.id === ambulanceId);
        if (!ambulance || ambulance.status !== 'Available') {
            this.showToast('Ambulance is not available for booking', 'error');
            return;
        }

        this.selectedAmbulance = ambulance;
        this.showAmbulanceBookingModal();
    }

    showAmbulanceBookingModal() {
        if (!this.selectedAmbulance) return;

        this.showModal('ambulanceBookingModal');

        // Wait for modal to be fully shown before populating
        setTimeout(() => {
            // Populate form with user data
            const patientNameInput = document.getElementById('patientName');
            const patientPhoneInput = document.getElementById('patientPhone');
            const pickupAddressInput = document.getElementById('pickupAddress');
            
            if (patientNameInput) patientNameInput.value = this.userData.name;
            if (patientPhoneInput) patientPhoneInput.value = this.userData.phone;
            if (pickupAddressInput) pickupAddressInput.value = this.userData.defaultAddress;

            // Populate emergency types dropdown
            const emergencyTypeSelect = document.getElementById('emergencyType');
            if (emergencyTypeSelect) {
                emergencyTypeSelect.innerHTML = '<option value="">Select Emergency Type</option>';
                this.emergencyTypes.forEach(type => {
                    const option = document.createElement('option');
                    option.value = type.type;
                    option.textContent = `${type.icon} ${type.type} (${type.priority} Priority)`;
                    emergencyTypeSelect.appendChild(option);
                });
            }

            // Populate hospitals dropdown
            const hospitalSelect = document.getElementById('destinationHospital');
            if (hospitalSelect) {
                hospitalSelect.innerHTML = '<option value="">Choose Hospital (Optional)</option>';
                this.hospitals.forEach(hospital => {
                    const option = document.createElement('option');
                    option.value = hospital.name;
                    option.textContent = `${hospital.name} (${hospital.distance})`;
                    hospitalSelect.appendChild(option);
                });
            }

            // Update ambulance info
            const selectedAmbulanceInfo = document.getElementById('selectedAmbulanceInfo');
            if (selectedAmbulanceInfo) {
                selectedAmbulanceInfo.innerHTML = `
                    <div class="ambulance-booking-info">
                        <h4>${this.selectedAmbulance.id} - ${this.selectedAmbulance.type}</h4>
                        <p><strong>Driver:</strong> ${this.selectedAmbulance.driverName}</p>
                        <p><strong>Distance:</strong> ${this.selectedAmbulance.distance}</p>
                        <p><strong>Network:</strong> ${this.selectedAmbulance.hospitalNetwork}</p>
                        <p><strong>Rating:</strong> ⭐ ${this.selectedAmbulance.rating}/5</p>
                    </div>
                `;
            }

            // Update estimated values
            const estimatedArrivalElement = document.getElementById('estimatedArrival');
            const estimatedCostElement = document.getElementById('estimatedCost');
            
            if (estimatedArrivalElement) estimatedArrivalElement.textContent = this.selectedAmbulance.eta;
            if (estimatedCostElement) estimatedCostElement.textContent = '₹1,500 - ₹2,500';
        }, 100);
    }

    confirmAmbulanceBooking() {
        const patientNameInput = document.getElementById('patientName');
        const patientPhoneInput = document.getElementById('patientPhone');
        const emergencyTypeSelect = document.getElementById('emergencyType');
        const pickupAddressInput = document.getElementById('pickupAddress');
        const destinationHospitalSelect = document.getElementById('destinationHospital');
        const additionalNotesInput = document.getElementById('additionalNotes');

        const formData = {
            patientName: patientNameInput ? patientNameInput.value : '',
            patientPhone: patientPhoneInput ? patientPhoneInput.value : '',
            emergencyType: emergencyTypeSelect ? emergencyTypeSelect.value : '',
            pickupAddress: pickupAddressInput ? pickupAddressInput.value : '',
            destinationHospital: destinationHospitalSelect ? destinationHospitalSelect.value : '',
            additionalNotes: additionalNotesInput ? additionalNotesInput.value : ''
        };

        if (!formData.patientName || !formData.patientPhone || !formData.emergencyType || !formData.pickupAddress) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }

        this.showToast('Processing ambulance booking...', 'info');

        setTimeout(() => {
            // Create booking record
            const newBooking = {
                id: 'BOOK-' + Date.now(),
                date: new Date().toISOString(),
                ambulanceId: this.selectedAmbulance.id,
                emergencyType: formData.emergencyType,
                status: 'Confirmed',
                patientName: formData.patientName,
                patientPhone: formData.patientPhone,
                pickupAddress: formData.pickupAddress,
                destinationHospital: formData.destinationHospital,
                additionalNotes: formData.additionalNotes,
                eta: this.selectedAmbulance.eta,
                driverName: this.selectedAmbulance.driverName,
                driverPhone: this.selectedAmbulance.driverPhone
            };

            this.bookingHistory.unshift(newBooking);
            
            // Update ambulance status
            this.selectedAmbulance.status = 'Dispatched';
            
            // Set up live tracking
            this.liveTracking.activeBooking = newBooking;
            this.liveTracking.trackingEnabled = true;
            this.liveTracking.status = 'dispatched';
            this.liveTracking.driverContact = this.selectedAmbulance.driverPhone;

            this.hideModal('ambulanceBookingModal');
            this.showBookingConfirmation(newBooking);
            this.notifyEmergencyContacts();
            
            this.showToast('Ambulance booking confirmed!', 'success');
        }, 2000);
    }

    showBookingConfirmation(booking) {
        const confirmationContent = document.getElementById('confirmationContent');
        if (confirmationContent) {
            confirmationContent.innerHTML = `
                <div class="booking-confirmation">
                    <div class="confirmation-icon">
                        <i class="fas fa-check-circle" style="color: #16a34a; font-size: 48px;"></i>
                    </div>
                    <h4>Booking Confirmed!</h4>
                    <div class="booking-details">
                        <p><strong>Booking ID:</strong> ${booking.id}</p>
                        <p><strong>Ambulance:</strong> ${booking.ambulanceId}</p>
                        <p><strong>Driver:</strong> ${booking.driverName}</p>
                        <p><strong>Contact:</strong> ${booking.driverPhone}</p>
                        <p><strong>Emergency Type:</strong> ${booking.emergencyType}</p>
                        <p><strong>ETA:</strong> ${booking.eta}</p>
                    </div>
                    <div class="emergency-notice">
                        <p><i class="fas fa-info-circle"></i> Emergency contacts have been notified</p>
                        <p><i class="fas fa-hospital"></i> Hospital pre-notification sent</p>
                    </div>
                </div>
            `;
        }

        this.showModal('bookingConfirmationModal');
    }

    startLiveTracking() {
        if (!this.liveTracking.activeBooking) return;

        this.liveTracking.trackingEnabled = true;
        this.updateTrackingPanel();
        
        // Simulate tracking updates
        const trackingInterval = setInterval(() => {
            this.updateLiveTracking();
        }, 10000); // Update every 10 seconds

        // Navigate to ambulance page to show tracking
        this.navigateToPage('emergency-ambulance');
        this.showToast('Live tracking activated', 'success');
    }

    updateLiveTracking() {
        if (!this.liveTracking.trackingEnabled) return;

        const statuses = ['dispatched', 'en-route', 'arrived'];
        const currentIndex = statuses.indexOf(this.liveTracking.status);
        
        if (currentIndex < statuses.length - 1) {
            this.liveTracking.status = statuses[currentIndex + 1];
            this.updateTrackingPanel();
            
            const statusMessages = {
                'dispatched': 'Ambulance dispatched and on the way',
                'en-route': 'Ambulance en route to your location',
                'arrived': 'Ambulance has arrived at your location'
            };
            
            this.showToast(statusMessages[this.liveTracking.status], 'info');
        }
    }

    updateTrackingPanel() {
        const trackingStatus = document.getElementById('trackingStatus');
        const trackingContent = document.getElementById('trackingContent');
        
        if (!trackingStatus || !trackingContent) return;

        if (this.liveTracking.trackingEnabled && this.liveTracking.activeBooking) {
            trackingStatus.innerHTML = `
                <span class="status-indicator ${this.liveTracking.status}"></span>
                ${this.liveTracking.status.charAt(0).toUpperCase() + this.liveTracking.status.slice(1).replace('-', ' ')}
            `;

            trackingContent.innerHTML = `
                <div class="live-tracking-info">
                    <div class="tracking-header">
                        <h4>${this.liveTracking.activeBooking.ambulanceId}</h4>
                        <div class="booking-id">Booking: ${this.liveTracking.activeBooking.id}</div>
                    </div>
                    <div class="tracking-details">
                        <div class="detail-item">
                            <i class="fas fa-user-md"></i>
                            <span>Driver: ${this.liveTracking.activeBooking.driverName}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-phone"></i>
                            <span>${this.liveTracking.activeBooking.driverPhone}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <span>ETA: ${this.liveTracking.activeBooking.eta}</span>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span>${this.liveTracking.activeBooking.emergencyType}</span>
                        </div>
                    </div>
                    <div class="tracking-actions">
                        <button class="btn btn--sm btn--primary" onclick="app.callDriver()">
                            <i class="fas fa-phone"></i>
                            Call Driver
                        </button>
                        <button class="btn btn--sm btn--outline" onclick="app.shareLocationWithDriver()">
                            <i class="fas fa-map-marker-alt"></i>
                            Share Location
                        </button>
                    </div>
                </div>
            `;
        } else {
            trackingContent.innerHTML = `
                <div class="no-tracking">
                    <i class="fas fa-search"></i>
                    <p>No active ambulance booking</p>
                    <small>Book an ambulance to see live tracking</small>
                </div>
            `;
        }
    }

    callAmbulance(phoneNumber) {
        this.showToast(`Calling ${phoneNumber}...`, 'info');
        // In a real app, this would initiate a phone call
    }

    callDriver() {
        if (this.liveTracking.driverContact) {
            this.showToast(`Calling driver at ${this.liveTracking.driverContact}...`, 'info');
        }
    }

    shareLocationWithDriver() {
        this.showToast('Location shared with ambulance driver', 'success');
    }

    selectEmergencyType(emergencyType) {
        this.showToast(`${emergencyType.type} selected - ${emergencyType.priority} priority`, 'info');
        
        // Scroll to ambulances section
        const ambulancesSection = document.querySelector('.ambulances-section');
        if (ambulancesSection) {
            ambulancesSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    filterAmbulances(type) {
        // Filter ambulances by type
        const filteredAmbulances = type ? this.ambulances.filter(a => a.type === type) : this.ambulances;
        this.renderFilteredAmbulances(filteredAmbulances);
    }

    sortAmbulances(criteria) {
        let sortedAmbulances = [...this.ambulances];
        
        switch (criteria) {
            case 'distance':
                sortedAmbulances.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
                break;
            case 'eta':
                sortedAmbulances.sort((a, b) => parseInt(a.eta) - parseInt(b.eta));
                break;
            case 'rating':
                sortedAmbulances.sort((a, b) => b.rating - a.rating);
                break;
        }
        
        this.renderFilteredAmbulances(sortedAmbulances);
    }

    renderFilteredAmbulances(ambulances) {
        // This would update the ambulances grid with filtered/sorted results
        // For now, we'll just show a toast
        this.showToast(`Showing ${ambulances.length} ambulances`, 'info');
    }

    triggerPanicMode() {
        this.showToast('🚨 PANIC MODE ACTIVATED 🚨', 'error');
        
        // In panic mode, automatically book the nearest available ambulance
        const availableAmbulances = this.ambulances.filter(a => a.status === 'Available');
        
        if (availableAmbulances.length > 0) {
            // Sort by distance and select the nearest
            availableAmbulances.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
            const nearestAmbulance = availableAmbulances[0];
            
            // Auto-book with emergency settings
            const panicBooking = {
                id: 'PANIC-' + Date.now(),
                date: new Date().toISOString(),
                ambulanceId: nearestAmbulance.id,
                emergencyType: 'General Emergency',
                status: 'Urgent',
                patientName: this.userData.name,
                patientPhone: this.userData.phone,
                pickupAddress: this.userData.defaultAddress,
                additionalNotes: 'PANIC BUTTON ACTIVATED - URGENT RESPONSE REQUIRED',
                eta: nearestAmbulance.eta,
                driverName: nearestAmbulance.driverName,
                driverPhone: nearestAmbulance.driverPhone
            };
            
            this.bookingHistory.unshift(panicBooking);
            nearestAmbulance.status = 'Dispatched';
            
            this.liveTracking.activeBooking = panicBooking;
            this.liveTracking.trackingEnabled = true;
            this.liveTracking.status = 'dispatched';
            
            this.showToast(`Nearest ambulance (${nearestAmbulance.id}) dispatched automatically!`, 'success');
            this.notifyEmergencyContacts();
            this.startLiveTracking();
        } else {
            this.showToast('No ambulances available. Contacting emergency services...', 'error');
        }
    }

    activateVoiceCommand() {
        this.showToast('🎤 Voice command activated - Say "Book ambulance"', 'info');
        
        // Simulate voice recognition
        setTimeout(() => {
            this.showToast('Voice command: "Book ambulance" - Processing...', 'info');
            
            setTimeout(() => {
                // Show available ambulances
                const availableCount = this.ambulances.filter(a => a.status === 'Available').length;
                this.showToast(`Found ${availableCount} available ambulances nearby`, 'success');
                
                // Scroll to ambulances section
                const ambulancesSection = document.querySelector('.ambulances-section');
                if (ambulancesSection) {
                    ambulancesSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 2000);
        }, 3000);
    }

    notifyEmergencyContacts() {
        this.showToast('Notifying emergency contacts...', 'info');
        
        setTimeout(() => {
            this.liveTracking.emergencyContactsNotified = true;
            this.showToast('Emergency contacts notified successfully', 'success');
            
            // Add notification to the notifications list
            this.notifications.unshift({
                id: Date.now(),
                type: "emergency_booking",
                message: "Ambulance booked - Emergency contacts notified",
                time: "Just now",
                priority: "urgent"
            });
        }, 1500);
    }

    // Existing methods from the original implementation continue...
    renderMedicalBuyContent() {
        this.renderCategories();
        this.renderMedicines();
    }

    renderCategories() {
        const categoriesGrid = document.getElementById('categoriesGrid');
        if (!categoriesGrid) return;

        categoriesGrid.innerHTML = '';
        
        this.categories.forEach((category, index) => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.style.animationDelay = `${index * 0.1}s`;
            categoryCard.style.animation = 'fadeInUp 0.5s ease forwards';
            categoryCard.style.opacity = '0';
            
            categoryCard.innerHTML = `
                <div class="category-icon">${category.icon}</div>
                <div class="category-name">${category.name}</div>
                <div class="category-count">${category.count} items</div>
            `;
            
            categoryCard.addEventListener('click', () => {
                this.filterByCategory(category.name);
            });
            
            categoriesGrid.appendChild(categoryCard);
        });
    }

    renderMedicines() {
        const medicinesGrid = document.getElementById('medicinesGrid');
        if (!medicinesGrid) return;

        let filteredMedicines = [...this.medicines];

        // Apply search filter
        if (this.searchQuery) {
            filteredMedicines = filteredMedicines.filter(medicine =>
                medicine.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                medicine.brand.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }

        // Apply category filter
        if (this.selectedCategory) {
            filteredMedicines = filteredMedicines.filter(medicine =>
                medicine.category === this.selectedCategory
            );
        }

        medicinesGrid.innerHTML = '';
        
        if (filteredMedicines.length === 0) {
            medicinesGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--color-text-secondary);">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 16px;"></i>
                    <h3>No medicines found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                    <button class="btn btn--primary" onclick="app.clearFilters()">Clear All Filters</button>
                </div>
            `;
            return;
        }
        
        filteredMedicines.forEach((medicine, index) => {
            const medicineCard = document.createElement('div');
            medicineCard.className = 'medicine-card';
            medicineCard.style.animationDelay = `${index * 0.1}s`;
            medicineCard.style.animation = 'fadeInUp 0.5s ease forwards';
            medicineCard.style.opacity = '0';
            
            const discount = Math.round((1 - medicine.discountPrice / medicine.price) * 100);
            const stockClass = medicine.stockCount > 50 ? 'in-stock' : medicine.stockCount > 0 ? 'low-stock' : 'out-of-stock';
            const stockText = medicine.stockCount > 50 ? 'In Stock' : medicine.stockCount > 0 ? 'Low Stock' : 'Out of Stock';
            
            medicineCard.innerHTML = `
                <div class="medicine-image" style="background-image: url('${medicine.image}')">
                    ${medicine.prescription ? '<div class="prescription-required">Rx</div>' : ''}
                </div>
                <div class="medicine-info">
                    <div class="medicine-header">
                        <div>
                            <div class="medicine-name">${medicine.name}</div>
                            <div class="medicine-brand">${medicine.brand}</div>
                        </div>
                        <div class="medicine-rating">
                            <div class="rating-stars">
                                ${'★'.repeat(Math.floor(medicine.rating))}${'☆'.repeat(5 - Math.floor(medicine.rating))}
                            </div>
                            <div class="rating-count">(${medicine.reviews})</div>
                        </div>
                    </div>
                    <div class="medicine-price">
                        <span class="current-price">₹${medicine.discountPrice}</span>
                        <span class="original-price">₹${medicine.price}</span>
                        <span class="discount-badge">${discount}% OFF</span>
                    </div>
                    <div class="medicine-stock ${stockClass}">${stockText}</div>
                    <div class="medicine-actions">
                        <button class="add-to-cart-btn" onclick="app.addToCart(${medicine.id})" ${!medicine.inStock ? 'disabled' : ''}>
                            <i class="fas fa-cart-plus"></i>
                            Add to Cart
                        </button>
                        <button class="view-details-btn" onclick="app.showMedicineDetails(${medicine.id})">
                            <i class="fas fa-info"></i>
                        </button>
                    </div>
                </div>
            `;
            
            medicinesGrid.appendChild(medicineCard);
        });
    }

    searchMedicines() {
        const searchInput = document.getElementById('medicineSearch');
        const query = searchInput.value.trim();
        
        this.searchQuery = query;
        
        if (query) {
            this.showToast(`Searching for "${query}"...`, 'info');
        } else {
            this.showToast('Showing all medicines', 'info');
        }
        
        setTimeout(() => {
            this.renderMedicines();
        }, 500);
    }

    filterByCategory(category) {
        if (this.selectedCategory === category) {
            this.selectedCategory = null;
            this.showToast('Showing all categories', 'info');
        } else {
            this.selectedCategory = category;
            this.showToast(`Filtering by ${category}`, 'info');
        }
        
        setTimeout(() => {
            this.renderMedicines();
        }, 300);
    }

    clearFilters() {
        this.searchQuery = '';
        this.selectedCategory = null;
        this.currentSort = 'popularity';
        
        const searchInput = document.getElementById('medicineSearch');
        const sortFilter = document.getElementById('sortFilter');
        
        if (searchInput) searchInput.value = '';
        if (sortFilter) sortFilter.value = 'popularity';
        
        this.renderMedicines();
        this.showToast('All filters cleared', 'info');
    }

    addToCart(medicineId) {
        const medicine = this.medicines.find(m => m.id === medicineId);
        if (!medicine || !medicine.inStock) {
            this.showToast('Medicine is out of stock', 'error');
            return;
        }

        if (medicine.prescription) {
            this.showToast('Prescription required for this medicine', 'info');
            return;
        }

        const existingItem = this.cart.items.find(item => item.medicineId === medicineId);
        
        if (existingItem) {
            existingItem.quantity += 1;
            existingItem.total = existingItem.quantity * existingItem.price;
        } else {
            this.cart.items.push({
                medicineId: medicineId,
                quantity: 1,
                pharmacy: "Apollo Pharmacy",
                price: medicine.discountPrice,
                total: medicine.discountPrice
            });
        }

        this.updateCartTotals();
        this.updateCartCount();
        this.showToast(`${medicine.name} added to cart!`, 'success');
    }

    updateCartTotals() {
        this.cart.subtotal = this.cart.items.reduce((sum, item) => sum + item.total, 0);
        this.cart.discount = Math.floor(this.cart.subtotal * 0.1);
        this.cart.deliveryFee = this.cart.subtotal > 200 ? 0 : 25;
        this.cart.total = this.cart.subtotal - this.cart.discount + this.cart.deliveryFee;
    }

    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        const totalItems = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
        
        if (cartCount) {
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    showMedicineDetails(medicineId) {
        // Implementation for showing medicine details
        this.showToast('Medicine details feature coming soon!', 'info');
    }

    proceedToCheckout() {
        this.hideModal('cartModal');
        this.showToast('Proceeding to checkout...', 'info');
        
        setTimeout(() => {
            this.showToast('Order placed successfully!', 'success');
            this.cart.items = [];
            this.updateCartTotals();
            this.updateCartCount();
        }, 2000);
    }

    // Continue with all other existing methods...
    initializeDashboard() {
        this.animateHealthScore();
        this.updateAIInsights();
        this.setupQuickActions();
    }

    animateHealthScore() {
        const circle = document.querySelector('.progress-ring-circle');
        const scoreNumber = document.querySelector('.score-number');
        
        if (circle && scoreNumber) {
            const svg = document.querySelector('.progress-ring');
            if (svg && !svg.querySelector('defs')) {
                const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
                gradient.setAttribute('id', 'healthGradient');
                
                const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stop1.setAttribute('offset', '0%');
                stop1.setAttribute('stop-color', '#dc2626');
                
                const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                stop2.setAttribute('offset', '100%');
                stop2.setAttribute('stop-color', '#16a34a');
                
                gradient.appendChild(stop1);
                gradient.appendChild(stop2);
                defs.appendChild(gradient);
                svg.appendChild(defs);
            }

            setTimeout(() => {
                circle.classList.add('animate');
                let currentScore = 0;
                const targetScore = this.userData.healthScore;
                const increment = targetScore / 50;
                
                const countUp = setInterval(() => {
                    currentScore += increment;
                    if (currentScore >= targetScore) {
                        currentScore = targetScore;
                        clearInterval(countUp);
                    }
                    scoreNumber.textContent = Math.round(currentScore);
                }, 30);
            }, 500);
        }
    }

    updateAIInsights() {
        const insightsList = document.getElementById('aiInsightsList');
        if (insightsList) {
            insightsList.innerHTML = '';
            this.userData.aiInsights.forEach((insight, index) => {
                const li = document.createElement('li');
                li.textContent = insight;
                li.style.animationDelay = `${index * 0.2}s`;
                li.style.animation = 'fadeInUp 0.5s ease forwards';
                li.style.opacity = '0';
                insightsList.appendChild(li);
            });
        }
    }

    setupQuickActions() {
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach((btn, index) => {
            btn.style.animationDelay = `${index * 0.1}s`;
            btn.style.animation = 'fadeInUp 0.5s ease forwards';
        });
    }

    setupCharts() {
        this.createVitalsChart();
    }

    createVitalsChart() {
        const ctx = document.getElementById('vitalsChart');
        if (!ctx) return;

        const dates = this.vitalsData.map(v => new Date(v.date).toLocaleDateString());
        const heartRates = this.vitalsData.map(v => v.heartRate);
        const temperatures = this.vitalsData.map(v => v.temperature);

        this.charts.vitals = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates.reverse(),
                datasets: [{
                    label: 'Heart Rate (bpm)',
                    data: heartRates.reverse(),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Temperature (°F)',
                    data: temperatures.reverse(),
                    borderColor: '#FFC185',
                    backgroundColor: 'rgba(255, 193, 133, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Heart Rate (bpm)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Temperature (°F)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
    }

    saveVitals() {
        const heartRate = document.getElementById('heartRate').value;
        const bloodPressure = document.getElementById('bloodPressure').value;
        const temperature = document.getElementById('temperature').value;
        const oxygenSat = document.getElementById('oxygenSat').value;

        if (!heartRate || !bloodPressure || !temperature || !oxygenSat) {
            this.showToast('Please fill in all vital signs', 'error');
            return;
        }

        this.showToast('Saving vitals...', 'info');
        
        setTimeout(() => {
            const newVital = {
                date: new Date().toISOString().split('T')[0],
                heartRate: parseInt(heartRate),
                bloodPressure: bloodPressure,
                temperature: parseFloat(temperature),
                oxygenSat: parseInt(oxygenSat),
                aiAnalysis: this.generateAIAnalysis(heartRate, bloodPressure, temperature, oxygenSat),
                blockchainHash: this.generateBlockchainHash(),
                riskLevel: this.assessRiskLevel(heartRate, bloodPressure, temperature, oxygenSat)
            };

            this.vitalsData.unshift(newVital);
            this.renderVitalsHistory();
            
            document.getElementById('vitalsForm').reset();
            this.showToast('Vitals saved successfully!', 'success');
        }, 1500);
    }

    generateAIAnalysis(heartRate, bloodPressure, temperature, oxygenSat) {
        const analyses = [
            "Vitals are within normal range. Great job maintaining your health!",
            "Consider consulting with your doctor about the blood pressure trend.",
            "Excellent oxygen saturation levels. Keep up the good work!",
            "Temperature is normal. Continue monitoring for any changes.",
            "Heart rate shows improvement. Your exercise routine is working!"
        ];
        
        if (heartRate > 100 || heartRate < 60) {
            return "Heart rate is outside normal range. Consider consulting your physician.";
        }
        if (temperature > 100.4) {
            return "Elevated temperature detected. Please monitor closely and consult if needed.";
        }
        if (oxygenSat < 95) {
            return "Oxygen saturation is low. Please seek medical attention immediately.";
        }
        
        return analyses[Math.floor(Math.random() * analyses.length)];
    }

    generateBlockchainHash() {
        const chars = '0123456789abcdef';
        let hash = '0x';
        for (let i = 0; i < 12; i++) {
            hash += chars[Math.floor(Math.random() * chars.length)];
        }
        return hash;
    }

    assessRiskLevel(heartRate, bloodPressure, temperature, oxygenSat) {
        if (heartRate > 120 || temperature > 101 || oxygenSat < 95) {
            return 'high';
        }
        if (heartRate > 100 || temperature > 99.5 || oxygenSat < 97) {
            return 'medium';
        }
        return 'low';
    }

    renderVitalsHistory() {
        const historyContainer = document.getElementById('vitalsHistory');
        if (!historyContainer) return;

        historyContainer.innerHTML = '';
        
        this.vitalsData.forEach((vital, index) => {
            const vitalElement = document.createElement('div');
            vitalElement.className = 'vital-record';
            vitalElement.style.animationDelay = `${index * 0.1}s`;
            vitalElement.style.animation = 'fadeInUp 0.5s ease forwards';
            vitalElement.style.opacity = '0';
            
            vitalElement.innerHTML = `
                <div class="vital-date">${new Date(vital.date).toLocaleDateString()}</div>
                <div class="vital-metrics">
                    <div class="vital-metric">
                        <span class="metric-label">Heart Rate:</span>
                        <span class="metric-value">${vital.heartRate} bpm</span>
                    </div>
                    <div class="vital-metric">
                        <span class="metric-label">Blood Pressure:</span>
                        <span class="metric-value">${vital.bloodPressure} mmHg</span>
                    </div>
                    <div class="vital-metric">
                        <span class="metric-label">Temperature:</span>
                        <span class="metric-value">${vital.temperature}°F</span>
                    </div>
                    <div class="vital-metric">
                        <span class="metric-label">Oxygen Sat:</span>
                        <span class="metric-value">${vital.oxygenSat}%</span>
                    </div>
                </div>
                <div class="ai-analysis-text">
                    <i class="fas fa-brain"></i> AI Analysis: ${vital.aiAnalysis}
                </div>
                <div class="blockchain-badge verified">
                    <i class="fas fa-cube"></i>
                    Secured: ${vital.blockchainHash}
                </div>
            `;
            
            historyContainer.appendChild(vitalElement);
        });
    }

    sendChatMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (!message) return;

        this.addChatMessage('user', message);
        chatInput.value = '';

        setTimeout(() => {
            const aiResponse = this.generateAIResponse(message);
            this.addChatMessage('ai', aiResponse);
        }, 1000);
    }

    addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-avatar">
                    <i class="fas fa-${sender === 'ai' ? 'robot' : 'user'}"></i>
                </div>
                <div class="message-text">${message}</div>
            </div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('ambulance') || lowerMessage.includes('emergency')) {
            return "I can help you with emergency services! We have ambulances available nearby. Would you like me to help you book one?";
        }
        if (lowerMessage.includes('medicine') || lowerMessage.includes('drug')) {
            return "I can help you find medicines! You can search for medicines in our Medical Buy section and get them delivered.";
        }
        if (lowerMessage.includes('blood pressure') || lowerMessage.includes('bp')) {
            return "Your recent blood pressure readings show a slight upward trend. I recommend monitoring it daily.";
        }
        
        return "I understand your concern. How can I help you with your health needs today?";
    }

    callEmergency() {
        this.showToast('Connecting to emergency services...', 'info');
        
        setTimeout(() => {
            this.showToast('Emergency call initiated. Help is on the way!', 'success');
        }, 2000);
    }

    shareLocation() {
        this.showToast('Sharing location with emergency team...', 'info');
        
        setTimeout(() => {
            this.showToast('Location shared successfully.', 'success');
        }, 1500);
    }

    renderEmergencyContacts() {
        const contactsList = document.getElementById('emergencyContactsList');
        if (!contactsList) return;

        contactsList.innerHTML = '';
        
        this.emergencyContacts.forEach((contact, index) => {
            const contactElement = document.createElement('div');
            contactElement.className = 'contact-item';
            contactElement.style.animationDelay = `${index * 0.1}s`;
            contactElement.style.animation = 'fadeInUp 0.5s ease forwards';
            contactElement.style.opacity = '0';
            
            contactElement.innerHTML = `
                <div class="contact-info">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-number">${contact.number}</div>
                </div>
                <span class="contact-type ${contact.type}">${contact.type}</span>
                <button class="btn btn--sm btn--primary" onclick="app.callContact('${contact.number}')">
                    <i class="fas fa-phone"></i>
                    Call
                </button>
            `;
            
            contactsList.appendChild(contactElement);
        });
    }

    callContact(number) {
        this.showToast(`Calling ${number}...`, 'info');
    }

    renderNotifications() {
        const notificationsList = document.getElementById('notificationsList');
        if (!notificationsList) return;

        notificationsList.innerHTML = '';
        
        this.notifications.forEach((notification, index) => {
            const notificationElement = document.createElement('div');
            notificationElement.className = `notification-item ${notification.type}`;
            notificationElement.style.animationDelay = `${index * 0.1}s`;
            notificationElement.style.animation = 'fadeInUp 0.5s ease forwards';
            notificationElement.style.opacity = '0';
            
            notificationElement.innerHTML = `
                <div class="notification-title">${notification.message}</div>
                <div class="notification-time">${notification.time}</div>
            `;
            
            notificationsList.appendChild(notificationElement);
        });
    }

    updateActivityFeed() {
        const activityList = document.getElementById('activityList');
        if (!activityList) return;

        const activities = [
            {
                icon: 'vitals',
                title: 'Vitals recorded',
                time: '2 hours ago',
                type: 'vitals'
            },
            {
                icon: 'ai',
                title: 'AI health insight generated',
                time: '4 hours ago',
                type: 'ai'
            },
            {
                icon: 'blockchain',
                title: 'Medical record secured on blockchain',
                time: '6 hours ago',
                type: 'blockchain'
            }
        ];

        activityList.innerHTML = '';
        
        activities.forEach((activity, index) => {
            const activityElement = document.createElement('div');
            activityElement.className = 'activity-item';
            activityElement.style.animationDelay = `${index * 0.1}s`;
            activityElement.style.animation = 'fadeInUp 0.5s ease forwards';
            activityElement.style.opacity = '0';
            
            activityElement.innerHTML = `
                <div class="activity-icon ${activity.type}">
                    <i class="fas fa-${activity.icon === 'vitals' ? 'heartbeat' : activity.icon === 'ai' ? 'brain' : 'cube'}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            `;
            
            activityList.appendChild(activityElement);
        });
    }

    toggleTheme() {
        const body = document.body;
        const themeToggle = document.getElementById('themeToggle');
        
        if (body.hasAttribute('data-color-scheme')) {
            const currentTheme = body.getAttribute('data-color-scheme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            body.setAttribute('data-color-scheme', newTheme);
            
            themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        } else {
            body.setAttribute('data-color-scheme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        this.showToast('Theme updated!', 'success');
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('open');
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        if (!document.querySelector('.toast-styles')) {
            const style = document.createElement('style');
            style.className = 'toast-styles';
            style.textContent = `
                .toast {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(20px);
                    border-radius: 8px;
                    padding: 16px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    z-index: 3000;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                    border-left: 4px solid;
                    max-width: 350px;
                }
                .toast-success { border-left-color: #16a34a; }
                .toast-error { border-left-color: #dc2626; }
                .toast-info { border-left-color: #0ea5e9; }
                .toast.show { transform: translateX(0); }
                .toast-content {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .toast-success i { color: #16a34a; }
                .toast-error i { color: #dc2626; }
                .toast-info i { color: #0ea5e9; }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        setTimeout(() => toast.classList.add('show'), 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
}

// Initialize the application
const app = new UrukHealthApp();

// Add CSS for chat messages and additional styles
const chatStyles = document.createElement('style');
chatStyles.textContent = `
    .chat-message {
        margin-bottom: 16px;
        animation: fadeInUp 0.3s ease;
    }
    .message-content {
        display: flex;
        gap: 12px;
        align-items: flex-start;
    }
    .message-avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: white;
    }
    .chat-message.ai .message-avatar {
        background: linear-gradient(135deg, #8b5cf6, #a855f7);
    }
    .chat-message.user .message-avatar {
        background: linear-gradient(135deg, #0ea5e9, #3b82f6);
    }
    .message-text {
        flex: 1;
        padding: 12px 16px;
        border-radius: 12px;
        background: var(--color-bg-1);
        font-size: 14px;
        line-height: 1.5;
    }
    .message-time {
        font-size: 11px;
        color: var(--color-text-secondary);
        margin-left: 44px;
        margin-top: 4px;
    }
    
    .live-tracking-info {
        padding: 16px;
    }
    .tracking-header {
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--color-card-border-inner);
    }
    .tracking-header h4 {
        margin: 0 0 4px 0;
        color: var(--color-text);
    }
    .booking-id {
        font-size: 12px;
        color: var(--color-text-secondary);
    }
    .tracking-details {
        margin-bottom: 16px;
    }
    .detail-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        font-size: 14px;
    }
    .detail-item i {
        width: 16px;
        color: var(--color-primary);
    }
    .tracking-actions {
        display: flex;
        gap: 8px;
    }
    .booking-confirmation {
        text-align: center;
        padding: 20px;
    }
    .confirmation-icon {
        margin-bottom: 16px;
    }
    .booking-details {
        background: var(--color-bg-1);
        padding: 16px;
        border-radius: 8px;
        margin: 16px 0;
        text-align: left;
    }
    .booking-details p {
        margin: 8px 0;
        font-size: 14px;
    }
    .emergency-notice {
        background: rgba(220, 38, 38, 0.1);
        padding: 12px;
        border-radius: 8px;
        margin-top: 16px;
    }
    .emergency-notice p {
        margin: 4px 0;
        font-size: 12px;
        color: #dc2626;
    }
    .ambulance-booking-info {
        background: var(--color-bg-1);
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 16px;
    }
    .ambulance-booking-info h4 {
        margin: 0 0 8px 0;
        color: var(--color-text);
    }
    .ambulance-booking-info p {
        margin: 4px 0;
        font-size: 14px;
    }
`;
document.head.appendChild(chatStyles);