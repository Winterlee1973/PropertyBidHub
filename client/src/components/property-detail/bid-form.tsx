import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Property } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowDownIcon, ArrowUpIcon, ChevronDown, ChevronUp, DollarSign } from "lucide-react";
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
import { format } from "date-fns";

interface BidFormProps {
  property: Property & { 
    topBid: number | null;
    bids?: {
      id: number;
      amount: string;
      createdAt: string;
    }[];
  };
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
    mutationFn: async (amount: string) => {
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
    
    // Pass the amount as a string directly
    bidMutation.mutate(values.amount);
  };

  const handleSuggestedBidClick = (amount: number) => {
    setSuggestedAmount(amount.toString());
    form.setValue("amount", amount.toString(), { shouldValidate: true });
  };

  const suggestedBids = getSuggestedBids();

  return (
    <Card>
      <CardHeader className="border-b border-slate-100 bg-slate-900 text-white">
        <CardTitle className="flex items-center">
          <DollarSign className="h-5 w-5 mr-2 text-blue-400" />
          Trade Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pt-4">
        {/* Crypto/trading-like price display */}
        <div className="mb-4 pb-4 border-b border-slate-700">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800 p-3 rounded-md border border-slate-700 shadow-lg">
              <div className="text-slate-400 text-sm mb-1">Current Bid</div>
              <div className="flex items-center">
                <span className={`font-mono font-semibold text-2xl ${property.topBid ? 'text-blue-400' : 'text-slate-500'}`}>
                  {property.topBid ? formatPrice(property.topBid) : "No bids"}
                </span>
                {property.topBid && <ChevronUp className="h-4 w-4 ml-1 text-blue-500" />}
              </div>
            </div>
            
            <div className="bg-slate-800 p-3 rounded-md border border-slate-700 shadow-lg">
              <div className="text-slate-400 text-sm mb-1">Ask Price</div>
              <div className="flex items-center">
                <span className="font-mono text-emerald-400 font-semibold text-2xl">
                  {formatPrice(property.askingPrice)}
                </span>
                <ArrowUpIcon className="h-4 w-4 ml-1 text-emerald-500" />
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-xs">
              <span className="inline-block bg-blue-950 text-blue-300 rounded-full px-2 py-1 border border-blue-800">
                Total Bids: {property.bids?.length || 0}
              </span>
            </div>
            <div className="text-xs">
              <span className="inline-block bg-slate-700 text-slate-300 rounded-full px-2 py-1 border border-slate-600">
                Views: {property.viewCount || 0}
              </span>
            </div>
          </div>
        </div>
        
        {/* Bid History - Now comes first and is more prominent */}
        {property.bids && property.bids.length > 0 && (
          <div className="mb-6">
            <h3 className="font-medium text-blue-300 mb-3 flex items-center">
              <ChevronUp className="h-4 w-4 mr-1" /> Bid History
            </h3>
            <div className="bg-slate-800 border border-slate-700 rounded-md p-3 overflow-hidden shadow-lg">
              <div className="grid grid-cols-2 gap-2 mb-2 text-xs font-medium text-slate-400 border-b border-slate-700 pb-2">
                <div>Amount</div>
                <div className="text-right">Time</div>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-slate-700">
                {property.bids
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((bid, index) => {
                    // Parse bid amount
                    const amount = typeof bid.amount === 'string' ? parseFloat(bid.amount) : bid.amount;
                    // Get formatted time
                    const bidTime = format(new Date(bid.createdAt), "MMM d, h:mm:ss a");
                    // Add animation delay based on index
                    const animationDelay = `${index * 0.05}s`;
                    
                    return (
                      <div 
                        key={bid.id}
                        className="grid grid-cols-2 gap-2 py-1.5 px-2 text-sm border-b border-slate-700 hover:bg-slate-700 rounded-sm transition-colors animate-fadeIn"
                        style={{ animationDelay }}
                      >
                        <div className="flex items-center">
                          <DollarSign className="h-3 w-3 mr-1 text-blue-400" />
                          <span className="font-mono font-medium text-blue-200">
                            {formatPrice(amount)}
                          </span>
                        </div>
                        <div className="text-right text-xs font-mono text-slate-400">
                          {bidTime}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {user ? (
          <div className="mb-6">
            <h3 className="font-medium text-emerald-300 mb-3 flex items-center">
              <DollarSign className="h-4 w-4 mr-1" /> Place Your Bid
            </h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center">
                          <span className="text-lg mr-2 text-emerald-400">$</span>
                          <Input 
                            type="text" 
                            placeholder="Enter bid amount"
                            className="flex-1 bg-slate-800 border-slate-700 text-white font-mono placeholder:text-slate-500"
                            {...field}
                            value={suggestedAmount || field.value}
                            onChange={(e) => {
                              setSuggestedAmount("");
                              field.onChange(e);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-pink-400" />
                    </FormItem>
                  )}
                />
                
                <div className="text-xs text-slate-400">
                  <p className="mb-1">Quick bid options:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedBids.map((amount, index) => (
                      <Button
                        key={index}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="px-2 py-1 bg-slate-700 border-slate-600 text-emerald-300 hover:bg-slate-600 hover:text-emerald-200 text-xs font-mono"
                        onClick={() => handleSuggestedBidClick(amount)}
                      >
                        {formatPrice(amount)}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white border-none"
                  disabled={bidMutation.isPending}
                >
                  {bidMutation.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Bid</>
                  ) : (
                    "Place Bid Now"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-slate-800 border border-slate-700 rounded-lg text-center">
            <p className="text-slate-300 mb-3">You need to sign in to place a bid on this property.</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-500">
              <Link href="/auth">Sign In to Trade</Link>
            </Button>
          </div>
        )}

      </CardContent>
    </Card>
  );
}
