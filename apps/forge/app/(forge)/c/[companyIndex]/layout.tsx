import CompanyProvider from '@/root/components/container/company-provider';

export default async function layout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ companyIndex: string }>;
}>) {
    const { companyIndex } = await params;

    return <CompanyProvider companyIndex={Number(companyIndex)}>{children}</CompanyProvider>;
}
