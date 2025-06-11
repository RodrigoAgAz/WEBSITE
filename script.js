// Anna Healthcare AI - Main JavaScript File

// Wait for DOM to be fully loaded before initializing anything (Fix #10)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeSmoothScrolling();
    initializeDemoTabs();
    initializeEnhancedROICalculator();
    initializeAnimations();
    initializeFeatureCards();
    
    // Initialize first demo tab if exists
    const firstTab = document.querySelector('.demo-tab.active');
    if (firstTab) {
        firstTab.click();
    }
});

// Navigation functionality
function initializeNavigation() {
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
            if (mobileToggle) mobileToggle.classList.remove('active');
            if (navMenu) navMenu.classList.remove('active');
        });
    });
    
    // Navbar Scroll Effect - Debounced (Fix #9 - single listener)
    const debouncedScroll = debounce(() => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 10);
    
    window.addEventListener('scroll', debouncedScroll);
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Demo Tab Functionality
function initializeDemoTabs() {
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
}

// Enhanced ROI Calculator with All Fixes
function initializeEnhancedROICalculator() {
    // Check if calculator exists on page
    const memberCountInput = document.getElementById('member-count');
    if (!memberCountInput) return;
    
    // Get DOM elements
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
    
    // Advanced settings (Fix #13)
    let advancedSettings = {
        chronicMedPrevalence: ROI_CONFIG.CHRONIC_MED_PREVALENCE,
        acquisitionCost: ROI_CONFIG.MEMBER_ACQUISITION_COST,
        hccValue: ROI_CONFIG.AWV_HCC_RISK_ADJUSTMENT,
        fteHourlyCost: ROI_CONFIG.FTE_HOURLY_COST
    };
    
    // Store all scenarios for comparison (Fix #12)
    let scenarioResults = {
        conservative: null,
        expected: null,
        best: null
    };
    
    // Validation function (Fix #7)
    function validateInput(input, min, max) {
        let value = parseFloat(input.value);
        if (isNaN(value) || value < min) {
            input.value = min;
            return min;
        }
        if (value > max) {
            input.value = max;
            return max;
        }
        return value;
    }
    
    // Apply validation to inputs
    memberCountInput.addEventListener('input', function() {
        this.value = validateInput(this, ROI_CONFIG.VALIDATION.memberCount.min, ROI_CONFIG.VALIDATION.memberCount.max);
    });
    
    // Sync sliders with inputs
    function syncSliderAndInput(slider, input) {
        slider.addEventListener('input', () => {
            input.value = slider.value;
            calculateAllScenarios();
        });
        
        input.addEventListener('input', () => {
            const validated = validateInput(input, slider.min, slider.max);
            slider.value = validated;
            calculateAllScenarios();
        });
    }
    
    syncSliderAndInput(annualChurnSlider, churnInput);
    syncSliderAndInput(overallEngagementSlider, overallInput);
    
    // Update impact value displays
    adherenceImpactSlider.addEventListener('input', () => {
        document.getElementById('adherence-value').textContent = adherenceImpactSlider.value;
        calculateAllScenarios();
    });
    
    awvImpactSlider.addEventListener('input', () => {
        document.getElementById('awv-value').textContent = awvImpactSlider.value;
        calculateAllScenarios();
    });
    
    readmissionImpactSlider.addEventListener('input', () => {
        document.getElementById('readmission-value').textContent = readmissionImpactSlider.value;
        calculateAllScenarios();
    });
    
    churnImpactSlider.addEventListener('input', () => {
        document.getElementById('churn-value').textContent = churnImpactSlider.value;
        calculateAllScenarios();
    });
    
    // Update engagement breakdown when overall changes
    overallEngagementSlider.addEventListener('input', updateEngagementBreakdown);
    
    // Add event listeners
    memberCountInput.addEventListener('input', calculateAllScenarios);
    currentStarSelect.addEventListener('change', calculateAllScenarios);
    
    // Scenario button handlers
    scenarioButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            scenarioButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const scenario = btn.dataset.scenario;
            displayScenarioResults(scenario);
        });
    });
    
    function updateEngagementBreakdown() {
        const overall = parseInt(overallEngagementSlider.value);
        document.getElementById('med-response').textContent = 
            Math.round(overall * ROI_CONFIG.ENGAGEMENT_MULTIPLIERS.medication) + '%';
        document.getElementById('awv-response').textContent = 
            Math.round(overall * ROI_CONFIG.ENGAGEMENT_MULTIPLIERS.awv) + '%';
        document.getElementById('discharge-response').textContent = 
            Math.round(overall * ROI_CONFIG.ENGAGEMENT_MULTIPLIERS.discharge) + '%';
    }
    
    // Calculate all scenarios at once (Fix #12)
    function calculateAllScenarios() {
        // Conservative scenario
        const conservativeResults = calculateROI({
            adherenceImprovement: 5,
            awvImprovement: 5,
            readmissionReduction: 5,
            churnReduction: 10
        });
        scenarioResults.conservative = conservativeResults;
        
        // Expected scenario
        const expectedResults = calculateROI({
            adherenceImprovement: parseFloat(adherenceImpactSlider.value),
            awvImprovement: parseFloat(awvImpactSlider.value),
            readmissionReduction: parseFloat(readmissionImpactSlider.value),
            churnReduction: parseFloat(churnImpactSlider.value)
        });
        scenarioResults.expected = expectedResults;
        
        // Best case scenario
        const bestResults = calculateROI({
            adherenceImprovement: 10,
            awvImprovement: 15,
            readmissionReduction: 10,
            churnReduction: 20
        });
        scenarioResults.best = bestResults;
        
        // Display current active scenario
        const activeScenario = document.querySelector('.scenario-btn.active').dataset.scenario;
        displayScenarioResults(activeScenario);
    }
    
    // Main calculation function with all fixes
    function calculateROI(impacts) {
        // Get input values with validation
        const totalMembers = validateInput(memberCountInput, 1, 1000000);
        const currentStar = parseFloat(currentStarSelect.value);
        const currentChurn = parseInt(annualChurnSlider.value) / 100;
        const overallEngagement = parseInt(overallEngagementSlider.value) / 100;
        
        // Calculate type-specific engaged members
        const medEngagedMembers = Math.round(totalMembers * overallEngagement * 
            ROI_CONFIG.ENGAGEMENT_MULTIPLIERS.medication);
        const awvEngagedMembers = Math.round(totalMembers * overallEngagement * 
            ROI_CONFIG.ENGAGEMENT_MULTIPLIERS.awv);
        const dischargeEngagedMembers = Math.round(totalMembers * overallEngagement * 
            ROI_CONFIG.ENGAGEMENT_MULTIPLIERS.discharge);
        
        // === REVENUE IMPACTS ===
        
        // 1. STAR Rating Bonus AND Rebate (Fix #1 & #2)
        let starBonus = 0;
        let rebateIncrease = 0;
        let starDetails = "No bonus eligibility";
        let bonusMessage = "";
        
        // Calculate potential STAR improvement using weighted measures
        const adherenceStarLift = (impacts.adherenceImprovement / 100) * 
            ROI_CONFIG.STAR_MEASURE_IMPACTS.medicationAdherence.weight;
        const awvStarLift = (impacts.awvImprovement / 100) * 
            ROI_CONFIG.STAR_MEASURE_IMPACTS.annualWellnessVisit.weight;
        const readmissionStarLift = (impacts.readmissionReduction / 100) * 
            ROI_CONFIG.STAR_MEASURE_IMPACTS.readmissionRate.weight;
        
        const totalStarImprovement = Math.min(0.5, // Cap at 0.5 stars
            adherenceStarLift + awvStarLift + readmissionStarLift);
        
        const projectedStar = Math.min(5, currentStar + totalStarImprovement);
        
        // Quality bonus calculation
        if (currentStar < 4.0 && projectedStar >= 4.0) {
            starBonus = totalMembers * ROI_CONFIG.CMS_AVERAGE_PAYMENT * 
                ROI_CONFIG.STAR_BONUSES.QUALITY_BONUS_RATE;
            starDetails = `Crossing 4-star threshold (${currentStar} → ${projectedStar.toFixed(1)})`;
        }
        
        // Rebate calculation
        const currentRebate = ROI_CONFIG.STAR_BONUSES.REBATE_PERCENTAGES[currentStar.toFixed(1)] || 0.5;
        const projectedRebate = ROI_CONFIG.STAR_BONUSES.REBATE_PERCENTAGES[projectedStar.toFixed(1)] || 
            ROI_CONFIG.STAR_BONUSES.REBATE_PERCENTAGES['4.0'];
        
        if (projectedRebate > currentRebate) {
            // Assume $2M in savings for rebate calculation
            const assumedSavings = totalMembers * 200; // $200 per member
            rebateIncrease = assumedSavings * (projectedRebate - currentRebate);
            starDetails += ` + ${((projectedRebate - currentRebate) * 100).toFixed(0)}% rebate increase`;
        }
        
        // 2. Member Retention Revenue (Fix #3 - LTV approach)
        const churningMembers = totalMembers * currentChurn;
        const retainedMembers = Math.round(churningMembers * (impacts.churnReduction / 100));
        const lifetimeValue = ROI_CONFIG.CMS_AVERAGE_PAYMENT * ROI_CONFIG.MEMBER_LIFETIME_VALUE_YEARS;
        const retentionRevenue = retainedMembers * 
            (lifetimeValue - advancedSettings.acquisitionCost) / ROI_CONFIG.MEMBER_LIFETIME_VALUE_YEARS;
        
        // 3. AWV Revenue with HCC (Fix #4)
        const additionalAWVs = Math.round(awvEngagedMembers * (impacts.awvImprovement / 100));
        const awvRevenue = additionalAWVs * (ROI_CONFIG.AWV_PAYMENT + advancedSettings.hccValue);
        
        // === COST SAVINGS ===
        
        // 4. Medication Adherence Savings (Fix #5 - chronic only)
        const chronicMedMembers = medEngagedMembers * advancedSettings.chronicMedPrevalence;
        const effectiveAdherenceImprovement = applyDiminishingReturns(impacts.adherenceImprovement, 75);
        const adherenceSavings = chronicMedMembers * effectiveAdherenceImprovement * 
            ROI_CONFIG.MED_ADHERENCE_SAVINGS_PER_POINT;
        
        // 5. Readmission Prevention
        const admittedEngagedMembers = dischargeEngagedMembers * ROI_CONFIG.ANNUAL_ADMISSION_RATE;
        const currentReadmissions = admittedEngagedMembers * ROI_CONFIG.BASELINE_READMISSION_RATE;
        const preventedReadmissions = currentReadmissions * (impacts.readmissionReduction / 100);
        const readmissionSavings = preventedReadmissions * ROI_CONFIG.READMISSION_COST;
        
        // 6. Care Team Efficiency Savings
        const totalEngagedMembers = totalMembers * overallEngagement;
        const hoursSaved = totalEngagedMembers * ROI_CONFIG.HOURS_SAVED_PER_ENGAGED_MEMBER;
        const fteSaved = hoursSaved / ROI_CONFIG.ANNUAL_WORKING_HOURS;
        const efficiencySavings = hoursSaved * advancedSettings.fteHourlyCost;
        
        // === OVERLAP ADJUSTMENTS (Fix #6) ===
        const overlapAdjustments = {
            adherenceToReadmission: adherenceSavings * ROI_CONFIG.OVERLAP_ADJUSTMENTS.adherenceToReadmission,
            starToRetention: (starBonus + rebateIncrease) * ROI_CONFIG.OVERLAP_ADJUSTMENTS.starToRetention,
            awvToAdherence: awvRevenue * ROI_CONFIG.OVERLAP_ADJUSTMENTS.awvToAdherence
        };
        
        const totalOverlapAdjustment = Object.values(overlapAdjustments).reduce((a, b) => a + b, 0);
        
        // === TOTALS ===
        const totalRevenueLift = starBonus + rebateIncrease + retentionRevenue + awvRevenue;
        const totalCostSavings = adherenceSavings + readmissionSavings + efficiencySavings;
        const totalValue = totalRevenueLift + totalCostSavings - totalOverlapAdjustment;
        
        // Program costs
        const annaCost = totalMembers * ROI_CONFIG.ANNA_PMPM_COST * 12;
        const netBenefit = totalValue - annaCost;
        const roi = annaCost > 0 ? Math.round((netBenefit / annaCost) * 100) : 0;
        
        return {
            // Summary
            totalRevenueLift,
            totalCostSavings,
            totalValue,
            annaCost,
            netBenefit,
            roi,
            totalOverlapAdjustment,
            
            // Revenue details
            starBonus,
            rebateIncrease,
            starDetails,
            projectedStar,
            currentStar,
            retentionRevenue,
            retainedMembers,
            awvRevenue,
            additionalAWVs,
            
            // Cost savings details
            adherenceSavings,
            effectiveAdherenceImprovement,
            chronicMedMembers,
            readmissionSavings,
            preventedReadmissions,
            efficiencySavings,
            hoursSaved,
            fteSaved,
            
            // Overlap details
            overlapAdjustments
        };
    }
    
    // Display results for a specific scenario
    function displayScenarioResults(scenario) {
        const results = scenarioResults[scenario];
        if (!results) return;
        
        updateDisplay(results);
        
        // Show comparison table if enabled
        if (document.getElementById('comparison-mode')?.checked) {
            displayComparisonTable();
        }
    }
    
    // Display comparison table (Fix #12)
    function displayComparisonTable() {
        const comparisonContainer = document.getElementById('scenario-comparison');
        if (!comparisonContainer) return;
        
        let html = `
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Metric</th>
                        <th>Conservative</th>
                        <th>Expected</th>
                        <th>Best Case</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Total Revenue</td>
                        <td>${formatCurrency(scenarioResults.conservative?.totalRevenueLift || 0)}</td>
                        <td>${formatCurrency(scenarioResults.expected?.totalRevenueLift || 0)}</td>
                        <td>${formatCurrency(scenarioResults.best?.totalRevenueLift || 0)}</td>
                    </tr>
                    <tr>
                        <td>Total Savings</td>
                        <td>${formatCurrency(scenarioResults.conservative?.totalCostSavings || 0)}</td>
                        <td>${formatCurrency(scenarioResults.expected?.totalCostSavings || 0)}</td>
                        <td>${formatCurrency(scenarioResults.best?.totalCostSavings || 0)}</td>
                    </tr>
                    <tr>
                        <td>Net Benefit</td>
                        <td>${formatCurrency(scenarioResults.conservative?.netBenefit || 0)}</td>
                        <td>${formatCurrency(scenarioResults.expected?.netBenefit || 0)}</td>
                        <td>${formatCurrency(scenarioResults.best?.netBenefit || 0)}</td>
                    </tr>
                    <tr>
                        <td>ROI %</td>
                        <td>${scenarioResults.conservative?.roi || 0}%</td>
                        <td>${scenarioResults.expected?.roi || 0}%</td>
                        <td>${scenarioResults.best?.roi || 0}%</td>
                    </tr>
                </tbody>
            </table>
        `;
        
        comparisonContainer.innerHTML = html;
    }
    
    // Apply diminishing returns
    function applyDiminishingReturns(improvement, currentPerformance) {
        if (currentPerformance >= ROI_CONFIG.DIMINISHING_RETURNS.high.threshold) {
            return improvement * ROI_CONFIG.DIMINISHING_RETURNS.high.multiplier;
        } else if (currentPerformance >= ROI_CONFIG.DIMINISHING_RETURNS.medium.threshold) {
            return improvement * ROI_CONFIG.DIMINISHING_RETURNS.medium.multiplier;
        }
        return improvement;
    }
    
    // Update display
    function updateDisplay(results) {
        // Update summary cards
        document.getElementById('total-revenue').textContent = formatCurrency(results.totalRevenueLift);
        document.getElementById('total-savings').textContent = formatCurrency(results.totalCostSavings);
        document.getElementById('anna-investment').textContent = formatCurrency(results.annaCost);
        document.getElementById('net-benefit').textContent = formatCurrency(results.netBenefit);
        
        // Update revenue breakdown
        updateBreakdownItem('star-bonus', results.starBonus + results.rebateIncrease, results.starDetails);
        updateBreakdownItem('retention', results.retentionRevenue, 
            `${results.retainedMembers} members retained (LTV adjusted)`);
        updateBreakdownItem('awv-revenue', results.awvRevenue, 
            `${results.additionalAWVs} AWVs × $${ROI_CONFIG.AWV_PAYMENT + advancedSettings.hccValue}`);
        
        // Update cost savings breakdown
        updateBreakdownItem('adherence-savings', results.adherenceSavings, 
            `${results.effectiveAdherenceImprovement.toFixed(1)}% improvement across ${Math.round(results.chronicMedMembers)} chronic med members`);
        updateBreakdownItem('readmission-savings', results.readmissionSavings, 
            `${results.preventedReadmissions.toFixed(1)} readmissions prevented`);
        updateBreakdownItem('efficiency', results.efficiencySavings, 
            `${results.hoursSaved.toFixed(0)} hours saved (${results.fteSaved.toFixed(1)} FTEs)`);
        
        // Show overlap adjustments
        const overlapContainer = document.getElementById('overlap-adjustments');
        if (overlapContainer && results.totalOverlapAdjustment > 0) {
            overlapContainer.innerHTML = `
                <div class="overlap-warning">
                    <i class="fas fa-info-circle"></i>
                    <span>Overlap adjustment: -${formatCurrency(results.totalOverlapAdjustment)} 
                    to prevent double-counting benefits</span>
                </div>
            `;
        }
        
        // Update bonus alert
        updateBonusAlert(results);
    }
    
    // Update bonus alert with new information
    function updateBonusAlert(results) {
        const bonusAlert = document.getElementById('bonus-alert');
        const bonusMessage = document.getElementById('bonus-message');
        
        if (!bonusAlert || !bonusMessage) return;
        
        if (results.projectedStar >= 4.0 && results.currentStar < 4.0) {
            bonusAlert.style.display = 'flex';
            bonusMessage.textContent = `Reaching ${results.projectedStar.toFixed(1)} stars unlocks:
                • 5% quality bonus: ${formatCurrency(results.starBonus)}
                • ${((ROI_CONFIG.STAR_BONUSES.REBATE_PERCENTAGES[results.projectedStar.toFixed(1)] - 
                     ROI_CONFIG.STAR_BONUSES.REBATE_PERCENTAGES[results.currentStar.toFixed(1)]) * 100).toFixed(0)}% 
                  rebate increase: ${formatCurrency(results.rebateIncrease)}`;
        } else if (results.currentStar >= 4.0) {
            bonusAlert.style.display = 'flex';
            bonusMessage.textContent = `Already at ${results.currentStar} stars. 
                Focus on maintaining rating and optimizing rebate percentage.`;
        } else {
            bonusAlert.style.display = 'none';
        }
    }
    
    // Helper function to update breakdown items
    function updateBreakdownItem(prefix, amount, details) {
        const amountEl = document.getElementById(`${prefix}-amount`);
        const detailsEl = document.getElementById(`${prefix}-details`);
        
        if (amountEl) amountEl.textContent = formatCurrency(amount);
        if (detailsEl) detailsEl.textContent = details;
    }
    
    // Initialize advanced settings panel (Fix #13)
    function initializeAdvancedSettings() {
        const advancedPanel = document.createElement('div');
        advancedPanel.className = 'advanced-settings-panel';
        advancedPanel.innerHTML = `
            <button class="advanced-toggle" onclick="toggleAdvancedSettings()">
                <i class="fas fa-cog"></i> Advanced Settings
            </button>
            <div class="advanced-content" style="display: none;">
                <div class="advanced-input">
                    <label>Chronic Medication Prevalence (%)</label>
                    <input type="number" id="chronic-prev" value="${advancedSettings.chronicMedPrevalence * 100}" 
                           min="0" max="100" step="5">
                </div>
                <div class="advanced-input">
                    <label>Member Acquisition Cost ($)</label>
                    <input type="number" id="acquisition-cost" value="${advancedSettings.acquisitionCost}" 
                           min="0" max="5000" step="100">
                </div>
                <div class="advanced-input">
                    <label>HCC Risk Adjustment Value ($)</label>
                    <input type="number" id="hcc-value" value="${advancedSettings.hccValue}" 
                           min="0" max="5000" step="100">
                </div>
                <div class="advanced-input">
                    <label>FTE Hourly Cost ($)</label>
                    <input type="number" id="fte-cost" value="${advancedSettings.fteHourlyCost}" 
                           min="0" max="200" step="5">
                </div>
            </div>
        `;
        
        const calculatorInputs = document.querySelector('.enhanced-calculator-inputs');
        if (calculatorInputs) {
            calculatorInputs.appendChild(advancedPanel);
        }
    }
    
    // Initialize everything
    updateEngagementBreakdown();
    initializeAdvancedSettings();
    calculateAllScenarios();
}

// Toggle advanced settings
window.toggleAdvancedSettings = function() {
    const content = document.querySelector('.advanced-content');
    if (content) {
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    }
};

// Helper Functions
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

// Animation Observer
function initializeAnimations() {
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
}

// Feature Cards Hover Effect
function initializeFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card, .use-case, .pilot-benefit');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Toggle methodology section
window.toggleMethodology = function() {
    const content = document.querySelector('.methodology-content');
    const toggle = document.querySelector('.methodology-toggle');
    
    if (content && toggle) {
        if (content.style.display === 'none') {
            content.style.display = 'block';
            toggle.classList.add('expanded');
            
            // Smooth scroll to methodology
            setTimeout(() => {
                content.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 100);
        } else {
            content.style.display = 'none';
            toggle.classList.remove('expanded');
        }
    }
};