"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  isLoading?: boolean;
}

const AnimatedNumber = ({ value }: { value: number }) => {
  const spring = useSpring(0, { stiffness: 80, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return (
    <motion.span className="text-xl font-semibold sm:text-2xl">
      {display}
    </motion.span>
  );
};

export const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  isLoading,
}: StatCardProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="transition-colors hover:bg-muted/40">
            <CardHeader className="flex flex-col gap-2 pb-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent className="space-y-1">
              {isLoading ? (
                <Skeleton className="h-6 w-20 sm:h-8 sm:w-24" />
              ) : (
                <AnimatedNumber value={value} />
              )}
              <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        </TooltipTrigger>

        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
