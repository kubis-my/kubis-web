import ComingSoon from '@repo/shadcn-ui/custom-components/coming-soon';

export default function ExploreAppsPage() {
    return (
        <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-12">
            <ComingSoon
                badgeText="Explore Apps"
                title="More Apps Are Coming Soon"
                description="We are expanding the Kubis ecosystem with more tools to help your team collaborate and move faster."
                etaText="New apps will roll out in stages"
                primaryAction={{
                    label: 'Back to Home',
                    href: '/',
                }}
                secondaryAction={{
                    label: 'Go to Account',
                    href: '/my-account',
                }}
            />
        </main>
    );
}
