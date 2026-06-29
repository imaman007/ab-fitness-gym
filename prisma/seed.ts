import { PrismaClient, PlanTier } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ─── PLANS ───────────────────────────────────────────────────────────────────
  await prisma.plan.deleteMany()
  const plans = await Promise.all([
    prisma.plan.create({
      data: {
        name: 'Silver',
        slug: 'silver',
        price: 999,
        duration: 1,
        tier: PlanTier.SILVER,
        description: 'Perfect for beginners getting started on their fitness journey.',
        features: JSON.stringify([
          'Access to Home Gym only',
          'Basic workout plans',
          'Progress tracking',
          'Community forum access',
          'Mobile app access',
        ]),
        popular: false,
        active: true,
      },
    }),
    prisma.plan.create({
      data: {
        name: 'Gold',
        slug: 'gold',
        price: 1999,
        duration: 1,
        tier: PlanTier.GOLD,
        description: 'Most popular plan. Access all AB Fitness gyms across India.',
        features: JSON.stringify([
          'All-India gym access (25+ locations)',
          'All workout plans unlocked',
          'Group fitness classes',
          'Progress tracking & analytics',
          'Priority equipment booking',
          'Guest passes (2/month)',
          'Locker room access',
        ]),
        popular: true,
        active: true,
      },
    }),
    prisma.plan.create({
      data: {
        name: 'Platinum',
        slug: 'platinum',
        price: 3499,
        duration: 1,
        tier: PlanTier.PLATINUM,
        description: 'Elite membership with personal training and nutrition guidance.',
        features: JSON.stringify([
          'All-India gym access (25+ locations)',
          'All workout plans unlocked',
          '4 Personal trainer sessions/month',
          'Custom nutrition plan',
          'Body composition analysis',
          'Priority equipment booking',
          'Unlimited guest passes',
          'VIP locker room',
          'Recovery suite access',
          'Dedicated support line',
        ]),
        popular: false,
        active: true,
      },
    }),
  ])
  console.log(`✅ Created ${plans.length} plans`)

  // ─── EXERCISES ───────────────────────────────────────────────────────────────
  await prisma.workoutExercise.deleteMany()
  await prisma.workoutPlan.deleteMany()
  await prisma.exercise.deleteMany()

  const exerciseData = [
    // CHEST
    {
      name: 'Barbell Bench Press',
      slug: 'barbell-bench-press',
      muscleGroup: 'Chest',
      equipment: 'Barbell',
      difficulty: 'Intermediate',
      instructions: '1. Lie flat on a bench with feet on the floor.\n2. Grip barbell slightly wider than shoulder-width.\n3. Unrack the bar and hold above chest with arms extended.\n4. Lower the bar slowly to your mid-chest.\n5. Press the bar back up explosively to starting position.\n6. Keep shoulder blades retracted throughout the movement.',
      tips: JSON.stringify(['Keep wrists straight over elbows', 'Drive feet into the floor', 'Arch lower back slightly', 'Control the descent — 2 seconds down']),
      imageUrl: null,
      videoUrl: null,
    },
    {
      name: 'Dumbbell Flyes',
      slug: 'dumbbell-flyes',
      muscleGroup: 'Chest',
      equipment: 'Dumbbell',
      difficulty: 'Beginner',
      instructions: '1. Lie on a flat bench with a dumbbell in each hand.\n2. Hold dumbbells above your chest with palms facing each other.\n3. With a slight bend in elbows, lower arms out to sides until chest stretches.\n4. Squeeze chest and bring dumbbells back together above chest.\n5. Focus on the stretch at the bottom of the movement.',
      tips: JSON.stringify(['Do not fully lock elbows', 'Feel the chest stretch at the bottom', 'Use a controlled motion — avoid swinging', 'Keep core tight']),
      imageUrl: null,
      videoUrl: null,
    },
    {
      name: 'Push-Ups',
      slug: 'push-ups',
      muscleGroup: 'Chest',
      equipment: 'Bodyweight',
      difficulty: 'Beginner',
      instructions: '1. Start in a high plank with hands slightly wider than shoulders.\n2. Keep body in a straight line from head to heels.\n3. Lower chest to just above the floor by bending elbows.\n4. Push back up to starting position.\n5. Breathe in on the way down, out on the way up.',
      tips: JSON.stringify(['Do not let hips sag', 'Keep core braced', 'Elbows at 45° angle from body', 'Full range of motion is key']),
      imageUrl: null,
      videoUrl: null,
    },
    // BACK
    {
      name: 'Deadlift',
      slug: 'deadlift',
      muscleGroup: 'Back',
      equipment: 'Barbell',
      difficulty: 'Advanced',
      instructions: '1. Stand with feet hip-width apart, barbell over mid-foot.\n2. Hinge at hips and grip bar just outside legs.\n3. Flatten back, brace core, take a deep breath.\n4. Drive through heels to pull bar up, keeping it close to legs.\n5. Lock hips and knees at top — stand tall.\n6. Reverse movement by hinging at hips to lower bar.',
      tips: JSON.stringify(['Bar must stay close to your shins', 'Never round your lower back', 'Think "push the floor away" not "pull the bar up"', 'Hip hinge is the key movement pattern']),
      imageUrl: null,
      videoUrl: null,
    },
    {
      name: 'Pull-Ups',
      slug: 'pull-ups',
      muscleGroup: 'Back',
      equipment: 'Bodyweight',
      difficulty: 'Intermediate',
      instructions: '1. Hang from pull-up bar with hands shoulder-width, palms facing away.\n2. Engage lats and pull shoulder blades down and back.\n3. Pull yourself up until chin clears the bar.\n4. Lower yourself slowly back to the starting position.\n5. Avoid swinging or kipping — use strict form.',
      tips: JSON.stringify(['Initiate with lats, not arms', 'Full hang at the bottom of each rep', 'Look forward or slightly up', 'Cross your feet behind you for stability']),
      imageUrl: null,
      videoUrl: null,
    },
    {
      name: 'Seated Cable Row',
      slug: 'seated-cable-row',
      muscleGroup: 'Back',
      equipment: 'Cable Machine',
      difficulty: 'Beginner',
      instructions: '1. Sit at cable row machine with feet on platform and knees slightly bent.\n2. Lean forward to grip the handle with both hands.\n3. Sit upright and pull the handle to your lower ribcage.\n4. Squeeze shoulder blades together at the top.\n5. Slowly extend arms back to starting position.',
      tips: JSON.stringify(['Keep chest up throughout', 'Do not use momentum — row with your back', 'Squeeze at the top for 1 second', 'Control the return phase']),
      imageUrl: null,
      videoUrl: null,
    },
    // SHOULDERS
    {
      name: 'Overhead Press',
      slug: 'overhead-press',
      muscleGroup: 'Shoulders',
      equipment: 'Barbell',
      difficulty: 'Intermediate',
      instructions: '1. Stand with barbell at shoulder height, hands slightly wider than shoulders.\n2. Brace core and glutes — stand tall.\n3. Press the bar overhead in a straight line.\n4. At the top, shrug shoulders and lock out arms.\n5. Lower bar back to starting position under control.',
      tips: JSON.stringify(['Do not hyperextend lower back', 'Grip bar with wrists straight', 'Press bar slightly back over head at top', 'Exhale forcefully as you press']),
      imageUrl: null,
      videoUrl: null,
    },
    {
      name: 'Lateral Raises',
      slug: 'lateral-raises',
      muscleGroup: 'Shoulders',
      equipment: 'Dumbbell',
      difficulty: 'Beginner',
      instructions: '1. Stand holding dumbbells at sides, palms facing inward.\n2. With a slight bend in elbows, raise arms out to sides.\n3. Lift to shoulder height — no higher.\n4. Lower slowly back to starting position.\n5. Lean slightly forward for better shoulder activation.',
      tips: JSON.stringify(['Lead with elbows, not hands', 'No swinging or momentum', 'Pinky finger slightly higher than thumb', 'Use lighter weight for full control']),
      imageUrl: null,
      videoUrl: null,
    },
    // ARMS
    {
      name: 'Barbell Bicep Curl',
      slug: 'barbell-bicep-curl',
      muscleGroup: 'Arms',
      equipment: 'Barbell',
      difficulty: 'Beginner',
      instructions: '1. Stand holding barbell with shoulder-width underhand grip.\n2. Keep elbows close to torso.\n3. Curl the bar up toward your chest by contracting biceps.\n4. Squeeze at the top for a full contraction.\n5. Lower bar slowly back to starting position.',
      tips: JSON.stringify(['Do not swing your back', 'Keep elbows pinned to sides', 'Full extension at the bottom', 'Control the negative phase']),
      imageUrl: null,
      videoUrl: null,
    },
    {
      name: 'Tricep Dips',
      slug: 'tricep-dips',
      muscleGroup: 'Arms',
      equipment: 'Bodyweight',
      difficulty: 'Intermediate',
      instructions: '1. Position hands on parallel bars, arms extended.\n2. Keep torso upright to target triceps.\n3. Lower body by bending elbows until upper arms are parallel to floor.\n4. Press back up to starting position.\n5. Do not lean too far forward.',
      tips: JSON.stringify(['Keep elbows pointing backward', 'Do not shrug shoulders', 'Full range of motion for best results', 'Add weight belt for progression']),
      imageUrl: null,
      videoUrl: null,
    },
    // LEGS
    {
      name: 'Barbell Squat',
      slug: 'barbell-squat',
      muscleGroup: 'Legs',
      equipment: 'Barbell',
      difficulty: 'Intermediate',
      instructions: '1. Place barbell on upper traps/rear delts in squat rack.\n2. Stand with feet shoulder-width, toes slightly out.\n3. Brace core, take deep breath, unrack bar.\n4. Sit back and down until thighs are parallel to floor.\n5. Drive through heels to stand back up.\n6. Keep chest up and knees tracking over toes.',
      tips: JSON.stringify(['Knees should not cave inward', 'Depth: at least parallel', 'Take big breath before descending', 'Look straight ahead, not down']),
      imageUrl: null,
      videoUrl: null,
    },
    {
      name: 'Romanian Deadlift',
      slug: 'romanian-deadlift',
      muscleGroup: 'Legs',
      equipment: 'Barbell',
      difficulty: 'Intermediate',
      instructions: '1. Stand holding barbell at hip height.\n2. Keep a slight bend in knees throughout the movement.\n3. Hinge at hips and push them backward as you lower the bar.\n4. Lower until you feel a deep hamstring stretch.\n5. Drive hips forward to return to standing.',
      tips: JSON.stringify(['Bar stays close to legs throughout', 'Keep back flat — no rounding', 'Feel the stretch in hamstrings at bottom', 'Hinge at hips — do not squat']),
      imageUrl: null,
      videoUrl: null,
    },
    {
      name: 'Leg Press',
      slug: 'leg-press',
      muscleGroup: 'Legs',
      equipment: 'Machine',
      difficulty: 'Beginner',
      instructions: '1. Sit in leg press machine with back flat against pad.\n2. Place feet shoulder-width on the platform.\n3. Release safety handles and lower the platform by bending knees.\n4. Lower until knees are at 90° or less.\n5. Press through heels to extend legs.',
      tips: JSON.stringify(['Do not lock knees at the top', 'Keep lower back pressed against pad', 'Feet position changes muscle focus', 'Control the descent']),
      imageUrl: null,
      videoUrl: null,
    },
    {
      name: 'Walking Lunges',
      slug: 'walking-lunges',
      muscleGroup: 'Legs',
      equipment: 'Dumbbell',
      difficulty: 'Beginner',
      instructions: '1. Stand holding dumbbells at sides.\n2. Step forward with right foot into a lunge position.\n3. Lower back knee toward ground without touching.\n4. Push off front foot and bring back foot forward to step into next lunge.\n5. Continue alternating legs for desired reps.',
      tips: JSON.stringify(['Keep torso upright', 'Front knee should not pass toes', 'Take large steps for better glute activation', 'Look straight ahead for balance']),
      imageUrl: null,
      videoUrl: null,
    },
    // CORE
    {
      name: 'Plank',
      slug: 'plank',
      muscleGroup: 'Core',
      equipment: 'Bodyweight',
      difficulty: 'Beginner',
      instructions: '1. Get into push-up position but with forearms on ground.\n2. Keep body in a straight line from head to heels.\n3. Brace abs and glutes tightly.\n4. Hold position for desired duration.\n5. Breathe steadily throughout.',
      tips: JSON.stringify(['Do not let hips rise or sag', 'Squeeze glutes for extra stability', 'Gaze should be at the floor', 'Push elbows into ground for better tension']),
      imageUrl: null,
      videoUrl: null,
    },
    {
      name: 'Cable Crunches',
      slug: 'cable-crunches',
      muscleGroup: 'Core',
      equipment: 'Cable Machine',
      difficulty: 'Beginner',
      instructions: '1. Kneel in front of cable machine with rope attachment overhead.\n2. Hold rope at sides of head.\n3. Curl torso downward, bringing elbows toward knees.\n4. Contract abs at the bottom.\n5. Slowly return to starting position.',
      tips: JSON.stringify(['Do not pull with arms — crunch with abs', 'Keep hips stationary', 'Full contraction at the bottom', 'Exhale forcefully as you crunch']),
      imageUrl: null,
      videoUrl: null,
    },
    {
      name: 'Russian Twists',
      slug: 'russian-twists',
      muscleGroup: 'Core',
      equipment: 'Dumbbell',
      difficulty: 'Beginner',
      instructions: '1. Sit on floor with knees bent, lean back at 45°.\n2. Hold dumbbell or weight plate at chest.\n3. Rotate torso to the right and touch weight to floor.\n4. Rotate back through center and to the left.\n5. That is one rep. Keep feet off the floor for added difficulty.',
      tips: JSON.stringify(['Rotate from the torso, not just arms', 'Keep core braced throughout', 'Slower twists = more tension', 'Lean back further to increase difficulty']),
      imageUrl: null,
      videoUrl: null,
    },
    // FULL BODY / HIIT
    {
      name: 'Burpees',
      slug: 'burpees',
      muscleGroup: 'Full Body',
      equipment: 'Bodyweight',
      difficulty: 'Intermediate',
      instructions: '1. Stand with feet shoulder-width apart.\n2. Drop hands to floor and jump feet back into plank.\n3. Perform a push-up.\n4. Jump feet back toward hands.\n5. Explosively jump up with arms overhead.',
      tips: JSON.stringify(['Move as fast as possible for HIIT benefit', 'Keep core tight in plank position', 'Land softly on feet', 'Breathe rhythmically throughout']),
      imageUrl: null,
      videoUrl: null,
    },
    {
      name: 'Kettlebell Swings',
      slug: 'kettlebell-swings',
      muscleGroup: 'Full Body',
      equipment: 'Kettlebell',
      difficulty: 'Intermediate',
      instructions: '1. Stand with feet slightly wider than shoulders, kettlebell between feet.\n2. Hinge at hips and grab kettlebell with both hands.\n3. Hike kettlebell between legs like a football snap.\n4. Explosively thrust hips forward to swing kettlebell to chest height.\n5. Let it swing back between legs and repeat.',
      tips: JSON.stringify(['Power comes from hips — not arms', 'Keep back flat on the hinge', 'Squeeze glutes at the top', 'Let momentum do the work on the way down']),
      imageUrl: null,
      videoUrl: null,
    },
    {
      name: 'Box Jumps',
      slug: 'box-jumps',
      muscleGroup: 'Full Body',
      equipment: 'Bodyweight',
      difficulty: 'Intermediate',
      instructions: '1. Stand in front of a sturdy box or platform.\n2. Bend knees and swing arms back.\n3. Explosively jump onto the box landing with both feet simultaneously.\n4. Land softly with knees slightly bent.\n5. Stand up fully on box then step down carefully.',
      tips: JSON.stringify(['Land with soft knees to absorb impact', 'Use arm swing for extra power', 'Step down — do not jump down', 'Start with a lower box height']),
      imageUrl: null,
      videoUrl: null,
    },
    {
      name: 'Mountain Climbers',
      slug: 'mountain-climbers',
      muscleGroup: 'Core',
      equipment: 'Bodyweight',
      difficulty: 'Beginner',
      instructions: '1. Start in a high plank position.\n2. Drive right knee toward chest.\n3. Quickly switch, extending right leg back and driving left knee in.\n4. Alternate as fast as possible.\n5. Keep hips level throughout the movement.',
      tips: JSON.stringify(['Faster pace = more cardio benefit', 'Keep hips low — do not pike up', 'Drive knees as far forward as possible', 'Brace core the entire time']),
      imageUrl: null,
      videoUrl: null,
    },
  ]

  const exercises = await Promise.all(
    exerciseData.map(data => prisma.exercise.create({ data }))
  )
  console.log(`✅ Created ${exercises.length} exercises`)

  // Map exercises by slug for easy lookup
  const exMap = exercises.reduce((acc, e) => ({ ...acc, [e.slug]: e }), {} as Record<string, typeof exercises[0]>)

  // ─── WORKOUT PLANS ────────────────────────────────────────────────────────────
  const workoutPlansData = [
    {
      plan: {
        name: 'Full Body Blast',
        slug: 'full-body-blast',
        category: 'Full Body',
        difficulty: 'Intermediate',
        duration: 60,
        calories: 450,
        description: 'A comprehensive full body workout targeting all major muscle groups for maximum efficiency.',
        featured: true,
      },
      exercises: [
        { slug: 'barbell-squat', sets: 4, reps: '8', restSeconds: 90, order: 1 },
        { slug: 'barbell-bench-press', sets: 4, reps: '8', restSeconds: 90, order: 2 },
        { slug: 'deadlift', sets: 3, reps: '6', restSeconds: 120, order: 3 },
        { slug: 'overhead-press', sets: 3, reps: '10', restSeconds: 75, order: 4 },
        { slug: 'pull-ups', sets: 3, reps: 'to failure', restSeconds: 75, order: 5 },
        { slug: 'plank', sets: 3, reps: '60 sec', restSeconds: 60, order: 6 },
      ],
    },
    {
      plan: {
        name: 'Push Day',
        slug: 'push-day',
        category: 'Upper Body',
        difficulty: 'Intermediate',
        duration: 55,
        calories: 380,
        description: 'Chest, shoulders, and triceps focused session for upper body pushing strength.',
        featured: true,
      },
      exercises: [
        { slug: 'barbell-bench-press', sets: 5, reps: '5', restSeconds: 120, order: 1 },
        { slug: 'overhead-press', sets: 4, reps: '8', restSeconds: 90, order: 2 },
        { slug: 'dumbbell-flyes', sets: 3, reps: '12', restSeconds: 60, order: 3 },
        { slug: 'lateral-raises', sets: 4, reps: '15', restSeconds: 45, order: 4 },
        { slug: 'tricep-dips', sets: 3, reps: 'to failure', restSeconds: 60, order: 5 },
        { slug: 'push-ups', sets: 2, reps: 'to failure', restSeconds: 60, order: 6 },
      ],
    },
    {
      plan: {
        name: 'Pull Day',
        slug: 'pull-day',
        category: 'Upper Body',
        difficulty: 'Intermediate',
        duration: 55,
        calories: 360,
        description: 'Back and biceps focused session for upper body pulling strength and thickness.',
        featured: false,
      },
      exercises: [
        { slug: 'deadlift', sets: 4, reps: '5', restSeconds: 150, order: 1 },
        { slug: 'pull-ups', sets: 4, reps: 'to failure', restSeconds: 90, order: 2 },
        { slug: 'seated-cable-row', sets: 4, reps: '10', restSeconds: 75, order: 3 },
        { slug: 'barbell-bicep-curl', sets: 3, reps: '12', restSeconds: 60, order: 4 },
      ],
    },
    {
      plan: {
        name: 'Leg Day Destroyer',
        slug: 'leg-day-destroyer',
        category: 'Lower Body',
        difficulty: 'Advanced',
        duration: 70,
        calories: 520,
        description: 'An intense lower body session targeting quads, hamstrings, and glutes for serious leg development.',
        featured: true,
      },
      exercises: [
        { slug: 'barbell-squat', sets: 5, reps: '5', restSeconds: 180, order: 1 },
        { slug: 'romanian-deadlift', sets: 4, reps: '8', restSeconds: 120, order: 2 },
        { slug: 'leg-press', sets: 4, reps: '12', restSeconds: 90, order: 3 },
        { slug: 'walking-lunges', sets: 3, reps: '20', restSeconds: 75, order: 4 },
        { slug: 'plank', sets: 3, reps: '45 sec', restSeconds: 45, order: 5 },
      ],
    },
    {
      plan: {
        name: 'HIIT Fat Burner',
        slug: 'hiit-fat-burner',
        category: 'Cardio',
        difficulty: 'Advanced',
        duration: 30,
        calories: 400,
        description: 'High-intensity interval training circuit to torch fat and boost metabolism in just 30 minutes.',
        featured: true,
      },
      exercises: [
        { slug: 'burpees', sets: 4, reps: '15', restSeconds: 30, order: 1 },
        { slug: 'box-jumps', sets: 4, reps: '12', restSeconds: 30, order: 2 },
        { slug: 'mountain-climbers', sets: 4, reps: '30', restSeconds: 30, order: 3 },
        { slug: 'kettlebell-swings', sets: 4, reps: '20', restSeconds: 45, order: 4 },
        { slug: 'push-ups', sets: 3, reps: '15', restSeconds: 30, order: 5 },
      ],
    },
    {
      plan: {
        name: 'Core Crusher',
        slug: 'core-crusher',
        category: 'Core',
        difficulty: 'Beginner',
        duration: 25,
        calories: 200,
        description: 'A dedicated core strengthening routine to build a strong, defined midsection.',
        featured: false,
      },
      exercises: [
        { slug: 'plank', sets: 4, reps: '60 sec', restSeconds: 45, order: 1 },
        { slug: 'cable-crunches', sets: 4, reps: '15', restSeconds: 45, order: 2 },
        { slug: 'russian-twists', sets: 3, reps: '20', restSeconds: 45, order: 3 },
        { slug: 'mountain-climbers', sets: 3, reps: '30', restSeconds: 30, order: 4 },
      ],
    },
    {
      plan: {
        name: 'Upper Body Power',
        slug: 'upper-body-power',
        category: 'Upper Body',
        difficulty: 'Advanced',
        duration: 65,
        calories: 420,
        description: 'A strength-focused upper body session combining pushing and pulling movements for complete development.',
        featured: false,
      },
      exercises: [
        { slug: 'barbell-bench-press', sets: 5, reps: '3', restSeconds: 180, order: 1 },
        { slug: 'overhead-press', sets: 5, reps: '5', restSeconds: 150, order: 2 },
        { slug: 'pull-ups', sets: 5, reps: '5', restSeconds: 120, order: 3 },
        { slug: 'seated-cable-row', sets: 3, reps: '10', restSeconds: 90, order: 4 },
        { slug: 'barbell-bicep-curl', sets: 3, reps: '10', restSeconds: 60, order: 5 },
        { slug: 'tricep-dips', sets: 3, reps: '12', restSeconds: 60, order: 6 },
      ],
    },
    {
      plan: {
        name: 'Beginner Starter',
        slug: 'beginner-starter',
        category: 'Full Body',
        difficulty: 'Beginner',
        duration: 45,
        calories: 300,
        description: 'The perfect starting point for gym beginners. Learn foundational movements with proper form.',
        featured: false,
      },
      exercises: [
        { slug: 'push-ups', sets: 3, reps: '10', restSeconds: 60, order: 1 },
        { slug: 'walking-lunges', sets: 3, reps: '12', restSeconds: 60, order: 2 },
        { slug: 'plank', sets: 3, reps: '30 sec', restSeconds: 45, order: 3 },
        { slug: 'dumbbell-flyes', sets: 3, reps: '12', restSeconds: 60, order: 4 },
        { slug: 'lateral-raises', sets: 3, reps: '12', restSeconds: 60, order: 5 },
        { slug: 'barbell-bicep-curl', sets: 3, reps: '12', restSeconds: 60, order: 6 },
      ],
    },
  ]

  for (const { plan, exercises: planExercises } of workoutPlansData) {
    const created = await prisma.workoutPlan.create({ data: plan })
    await Promise.all(
      planExercises.map(ex =>
        prisma.workoutExercise.create({
          data: {
            workoutPlanId: created.id,
            exerciseId: exMap[ex.slug].id,
            sets: ex.sets,
            reps: ex.reps,
            restSeconds: ex.restSeconds,
            order: ex.order,
          },
        })
      )
    )
  }
  console.log(`✅ Created ${workoutPlansData.length} workout plans`)

  // ─── GYM LOCATIONS ────────────────────────────────────────────────────────────
  await prisma.gymLocation.deleteMany()

  const locations = [
    { name: 'AB Fitness Andheri West', city: 'Mumbai', state: 'Maharashtra', address: 'Plot 47, Lokhandwala Complex, Andheri West', phone: '+91 22 4567 8901', email: 'andheri@abfitness.in', lat: 19.1364, lng: 72.8296, amenities: JSON.stringify(['WiFi', 'Cardio Zone', 'CrossFit', 'Sauna', 'Cafe', 'Parking']), timings: 'Mon-Sun: 5:00 AM – 11:00 PM', rating: 4.8 },
    { name: 'AB Fitness Powai', city: 'Mumbai', state: 'Maharashtra', address: '2nd Floor, Hiranandani Gardens, Powai', phone: '+91 22 4567 8902', email: 'powai@abfitness.in', lat: 19.1197, lng: 72.9049, amenities: JSON.stringify(['WiFi', 'Swimming Pool', 'Cardio Zone', 'Group Classes', 'Cafe']), timings: 'Mon-Sun: 5:30 AM – 11:00 PM', rating: 4.7 },
    { name: 'AB Fitness Bandra', city: 'Mumbai', state: 'Maharashtra', address: 'Hill Road, Bandra West, Mumbai', phone: '+91 22 4567 8903', email: 'bandra@abfitness.in', lat: 19.0596, lng: 72.8295, amenities: JSON.stringify(['WiFi', 'CrossFit', 'Boxing Ring', 'Sauna', 'Juice Bar']), timings: 'Mon-Sun: 5:00 AM – 11:00 PM', rating: 4.9 },
    { name: 'AB Fitness Connaught Place', city: 'Delhi', state: 'Delhi', address: 'Block A, Connaught Place, New Delhi', phone: '+91 11 4567 8901', email: 'cp@abfitness.in', lat: 28.6315, lng: 77.2167, amenities: JSON.stringify(['WiFi', 'Cardio Zone', 'Personal Training', 'Spa', 'Cafe']), timings: 'Mon-Sun: 5:00 AM – 11:00 PM', rating: 4.8 },
    { name: 'AB Fitness Lajpat Nagar', city: 'Delhi', state: 'Delhi', address: 'Central Market, Lajpat Nagar 2, New Delhi', phone: '+91 11 4567 8902', email: 'lajpat@abfitness.in', lat: 28.5677, lng: 77.2433, amenities: JSON.stringify(['WiFi', 'Group Classes', 'Cardio Zone', 'Parking']), timings: 'Mon-Sun: 5:00 AM – 10:30 PM', rating: 4.6 },
    { name: 'AB Fitness Indiranagar', city: 'Bengaluru', state: 'Karnataka', address: '100 Feet Road, Indiranagar, Bengaluru', phone: '+91 80 4567 8901', email: 'indiranagar@abfitness.in', lat: 12.9784, lng: 77.6408, amenities: JSON.stringify(['WiFi', 'CrossFit', 'Yoga Studio', 'Smoothie Bar', 'Parking']), timings: 'Mon-Sun: 5:00 AM – 11:00 PM', rating: 4.9 },
    { name: 'AB Fitness Koramangala', city: 'Bengaluru', state: 'Karnataka', address: '6th Block, Koramangala, Bengaluru', phone: '+91 80 4567 8902', email: 'koramangala@abfitness.in', lat: 12.9352, lng: 77.6244, amenities: JSON.stringify(['WiFi', 'Cardio Zone', 'Group Classes', 'Sauna', 'Cafe']), timings: 'Mon-Sat: 5:00 AM – 11:00 PM, Sun: 6:00 AM – 9:00 PM', rating: 4.7 },
    { name: 'AB Fitness Whitefield', city: 'Bengaluru', state: 'Karnataka', address: 'ITPL Road, Whitefield, Bengaluru', phone: '+91 80 4567 8903', email: 'whitefield@abfitness.in', lat: 12.9698, lng: 77.7499, amenities: JSON.stringify(['WiFi', 'Swimming Pool', 'CrossFit', 'Parking', 'Cafe']), timings: 'Mon-Sun: 5:00 AM – 11:00 PM', rating: 4.6 },
    { name: 'AB Fitness Baner', city: 'Pune', state: 'Maharashtra', address: 'Baner Road, Baner, Pune', phone: '+91 20 4567 8901', email: 'baner@abfitness.in', lat: 18.5590, lng: 73.7868, amenities: JSON.stringify(['WiFi', 'Cardio Zone', 'CrossFit', 'Cafe', 'Parking']), timings: 'Mon-Sun: 5:00 AM – 11:00 PM', rating: 4.8 },
    { name: 'AB Fitness Kothrud', city: 'Pune', state: 'Maharashtra', address: 'Karve Road, Kothrud, Pune', phone: '+91 20 4567 8902', email: 'kothrud@abfitness.in', lat: 18.5074, lng: 73.8079, amenities: JSON.stringify(['WiFi', 'Group Classes', 'Yoga Studio', 'Sauna']), timings: 'Mon-Sat: 5:30 AM – 10:30 PM, Sun: 6:00 AM – 9:00 PM', rating: 4.5 },
    { name: 'AB Fitness Hitech City', city: 'Hyderabad', state: 'Telangana', address: 'HITEC City Main Road, Hyderabad', phone: '+91 40 4567 8901', email: 'hiteccity@abfitness.in', lat: 17.4486, lng: 78.3908, amenities: JSON.stringify(['WiFi', 'CrossFit', 'Cardio Zone', 'Personal Training', 'Cafe']), timings: 'Mon-Sun: 5:00 AM – 11:00 PM', rating: 4.8 },
    { name: 'AB Fitness Banjara Hills', city: 'Hyderabad', state: 'Telangana', address: 'Road No. 12, Banjara Hills, Hyderabad', phone: '+91 40 4567 8902', email: 'banjarahills@abfitness.in', lat: 17.4138, lng: 78.4336, amenities: JSON.stringify(['WiFi', 'Swimming Pool', 'Group Classes', 'Spa', 'Parking']), timings: 'Mon-Sun: 5:00 AM – 11:00 PM', rating: 4.9 },
    { name: 'AB Fitness Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', address: '2nd Avenue, Anna Nagar, Chennai', phone: '+91 44 4567 8901', email: 'annanagar@abfitness.in', lat: 13.0878, lng: 80.2099, amenities: JSON.stringify(['WiFi', 'Cardio Zone', 'CrossFit', 'Cafe', 'Parking']), timings: 'Mon-Sun: 5:00 AM – 11:00 PM', rating: 4.7 },
    { name: 'AB Fitness OMR', city: 'Chennai', state: 'Tamil Nadu', address: 'Old Mahabalipuram Road, Sholinganallur, Chennai', phone: '+91 44 4567 8902', email: 'omr@abfitness.in', lat: 12.9010, lng: 80.2280, amenities: JSON.stringify(['WiFi', 'Group Classes', 'Swimming Pool', 'Sauna']), timings: 'Mon-Sat: 5:30 AM – 10:30 PM, Sun: 6:00 AM – 9:00 PM', rating: 4.6 },
    { name: 'AB Fitness SG Highway', city: 'Ahmedabad', state: 'Gujarat', address: 'Satellite Road, SG Highway, Ahmedabad', phone: '+91 79 4567 8901', email: 'sghighway@abfitness.in', lat: 23.0277, lng: 72.5301, amenities: JSON.stringify(['WiFi', 'CrossFit', 'Yoga Studio', 'Cafe', 'Parking']), timings: 'Mon-Sun: 5:00 AM – 11:00 PM', rating: 4.7 },
    { name: 'AB Fitness Prahlad Nagar', city: 'Ahmedabad', state: 'Gujarat', address: 'Corporate Road, Prahlad Nagar, Ahmedabad', phone: '+91 79 4567 8902', email: 'prahladnagar@abfitness.in', lat: 23.0203, lng: 72.5057, amenities: JSON.stringify(['WiFi', 'Cardio Zone', 'Group Classes', 'Cafe']), timings: 'Mon-Sun: 5:30 AM – 10:30 PM', rating: 4.5 },
    { name: 'AB Fitness Salt Lake', city: 'Kolkata', state: 'West Bengal', address: 'Sector V, Salt Lake, Kolkata', phone: '+91 33 4567 8901', email: 'saltlake@abfitness.in', lat: 22.5800, lng: 88.4300, amenities: JSON.stringify(['WiFi', 'Cardio Zone', 'Group Classes', 'Parking']), timings: 'Mon-Sat: 5:00 AM – 10:30 PM, Sun: 6:00 AM – 9:00 PM', rating: 4.6 },
    { name: 'AB Fitness Park Street', city: 'Kolkata', state: 'West Bengal', address: 'Park Street, Central Kolkata', phone: '+91 33 4567 8902', email: 'parkstreet@abfitness.in', lat: 22.5519, lng: 88.3514, amenities: JSON.stringify(['WiFi', 'CrossFit', 'Sauna', 'Cafe', 'Boxing']), timings: 'Mon-Sun: 5:00 AM – 11:00 PM', rating: 4.8 },
    { name: 'AB Fitness DLF Phase 5', city: 'Gurugram', state: 'Haryana', address: 'Golf Course Road, DLF Phase 5, Gurugram', phone: '+91 124 4567 8901', email: 'dlf5@abfitness.in', lat: 28.4330, lng: 77.1025, amenities: JSON.stringify(['WiFi', 'Swimming Pool', 'CrossFit', 'Personal Training', 'Spa', 'Parking']), timings: 'Mon-Sun: 5:00 AM – 11:00 PM', rating: 4.9 },
    { name: 'AB Fitness Cyber Hub', city: 'Gurugram', state: 'Haryana', address: 'DLF Cyber City, Cyber Hub, Gurugram', phone: '+91 124 4567 8902', email: 'cyberhub@abfitness.in', lat: 28.4946, lng: 77.0890, amenities: JSON.stringify(['WiFi', 'Cardio Zone', 'Group Classes', 'Juice Bar']), timings: 'Mon-Sat: 5:30 AM – 11:00 PM, Sun: 6:00 AM – 9:00 PM', rating: 4.7 },
    { name: 'AB Fitness Viman Nagar', city: 'Pune', state: 'Maharashtra', address: 'Viman Nagar Main Road, Pune', phone: '+91 20 4567 8903', email: 'vimannagar@abfitness.in', lat: 18.5679, lng: 73.9143, amenities: JSON.stringify(['WiFi', 'Cardio Zone', 'CrossFit', 'Sauna']), timings: 'Mon-Sun: 5:00 AM – 11:00 PM', rating: 4.7 },
    { name: 'AB Fitness Electronic City', city: 'Bengaluru', state: 'Karnataka', address: 'Phase 1, Electronic City, Bengaluru', phone: '+91 80 4567 8904', email: 'electroniccity@abfitness.in', lat: 12.8399, lng: 77.6770, amenities: JSON.stringify(['WiFi', 'Group Classes', 'Cardio Zone', 'Parking']), timings: 'Mon-Sat: 5:00 AM – 10:30 PM, Sun: 6:00 AM – 9:00 PM', rating: 4.5 },
    { name: 'AB Fitness Juhu', city: 'Mumbai', state: 'Maharashtra', address: 'Juhu Tara Road, Juhu, Mumbai', phone: '+91 22 4567 8904', email: 'juhu@abfitness.in', lat: 19.0997, lng: 72.8265, amenities: JSON.stringify(['WiFi', 'Beach View', 'CrossFit', 'Yoga Studio', 'Juice Bar']), timings: 'Mon-Sun: 5:00 AM – 11:00 PM', rating: 4.9 },
    { name: 'AB Fitness Sector 18 Noida', city: 'Noida', state: 'Uttar Pradesh', address: 'Atta Market Area, Sector 18, Noida', phone: '+91 120 4567 8901', email: 'sector18@abfitness.in', lat: 28.5696, lng: 77.3213, amenities: JSON.stringify(['WiFi', 'Cardio Zone', 'Group Classes', 'Parking', 'Cafe']), timings: 'Mon-Sun: 5:00 AM – 11:00 PM', rating: 4.6 },
    { name: 'AB Fitness Chandigarh Sector 17', city: 'Chandigarh', state: 'Punjab', address: 'Sector 17 Shopping Complex, Chandigarh', phone: '+91 172 4567 8901', email: 'chandigarh@abfitness.in', lat: 30.7415, lng: 76.7879, amenities: JSON.stringify(['WiFi', 'CrossFit', 'Swimming Pool', 'Sauna', 'Parking']), timings: 'Mon-Sun: 5:30 AM – 11:00 PM', rating: 4.8 },
  ]

  const createdLocations = await Promise.all(
    locations.map(loc => prisma.gymLocation.create({ data: loc }))
  )
  console.log(`✅ Created ${createdLocations.length} gym locations`)

  console.log('\n🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
