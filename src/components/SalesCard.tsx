export type SalesProps = {
  name: string;
  email: string;
  salesAmount: string;
};

export default function SalesCard({ name, email, salesAmount }: SalesProps) {
  return (
    <div className="flex flex-wrap justify-between gap-3">
      <section className="flex justify-between gap-3">
        {/* Avatar */}
        <div className="h-12 w-12 rounded-full bg-gray-100 p-1">
          <img
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${name}`}
            alt={`${name}'s avatar`}
            width={200}
            height={200}
          />
        </div>

        {/* Name and Email */}
        <div className="text-sm">
          <p>{name}</p>
          <div className="text-ellipsis overflow-hidden whitespace-nowrap w-[120px] sm:w-auto text-gray-400">
            {email}
          </div>
        </div>
      </section>

      {/* Sales Amount */}
      <p>{salesAmount}</p>
    </div>
  );
}
