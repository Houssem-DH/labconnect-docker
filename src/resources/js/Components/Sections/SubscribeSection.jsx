import React, { useContext } from "react";
import { motion } from "framer-motion";
import ButtonPrimary from "@/Components/ButtonPrimary";
import ScrollAnimationWrapper from "@/Layouts/ScrollAnimationWrapper";
import Subscribe from "/public/assets/Subscribe.svg";
import { Link } from "@inertiajs/react";
import { LanguageContext } from "@/lib/LanguageContext";

const getScrollAnimation = () => ({
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
});

const SubscribeSection = () => {
  const { language } = useContext(LanguageContext);
  const scrollAnimation = getScrollAnimation();

  // Define the text for each language
  const staticText = language === 'fr' ? "Améliorez vos recherches avec" : language === 'ar' ? "حسّن بحثك مع" : "Enhance Your Research with";
  const labConnectText = "LabConnect";  // Always "LabConnect" for Arabic and other languages
  const description = language === 'fr' ? 
    "Rejoignez LabConnect pour simplifier la gestion de laboratoire, favoriser la collaboration et accéder à des outils et ressources de pointe. Soyez à l'avant-garde de l'innovation et de l'efficacité dans la recherche." :
    language === 'ar' ? 
    "انضم إلى LabConnect لتبسيط إدارة المختبرات وتعزيز التعاون والوصول إلى الأدوات والموارد المتطورة. كن في طليعة الابتكار والكفاءة في البحث." :
    "Join LabConnect to streamline lab management, foster collaboration, and access cutting-edge tools and resources. Be at the forefront of innovation and efficiency in research.";
  const buttonText = language === 'fr' ? "Commencer avec LabConnect" : language === 'ar' ? "ابدأ مع LabConnect" : "Get Started with LabConnect";
  const footerTitle = language === 'fr' ? "Prêt à améliorer votre expérience en laboratoire ?" : language === 'ar' ? "هل أنت مستعد لتحسين تجربتك في المختبر؟" : "Ready to elevate your lab experience?";
  const footerDescription = language === 'fr' ? 
    "Rejoignez LabConnect dès aujourd'hui pour un accès exclusif aux fonctionnalités avancées et aux mises à jour." : 
    language === 'ar' ? 
    "انضم إلى LabConnect اليوم للوصول الحصري إلى الميزات المتقدمة والتحديثات." : 
    "Join LabConnect today for exclusive access to advanced features and updates.";
  const footerButtonText = language === 'fr' ? "S'inscrire" : language === 'ar' ? "سجل الآن" : "Register";

  return (
    <div className="relative bg-white text-black py-16 px-6 lg:px-16">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-white opacity-30"></div>
      {/* Light overlay */}
      <div className="absolute inset-0 bg-white opacity-70"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left Side (Text Content) */}
        <ScrollAnimationWrapper>
          <motion.div
            className="flex flex-col justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            variants={scrollAnimation}
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              {staticText} <br />
              <span className="text-red-600">{labConnectText}</span>
            </h2>
            <p className="text-lg text-gray-700 mb-6">{description}</p>
            <Link href={route("login")}>
              <ButtonPrimary className="mt-4 bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition">
                {buttonText}
              </ButtonPrimary>
            </Link>
          </motion.div>
        </ScrollAnimationWrapper>
        
        {/* Right Side (Image or Illustration) */}
        <motion.div
          className="w-full h-full flex justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          variants={scrollAnimation}
        >
          <img
            src={Subscribe}
            alt="Subscription Illustration"
            quality={100}
            width={612}
            height={383}
          />
        </motion.div>
      </div>

      {/* Footer-Like Call-to-Action Section */}
      <div className="relative z-10 mt-16 text-center py-12 bg-gray-50 border rounded-lg shadow-lg">
        <h4 className="text-3xl font-bold mb-4">{footerTitle}</h4>
        <p className="text-lg text-gray-700 mb-6">{footerDescription}</p>
        <Link href={route('register')}>
          <ButtonPrimary className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition">
            {footerButtonText}
          </ButtonPrimary>
        </Link>
      </div>
    </div>
  );
};

export default SubscribeSection;
