import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-hot-toast';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Variantes d'animation non utilisées pour le moment, conservées pour une utilisation future
/* 
const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut"
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};
*/

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

// Définition des types pour TypeScript
interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormStatus {
  isSubmitting: boolean;
  isSubmitted: boolean;
  isError: boolean;
  message: string;
}

// Clés EmailJS (à remplacer par vos propres clés en production)
// Pour que le formulaire fonctionne correctement :
// 1. Créez un compte sur emailjs.com
// 2. Créez un service (appelé "service_portfolio" ou mettez à jour cette constante)
// 3. Créez un template d'email (appelé "template_contact" ou mettez à jour cette constante)
// 4. Assurez-vous que votre template contient les variables: from_name, from_email, subject, message
// 5. Obtenez votre clé publique et remplacez la valeur ci-dessous
const EMAILJS_SERVICE_ID = "service_e0x6ut5";
const EMAILJS_TEMPLATE_ID = "template_eczbqws";
const EMAILJS_PUBLIC_KEY = "tc2h5SQlq1Kp2SxkJ"; // Vérifiez que cette clé est correcte!

const HomePage = () => {
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<FormStatus>({
    isSubmitting: false,
    isSubmitted: false,
    isError: false,
    message: ''
  });

  // Refs pour les effets parallax
  const heroRef = useRef<HTMLElement>(null);
  
  // Effet parallax pour la section hero
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  
  // Animation basée sur la visibilité des sections
  const [sectionVisibility, setSectionVisibility] = useState({
    about: false,
    projects: false,
    experience: false,
    testimonials: false,
    contact: false
  });
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const section = entry.target.id;
          if (section && entry.isIntersecting) {
            setSectionVisibility(prev => ({ ...prev, [section]: true }));
            // Utilisation: Log pour débogage
            console.log(`Section visible: ${section}`, sectionVisibility);
          }
        });
      },
      { threshold: 0.15 }
    );
    
    document.querySelectorAll('section[id]').forEach(section => {
      observer.observe(section);
    });
    
    return () => {
      document.querySelectorAll('section[id]').forEach(section => {
        observer.unobserve(section);
      });
    };
  }, []);

  // Initialiser EmailJS
  useEffect(() => {
    try {
      // Initialisation d'EmailJS avec des options supplémentaires
      emailjs.init({
        publicKey: EMAILJS_PUBLIC_KEY,
        // La configuration de limitRate avec uniquement throttle
        // selon la documentation d'EmailJS
        limitRate: {
          throttle: 10000
        }
      });
      console.log("EmailJS initialisé avec succès");
    } catch (error) {
      console.error("Erreur lors de l'initialisation d'EmailJS:", error);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setFormStatus({
      isSubmitting: true,
      isSubmitted: false,
      isError: false,
      message: ''
    });
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    const templateParams = {
      from_name: formData.get('name'),
      from_email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    };
    
    // Afficher les informations de configuration avant l'envoi
    console.log("EmailJS configuration:", {
      serviceId: EMAILJS_SERVICE_ID,
      templateId: EMAILJS_TEMPLATE_ID,
      publicKey: EMAILJS_PUBLIC_KEY,
      templateParams
    });
    
    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );
      console.log("Email envoyé avec succès:", response);
      toast.success("Le message a été envoyé avec succès !");
      setFormStatus({
        isSubmitting: false,
        isSubmitted: true,
        isError: false,
        message: ''
      });
      form.reset();
    } catch (error) {
      console.error("Erreur détaillée lors de l'envoi:", error);
      toast.error("Échec de l'envoi du message. Veuillez réessayer plus tard.");
      setFormStatus({
        isSubmitting: false,
        isSubmitted: false,
        isError: true,
        message: "Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer plus tard."
      });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section 
        id="home" 
        ref={heroRef}
        className="section min-h-screen flex items-center relative overflow-hidden bg-gradient-to-b from-primary-light/10 to-gray-50 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="container-custom px-4 z-10">
          {/* Indicateur de mode sombre pour test */}
          <div className="dark-mode-test absolute top-4 left-4">
            Mode: <span className="dark:hidden">Clair</span><span className="hidden dark:inline">Sombre</span>
          </div>
          
          <motion.div
            style={{ y: textY }}
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-2xl"
          >
            <motion.h1 
              variants={fadeIn}
              className="text-4xl md:text-6xl font-bold mb-6 text-[#3B6EB0] dark:text-[#5B8ED0]"
            >
              Beni Nsasi
            </motion.h1>
            
            <motion.p 
              variants={fadeIn}
              className="text-xl md:text-2xl mb-8 text-gray-700 dark:text-gray-300"
            >
              Développeur FullStack | React & Node.js | Animations interactives & UX avancées
            </motion.p>
            
            <motion.div 
              variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a href="#contact" className="btn btn-primary">
                Me Contacter
              </a>
              <a href="#about" className="btn bg-white dark:bg-gray-700 text-primary dark:text-white border border-primary hover:bg-gray-50 dark:hover:bg-gray-600">
                En Savoir Plus
              </a>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Animated background elements */}
        <motion.div 
          className="absolute inset-0 overflow-hidden"
          style={{ y: bgY }}
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <motion.div
              key={index}
              className="absolute rounded-full bg-primary-light/20"
              style={{
                width: `${Math.random() * 200 + 50}px`,
                height: `${Math.random() * 200 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 1.2, 1], 
                x: [0, Math.random() * 100 - 50], 
                y: [0, Math.random() * 100 - 50],
              }}
              transition={{ 
                duration: 10, 
                repeat: Infinity, 
                repeatType: "reverse",
                delay: index * 0.5,
              }}
            />
          ))}
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="section bg-white dark:bg-gray-900">
        <div className="container-custom px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
            className="flex flex-col md:flex-row gap-12 items-center"
          >
            <motion.div 
              variants={fadeIn}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <div className="relative">
                <motion.div 
                  className="absolute inset-0 bg-primary rounded-xl"
                  initial={{ rotate: 0 }}
                  whileInView={{ rotate: -6 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                  viewport={{ once: true }}
                ></motion.div>
                <motion.div 
                  className="relative bg-gray-200 rounded-xl overflow-hidden aspect-square"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                >
                  {/* Replace with actual image */}
                  <img 
                    src="professional_pic.jpg" 
                    alt="Portrait de Beni Nsasi" 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: true }}
              className="md:w-1/2"
            >
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-6 dark:text-white"
              >
                À Propos de Moi
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-lg text-gray-700 dark:text-gray-300 mb-4"
              >
                Développeur FullStack passionné avec plus de 5 ans d'expérience dans la création d'applications web dynamiques et performantes. 
                Spécialisé dans le développement React pour le frontend et Node.js pour le backend.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-lg text-gray-700 dark:text-gray-300 mb-6"
              >
                Mon objectif est de créer des expériences utilisateur exceptionnelles qui combinent esthétique, fonctionnalité et performance.
                J'aime particulièrement travailler sur des projets innovants qui repoussent les limites de ce qui est possible sur le web.
              </motion.p>
              
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1, delayChildren: 0.4 }}
                viewport={{ once: true }}
              >
                {['React', 'TypeScript', 'Node.js', 'MongoDB', 'TailwindCSS', 'Framer Motion', 'Next.js', 'GraphQL'].map((skill, index) => (
                  <motion.div
                    key={skill}
                    className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center hover:bg-primary hover:text-white dark:hover:bg-primary dark:text-gray-300 transition-colors duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, backgroundColor: "#3B6EB0", color: "white" }}
                  >
                    {skill}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section bg-gray-50 dark:bg-gray-800">
        <div className="container-custom px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div 
              variants={fadeIn}
              className="text-center mb-12"
            >
              <motion.h2 
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-4 dark:text-white"
              >
                Mes Projets
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
              >
                Découvrez une sélection de mes réalisations récentes qui illustrent mes compétences et mon expertise.
              </motion.p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, staggerChildren: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {/* Projet 1 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg"
                whileHover={{ 
                  y: -10, 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.3 } 
                }}
              >
                <motion.div 
                  className="h-48 overflow-hidden bg-primary-light/30"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-full h-full flex items-center justify-center text-primary text-xl font-bold">
                    E-commerce Dashboard
                  </div>
                </motion.div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-primary dark:text-primary-light">E-commerce Dashboard</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Application de tableau de bord pour une plateforme e-commerce, avec suivi des ventes, gestion des stocks et analyse clientèle.
                  </p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="inline-block bg-gray-100 dark:bg-gray-800 text-primary text-xs px-2 py-1 rounded-full">React</span>
                    <span className="inline-block bg-gray-100 dark:bg-gray-800 text-primary text-xs px-2 py-1 rounded-full">TypeScript</span>
                    <span className="inline-block bg-gray-100 dark:bg-gray-800 text-primary text-xs px-2 py-1 rounded-full">Tailwind CSS</span>
                  </div>
                  <motion.a 
                    href="#" 
                    className="inline-block text-primary dark:text-primary-light font-medium hover:underline"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Voir le projet →
                  </motion.a>
                </div>
              </motion.div>
              
              {/* Projet 2 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg"
                whileHover={{ 
                  y: -10, 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.3 } 
                }}
              >
                <motion.div 
                  className="h-48 overflow-hidden bg-primary-light/20"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-full h-full flex items-center justify-center text-primary text-xl font-bold">
                    App Mobile Fitness
                  </div>
                </motion.div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-primary dark:text-primary-light">App Mobile Fitness</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Application mobile pour suivre les progrès sportifs, avec planification d'entraînements et suivi nutritionnel.
                  </p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="inline-block bg-gray-100 dark:bg-gray-800 text-primary text-xs px-2 py-1 rounded-full">React Native</span>
                    <span className="inline-block bg-gray-100 dark:bg-gray-800 text-primary text-xs px-2 py-1 rounded-full">Redux</span>
                    <span className="inline-block bg-gray-100 dark:bg-gray-800 text-primary text-xs px-2 py-1 rounded-full">Node.js</span>
                  </div>
                  <motion.a 
                    href="#" 
                    className="inline-block text-primary dark:text-primary-light font-medium hover:underline"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Voir le projet →
                  </motion.a>
                </div>
              </motion.div>
              
              {/* Projet 3 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg"
                whileHover={{ 
                  y: -10, 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.3 } 
                }}
              >
                <motion.div 
                  className="h-48 overflow-hidden bg-primary-light/40"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-full h-full flex items-center justify-center text-primary text-xl font-bold">
                    Site Web Immobilier
                  </div>
                </motion.div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-primary dark:text-primary-light">Site Web Immobilier</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Plateforme de recherche immobilière avec filtres avancés, carte interactive et prise de rendez-vous en ligne.
                  </p>
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className="inline-block bg-gray-100 dark:bg-gray-800 text-primary text-xs px-2 py-1 rounded-full">Next.js</span>
                    <span className="inline-block bg-gray-100 dark:bg-gray-800 text-primary text-xs px-2 py-1 rounded-full">TypeScript</span>
                    <span className="inline-block bg-gray-100 dark:bg-gray-800 text-primary text-xs px-2 py-1 rounded-full">Framer Motion</span>
                  </div>
                  <motion.a 
                    href="#" 
                    className="inline-block text-primary dark:text-primary-light font-medium hover:underline"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    Voir le projet →
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <motion.a 
                href="https://github.com/beni-nsasi" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Voir plus sur GitHub
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="section bg-gray-50 dark:bg-gray-800">
        <div className="container-custom px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div 
              variants={fadeIn}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Mon Parcours</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                Découvrez mon parcours professionnel et les compétences que j'ai développées au fil du temps.
              </p>
            </motion.div>
            
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-primary-light dark:bg-primary-light/50"></div>
              
              {/* Timeline Items */}
              <div className="space-y-12">
                {[
                  {
                    period: '2023 - Présent',
                    title: 'Développeur FullStack',
                    company: 'TechVision Solutions',
                    description: 'Développement d\'applications web avec React, Node.js et MongoDB. Implémentation de fonctionnalités interactives et animations avancées.',
                  },
                  {
                    period: '2021 - 2023',
                    title: 'Développeur Frontend',
                    company: 'DataInnovate',
                    description: 'Création d\'interfaces utilisateur modernes avec React et TailwindCSS. Intégration d\'API REST et GraphQL.',
                  },
                  {
                    period: '2019 - 2021',
                    title: 'Développeur Web Junior',
                    company: 'WebCreation Agency',
                    description: 'Développement de sites web responsifs avec HTML, CSS et JavaScript. Intégration de maquettes design pour divers clients.',
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="relative flex flex-col md:flex-row"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 md:text-right">
                      {index % 2 === 0 ? (
                        <div className="md:block hidden">
                          <h3 className="text-xl font-bold text-primary dark:text-primary-light">{item.title}</h3>
                          <p className="text-lg font-semibold dark:text-white">{item.company}</p>
                          <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
                        </div>
                      ) : (
                        <div className="md:hidden">
                          <h3 className="text-xl font-bold text-primary dark:text-primary-light">{item.title}</h3>
                          <p className="text-lg font-semibold dark:text-white">{item.company}</p>
                          <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
                        </div>
                      )}
                      <div className={`md:${index % 2 === 0 ? 'block' : 'hidden'}`}>
                        <span className="inline-block py-1 px-3 rounded-full bg-primary text-white text-sm">
                          {item.period}
                        </span>
                      </div>
                    </div>
                    
                    {/* Timeline Dot */}
                    <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-primary border-4 border-white"></div>
                    </div>
                    
                    <div className="md:w-1/2 md:pl-12">
                      {index % 2 === 1 ? (
                        <div className="md:block hidden">
                          <h3 className="text-xl font-bold text-primary dark:text-primary-light">{item.title}</h3>
                          <p className="text-lg font-semibold dark:text-white">{item.company}</p>
                          <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
                        </div>
                      ) : (
                        <div className="md:hidden">
                          <h3 className="text-xl font-bold text-primary dark:text-primary-light">{item.title}</h3>
                          <p className="text-lg font-semibold dark:text-white">{item.company}</p>
                          <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
                        </div>
                      )}
                      <div className={`md:${index % 2 === 1 ? 'block' : 'hidden'}`}>
                        <span className="inline-block py-1 px-3 rounded-full bg-primary text-white text-sm">
                          {item.period}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="mt-12 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <a 
                  href="/CV_2025-04-23_Beni_Nsasi.pdf" 
                  download 
                  className="btn btn-primary inline-flex items-center gap-2"
                >
                  <span>Télécharger mon CV</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                    />
                  </svg>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section bg-white dark:bg-gray-900">
        <div className="container-custom px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div 
              variants={fadeIn}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Contactez-moi</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                Vous avez un projet en tête ou une question ? N'hésitez pas à me contacter !
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8"
            >
              {formStatus.isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 dark:text-white">Message Envoyé !</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Merci pour votre message. Je vous répondrai dans les plus brefs délais.
                  </p>
                  <button 
                    onClick={() => setFormStatus({ isSubmitting: false, isSubmitted: false, isError: false, message: '' })}
                    className="mt-6 btn btn-primary"
                  >
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <form className="space-y-6" onSubmit={handleSendEmail}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={contactForm.name}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white transition-all px-4 py-2 border"
                        placeholder="Votre nom"
                        required
                      />
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                    >
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleInputChange}
                        className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white transition-all px-4 py-2 border"
                        placeholder="votre@email.com"
                        required
                      />
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sujet</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={contactForm.subject}
                      onChange={handleInputChange}
                      className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white transition-all px-4 py-2 border"
                      placeholder="Sujet de votre message"
                      required
                    />
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={contactForm.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white transition-all px-4 py-2 border"
                      placeholder="Votre message"
                      required
                    ></textarea>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="text-right"
                  >
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={formStatus.isSubmitting}
                    >
                      {formStatus.isSubmitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Envoi en cours...
                        </span>
                      ) : 'Envoyer'}
                    </button>
                  </motion.div>
                  
                  {formStatus.isError && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-md"
                    >
                      {formStatus.message || "Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer plus tard."}
                    </motion.div>
                  )}
                </form>
              )}
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
                <div className="w-12 h-12 bg-primary-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Email</h3>
                <p className="text-gray-600 dark:text-gray-400">benbecker102@gmail.com</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
                <div className="w-12 h-12 bg-primary-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Téléphone</h3>
                <p className="text-gray-600 dark:text-gray-400">+243 813440055</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg text-center">
                <div className="w-12 h-12 bg-primary-light/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Localisation</h3>
                <p className="text-gray-600 dark:text-gray-400">Kinshasa, RDC</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section bg-gray-50 dark:bg-gray-800">
        <div className="container-custom px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={staggerContainer}
          >
            <motion.div 
              variants={fadeIn}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Témoignages</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                Découvrez ce que mes clients pensent de mon travail et de ma collaboration avec eux.
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {[
                {
                  name: 'Alexandre Dubois',
                  role: 'CTO, TechVision Solutions',
                  content: 'Beni a considérablement amélioré notre plateforme web. Son expertise en React et ses compétences en animations ont transformé l\'expérience utilisateur de notre application.',
                },
                {
                  name: 'Laura Mercier',
                  role: 'Directrice Marketing, DataInnovate',
                  content: 'Collaboration exceptionnelle ! Beni comprend parfaitement nos besoins business et les traduit en solutions techniques élégantes. Toujours dans les délais et professionnel.',
                },
                {
                  name: 'Thomas Leroy',
                  role: 'Fondateur, StartupFlow',
                  content: 'Grâce aux compétences de Beni, notre application a gagné en fluidité et en ergonomie. Nos utilisateurs adorent la nouvelle interface et cela se reflète dans nos taux de conversion.',
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md"
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-primary-light/30 rounded-full flex items-center justify-center mr-4">
                      <span className="text-primary font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold dark:text-white">{testimonial.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.content}"</p>
                  <div className="mt-4 flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8"
            >
              <h3 className="text-2xl font-bold mb-6 text-center dark:text-white">Laissez votre témoignage</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <label htmlFor="testimonial-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nom</label>
                    <input
                      type="text"
                      id="testimonial-name"
                      className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white transition-all px-4 py-2 border"
                      placeholder="Votre nom"
                    />
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                  >
                    <label htmlFor="testimonial-role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Entreprise / Rôle</label>
                    <input
                      type="text"
                      id="testimonial-role"
                      className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white transition-all px-4 py-2 border"
                      placeholder="Votre entreprise et rôle"
                    />
                  </motion.div>
                </div>
                
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <label htmlFor="testimonial-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Témoignage</label>
                  <textarea
                    id="testimonial-message"
                    rows={4}
                    className="w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 dark:bg-gray-700 dark:text-white transition-all px-4 py-2 border"
                    placeholder="Partagez votre expérience..."
                  ></textarea>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-center"
                >
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Envoyer mon témoignage
                  </button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer Section with Social Links */}
      
    </div>
  );
};

export default HomePage; 