'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { HiChat, HiCube, HiCog, HiHome } from 'react-icons/hi';
import { useHomeContent } from '@/hooks';

const iconMap = {
  1: HiChat,
  2: HiCube,
  3: HiCog,
  4: HiHome,
};

export function Process() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { content, loading } = useHomeContent();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  if (loading || !content) return null;

  return (
    <section className="py-0 bg-[#0D0D0D] text-white relative overflow-hidden hidden" ref={ref}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A14A' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-2"
        >
          <span className="text-[#C9A14A] font-semibold tracking-wider uppercase text-sm">
            Notre Processus
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mt-0 mb-2 leading-tight">
            De l'idée à la <span className="text-[#C9A14A]">réalisation</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Un accompagnement personnalisé à chaque étape pour transformer 
            vos rêves en réalité avec excellence et précision.
          </p>
        </motion.div>

        {/* Process Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {content.process.map((step: any, index: number) => {
            const IconComponent = iconMap[step.step as keyof typeof iconMap] || HiCog;
            return (
              <motion.div
                key={step.step}
                variants={itemVariants}
                className="relative group"
              >
                {/* Connection Line */}
                {index < content.process.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-[#C9A14A] to-transparent z-0" />
                )}

                <div className="relative z-10 text-center">
                  {/* Step Number */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: index * 0.2 + 0.5, duration: 0.5 }}
                    className="w-16 h-16 bg-gradient-to-r from-[#C9A14A] to-[#D4B55A] rounded-full flex items-center justify-center mx-auto mb-2 text-black font-bold text-xl"
                  >
                    {step.step}
                  </motion.div>

                  {/* Icon */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.2 + 0.6, duration: 0.5 }}
                    className="mb-2"
                  >
                    <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-[#C9A14A]/20 transition-colors duration-300">
                      <IconComponent className="w-10 h-10 text-[#C9A14A]" />
                    </div>
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.2 + 0.7, duration: 0.5 }}
                  >
                    <h3 className="text-2xl font-serif mb-2 group-hover:text-[#C9A14A] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-300 mb-2 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-center mt-0"
        >
          <p className="text-lg text-gray-300 mb-2 max-w-2xl mx-auto">
            Prêt à commencer votre projet ? Contactez-nous pour une consultation gratuite 
            et découvrez comment nous pouvons transformer vos espaces.
          </p>
          <button className="bg-gradient-to-r from-[#C9A14A] to-[#D4B55A] text-black px-8 py-0 rounded-full font-semibold text-lg hover:shadow-2xl hover:shadow-[#C9A14A]/30 transition-all duration-300 transform hover:scale-105">
            Commencer mon projet
          </button>
        </motion.div>
      </div>
    </section>
  );
}
