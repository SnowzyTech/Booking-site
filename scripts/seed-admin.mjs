import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const TAG = "seed-admin@example.com"; // marker email prefix for cleanup

// UTC-wall-clock instants (matches how the app stores slots).
const utc = (y, mo, d, h) => new Date(Date.UTC(y, mo, d, h, 0, 0));

async function clean() {
  await prisma.client.deleteMany({ where: { email: { contains: "seed-admin" } } });
}

async function main() {
  if (process.argv.includes("--clean")) {
    await clean();
    console.log("seed cleaned");
    return;
  }
  await clean();

  // 1) Pending one-off consultation.
  await prisma.booking.create({
    data: {
      client: { create: { fullName: "Yusuf Mohammed", email: "yusuf.seed-admin@example.com", whatsapp: "+234 801 234 5678", phone: "+234 701 345 6789", address: "14 Allen Avenue, Ikeja, Lagos" } },
      serviceSlug: "individual-consultation", serviceName: "Individual Health & Nutrition Consultation",
      kind: "ONE_OFF", flow: "SCHEDULED", status: "PENDING", paymentStatus: "NOTIFIED",
      appointments: { create: [{ position: 0, scheduledAt: utc(2026, 8, 1, 11) }] },
    },
  });

  // 2) Pending meal-plan programme (WEEK 1/2/4/6).
  const start = utc(2026, 8, 1, 11);
  await prisma.booking.create({
    data: {
      client: { create: { fullName: "Elizabeth Ifeoluwa", email: "eliz.seed-admin@example.com", whatsapp: "+234 801 234 5678", phone: "+234 701 345 6789", address: "14 Allen Avenue, Ikeja, Lagos" } },
      serviceSlug: "personalized-meal-plans", serviceName: "Personalized Meal Plans",
      kind: "PROGRAMME", flow: "SCHEDULED", status: "PENDING", paymentStatus: "NOTIFIED",
      deliverables: ["Personalized Meal Plan", "Daily Blood Sugar Tracking Sheet"],
      appointments: {
        create: [1, 2, 4, 6].map((w, i) => ({
          position: i, label: `WEEK ${w}`,
          title: ["Initial Consultation", "Meal Plan Guide & Q&A Session", "Two-Week Follow up", "One Month Follow up"][i],
          scheduledAt: new Date(start.getTime() + (w - 1) * WEEK_MS),
        })),
      },
    },
  });

  // 3) Confirmed meal-plan, week 1 already DONE (progress + yellow/none badge).
  await prisma.booking.create({
    data: {
      client: { create: { fullName: "David Obi", email: "david.seed-admin@example.com", whatsapp: "+234 801 234 5678", phone: "+234 701 345 6789", address: "14 Allen Avenue, Ikeja, Lagos" } },
      serviceSlug: "personalized-meal-plans", serviceName: "Personalized Meal Plans",
      kind: "PROGRAMME", flow: "SCHEDULED", status: "CONFIRMED", paymentStatus: "VERIFIED",
      deliverables: ["Personalized Meal Plan", "Daily Blood Sugar Tracking Sheet"],
      appointments: {
        create: [1, 2, 4, 6].map((w, i) => ({
          position: i, label: `WEEK ${w}`,
          state: i === 0 ? "DONE" : "UPCOMING",
          scheduledAt: new Date(utc(2026, 9, 6, 11).getTime() + (w - 1) * WEEK_MS),
        })),
      },
    },
  });

  console.log("seeded 3 bookings");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
