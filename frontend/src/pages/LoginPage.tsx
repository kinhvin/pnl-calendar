import { Auth } from '../components/auth';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function LoginPage() {
  return (
    <div className="relative flex min-h-screen min-w-full items-center justify-center bg-background">
      {/* Theme toggle in top-right corner */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      
      <Auth />
    </div>
  );
}