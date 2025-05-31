import ChatInterface from "@/components/ChatInterface";
import { themeClasses, getThemeVariant } from "@/utils/theme";

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const variant = getThemeVariant();

  return (
    <div
      className={`fixed right-0 top-0 h-full w-96 shadow-lg z-50 flex flex-col ${themeClasses.panel[variant]}`}
    >
      <div className={`flex justify-between items-center p-4 border-b ${themeClasses.panel[variant]}`}>
        <h2 className="text-lg font-bold">AI Assistant</h2>
        <button onClick={onClose} className="text-xl">×</button>
      </div>
      <ChatInterface />
    </div>
  );
};

export default SidePanel;
