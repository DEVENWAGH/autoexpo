import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full max-w-[1440px] mx-auto relative mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-4 gap-8 py-12">
          <div>
            <Image 
              src="/AutoExplorer.svg" 
              alt="Auto Explorer"
              width={134}
              height={127}
              className="object-contain"
            />
            <p className="text-white font-abel text-base mt-4">
              Lets connect with our socials
            </p>
          </div>
          {/* Add more footer content here */}
        </div>
      </div>
    </footer>
  );
}
