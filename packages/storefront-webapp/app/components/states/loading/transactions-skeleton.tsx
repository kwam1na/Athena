import { Skeleton } from '@/components/ui/skeleton';

const TransactionsSkeleton = () => {
   return (
      <div className="flex flex-col gap-8 justify-between w-full pr-6">
         <div className="flex flex-col gap-4">
            <Skeleton className="w-[280px] h-[32px]" />
            <Skeleton className="w-[320px] h-[24px]" />
         </div>
         <div className="flex justify-between w-full">
            <Skeleton className="w-[33%] h-[160px]" />
            <Skeleton className="w-[33%] h-[160px]" />
            <Skeleton className="w-[33%] h-[160px]" />
         </div>

         <div className="flex flex-row gap-4">
            <Skeleton className="w-[50%] h-[160px]" />
            <Skeleton className="w-[50%] h-[160px]" />
         </div>

         <Skeleton className="w-full h-[300px]" />
      </div>
   );
};

export default TransactionsSkeleton;
