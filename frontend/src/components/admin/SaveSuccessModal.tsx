'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SaveSuccessModalProps {
  isOpen: boolean;
  isSuccess: boolean;
  productName: string;
  productImage?: string;
  errorMessage?: string;
  onClose: () => void;
}

export function SaveSuccessModal({
  isOpen,
  isSuccess,
  productName,
  productImage,
  errorMessage,
  onClose
}: SaveSuccessModalProps) {
  const router = useRouter();

  const handleContinue = () => {
    onClose();
  };

  const handleGoToList = () => {
    onClose();
    router.push('/admin/products');
  };

  if (!isSuccess) {
    // ERROR MODAL
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ backdropFilter: "blur(0px)" }}
              animate={{ backdropFilter: "blur(16px)" }}
              exit={{ backdropFilter: "blur(0px)" }}
              className="absolute inset-0 bg-black/70"
            />

            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-red-200"
            >
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-6 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="inline-block mb-3"
                >
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </motion.div>
                <h2 className="text-2xl font-bold text-white">Échec de Modification</h2>
              </div>

              <div className="p-6">
                <div className="p-4 bg-red-50 rounded-xl border border-red-200 mb-4">
                  <p className="text-red-600">{errorMessage || 'Erreur inconnue'}</p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
                >
                  Réessayer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // SUCCESS MODAL - Style innovant
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ perspective: "1000px" }}
        >
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(20px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            className="absolute inset-0 bg-gradient-to-br from-black/90 via-neutral-900/95 to-black/90"
          />

          <motion.div
            initial={{ scale: 0.5, rotateX: 45, y: 100, opacity: 0 }}
            animate={{ scale: 1, rotateX: 0, y: 0, opacity: 1 }}
            exit={{ scale: 0.5, rotateX: -45, y: -100, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.6
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md"
            style={{
              transformStyle: "preserve-3d",
              transform: "translateZ(0)"
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -inset-8 bg-gradient-to-r from-[#C9A14A]/30 via-[#D4B55A]/40 to-[#C9A14A]/30 rounded-full blur-3xl"
            />

            <div className="relative bg-gradient-to-br from-neutral-900 via-black to-neutral-900 rounded-3xl overflow-hidden border-2 border-[#C9A14A]/40 shadow-2xl">
              
              <div className="relative h-2 bg-gradient-to-r from-[#C9A14A] via-[#D4B55A] to-[#C9A14A] overflow-hidden">
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 0.5
                  }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12"
                />
              </div>

              <div className="relative px-8 py-10">
                
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{
                    scale: 1,
                    rotate: 0,
                    y: [0, -10, 0]
                  }}
                  transition={{
                    scale: { type: "spring", damping: 12, stiffness: 200, delay: 0.1 },
                    rotate: { type: "spring", damping: 12, stiffness: 200, delay: 0.1 },
                    y: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }
                  }}
                  className="relative mx-auto w-28 h-28 mb-6"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-dashed border-[#C9A14A]/30 rounded-full"
                  />
                  
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 border-2 border-dotted border-[#D4B55A]/20 rounded-full"
                  />

                  <motion.div
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [0.4, 0.8, 0.4]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-[#C9A14A] rounded-full blur-2xl"
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-20 h-20 bg-gradient-to-br from-[#C9A14A] via-[#D4B55A] to-[#C9A14A] rounded-full shadow-2xl flex items-center justify-center border-4 border-black/50">
                      <motion.svg
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
                        className="w-10 h-10 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={3.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <motion.path d="M5 13l4 4L19 7" />
                      </motion.svg>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-center mb-6"
                >
                  <h3 className="text-4xl font-serif font-light text-white mb-3 relative inline-block">
                    <span className="relative z-10">Mise à Jour Réussie</span>
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 text-[#C9A14A] blur-sm"
                    >
                      Mise à Jour Réussie
                    </motion.div>
                  </h3>
                  
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "120px" }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="h-0.5 bg-gradient-to-r from-transparent via-[#C9A14A] to-transparent mx-auto"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="bg-gradient-to-r from-[#C9A14A]/10 via-[#D4B55A]/10 to-[#C9A14A]/10 rounded-2xl p-5 mb-6 border border-[#C9A14A]/20 backdrop-blur-sm"
                >
                  {productImage && (
                    <div className="flex justify-center mb-4">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden ring-2 ring-[#C9A14A]/50">
                        <Image
                          src={productImage}
                          alt={productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  <p className="text-center text-gray-300 text-base mb-1">Produit</p>
                  <p className="text-center text-[#C9A14A] font-semibold text-xl">"{productName}"</p>
                  <p className="text-center text-gray-400 text-sm mt-2">✓ Modifications enregistrées avec succès</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="space-y-3"
                >
                  <button
                    onClick={handleGoToList}
                    className="group relative w-full py-4 bg-gradient-to-r from-[#C9A14A] via-[#D4B55A] to-[#C9A14A] rounded-full overflow-hidden shadow-xl"
                  >
                    <motion.div
                      animate={{ x: ["0%", "100%", "0%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                    />
                    
                    <span className="relative z-10 flex items-center justify-center gap-3 text-black font-bold text-lg tracking-wide">
                      <span>Voir la liste</span>
                      <motion.svg
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </motion.svg>
                    </span>
                  </button>

                  <button
                    onClick={handleContinue}
                    className="w-full py-3 bg-white/5 backdrop-blur-sm text-white rounded-full font-semibold hover:bg-white/10 transition-all border border-white/10"
                  >
                    Continuer l'édition
                  </button>
                </motion.div>
              </div>

              <div className="h-1 bg-gradient-to-r from-transparent via-[#C9A14A]/50 to-transparent"></div>
            </div>

            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: [0, -100 - (i * 10)],
                  x: [0, (i % 2 === 0 ? 1 : -1) * (20 + i * 5)]
                }}
                transition={{
                  duration: 3 + (i * 0.2),
                  delay: 1 + (i * 0.1),
                  repeat: Infinity,
                  repeatDelay: 1
                }}
                className="absolute w-2 h-2 rounded-full bg-[#C9A14A]"
                style={{
                  left: `${10 + (i * 7)}%`,
                  bottom: "10%",
                  boxShadow: "0 0 10px rgba(201, 161, 74, 0.8)"
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
