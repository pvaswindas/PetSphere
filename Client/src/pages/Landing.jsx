import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import TrustBadges from '../components/landing/trust/TrustBadges';
import NearbyServices from '../components/landing/services/NearbyServices';
import AuthCTA from '../components/landing/auth/AuthCTA';
import CallToAction from '../components/landing/cta/CallToAction';
import Footer from '../components/landing/footer/Footer';
import Hero from '../components/landing/hero/Hero';
import Navbar from '../components/landing/navigation/Navbar';
import Features from '../components/landing/features/Features';

// Animation variants for scroll-triggered sections
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

// Scroll animation hook
const ScrollAnimationSection = ({ children, className, variants = fadeInUp, rootMargin = "-100px 0px" }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: rootMargin,
    threshold: 0.1
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

function Landing() {
  // Initial animation for navbar and hero
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
        duration: 0.3
      }
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={navbarVariants}
      >
        <Navbar />
      </motion.div>
      
      <main>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={heroVariants}
        >
          <Hero />
        </motion.div>
        
        <ScrollAnimationSection>
          <Features />
        </ScrollAnimationSection>
        
        <ScrollAnimationSection 
          variants={staggerContainer}
          className="overflow-hidden"
        >
          <TrustBadges />
        </ScrollAnimationSection>
        
        <ScrollAnimationSection 
          rootMargin="-50px 0px" 
          className="overflow-hidden"
        >
          <NearbyServices />
        </ScrollAnimationSection>
        
        <ScrollAnimationSection 
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: { duration: 0.7, ease: "easeOut" }
            }
          }}
        >
          <AuthCTA />
        </ScrollAnimationSection>
        
        <ScrollAnimationSection 
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { 
                duration: 0.6, 
                ease: "easeOut",
                type: "spring",
                stiffness: 100
              }
            }
          }}
        >
          <CallToAction />
        </ScrollAnimationSection>
      </main>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <Footer />
      </motion.div>
    </div>
  );
}

export default Landing;