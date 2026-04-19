"use client";

import { useState } from "react";
import LandingPage from "./LandingPage";
import Analyse from "./Analyse"; // tumhara analyse.tsx

export default function Page() {
  const [started, setStarted] = useState(false);

  return (
    <>
      {started ? (
        <Analyse />
      ) : (
        <LandingPage onStart={() => setStarted(true)} />
      )}
    </>
  );
}