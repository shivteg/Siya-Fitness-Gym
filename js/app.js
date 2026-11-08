/**
 * Siya Fitness Gym - Core Interactive Application
 * Powers interactive muscle guide, live timetable, body engine,
 * transformation slider, particle physics, and Kitwe live clock.
 */

document.addEventListener('DOMContentLoaded', () => {
    initKitweClock();
    initHeroParticles();
    initMuscleExplorer();
    initClassTimetable();
    initTransformationSlider();
    initPricingSwitcher();
    initCalculatorUI();
    initAudioToggle();
    initMobileNav();
    initScrollAnimations();
});

/* ==========================================================================
   1. Kitwe Real-Time Status & Clock (UTC+2)
   ========================================================================== */
function initKitweClock() {
    const clockEl = document.getElementById('kitwe-clock');
    const statusBadge = document.getElementById('gym-status-badge');
    const heroStatusText = document.getElementById('hero-live-status');

    function update() {
        // Kitwe is in Central Africa Time (CAT) = UTC + 2
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const kitweTime = new Date(utc + (3600000 * 2));

        const hours = kitweTime.getHours();
        const minutes = kitweTime.getMinutes();
        const day = kitweTime.getDay(); // 0 is Sunday, 6 is Saturday

        const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} CAT`;
        if (clockEl) clockEl.textContent = timeStr;

        // Gym Hours:
        // Mon-Fri (1-5): 05:30 - 21:00
        // Sat (6): 06:00 - 19:00
        // Sun (0): 08:00 - 14:00
        const totalMinutes = hours * 60 + minutes;
        let isOpen = false;
        let closingInfo = '';

        if (day >= 1 && day <= 5) {
            isOpen = totalMinutes >= (5 * 60 + 30) && totalMinutes < (21 * 60);
            closingInfo = 'Closes 21:00';
        } else if (day === 6) {
            isOpen = totalMinutes >= (6 * 60) && totalMinutes < (19 * 60);
            closingInfo = 'Closes 19:00';
        } else {
            isOpen = totalMinutes >= (8 * 60) && totalMinutes < (14 * 60);
            closingInfo = 'Closes 14:00';
        }

        if (statusBadge) {
            if (isOpen) {
                statusBadge.innerHTML = `<span class="pulse-dot"></span> OPEN NOW · ${closingInfo}`;
                statusBadge.className = 'status-badge open';
            } else {
                statusBadge.innerHTML = `<span class="pulse-dot red"></span> CLOSED NOW · Opens 05:30 AM`;
                statusBadge.className = 'status-badge closed';
            }
        }

        if (heroStatusText) {
            heroStatusText.textContent = isOpen ? `⚡ Gym Floor Active Now (${closingInfo})` : `🌙 Opens tomorrow at 05:30 AM on Kanwe Ave`;
        }
    }

    update();
    setInterval(update, 30000);
}

/* ==========================================================================
   2. Hero Ember & Spark Particle Canvas
   ========================================================================== */
function initHeroParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 45;

    let mouse = { x: -1000, y: -1000, radius: 100 };

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 50;
            this.size = Math.random() * 2.8 + 1;
            this.speedY = Math.random() * 1.5 + 0.6;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.alpha = Math.random() * 0.7 + 0.3;
            this.decay = Math.random() * 0.003 + 0.002;
            this.hue = Math.random() > 0.4 ? 45 : 145; // Gold or Neon Green
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;
            this.alpha -= this.decay;

            // Mouse interaction
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                const angle = Math.atan2(dy, dx);
                this.x -= Math.cos(angle) * 2;
                this.y -= Math.sin(angle) * 2;
            }

            if (this.alpha <= 0 || this.y < -20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 55%, ${this.alpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, 0.6)`;
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        const p = new Particle();
        p.y = Math.random() * height; // initial spread
        particles.push(p);
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   3. Interactive Muscle Anatomy & Equipment Explorer
   ========================================================================== */
const muscleData = {
    chest: {
        name: 'Pectoralis Major & Triceps Push Arsenal',
        tag: 'Upper Body Power & Definition',
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
        exercises: ['Olympic Incline Barbell Press', 'Cable Crossover Citadel Flyes', 'Weighted Parallel Bar Dips'],
        equipment: 'Rogue Olympic Benches, Dual Adjustable Cable Towers, 50kg Hex Dumbbells',
        tip: 'Focus on retracting your scapula and squeezing hard at the top peak contraction. Keep tension on the chest fibers, not your anterior delts.',
        split: 'Chest & Arms Day (Mondays & Thursdays)'
    },
    back: {
        name: 'Latissimus Dorsi, Rhomboids & Posterior Chain',
        tag: 'V-Taper Thickness & Spinal Density',
        image: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?auto=format&fit=crop&w=800&q=80',
        exercises: ['Heavy Conventional Deadlifts', 'Wide-Grip Pull-Up Ladders', 'T-Bar Rows to Abdomen'],
        equipment: 'Olympic Deadlift Platform with Bumper Plates, Seated Cable Lat Pulldown, T-Bar Row Landmine',
        tip: 'Drive your elbows down and back toward your hip pockets rather than pulling with your arms. Initiate every rep from your lats.',
        split: 'Pull & Thickness Day (Tuesdays & Fridays)'
    },
    legs: {
        name: 'Quadriceps, Hamstrings, Glutes & Calves',
        tag: 'The Engine of Raw Athletic Power',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
        exercises: ['Olympic Barbell Back Squats', '45° Plate-Loaded Leg Press', 'Romanian Deadlifts for Hamstrings'],
        equipment: 'Heavy-Duty Power Cages, 45-Degree Leg Press (supports up to 600kg), Hack Squat Station',
        tip: 'Full depth below parallel stimulates maximum motor units. Push through your mid-foot and heel, keeping your core braced tightly.',
        split: 'Leg Domination Day (Wednesdays & Saturdays)'
    },
    shoulders: {
        name: 'Deltoid Trio & Trapezius Cannonballs',
        tag: '3D Shoulder Cap Width & Upper Armor',
        image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80',
        exercises: ['Standing Overhead Military Press', 'Strict Dumbbell Lateral Raises', 'Face Pulls for Rear Delts'],
        equipment: 'Seated Military Stations, Hex Dumbbell Rack (2.5kg to 50kg), High-Pulley Cable Crossovers',
        tip: 'Lead with your elbows on lateral raises with pinkies elevated slightly to isolate the lateral head. Never neglect the rear delts for healthy rotator cuffs.',
        split: 'Shoulder & Arm Blast (Thursdays)'
    },
    arms: {
        name: 'Biceps Brachii & Triceps Lateral/Long Head',
        tag: 'Peak Hypertrophy & Gripping Strength',
        image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
        exercises: ['Incline Dumbbell Supinated Curls', 'Overhead Cable Tricep Extensions', 'EZ-Bar Spider Curls'],
        equipment: 'Arm Blaster Stances, Preacher Curl Station, Cable Pushdown Rope Towers',
        tip: 'Control the 3-second negative eccentric lowering phase. That is where 70% of hypertrophy micro-tears happen.',
        split: 'Direct Arm Finisher (Tuesdays & Fridays)'
    },
    core: {
        name: 'Rectus Abdominis, Obliques & Deep Transverse Core',
        tag: 'Unbreakable Core Stability & Six-Pack Definition',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
        exercises: ['Hanging Roman Chair Leg Raises', 'High-to-Low Cable Woodchoppers', 'Weighted Ab Wheel Rollouts'],
        equipment: 'Captain’s Chair Tower, Decline Ab Benches, Medicine Balls, Cable Pulleys',
        tip: 'Exhale every drop of air at maximum flexion. Your abs only truly fire when forced into complete contraction.',
        split: 'Integrated Daily 10-Minute Finisher'
    },
    cardio: {
        name: 'Cardiovascular Conditioning & High-Octane Endurance',
        tag: 'Fat Obliteration & Athletic Stamina',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
        exercises: ['Assault Air Bike Sprints', 'Kitwe Heavy Bag 3-Minute Rounds', 'Incline Treadmill Mountain Intervals'],
        equipment: 'Commercial Touchscreen Treadmills, Concept2 Rowers, Heavy Boxing Bags, Battle Ropes',
        tip: 'Combine 20 seconds of maximum output with 10 seconds active rest for 8 brutal rounds. Your metabolic burn will continue for 24 hours.',
        split: 'Post-Workout or Saturday Morning Sweat Clinic'
    }
};

function initMuscleExplorer() {
    const buttons = document.querySelectorAll('.muscle-btn');
    const displayCard = document.getElementById('muscle-display-card');
    if (!buttons.length || !displayCard) return;

    function renderMuscle(key) {
        const item = muscleData[key];
        if (!item) return;

        displayCard.innerHTML = `
            <div class="muscle-preview-image" style="background-image: url('${item.image}')">
                <span class="badge-accent">${item.tag}</span>
            </div>
            <div class="muscle-info-content">
                <div class="muscle-header">
                    <h3>${item.name}</h3>
                    <span class="split-pill"><i class="fas fa-calendar-alt"></i> ${item.split}</span>
                </div>
                
                <div class="muscle-section">
                    <h4><i class="fas fa-dumbbell"></i> Key Exercises at Siya Gym</h4>
                    <ul class="exercise-tags">
                        ${item.exercises.map(ex => `<li><i class="fas fa-check-circle"></i> ${ex}</li>`).join('')}
                    </ul>
                </div>

                <div class="muscle-section">
                    <h4><i class="fas fa-cogs"></i> Kitwe Floor Machinery</h4>
                    <p class="equipment-text">${item.equipment}</p>
                </div>

                <div class="coach-tip-box">
                    <div class="coach-avatar">
                        <i class="fas fa-user-ninja"></i>
                    </div>
                    <div class="coach-tip-text">
                        <strong>Coach Siya Pro Tip:</strong>
                        <p>"${item.tip}"</p>
                    </div>
                </div>

                <div class="muscle-action-bar">
                    <a href="https://wa.me/260969919764?text=Hello%20Siya%20Gym!%20I%20want%20to%20train%20${encodeURIComponent(item.name)}%20at%20your%20Kanwe%20Ave%20branch." 
                       target="_blank" class="btn btn-primary btn-sm">
                        <i class="fab fa-whatsapp"></i> Train This at Siya Gym
                    </a>
                </div>
            </div>
        `;

        if (window.soundEngine) window.soundEngine.playClick();
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const target = btn.dataset.muscle;
            renderMuscle(target);
        });
    });

    // Default select chest
    renderMuscle('chest');
}

/* ==========================================================================
   4. Interactive Class Timetable with Day Filter
   ========================================================================== */
const scheduleData = {
    mon: [
        { name: 'Dawn Iron Pump & Compound Lifts', time: '06:00 - 07:00 AM', trainer: 'Coach Siya', zone: 'Iron Dungeon', level: 'Intense', spots: 5, icon: 'fa-dumbbell' },
        { name: 'Copperbelt HIIT & Cardio Shred', time: '08:30 - 09:30 AM', trainer: 'Coach Chileshe', zone: 'Cardio Deck', level: 'All Levels', spots: 8, icon: 'fa-bolt' },
        { name: 'After-Work Power Hour Deadlift Clinic', time: '17:30 - 18:30 PM', trainer: 'Coach Siya', zone: 'Olympic Platform', level: 'Intermediate / Pro', spots: 3, icon: 'fa-weight-hanging' },
        { name: 'Evening Combat Boxing & Agility', time: '19:00 - 20:00 PM', trainer: 'Coach Kalenga', zone: 'Combat Arena', level: 'High Energy', spots: 6, icon: 'fa-boxing-glove' }
    ],
    tue: [
        { name: 'Metabolic Conditioning & Core Fire', time: '06:00 - 07:00 AM', trainer: 'Coach Chileshe', zone: 'Turf Arena', level: 'All Levels', spots: 10, icon: 'fa-fire' },
        { name: 'Women’s Glute & Sculpt Special', time: '09:00 - 10:00 AM', trainer: 'Coach Thandiwe', zone: 'Plate Citadel', level: 'All Levels', spots: 4, icon: 'fa-female' },
        { name: 'Hypertrophy Push / Pull Masterclass', time: '17:30 - 18:45 PM', trainer: 'Coach Siya', zone: 'Free Weights', level: 'Intense', spots: 2, icon: 'fa-dumbbell' },
        { name: 'Spin & High-Cadence Sprint Clinic', time: '19:00 - 19:45 PM', trainer: 'Coach Chileshe', zone: 'Cardio Deck', level: 'Sweat Mode', spots: 7, icon: 'fa-biking' }
    ],
    wed: [
        { name: 'Morning Savage Strength & Squats', time: '06:00 - 07:15 AM', trainer: 'Coach Siya', zone: 'Squat Racks', level: 'Extreme', spots: 4, icon: 'fa-shield-alt' },
        { name: 'Mobility, Flexibility & Spinal Decompression', time: '10:00 - 10:45 AM', trainer: 'Coach Thandiwe', zone: 'Recovery Studio', level: 'All Levels', spots: 12, icon: 'fa-spa' },
        { name: 'Total Body Functional Circuit', time: '17:30 - 18:30 PM', trainer: 'Coach Kalenga', zone: 'Combat Arena', level: 'High Energy', spots: 5, icon: 'fa-running' },
        { name: 'Night Owl Heavy Bag Kickboxing', time: '19:00 - 20:00 PM', trainer: 'Coach Kalenga', zone: 'Combat Arena', level: 'High Burn', spots: 6, icon: 'fa-boxing-glove' }
    ],
    thu: [
        { name: 'Sunrise Athletic Agility & Sled Drills', time: '06:00 - 07:00 AM', trainer: 'Coach Chileshe', zone: 'Turf Zone', level: 'Athletes', spots: 6, icon: 'fa-stopwatch' },
        { name: 'Biceps & Boulder Shoulders Super-Set', time: '12:00 - 12:45 PM', trainer: 'Coach Siya', zone: 'Iron Dungeon', level: 'Intermediate', spots: 7, icon: 'fa-dumbbell' },
        { name: 'Copperbelt Iron Shred (Full Body)', time: '17:30 - 18:30 PM', trainer: 'Coach Siya', zone: 'Main Floor', level: 'Intense', spots: 3, icon: 'fa-fire-alt' },
        { name: 'Dance Fitness & Afro-Beats Sweat', time: '18:45 - 19:45 PM', trainer: 'Coach Thandiwe', zone: 'Group Arena', level: 'Fun & Calorie Burn', spots: 15, icon: 'fa-music' }
    ],
    fri: [
        { name: 'Fast-Track Fat Melter Bootcamp', time: '06:00 - 07:00 AM', trainer: 'Coach Chileshe', zone: 'Cardio Deck', level: 'High Energy', spots: 9, icon: 'fa-bolt' },
        { name: 'Arms & Abs Weekend Blast', time: '16:30 - 17:30 PM', trainer: 'Coach Siya', zone: 'Iron Dungeon', level: 'All Levels', spots: 5, icon: 'fa-hand-rock' },
        { name: 'Heavy Friday Night Powerlifting Jam', time: '18:00 - 19:30 PM', trainer: 'Coach Siya', zone: 'Olympic Platform', level: 'Extreme', spots: 4, icon: 'fa-weight-hanging' }
    ],
    sat: [
        { name: 'Weekend Warrior 90-Min Mega Challenge', time: '07:00 - 08:30 AM', trainer: 'All Siya Coaches', zone: 'Full Facility', level: 'Epic Level', spots: 8, icon: 'fa-trophy' },
        { name: 'Boxing & Sparring Fundamental Workshop', time: '09:00 - 10:15 AM', trainer: 'Coach Kalenga', zone: 'Combat Arena', level: 'All Levels', spots: 10, icon: 'fa-boxing-glove' },
        { name: 'Open Gym Free Lift & Community Pump', time: '10:30 - 18:00 PM', trainer: 'Floor Marshals', zone: 'All Zones', level: 'Open Access', spots: 50, icon: 'fa-users' }
    ]
};

function initClassTimetable() {
    const dayButtons = document.querySelectorAll('.schedule-tab-btn');
    const scheduleGrid = document.getElementById('schedule-grid');
    if (!dayButtons.length || !scheduleGrid) return;

    function renderDay(dayKey) {
        const classes = scheduleData[dayKey] || scheduleData['mon'];
        scheduleGrid.innerHTML = '';

        classes.forEach(cls => {
            const card = document.createElement('div');
            card.className = 'schedule-card';
            card.innerHTML = `
                <div class="card-time-badge">
                    <i class="far fa-clock"></i> ${cls.time}
                </div>
                <div class="card-header-meta">
                    <span class="zone-pill"><i class="fas fa-map-marker-alt"></i> ${cls.zone}</span>
                    <span class="spots-badge"><i class="fas fa-ticket-alt"></i> ${cls.spots} spots left</span>
                </div>
                <h3 class="card-title">${cls.name}</h3>
                <div class="card-trainer">
                    <div class="trainer-avatar-mini">
                        <i class="fas fa-user-shield"></i>
                    </div>
                    <div>
                        <div class="trainer-name">${cls.trainer}</div>
                        <div class="trainer-role">Certified Instructor</div>
                    </div>
                </div>
                <div class="card-footer">
                    <span class="intensity-label"><i class="fas fa-fire"></i> ${cls.level}</span>
                    <a href="https://wa.me/260969919764?text=Hello%20Siya%20Gym!%20I%20would%20like%20to%20book%20a%20spot%20in%20the%20${encodeURIComponent(cls.name)}%20(${cls.time})." 
                       target="_blank" class="btn btn-outline btn-xs book-class-btn">
                        Book Spot <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `;
            scheduleGrid.appendChild(card);
        });

        if (window.soundEngine) window.soundEngine.playClick();
    }

    dayButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            dayButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderDay(btn.dataset.day);
        });
    });

    renderDay('mon');
}

/* ==========================================================================
   5. Interactive Before & After Transformation Slider
   ========================================================================== */
function initTransformationSlider() {
    const container = document.querySelector('.comparison-container');
    const afterImg = document.querySelector('.comparison-after');
    const handle = document.querySelector('.comparison-handle');
    if (!container || !afterImg || !handle) return;

    let isDown = false;

    function move(x) {
        const rect = container.getBoundingClientRect();
        let pos = (x - rect.left) / rect.width;
        if (pos < 0) pos = 0;
        if (pos > 1) pos = 1;
        const percentage = pos * 100;

        afterImg.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
        handle.style.left = `${percentage}%`;
    }

    container.addEventListener('mousedown', (e) => {
        isDown = true;
        move(e.clientX);
    });

    window.addEventListener('mouseup', () => { isDown = false; });
    window.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        move(e.clientX);
    });

    // Touch support
    container.addEventListener('touchstart', (e) => {
        isDown = true;
        move(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => { isDown = false; });
    window.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        move(e.touches[0].clientX);
    }, { passive: true });
}

/* ==========================================================================
   6. Pricing Switcher (Monthly, Quarterly, Annual)
   ========================================================================== */
function initPricingSwitcher() {
    const buttons = document.querySelectorAll('.pricing-toggle-btn');
    const prices = document.querySelectorAll('.price-val');
    const billingLabels = document.querySelectorAll('.price-period');
    const saveBadges = document.querySelectorAll('.savings-callout');

    const rates = {
        month: {
            starter: 'K450',
            vip: 'K750',
            pro: 'K1,450',
            period: '/ month',
            saveText: ''
        },
        quarter: {
            starter: 'K380',
            vip: 'K640',
            pro: 'K1,250',
            period: '/ month (billed quarterly)',
            saveText: 'Save 15% ZMK'
        },
        year: {
            starter: 'K300',
            vip: 'K490',
            pro: 'K990',
            period: '/ month (billed annually)',
            saveText: 'Save 35% + Free Personal Session'
        }
    };

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const cycle = btn.dataset.cycle;
            const data = rates[cycle];

            document.getElementById('price-starter').textContent = data.starter;
            document.getElementById('price-vip').textContent = data.vip;
            document.getElementById('price-pro').textContent = data.pro;

            billingLabels.forEach(lbl => lbl.textContent = data.period);

            saveBadges.forEach(b => {
                if (data.saveText) {
                    b.textContent = data.saveText;
                    b.style.display = 'inline-block';
                } else {
                    b.style.display = 'none';
                }
            });

            if (window.soundEngine) window.soundEngine.playClick();
        });
    });
}

/* ==========================================================================
   7. Interactive Body Calculator UI
   ========================================================================== */
function initCalculatorUI() {
    const form = document.getElementById('fitness-calc-form');
    const resultsPanel = document.getElementById('calc-results');
    const emptyState = document.getElementById('calc-empty-state');
    if (!form || !resultsPanel) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const gender = form.elements['gender'].value;
        const age = parseInt(form.elements['age'].value) || 25;
        const height = parseFloat(form.elements['height'].value) || 175;
        const weight = parseFloat(form.elements['weight'].value) || 75;
        const activity = form.elements['activity'].value;
        const goal = form.elements['goal'].value;

        const plan = calculateFitnessPlan({ gender, age, height, weight, activity, goal });

        // Update DOM
        document.getElementById('res-target-cals').textContent = plan.targetCalories.toLocaleString();
        document.getElementById('res-bmi').textContent = plan.bmi;
        document.getElementById('res-bmi-cat').textContent = plan.bmiCategory;
        document.getElementById('res-bmi-cat').style.color = plan.bmiColor;
        document.getElementById('res-protein').textContent = `${plan.proteinGrams}g`;
        document.getElementById('res-carbs').textContent = `${plan.carbGrams}g`;
        document.getElementById('res-fat').textContent = `${plan.fatGrams}g`;
        document.getElementById('res-water').textContent = `${plan.waterLitres} L`;
        document.getElementById('res-goal-title').textContent = plan.goalTitle;
        document.getElementById('res-goal-desc').textContent = plan.goalDescription;

        // Render Routine
        const routineContainer = document.getElementById('res-routine-list');
        if (routineContainer) {
            routineContainer.innerHTML = plan.recommendedRoutine.map(r => `
                <div class="routine-day-row">
                    <span class="day-badge">${r.day}</span>
                    <span class="day-focus">${r.focus}</span>
                    <span class="day-intensity ${r.intensity.toLowerCase()}">${r.intensity}</span>
                </div>
            `).join('');
        }

        // WhatsApp consultation button
        const waBtn = document.getElementById('wa-calc-consult-btn');
        if (waBtn) {
            waBtn.href = generateWhatsAppConsultLink(plan);
        }

        if (emptyState) emptyState.style.display = 'none';
        resultsPanel.style.display = 'block';

        // Play feedback & celebrate
        if (window.soundEngine) window.soundEngine.playSuccess();
        triggerConfetti();

        // Scroll to results on mobile
        if (window.innerWidth < 768) {
            resultsPanel.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Lightweight Confetti Trigger
function triggerConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFC72C', '#10B981', '#ffffff', '#FF4500']
        });
    }
}

/* ==========================================================================
   9. Audio Toggle UI
   ========================================================================== */
function initAudioToggle() {
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (!audioBtn || !window.soundEngine) return;

    function updateLabel() {
        if (window.soundEngine.enabled) {
            audioBtn.innerHTML = `<i class="fas fa-volume-up"></i> <span>AUDIO: ON</span>`;
            audioBtn.classList.add('audio-active');
        } else {
            audioBtn.innerHTML = `<i class="fas fa-volume-mute"></i> <span>AUDIO: OFF</span>`;
            audioBtn.classList.remove('audio-active');
        }
    }

    updateLabel();

    audioBtn.addEventListener('click', () => {
        window.soundEngine.toggle();
        updateLabel();
    });
}

/* ==========================================================================
   10. Mobile Navigation & Drawer
   ========================================================================== */
function initMobileNav() {
    const toggle = document.getElementById('mobile-nav-toggle');
    const drawer = document.getElementById('mobile-nav-drawer');
    const links = document.querySelectorAll('.mobile-nav-link');
    if (!toggle || !drawer) return;

    toggle.addEventListener('click', () => {
        drawer.classList.toggle('open');
        toggle.classList.toggle('is-open');
        if (window.soundEngine) window.soundEngine.playClick();
    });

    links.forEach(l => {
        l.addEventListener('click', () => {
            drawer.classList.remove('active');
            toggle.classList.remove('is-open');
        });
    });
}

/* ==========================================================================
   11. Scroll Animations & Reveal
   ========================================================================== */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(el => observer.observe(el));
}
