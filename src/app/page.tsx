import Navbar from "./ui/Navbar";
import ChatWindow from "./ui/ChatWindow";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center p-5">
      <Navbar />
      <ChatWindow />
      
    </div>
  );
}
