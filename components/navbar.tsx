import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
    return (
        <nav className="border-b">
            <div className="container mx-auto flex items-center justify-between h-16 px-4">
                <h1 className="text-xl font-bold">
                    Utaite Birthday Admin
                </h1>
                <ThemeToggle />
            </div>
        </nav>
    )
}