import CompanyProvider from '@/root/components/container/company-provider';
import SwitchCompanyDialog from '@/root/components/pages/switch-company/switch-company-dialog';

export default async function layout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ companyIndex: string }>;
}>) {
    const { companyIndex } = await params;

    return (
        <CompanyProvider companyIndex={Number(companyIndex)}>
            {children}
            <SwitchCompanyDialog />
        </CompanyProvider>
    );
}
