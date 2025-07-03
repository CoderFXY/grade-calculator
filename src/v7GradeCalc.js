//Version7 Grade Calculator fixed error when editing grade, (on second edit) total weighting was contacenated and weight before edit included new weight, and under 'Subject Averages' the total weight and average was wrong.

import React, { useState, useEffect } from "react";
import {
  Plus,
  BookOpen,
  Calculator,
  TrendingUp,
  Calendar,
  Eye,
  Trash2,
  Edit3,
  X,
} from "lucide-react";

const GradeCalculator = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedView, setSelectedView] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [targetGrades, setTargetGrades] = useState({});

  const [newGrade, setNewGrade] = useState({
    subject: "",
    assessmentName: "",
    grade: "",
    weight: "",
    year: "2024",
    semester: "1",
    term: "1",
    date: new Date().toISOString().split("T")[0],
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const semesters = ["1", "2"];
  const termsBySemester = {
    "1": ["1", "2"],
    "2": ["3", "4"],
  };

  const getTotalWeightForSubject = (subject, year, semester, term, excludeId = null) => {
    return subjects.reduce((sum, grade) => {
      if (
        grade.subject === subject &&
        grade.year === year &&
        grade.id !== excludeId
      ) {
        return sum + Number(grade.weight);
      }
      return sum;
    }, 0);
  };

  // Sample data for demonstration
  useEffect(() => {
    const sampleData = [
      {
        id: 1,
        subject: "Mathematics",
        assessmentName: "Midterm Exam",
        grade: 85,
        weight: 30,
        year: "2024",
        semester: "1",
        term: "1",
        date: "2024-03-15",
      },
      {
        id: 2,
        subject: "Mathematics",
        assessmentName: "Assignment 1",
        grade: 92,
        weight: 15,
        year: "2024",
        semester: "1",
        term: "1",
        date: "2024-02-20",
      },
      {
        id: 3,
        subject: "English",
        assessmentName: "Essay",
        grade: 78,
        weight: 25,
        year: "2024",
        semester: "1",
        term: "1",
        date: "2024-03-10",
      },
      {
        id: 4,
        subject: "Science",
        assessmentName: "Lab Report",
        grade: 88,
        weight: 20,
        year: "2024",
        semester: "1",
        term: "2",
        date: "2024-05-12",
      },
      {
        id: 5,
        subject: "History",
        assessmentName: "Research Project",
        grade: 95,
        weight: 40,
        year: "2024",
        semester: "2",
        term: "3",
        date: "2024-08-18",
      },
    ];
    setSubjects(sampleData);
  }, []);

  const handleAddGrade = () => {
    if (
      newGrade.subject &&
      newGrade.assessmentName &&
      newGrade.grade !== "" &&
      newGrade.weight !== ""
    ) {
      const gradeWeight = parseFloat(newGrade.weight);
      const existingWeight = getTotalWeightForSubject(
        newGrade.subject,
        newGrade.year
      );
  
      if (existingWeight + gradeWeight > 100) {
        alert(
          `Total weight for ${newGrade.subject} in ${newGrade.year} cannot exceed 100%. Current total: ${existingWeight}%.`
        );
        return;
      }
  
      const grade = {
        id: Date.now(),
        ...newGrade,
        grade: parseFloat(newGrade.grade),
        weight: gradeWeight,
      };
      setSubjects([...subjects, grade]);
      resetNewGrade();
      setShowAddForm(false);
    }
  };
  
  

  const resetNewGrade = () => {
    setNewGrade({
      subject: "",
      assessmentName: "",
      grade: "",
      weight: "",
      year: "2024",
      semester: "1",
      term: "1",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const handleEditGrade = (id) => {
    const grade = subjects.find((s) => s.id === id);
    setEditingGrade(grade);
    setNewGrade(grade);
    setShowAddForm(true);
  };

  const handleUpdateGrade = () => {
    const gradeWeight = parseFloat(newGrade.weight);
    const existingWeight = getTotalWeightForSubject(
      newGrade.subject,
      newGrade.year,
      newGrade.semester,
      newGrade.term,
      editingGrade.id
    );
  
    if (existingWeight + gradeWeight > 100) {
      alert(
        `Total weight for ${newGrade.subject} in ${newGrade.year} cannot exceed 100%. 
Current total without this assessment: ${existingWeight}%.`
      );
      return;
    }
  
    setSubjects(
      subjects.map((s) =>
        s.id === editingGrade.id 
          ? { 
              ...newGrade,
              id: editingGrade.id,
              grade: parseFloat(newGrade.grade),  
              weight: parseFloat(newGrade.weight),
            } 
          : s
      )
    );
    setEditingGrade(null);
    resetNewGrade();
    setShowAddForm(false);
  };  

  const handleDeleteGrade = (id) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const getFilteredSubjects = () => {
    return subjects.filter((subject) => {
      const matchesSubject = selectedSubject
        ? subject.subject === selectedSubject
        : true;
      const matchesYear = selectedYear ? subject.year === selectedYear : true;
      const matchesSemester = selectedSemester
        ? subject.semester === selectedSemester
        : true;
      const matchesTerm = selectedTerm ? subject.term === selectedTerm : true;
      return matchesSubject && matchesYear && matchesSemester && matchesTerm;
    });
  };

  const calculateWeightedAverage = (subjectGrades) => {
    if (subjectGrades.length === 0) return 0;
    const totalWeighted = subjectGrades.reduce(
      (sum, grade) => sum + grade.grade * grade.weight,
      0
    );
    const totalWeight = subjectGrades.reduce(
      (sum, grade) => sum + grade.weight,
      0
    );
    return totalWeight > 0 ? (totalWeighted / totalWeight).toFixed(2) : 0;
  };

  const getSubjectAverages = () => {
    const filtered = getFilteredSubjects();
    const grouped = filtered.reduce((acc, grade) => {
      if (!acc[grade.subject]) acc[grade.subject] = [];
      acc[grade.subject].push(grade);
      return acc;
    }, {});

    return Object.entries(grouped).map(([subject, grades]) => ({
      subject,
      average: calculateWeightedAverage(grades),
      totalGrades: grades.length,
      totalWeight: grades.reduce((sum, g) => sum + g.weight, 0),
    }));
  };

  const getOverallAverage = () => {
    const subjectAverages = getSubjectAverages();
    if (subjectAverages.length === 0) return 0;
    const total = subjectAverages.reduce(
      (sum, sub) => sum + parseFloat(sub.average),
      0
    );
    return (total / subjectAverages.length).toFixed(2);
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return "text-green-600";
    if (grade >= 80) return "text-blue-600";
    if (grade >= 70) return "text-yellow-600";
    if (grade >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getGradeBg = (grade) => {
    if (grade >= 90) return "bg-green-50 border-green-200";
    if (grade >= 80) return "bg-blue-50 border-blue-200";
    if (grade >= 70) return "bg-yellow-50 border-yellow-200";
    if (grade >= 60) return "bg-orange-50 border-orange-200";
    return "bg-red-50 border-red-200";
  };

  const uniqueSubjects = [...new Set(subjects.map((s) => s.subject))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Grade Calculator
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Track your academic progress with weighted grade calculations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-green-400 to-green-500 rounded-xl">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Overall Average
                </p>
                <p
                  className={`text-2xl font-bold ${getGradeColor(
                    parseFloat(getOverallAverage())
                  )}`}
                >
                  {getOverallAverage()}%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Subjects
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {uniqueSubjects.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-r from-purple-400 to-purple-500 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Assessments
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {getFilteredSubjects().length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="">All Subjects</option>
                {uniqueSubjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>

              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="">All Semesters</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>

              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="">All Terms</option>
                {(termsBySemester[newGrade.semester] || []).map((term) => (
                  <option key={term} value={term}>
                    Term {term}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingGrade(null);
                resetNewGrade();
              }}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add Grade
            </button>
          </div>
        </div>

        {/* Add Grade Form (inline) */}
        {showAddForm && !editingGrade && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Add New Grade
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mathematics, English"
                  value={newGrade.subject}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, subject: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assessment Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Midterm Exam, Assignment 1"
                  value={newGrade.assessmentName}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, assessmentName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Received (%)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 85"
                  min="0"
                  max="100"
                  value={newGrade.grade}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, grade: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assessment Weight (%)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 30"
                  min="0"
                  max="100"
                  value={newGrade.weight}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, weight: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year
                </label>
                <select
                  value={newGrade.year}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, year: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester
                </label>
                <select
                  value={newGrade.semester}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, semester: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Term
                </label>
                <select
                  value={newGrade.term}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, term: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {(termsBySemester[newGrade.semester] || []).map((term) => (
                    <option key={term} value={term}>
                      Term {term}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assessment Date
                </label>
                <input
                  type="date"
                  value={newGrade.date}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={handleAddGrade}
                className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Add Grade
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  resetNewGrade();
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit Grade Form */}
        {showAddForm && editingGrade && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Edit Grade
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Same inputs as add form, bound to newGrade */}
              {/* Subject Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Mathematics, English"
                  value={newGrade.subject}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, subject: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Assessment Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assessment Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Midterm Exam, Assignment 1"
                  value={newGrade.assessmentName}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, assessmentName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Grade Received */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Received (%)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 85"
                  min="0"
                  max="100"
                  value={newGrade.grade}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, grade: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Assessment Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assessment Weight (%)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 30"
                  min="0"
                  max="100"
                  value={newGrade.weight}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, weight: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              {/* Academic Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year
                </label>
                <select
                  value={newGrade.year}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, year: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester
                </label>
                <select
                  value={newGrade.semester}
                  onChange={(e) => {
                    const semester = e.target.value;
                    const validTerms = termsBySemester[semester] || [];
                    const updatedTerm = validTerms.includes(newGrade.term)
                      ? newGrade.term
                      : validTerms[0] || "";
                    setNewGrade({ ...newGrade, semester, term: updatedTerm });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              {/* Term */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Term
                </label>
                <select
                  value={newGrade.term}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, term: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {(termsBySemester[newGrade.semester] || []).map((term) => (
                    <option key={term} value={term}>
                      Term {term}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assessment Date
                </label>
                <input
                  type="date"
                  value={newGrade.date}
                  onChange={(e) =>
                    setNewGrade({ ...newGrade, date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={handleUpdateGrade}
                className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingGrade(null);
                  resetNewGrade();
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Subject Averages Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Subject Averages
          </h2>
          <SubjectAverages
            subjects={getSubjectAverages()}
            targetGrades={targetGrades}
            setTargetGrades={setTargetGrades}
            calculateRequiredGrade={(subject) => {
              // Calculate required grade to hit target
              const grades = getFilteredSubjects().filter(
                (g) => g.subject === subject
              );
              const targetRaw = targetGrades[subject];
              const target = parseFloat(targetRaw);
              if (isNaN(target) || target < 0 || target > 100) return null;
              if (grades.length === 0) return null;

              const totalWeight = grades.reduce((sum, g) => sum + g.weight, 0);
              if (totalWeight >= 100) return null;

              const weightedSoFar = grades.reduce(
                (sum, g) => sum + g.grade * g.weight,
                0
              );
              const remainingWeight = 100 - totalWeight;
              const requiredGrade = (target * 100 - weightedSoFar) / remainingWeight;
              return requiredGrade.toFixed(2);
            }}
            getGradeColor={getGradeColor}
            getGradeBg={getGradeBg}
          />
        </div>

        {/* Grades List */}
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Grades</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl border border-gray-100 overflow-hidden">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="py-3 px-6 text-left font-semibold text-gray-700">
                    Subject
                  </th>
                  <th className="py-3 px-6 text-left font-semibold text-gray-700">
                    Assessment
                  </th>
                  <th className="py-3 px-6 text-left font-semibold text-gray-700">
                    Grade (%)
                  </th>
                  <th className="py-3 px-6 text-left font-semibold text-gray-700">
                    Weight (%)
                  </th>
                  <th className="py-3 px-6 text-left font-semibold text-gray-700">
                    Year
                  </th>
                  <th className="py-3 px-6 text-left font-semibold text-gray-700">
                    Semester
                  </th>
                  <th className="py-3 px-6 text-left font-semibold text-gray-700">
                    Term
                  </th>
                  <th className="py-3 px-6 text-left font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="py-3 px-6 text-center font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {getFilteredSubjects().map((grade) => (
                  <tr
                    key={grade.id}
                    className="border-t border-gray-100 hover:bg-indigo-50 transition"
                  >
                    <td className="py-3 px-6">{grade.subject}</td>
                    <td className="py-3 px-6">{grade.assessmentName}</td>
                    <td
                      className={`py-3 px-6 font-semibold ${getGradeColor(
                        grade.grade
                      )}`}
                    >
                      {grade.grade}%
                    </td>
                    <td className="py-3 px-6">{grade.weight}%</td>
                    <td className="py-3 px-6">{grade.year}</td>
                    <td className="py-3 px-6">{grade.semester}</td>
                    <td className="py-3 px-6">{grade.term}</td>
                    <td className="py-3 px-6">{grade.date}</td>
                    <td className="py-3 px-6 text-center">
                      <button
                        onClick={() => handleEditGrade(grade.id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-2"
                        title="Edit"
                      >
                        <Edit3 className="inline w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGrade(grade.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="inline w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {getFilteredSubjects().length === 0 && (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No grades found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Grade Modal/Popup */}
        {editingGrade && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Edit3 className="w-6 h-6 text-white" />
                </div>
                Edit Grade
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject Name
                  </label>
                  <p className="text-xs text-gray-500 mb-2"></p>
                  <input
                    type="text"
                    placeholder="e.g., Mathematics, English"
                    value={newGrade.subject}
                    onChange={(e) =>
                      setNewGrade({ ...newGrade, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assessment Name
                  </label>
                  <p className="text-xs text-gray-500 mb-2"></p>
                  <input
                    type="text"
                    placeholder="e.g., Midterm Exam, Assignment 1"
                    value={newGrade.assessmentName}
                    onChange={(e) =>
                      setNewGrade({
                        ...newGrade,
                        assessmentName: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Grade (%)
                  </label>
                  <p className="text-xs text-gray-500 mb-2"></p>
                  <input
                    type="number"
                    placeholder="e.g., 85"
                    min="0"
                    max="100"
                    value={newGrade.grade}
                    onChange={(e) =>
                      setNewGrade({ ...newGrade, grade: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assessment Weighting (%)
                  </label>
                  <p className="text-xs text-gray-500 mb-2"></p>
                  <input
                    type="number"
                    placeholder="e.g., 30"
                    min="0"
                    max="100"
                    value={newGrade.weight}
                    onChange={(e) =>
                      setNewGrade({ ...newGrade, weight: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Academic Year
                  </label>
                  <p className="text-xs text-gray-500 mb-2"></p>
                  <select
                    value={newGrade.year}
                    onChange={(e) =>
                      setNewGrade({ ...newGrade, year: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Semester
                  </label>
                  <p className="text-xs text-gray-500 mb-2"></p>
                  <select
                    value={newGrade.semester}
                    onChange={(e) =>
                      setNewGrade({ ...newGrade, semester: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    {semesters.map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Term
                  </label>
                  <p className="text-xs text-gray-500 mb-2"></p>
                  <select
                    value={newGrade.term}
                    onChange={(e) =>
                      setNewGrade({ ...newGrade, term: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    {(termsBySemester[newGrade.semester] || []).map((term) => (
                      <option key={term} value={term}>
                        Term {term}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Assessment Date
                  </label>
                  <p className="text-xs text-gray-500 mb-2"></p>
                  <input
                    type="date"
                    value={newGrade.date}
                    onChange={(e) =>
                      setNewGrade({ ...newGrade, date: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleUpdateGrade}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <Edit3 className="w-5 h-5" />
                  Update Grade
                </button>
                <button
                  onClick={() => {
                    setEditingGrade(null);
                    setShowAddForm(false);
                    setNewGrade({
                      subject: "",
                      assessmentName: "",
                      grade: "",
                      weight: "",
                      year: "2024",
                      semester: "1",
                      term: "1",
                      date: new Date().toISOString().split("T")[0],
                    });
                  }}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <footer className="text-center mt-12 p-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Grade Calculator. Built by fu :)
      </footer>
    </div>
  );
};

// Subject Averages Component with target grade input and required grade output side-by-side
const SubjectAverages = ({
  subjects,
  targetGrades,
  setTargetGrades,
  calculateRequiredGrade,
  getGradeColor,
  getGradeBg,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subjects.map(({ subject, average, totalGrades, totalWeight }) => {
        const requiredGrade = calculateRequiredGrade(subject);
        const targetValue = targetGrades[subject] ?? "";

        return (
          <div
            key={subject}
            className={`rounded-2xl p-6 shadow-lg border ${getGradeBg(
              average
            )}`}
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              {subject}
            </h3>
            <p className={`text-3xl font-bold mb-3 ${getGradeColor(average)}`}>
              {average}%
            </p>
            <p className="text-gray-600 mb-3">
              {totalGrades} assessment(s), total weight: {totalWeight}%
            </p>

            <div className="flex items-center gap-4">
              {/* Target Grade Input */}
              <div className="flex-1">
                <label
                  htmlFor={`target-${subject}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Target Grade (%)
                </label>
                <input
                  type="number"
                  id={`target-${subject}`}
                  min="0"
                  max="100"
                  value={targetValue}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === "" || (Number(val) >= 0 && Number(val) <= 100)) {
                      setTargetGrades((prev) => ({
                        ...prev,
                        [subject]: val,
                      }));
                    }
                  }}
                  placeholder="e.g. 85"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Required Grade Output */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Required Grade (%)
                </label>
                <div className="h-10 flex items-center px-3 border border-gray-300 rounded-lg bg-gray-50">
                  {targetValue === "" ? (
                    <span className="text-gray-400 italic">Enter target</span>
                  ) : requiredGrade === null ? (
                    <span className="text-red-600 font-semibold">
                      Not possible or no data
                    </span>
                  ) : requiredGrade > 100 ? (
                    <span className="text-red-600 font-semibold">
                      Unattainable
                    </span>
                  ) : requiredGrade < 0 ? (
                    <span className="text-green-600 font-semibold">
                      Target achieved
                    </span>
                  ) : (
                    <span className="font-semibold">{requiredGrade}%</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GradeCalculator;