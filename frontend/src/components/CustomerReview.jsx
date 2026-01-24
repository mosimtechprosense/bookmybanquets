import { useState } from "react";
import { aarav, aditya, manish, priya, rajiv, rohan } from "../assets/index.js";
import "../style/customerReview.css";

const CustomerReview = () => {
  const [paused, setPaused] = useState(false);

const reviewData = [
    {
      name: "Rohan Desai",
      img: rohan,
      description:
        "The food was really fine, the dining experience was enhanced by the seating arrangement in the hall. The starters were the star of the show, coffee was perfectly brewed and the main course has too many options.",
    },
    {
      name: "Aditya Malhotra",
      img: aditya,
      description:
        "The ambiance felt like a fairy tale, the lighting, the flowers, this place is instagramable. The pictures turned out so lovely, we really had a great time here.",
    },
    {
      name: "Manish Choudhary",
      img: manish,
      description:
        "This was a wholesome experience — the vibe, the food, and the ambiance of this place were unforgettable. It felt like attending a dream wedding, the wedding and the decor were elegant, the venue made the wedding a hit.",
    },
    {
      name: "Aarav Mehta",
      img: aarav,
      description:
        "The best thing about this place is that it gives you options to customize the decor. We had our wedding in the venue, and we got the decor, floral arrangement, and lighting as per the theme. The staff was cooperative and the arrangements were perfect, they brought so many colors to this place. We had a good time.",
    },
    {
      name: "Rajiv Kapoor",
      img: rajiv,
      description:
        "The guests at our wedding really enjoyed the vibes, dining, dancing, and hosting experiences. They appreciated the decor and the arrangements, they had a really good time. The staff was constantly checking and made sure that the guests were having fun and enjoying.",
    },
    {
      name: "Priya Sharma",
      img: priya,
      description:
        "The staff was really professional and they made the wedding experience really smooth. The bride and groom experienced a really special wedding event. The guests were welcomed with warmth and love. They also enjoyed the servings by the staff, the buffet system was so chic.",
    },
  ];

  const infiniteReviews = [...reviewData, ...reviewData, ...reviewData];

  return (
    <div className="relative flex flex-col items-center py-10 bg-gray-50 overflow-hidden">
      <h3 className="text-2xl sm:text-3xl font-semibold mb-8 text-gray-800 w-full text-center px-4">
        What Our Customers Are Saying
      </h3>

      <div className="w-full overflow-hidden">
        <div
          className="flex animate-scroll gap-6 px-6"
          style={{
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {infiniteReviews.map((data, i) => (
            <div
              key={i}
              className="flex flex-col justify-between flex-shrink-0 bg-white shadow-even rounded-2xl m-2 p-5 w-[90%] sm:w-[45%] lg:w-[30%] text-center cursor-pointer"
              style={{ minHeight: "320px" }}
              onMouseEnter={() => setPaused(true)}     // 🖥️ hover pause
              onMouseLeave={() => setPaused(false)}    // 🖥️ resume
              onTouchStart={() => setPaused(true)}     // 📱 touch & hold pause
              onTouchEnd={() => setPaused(false)}      // 📱 release resume
            >
              <p className="text-gray-700 italic mb-4">
                "{data.description}"
              </p>

              <div className="mt-auto flex flex-col items-center">
                <img
                  src={data.img}
                  alt={data.name}
                  className="w-14 h-14 rounded-full object-cover border border-gray-300 mb-2"
                />
                <h4 className="text-lg font-medium text-gray-900">
                  {data.name}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerReview;
