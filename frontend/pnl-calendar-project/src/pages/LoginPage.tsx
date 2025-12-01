import { Auth } from '../components/Auth';

export function LoginPage() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundColor: '#f9fafb',
      }}
    >
      <Auth />
    </div>
  );
}