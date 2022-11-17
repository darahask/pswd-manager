import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <nav className="bg-black">
        <div className="mx-auto lg:w-2/3 sm:w-1/3">
          <div className="flex h-16 items-center justify-between">
            <div className="flex">
              <div
                className="bg-zinc-800 text-white px-3 py-2 rounded-md text-md font-medium"
                aria-current="page"
              >
                Password Manager
              </div>
              <Link
                href="/"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 ml-1 rounded-md text-md font-medium"
              >
                Add
              </Link>
              <Link
                href="/show"
                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-medium"
              >
                Show
              </Link>
            </div>
            <div>
              <ConnectButton
                showBalance={{
                  smallScreen: false,
                  largeScreen: true,
                }}
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
