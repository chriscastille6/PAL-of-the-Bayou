/** Item bank aligned with the Shiny app (Meyer et al., 2001; Funder & Ozer, 2019). */
window.CORRELATION_ITEMS = [
  {
    phase: "Intuitive",
    variable1: "Height",
    variable2: "Weight",
    description: "Height and weight for U.S. adults",
    r: 0.44,
    n: 19724,
    context:
      "Everyday-obvious anchor (Meyer et al. via Funder & Ozer, 2019). Effects this conspicuous are rare in psychological and HR research.",
  },
  {
    phase: "Intuitive",
    variable1: "Age",
    variable2: "Income",
    description: "Age and annual income for U.S. adults",
    r: 0.45,
    n: 15000,
    context:
      "Everyday relationship many people expect to notice without statistics. Use as a calibration anchor.",
  },
  {
    phase: "Intuitive",
    variable1: "Nearness to the equator",
    variable2: "Daily temperature",
    description: "Nearness to the equator and daily temperature in the U.S.A.",
    r: 0.6,
    n: 16948,
    context:
      "Everyday relationship many people expect to notice without statistics. Use as a calibration anchor.",
  },
  {
    phase: "Intuitive",
    variable1: "Gender (female vs male)",
    variable2: "Height",
    description: "Gender and height for U.S. adults (men are taller)",
    r: 0.6,
    n: 16962,
    context:
      "Everyday relationship many people expect to notice without statistics. Use as a calibration anchor.",
  },
  {
    phase: "Intuitive",
    variable1: "Education level",
    variable2: "Annual income",
    description: "Education level and annual income for U.S. adults",
    r: 0.55,
    n: 18000,
    context:
      "Everyday relationship many people expect to notice without statistics. Use as a calibration anchor.",
  },
  {
    phase: "Single-event",
    variable1: "Baseball batting average",
    variable2: "Hit success in a particular at-bat",
    description:
      "General batting skill as a Major League baseball player and hit success on a given instance at bat",
    r: 0.06,
    n: null,
    context:
      "Single-event outcomes are hard to predict from aggregate skill — even skilled batters miss most of the time (Meyer et al., 2001).",
  },
  {
    phase: "Medical",
    variable1: "Ibuprofen use",
    variable2: "Pain reduction",
    description:
      "Effect of nonsteroidal anti-inflammatory drugs (e.g., ibuprofen) on pain reduction",
    r: 0.14,
    n: 8488,
    context:
      "Medical interventions often have more modest correlations than people assume.",
  },
  {
    phase: "Medical",
    variable1: "Sugar consumption",
    variable2: "Children's behavior and cognitive processes",
    description:
      "Effect of sugar consumption on children's behavior and cognitive processes",
    r: 0.0,
    n: 560,
    context:
      "Medical interventions often have more modest correlations than people assume.",
  },
  {
    phase: "Medical",
    variable1: "Sleeping pill use",
    variable2: "Insomnia improvement",
    description:
      "Sleeping pills (benzodiazepines or zolpidem) and short-term improvement in chronic insomnia",
    r: 0.27,
    n: 205,
    context:
      "Medical interventions often have more modest correlations than people assume.",
  },
  {
    phase: "Medical",
    variable1: "Aspirin consumption",
    variable2: "Reduced risk of death by heart attack",
    description: "Aspirin and reduced risk of death by heart attack",
    r: 0.02,
    n: 22071,
    context:
      "Tiny medical effects can still matter when scaled across millions of people.",
  },
  {
    phase: "Medical",
    variable1: "Antihypertensive medication",
    variable2: "Reduced risk of stroke",
    description: "Antihypertensive medication and reduced risk of stroke",
    r: 0.03,
    n: 59086,
    context:
      "Medical interventions often have more modest correlations than people assume.",
  },
  {
    phase: "Medical",
    variable1: "Chemotherapy treatment",
    variable2: "Surviving breast cancer",
    description: "Chemotherapy and surviving breast cancer",
    r: 0.03,
    n: 9069,
    context:
      "Medical interventions often have more modest correlations than people assume.",
  },
  {
    phase: "Business",
    variable1: "Extroversion test scores",
    variable2: "Success in sales",
    description: "Extroversion and success in sales",
    r: 0.11,
    n: 194326,
    context:
      "Organizational psychology (Meyer et al., 2001 Table 2): individual differences predicting workplace outcomes.",
  },
  {
    phase: "Business",
    variable1: "Conscientiousness test scores",
    variable2: "Job proficiency",
    description: "Conscientiousness and job proficiency",
    r: 0.23,
    n: 21650,
    context:
      "Organizational psychology (Meyer et al., 2001 Table 2): individual differences predicting workplace outcomes.",
  },
  {
    phase: "Business",
    variable1: "Integrity test scores",
    variable2: "Subsequent supervisory ratings",
    description: "Integrity tests and subsequent supervisory ratings",
    r: 0.27,
    n: 5788,
    context:
      "Organizational psychology (Meyer et al., 2001 Table 2): individual differences predicting workplace outcomes.",
  },
  {
    phase: "Business",
    variable1: "Graduate Record Exam scores",
    variable2: "Subsequent graduate GPA",
    description: "GRE scores and subsequent graduate GPA",
    r: 0.24,
    n: 5186,
    context:
      "Organizational psychology (Meyer et al., 2001 Table 2): individual differences predicting workplace outcomes.",
  },
  {
    phase: "Business",
    variable1: "General intelligence test scores",
    variable2: "Functional effectiveness across jobs",
    description: "General intelligence and functional effectiveness across jobs",
    r: 0.25,
    n: 40000,
    context:
      "Organizational psychology (Meyer et al., 2001 Table 2): individual differences predicting workplace outcomes.",
  },
  {
    phase: "Business",
    variable1: "Motivation to manage",
    variable2: "Managerial effectiveness",
    description: "Motivation to manage and managerial effectiveness",
    r: 0.11,
    n: 626,
    context:
      "Organizational psychology (Meyer et al., 2001 Table 2): individual differences predicting workplace outcomes.",
  },
  {
    phase: "Mixed",
    variable1: "MMPI depression scores",
    variable2: "Subsequent cancer within 20 years",
    description: "MMPI depression scores and subsequent cancer within 20 years",
    r: 0.05,
    n: 2018,
    context: "Mixed challenge spanning domains and effect sizes (Meyer et al., 2001).",
  },
  {
    phase: "Mixed",
    variable1: "Beck Hopelessness Scale",
    variable2: "Subsequent suicide",
    description: "Beck Hopelessness Scale and subsequent suicide",
    r: 0.08,
    n: 2123,
    context: "Mixed challenge spanning domains and effect sizes (Meyer et al., 2001).",
  },
  {
    phase: "Mixed",
    variable1: "Conscientiousness test scores",
    variable2: "Job proficiency",
    description: "Conscientiousness test scores and job proficiency",
    r: 0.12,
    n: 21650,
    context: "Mixed challenge spanning domains and effect sizes (Meyer et al., 2001).",
  },
  {
    phase: "Mixed",
    variable1: "Graduate Record Exam scores",
    variable2: "Subsequent graduate GPA",
    description: "GRE scores and subsequent graduate GPA",
    r: 0.24,
    n: 5186,
    context: "Mixed challenge spanning domains and effect sizes (Meyer et al., 2001).",
  },
  {
    phase: "Mixed",
    variable1: "Integrity test scores",
    variable2: "Subsequent supervisory ratings",
    description: "Integrity test scores and subsequent supervisory ratings",
    r: 0.27,
    n: 5788,
    context: "Mixed challenge spanning domains and effect sizes (Meyer et al., 2001).",
  },
  {
    phase: "Mixed",
    variable1: "Neuropsychological test scores",
    variable2: "Differentiation of dementia from controls",
    description:
      "Neuropsychological tests and differentiation of dementia from controls",
    r: 0.68,
    n: 94,
    context: "Mixed challenge spanning domains and effect sizes (Meyer et al., 2001).",
  },
];
