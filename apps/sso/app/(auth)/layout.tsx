import SessionGuard from '@/root/components/guards/session-guard';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return <SessionGuard>{children}</SessionGuard>;
}
