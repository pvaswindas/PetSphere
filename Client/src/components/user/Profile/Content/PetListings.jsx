import React from "react";
import post1 from "../../../../assets/profile-testing/alicja-koczaska-FCuJ_bVjrrs-unsplash.jpg";
import post2 from "../../../../assets/profile-testing/bao-menglong-usTb7ZMa6QI-unsplash.jpg";
import post3 from "../../../../assets/profile-testing/cat-bw-gayatri-malhotra-38iYfX4Rk8A-unsplash.jpg";
import post4 from "../../../../assets/profile-testing/enzo-lo-presti-VzbZZsIxRR0-unsplash.jpg";
import post5 from "../../../../assets/profile-testing/macaw-giovanna-gomes-5s_n82D4yAo-unsplash.jpg";
import post6 from "../../../../assets/profile-testing/sam-h-Ui78vxO7pw8-unsplash.jpg";

const posts = [
    { image: post1, status: "available" },
    { image: post2, status: "sold" },
    { image: post3, status: "not_available" },
    { image: post4, status: "adoption" },
    { image: post5, status: "adopted" },
    { image: post6, status: "available" },
];

const getStatusClasses = (status) => {
    switch (status) {
        case "available":
            return "bg-green-500 text-white";
        case "sold":
            return "bg-red-500 text-white";
        case "not_available":
            return "bg-yellow-500 text-white";
        case "adoption":
            return "bg-blue-500 text-white";
        case "adopted":
            return "bg-blue-900 text-white";
        default:
            return "bg-gray-500 text-white";
    }
};

const PetListings = () => {
    return (
        <div className="lg:mx-4">
            {posts.length === 0 ? (
                <div className="w-full h-64 flex items-center justify-center rounded-lg px-5">
                    <p className="text-gray-500">Post your first pet for sale!</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-0.5 lg:gap-3">
                    {posts.map((post, index) => (
                        <div key={index} className="relative w-full aspect-square">
                            {/* Status Indicator Badge */}
                            <div
                                className={`absolute top-0 left-0 text-[0.5rem] lg:text-xs font-bold rounded-br-lg  truncate max-w-[75%] sm:max-w-[60%] px-2 py-1 ${getStatusClasses(post.status)}`}
                            >
                                {post.status === "available"
                                    ? "Available"
                                    : post.status === "sold"
                                    ? "Sold"
                                    : post.status === "not_available"
                                    ? "Not Available"
                                    : post.status === "adoption"
                                    ? "For Adoption"
                                    : "Adopted"}
                            </div>
                            <img
                                src={post.image}
                                alt={`Post ${index + 1}`}
                                className="w-full h-full lg:rounded-lg object-cover"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PetListings;
