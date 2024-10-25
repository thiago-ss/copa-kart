'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StepperProps {
  steps: string[];
  activeStep: number;
}

export function Stepper({ steps, activeStep }: StepperProps) {
  return (
    <div className="relative mb-12">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center relative">
              <div className="flex items-center justify-center h-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium',
                    'shadow-lg transition-all duration-300 ease-in-out z-10',
                    index <= activeStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {index + 1}
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 + 0.2, duration: 0.5 }}
                className={cn(
                  'mt-2 text-sm font-medium',
                  index <= activeStep ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {step}
              </motion.div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 flex items-center">
                <div className="w-full mx-5 mb-5 bg-muted h-1 rounded">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: index < activeStep ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-primary rounded"
                  />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
