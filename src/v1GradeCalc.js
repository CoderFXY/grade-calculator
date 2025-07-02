//Version 1 GradeCalc (no target grade feature)

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
  const terms = ["1", "2", "3", "4"];

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
      newGrade.grade &&
      newGrade.weight
    ) {
      const grade = {
        id: Date.now(),
        ...newGrade,
        grade: parseFloat(newGrade.grade),
        weight: parseFloat(newGrade.weight),
      };
      setSubjects([...subjects, grade]);
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
      setShowAddForm(false);
    }
  };

  const handleEditGrade = (id) => {
    const grade = subjects.find((s) => s.id === id);
    setEditingGrade(grade);
    setNewGrade(grade);
    setShowAddForm(true);
  };

  const handleUpdateGrade = () => {
    setSubjects(
      subjects.map((s) =>
        s.id === editingGrade.id ? { ...newGrade, id: editingGrade.id } : s
      )
    );
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
        <div className="text-center mb-8">
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
                {terms.map((term) => (
                  <option key={term} value={term}>
                    Term {term}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowAddForm(true)}
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
                  {terms.map((term) => (
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
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleAddGrade}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
              >
                Add Grade
              </button>
              <button
                onClick={() => {
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
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Subject Averages */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Subject Averages
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getSubjectAverages().map((sub) => (
              <div
                key={sub.subject}
                className={`p-4 rounded-xl border-2 ${getGradeBg(
                  parseFloat(sub.average)
                )}`}
              >
                <h4 className="font-semibold text-gray-800 mb-2">
                  {sub.subject}
                </h4>
                <p
                  className={`text-2xl font-bold ${getGradeColor(
                    parseFloat(sub.average)
                  )}`}
                >
                  {sub.average}%
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {sub.totalGrades} assessments • {sub.totalWeight}% total
                  weight
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Grades List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">
              Grade Details ({getFilteredSubjects().length} assessments)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assessment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredSubjects().map((subject) => (
                  <tr
                    key={subject.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                          <BookOpen className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="font-medium text-gray-900">
                          {subject.subject}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {subject.assessmentName}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-lg font-semibold ${getGradeColor(
                          subject.grade
                        )}`}
                      >
                        {subject.grade}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {subject.weight}%
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {subject.year} S{subject.semester} T{subject.term}
                    </td>
                    <td className="px-6 py-4 text-gray-900">{subject.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditGrade(subject.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-150"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteGrade(subject.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
                    {terms.map((term) => (
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
    </div>
  );
};

export default GradeCalculator;
