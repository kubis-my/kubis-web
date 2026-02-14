'use client';

import { CurrentDeviceCard } from '@/root/components/pages/your-device/current-device-card';
import { TotalDevicesCard } from '@/root/components/pages/your-device/total-devices-card';
import { SecurityStatusCard } from '@/root/components/pages/your-device/security-status-card';
import DeviceTable from '@/root/components/pages/your-device/device-table';
import YourDeviceContainer from '@/root/components/pages/your-device/your-device-container';

export default function page() {
    return (
        <YourDeviceContainer>
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <CurrentDeviceCard />
                    <TotalDevicesCard />
                    <SecurityStatusCard />
                </div>
                <div className="mt-2">
                    <DeviceTable />
                </div>
            </div>
        </YourDeviceContainer>
    );
}
