import React from "react";
import { motion } from "framer-motion";

const EditContentArea = ({ 
  isEditing, 
  editedContent, 
  setEditedContent, 
  handleCancel, 
  handleContentSave 
}) => {
    if (!isEditing) return null;

    return (
      <div className="fixed inset-0 lg:static lg:inset-auto z-50 flex items-end lg:items-start">
        {/* Backdrop overlay for mobile */}
        <motion.div 
          className="fixed inset-0 bg-black lg:hidden"
          onClick={handleCancel}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        ></motion.div>
        
        {/* Content container */}
        <motion.div 
          className="relative bg-white w-full h-3/4 lg:h-auto rounded-t-xl lg:rounded-lg shadow-lg lg:shadow-none z-10 lg:z-0"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Handle for mobile bottom sheet */}
          <div className="w-16 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-2 lg:hidden"></div>
          
          <div className="p-4">
            {/* Done and Cancel Links */}
            <div className="flex justify-between items-center mb-2">
              <span
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 cursor-pointer text-sm"
              >
                Cancel
              </span>
              <span
                onClick={handleContentSave}
                className="text-gray-500 hover:text-gray-700 cursor-pointer text-sm"
              >
                Done
              </span>
            </div>

            {/* Editable Input Field - using textarea instead of input for better alignment control */}
            <textarea
                id="post-content"
                name="content"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                maxLength={100}
                className="w-full max-h-96 rounded-lg p-2 focus:outline-none align-top resize-none"
                placeholder="Edit your post content..."
                autoFocus
                style={{ verticalAlign: "top" }}
            ></textarea>
          </div>
        </motion.div>
      </div>
    );
};

export default EditContentArea;