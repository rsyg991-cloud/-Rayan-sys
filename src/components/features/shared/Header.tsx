import { ThemeToggle } from "./ThemeToggle";

export function Header() {
    return (
        <header className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-primary">حياتي</h1>
            <ThemeToggle />
        </header>
    );
}
