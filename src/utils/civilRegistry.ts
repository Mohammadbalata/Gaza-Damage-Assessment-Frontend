import { IRegistryData } from "../interfaces/store/IRegistryData";

// Mock Civil Registry Data
export interface CivilRegistryData extends IRegistryData {
  nationalId: number;
  fullName: string;
  motherName: string;
  dateOfBirth: string;
  wifeName: string;
  wifeDateOfBirth: string;
  numberOfSons: number;
  sonsBirthdays: string[];
  numberOfDaughters: number;
  daughtersBirthdays: string[];
  fatherName: string;
  registeredAddress: string;
  maritalStatus: "single" | "married" | "divorced" | "widowed";
  occupation: string;
  phoneNumber: string;
}

// Mock database - in production, this would be an API call
export const mockCivilRegistry: Record<string, CivilRegistryData> = {
  "123456789": {
    nationalId: 123456789,
    fullName: "Ahmad Hassan Mohammad",
    motherName: "Fatima Ibrahim",
    dateOfBirth: "1985-03-15",
    wifeName: "Layla Ahmad",
    wifeDateOfBirth: "1987-06-20",
    numberOfSons: 2,
    sonsBirthdays: ["2010-08-12", "2015-11-03"],
    numberOfDaughters: 1,
    daughtersBirthdays: ["2018-02-25"],
    fatherName: "Hassan Mohammad",
    registeredAddress: "Al-Rimal District, Gaza City, Palestine",
    maritalStatus: "married",
    occupation: "Engineer",
    phoneNumber: "+970599123456",
  },
  "987654321": {
    nationalId: 987654321,
    fullName: "Mohammed Ali Salem",
    motherName: "Aisha Omar",
    dateOfBirth: "1990-07-22",
    wifeName: "Sara Mahmoud",
    wifeDateOfBirth: "1992-09-10",
    numberOfSons: 1,
    sonsBirthdays: ["2015-04-18"],
    numberOfDaughters: 2,
    daughtersBirthdays: ["2017-12-05", "2020-03-15"],
    fatherName: "Ali Salem",
    registeredAddress: "Al-Shati Camp, Gaza, Palestine",
    maritalStatus: "married",
    occupation: "Teacher",
    phoneNumber: "+970599654321",
  },
  // Add more test entries - any 9-digit number will work, but these have predefined data
  "111111111": {
    nationalId: 111111111,
    fullName: "Test User One",
    motherName: "Test Mother",
    dateOfBirth: "1980-01-01",
    wifeName: "Test Wife",
    wifeDateOfBirth: "1982-05-15",
    numberOfSons: 3,
    sonsBirthdays: ["2005-06-10", "2008-09-20", "2012-03-05"],
    numberOfDaughters: 0,
    daughtersBirthdays: [],
    fatherName: "Test Father",
    registeredAddress: "Test Address, Gaza",
    maritalStatus: "married",
    occupation: "Doctor",
    phoneNumber: "+970599111111",
  },
};

export type VerificationQuestionType =
  | "wifeBirthday"
  | "sonBirthday"
  | "numberOfSons"
  | "numberOfDaughters"
  | "daughterBirthday"
  | "fatherName"
  | "occupation"
  | "maritalStatus"
  | "phoneNumber"
  | "motherName";

// Question templates
export interface VerificationQuestion {
  id: string;
  type: VerificationQuestionType;
  question: string;
  questionAr: string;
  validate: (answer: string, data: CivilRegistryData) => boolean;
  getAnswer: (data: CivilRegistryData) => string;
}

export const verificationQuestions: VerificationQuestion[] = [
  {
    id: "wifeBirthday",
    type: "wifeBirthday",
    question: "What is your wife's date of birth? (DD/MM/YYYY)",
    questionAr: "ما هو تاريخ ميلاد زوجتك؟ (يوم/شهر/سنة)",
    validate: (answer, data) => {
      const answerDate = answer
        .replace(/\//g, "-")
        .split("-")
        .reverse()
        .join("-");
      return (
        answerDate === data.wifeDateOfBirth || answer === data.wifeDateOfBirth
      );
    },
    getAnswer: (data) => data.wifeDateOfBirth,
  },
  {
    id: "numberOfSons",
    type: "numberOfSons",
    question: "How many sons do you have?",
    questionAr: "كم عدد أبنائك الذكور؟",
    validate: (answer, data) => parseInt(answer) === data.numberOfSons,
    getAnswer: (data) => data.numberOfSons.toString(),
  },
  {
    id: "sonBirthday1",
    type: "sonBirthday",
    question: "What is the birth date of your first son? (DD/MM/YYYY)",
    questionAr: "ما هو تاريخ ميلاد ابنك الأول؟ (يوم/شهر/سنة)",
    validate: (answer, data) => {
      if (data.sonsBirthdays.length === 0) return false;
      const answerDate = answer
        .replace(/\//g, "-")
        .split("-")
        .reverse()
        .join("-");
      return (
        answerDate === data.sonsBirthdays[0] || answer === data.sonsBirthdays[0]
      );
    },
    getAnswer: (data) => data.sonsBirthdays[0] || "",
  },
  {
    id: "sonBirthday2",
    type: "sonBirthday",
    question: "What is the birth date of your second son? (DD/MM/YYYY)",
    questionAr: "ما هو تاريخ ميلاد ابنك الثاني؟ (يوم/شهر/سنة)",
    validate: (answer, data) => {
      if (data.sonsBirthdays.length < 2) return false;
      const answerDate = answer
        .replace(/\//g, "-")
        .split("-")
        .reverse()
        .join("-");
      return (
        answerDate === data.sonsBirthdays[1] || answer === data.sonsBirthdays[1]
      );
    },
    getAnswer: (data) => data.sonsBirthdays[1] || "",
  },
  {
    id: "numberOfDaughters",
    type: "numberOfDaughters",
    question: "How many daughters do you have?",
    questionAr: "كم عدد بناتك؟",
    validate: (answer, data) => parseInt(answer) === data.numberOfDaughters,
    getAnswer: (data) => data.numberOfDaughters.toString(),
  },
  {
    id: "daughterBirthday1",
    type: "daughterBirthday",
    question: "What is the birth date of your first daughter? (DD/MM/YYYY)",
    questionAr: "ما هو تاريخ ميلاد ابنتك الأولى؟ (يوم/شهر/سنة)",
    validate: (answer, data) => {
      if (data.daughtersBirthdays.length === 0) return false;
      const answerDate = answer
        .replace(/\//g, "-")
        .split("-")
        .reverse()
        .join("-");
      return (
        answerDate === data.daughtersBirthdays[0] ||
        answer === data.daughtersBirthdays[0]
      );
    },
    getAnswer: (data) => data.daughtersBirthdays[0] || "",
  },
  {
    id: "fatherName",
    type: "fatherName",
    question: "What is your father's name?",
    questionAr: "ما هو اسم والدك؟",
    validate: (answer, data) =>
      answer.toLowerCase().trim() === data.fatherName.toLowerCase().trim(),
    getAnswer: (data) => data.fatherName,
  },
  {
    id: "occupation",
    type: "occupation",
    question: "What is your occupation?",
    questionAr: "ما هي مهنتك؟",
    validate: (answer, data) =>
      answer.toLowerCase().trim() === data.occupation.toLowerCase().trim(),
    getAnswer: (data) => data.occupation,
  },
  {
    id: "maritalStatus",
    type: "maritalStatus",
    question: "What is your marital status?",
    questionAr: "ما هي حالتك الاجتماعية؟",
    validate: (answer, data) =>
      answer.toLowerCase().trim() === data.maritalStatus.toLowerCase().trim(),
    getAnswer: (data) => data.maritalStatus,
  },
  {
    id: "phoneNumber",
    type: "phoneNumber",
    question: "What is your registered phone number?",
    questionAr: "ما هو رقم هاتفك المسجل؟",
    validate: (answer, data) =>
      answer.replace(/\s/g, "") === data.phoneNumber.replace(/\s/g, ""),
    getAnswer: (data) => data.phoneNumber,
  },
  {
    id: "motherName",
    type: "motherName",
    question: "What is your mother's name?",
    questionAr: "ما هو اسم والدتك؟",
    validate: (answer, data) =>
      answer.toLowerCase().trim() === data.motherName.toLowerCase().trim(),
    getAnswer: (data) => data.motherName,
  },
];

// Get random questions (3 out of available questions)
export const getRandomQuestions = (
  nationalId: number
): VerificationQuestion[] => {
  const data = mockCivilRegistry[nationalId];
  if (!data) {
    // If national ID not in mock data, return default questions that can work
    return verificationQuestions.slice(0, 3);
  }

  // Filter questions that are applicable to this user
  const applicableQuestions = verificationQuestions.filter((q) => {
    if (q.id === "sonBirthday1" && data.numberOfSons === 0) return false;
    if (q.id === "sonBirthday2" && data.numberOfSons < 2) return false;
    if (q.id === "daughterBirthday1" && data.numberOfDaughters === 0)
      return false;
    return true;
  });

  // Shuffle and pick 3
  const shuffled = [...applicableQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
};

// Verify answers
export const verifyAnswers = (
  nationalId: number,
  answers: Record<string, string>
): boolean => {
  const data = mockCivilRegistry[nationalId];
  if (!data) {
    // For testing: if national ID not in mock data, accept any answers
    // In production, this should return false
    return Object.keys(answers).length > 0;
  }

  // Get the questions that were asked (we need to track which ones were shown)
  // For now, we'll validate against all possible questions for this user
  const applicableQuestions = verificationQuestions.filter((q) => {
    if (q.id === "sonBirthday1" && data.numberOfSons === 0) return false;
    if (q.id === "sonBirthday2" && data.numberOfSons < 2) return false;
    if (q.id === "daughterBirthday1" && data.numberOfDaughters === 0)
      return false;
    return true;
  });

  // Check if all provided answers are correct
  for (const questionId in answers) {
    const question = applicableQuestions.find((q) => q.id === questionId);
    if (!question) continue;

    const answer = answers[questionId];
    if (!answer || !question.validate(answer, data)) {
      return false;
    }
  }

  return true;
};
