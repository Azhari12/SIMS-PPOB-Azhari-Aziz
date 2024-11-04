import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import logo from "@/assets/Logo.png";
import { cn } from "@/lib/utils";

const Navbar = () => {
	const path = useLocation();
	const urlPath = path.pathname.split("/")[1];

	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [navbarHeight, setNavbarHeight] = useState(70);

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
		if (!isMenuOpen) {
			setNavbarHeight(250);
		} else {
			setNavbarHeight(70);
		}
	};
	return (
		<nav
			style={{ height: navbarHeight }}
			className="bg-white py-5 border border-b transition-all"
		>
			<div className="container mx-auto px-10 xl:px-32 flex justify-between items-center transition-all">
				<Link to="/" className=" text-xl font-bold flex gap-2 items-center">
					<img src={logo} alt="logo" className="object-contain w-[1.5rem]" />
					<h4 className="font-bold">SIMS PPOB</h4>
				</Link>
				<div className="hidden sm:block">
					<ul className="flex space-x-16 font-semibold">
						<li>
							<Link
								to="/top-up"
								className={cn(
									"hover:text-primary",
									urlPath === "top-up" && "text-primary"
								)}
							>
								Top Up
							</Link>
						</li>
						<li>
							<Link
								to="/transaction"
								className={cn(
									"hover:text-primary",
									urlPath === "transaction" && "text-primary"
								)}
							>
								Transaction
							</Link>
						</li>
						<li>
							<Link
								to="/akun"
								className={cn(
									"hover:text-primary",
									urlPath === "akun" && "text-primary"
								)}
							>
								Akun
							</Link>
						</li>
					</ul>
				</div>
				<div className="-mr-2 flex md:hidden">
					<button
						onClick={toggleMenu}
						type="button"
						className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
						aria-controls="mobile-menu"
						aria-expanded="false"
					>
						<span className="sr-only">Open main menu</span>
						{isMenuOpen ? (
							<X className="block h-6 w-6" aria-hidden="true" />
						) : (
							<Menu className="block h-6 w-6" aria-hidden="true" />
						)}
					</button>
				</div>
			</div>
			{isMenuOpen && (
				<div className="md:hidden" id="mobile-menu">
					<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
						<Link
							onClick={toggleMenu}
							to="/"
							className={cn(
								"hover:bg-primary-foreground block px-3 py-2 rounded-md text-base font-medium",
								!urlPath ? "text-primary" : "text-gray-800"
							)}
						>
							Home
						</Link>
						<Link
							onClick={toggleMenu}
							to="/top-up"
							className={cn(
								"hover:bg-primary-foreground block px-3 py-2 rounded-md text-base font-medium",
								urlPath === "top-up" ? "text-primary" : "text-gray-800"
							)}
						>
							Topup
						</Link>
						<Link
							onClick={toggleMenu}
							to="/transaction"
							className={cn(
								"hover:bg-primary-foreground block px-3 py-2 rounded-md text-base font-medium",
								urlPath === "transaction" ? "text-primary" : "text-gray-800"
							)}
						>
							Transaction
						</Link>
						<Link
							onClick={toggleMenu}
							to="/akun"
							className={cn(
								"hover:bg-primary-foreground block px-3 py-2 rounded-md text-base font-medium",
								urlPath === "akun" ? "text-primary" : "text-gray-800"
							)}
						>
							Akun
						</Link>
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
