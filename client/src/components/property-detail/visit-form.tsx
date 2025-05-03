import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Loader2 } from "lucide-react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Link } from "wouter";

interface VisitFormProps {
  propertyId: number;
}

const visitFormSchema = z.object({
  visitDate: z.date({
    required_error: "Please select a date",
  }),
  visitTime: z.string({
    required_error: "Please select a time",
  }),
  phone: z.string().optional(),
  questions: z.string().optional(),
});

const timeSlots = [
  "09:00 AM", "10:00 AM", "11:00 AM", 
  "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
];

export default function VisitForm({ propertyId }: VisitFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(undefined);
  
  const form = useForm<z.infer<typeof visitFormSchema>>({
    resolver: zodResolver(visitFormSchema),
    defaultValues: {
      phone: "",
      questions: "",
    },
  });

  const visitMutation = useMutation({
    mutationFn: async (data: z.infer<typeof visitFormSchema>) => {
      // Format the date and time for the API
      const visitDate = new Date(data.visitDate);
      const [hours, minutes, period] = data.visitTime.match(/(\d+):(\d+)\s(AM|PM)/)?.slice(1) || [];
      
      let hour = parseInt(hours);
      if (period === "PM" && hour !== 12) {
        hour += 12;
      } else if (period === "AM" && hour === 12) {
        hour = 0;
      }
      
      visitDate.setHours(hour, parseInt(minutes), 0, 0);
      
      const visitData = {
        visitDate,
        phone: data.phone,
        questions: data.questions,
      };
      
      const res = await apiRequest(
        "POST", 
        `/api/properties/${propertyId}/visits`, 
        visitData
      );
      
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Visit Scheduled Successfully",
        description: "We'll contact you to confirm your appointment.",
      });
      form.reset();
      setDate(undefined);
      // Invalidate user visits query if needed
      queryClient.invalidateQueries({ queryKey: ["/api/user/visits"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Scheduling Visit",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof visitFormSchema>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to schedule a visit.",
        variant: "destructive",
      });
      return;
    }
    
    visitMutation.mutate(values);
  };

  // Disable past dates
  const disabledDates = {
    before: new Date(),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule a Visit</CardTitle>
      </CardHeader>
      <CardContent>
        {user ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="visitDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Select Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            setDate(date);
                            field.onChange(date);
                          }}
                          disabled={disabledDates}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="visitTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Time</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Phone</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="(555) 555-5555" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="questions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Any Questions?</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ask us anything about the property..." 
                        className="resize-none" 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                variant="default"
                className="w-full bg-slate-800 hover:bg-slate-700" 
                disabled={visitMutation.isPending}
              >
                {visitMutation.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</>
                ) : (
                  "Schedule Visit"
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="p-4 bg-slate-50 rounded-lg text-center">
            <p className="text-slate-600 mb-3">You need to be logged in to schedule a visit.</p>
            <Button asChild>
              <Link href="/auth">Sign In to Schedule</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
