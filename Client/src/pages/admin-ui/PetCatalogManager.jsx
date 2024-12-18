import React, { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import PetCatalogContent from "../../components/admin/content/PetCatalogContent";


const PetCatalogManager = () => {
    const [activeIcon, setActiveIcon] = useState("manage-pet-type")
    
    return (
        <AdminLayout activeIcon={activeIcon} setActiveIcon={setActiveIcon}>
            <PetCatalogContent />
        </AdminLayout>
    )
}

export default PetCatalogManager