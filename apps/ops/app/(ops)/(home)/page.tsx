import HomeContainer from '@/root/components/pages/home/home-container';

export default function page() {
    return (
        <HomeContainer>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold">Welcome to Kubis Ops</h1>
            </div>
        </HomeContainer>
    );
}
