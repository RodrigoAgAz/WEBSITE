// ROI Calculator Configuration
// All constants in one place for easy maintenance and transparency

const ROI_CONFIG = Object.freeze({
  // CMS Payment Structure
  CMS_AVERAGE_PAYMENT: 14000, // Average annual payment per Medicare Advantage member
  
  // STAR Rating Bonuses & Rebates
  STAR_BONUSES: {
    QUALITY_BONUS_RATE: 0.05, // 5% quality bonus for 4+ stars
    REBATE_PERCENTAGES: {
      '3.0': 0.50, // 50% of savings returned
      '3.5': 0.50, // 50% of savings returned
      '4.0': 0.65, // 65% of savings returned (15% increase!)
      '4.5': 0.70, // 70% of savings returned
      '5.0': 0.70  // 70% of savings returned
    }
  },
  
  // STAR Measure Weights (based on CMS Part C & D measure weights)
  // Source: https://www.cms.gov/medicare/health-drug-plans/part-c-d-performance-data
  STAR_MEASURE_IMPACTS: {
    medicationAdherence: {
      weight: 0.12, // Triple-weighted measure
      maxImprovement: 0.15 // Max 15% improvement realistic
    },
    annualWellnessVisit: {
      weight: 0.08, // Double-weighted measure
      maxImprovement: 0.20 // Max 20% improvement realistic
    },
    readmissionRate: {
      weight: 0.06, // Single-weighted measure
      maxImprovement: 0.10 // Max 10% improvement realistic
    },
    careCoordination: {
      weight: 0.04, // Single-weighted measure
      maxImprovement: 0.15 // Max 15% improvement realistic
    }
  },
  
  // Revenue Parameters
  AWV_PAYMENT: 175, // CMS payment per Annual Wellness Visit
  AWV_HCC_RISK_ADJUSTMENT: 1500, // Average HCC capture value per AWV
  // Source: https://www.cms.gov/medicare/payment/medicare-advantage-rates-statistics/risk-adjustment
  
  // Member Acquisition & Retention
  MEMBER_ACQUISITION_COST: 750, // Average cost to acquire new MA member
  MEMBER_LIFETIME_VALUE_YEARS: 3.5, // Average member tenure
  
  // Medication Adherence
  CHRONIC_MED_PREVALENCE: 0.65, // 65% of MA members on chronic medications
  MED_ADHERENCE_SAVINGS_PER_POINT: 15, // $15 saved per percentage point improvement
  // Source: Pharmacy Quality Alliance studies
  
  // Readmissions
  READMISSION_COST: 15000, // Average cost of 30-day readmission
  ANNUAL_ADMISSION_RATE: 0.20, // 20% of members admitted annually
  BASELINE_READMISSION_RATE: 0.18, // 18% 30-day readmission rate
  
  // Operational Costs
  ANNA_PMPM_COST: 1.00, // Anna cost per member per month
  FTE_HOURLY_COST: 35, // Fully loaded hourly cost for care team
  HOURS_SAVED_PER_ENGAGED_MEMBER: 2, // Annual hours saved per engaged member
  ANNUAL_WORKING_HOURS: 2080, // Standard FTE hours per year
  
  // Engagement Multipliers (based on pilot data)
  ENGAGEMENT_MULTIPLIERS: {
    medication: 0.70, // 70% of overall engagement respond to med reminders
    awv: 0.60, // 60% of overall engagement complete AWV scheduling
    discharge: 0.80 // 80% of overall engagement respond to discharge follow-ups
  },
  
  // Validation Ranges
  VALIDATION: {
    memberCount: { min: 1, max: 1000000 },
    starRating: { min: 0, max: 5, step: 0.5 },
    churnRate: { min: 0, max: 30 }, // Percentage
    engagementRate: { min: 20, max: 90 }, // Percentage
    improvementRates: { min: 0, max: 30 } // Percentage max for any improvement
  },
  
  // Diminishing Returns Thresholds
  DIMINISHING_RETURNS: {
    high: { threshold: 85, multiplier: 0.5 }, // 50% effectiveness above 85%
    medium: { threshold: 75, multiplier: 0.75 } // 75% effectiveness above 75%
  },
  
  // Overlap Adjustment Matrix (to prevent double-counting)
  OVERLAP_ADJUSTMENTS: {
    adherenceToReadmission: 0.30, // 30% of adherence improvement already reduces readmissions
    starToRetention: 0.25, // 25% of STAR improvement already captured in retention
    awvToAdherence: 0.15 // 15% of AWV improvement helps medication tracking
  }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ROI_CONFIG;
} 