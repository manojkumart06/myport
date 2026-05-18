import { useState, useEffect } from 'react';

export default function CountdownTimer({ darkMode, targetDate = null }) {
  const [timeLeft, setTimeLeft] = useState({
    years: 2,
    months: 11,
    days: 16,
    hours: 0,
    minutes: 49,
    seconds: 51
  });

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();

      if (difference > 0) {
        const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
        const months = Math.floor((difference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
        const days = Math.floor((difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ years, months, days, hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className={`inline-flex items-center gap-1.5 text-xs sm:text-sm font-mono
                     ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      <span className={`font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
        {timeLeft.years}Y
      </span>
      <span className={`font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
        {timeLeft.months}M
      </span>
      <span className={`font-semibold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
        {timeLeft.days}D
      </span>
      <span className={`font-semibold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
        {timeLeft.hours}h
      </span>
      <span className={`font-semibold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
        {timeLeft.minutes}m
      </span>
      <span className={`font-semibold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
        {timeLeft.seconds}s
      </span>
      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
        to quantum-proof your crypto
      </span>
    </div>
  );
}
