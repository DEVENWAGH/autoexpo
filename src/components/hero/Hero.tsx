import Image from 'next/image';

export default function Hero() {
  return (
    <section className="w-full max-w-[1440px] h-[860px] mx-auto mt-8 bg-[#D0BCFF] rounded-[50px] border border-black relative">
      <div className="absolute left-8 top-[621px] w-[616px]">
        <h1 className="text-5xl font-bruno text-black leading-[120%]">
          Medium length hero headline goes here
        </h1>
      </div>
      <div className="absolute left-[650px] top-[633px] w-[634px]">
        <p className="font-squada text-3xl leading-[150%] text-[#4F378A]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.
        </p>
      </div>
      <div className="absolute right-0 top-0 w-[1009px] h-[621px]">
        <Image
          src="/Audi.svg"
          alt="Audi"
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}
