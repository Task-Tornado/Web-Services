"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CaretSortIcon,
  CheckIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import * as z from "zod";

import type { SelectTeam } from "@task-tornado/db/schema/auth";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "~/components/ui/use-toast";
import { cn } from "~/utils";
import { api } from "~/utils/api";

const createTeamSchema = z.object({
  name: z
    .string({
      invalid_type_error: "Title must be a string",
      required_error: "Please provide a title",
    })
    .min(1, { message: "Title must be at least 1 character long" }),
  plan: z
    .enum(["free", "pro", "advanced"], {
      invalid_type_error: "Plan must be one of 'free', 'pro', or 'advanced'",
      required_error: "Please pick a plan",
    })
    .default("free"),
});

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

type TeamSwitcherProps = PopoverTriggerProps;

export function TeamSwitcher({ className }: TeamSwitcherProps) {
  const form = useForm<z.infer<typeof createTeamSchema>>({
    resolver: zodResolver(createTeamSchema),
  });
  const context = api.useContext();

  const [open, setOpen] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);
  const [teams] = api.team.byUserId.useSuspenseQuery();
  const [selectedTeam, setSelectedTeam] = React.useState<SelectTeam | null>(
    teams[0] ?? null,
  );

  const { mutateAsync: createTeam, error } = api.team.create.useMutation({
    async onSuccess() {
      setShowNewTeamDialog(false);
      await context.team.all.invalidate();
      await context.team.byUserId.invalidate();
      toast({
        title: "Team Successfully Created",
        description: "Your team has been created",
      });
    },
    onError() {
      setShowNewTeamDialog(false);
      toast({
        title: "Team Creation Failed",
        description:
          error?.data?.zodError?.fieldErrors.title ?? "Unknown error",
        variant: "destructive",
      });
    },
  });

  async function onSubmit(data: z.infer<typeof createTeamSchema>) {
    await createTeam({
      name: data.name,
      plan: data.plan,
    });
  }

  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a team"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              {selectedTeam?.image && (
                <AvatarImage
                  src={`https://avatar.vercel.sh/${selectedTeam.image}.png`}
                  alt={selectedTeam.name}
                />
              )}

              <AvatarFallback>?</AvatarFallback>
            </Avatar>
            {selectedTeam?.name}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No team found.</CommandEmpty>
              <CommandGroup heading="Teams">
                {teams.map((team: SelectTeam) => (
                  <CommandItem
                    key={team.name}
                    onSelect={() => {
                      setSelectedTeam(team);
                      setOpen(false);
                    }}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      {team.image && (
                        <AvatarImage
                          src={`https://avatar.vercel.sh/${team.image}.png`}
                          alt={team.name}
                          className="grayscale"
                        />
                      )}

                      <AvatarFallback>?</AvatarFallback>
                    </Avatar>
                    {team.name}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedTeam?.id === team.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create team</DialogTitle>
              <DialogDescription>
                Add a new team to manage products and customers.
              </DialogDescription>
            </DialogHeader>
            <div>
              <div className="space-y-4 py-2 pb-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="name">Team name</FormLabel>
                        <Input id="name" placeholder="Mac Inc." {...field} />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="plan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="plan">Subscription plan</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a plan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">
                              <span className="font-medium">Free</span> -{" "}
                              <span className="text-muted-foreground">
                                Trial for two weeks
                              </span>
                            </SelectItem>
                            <SelectItem value="pro">
                              <span className="font-medium">Pro</span> -{" "}
                              <span className="text-muted-foreground">
                                $9/month per user
                              </span>
                            </SelectItem>
                            <SelectItem value="advancd">
                              <span className="font-medium">Advanced</span> -{" "}
                              <span className="text-muted-foreground">
                                $19/month per user
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowNewTeamDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
