'use client'
import { Box, Loader } from "lucide-react"
import Button from "./ui/Button";
import { useAuth } from "./AuthContext";
import Link from "next/link";


const Navbar = () => {
    const { isSignedIn, username, signIn, signOut, loading } = useAuth();

    const handleAuthClick = async () => {
        if (isSignedIn) {
            try {
                await signOut();
            } catch (error) {
                console.error("Puter sign out failed:", error);
            }
            return;
        }
        try {
            await signIn();
        } catch (error) {
            console.error("Puter sign in failed:", error);
        }
        return;
    }



    return (
        <header className="navbar">
            <nav className="inner">
                <div className="left">
                    <div className="brand">
                        <Box className="logo" />
                        <span className="name">
                            Roomify
                        </span>
                    </div>
                    <ul className="links">
                        <Link href="#">Product</Link>
                        <Link href="#">Pricing</Link>
                        <Link href="#">Community</Link>
                        <Link href="#">Enterprise</Link>
                    </ul>
                </div>
                <div className="actions">
                    {loading ? (
                        <Button size="sm" disabled>
                            <Loader className="animate-spin h-4 w-4" />
                        </Button>
                    ) : (
                        <>
                            {isSignedIn ? (
                                <>
                                    <span className="greeting">{username ? `Hi, ${username}` : "Signed In"}</span>
                                    <Button size="sm" onClick={handleAuthClick}>Log Out</Button>
                                </>
                            ) : (
                                <>
                                    <Button size="sm" onClick={handleAuthClick} variant="ghost">Log In</Button>
                                    <Link href="#upload" className="cta">Get Started</Link>
                                </>
                            )}
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar