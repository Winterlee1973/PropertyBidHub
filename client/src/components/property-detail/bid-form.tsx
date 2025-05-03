import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Property } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BellRing } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";

interface BidFormProps {
  property: Property & { topBid: number | null };
}

const bidFormSchema = z.object({
  amount: z.string().refine(
    (val) => {
      const amount = Number(val);
      return !isNaN(amount) && amount > 0;
    },
    { message: "Please enter a valid bid amount" }
  ),
});

export default function BidForm({ property }: BidFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [suggestedAmount, setSuggestedAmount] = useState<string>("");

  // Calculate auction progress
  const startDate = new Date(property.createdAt);
  const endDate = new Date(property.endDate);
  const today = new Date();
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = today.getTime() - startDate.getTime();
  const progressPercentage = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  
  // Format remaining time
  const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const hoursLeft = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60)) % 24);
  
  // Format currency
  const formatPrice = (price: number | string) => {
    if (typeof price === 'string') {
      price = parseFloat(price);
    }
    return price.toLocaleString('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    });
  };

  // Calculate suggested bid amounts
  const getSuggestedBids = () => {
    const askingPrice = Number(property.askingPrice);
    const currentTopBid = property.topBid ? Number(property.topBid) : askingPrice;
    const baseBid = Math.max(askingPrice, currentTopBid);
    
    return [
      baseBid + (baseBid * 0.01), // 1% increment
      baseBid + (baseBid * 0.02), // 2% increment
      baseBid + (baseBid * 0.05), // 5% increment
    ].map(amount => Math.ceil(amount / 1000) * 1000); // Round up to nearest thousand
  };
  
  const form = useForm<z.infer<typeof bidFormSchema>>({
    resolver: zodResolver(bidFormSchema),
    defaultValues: {
      amount: "",
    },
  });

  const bidMutation = useMutation({
    mutationFn: async (amount: number) => {
      const res = await apiRequest(
        "POST", 
        `/api/properties/${property.id}/bids`, 
        { amount }
      );
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Bid Placed Successfully",
        description: `Your bid of ${formatPrice(Number(form.getValues().amount))} has been placed.`,
      });
      // Reset form
      form.reset();
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: [`/api/properties/${property.id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error Placing Bid",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof bidFormSchema>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to place a bid.",
        variant: "destructive",
      });
      return;
    }
    
    const amount = Number(values.amount);
    bidMutation.mutate(amount);
  };

  const handleSuggestedBidClick = (amount: number) => {
    setSuggestedAmount(amount.toString());
    form.setValue("amount", amount.toString(), { shouldValidate: true });
  };

  const suggestedBids = getSuggestedBids();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bid Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500">Asking Price</span>
            <span className="text-primary font-semibold text-2xl">
              {formatPrice(property.askingPrice)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Current Top Bid</span>
            <span className="text-accent font-semibold text-xl">
              {property.topBid 
                ? formatPrice(property.topBid) 
                : "No bids yet"}
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-slate-500">Auction ends in</span>
            <span className="text-sm font-medium text-slate-800">
              {daysLeft} {daysLeft === 1 ? 'day' : 'days'}, {hoursLeft} {hoursLeft === 1 ? 'hour' : 'hours'}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        {user ? (
          <div className="mb-6">
            <h3 className="font-medium text-slate-800 mb-2">Place Your Bid</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center">
                          <span className="text-lg mr-2">$</span>
                          <Input 
                            type="text" 
                            placeholder="Enter bid amount"
                            className="flex-1"
                            {...field}
                            value={suggestedAmount || field.value}
                            onChange={(e) => {
                              setSuggestedAmount("");
                              field.onChange(e);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="text-xs text-slate-500">
                  <p className="mb-1">Suggested bids:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedBids.map((amount, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-xs"
                        onClick={() => handleSuggestedBidClick(amount)}
                      >
                        {formatPrice(amount)}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full py-3" 
                  disabled={bidMutation.isPending}
                >
                  {bidMutation.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</>
                  ) : (
                    "Place Bid"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg text-center">
            <p className="text-slate-600 mb-3">You need to be logged in to place a bid.</p>
            <Button asChild>
              <Link href="/auth">Sign In to Bid</Link>
            </Button>
          </div>
        )}
        
        <div className="text-center">
          <Button 
            variant="link" 
            className="text-primary font-medium flex items-center justify-center w-full"
          >
            <BellRing className="mr-2 h-4 w-4" /> Set Alert for Price Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
