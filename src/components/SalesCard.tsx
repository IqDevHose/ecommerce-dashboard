import { SalesProps } from "@/utils/type";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";

export default function SalesCard({ name, email, salesAmount, image }: SalesProps) {
  return (
    <div className="flex flex-wrap justify-between gap-3">
      <section className="flex justify-between gap-3">
        <Avatar className="w-10 h-10">
          {image ? (
            <AvatarImage src={image} alt={name} />
          ) : (
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          )}
        </Avatar>
        


        {/* Name and Email */}
        <div className="text-sm">
          <p>{name}</p>
          <div className="text-ellipsis overflow-hidden whitespace-nowrap w-[120px] sm:w-auto text-gray-400">
            {email}
          </div>
        </div>
      </section>

      {/* Sales Amount */}
      <p className="text-green-700">$ {salesAmount}</p>
    </div>
  );
}
