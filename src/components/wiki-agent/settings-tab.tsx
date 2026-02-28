"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"

export function SettingsTab() {
    const { toast } = useToast()
    const form = useForm({
        defaultValues: {
            username: "WikiExplorer",
            safeMode: true,
        }
    })

    function onSubmit() {
        toast({
            title: "Preferences saved",
            description: "Your settings have been correctly updated in the system.",
        })
    }

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 pb-10">
            <Card>
                <CardHeader>
                    <CardTitle>User Preferences</CardTitle>
                    <CardDescription>Manage how WikiAgent searches and formats responses.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Text fields */}
                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Display Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your name" {...field} />
                                                </FormControl>
                                                <FormDescription>This is your public display name.</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Select Dropdown */}
                                    <div className="space-y-2 pt-2">
                                        <Label>Language Preference</Label>
                                        <Select defaultValue="en">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a language" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="es">Spanish</SelectItem>
                                                <SelectItem value="fr">French</SelectItem>
                                                <SelectItem value="de">German</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Toggles and Sliders */}
                                <div className="space-y-6 bg-slate-50 p-4 rounded-lg border">

                                    <FormField
                                        control={form.control}
                                        name="safeMode"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-white">
                                                <div className="space-y-0.5">
                                                    <FormLabel>Strict Safe Mode</FormLabel>
                                                    <FormDescription>Filter out NSFW or unverified Wikipedia claims.</FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="space-y-3">
                                        <Label>Theme Selection</Label>
                                        <RadioGroup defaultValue="light" className="flex flex-col space-y-1">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="light" id="r1" />
                                                <Label htmlFor="r1">Light</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="dark" id="r2" />
                                                <Label htmlFor="r2">Dark (Coming Soon)</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div className="space-y-3 pt-2 border-t">
                                        <Label className="flex justify-between">
                                            <span>Response Length Limit</span>
                                            <span className="text-muted-foreground w-12 text-right">300w</span>
                                        </Label>
                                        <Slider defaultValue={[50]} max={100} step={1} />
                                        <p className="text-xs text-muted-foreground">Limit the AI response length.</p>
                                    </div>

                                    <div className="space-y-3 pt-2 border-t">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox id="terms" defaultChecked />
                                            <label
                                                htmlFor="terms"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Enable anonymous usage statistics
                                            </label>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Date pickers */}
                            <div className="space-y-2 pt-2 border-t mt-6">
                                <Label>History Retention Date</Label>
                                <p className="text-sm text-muted-foreground mb-2">Automatically delete chat history older than this date.</p>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal",
                                                "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            <span>Pick a date</span>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t bg-slate-50/50 p-4">
                    <Button variant="outline">Reset</Button>
                    <Button onClick={onSubmit}>Save Settings</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
