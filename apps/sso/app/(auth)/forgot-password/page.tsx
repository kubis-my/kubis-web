import ForgotPasswordContainer from '@/root/components/pages/forgot-password/forgot-password-container';
import { Card } from '@repo/shadcn-ui/components/card';

export default function ForgotPasswordPage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <div className="flex flex-col gap-6">
                    <Card className="overflow-hidden p-0">
                        <ForgotPasswordContainer />
                    </Card>
                </div>
            </div>
        </div>
    );
}
