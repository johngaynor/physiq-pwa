type ListItem = {
  title: string;
  href: string;
  description: string;
};

export const TrainingItems: ListItem[] = [
  {
    title: "Workout Log",
    href: "/",
    description: "Log your workouts.",
  },
  {
    title: "Workout History",
    href: "/",
    description: "View your training history.",
  },
  {
    title: "Workout Builder",
    href: "/",
    description: "Build templates for training blocks and sessions.",
  },
  {
    title: "Exercise Database",
    href: "/",
    description: "Create and manage exercises for your workouts.",
  },
];

export const LibraryItems: ListItem[] = [
  {
    title: "Bodybuilder Case Studies",
    href: "/",
    description:
      "Study the methodologies of the world's most renowned bodybuilders.",
  },
];

export const ReportItems: ListItem[] = [
  {
    title: "Check-Ins",
    href: "/",
    description: "Complete weekly check-ins to track your progress.",
  },
  {
    title: "Recovery Statistics",
    href: "/",
    description: "Gain insights into your recovery with trends and reports.",
  },
];

export const HealthItems: ListItem[] = [
  // {
  //   title: "Nutrition Log",
  //   href: "/",
  //   description: "View and manage your meal plans and nutrition information.",
  // },
  // {
  //   title: "Supplements Tracker",
  //   href: "/",
  //   description: "Log your daily supplement intake.",
  // },
  {
    title: "Weight Tracker",
    href: "/health/logs/weight",
    description: "Log your daily fasted AM bodyweight.",
  },
  {
    title: "Steps Tracker",
    href: "/health/logs/steps",
    description: "Log your daily step count.",
  },
  {
    title: "Bodyfat % Tracker",
    href: "/health/logs/bodyfat",
    description: "Log your daily fasted AM bodyfat %.",
  },
  {
    title: "Water Intake Tracker",
    href: "/health/logs/water",
    description: "Log your daily water intake.",
  },
  {
    title: "Daily Calorie Tracker",
    href: "/health/logs/calories",
    description: "Log your daily caloric intake.",
  },
  // {
  //   title: "Sleep Tracker",
  //   href: "/",
  //   description: "Track and monitor your sleep patterns.",
  // },
];

export const AIItems: ListItem[] = [
  {
    title: "Physique Pose Training",
    href: "/ai/physique/poses/train",
    description: "Train AI to recognize physique poses from photos.",
  },
];
