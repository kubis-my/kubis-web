import SignInContainer from '@/root/components/pages/sign-in/sign-in-container';
import { Card } from '@repo/shadcn-ui/components/card';

export default function LoginPage() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <div className="flex flex-col gap-6">
                    <Card className="overflow-hidden p-0">
                        <SignInContainer />
                    </Card>
                    {/* //TODO: Add actual Terms of Service and Privacy Policy links */}
                    {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                        By clicking continue, you agree to our <a href="#">
                            Terms of Service
                        </a>{' '}
                        and <a href="#">Privacy Policy</a>.
                    </div> */}
                </div>
            </div>
        </div>
    );
}
