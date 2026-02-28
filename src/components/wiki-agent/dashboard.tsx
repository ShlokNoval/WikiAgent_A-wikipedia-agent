"use client"

import React from 'react'
import { AppSidebar } from "./app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from "@/components/ui/menubar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, Menu, ShieldAlert } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

import ChatContainer from "@/components/wiki-agent/chat-container"
import { SettingsTab } from "@/components/wiki-agent/settings-tab"
import { useChat } from "./chat-context"

export function Dashboard() {
    const { clearChat } = useChat();

    return (
        <div className="flex h-screen overflow-hidden w-full bg-slate-50">
            <AppSidebar />
            <SidebarInset className="flex w-full flex-col overflow-hidden bg-transparent">
                <header className="flex h-14 shrink-0 items-center justify-between border-b bg-white px-4 transition-all">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <div className="w-px h-4 bg-border mx-2" />
                        <Menubar className="border-none shadow-none bg-transparent">
                            <MenubarMenu>
                                <MenubarTrigger className="cursor-pointer">File</MenubarTrigger>
                                <MenubarContent>
                                    <MenubarItem onClick={() => clearChat()}>New Chat <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
                                    <MenubarItem>Save Session</MenubarItem>
                                    <MenubarSeparator />
                                    <MenubarItem>Print</MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                            <MenubarMenu>
                                <MenubarTrigger className="cursor-pointer">Edit</MenubarTrigger>
                                <MenubarContent>
                                    <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
                                    <MenubarItem>Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut></MenubarItem>
                                    <MenubarSeparator />
                                    <MenubarItem>Preferences</MenubarItem>
                                </MenubarContent>
                            </MenubarMenu>
                        </Menubar>
                    </div>

                    {/* Mobile Sheet Nav */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <SheetHeader>
                                    <SheetTitle>WikiAgent Mobile</SheetTitle>
                                    <SheetDescription>
                                        Quick navigation for mobile users.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="py-4 flex flex-col gap-2">
                                    <Button variant="outline" className="w-full justify-start" onClick={() => clearChat()}>New Chat</Button>
                                    <Button variant="outline" className="w-full justify-start">History</Button>
                                    <Button variant="outline" className="w-full justify-start">Settings</Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </header>

                <main className="flex-1 w-full p-4 overflow-y-auto">
                    <div className="mx-auto w-full max-w-6xl space-y-4">

                        <Alert variant="default" className="bg-sky-50 text-sky-900 border-sky-200">
                            <ShieldAlert className="h-4 w-4 text-sky-600" />
                            <AlertTitle>AI Hallucination Notice</AlertTitle>
                            <AlertDescription>
                                WikiAgent may occasionally generate inaccurate information. Please verify important facts using the attached Wikipedia sources.
                            </AlertDescription>
                        </Alert>

                        <Tabs defaultValue="chat" className="w-full">
                            <div className="flex w-full items-center justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold tracking-tight text-slate-800">Workspace</h1>
                                    <p className="text-sm text-slate-500">Manage your AI interactions and preferences.</p>
                                </div>
                                <TabsList>
                                    <TabsTrigger value="chat">Chat</TabsTrigger>
                                    <TabsTrigger value="settings" id="settings-tab">Settings</TabsTrigger>
                                </TabsList>
                            </div>

                            <TabsContent value="chat" className="m-0 border-none p-0 outline-none">
                                <ChatContainer />
                            </TabsContent>



                            <TabsContent value="settings" className="m-0 border-none p-0 outline-none">
                                <SettingsTab />
                            </TabsContent>

                        </Tabs>
                    </div>
                </main>
            </SidebarInset>
        </div>
    )
}
