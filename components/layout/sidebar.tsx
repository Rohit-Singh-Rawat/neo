'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react';
import {
	Activity01Icon,
	ArrowDown01Icon,
	DashboardCircleIcon,
	KanbanIcon,
	ExclamationMarkBigIcon,
	Megaphone01Icon,
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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCommandPalette } from '@/components/command-palette/command-palette-provider';

import { useState } from 'react';

type NavItem = {
	href: string;
	label: string;
	icon: IconSvgElement;
};

const navItems: NavItem[] = [
	{ href: '/dashboard', label: 'Dashboard', icon: DashboardCircleIcon },
	{ href: '/traces', label: 'Traces', icon: Activity01Icon },
	{ href: '/alerts', label: 'Alerts', icon: Megaphone01Icon },
	{ href: '/issues', label: 'Issues', icon: ExclamationMarkBigIcon },
];

const WORKSPACES = [
	{ id: "neo", name: "Neo", icon: DashboardCircleIcon, color: "text-primary" },
	{ id: "agentation", name: "Agentation", icon: Activity01Icon, color: "text-blue-600 dark:text-blue-500" },
	{ id: "vercel", name: "Vercel", icon: KanbanIcon, color: "text-stone-900 dark:text-stone-100" },
];

function CommandPaletteTrigger() {
	const { setOpen } = useCommandPalette();
	return (
		<Tooltip>
			<TooltipTrigger
				onClick={() => setOpen(true)}
				className='flex size-6 shrink-0 items-center justify-center rounded-md text-sidebar-foreground/70 hover:bg-sidebar-accent'
				aria-label='Search'
			>
				<HugeiconsIcon icon={Search01Icon} strokeWidth={1.5} className='size-3.5' />
			</TooltipTrigger>
			<TooltipContent side='right' align='center'>
				Search <kbd className='ml-1 text-[10px] text-muted-foreground'>⌘K</kbd>
			</TooltipContent>
		</Tooltip>
	);
}

export function AppSidebar() {
	const pathname = usePathname();
	const [activeWorkspace, setActiveWorkspace] = useState(WORKSPACES[0]);

	return (
		<SidebarRoot variant='inset'>
			<SidebarHeader>
				<div className='flex items-center gap-1 px-1 py-1'>
					<DropdownMenu>
						<DropdownMenuTrigger className='flex min-w-0 flex-1 items-center gap-2 rounded-md px-1.5 py-1.5 hover:bg-sidebar-accent outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors'>
							<HugeiconsIcon icon={activeWorkspace.icon} size={16} className={cn("shrink-0", activeWorkspace.color)} />
							<span className='truncate text-sm font-medium text-sidebar-foreground'>{activeWorkspace.name}</span>
							<HugeiconsIcon
								icon={ArrowDown01Icon}
								strokeWidth={1.5}
								className='ml-auto size-2.5 text-sidebar-foreground/60'
							/>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='start' className="w-[200px]">
							{WORKSPACES.map((workspace) => (
								<DropdownMenuItem 
									key={workspace.id} 
									onClick={() => setActiveWorkspace(workspace)} 
									className="gap-2 cursor-pointer py-2"
								>
									<HugeiconsIcon icon={workspace.icon} size={16} className={cn("shrink-0", workspace.color)} />
									<span className="font-medium">{workspace.name}</span>
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
					<CommandPaletteTrigger />
				</div>
			</SidebarHeader>
			<SidebarContent>
				<nav aria-label="Primary">
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
				</nav>
			</SidebarContent>
		</SidebarRoot>
	);
}
