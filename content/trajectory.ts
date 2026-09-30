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
}

export const trajectoryItems: TrajectoryItem[] = [
  {
    role: 'Associate Professor',
    institution: 'Universidad Diego Portales',
    startYear: 2025,
    endYear: null,
    category: 'faculty',
  },
  {
    role: 'Research Leader',
    institution: 'Oxford Computational Political Science Group',
    startYear: 2025,
    endYear: null,
    category: 'research',
  },
  {
    role: 'Research Associate',
    institution: 'Observatory of the Executive Power',
    startYear: 2025,
    endYear: null,
    category: 'research',
  },
  {
    role: 'Research Coordinator',
    institution: 'Empiria Lab',
    startYear: 2024,
    endYear: null,
    category: 'consultancy',
  },
  {
    role: 'Postdoc',
    institution: 'Leiden University',
    startYear: 2023,
    endYear: null,
    category: 'research',
  },
  {
    role: 'Lecturer',
    institution: 'Universidad Diego Portales',
    startYear: 2023,
    endYear: 2025,
    category: 'faculty',
  },
  {
    role: 'Research Associate',
    institution: 'Training Data Lab',
    startYear: 2020,
    endYear: 2025,
    category: 'research',
  },
  {
    role: 'Instructor',
    institution: 'Universidad de Santiago de Chile',
    startYear: 2019,
    endYear: 2024,
    category: 'faculty',
  },
  {
    role: 'DPhil in Politics',
    institution: 'University of Oxford',
    startYear: 2019,
    endYear: 2023,
    category: 'education',
  },
  {
    role: 'Adjunct Professor',
    institution: 'Universidad de Santiago de Chile',
    startYear: 2014,
    endYear: 2019,
    category: 'teaching',
  },
  {
    role: 'Consultant',
    institution: 'United Nations Development Programme - UNDP',
    startYear: 2016,
    endYear: 2017,
    category: 'consultancy',
  },
  {
    role: 'Lecturer',
    institution: 'Universidad de Chile',
    startYear: 2013,
    endYear: 2016,
    category: 'teaching',
  },
  {
    role: 'Research Assistant',
    institution: 'Universidad de Los Lagos',
    startYear: 2013,
    endYear: 2014,
    category: 'research',
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
]
