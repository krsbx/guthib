import { createRoot } from 'react-dom/client';
import { Provider } from '@/components/ui/provider';
import { Routes } from '@generouted/react-router';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

createRoot(root).render(
  <Provider defaultTheme='light' enableSystem={false}>
    <Routes />
  </Provider>
);
