export type TrajectoryCategory =
  | 'faculty'
  | 'research'
  | 'teaching'
  | 'consultancy'
  | 'education'

export type TrajectoryItem = {
  role: string
  institution: string
  startYear: number
  endYear: number | null
  category: TrajectoryCategory
  order?: number
}

export const trajectoryItems: TrajectoryItem[] = [
  // Education
  {
    role: 'DPhil in Politics',
    institution: 'University of Oxford',
    startYear: 2019,
    endYear: 2023,
    category: 'education',
  },
  {
    role: 'MA in Political Science',
    institution: 'Universidad de Chile',
    startYear: 2010,
    endYear: 2013,
    category: 'education',
  },
  {
    role: 'BA in Government',
    institution: 'Universidad de Chile',
    startYear: 2004,
    endYear: 2009,
    category: 'education',
  },

  // Faculty appointments
  {
    role: 'Associate Professor',
    institution: 'Universidad Diego Portales',
    startYear: 2025,
    endYear: null,
    category: 'faculty',
  },
  {
    role: 'Lecturer',
    institution: 'Universidad Diego Portales',
    startYear: 2024,
    endYear: 2025,
    category: 'faculty',
  },
  {
    role: 'Instructor',
    institution: 'Universidad de Santiago de Chile',
    startYear: 2019,
    endYear: 2024,
    category: 'faculty',
  },

  // Research
  {
    role: 'Research Leader',
    institution: 'Oxford Computational Political Science Group',
    startYear: 2025,
    endYear: null,
    category: 'research',
    order: 1,
  },
  {
    role: 'Research Associate',
    institution: 'Observatory of the Executive Power',
    startYear: 2025,
    endYear: null,
    category: 'research',
    order: 2,
  },
  {
    role: 'Postdoc',
    institution: 'Leiden University',
    startYear: 2023,
    endYear: null,
    category: 'research',
  },
  {
    role: 'Research Associate',
    institution: 'Training Data Lab',
    startYear: 2020,
    endYear: 2025,
    category: 'research',
  },
  {
    role: 'Research Assistant',
    institution: 'Universidad de Los Lagos',
    startYear: 2013,
    endYear: 2014,
    category: 'research',
  },

  // Teaching
  {
    role: 'Lecturer',
    institution: 'Leiden University',
    startYear: 2024,
    endYear: 2025,
    category: 'teaching',
  },
  {
    role: 'Adjunct Professor',
    institution: 'Universidad de Santiago de Chile',
    startYear: 2014,
    endYear: 2019,
    category: 'teaching',
  },
  {
    role: 'Lecturer',
    institution: 'Universidad de Chile',
    startYear: 2013,
    endYear: 2016,
    category: 'teaching',
  },

  // Consultancy
  {
    role: 'Research Coordinator',
    institution: 'Empiria Lab',
    startYear: 2024,
    endYear: null,
    category: 'consultancy',
  },
  {
    role: 'Consultant',
    institution: 'UNDP',
    startYear: 2016,
    endYear: 2017,
    category: 'consultancy',
  },
]
