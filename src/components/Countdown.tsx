import { useEffect, useState } from "react";

const Countdown = ({ targetDate, classname }: { targetDate: string, classname:string }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    // Parse target date manually in UTC
    const targetParts = targetDate.split(/[-T:]/); // ["2025","08","31","16","00","00"]
    const targetUtc = Date.UTC(
      parseInt(targetParts[0]),         // year
      parseInt(targetParts[1]) - 1,     // month (0-indexed)
      parseInt(targetParts[2]),         // day
      parseInt(targetParts[3] || "0"),  // hours
      parseInt(targetParts[4] || "0"),  // minutes
      parseInt(targetParts[5] || "0")   // seconds
    );

    const nowUtc = Date.now(); // current UTC milliseconds
    const difference = targetUtc - nowUtc;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pad = (num: number) => String(num).padStart(2, "0");

  return (
    <div className={classname}>
      {pad(timeLeft.days)}d : {pad(timeLeft.hours)}h : {pad(timeLeft.minutes)}m : {pad(timeLeft.seconds)}s
    </div>
  );
};

export default Countdown;
