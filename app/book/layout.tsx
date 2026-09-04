import { BookingProvider } from "@/components/booking/booking-context";
import { Stepper } from "@/components/booking/stepper";

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-gradient-to-b from-[#f6e9fd] via-[#fbf4fe] to-[#f7ecfd]">
        <div className="mx-auto max-w-[1512px]">
          <Stepper />
          {children}
        </div>
      </div>
    </BookingProvider>
  );
}
