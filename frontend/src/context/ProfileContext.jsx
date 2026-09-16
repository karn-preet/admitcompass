import React, { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "global_punjab_student_profile";

export const DEFAULT_PROFILE = {
  currentDegree: "B.Tech in Computer Science and Engineering",
  degreeType: "Master's",
  field: "Computer Science",
  cgpa: 7.2,
  income: 900000,
  liquidSavingsINR: 1200000,
  financialCapacityEUR: 25000,
  ieltsScore: 7.0,
  isProfileActive: false
};

export const HARDCODED_TEST_PROFILE = {
  currentDegree: "B.Tech in Computer Science and Engineering",
  degreeType: "Master's",
  field: "Computer Science",
  cgpa: 7.0,
  income: 800000,
  liquidSavingsINR: 1200000,
  financialCapacityEUR: 25000,
  ieltsScore: 7.0,
  isProfileActive: true
};

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfileState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Could not load stored profile:", e);
    }
    return DEFAULT_PROFILE;
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn("Could not persist profile to localStorage:", e);
    }
  }, [profile]);

  const updateProfile = (partial) => {
    setProfileState(prev => ({
      ...prev,
      ...partial,
      isProfileActive: true
    }));
  };

  const setTestProfile = () => {
    setProfileState({ ...HARDCODED_TEST_PROFILE });
  };

  const clearProfile = () => {
    setProfileState({
      ...DEFAULT_PROFILE,
      isProfileActive: false
    });
  };

  const toggleProfileActive = () => {
    setProfileState(prev => ({
      ...prev,
      isProfileActive: !prev.isProfileActive
    }));
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile: setProfileState,
        updateProfile,
        setTestProfile,
        clearProfile,
        toggleProfileActive,
        isProfileActive: profile.isProfileActive
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return ctx;
}
