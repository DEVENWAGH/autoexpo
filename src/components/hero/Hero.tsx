import Image from "next/image";
import { Bruno_Ace, Squada_One } from "next/font/google";

const brunoFont = Bruno_Ace({
  subsets: ["latin"],
  weight: "400",
});
const squadaFont = Squada_One({
  subsets: ["latin"],
  weight: "400",
});

export default function Hero() {
  return (
    <section className="w-full max-w-[1440px] h-[860px] mx-auto mt-8 bg-[#D0BCFF] rounded-[50px] border border-black relative">
      <div className="absolute right-0 top-0 w-[1009px] h-[621px]">
        <Image
          src="./Audi.svg"
          alt="Audi"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div>
        <div>
          
        </div>
      </div>
      <div className="absolute left-8 top-[621px] w-[616px]">
        <h1
          className={`${brunoFont.className} mt-6 text-5xl font-bruno text-black leading-[120%]`}
        >
          Explore Your Dream Ride, Before You Drive!
        </h1>
      </div>
      <div className="absolute left-[650px] ml-6 top-[633px] w-[634px]">
        <p
          className={`${squadaFont.className} font-squada text-4xl leading-[150%] text-[#4F378A]`}
        >
          Your One-Stop Destination for All Things Automotive – Discover the
          Best Cars and Bikes Before You Hit the Road!
        </p>
      </div>
    </section>
  );
}
