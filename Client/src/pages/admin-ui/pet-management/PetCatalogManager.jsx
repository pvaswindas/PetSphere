import React, { useState } from "react";
import AdminLayout from "../../../components/admin/AdminLayout";
import PetCatalogContent from "../../../components/admin/manage-pets/PetCatalogContent";


const PetCatalogManager = () => {
    const activeIcon = "manage-pet-type"
    const [buttonText, setButtonText] = useState("Breeds")
    const [handleButton, setHandleButton] = useState(null)
    
    return (
        <AdminLayout
            activeIcon={activeIcon}
            pageTitle={"Manage Pets"}
            pageDescription={"Organize pet types and breeds for accurate listings."}
            actionButton={buttonText}
            buttonAction={handleButton}
        >
            <PetCatalogContent setButtonText={setButtonText} setHandleButton={setHandleButton} />
        </AdminLayout>
    )
}

export default PetCatalogManager