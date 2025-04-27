import React from "react";
import { motion } from "framer-motion";

const sponsors = [
  { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "YouTube", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" },
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
  { name: "Facebook", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
  { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
  { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Netflix_logo.svg" },
  { name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" },
];

const SponsorSection = () => {
  const scrollX = {
    animate: {
      x: ["0%", "-100%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 40,
          ease: "linear",
        },
      },
    },
  };

  const repeatedSponsors = [...sponsors, ...sponsors]; // Repeating the sponsors to create the continuous scroll effect.

  return (
    <div className="bg-gray-100 py-16">
      <div className="max-w-screen-xl mx-auto overflow-hidden">
        

        <div className="relative flex items-center justify-between">
          {/* Motion container for logos */}
          <motion.div
            className="flex w-full space-x-8"
            {...scrollX}
          >
            {repeatedSponsors.map((sponsor, index) => (
              <div key={index} className="flex-shrink-0 px-4">
                <img
                  src={sponsor.logo}
                  alt={sponsor.name}
                  className="h-8 w-auto sm:h-12" // Responsive height for mobile and larger screens
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SponsorSection;
