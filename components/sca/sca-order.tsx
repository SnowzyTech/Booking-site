"use client";

import * as React from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Building2, CreditCard, Loader2, X } from "lucide-react";

import { startScaPaystack } from "@/lib/sca-actions";
import { SCA_PRICE_LABEL } from "@/lib/sca";
import { bank, whatsappLink } from "@/lib/site";

/*
 * The Sugar Control Accelerator order widget, mounted in the /sca `#order`
 * section. Two ways to pay, neither of which writes anything to our database:
 *
 *   - Pay with Paystack: reveals a single e-mail field (Paystack needs one to
 *     issue a receipt), then hands the browser to Paystack's hosted checkout.
 *     On success Paystack returns the buyer to /sca/thank-you.
 *   - Manually Pay: opens a modal with the bank account, then a WhatsApp link so
 *     the buyer can send proof of the transfer.
 */
export function ScaOrder() {
  const [payingByCard, setPayingByCard] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [bankOpen, setBankOpen] = React.useState(false);

  async function continueToPaystack() {
    setPending(true);
    setError(null);
    const res = await startScaPaystack(email);
    if (res.ok) {
      window.location.href = res.authorizationUrl;
    } else {
      setPending(false);
      setError(res.error);
    }
  }

  return (
    <div className="sca-order">
      {!payingByCard ? (
        <button type="button" className="sca-btn" onClick={() => setPayingByCard(true)}>
          <CreditCard className="size-5" strokeWidth={2} />
          Pay with Paystack
        </button>
      ) : (
        <div className="sca-panel">
          <label className="sca-panel-label" htmlFor="sca-email">
            Enter your e-mail to pay with Paystack
          </label>
          <input
            id="sca-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className="sca-field"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && email.trim() && !pending) continueToPaystack();
            }}
          />
          <button
            type="button"
            className="sca-btn"
            disabled={!email.trim() || pending}
            onClick={continueToPaystack}
          >
            {pending && <Loader2 className="size-5 animate-spin" />}
            Continue to payment · {SCA_PRICE_LABEL}
          </button>
          {error && <p className="sca-error">{error}</p>}
          <p className="sca-note">
            You&rsquo;ll be redirected to Paystack&rsquo;s secure checkout to pay
            by card.
          </p>
        </div>
      )}

      <button
        type="button"
        className="sca-btn sca-btn--outline"
        onClick={() => setBankOpen(true)}
      >
        <Building2 className="size-5" strokeWidth={2} />
        Pay by Bank Transfer
      </button>

      <BankTransferDialog open={bankOpen} onOpenChange={setBankOpen} />
    </div>
  );
}

function BankTransferDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const rows = [
    ["Account Number", bank.accountNumber],
    ["Account Name", bank.accountName],
    ["Bank", bank.bank],
  ] as const;

  const waHref = whatsappLink(
    `Hello, I've paid ${SCA_PRICE_LABEL} for the Sugar Control Accelerator. Here's my proof of payment.`
  );

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="sca-modal-overlay" />
        <DialogPrimitive.Content className="sca-modal">
          <DialogPrimitive.Title className="sca-modal-title">
            Transfer to this account
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sca-modal-desc">
            Send {SCA_PRICE_LABEL} to the account below, then tap the WhatsApp
            button to send us your proof of payment so we can get you started.
          </DialogPrimitive.Description>

          <DialogPrimitive.Close aria-label="Close" className="sca-modal-close">
            <X className="size-5" strokeWidth={1.75} />
          </DialogPrimitive.Close>

          <dl className="sca-acct">
            {rows.map(([label, value]) => (
              <div key={label} className="sca-acct-row">
                <dt className="sca-acct-label">{label}</dt>
                <dd className="sca-acct-value">{value}</dd>
              </div>
            ))}
          </dl>

          <a className="sca-wa" href={waHref} target="_blank" rel="noopener noreferrer">
            I&rsquo;ve paid — send proof on WhatsApp
          </a>
          <p className="sca-modal-foot">
            Only tap this once the transfer has gone through.
          </p>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
