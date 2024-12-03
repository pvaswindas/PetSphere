import React from "react";
import post1 from "../../../../assets/profile-testing/alicja-koczaska-FCuJ_bVjrrs-unsplash.jpg";
import post2 from "../../../../assets/profile-testing/bao-menglong-usTb7ZMa6QI-unsplash.jpg";
import post3 from "../../../../assets/profile-testing/cat-bw-gayatri-malhotra-38iYfX4Rk8A-unsplash.jpg";
import post4 from "../../../../assets/profile-testing/enzo-lo-presti-VzbZZsIxRR0-unsplash.jpg";
import post5 from "../../../../assets/profile-testing/macaw-giovanna-gomes-5s_n82D4yAo-unsplash.jpg";
import post6 from "../../../../assets/profile-testing/sam-h-Ui78vxO7pw8-unsplash.jpg";

const posts = [post1, post2, post3, post4, post5, post6];

const PawStories = () => {
    return (
        <div className="lg:mx-4">
            {posts.length === 0 ? (
                <div className="w-full h-64 flex items-center justify-center rounded-lg px-5">
                    <p className="text-gray-500">No posts yet. Share your first story!</p>
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-0.5 lg:gap-3">
                    {posts.map((post, index) => (
                        <div key={index} className="relative w-full aspect-square">
                            <img
                                src={post}
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


export default PawStories
