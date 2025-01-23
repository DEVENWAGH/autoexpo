import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] p-6 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Image
            src="AutoExplorer.svg"
            alt="LogoImage"
            width={60}
            height={60}
            className="rounded-full mb-4"
          />
          <p className="text-gray-400">Let&apos;s connect with us social</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 text-white">Company</h3>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/support">Support</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms">Terms and Conditions</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 text-white">Get in Touch</h3>
          <ul className="space-y-2 text-gray-400">
            <li>+91 7866406077</li>
            <li>+91 7775883925</li>
            <li>autoexplorer@gmail.com</li>
            <li>Panvel Navi Mumbai Maharashtra(MMR), 410206</li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4 text-white">Stay Updated</h3>
          <div className="flex gap-2">
            <Input type="email" placeholder="Email" className="bg-gray-900 text-white" />
            <Button variant="secondary">Subscribe</Button>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-400 mt-8 pt-8 border-t border-gray-800">
        <p>Copyright © 2024 AutoExplorer Pvt.Ltd.</p>
        <p>All rights reserved.</p>
      </div>
    </footer>
  );
}
