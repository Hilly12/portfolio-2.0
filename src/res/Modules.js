const classes = [
  {
    completed: 1,
    code: "CO112",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/112/",
    name: "Hardware",
    year: 1,
    description: "Boolean Algebra, Circuits, Circuit Design, Synchronous Digital Systems, Processors"
  },
  {
    completed: 1,
    code: "CO113",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/113/",
    name: "Architecture",
    year: 1,
    description: "Hardware, Representation in CPU and Memory, Intel 64 Architecture - Instructions, Floating Point, IO"
  },
  {
    completed: 1,
    code: "CO120.1",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/120_1/",
    name: "Programming I",
    year: 1,
    description: "Programming in Haskell - Expressions, Functions, Recursion, Higher Order Functions, " +
      "User defined Types, Type Classes, Monads and IO"
  },
  {
    completed: 1,
    code: "CO120.2",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/120_2/",
    name: "Programming II",
    year: 1,
    description: "Programming in Java - Object Oriented Programming, Encapsulation, Inheritance, " +
      "Functional Interfaces and Iterators, Exception Handling, Generics, Concurrency, Abstract Data Structures"
  },
  {
    completed: 1,
    code: "CO120.3",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/120_3/",
    name: "Programming III",
    year: 1,
    description: "Programming in C - Type Conversion, Bit Operations, Pointers, Memory Management, Makefiles, " +
      "Linking, Dynamic Data Structures, Optimisation, Debugging, C Libraries"
  },
  {
    completed: 1,
    code: "CO120.3C",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/120_3C",
    name: "Programming III - Extension",
    year: 1,
    description: "Created a Bare Metal Model View Controller and Graphics Library for Raspberry Pi in C, ARM " +
      "and a Roguelike Game using it"
  },
  {
    completed: 1,
    code: "CO130",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/130/",
    name: "Databases I",
    year: 1,
    description: "Relational Models and Algebra, Functional Dependencies, Normalization, SQL, File Structure, Indexing"
  },
  {
    completed: 1,
    code: "CO140",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/140",
    name: "Logic",
    year: 1,
    description: "Propositional Logic, Predicate Logic, Argument, Equivalences, Natural Deduction"
  },
  {
    completed: 1,
    code: "CO141",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/141/",
    name: "Reasoning about Programs",
    year: 1,
    description: "Reasoning about Haskell Programs using Induction, Strong Induction, over Recursively defined " +
      "Data Structures, Reasoning about Java Programs using Conditions and Invariants"
  },
  {
    completed: 1,
    code: "CO142",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/142/",
    name: "Discrete Structures",
    year: 1,
    description: "Proof methods, Sets, Relations, Functions, Infinities, Orderings, Peano arithmetic, Induction"
  },
  {
    completed: 1,
    code: "CO145",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/145/",
    name: "Mathematical Methods",
    year: 1,
    description: "Sequences and Series including Limits and Tests, Power Series; and Linear Algebra including " +
      "Gaussian Elimination, Linear Independence, Vector Spaces, Eigenvalues and Diagonalization, " +
      "Intersection of Subspaces, Orthogonality, Projections"
  },
  {
    completed: 1,
    code: "CO150",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/150/",
    name: "Graphs and Algorithms",
    year: 1,
    description: "Graphs and graph representations, Algorithms for graph traversal, Minimum spanning trees, " +
      "Shortest paths, Dynamic programming, Divide and conquer, Searching and sorting, Algorithm analysis, " +
      "Master Theorem, Computational Complexity"
  },
  {
    completed: 1,
    code: "CO161",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/161/",
    name: "Laboratory 1",
    year: 1,
    description: "Haskell: Sequences, Cryptography, Text Processing, Fractal Drawing, Expression Evaluation " +
      "and Differentiation; Java: Trees, Chess Engine for Pawns, Picture Processing, Functional Programming, " +
      "Discrete Event Simulation, Turtle Interpreter, Spreadsheet Processing, Social Network Model, " +
      "Concurrent Matrix Multiplication, Red Black Trees; C: ARM Emulator, ARM Assembler, " +
      "Lighting up LED on Raspberry Pi"
  },
  {
    completed: 1,
    code: "CO163",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/163/",
    name: "Computing Topics",
    year: 1,
    description: "Case Studies on Computing Topics. Summarized paper on Alphazero and carried out research on " +
      "Adversarial Neural Networks"
  },
  {
    completed: 1,
    code: "CO164",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/164/",
    name: "Ethics in Computing 1",
    year: 1,
    description: "Case Studies on Computing Ethics. Presented a case study on the 1983 Soviet nuclear false alarm " +
      "incident"
  },
  {
    completed: 1,
    code: "CO165",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/165/",
    name: "Presentation Skills",
    year: 1,
    description: "How to give a presentation. Presented C Project Extension to technical audience, " +
      "presented case study on the 1983 Soviet nuclear false alarm incident to non-technical audience"
  },
  {
    completed: 1,
    code: "CO202",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/202/",
    name: "Algorithms II",
    year: 2,
    description: "Quantitative Analysis of Algorithms and Growth Order, Divide and Conquer, Dynamic Programming, " +
      "Greedy Algorithms, Randomised Algorithms, Advanced Graph Algorithms, String Processing Algorithms"
  },
  {
    completed: 1,
    code: "CO211",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/211/",
    name: "Operating Systems",
    year: 2,
    description: "Processes, Threads, Scheduling, Synchronisation, Deadlocks, Memory Management, Device Management, " +
      "Disk Management, File Systems, Security"
  },
  {
    completed: 1,
    code: "CO212",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/212/",
    name: "Networks and Communications",
    year: 2,
    description: "The Internet, Application Layer, Transport Layer, Network Security, Network Layer, " +
      "Data Link Layer, Physical Layer, Practical Applications"
  },
  {
    completed: 1,
    code: "CO220",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/220/",
    name: "Software Engineering Design",
    year: 2,
    description: "TDD, Mock Objects, Code Metrics, Dependencies, Distribution and Web Services, Continuous Delivery, " +
      "Design Patterns"
  },
  {
    completed: 1,
    code: "CO221",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/221/",
    name: "Compilers",
    year: 2,
    description: "Lexical Analysis, Parsing, Semantic Checking, Runtime Memory Organization, Code Generation, " +
      "Code Optimization"
  },
  {
    completed: 1,
    code: "CO233",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/233/",
    name: "Computational Techniques",
    year: 2,
    description: "Linear Maps, Norms, Eigenvalues and Generalized Eigenvectors, Spectral Decomposition, SVD, " +
      "Cholesky Decomposition, Least Squares, QR Decomposition, Condition Number and Eigenvector Computation," +
      "Laplace and Fourier Transforms, Functions on Multiple Variables, Method of Steepest Descent"
  },
  {
    completed: 1,
    code: "CO240",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/240/",
    name: "Models of Computation",
    year: 2,
    description: "Operational Semantics of WHILE, Confluence, Totality, Inductive Proofs on Properties of WHILE, " +
      "Register Machines and Universal Register Machine, Computable Functions as Register Machines, Turing Machines, " +
      "Lambda Calculus, Church-Turing Thesis"
  },
  {
    completed: 1,
    code: "CO245",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/245/",
    name: "Probability and Statistics",
    year: 2,
    description: "Probability, Discrete Random Variables, Continuous Random Variables, Central Limit Theorem, " +
      "Probability Generating Functions, Joint Random Variables, Estimation, Hypothesis Testing, Bayesian Inference"
  },
  {
    completed: 1,
    code: "CO261",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/261/",
    name: "Laboratory 2",
    year: 2,
    description: "Pintos: Implemented functionality of a monolithic kernel including a Priority and BSD Scheduler, " +
      "User Programs including 14 system calls; DevOps: Deployed a simple project to web using a CI/CD pipeline; " +
      "WACC Compiler: Created a Compiler for a procedural language to ARM11 using ANTLR and Java"
  },
  {
    completed: 1,
    code: "CO261C",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/261C/",
    name: "Advanced Laboratory 2",
    year: 2,
    description: "Pintos: Implemented Virtual Memory with Paging, Swap, Shared Memory; True Concurrency: Implemented " +
      "an interactive and concurrent picture processing library; WACC Extensions: Added several language features to " +
      "WACC and implemented advanced optimizations ie. Constant Propagation, Dead Code Elimination, in SSA"
  },
  {
    completed: 1,
    code: "CO271",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/271/",
    name: "2nd Year Computing Group Project",
    year: 2,
    description: "Human Centred Design, Agile Development, Designing Multi-User Applications, Created a web " +
      "application for musicians to find jobs mentoring other aspiring musicians or find mentors for " +
      "their passions"
  },
  {
    completed: 1,
    code: "CO273",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/273/",
    name: "An Introduction to Law for Computer Scientists",
    year: 2,
    description: "Intellectual Property and Software Copyright, Contracts, Data Protection, Regulation, GDPR, " +
      "Google Right to be Forgotten Case Study, Statute, Common Law"
  },
  {
    completed: 1,
    code: "CO276",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/276/",
    name: "Introduction to Prolog",
    year: 2,
    description: "Prolog Concepts and Constructs, Deterministic and Non-Deterministic Evaluation, Unification, Lists " +
      "Arithmetics, Negation, Control, Aggregation"
  },
  {
    completed: 1,
    code: "60002",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/60002/",
    name: "Advanced Databases",
    year: 3,
    description: "Object-Relational Model, Data Storage, Queries, Join Formation and Evaluation, Query Optimization, " +
      "Query Processing Models, Secondary Storage, Distributed and Scalable Databases, Map Reduce, " +
      "Transactions and Distributed Concurrency Control, Temporal Databases"
  },
  {
    completed: 1,
    code: "60006",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/60006/",
    name: "Computer Vision",
    year: 3,
    description: "Image Formation, Image Filtering, Edge Detection, Interest Point Detection, Feature Descriptors, " +
      "Image Classification, Object Detection, Image Segmentation, Neural Networks and Convolutional Neural Networks " +
      "Motion Estimation"
  },
  {
    completed: 1,
    code: "60015",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/60015/",
    name: "Network and Web Security",
    year: 3,
    description: "Threat Modelling, Internet Security, Server-side Security, Client-side Security, " +
      "Secure Web Sessions, Emerging Security Standards, Online Privacy Issues"
  },
  {
    completed: 1,
    code: "60016",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/60016/",
    name: "Operations Research",
    year: 3,
    description: "Linear Programming, Simplex Algorithm, Degenerate Linear Programs, Duality and Shadow Prices, " +
      "Game Theory, Integer Linear Programming, Cutting Planes, Branch and Bound"
  },
  {
    completed: 1,
    code: "60019",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/60019/",
    name: "Robotics",
    year: 3,
    description: "Robot Motion, Motor Control, Motion Calibration, Sensor Detection, Behavioural Control, " +
      "Probabilistic Localisation, Occupancy Mapping, Simultaneous Localization and Mapping (SLAM)"
  },
  {
    completed: 1,
    code: "70050",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/70050/",
    name: "Introduction to Machine Learning",
    year: 3,
    description: "Linear Regression, KNN, Decision Trees, Cross Validation, Statistical Significance, " +
      "Evaluation Metrics, Neural Networks, Optimizers, Overfitting, K-means, GMM-EM, Genetic Algorithms"
  },
  {
    completed: 1,
    code: "MATH96007",
    link: "https://www.imperial.ac.uk/computing/current-students/courses/MATH97019/",
    name: "Methods for Data Science",
    year: 3,
    description: "Linear Regression, Ridge Regression, KNN, Logistic Regression, Naive Bayes, Decision Trees, " +
      "Random Forests, SVMs, Neural Networks, Convolutional Neural Networks, K-means, Hierarchical Clustering, " +
      "Principal Components Analysis, Graph Clustering, Cluster Comparision, Graph Centrality and PageRank"
  },
  // {
  //   completed: 1,
  //   code: "70006",
  //   link: "https://www.imperial.ac.uk/computing/current-students/courses/70006/",
  //   name: "Computational Finance",
  //   year: 4,
  //   description: "",
  // },
  // {
  //   completed: 1,
  //   code: "70007",
  //   link: "https://www.imperial.ac.uk/computing/current-students/courses/70007/",
  //   name: "Computational Optimisation",
  //   year: 4,
  //   description: ""
  // },
  // {
  //   completed: 1,
  //   code: "70010",
  //   link: "https://www.imperial.ac.uk/computing/current-students/courses/70010/",
  //   name: "Deep Learning",
  //   year: 4,
  //   description: ""
  // },
  // {
  //   completed: 1,
  //   code: "70015",
  //   link: "https://www.imperial.ac.uk/computing/current-students/courses/70015/",
  //   name: "Mathematics for Machine Learning",
  //   year: 4,
  //   description: ""
  // },
  // {
  //   completed: 1,
  //   code: "70016",
  //   link: "https://www.imperial.ac.uk/computing/current-students/courses/70016/",
  //   name: "Natural Language Processing",
  //   year: 4,
  //   description: ""
  // },
  // {
  //   completed: 1,
  //   code: "70019",
  //   link: "https://www.imperial.ac.uk/computing/current-students/courses/70019/",
  //   name: "Probabilistic Inference",
  //   year: 4,
  //   description: ""
  // },
  // {
  //   completed: 1,
  //   code: "70028",
  //   link: "https://www.imperial.ac.uk/computing/current-students/courses/70028/",
  //   name: "Reinforcement Learning",
  //   year: 4,
  //   description: ""
  // },
]

const links = ["",
  "https://www.imperial.ac.uk/computing/current-students/computing/computing-first-year/",
  "https://www.imperial.ac.uk/computing/current-students/computing/computing-second-year/",
  "https://www.imperial.ac.uk/computing/current-students/computing/comp-third-meng/",
  "https://www.imperial.ac.uk/computing/current-students/computing/computing-fourth-year/"
]

const Modules = {
  modules: classes,
  links: links
}

export default Modules;