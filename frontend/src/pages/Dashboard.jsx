import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { getAuth } from "firebase/auth";
import app from "../firebase"; 
import { collection, addDoc, getFirestore } from "firebase/firestore"; 

const auth = getAuth(app);
const db = getFirestore(app);

function Dashboard() {
  const navigate = useNavigate(); 
  const [quizName, setQuizName] = useState(""); 
  const [question, setQuestion] = useState(""); 
  const [options, setOptions] = useState(["", "", "", ""]); 
  const [correctOption, setCorrectOption] = useState(""); 
  const [quizzes, setQuizzes] = useState([]); 
  const [error, setError] = useState(""); 

  const fetchQuizzes = async () => {
    try {
      const quizzesCollection = collection(db, "quizzes");
      const quizSnapshot = await getDocs(quizzesCollection);
      const quizList = quizSnapshot.docs.map((doc) => doc.data());
      setQuizzes(quizList);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();

    if (!quizName || !question || !correctOption || options.includes("")) {
      setError("Please fill all fields correctly.");
      return;
    }

    try {
      const newQuiz = {
        quizName,
        question,
        options,
        correctOption,
        createdBy: auth.currentUser.uid,
      };

      await addDoc(collection(db, "quizzes"), newQuiz);
      setError(""); 
      alert("Quiz created successfully!");
      setQuizName("");
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectOption("");
    } catch (error) {
      setError("Error creating quiz: " + error.message);
    }
  };

  const joinQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-semibold text-center mb-8">Dashboard</h1>

      {/* Create Quiz Form */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Create a Quiz
        </h2>
        <form onSubmit={handleCreateQuiz} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Quiz Name
            </label>
            <input
              type="text"
              placeholder="Enter quiz name"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Question
            </label>
            <input
              type="text"
              placeholder="Enter your question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Options
            </label>
            {options.map((option, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[index] = e.target.value;
                  setOptions(newOptions);
                }}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md mb-2"
              />
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Correct Option
            </label>
            <input
              type="text"
              placeholder="Enter correct option"
              value={correctOption}
              onChange={(e) => setCorrectOption(e.target.value)}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Create Quiz
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>

      {/* Join Quiz Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Join a Quiz</h2>
        {quizzes.length === 0 ? (
          <p className="text-center text-gray-600">
            No quizzes available to join.
          </p>
        ) : (
          <div className="space-y-4">
            {quizzes.map((quiz, index) => (
              <div
                key={index}
                className="p-4 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
                onClick={() => joinQuiz(quiz.id)}
              >
                <h3 className="text-lg font-medium text-gray-800">
                  {quiz.quizName}
                </h3>
                <p className="text-sm text-gray-600">{quiz.question}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;