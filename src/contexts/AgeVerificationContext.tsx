import React, { createContext, useContext, useState } from 'react';

interface AgeVerificationContextType {
  isVerified: boolean;
  verify: () => void;
}

const AgeVerificationContext = createContext<AgeVerificationContextType | undefined>(undefined);

export function AgeVerificationProvider({ children }: { children: React.ReactNode }) {
  // Initialize state directly to avoid cascading renders in useEffect
  const [isVerified, setIsVerified] = useState(() => {
    const verified = localStorage.getItem('age-verified');
    return verified === 'true';
  });

  const verify = () => {
    localStorage.setItem('age-verified', 'true');
    setIsVerified(true);
  };

  return (
    <AgeVerificationContext.Provider value={{ isVerified, verify }}>
      {children}
    </AgeVerificationContext.Provider>
  );
}

export function useAgeVerification() {
  const context = useContext(AgeVerificationContext);
  if (context === undefined) {
    throw new Error('useAgeVerification must be used within an AgeVerificationProvider');
  }
  return context;
}
