import logo from './logo.svg';
//import './App.css';
import GradeCalculator from './GradeCalculator';
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <>
      <div className="App">
        <GradeCalculator />
      </div>
      <Analytics />
    </>
  );
}

