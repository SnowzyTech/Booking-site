/*
 * Transactional e-mail, over Resend's REST API.
 *
 * Deliberately no SDK: the whole integration is one POST, Node 20 has global
 * fetch, and skipping the dependency keeps the install (and the lockfile) as
 * it is. Swapping in `resend` later only touches `send()` below.
 *
 * Everything here is best-effort and never throws at the caller. A booking that
 * is safely in the database must not be reported as failed because an e-mail
 * bounced, so `notifyNewBooking` catches its own errors and logs them.
 *
 * Configure in .env (all optional — with none of them set, sending is skipped
 * and the reason is logged, so local dev and preview deploys stay quiet):
 *   RESEND_API_KEY              from https://resend.com/api-keys
 *   BOOKING_NOTIFICATION_EMAIL  where the "new booking" alert goes
 *   EMAIL_FROM                  sender, e.g. "Nutriticare <hello@yourdomain>"
 *                               — must be on a domain verified in Resend.
 */

const ENDPOINT = "https://api.resend.com/emails";

type Mail = {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
};

function config() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  const owner = process.env.BOOKING_NOTIFICATION_EMAIL?.trim();
  return { apiKey, from, owner };
}

/** One message. Resolves to false (never throws) when unsent. */
async function send(mail: Mail): Promise<boolean> {
  const { apiKey, from } = config();

  if (!apiKey || !from) {
    console.warn(
      `[email] skipped "${mail.subject}" — set RESEND_API_KEY and EMAIL_FROM to enable sending.`
    );
    return false;
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [mail.to],
        subject: mail.subject,
        html: mail.html,
        ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
      }),
    });

    if (!res.ok) {
      // Resend puts the reason in the body; the status alone is rarely enough
      // to tell an unverified domain from a bad key.
      const body = await res.text().catch(() => "");
      console.error(`[email] "${mail.subject}" failed (${res.status})`, body);
      return false;
    }
    return true;
  } catch (e) {
    console.error(`[email] "${mail.subject}" threw`, e);
    return false;
  }
}

export type BookingEmailInput = {
  bookingId: string;
  serviceName: string;
  price?: string;
  /** Appointment instants, earliest first. A programme has several. */
  appointments: Date[];
  fullName: string;
  email: string;
  phone?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  note?: string | null;
};

/* Dates are formatted for a Nigerian reader; the slot instants are stored as
   UTC wall-clock (see toSlotInstant), so they are read back in UTC to get the
   same clock time the customer picked. */
const when = (d: Date) =>
  new Intl.DateTimeFormat("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(d);

const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c] as string
  );

function layout(heading: string, rows: [string, string][], footer: string) {
  const cells = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0e4f7;color:#6b6b6b;font-size:13px;width:170px;vertical-align:top">${escape(label)}</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0e4f7;color:#111;font-size:14px;font-weight:600">${escape(value)}</td>
        </tr>`
    )
    .join("");

  return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#faf5ff;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
  <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px">
    <tr><td>
      <h1 style="margin:0 0 20px;font-size:20px;color:#6c1e9a">${escape(heading)}</h1>
      <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">${cells}</table>
      <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#3d3d3d">${footer}</p>
    </td></tr>
  </table>
</body></html>`;
}

/*
 * Fired when a customer taps "I've Made the Payment" on /book/payment.
 *
 * Two messages: the alert to the business (the payment still has to be checked
 * against the bank by hand) and the receipt the booking page promises the
 * customer. Neither is awaited for correctness — see the note at the top.
 */
export async function notifyNewBooking(input: BookingEmailInput) {
  const { owner } = config();

  const dates = input.appointments.map(when);
  const shared: [string, string][] = [
    ["Service", input.serviceName],
    ...(input.price ? ([["Amount", input.price]] as [string, string][]) : []),
    [
      dates.length > 1 ? "Sessions" : "Appointment",
      dates.join(" · ") || "Not set",
    ],
  ];

  const tasks: Promise<boolean>[] = [];

  if (owner) {
    tasks.push(
      send({
        to: owner,
        replyTo: input.email,
        subject: `New booking — ${input.serviceName} (${input.fullName})`,
        html: layout(
          "A new booking is awaiting payment verification",
          [
            ...shared,
            ["Name", input.fullName],
            ["E-mail", input.email],
            ["Phone", input.phone || "—"],
            ["WhatsApp", input.whatsapp || "—"],
            ["Address", input.address || "—"],
            ["Note", input.note || "—"],
            ["Booking ID", input.bookingId],
          ],
          "The customer says the transfer has been sent. Confirm it against the bank, then Confirm the booking in the admin dashboard."
        ),
      })
    );
  } else {
    console.warn(
      "[email] no BOOKING_NOTIFICATION_EMAIL set — the new-booking alert was not sent."
    );
  }

  tasks.push(
    send({
      to: input.email,
      subject: `We've received your booking — ${input.serviceName}`,
      html: layout(
        `Thank you, ${input.fullName.split(" ")[0]}`,
        shared,
        "We are verifying your payment now. You will get another e-mail as soon as your appointment is confirmed. If anything looks wrong, just reply to this message."
      ),
    })
  );

  await Promise.all(tasks);
}
