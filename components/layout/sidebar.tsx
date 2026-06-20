'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import {
	Activity01Icon,
	ArrowDown01Icon,
	DashboardSquare01Icon,
	KanbanIcon,
	Search01Icon,
} from '@hugeicons/core-free-icons';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Sidebar as SidebarRoot,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';

type NavItem = {
	href: string;
	label: string;
	icon: IconSvgElement;
};

const navItems: NavItem[] = [
	{ href: '/traces', label: 'Traces', icon: Activity01Icon },
	{ href: '/issues', label: 'Issues', icon: KanbanIcon },
	{ href: '/dashboard', label: 'Dashboard', icon: DashboardSquare01Icon },
];

export function AppSidebar() {
	const pathname = usePathname();

	return (
		<SidebarRoot variant='inset'>
			<SidebarHeader>
				<div className='flex items-center gap-1 px-1 py-1'>
					<DropdownMenu>
						<DropdownMenuTrigger className='flex min-w-0 flex-1 items-center gap-1.5 rounded-md px-1.5 py-1 hover:bg-sidebar-accent'>
							<div className='flex size-5 shrink-0 items-center justify-center rounded-md bg-primary text-[10px] font-medium text-primary-foreground'>
								N
							</div>
							<span className='truncate text-sm font-medium text-sidebar-foreground'>NeoSigma</span>
							<HugeiconsIcon
								icon={ArrowDown01Icon}
								strokeWidth={1.5}
								className='ml-auto size-2.5 text-sidebar-foreground/60'
							/>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='start'>
							<DropdownMenuItem render={<Link href='/design-system' />}>
								Design system
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Link
						href='/traces'
						aria-label='Search traces'
						className='flex size-6 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent'
					>
						<HugeiconsIcon
							icon={Search01Icon}
							strokeWidth={1.5}
							className='size-3.5'
						/>
					</Link>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems.map((item) => {
								const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
								return (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton
											render={<Link href={item.href} />}
											isActive={active}
											tooltip={item.label}
										>
											<HugeiconsIcon
												icon={item.icon}
												strokeWidth={1.5}
											/>
											<span>{item.label}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</SidebarRoot>
	);
}
