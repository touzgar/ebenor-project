import { toast as sonnerToast } from 'sonner';
import { motion } from 'framer-motion';

interface ToastProduct {
  name: string;
  imageUrl?: string;
}

export const toast = {
  success: (message: string) => {
    sonnerToast.success(message, {
      duration: 3000,
      className: 'bg-white border-l-4 border-green-500',
    });
  },

  error: (message: string) => {
    sonnerToast.error(message, {
      duration: 4000,
      className: 'bg-white border-l-4 border-red-500',
    });
  },

  productDeleted: (product: ToastProduct) => {
    sonnerToast.custom(
      (t) => (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", damping: 20 }}
          className="bg-white rounded-xl shadow-2xl border border-neutral-200 p-4 min-w-[320px]"
        >
          <div className="flex items-start gap-3">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
            >
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-neutral-900 mb-1">Produit supprimé</p>
              <p className="text-sm text-neutral-600 truncate">
                <span className="font-medium">"{product.name}"</span> a été supprimé avec succès
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => sonnerToast.dismiss(t)}
              className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      ),
      { duration: 3000 }
    );
  },

  productUpdated: (product: ToastProduct) => {
    sonnerToast.custom(
      (t) => (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: "spring", damping: 20 }}
          className="bg-gradient-to-r from-[#C9A14A]/10 to-white rounded-xl shadow-2xl border-2 border-[#C9A14A]/30 p-4 min-w-[320px]"
        >
          <div className="flex items-start gap-3">
            {/* Icon with Gold Theme */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
              transition={{ type: "spring", delay: 0.1 }}
              className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#C9A14A] to-[#D4B55A] rounded-full flex items-center justify-center shadow-lg"
            >
              <svg
                className="w-5 h-5 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>

            {/* Thumbnail if available */}
            {product.imageUrl && (
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ring-2 ring-[#C9A14A]/30">
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-neutral-900 mb-1">✨ Mise à jour réussie</p>
              <p className="text-sm text-neutral-700">
                <span className="font-medium text-[#C9A14A]">"{product.name}"</span>
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">Modifications enregistrées</p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => sonnerToast.dismiss(t)}
              className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      ),
      { duration: 4000 }
    );
  },

  productCreated: (product: ToastProduct) => {
    sonnerToast.custom(
      (t) => (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 15 }}
          className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-2xl border-2 border-green-200 p-4 min-w-[320px]"
        >
          <div className="flex items-start gap-3">
            {/* Animated Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </motion.div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-green-900 mb-1">🎉 Produit créé</p>
              <p className="text-sm text-green-700">
                <span className="font-medium">"{product.name}"</span>
              </p>
              <p className="text-xs text-green-600 mt-0.5">Nouveau produit ajouté au catalogue</p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => sonnerToast.dismiss(t)}
              className="flex-shrink-0 text-green-400 hover:text-green-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      ),
      { duration: 4000 }
    );
  },
};
