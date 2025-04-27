import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/Components/ui/carousel";

// Function to generate random initials
const getInitials = (name) => {
  const names = name.split(" ");
  return names.length > 1
    ? names[0][0] + names[1][0]
    : names[0][0] + names[0][1];
};

const reviews = [
  {
    name: "Sofia Belkacem",
    city: "Algiers",
    country: "Algeria",
    rating: "5.0",
    review: "Un service absolument fantastique ! La connexion est toujours stable et le support client est au top.",
  },
  {
    name: "Rami Haddad",
    city: "Oran",
    country: "Algeria",
    rating: "4.8",
    review: "Un VPN génial avec des vitesses rapides. J'adore l'interface conviviale et les performances fiables.",
  },
  {
    name: "Kheira Ait Ahmed",
    city: "Constantine",
    country: "Algeria",
    rating: "4.9",
    review: "Je recommande vivement ! Il a dépassé mes attentes en termes de sécurité et de vitesse.",
  },
  {
    name: "Nabil Boudiaf",
    city: "Annaba",
    country: "Algeria",
    rating: "5.0",
    review: "Le meilleur VPN que j'ai utilisé. Excellente vitesse et sécurité. Ça vaut chaque centime !",
  },
];

const Review = () => {
  return (
    <div className="relative max-w-screen-xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-black mb-12 text-center">
        What Our Users Say
      </h2>
      <Carousel>
        <CarouselContent className="flex">
          {reviews.map((review, index) => (
            <CarouselItem
              key={index}
              className="p-6 bg-white rounded-lg shadow-lg transform transition-transform duration-500 ease-in-out hover:scale-105"
            >
              <div className="flex flex-col items-center">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center bg-gray-400 text-white text-2xl font-bold mb-4"
                >
                  {getInitials(review.name)}
                </div>
                <p className="text-xl font-semibold text-main-color mb-1">
                  {review.name}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  {review.city}, {review.country}
                </p>
                <p className="text-gray-800 mb-4">“{review.review}”</p>
                <div className="flex items-center">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="ml-2 text-lg text-gray-800">{review.rating}</span>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-main text-white p-3 rounded-full cursor-pointer flex items-center justify-center shadow-lg hover:bg-main transition">
          <ArrowLeft size={24} />
          <span className="sr-only">Previous</span>
        </CarouselPrevious>
        <CarouselNext className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-main text-white p-3 rounded-full cursor-pointer flex items-center justify-center shadow-lg hover:bg-main transition">
          <ArrowRight size={24} />
          <span className="sr-only">Next</span>
        </CarouselNext>
      </Carousel>
    </div>
  );
};

export default Review;
