import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Github, Instagram, Link } from "lucide-react"; // Importing icons from lucide-react

const Home = () => {
  const [count, setCount] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<string>(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timeInterval); // Cleanup interval on component unmount
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center transition duration-300">
      {/* Header with ModeToggle */}
      <div className="w-full p-4 flex justify-end">
        <ModeToggle />
      </div>

      {/* Main Content */}
      <div className="relative text-center p-8 rounded-xl shadow-xl w-full max-w-md">
        {/* Title */}
        <h1 className="text-3xl font-semibold mb-4">
          Fullstack React Framework
        </h1>

        {/* Description */}
        <p className="text-sm mb-6">
          A FullStack React Framework with Vite, React, Tailwind CSS, and
          TypeScript for Frontend and Express for Backend.
        </p>

        {/* Counter Button */}
        <div className="mb-6">
          <Button
            onClick={() => setCount(count + 1)}
            className="w-full">
            Increment Counter: {count}
          </Button>
        </div>

        <div className="mb-6">
          <p className="text-sm">
            Start by editing{" "}
            <code className="bg-gray-600 text-white px-2 text-xs rounded italic">
              src/App.tsx
            </code>{" "}
            and{" "}
            <code className="bg-gray-600 text-white px-2 text-xs rounded italic">
              server/server.ts
            </code>{" "}
            files.
          </p>
        </div>

        {/* Current Time Display with Background */}
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 dark:from-pink-300 dark:via-purple-300 dark:to-blue-300">
          <p className="text-2xl font-medium text-white">
            Current Time: {currentTime}
          </p>
        </div>

        {/* Time Update Message */}
        <div className="mt-4">
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-300">
            The time updates every second.
          </p>
        </div>

        {/* Social Media Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <a
            href="https://github.com/Raushan0300/"
            target="_blank"
            rel="noopener noreferrer">
            <Button className="p-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition">
              <Github size={24} />
            </Button>
          </a>
          <a
            href="https://www.instagram.com/12aushan/"
            target="_blank"
            rel="noopener noreferrer">
            <Button className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:bg-gradient-to-l transition">
              <Instagram size={24} />
            </Button>
          </a>
          <a
            href="https://www.raushan.xyz"
            target="_blank"
            rel="noopener noreferrer">
            <Button className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition">
              <Link size={24} />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
