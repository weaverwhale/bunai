import { createRoot } from 'react-dom/client';
import { ChatInterface } from './components/ChatInterface';
import './styles.css';

const root = createRoot(document.getElementById('root')!);
root.render(<ChatInterface />);
