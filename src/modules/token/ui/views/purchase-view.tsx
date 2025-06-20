"use client";
import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import React from "react";
import PricingCard from "../components/pricingCard";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import Script from "next/script";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

async function createOrderId() {
  try {
    const response = await axios.post("/api/razorpay/createOrder");
    console.log("Order Response:", response.data);
    return response.data.orderId;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create order");
  }
}

export default function PurchaseView() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const trpc = useTRPC();
  const { data } = authClient.useSession();
  const { data: products } = useSuspenseQuery(
    trpc.token.getProducts.queryOptions()
  );

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const orderId: string = await createOrderId();
      const options = {
        key: "rzp_test_tIbYHWCxA0tVMm",
        amount: 200 * 100,
        currency: "INR",
        name: "YOUR_COMPANY_NAME", // Replace with dynamic company name
        description: "Payment for your order", // Replace with dynamic order description
        order_id: orderId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async function (response: any) {
          try {
            const paymentResponse = await axios.post(
              "/api/razorpay/verifyOrder",
              {
                razorpay_order_id: orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            toast("Payment Successful!");
            router.push("/model");
            queryClient.invalidateQueries(trpc.token.getTokens.queryOptions());
            console.log(paymentResponse.data);
          } catch (error) {
            toast("Payment verification failed. Please contact support.");
            console.error(error);
          }
        },
        prefill: {
          name: data?.user.name, // Replace with dynamic user data
          email: data?.user.email, // Replace with dynamic user data
        },
        theme: {
          color: "#3399cc",
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const razorpay = new (window as any).Razorpay(options);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      razorpay.on("payment.failed", function (response: any) {
        toast("Payment failed");
        console.error(response.error);
      });
      razorpay.open();
    } catch (error) {
      toast("Payment failed. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const timzeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log(timzeZone);
  if (timzeZone === "Asia/Calcutta") {
    return (
      <>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200">
                Choose your plan
              </Badge>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                No Frills. Just your imagination
              </h3>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Get unlimited access to our AI transformation technology with
                our simple pricing options.
              </p>
            </div>

            <Card className="bg-white border-0 shadow-lg max-w-md mx-auto">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200">
                    One-time Purchase
                  </Badge>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">
                    200 Tokens
                  </h4>
                  <div className="text-4xl font-bold text-amber-600 mb-2">
                    &#8377;200
                  </div>
                  <p className="text-slate-600 text-sm">
                    No subscriptions. 10 unique images from your personal
                    AI model
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {[
                    "Train your Model (170 tokens per model)",
                    "10 high-quality cartoon transformations (3 tokens per image)",
                    "Download in full resolution",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-amber-600" />
                      </div>
                      <span className="text-slate-600 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  onClick={handlePayment}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Buy Now"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <Script
          id="razorpay-checkout-js"
          src="https://checkout.razorpay.com/v1/checkout.js"
        />
      </>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200">
            Choose your plan
          </Badge>
          <h3 className="text-3xl font-bold text-slate-900 mb-4">
            No Frills. Just your imagination
          </h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get unlimited access to our AI transformation technology with our
            simple pricing options.
          </p>
        </div>
        <div className="grid grid-cols-1  ">
          {products.map((product) => {
            console.log(product.prices)
            const onClick = () => {
              authClient.checkout({ products: [product.id] });
              queryClient.invalidateQueries(
                trpc.token.getTokens.queryOptions()
              );
              router.push("/model");
            };
            return (
              <PricingCard
                key={product.id}
                onClick={onClick}
                title={product.name}
                price={
                  product.prices[0].amountType === "fixed"
                    ? product.prices[0].priceAmount / 100
                    : 0
                }
                description={product.description}
                features={product.benefits.map((benift) => benift.description)}
                badge={product.metadata.badge as string}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

export const PurchaseViewLoadingState = () => {
  return (
    <LoadingState title="Loading" description="Thsi may take a few seconds" />
  );
};

export const PurcahseiewErrorState = () => {
  return <ErrorState title="Error " description="Please try again later" />;
};
