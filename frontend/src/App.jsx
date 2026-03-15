import { Toaster } from 'sonner';
import { UserExplorerPage } from './pages/UserExplorerPage';

export default function App() {
  return (
    <>
      <UserExplorerPage />
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
