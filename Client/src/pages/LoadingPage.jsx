import { motion } from "framer-motion";

const LoadingPage = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-whiteOpacity02">
            <div className="text-center">
                <motion.h1
                    className="text-xl lg:text-3xl font-semibold bg-ad-preview-gradient bg-clip-text text-transparent flex"
                    animate={{ opacity: [1, 0.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                >
                    Loading
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                    >.</motion.span>
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                    >.</motion.span>
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    >.</motion.span>
                </motion.h1>
            </div>
        </div>
    );
};

export default LoadingPage;
