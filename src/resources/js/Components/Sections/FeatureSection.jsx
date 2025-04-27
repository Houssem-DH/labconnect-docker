import React, { useMemo } from "react";
import { motion } from "framer-motion";
import getScrollAnimation from "@/utils/getScrollAnimation";
import ScrollAnimationWrapper from "@/Layouts/ScrollAnimationWrapper";
import { CheckCircle } from "lucide-react";

const features = [
  {
    text: "Seamless Integration with Lab Management Systems",
    icon: <CheckCircle size={20} className="text-main" />
  },
  {
    text: "Collaborative Tools for Research Teams and Projects",
    icon: <CheckCircle size={20} className="text-main" />
  },
  {
    text: "Comprehensive Data Analysis and Reporting",
    icon: <CheckCircle size={20} className="text-main" />
  },
  {
    text: "Robust Security Features for Sensitive Research Data",
    icon: <CheckCircle size={20} className="text-main" />
  }
];


const Feature = () => {
  const scrollAnimation = useMemo(() => getScrollAnimation(), []);

  return (
    <div
      className="max-w-screen-xl mt-8 mb-6 sm:mt-14 sm:mb-14 px-6 sm:px-8 lg:px-16 mx-auto"
      id="feature"
    >
      <div className="grid grid-flow-row sm:grid-flow-col grid-cols-1 sm:grid-cols-2 gap-8 py-8 my-12">
        <ScrollAnimationWrapper className="flex w-full justify-end">
          <motion.div
            className="h-full w-full p-4"
            variants={scrollAnimation}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <img
              src="/assets/Feature.svg"
              alt="Feature Illustration"
              layout="responsive"
              quality={100}
              height={414}
              width={508}
            />
          </motion.div>
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper>
          <motion.div
            className="flex flex-col pt-20 items-end justify-center ml-auto w-full lg:w-9/12"
            variants={scrollAnimation}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl lg:text-4xl font-semibold leading-relaxed text-gray-800">
              Discover Our Key Features
            </h3>
            <p className="my-2 text-gray-600">
              Explore the standout features that set us apart. Each feature is designed to enhance your experience and provide unmatched value.
            </p>
            <ul className="text-gray-600 self-start list-inside ml-8 space-y-4">
              {features.map((feature, index) => (
                <motion.li
                  className="relative flex items-center space-x-3 mb-2"
                  key={feature.text}
                  custom={{ duration: 0.6 + index * 0.2 }}
                  variants={scrollAnimation}
                  whileHover={{
                    scale: 1.05,
                    transition: {
                      duration: 0.3
                    }
                  }}
                >
                  <span className="text-main">{feature.icon}</span>
                  <span>{feature.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </ScrollAnimationWrapper>
      </div>
    </div>
  );
};

export default Feature;
