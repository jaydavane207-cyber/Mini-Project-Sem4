import React, { useState } from 'react';

const QUESTION_BANK = {
  "React": [
    {
      question: "What is the primary purpose of the Virtual DOM in React?",
      options: [
        "To securely store private data",
        "To optimize DOM manipulation for performance",
        "To manage application routing",
        "To provide a built-in state management system"
      ],
      answer: "To optimize DOM manipulation for performance"
    },
    {
      question: "Which React hook is used to handle side effects?",
      options: ["useState", "useMemo", "useEffect", "useCallback"],
      answer: "useEffect"
    },
    {
      question: "How do you pass data from a parent component down to a child component?",
      options: ["Using State", "Using Props", "Using Context API", "Using Redux"],
      answer: "Using Props"
    },
    {
      question: "What does JSX stand for?",
      options: [
        "Java Standard XML",
        "JavaScript Syntax Extension",
        "JavaScript XML",
        "Java Syntax Extension"
      ],
      answer: "JavaScript XML"
    },
    {
      question: "Which of the following is true regarding React component state?",
      options: [
        "State can be accessed freely from any unrelated component",
        "State is read-only and cannot be updated",
        "State updates are managed directly by modifying the state object",
        "State updates should be performed using a setter function (e.g., setState or a hook setter)"
      ],
      answer: "State updates should be performed using a setter function (e.g., setState or a hook setter)"
    },
    {
      question: "What is the purpose of the 'key' prop when rendering lists in React?",
      options: [
        "To uniquely identify elements for efficient re-rendering",
        "To bind a variable to the database",
        "To apply custom CSS styling",
        "To encrypt data during transmission"
      ],
      answer: "To uniquely identify elements for efficient re-rendering"
    },
    {
      question: "Which method is used in class components to handle state updates based on previous state?",
      options: [
        "Passing a callback function to setState",
        "Passing a new object to setState directly",
        "Using the forceUpdate method",
        "Directly modifying this.state"
      ],
      answer: "Passing a callback function to setState"
    },
    {
      question: "What pattern allows you to reuse component logic by wrapping components?",
      options: ["Custom Hooks", "Higher-Order Components (HOCs)", "Render Props", "All of the above"],
      answer: "All of the above"
    },
    {
      question: "What does the useMemo hook do?",
      options: [
        "Caches a function definition between renders",
        "Memoizes the computed value to avoid expensive calculations on every render",
        "Handles asynchronous API calls automatically",
        "Replaces the need for Context API"
      ],
      answer: "Memoizes the computed value to avoid expensive calculations on every render"
    },
    {
      question: "Which hook allows you to reference a DOM element directly?",
      options: ["useRef", "useEffect", "useDOM", "useReference"],
      answer: "useRef"
    }
  ],
  "Python": [
    {
      question: "Which keyword is used to define a function in Python?",
      options: ["func", "def", "function", "lambda"],
      answer: "def"
    },
    {
      question: "What data type is the result of applying square brackets like [1, 2, 3]?",
      options: ["Tuple", "Dictionary", "Set", "List"],
      answer: "List"
    },
    {
      question: "How do you insert single-line comments in Python code?",
      options: ["// This is a comment", "/* This is a comment */", "# This is a comment", "<!-- This is a comment -->"],
      answer: "# This is a comment"
    },
    {
      question: "Which method is used to add an item to the end of a list?",
      options: ["add()", "insert()", "append()", "push()"],
      answer: "append()"
    },
    {
      question: "What is a 'dictionary' in Python?",
      options: [
        "An ordered sequence of items",
        "An immutable collection of objects",
        "An unordered collection of key-value pairs",
        "A set of unique elements"
      ],
      answer: "An unordered collection of key-value pairs"
    },
    {
      question: "How do you handle exceptions in Python?",
      options: ["try...catch", "try...except", "do...catch", "catch...finally"],
      answer: "try...except"
    },
    {
      question: "What does the '__init__' method do in a Python class?",
      options: [
        "It acts as the constructor to initialize object attributes",
        "It destroys the object when no longer needed",
        "It defines static variables for the class",
        "It runs automatically when the program finishes"
      ],
      answer: "It acts as the constructor to initialize object attributes"
    },
    {
      question: "Which statement is used to exit a loop prematurely?",
      options: ["exit", "return", "continue", "break"],
      answer: "break"
    },
    {
      question: "What does 'PEP 8' refer to in the Python ecosystem?",
      options: [
        "The standard library reference",
        "A popular web framework",
        "The official style guide for Python code",
        "A package manager"
      ],
      answer: "The official style guide for Python code"
    },
    {
      question: "What is the output of 'type(lambda x: x)'?",
      options: ["<class 'lambda'>", "<class 'function'>", "<class 'object'>", "TypeError"],
      answer: "<class 'function'>"
    }
  ],
  "UI/UX": [
    {
      question: "What does 'UX' stand for?",
      options: ["User Extension", "User Experience", "User Execution", "Unity Experience"],
      answer: "User Experience"
    },
    {
      question: "What is the primary goal of wireframing?",
      options: [
        "To create the final visual design details with colors and fonts",
        "To structure the layout and establish the visual hierarchy of an application",
        "To write the underlying code for a web page",
        "To finalize user database schemas"
      ],
      answer: "To structure the layout and establish the visual hierarchy of an application"
    },
    {
      question: "What does 'Responsive Design' mean?",
      options: [
        "A design that loads instantly",
        "A design that automatically adjusts layout based on the user's screen size",
        "A design that uses dark mode exclusively",
        "A design focused on AI interactions"
      ],
      answer: "A design that automatically adjusts layout based on the user's screen size"
    },
    {
      question: "Which of the following is a key principle of accessibility (A11y) in UI design?",
      options: [
        "Using complex animations to draw attention",
        "Ensuring high text contrast for readability",
        "Removing all keyboard navigation options",
        "Relying solely on color to convey important information"
      ],
      answer: "Ensuring high text contrast for readability"
    },
    {
      question: "What is A/B testing?",
      options: [
        "Testing the application on two different operating systems",
        "Comparing two versions of a webpage to see which performs better",
        "Testing the frontend and backend sequentially",
        "Testing code for syntax errors and logic bugs"
      ],
      answer: "Comparing two versions of a webpage to see which performs better"
    },
    {
      question: "What is 'White Space' (or Negative Space) in design?",
      options: [
        "The area dedicated to banner advertisements",
        "The empty space between design elements used to improve readability and structure",
        "An error state showing a blank page",
        "Space intentionally colored white, regardless of theme"
      ],
      answer: "The empty space between design elements used to improve readability and structure"
    },
    {
      question: "What describes a 'Call to Action' (CTA)?",
      options: [
        "A system alert indicating an error",
        "A button or link designed to prompt the user to take a specific action",
        "A legal disclaimer at the bottom of a page",
        "A hidden developer menu"
      ],
      answer: "A button or link designed to prompt the user to take a specific action"
    },
    {
      question: "What is a 'Persona' in UX research?",
      options: [
        "An individual user's specific account profile",
        "A fictional character created to represent a user type or demographic",
        "An anonymous user session",
        "A developer's online avatar"
      ],
      answer: "A fictional character created to represent a user type or demographic"
    },
    {
      question: "What is the difference between UI and UX?",
      options: [
        "UI is about coding, UX is about marketing",
        "UI focuses on the visual and interactive surfaces, UX focuses on the overall feel and journey",
        "UI is server-side, UX is client-side",
        "There is no difference; they are interchangeable terms"
      ],
      answer: "UI focuses on the visual and interactive surfaces, UX focuses on the overall feel and journey"
    },
    {
      question: "Which file format is standard for vector-based UI design elements that scale without losing quality?",
      options: ["JPG", "GIF", "SVG", "PNG"],
      answer: "SVG"
    }
  ]
};

const SkillVerificationQuiz = () => {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleSkillSelect = (skill) => {
    setSelectedSkill(skill);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setQuizFinished(false);
  };

  const handleOptionSelect = (option) => {
    if (!quizFinished) {
      setSelectedOption(option);
    }
  };

  const handleNextOrSubmit = () => {
    if (!selectedOption) return;

    const currentQuestions = QUESTION_BANK[selectedSkill];
    const currentQ = currentQuestions[currentQuestionIndex];

    // Check Answer
    if (selectedOption === currentQ.answer) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIndex < currentQuestions.length - 1) {
      // Proceed to next question
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // Finish quiz
      setQuizFinished(true);
    }
  };

  const handleRetryQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setQuizFinished(false);
  };

  const handleChooseDifferentSkill = () => {
    setSelectedSkill(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setQuizFinished(false);
  };

  const handleProceed = async () => {
    // TODO: Update is_verified in Supabase
    // e.g. const { data, error } = await supabase.from('profiles').update({ is_verified: true }).eq('id', user.id);
    console.log("Supabase API call to update is_verified would go here");
    alert(`Successfully verified for ${selectedSkill}!`);
  };

  // -----------------------------------------------------
  // RENDER: Skill Selection
  // -----------------------------------------------------
  if (!selectedSkill) {
    return (
      <div className="w-full max-w-3xl mx-auto p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl mt-8 text-slate-100 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-3 tracking-tight">Skill Verification</h2>
        <p className="text-slate-400 mb-8 text-center max-w-lg">
          Select a skill to verify. You must score at least <span className="text-indigo-400 font-semibold">8/10</span> to pass the verification quiz.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full">
          {Object.keys(QUESTION_BANK).map((skill) => (
            <button
              key={skill}
              onClick={() => handleSkillSelect(skill)}
              className="flex flex-col items-center justify-center p-8 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/50 rounded-xl shadow-sm hover:shadow-indigo-500/10 transition-all duration-200 group"
            >
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="font-semibold text-lg tracking-wide text-slate-200 group-hover:text-white">{skill}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // -----------------------------------------------------
  // RENDER: Quiz Finished (Outcomes)
  // -----------------------------------------------------
  if (quizFinished) {
    const passed = score >= 8;

    return (
      <div className="w-full max-w-2xl mx-auto p-10 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl mt-8 text-slate-100 text-center flex flex-col items-center relative overflow-hidden">
        {passed ? (
          <>
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-emerald-400 mb-3">Verification Passed!</h2>
            <div className="bg-slate-800/50 px-6 py-4 rounded-xl border border-slate-700 mb-8 inline-block">
              <p className="text-slate-300 text-lg">
                Your score: <span className="text-emerald-400 font-bold text-2xl ml-2">{score}/10</span>
              </p>
              <p className="text-sm text-slate-400 mt-1">Excellent work in {selectedSkill}.</p>
            </div>
            <button
              onClick={handleProceed}
              className="w-full sm:w-auto px-10 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20"
            >
              Proceed
            </button>
          </>
        ) : (
          <>
            <div className="absolute top-0 left-0 w-full h-1 bg-rose-500"></div>
            <div className="w-20 h-20 bg-rose-500/10 text-rose-400 rounded-full flex items-center justify-center mb-6 border border-rose-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-rose-400 mb-3">Verification Failed</h2>
            <div className="bg-slate-800/50 px-6 py-4 rounded-xl border border-slate-700 mb-6 inline-block">
              <p className="text-slate-300 text-lg">
                Your score: <span className="text-rose-400 font-bold text-2xl ml-2">{score}/10</span>
              </p>
            </div>
            <p className="text-slate-400 mb-8 max-w-sm">A minimum score of 8/10 is required to verify your proficiency in {selectedSkill}.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
              <button
                onClick={handleRetryQuiz}
                className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20"
              >
                Retry Quiz
              </button>
              <button
                onClick={handleChooseDifferentSkill}
                className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 rounded-xl font-medium transition-colors"
              >
                Choose Different Skill
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // -----------------------------------------------------
  // RENDER: Active Quiz
  // -----------------------------------------------------
  const currentQuestions = QUESTION_BANK[selectedSkill];
  const totalQuestions = currentQuestions.length;
  const currentQ = currentQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const progressPercentage = ((currentQuestionIndex) / totalQuestions) * 100;

  return (
    <div className="w-full max-w-3xl mx-auto p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl mt-8 text-slate-100 flex flex-col">
      {/* Header & Progress */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest">{selectedSkill} Verification</span>
        <span className="text-sm text-slate-400 font-medium bg-slate-800 px-3 py-1 rounded-full border border-slate-700">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
      </div>
      
      <div className="w-full bg-slate-800/80 rounded-full h-2.5 mb-10 overflow-hidden border border-slate-700/50">
        <div 
          className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Question */}
      <h3 className="text-2xl font-medium text-slate-50 mb-8 pr-4 leading-relaxed">
        {currentQ.question}
      </h3>

      {/* Options */}
      <div className="flex flex-col gap-3.5 mb-10">
        {currentQ.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          return (
            <label
              key={idx}
              className={`flex items-center gap-4 p-5 rounded-xl cursor-pointer transition-all duration-200 border ${
                isSelected 
                  ? 'bg-indigo-500/10 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-500'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex flex-shrink-0 items-center justify-center border-2 transition-colors ${
                isSelected ? 'border-indigo-400' : 'border-slate-500'
              }`}>
                {isSelected && <div className="w-2.5 h-2.5 bg-indigo-400 rounded-full scale-in"></div>}
              </div>
              <input
                type="radio"
                name="quiz-option"
                className="hidden"
                value={option}
                checked={isSelected}
                onChange={() => handleOptionSelect(option)}
              />
              <span className="leading-snug text-lg">{option}</span>
            </label>
          );
        })}
      </div>

      {/* Footer / Actions */}
      <div className="mt-auto border-t border-slate-800 pt-6 flex justify-between items-center">
        <button
          onClick={handleChooseDifferentSkill}
          className="text-slate-400 hover:text-slate-200 text-sm font-medium transition-colors p-2"
        >
          Cancel Quiz
        </button>
        <button
          onClick={handleNextOrSubmit}
          disabled={!selectedOption}
          className={`px-8 py-3.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
            !selectedOption 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 active:scale-95'
          }`}
        >
          {isLastQuestion ? 'Submit Quiz' : 'Next Question'}
          {selectedOption && !isLastQuestion && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )}
          {selectedOption && isLastQuestion && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default SkillVerificationQuiz;
