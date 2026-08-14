import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";

const MainLayout = () => {
    return (
        <div className="flex h-screen flex-col overflow-hidden bg-zinc-900 text-[#F5F5F7]">
            <style>{`
                * {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255,255,255,0.18) transparent;
                }
                *::-webkit-scrollbar {
                    width: 10px;
                    height: 10px;
                }
                *::-webkit-scrollbar-track {
                    background: transparent;
                }
                *::-webkit-scrollbar-thumb {
                    background-color: rgba(255,255,255,0.14);
                    border-radius: 999px;
                    border: 2px solid transparent;
                    background-clip: padding-box;
                }
                *::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(255,255,255,0.24);
                    background-clip: padding-box;
                }
            `}</style>

            <Navbar />

            <div className="relative flex-1 overflow-hidden">
                {/* Global ambient glow — every page gets this automatically now */}
                <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[700px] -translate-y-1/3 rounded-full bg-[#0A84FF] opacity-[0.1] blur-[140px]" />

                <main className="relative h-full overflow-y-auto">
                    <Outlet />
                    {/* <Footer/> */}
                </main>
            </div>

            
        </div>
    );
};

export default MainLayout;