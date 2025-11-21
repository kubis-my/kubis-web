import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './sidebar'
import { NavigationItem, NavigationProps } from './types'

export default function Navigation({ navigation }: NavigationProps) {
    return navigation.map(nav => {
        return <NavigationGroup key={nav.id} {...nav} />
    })
}

const NavigationGroup = ({ items, props, label }: NavigationItem) => {
    return (
        <SidebarGroup {...props}>
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title} className="flex items-center gap-2">
                            <SidebarMenuButton
                                className={item.isActive ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear" : undefined}
                                tooltip={item.title}
                            >
                                {item.icon}
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                            {item.actionButton}
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
