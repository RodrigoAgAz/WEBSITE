// Anna Healthcare AI - Main JavaScript File

// DOM Elements
const navbar = document.querySelector('.navbar');
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Mobile Navigation
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Demo Tab Functionality
const demoTabs = document.querySelectorAll('.demo-tab');
const demoScenarios = document.querySelectorAll('.demo-scenario');

demoTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const demoType = tab.dataset.demo;
        
        // Update active tab
        demoTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show corresponding scenario
        demoScenarios.forEach(scenario => {
            scenario.classList.remove('active');
        });
        
        const activeScenario = document.getElementById(`${demoType}-demo`);
        if (activeScenario) {
            activeScenario.classList.add('active');
            
            // Animate chat messages
            const messages = activeScenario.querySelectorAll('.chat-message');
            messages.forEach((message, index) => {
                message.style.opacity = '0';
                message.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    message.style.transition = 'all 0.4s ease';
                    message.style.opacity = '1';
                    message.style.transform = 'translateY(0)';
                }, index * 300);
            });
        }
    });
});

// Enhanced ROI Calculator with Comprehensive Logic
function initEnhancedROICalculator() {
    // Constants
    const CMS_AVERAGE_PAYMENT = 14000; // Average annual payment per member
    const STAR_BONUS_RATE = 0.05; // 5% bonus for 4+ stars
    const MED_ADHERENCE_VALUE_PER_POINT = 15; // $15 saved per percentage point improvement
    const AWV_PAYMENT = 175; // CMS payment per AWV
    const READMISSION_COST = 15000; // Average cost of readmission
    const ADMISSION_RATE = 0.20; // 20% of members admitted annually
    const PMPM_COST = 1.00; // Anna cost per member per month
    const FTE_HOURLY_COST = 35; // Fully loaded hourly cost for care team
    const HOURS_SAVED_PER_ENGAGED_MEMBER = 2; // Annual hours saved per engaged member
    
    // Engagement rate multipliers by type
    const ENGAGEMENT_MULTIPLIERS = {
        medication: 0.7,    // 70% of overall engagement respond to med reminders
        awv: 0.6,          // 60% of overall engagement complete AWV scheduling
        discharge: 0.8     // 80% of overall engagement respond to discharge follow-ups
    };
    
    // Get DOM elements
    const memberCountInput = document.getElementById('member-count');
    const currentStarSelect = document.getElementById('current-star');
    const annualChurnSlider = document.getElementById('annual-churn');
    const churnInput = document.getElementById('churn-input');
    const overallEngagementSlider = document.getElementById('overall-engagement');
    const overallInput = document.getElementById('overall-input');
    
    // Impact sliders
    const adherenceImpactSlider = document.getElementById('adherence-impact');
    const awvImpactSlider = document.getElementById('awv-impact');
    const readmissionImpactSlider = document.getElementById('readmission-impact');
    const churnImpactSlider = document.getElementById('churn-impact');
    
    // Scenario buttons
    const scenarioButtons = document.querySelectorAll('.scenario-btn');
    
    // Check if calculator exists
    if (!memberCountInput) return;
    
    // Sync sliders with inputs
    function syncSliderAndInput(slider, input) {
        slider.addEventListener('input', () => {
            input.value = slider.value;
            calculateROI();
        });
        
        input.addEventListener('input', () => {
            slider.value = input.value;
            calculateROI();
        });
    }
    
    syncSliderAndInput(annualChurnSlider, churnInput);
    syncSliderAndInput(overallEngagementSlider, overallInput);
    
    // Update impact value displays
    adherenceImpactSlider.addEventListener('input', () => {
        document.getElementById('adherence-value').textContent = adherenceImpactSlider.value;
        calculateROI();
    });
    
    awvImpactSlider.addEventListener('input', () => {
        document.getElementById('awv-value').textContent = awvImpactSlider.value;
        calculateROI();
    });
    
    readmissionImpactSlider.addEventListener('input', () => {
        document.getElementById('readmission-value').textContent = readmissionImpactSlider.value;
        calculateROI();
    });
    
    churnImpactSlider.addEventListener('input', () => {
        document.getElementById('churn-value').textContent = churnImpactSlider.value;
        calculateROI();
    });
    
    // Update engagement breakdown when overall changes
    overallEngagementSlider.addEventListener('input', updateEngagementBreakdown);
    
    // Add event listeners
    memberCountInput.addEventListener('input', calculateROI);
    currentStarSelect.addEventListener('change', calculateROI);
    
    // Scenario button handlers
    scenarioButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            scenarioButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const scenario = btn.dataset.scenario;
            setScenarioValues(scenario);
            calculateROI();
        });
    });
    
    function updateEngagementBreakdown() {
        const overall = parseInt(overallEngagementSlider.value);
        document.getElementById('med-response').textContent = Math.round(overall * ENGAGEMENT_MULTIPLIERS.medication) + '%';
        document.getElementById('awv-response').textContent = Math.round(overall * ENGAGEMENT_MULTIPLIERS.awv) + '%';
        document.getElementById('discharge-response').textContent = Math.round(overall * ENGAGEMENT_MULTIPLIERS.discharge) + '%';
    }
    
    // Set scenario values
    function setScenarioValues(scenario) {
        if (scenario === 'conservative') {
            adherenceImpactSlider.value = 5;
            awvImpactSlider.value = 5;
            readmissionImpactSlider.value = 5;
            churnImpactSlider.value = 10;
        } else if (scenario === 'expected') {
            adherenceImpactSlider.value = 7.5;
            awvImpactSlider.value = 10;
            readmissionImpactSlider.value = 7.5;
            churnImpactSlider.value = 15;
        } else if (scenario === 'best') {
            adherenceImpactSlider.value = 10;
            awvImpactSlider.value = 15;
            readmissionImpactSlider.value = 10;
            churnImpactSlider.value = 20;
        }
        
        // Update displays
        document.getElementById('adherence-value').textContent = adherenceImpactSlider.value;
        document.getElementById('awv-value').textContent = awvImpactSlider.value;
        document.getElementById('readmission-value').textContent = readmissionImpactSlider.value;
        document.getElementById('churn-value').textContent = churnImpactSlider.value;
    }
    
    // Apply diminishing returns based on current performance
    function applyDiminishingReturns(improvement, currentPerformance) {
        // If already high performing, reduce the impact
        if (currentPerformance >= 85) {
            return improvement * 0.5; // 50% effectiveness
        } else if (currentPerformance >= 75) {
            return improvement * 0.75; // 75% effectiveness
        }
        return improvement; // Full effectiveness
    }
    
    // Main calculation function
    function calculateROI() {
        // Get input values
        const totalMembers = parseInt(memberCountInput.value) || 2000;
        const currentStar = parseFloat(currentStarSelect.value);
        const currentChurn = parseInt(annualChurnSlider.value) / 100;
        const overallEngagement = parseInt(overallEngagementSlider.value) / 100;
        
        // Get impact values
        const adherenceImprovement = parseFloat(adherenceImpactSlider.value);
        const awvImprovement = parseFloat(awvImpactSlider.value);
        const readmissionReduction = parseFloat(readmissionImpactSlider.value);
        const churnReduction = parseFloat(churnImpactSlider.value) / 100;
        
        // Calculate type-specific engaged members
        const medEngagedMembers = Math.round(totalMembers * overallEngagement * ENGAGEMENT_MULTIPLIERS.medication);
        const awvEngagedMembers = Math.round(totalMembers * overallEngagement * ENGAGEMENT_MULTIPLIERS.awv);
        const dischargeEngagedMembers = Math.round(totalMembers * overallEngagement * ENGAGEMENT_MULTIPLIERS.discharge);
        
        // === REVENUE IMPACTS ===
        
        // 1. STAR Rating Bonus (with proper CMS logic)
        let starBonus = 0;
        let starDetails = "No bonus eligibility";
        let bonusMessage = "";
        
        // Only specific thresholds matter for CMS bonuses
        if (currentStar < 4.0) {
            // Can we reach 4.0?
            const maxPossibleImprovement = 0.5; // Cap at 0.5 star improvement
            const starImprovement = Math.min(maxPossibleImprovement, 
                adherenceImprovement * 0.02 + awvImprovement * 0.01); // Weighted impact
            
            const newStar = currentStar + starImprovement;
            
            if (newStar >= 4.0) {
                starBonus = totalMembers * CMS_AVERAGE_PAYMENT * STAR_BONUS_RATE;
                starDetails = `Crossing 4-star threshold (${currentStar} → ${newStar.toFixed(1)})`;
                bonusMessage = `Reaching 4+ stars unlocks a 5% quality bonus payment worth ${formatCurrency(starBonus)} annually.`;
            } else {
                bonusMessage = `Currently at ${currentStar} stars. Need ${(4.0 - newStar).toFixed(1)} more stars to qualify for 5% bonus.`;
            }
        } else if (currentStar >= 4.0 && currentStar < 4.5) {
            starDetails = "Already receiving 4-star bonus";
            bonusMessage = "Your plan already qualifies for the 5% quality bonus. Focus on maintaining 4+ star rating.";
        } else {
            starDetails = "Maximum bonus already achieved";
            bonusMessage = "At 4.5+ stars, you're already receiving maximum CMS bonuses.";
        }
        
        // 2. Member Retention Revenue
        const churningMembers = totalMembers * currentChurn;
        const retainedMembers = Math.round(churningMembers * churnReduction);
        const retentionRevenue = retainedMembers * CMS_AVERAGE_PAYMENT;
        
        // 3. AWV Revenue
        const additionalAWVs = Math.round(awvEngagedMembers * (awvImprovement / 100));
        const awvRevenue = additionalAWVs * AWV_PAYMENT;
        
        // === COST SAVINGS ===
        
        // 4. Medication Adherence Savings (with diminishing returns)
        const effectiveAdherenceImprovement = applyDiminishingReturns(adherenceImprovement, 75); // Assume 75% baseline
        const adherenceSavings = medEngagedMembers * effectiveAdherenceImprovement * MED_ADHERENCE_VALUE_PER_POINT;
        
        // 5. Readmission Prevention
        const admittedEngagedMembers = dischargeEngagedMembers * ADMISSION_RATE;
        const currentReadmissions = admittedEngagedMembers * 0.18; // 18% readmission rate
        const preventedReadmissions = currentReadmissions * (readmissionReduction / 100);
        const readmissionSavings = preventedReadmissions * READMISSION_COST;
        
        // 6. Care Team Efficiency Savings
        const totalEngagedMembers = totalMembers * overallEngagement;
        const hoursSaved = totalEngagedMembers * HOURS_SAVED_PER_ENGAGED_MEMBER;
        const fteSaved = hoursSaved / 2080; // Annual working hours
        const efficiencySavings = hoursSaved * FTE_HOURLY_COST;
        
        // === TOTALS ===
        const totalRevenueLift = starBonus + retentionRevenue + awvRevenue;
        const totalCostSavings = adherenceSavings + readmissionSavings + efficiencySavings;
        const totalValue = totalRevenueLift + totalCostSavings;
        
        // Program costs
        const annaCost = totalMembers * PMPM_COST * 12;
        const netBenefit = totalValue - annaCost;
        const roi = annaCost > 0 ? Math.round((netBenefit / annaCost) * 100) : 0;
        const paybackMonths = totalValue > 0 ? (annaCost / (totalValue / 12)).toFixed(1) : 'N/A';
        
        // Update display
        updateDisplay({
            // Summary
            totalRevenueLift,
            totalCostSavings,
            totalValue,
            annaCost,
            netBenefit,
            roi,
            paybackMonths,
            
            // Revenue details
            starBonus,
            starDetails,
            bonusMessage,
            retentionRevenue,
            retainedMembers,
            awvRevenue,
            additionalAWVs,
            
            // Cost savings details
            adherenceSavings,
            effectiveAdherenceImprovement,
            medEngagedMembers,
            readmissionSavings,
            preventedReadmissions,
            efficiencySavings,
            hoursSaved,
            fteSaved
        });
    }
    
    // THE MISSING FUNCTION - Update Display
    function updateDisplay(results) {
        // Update summary cards
        document.getElementById('total-revenue').textContent = formatCurrency(results.totalRevenueLift);
        document.getElementById('total-savings').textContent = formatCurrency(results.totalCostSavings);
        document.getElementById('anna-investment').textContent = formatCurrency(results.annaCost);
        document.getElementById('net-benefit').textContent = formatCurrency(results.netBenefit);
        
        // Update revenue breakdown with better structure
        updateBreakdownItem('star-bonus', results.starBonus, results.starDetails);
        updateBreakdownItem('retention', results.retentionRevenue, `${results.retainedMembers} members retained`);
        updateBreakdownItem('awv-revenue', results.awvRevenue, `${results.additionalAWVs} additional AWVs`);
        
        // Update cost savings breakdown
        updateBreakdownItem('adherence-savings', results.adherenceSavings, 
            `${results.effectiveAdherenceImprovement.toFixed(1)}% improvement across ${results.medEngagedMembers} engaged members`);
        updateBreakdownItem('readmission-savings', results.readmissionSavings, 
            `${results.preventedReadmissions.toFixed(1)} readmissions prevented`);
        updateBreakdownItem('efficiency', results.efficiencySavings, 
            `${results.hoursSaved.toFixed(0)} FTE hours saved (${results.fteSaved.toFixed(1)} FTEs)`);
        
        // Update bonus alert
        const bonusAlert = document.getElementById('bonus-alert');
        const bonusMessageElement = document.getElementById('bonus-message');
        if (results.bonusMessage) {
            bonusAlert.style.display = 'flex';
            bonusMessageElement.textContent = results.bonusMessage;
        } else {
            bonusAlert.style.display = 'none';
        }
    }
    
    // Helper function to update breakdown items consistently
    function updateBreakdownItem(prefix, amount, details) {
        const amountEl = document.getElementById(`${prefix}-amount`);
        const detailsEl = document.getElementById(`${prefix}-details`);
        
        if (amountEl) amountEl.textContent = formatCurrency(amount);
        if (detailsEl) detailsEl.textContent = details;
    }
    
    function formatCurrency(value, compact = false) {
        if (compact && Math.abs(value) >= 1000000) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                notation: 'compact',
                maximumFractionDigits: 1
            }).format(value);
        }
        
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }
    
    // Initialize
    updateEngagementBreakdown();
    setScenarioValues('expected');
    calculateROI();
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Add staggered animation to children
            const children = entry.target.querySelectorAll('.animate-child');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('visible');
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Observe elements with animation classes
document.querySelectorAll('.animate-fade-in, .animate-slide-left, .animate-slide-right').forEach(el => {
    observer.observe(el);
});

// Feature Cards Hover Effect
const featureCards = document.querySelectorAll('.feature-card, .use-case, .pilot-benefit');

featureCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Process Timeline Animation
const processSteps = document.querySelectorAll('.process-step');
const processObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 200);
        }
    });
}, { threshold: 0.3 });

processSteps.forEach(step => {
    processObserver.observe(step);
});

// Active Navigation Highlighting
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize active section highlighting
highlightActiveSection();

// Performance Optimization - Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-based functions
window.addEventListener('scroll', debounce(() => {
    // Navbar scroll effect
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 10));

// Initialize ROI Calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initEnhancedROICalculator();
    
    // Initialize first demo tab if exists
    const firstTab = document.querySelector('.demo-tab.active');
    if (firstTab) {
        firstTab.click();
    }
});