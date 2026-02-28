"use client"

import * as React from "react"
import {
    BookOpen,
    Bot,
    History,
    Settings2,
    SquareTerminal,
    LifeBuoy,
    Send,
    ChevronRight
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    SidebarSeparator
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Skeleton } from "@/components/ui/skeleton"
import { useChat } from "./chat-context"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { queries, clearChat, setInput } = useChat();

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Bot className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">WikiAgent</span>
                                    <span className="">v2.0.0</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Features</SidebarGroupLabel>
                    <SidebarMenu>
                        <Collapsible asChild defaultOpen className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip="Chat">
                                        <SquareTerminal />
                                        <span>Chat Intelligence</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        <SidebarMenuSubItem>
                                            <SidebarMenuSubButton isActive onClick={() => clearChat()}>
                                                <span>New Chat</span>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>


                    </SidebarMenu>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel>Recent History</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <div className="flex flex-col gap-2 mt-2 px-2 overflow-y-auto max-h-[300px]">
                            {queries.length === 0 ? (
                                <span className="text-xs text-slate-500 italic">No recent history</span>
                            ) : (
                                queries.slice(0, 10).map((q) => (
                                    <div
                                        key={q.id}
                                        onClick={() => setInput(q.query)}
                                        className="text-sm truncate text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/50 px-2 py-1 rounded transition-colors"
                                        title={q.query}
                                    >
                                        {q.query}
                                    </div>
                                ))
                            )}
                        </div>
                    </SidebarGroupContent>
                </SidebarGroup>

            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size="lg">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src="" alt="User" />
                                        <AvatarFallback className="rounded-lg">US</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-0.5 leading-none">
                                        <span className="font-semibold">User</span>
                                        <span className="text-xs text-muted-foreground">user@example.com</span>
                                    </div>
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[--radix-dropdown-menu-trigger-width]">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Profile</DropdownMenuItem>
                                <DropdownMenuItem>Billing</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Log out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
