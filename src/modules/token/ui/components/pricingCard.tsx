import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import React from "react";

interface PricingCardProps {
  price: number;
  features: string[];
  bage: string;
  title: string;
  description: string | null;
  onClick: () => void;
}
export default function PricingCard({
  price,
  bage,
  features,
  title,
  description,
  onClick,
}: PricingCardProps) {
  return (
    <Card className="bg-white border-0 shadow-lg max-w-md mx-auto">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <Badge className="mb-4 bg-amber-100 text-amber-800 border-amber-200">
            {bage}
          </Badge>
          <h4 className="text-2xl font-bold text-slate-900 mb-2">{title}</h4>
          <div className="text-4xl font-bold text-amber-600 mb-2">
            {Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            }).format(price)}
          </div>
          <p className="text-slate-600 text-sm">{description}</p>
        </div>

        <div className="space-y-3 mb-8">
          {features.map((feature, index) => (
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
          onClick={onClick}
        >
          Buy this credits
        </Button>
      </CardContent>
    </Card>
  );
}
