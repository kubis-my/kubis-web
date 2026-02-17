import SignUpContainer from '@/root/components/pages/sign-up/sign-up-container';
import { Card } from '@repo/shadcn-ui/components/card';

export default function SignUpPage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <div className="flex flex-col gap-6">
                    <Card className="overflow-hidden p-0">
                        <SignUpContainer />
                    </Card>
                </div>
            </div>
        </div>
    );
}
