/**
 * Siya Fitness Gym - Body Composition & Macro Engine
 * Calculates scientifically grounded BMR, TDEE, Macros, Water, and 7-Day Protocol
 */

function calculateFitnessPlan(params) {
    const { gender, age, height, weight, activity, goal } = params;

    // 1. Calculate Basal Metabolic Rate (BMR) using Mifflin-St Jeor
    let bmr = 0;
    if (gender === 'male') {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }

    // 2. Activity Multiplier (TDEE)
    const multipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'very': 1.725,
        'extreme': 1.9
    };
    const activityMult = multipliers[activity] || 1.55;
    const tdee = Math.round(bmr * activityMult);

    // 3. Goal Calorie Adjustment
    let targetCalories = tdee;
    let goalTitle = '';
    let goalDescription = '';
    let proteinPerKg = 2.0;

    switch (goal) {
        case 'fat_loss':
            targetCalories = Math.round(tdee * 0.80); // 20% deficit
            proteinPerKg = 2.2;
            goalTitle = 'Rapid Shred & Fat Loss';
            goalDescription = 'Aggressive lean cut focused on preserving hard-earned muscle mass while melting body fat.';
            break;
        case 'muscle_gain':
            targetCalories = Math.round(tdee * 1.12); // 12% surplus
            proteinPerKg = 2.0;
            goalTitle = 'Clean Hypertrophy Bulk';
            goalDescription = 'Caloric surplus optimized for maximum myofibrillar growth with minimal fat accumulation.';
            break;
        case 'strength':
            targetCalories = Math.round(tdee * 1.05); // 5% surplus
            proteinPerKg = 2.0;
            goalTitle = 'Raw Power & Strength';
            goalDescription = 'Fuel for heavy compound deadlifts, squats, and bench presses at Siya Gym.';
            break;
        case 'recomp':
            targetCalories = tdee; // Maintenance
            proteinPerKg = 2.4;
            goalTitle = 'Body Recomposition';
            goalDescription = 'Simultaneous fat loss and muscle gain ideal for beginners and athletes returning to training.';
            break;
        case 'endurance':
            targetCalories = Math.round(tdee * 1.08);
            proteinPerKg = 1.7;
            goalTitle = 'Athletic Conditioning & Agility';
            goalDescription = 'High-endurance energy fuel for boxing rounds, HIIT sprints, and agility drills.';
            break;
        default:
            targetCalories = tdee;
            goalTitle = 'Overall Vitality & Fitness';
            goalDescription = 'Balanced athletic maintenance protocol.';
    }

    // 4. Macro Breakdown
    // Protein: 4 kcal/g
    const proteinGrams = Math.round(weight * proteinPerKg);
    const proteinCalories = proteinGrams * 4;

    // Fat: 9 kcal/g (25% of target calories)
    const fatCalories = Math.round(targetCalories * 0.25);
    const fatGrams = Math.round(fatCalories / 9);

    // Carbohydrates: 4 kcal/g (Remaining calories)
    const carbCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
    const carbGrams = Math.round(carbCalories / 4);

    // 5. Hydration (Litres)
    const waterLitres = ((weight * 0.035) + 0.7).toFixed(1);

    // 6. BMI Score
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    let bmiCategory = 'Healthy Weight';
    let bmiColor = 'var(--accent-lime)';

    if (bmi < 18.5) {
        bmiCategory = 'Underweight (Hypertrophy focus recommended)';
        bmiColor = '#38bdf8';
    } else if (bmi >= 18.5 && bmi <= 24.9) {
        bmiCategory = 'Optimal Athletic Range';
        bmiColor = '#10B981';
    } else if (bmi >= 25 && bmi <= 29.9) {
        bmiCategory = 'Overweight / Heavy Muscle';
        bmiColor = '#F59E0B';
    } else {
        bmiCategory = 'High Body Mass (Structured Shred Recommended)';
        bmiColor = '#EF4444';
    }

    // 7. Recommended Weekly Training Routine at Siya Gym
    let recommendedRoutine = [];
    if (goal === 'fat_loss') {
        recommendedRoutine = [
            { day: 'Monday', focus: 'Upper Body Hypertrophy + 20min Treadmill Incline Intervals', intensity: 'High' },
            { day: 'Tuesday', focus: 'Siya Iron HIIT Bootcamp (Kanwe Arena)', intensity: 'Max' },
            { day: 'Wednesday', focus: 'Lower Body Quad & Glute Focus + Core Finisher', intensity: 'High' },
            { day: 'Thursday', focus: 'Active Recovery: 45min Steady Walk or Mobility', intensity: 'Low' },
            { day: 'Friday', focus: 'Full Body Push/Pull Circuit + Heavy Bag Boxing', intensity: 'Very High' },
            { day: 'Saturday', focus: 'Siya Weekend Shred Class & Sauna Session', intensity: 'High' },
            { day: 'Sunday', focus: 'Complete Rest & High-Protein Meal Prep', intensity: 'Rest' }
        ];
    } else if (goal === 'muscle_gain') {
        recommendedRoutine = [
            { day: 'Monday', focus: 'Heavy Chest & Triceps (Incline Dumbbells, Bench, Dips)', intensity: 'Very High' },
            { day: 'Tuesday', focus: 'Back & Biceps (Deadlifts, Lat Pulldown Citadel, Cable Rows)', intensity: 'Very High' },
            { day: 'Wednesday', focus: 'Rest Day or Light 20min Mobility', intensity: 'Rest' },
            { day: 'Thursday', focus: 'Legs & Calves (Squat Rack, Leg Press, Romanian Deadlifts)', intensity: 'Extreme' },
            { day: 'Friday', focus: 'Boulder Shoulders & Traps + Arms Super-Set', intensity: 'High' },
            { day: 'Saturday', focus: 'Hypertrophy Weak-Point Day + Core Blast', intensity: 'High' },
            { day: 'Sunday', focus: 'Full Recovery & Protein Recharge', intensity: 'Rest' }
        ];
    } else {
        recommendedRoutine = [
            { day: 'Monday', focus: 'Compound Strength (Squat & Overhead Press)', intensity: 'High' },
            { day: 'Tuesday', focus: 'Boxing & Functional Agility (Siya Combat Zone)', intensity: 'Very High' },
            { day: 'Wednesday', focus: 'Deadlifts & Lat Mastery', intensity: 'Max' },
            { day: 'Thursday', focus: 'Mobility, Core & Aerobic Capacity', intensity: 'Moderate' },
            { day: 'Friday', focus: 'Heavy Bench Press & Athletic Power Circuits', intensity: 'Very High' },
            { day: 'Saturday', focus: 'Partner Challenge or Siya Saturday Open Lift', intensity: 'High' },
            { day: 'Sunday', focus: 'Mind-Body Rest & Nutrition Refuel', intensity: 'Rest' }
        ];
    }

    return {
        bmi,
        bmiCategory,
        bmiColor,
        bmr: Math.round(bmr),
        tdee,
        targetCalories,
        proteinGrams,
        carbGrams,
        fatGrams,
        waterLitres,
        goalTitle,
        goalDescription,
        recommendedRoutine,
        stats: {
            weight,
            height,
            age,
            gender,
            goal
        }
    };
}

// Generate pre-filled WhatsApp Link for Coach Siya
function generateWhatsAppConsultLink(plan) {
    const text = `Hello Siya Fitness Gym Kitwe! 👋%0A%0AI used your website Body Calculator to generate my blueprint:%0A` +
        `🎯 *Goal:* ${encodeURIComponent(plan.goalTitle)}%0A` +
        `⚖️ *Weight:* ${plan.stats.weight}kg | *Height:* ${plan.stats.height}cm%0A` +
        `🔥 *Daily Target:* ${plan.targetCalories} kcal%0A` +
        `🥩 *Protein:* ${plan.proteinGrams}g | 🍞 *Carbs:* ${plan.carbGrams}g | 🥑 *Fats:* ${plan.fatGrams}g%0A` +
        `💧 *Water:* ${plan.waterLitres}L / day%0A%0A` +
        `I would like to start training at your Kanwe Avenue gym in Kitwe. Can you share membership options?`;

    return `https://wa.me/260969919764?text=${text}`;
}
