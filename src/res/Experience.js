const workexp = [
  {
    title: "Software Engineer",
    institution: "Google",
    period: "Incoming",
    description: [
    ],
  },
  // {
  //   title: "Personal Programming Tutor",
  //   institution: "Imperial College London",
  //   period: "October 2019 - March 2022",
  //   description: [
  //     "Ran weekly sessions for first year Computing students covering concepts such as higher order functions, " +
  //     "polymorphism, object-oriented programming, and concurrency, in Haskell, Kotlin and Java.",
  //     "Marked students' weekly coursework and provided them with personalized feedback."
  //   ],
  // },
  {
    title: "Machine Learning Engineer Intern",
    institution: "Synthesized",
    period: "April 2021 - September 2021",
    description: [
      "Carried out research on measuring and mitigating bias in datasets and detecting proxies for sensitive columns.",
      "Co-lead the development of a Python library to automatically assess fairness in machine learning models and " + 
      "datasets.",
      "Additionally worked on open sourcing the library, creating a documentation with detailed tutorials and user " +
      "guides."
    ],
  },
  {
    title: "Software Engineer Intern",
    institution: "Augnito",
    period: "July 2020 - October 2020",
    description: [
      "Developed an MVP for a contextual sales bot in Python.",
      "Carried out research on NLU engines, evaluating different word embeddings, pipelines and frameworks.",
      "Additionally worked on adding voice enabled features to a medical transcription application."
    ],
  },
  // {
  //   title: "Freelancer",
  //   period: "July 2019 - September 2019",
  //   institution: "Self Employed",
  //   description: [
  //     "Worked on several short term projects involving prototyping and web development using primitive web technologies.",
  //     "Taught beginners Java, Python and web development.",
  //   ]
  // },
  // {
  //   title: "Data Science Work Experience",
  //   institution: "MET Office",
  //   period: "June 2017 - July 2017",
  //   description: [
  //     "Collaboration with the Crescendo project team to analyze global temperature and rainfall data.",
  //     "Created an informative animated plot in Python using Iris, Matplotlib libraries.",
  //     "Demonstrated it to the public at the Royal Society Summer Science Exhibition.",
  //   ],
  // },
];

const education = [
  {
    title: "Computing MEng (Hons)",
    institution: "Imperial College London",
    period: "October 2018 - July 2022",
    description: [
      "On track for a first class honors",
      "86% average in Programming modules",
      "72% average in Algorithms modules"
    ],
  },
  {
    title: "Secondary School (A-Levels)",
    institution: "Blundell's School",
    period: "September 2016 - July 2018",
    description: [
      "A*AAAAA in Maths, Further Maths, Computing, Physics, Chemistry, EPQ",
      "Vice Chair of International Committee - lead multiple social, cultural and charitable events",
      "Chair of the E-Safety Committee - promoted web safety",
      "Grade 8 Public Speaking with Distinction",
    ],
  },
];

const Experience = {
  workexp: workexp,
  education: education
}

export default Experience;